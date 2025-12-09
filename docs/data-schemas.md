# CADemy AI Data Schemas

## Submission Data Schema

```json
{
  "objects": [
    {
      "id": "string",
      "type": "cube|sphere|cylinder|cone",
      "transform": {
        "position": [x, y, z],
        "rotation": [x, y, z],
        "scale": [x, y, z]
      },
      "boundingBox": {
        "min": [x, y, z],
        "max": [x, y, z]
      },
      "volume": "number",
      "material": {
        "color": "string",
        "opacity": "number"
      }
    }
  ],
  "operations": [
    {
      "type": "union|subtract|intersect",
      "objectIds": ["string"],
      "timestamp": "ISO8601"
    }
  ],
  "metadata": {
    "timeSpent": "number (seconds)",
    "undoCount": "number",
    "toolSwitches": "number"
  }
}
```

## Evaluation Result Schema

```json
{
  "final_score": "number (0-100)",
  "rule_component": "number",
  "ai_component": "number",
  "feedback": "string",
  "suggestions": ["string"],
  "passed": "boolean",
  "error_locations": [
    {
      "object_id": "string",
      "issue": "string",
      "severity": "low|medium|high"
    }
  ],
  "correctness": {
    "requirements_met": "boolean",
    "operations_correct": "boolean",
    "alignment_accurate": "boolean"
  }
}
```

## Challenge Schema

```json
{
  "id": "string",
  "title": "string",
  "difficulty": "beginner|intermediate|advanced",
  "description": "string",
  "requirements": {
    "min_objects": "number",
    "max_objects": "number",
    "required_shapes": ["string"],
    "operations": ["string"],
    "constraints": {
      "alignment": "string",
      "spacing": "number",
      "symmetry": "boolean"
    }
  },
  "target_model": {
    "objects": [],
    "operations": []
  },
  "hints": ["string"],
  "time_limit": "number (seconds)",
  "points": "number"
}
```

## Learning Path Schema

```json
{
  "user_id": "string",
  "difficulty_level": "beginner|intermediate|advanced",
  "next_challenges": ["string"],
  "focus_areas": ["string"],
  "estimated_time": "number (seconds)",
  "personalized_tips": ["string"],
  "progress_metrics": {
    "avg_score": "number",
    "completion_rate": "number",
    "strong_areas": ["string"],
    "weak_areas": ["string"]
  }
}
```

## User Progress Schema

```json
{
  "user_id": "string",
  "completed_challenges": ["string"],
  "scores": ["number"],
  "total_challenges": "number",
  "current_level": "string",
  "achievements": [
    {
      "id": "string",
      "name": "string",
      "earned_at": "ISO8601"
    }
  ],
  "learning_history": [
    {
      "challenge_id": "string",
      "score": "number",
      "attempts": "number",
      "completed_at": "ISO8601"
    }
  ]
}
```
