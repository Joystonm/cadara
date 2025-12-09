# CADemy AI API Documentation

## Base URL
```
Development: http://localhost:3001
Production: https://api.cademy.com
```

## Authentication
```http
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Submit Challenge

Submit a 3D model for AI evaluation.

**Endpoint:** `POST /api/challenges/submit`

**Request Body:**
```json
{
  "submissionData": {
    "objects": [...],
    "operations": [...],
    "metadata": {...}
  },
  "challengeId": "challenge_1",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "executionId": "exec_abc123",
  "message": "Evaluation started"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request
- `500` - Server error

---

### 2. Get Workflow Status

Poll for evaluation results.

**Endpoint:** `GET /api/workflow-status/:executionId`

**Response:**
```json
{
  "status": "SUCCESS",
  "outputs": {
    "evaluation_result": {
      "final_score": 85,
      "feedback": "...",
      "suggestions": [...],
      "passed": true
    }
  },
  "completed": true
}
```

**Status Values:**
- `RUNNING` - In progress
- `SUCCESS` - Completed successfully
- `FAILED` - Execution failed

---

### 3. Get User Progress

Fetch student progress data.

**Endpoint:** `GET /api/users/:userId/progress`

**Response:**
```json
{
  "user_id": "user_123",
  "completed_challenges": ["challenge_1", "challenge_2"],
  "scores": [85, 92, 78],
  "total_challenges": 10,
  "current_level": "intermediate",
  "achievements": [...]
}
```

---

### 4. Update Learning Path

Update personalized learning path.

**Endpoint:** `PUT /api/users/:userId/learning-path`

**Request Body:**
```json
{
  "difficulty_level": "advanced",
  "next_challenges": ["challenge_5", "challenge_6"],
  "focus_areas": ["boolean operations"],
  "personalized_tips": [...]
}
```

**Response:**
```json
{
  "success": true
}
```

---

### 5. Oumi Evaluation

Direct Oumi evaluation endpoint.

**Endpoint:** `POST /api/oumi/evaluate`

**Request Body:**
```json
{
  "summary": {
    "total_objects": 3,
    "complexity_score": 30,
    "operations_used": 2
  },
  "challenge_id": "challenge_1",
  "prompt": "Evaluate this CAD model..."
}
```

**Response:**
```json
{
  "score": 85,
  "feedback": "Good work! ...",
  "suggestions": [...],
  "error_locations": [],
  "correctness": {
    "requirements_met": true,
    "operations_correct": true,
    "alignment_accurate": false
  }
}
```

---

### 6. Oumi Personalization

Get personalized recommendations.

**Endpoint:** `POST /api/oumi/personalize`

**Request Body:**
```json
{
  "user_analysis": {
    "avg_score": 75,
    "completion_rate": 0.6
  },
  "progress_history": {...},
  "prompt": "Recommend next steps..."
}
```

**Response:**
```json
{
  "suggested_challenges": ["challenge_5", "challenge_6"],
  "focus_areas": ["boolean operations", "precision"],
  "estimated_time": 3600,
  "tips": [...]
}
```

---

### 7. Store Submission

Store evaluation results.

**Endpoint:** `POST /api/submissions/store`

**Request Body:**
```json
{
  "user_id": "user_123",
  "challenge_id": "challenge_1",
  "score": 85,
  "feedback": "...",
  "passed": true
}
```

**Response:**
```json
{
  "success": true
}
```

---

### 8. Create Challenge

Create new challenge (admin only).

**Endpoint:** `POST /api/challenges/create`

**Request Body:**
```json
{
  "id": "daily_20250108",
  "title": "Daily Challenge",
  "difficulty": "intermediate",
  "requirements": {...},
  "points": 100
}
```

**Response:**
```json
{
  "success": true,
  "challenge_id": "daily_20250108"
}
```

---

### 9. Trigger Learning Path Update

Manually trigger learning path recalculation.

**Endpoint:** `POST /api/learning-path/update/:userId`

**Request Body:**
```json
{
  "trigger_event": "completion"
}
```

**Response:**
```json
{
  "success": true,
  "executionId": "exec_xyz789"
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {...}
}
```

**Common Error Codes:**
- `INVALID_INPUT` - Request validation failed
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

---

## Rate Limiting

- **Evaluation endpoints**: 10 requests/minute per user
- **Progress endpoints**: 60 requests/minute per user
- **Admin endpoints**: 100 requests/minute

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1704729600
```

---

## Webhooks (Optional)

Register webhooks for async notifications.

**Endpoint:** `POST /api/webhooks/register`

**Request Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["evaluation.completed", "challenge.unlocked"]
}
```

**Webhook Payload:**
```json
{
  "event": "evaluation.completed",
  "timestamp": "2025-01-08T12:00:00Z",
  "data": {
    "user_id": "user_123",
    "challenge_id": "challenge_1",
    "score": 85,
    "passed": true
  }
}
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Submit challenge
const { data } = await client.post('/api/challenges/submit', {
  submissionData,
  challengeId,
  userId
});

// Poll for results
const pollResults = async (executionId: string) => {
  while (true) {
    const { data } = await client.get(`/api/workflow-status/${executionId}`);
    if (data.completed) return data.outputs.evaluation_result;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
};
```

### Python

```python
import requests
import time

class CademyClient:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {'Authorization': f'Bearer {token}'}
    
    def submit_challenge(self, submission_data, challenge_id, user_id):
        response = requests.post(
            f'{self.base_url}/api/challenges/submit',
            json={
                'submissionData': submission_data,
                'challengeId': challenge_id,
                'userId': user_id
            },
            headers=self.headers
        )
        return response.json()
    
    def poll_results(self, execution_id):
        while True:
            response = requests.get(
                f'{self.base_url}/api/workflow-status/{execution_id}',
                headers=self.headers
            )
            data = response.json()
            if data['completed']:
                return data['outputs']['evaluation_result']
            time.sleep(2)
```

---

## Testing

### cURL Examples

```bash
# Submit challenge
curl -X POST http://localhost:3001/api/challenges/submit \
  -H "Content-Type: application/json" \
  -d '{
    "submissionData": {...},
    "challengeId": "challenge_1",
    "userId": "user_123"
  }'

# Get status
curl http://localhost:3001/api/workflow-status/exec_abc123

# Get progress
curl http://localhost:3001/api/users/user_123/progress
```

### Postman Collection

Import the Postman collection from `docs/postman_collection.json`

---

## Versioning

API version is included in the URL:

```
/api/v1/challenges/submit
/api/v2/challenges/submit
```

Current version: `v1`

---

## Support

For API issues:
- GitHub Issues: https://github.com/cademy/issues
- Email: api-support@cademy.com
- Discord: https://discord.gg/cademy
