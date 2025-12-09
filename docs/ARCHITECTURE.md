# CADemy AI Architecture

## System Overview

CADemy is an AI-native CAD learning platform powered by Kestra workflow orchestration and Oumi LLM/VLM for intelligent evaluation and personalization.

## Architecture Layers

### 1. Frontend Layer (React + Three.js)
- **Components**: Interactive 3D modeling interface
- **State Management**: React Context API
- **3D Rendering**: React Three Fiber + Drei
- **AI Integration**: Custom hooks for evaluation and feedback

### 2. Backend API Layer (Express.js)
- **Purpose**: Bridge between frontend and Kestra/Oumi
- **Endpoints**:
  - `/api/challenges/submit` - Submit model for evaluation
  - `/api/workflow-status/:id` - Poll workflow execution
  - `/api/users/:id/progress` - Fetch user progress
  - `/api/oumi/evaluate` - Direct Oumi evaluation
  - `/api/oumi/personalize` - Personalization recommendations

### 3. Workflow Orchestration Layer (Kestra)
- **Challenge Submission Pipeline**: End-to-end evaluation workflow
- **Challenge Generator**: Automated content creation
- **Learning Path Agent**: Personalization engine

### 4. AI Intelligence Layer (Oumi)
- **Geometric Reasoning**: Deep understanding of 3D models
- **Error Detection**: Identify mistakes and misalignments
- **Feedback Generation**: Natural language explanations
- **Personalization**: Adaptive learning recommendations

## Data Flow

### Challenge Submission Flow

```
1. User completes challenge in frontend
   ↓
2. Frontend extracts 3D model data
   ↓
3. POST to /api/challenges/submit
   ↓
4. Backend triggers Kestra workflow
   ↓
5. Kestra Pipeline:
   a. Parse geometry
   b. Generate summary
   c. Call Oumi evaluation
   d. Calculate combined score
   e. Decide next challenge
   f. Store results
   ↓
6. Frontend polls for results
   ↓
7. Display AI feedback to user
```

### Learning Path Update Flow

```
1. Trigger event (completion/failure/periodic)
   ↓
2. Kestra Learning Path Agent:
   a. Fetch user progress
   b. Analyze performance
   c. Call Oumi personalization
   d. Generate learning path
   e. Update user profile
   ↓
3. Frontend receives updated recommendations
```

## Component Interactions

### Frontend → Backend
- HTTP REST API calls
- JSON payloads
- Polling for async results

### Backend → Kestra
- Kestra REST API
- Workflow execution triggers
- Status polling

### Kestra → Oumi
- Python script tasks
- HTTP calls to Oumi endpoints
- Structured prompt engineering

### Kestra → Backend
- Webhook callbacks (optional)
- Output storage
- Result retrieval via API

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Load Balancer                        │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
│   Frontend   │  │   Backend   │  │   Kestra    │
│   (Vite)     │  │  (Express)  │  │   Server    │
│   Port 3000  │  │  Port 3001  │  │  Port 8080  │
└──────────────┘  └──────┬──────┘  └──────┬──────┘
                         │                 │
                         │                 │
                  ┌──────▼─────────────────▼──────┐
                  │      Oumi API Service          │
                  │      (Python + FastAPI)        │
                  └────────────────────────────────┘
```

## Technology Stack

### Frontend
- React 18
- Three.js + React Three Fiber
- Tailwind CSS
- Axios for HTTP
- Vite build tool

### Backend
- Node.js 18+
- Express.js
- Axios for Kestra API
- CORS middleware

### Workflow Engine
- Kestra (Docker deployment)
- Python 3.11 for script tasks
- YAML workflow definitions

### AI Engine
- Oumi LLM/VLM
- Python evaluation scripts
- Structured output schemas

### Infrastructure
- Docker containers
- PostgreSQL (Kestra state)
- Redis (caching - optional)
- S3 (model storage - optional)

## Security Considerations

1. **API Authentication**: JWT tokens for user sessions
2. **Workflow Isolation**: Separate namespaces per environment
3. **Input Validation**: Schema validation on all endpoints
4. **Rate Limiting**: Prevent abuse of AI evaluation
5. **Data Privacy**: No PII in workflow logs

## Scalability

### Horizontal Scaling
- Frontend: CDN + multiple instances
- Backend: Load balanced API servers
- Kestra: Worker pool scaling

### Vertical Scaling
- Oumi: GPU instances for model inference
- Database: Read replicas for progress queries

### Caching Strategy
- Challenge definitions: Redis cache
- User progress: In-memory + DB
- Evaluation results: Time-limited cache

## Monitoring & Observability

### Metrics
- Workflow execution time
- Evaluation accuracy
- User completion rates
- API response times

### Logging
- Structured JSON logs
- Workflow execution traces
- Error tracking (Sentry)

### Alerting
- Failed workflow executions
- High evaluation latency
- API error rates

## Development Workflow

1. **Local Development**
   ```bash
   # Frontend
   npm run dev
   
   # Backend
   cd backend && npm run dev
   
   # Kestra (Docker)
   docker-compose up kestra
   ```

2. **Testing**
   - Unit tests: Jest
   - Integration tests: Workflow validation
   - E2E tests: Playwright

3. **Deployment**
   - CI/CD: GitHub Actions
   - Staging: Auto-deploy on merge
   - Production: Manual approval

## Environment Variables

```env
# Backend
PORT=3001
KESTRA_URL=http://localhost:8080
OUMI_API_KEY=your_key_here

# Frontend
VITE_BACKEND_URL=http://localhost:3001
VITE_API_TIMEOUT=30000
```

## Future Enhancements

1. **Real-time Collaboration**: Multi-user modeling sessions
2. **VLM Integration**: Visual model analysis
3. **Advanced Personalization**: Reinforcement learning for path optimization
4. **Mobile Support**: Touch-based 3D controls
5. **Marketplace**: User-generated challenges
