# CADemy AI Setup Instructions

## Current Status

✅ **Deployment script created**: `scripts/deploy-workflows.sh`
❌ **Kestra not running**: Need to start Docker services

## Quick Setup

### 1. Start Kestra (Required)

```bash
# Option A: Using Docker Compose (Recommended)
docker-compose up -d

# Wait for Kestra to be ready (30-60 seconds)
curl http://localhost:8080/api/v1/health

# Option B: Using Docker directly
docker run -d \
  --name kestra \
  -p 8080:8080 \
  -e KESTRA_CONFIGURATION="datasources:\n  postgres:\n    url: jdbc:postgresql://host.docker.internal:5432/kestra" \
  kestra/kestra:latest
```

### 2. Deploy Workflows

```bash
# Once Kestra is running
./scripts/deploy-workflows.sh
```

### 3. Verify Deployment

```bash
# Check Kestra UI
open http://localhost:8080

# Or via API
curl http://localhost:8080/api/v1/flows
```

## Alternative: Manual Deployment

If Docker is not available, you can deploy workflows manually via Kestra UI:

1. Access Kestra UI: http://localhost:8080
2. Go to "Flows" section
3. Click "Create Flow"
4. Copy/paste content from each YAML file in `kestra-workflows/`
5. Click "Save"

## Workflow Files Ready

✅ `kestra-workflows/challenge-submission-pipeline.yaml`
✅ `kestra-workflows/challenge-generator.yaml`
✅ `kestra-workflows/learning-path-agent.yaml`

## Next Steps

1. **Start Kestra**: `docker-compose up -d`
2. **Deploy workflows**: `./scripts/deploy-workflows.sh`
3. **Start backend**: `cd backend && npm start`
4. **Start frontend**: `npm run dev`

## Troubleshooting

### Kestra not accessible
```bash
# Check if running
docker ps | grep kestra

# Check logs
docker logs kestra

# Restart
docker-compose restart kestra
```

### Port already in use
```bash
# Change port in docker-compose.yml
ports:
  - "8081:8080"  # Use 8081 instead

# Update KESTRA_URL
export KESTRA_URL=http://localhost:8081
```

## System Requirements

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- 8GB RAM minimum
- 20GB disk space
- Ports available: 8080 (Kestra), 3001 (Backend), 3000 (Frontend)
