# CADemy AI Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 18+
- Python 3.11+
- 8GB RAM minimum
- 20GB disk space

## Quick Start (Local Development)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd CademyAI
npm install
cd backend && npm install && cd ..
```

### 2. Start Kestra

```bash
# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: "3.8"

services:
  kestra:
    image: kestra/kestra:latest
    ports:
      - "8080:8080"
    environment:
      KESTRA_CONFIGURATION: |
        datasources:
          postgres:
            url: jdbc:postgresql://postgres:5432/kestra
            username: kestra
            password: kestra
        kestra:
          server:
            basic-auth:
              enabled: false
          repository:
            type: postgres
          queue:
            type: postgres
    depends_on:
      - postgres
    volumes:
      - ./kestra-workflows:/app/workflows
      - kestra-data:/app/storage

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: kestra
      POSTGRES_USER: kestra
      POSTGRES_PASSWORD: kestra
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  kestra-data:
  postgres-data:
EOF

docker-compose up -d
```

### 3. Deploy Workflows to Kestra

```bash
# Upload workflows
for workflow in kestra-workflows/*.yaml; do
  curl -X POST http://localhost:8080/api/v1/flows \
    -H "Content-Type: application/x-yaml" \
    --data-binary @"$workflow"
done
```

### 4. Start Backend

```bash
cd backend
cat > .env << 'EOF'
PORT=3001
KESTRA_URL=http://localhost:8080
OUMI_API_KEY=your_key_here
EOF

npm start
```

### 5. Start Frontend

```bash
cat > .env << 'EOF'
VITE_BACKEND_URL=http://localhost:3001
EOF

npm run dev
```

### 6. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Kestra UI: http://localhost:8080

## Production Deployment

### Option 1: Docker Compose (Simple)

```bash
# Create production docker-compose
cat > docker-compose.prod.yml << 'EOF'
version: "3.8"

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    environment:
      - VITE_BACKEND_URL=http://backend:3001

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - KESTRA_URL=http://kestra:8080
      - OUMI_API_KEY=${OUMI_API_KEY}
    depends_on:
      - kestra

  kestra:
    image: kestra/kestra:latest
    ports:
      - "8080:8080"
    environment:
      KESTRA_CONFIGURATION: |
        datasources:
          postgres:
            url: jdbc:postgresql://postgres:5432/kestra
            username: kestra
            password: ${DB_PASSWORD}
        kestra:
          server:
            basic-auth:
              enabled: true
              username: ${KESTRA_USER}
              password: ${KESTRA_PASSWORD}
    depends_on:
      - postgres
    volumes:
      - ./kestra-workflows:/app/workflows
      - kestra-data:/app/storage

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: kestra
      POSTGRES_USER: kestra
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  kestra-data:
  postgres-data:
EOF

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Kubernetes (Scalable)

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cademy-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cademy-frontend
  template:
    metadata:
      labels:
        app: cademy-frontend
    spec:
      containers:
      - name: frontend
        image: cademy/frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: VITE_BACKEND_URL
          value: "http://cademy-backend:3001"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cademy-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cademy-backend
  template:
    metadata:
      labels:
        app: cademy-backend
    spec:
      containers:
      - name: backend
        image: cademy/backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: KESTRA_URL
          value: "http://kestra:8080"
        - name: OUMI_API_KEY
          valueFrom:
            secretKeyRef:
              name: cademy-secrets
              key: oumi-api-key
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: kestra
spec:
  serviceName: kestra
  replicas: 1
  selector:
    matchLabels:
      app: kestra
  template:
    metadata:
      labels:
        app: kestra
    spec:
      containers:
      - name: kestra
        image: kestra/kestra:latest
        ports:
        - containerPort: 8080
        volumeMounts:
        - name: workflows
          mountPath: /app/workflows
        - name: storage
          mountPath: /app/storage
  volumeClaimTemplates:
  - metadata:
      name: storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
```

```bash
# Deploy to Kubernetes
kubectl apply -f k8s/
```

### Option 3: AWS (Cloud Native)

```bash
# Infrastructure as Code (Terraform)
cat > main.tf << 'EOF'
provider "aws" {
  region = "us-east-1"
}

# ECS Cluster
resource "aws_ecs_cluster" "cademy" {
  name = "cademy-cluster"
}

# Frontend (CloudFront + S3)
resource "aws_s3_bucket" "frontend" {
  bucket = "cademy-frontend"
}

resource "aws_cloudfront_distribution" "frontend" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-cademy-frontend"
  }
  
  enabled = true
  default_root_object = "index.html"
  
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-cademy-frontend"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
  }
}

# Backend (ECS Fargate)
resource "aws_ecs_task_definition" "backend" {
  family                   = "cademy-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  
  container_definitions = jsonencode([{
    name  = "backend"
    image = "cademy/backend:latest"
    portMappings = [{
      containerPort = 3001
      protocol      = "tcp"
    }]
    environment = [
      { name = "KESTRA_URL", value = "http://kestra:8080" }
    ]
  }])
}

# Kestra (ECS Fargate)
resource "aws_ecs_task_definition" "kestra" {
  family                   = "cademy-kestra"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"
  
  container_definitions = jsonencode([{
    name  = "kestra"
    image = "kestra/kestra:latest"
    portMappings = [{
      containerPort = 8080
      protocol      = "tcp"
    }]
  }])
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier           = "cademy-postgres"
  engine               = "postgres"
  engine_version       = "15"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  username             = "kestra"
  password             = var.db_password
  skip_final_snapshot  = true
}
EOF

terraform init
terraform apply
```

## Environment Configuration

### Production Environment Variables

```env
# Backend
NODE_ENV=production
PORT=3001
KESTRA_URL=http://kestra:8080
OUMI_API_KEY=<your-key>
DB_HOST=postgres
DB_PORT=5432
DB_NAME=kestra
DB_USER=kestra
DB_PASSWORD=<secure-password>

# Frontend
VITE_BACKEND_URL=https://api.cademy.com
VITE_API_TIMEOUT=30000
VITE_ENABLE_ANALYTICS=true

# Kestra
KESTRA_USER=admin
KESTRA_PASSWORD=<secure-password>
```

## Monitoring Setup

### 1. Prometheus + Grafana

```yaml
# docker-compose.monitoring.yml
version: "3.8"

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana

volumes:
  prometheus-data:
  grafana-data:
```

### 2. Application Logs

```bash
# Centralized logging with ELK
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  elasticsearch:8.11.0

docker run -d \
  --name kibana \
  -p 5601:5601 \
  --link elasticsearch:elasticsearch \
  kibana:8.11.0
```

## Backup & Recovery

```bash
# Backup Kestra workflows
kubectl exec -it kestra-0 -- tar czf /tmp/workflows.tar.gz /app/workflows
kubectl cp kestra-0:/tmp/workflows.tar.gz ./backup/workflows-$(date +%Y%m%d).tar.gz

# Backup PostgreSQL
docker exec postgres pg_dump -U kestra kestra > backup/db-$(date +%Y%m%d).sql

# Restore
docker exec -i postgres psql -U kestra kestra < backup/db-20250101.sql
```

## Health Checks

```bash
# Frontend
curl http://localhost:3000

# Backend
curl http://localhost:3001/health

# Kestra
curl http://localhost:8080/api/v1/health

# Full system check
./scripts/health-check.sh
```

## Troubleshooting

### Kestra not starting
```bash
docker logs kestra
# Check PostgreSQL connection
docker exec kestra nc -zv postgres 5432
```

### Workflows not executing
```bash
# Check Kestra logs
docker logs -f kestra

# Verify workflow syntax
curl http://localhost:8080/api/v1/flows/cademy.evaluation/challenge-submission-pipeline
```

### Backend connection issues
```bash
# Test Kestra API
curl http://localhost:8080/api/v1/executions

# Check network
docker network inspect cademy_default
```

## Performance Tuning

### Kestra Workers
```yaml
# Increase worker count
kestra:
  queue:
    type: postgres
  executor:
    type: postgres
    worker:
      thread: 8  # Increase for more parallelism
```

### Database Optimization
```sql
-- Add indexes
CREATE INDEX idx_executions_state ON executions(state);
CREATE INDEX idx_executions_namespace ON executions(namespace);
```

### Caching
```javascript
// Add Redis caching
const redis = require('redis');
const client = redis.createClient();

app.get('/api/challenges/:id', async (req, res) => {
  const cached = await client.get(`challenge:${req.params.id}`);
  if (cached) return res.json(JSON.parse(cached));
  
  // Fetch and cache
  const challenge = await fetchChallenge(req.params.id);
  await client.setex(`challenge:${req.params.id}`, 3600, JSON.stringify(challenge));
  res.json(challenge);
});
```

## Security Hardening

1. **Enable HTTPS**: Use Let's Encrypt certificates
2. **API Rate Limiting**: Implement rate limits on all endpoints
3. **Input Validation**: Validate all user inputs
4. **Secrets Management**: Use AWS Secrets Manager or HashiCorp Vault
5. **Network Policies**: Restrict inter-service communication

## Cost Optimization

- Use spot instances for Kestra workers
- Implement auto-scaling based on load
- Cache frequently accessed data
- Optimize Docker images (multi-stage builds)
- Use CDN for static assets
