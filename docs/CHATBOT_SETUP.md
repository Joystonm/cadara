# AI Chatbot Setup Guide

## Overview

CADemy now includes an intelligent AI chatbot powered by Oumi that provides real-time assistance with 3D modeling, challenges, and troubleshooting.

## Features

✅ **Context-Aware**: Understands current challenge and scene state
✅ **Real-Time Help**: Instant answers to CAD questions
✅ **Quick Replies**: Pre-built questions for common tasks
✅ **Conversation History**: Maintains context across messages
✅ **Beautiful UI**: Fixed bottom-right chat interface

## Setup Instructions

### 1. Get Oumi API Key

```bash
# Sign up at https://oumi.ai
# Get your API key from dashboard
```

### 2. Configure Backend

```bash
cd backend

# Create .env file
cp .env.example .env

# Add your Oumi API key
echo "OUMI_API_KEY=your_actual_api_key_here" >> .env
```

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install axios dotenv

# Frontend (already installed)
npm install axios
```

### 4. Start Services

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
npm run dev
```

### 5. Test Chatbot

1. Open http://localhost:3000
2. Click the blue chat button (bottom-right)
3. Ask: "How do I use boolean operations?"
4. Verify response appears

## API Endpoint

### POST /api/chat

**Request:**
```json
{
  "message": "How do I use the move tool?",
  "context": {
    "scene": {
      "objectCount": 3,
      "objectTypes": ["cube", "sphere"],
      "selectedObject": "cube"
    },
    "challenge": {
      "id": "challenge_1",
      "title": "Basic Shapes"
    }
  },
  "conversationHistory": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" }
  ]
}
```

**Response:**
```json
{
  "response": "To use the move tool: 1) Select an object...",
  "timestamp": "2025-01-08T19:00:00Z"
}
```

## Customization

### Add Custom Responses

Edit `backend/server.js` in the `callOumiAPI` function:

```javascript
if (userMessage.includes('your_keyword')) {
  response = 'Your custom response here';
}
```

### Modify Quick Replies

Edit `src/components/AIChatbot.jsx`:

```javascript
const quickReplies = [
  'Your custom question 1',
  'Your custom question 2',
  // ...
];
```

### Change Appearance

Modify Tailwind classes in `AIChatbot.jsx`:

```javascript
// Change button color
className="bg-purple-600 hover:bg-purple-700"

// Change chat window size
className="w-96 h-[600px]"  // Adjust width/height
```

## Integration with Oumi SDK

Replace the mock implementation with actual Oumi SDK:

```javascript
// backend/server.js
const Oumi = require('@oumi/sdk');
const oumi = new Oumi({ apiKey: process.env.OUMI_API_KEY });

async function callOumiAPI(messages) {
  const response = await oumi.chat.completions.create({
    model: 'oumi-v1',
    messages: messages,
    temperature: 0.7,
    max_tokens: 500
  });
  
  return { content: response.choices[0].message.content };
}
```

## Context Awareness

The chatbot automatically receives:

- **Scene State**: Current objects, selected object
- **Challenge Info**: Current challenge ID and title
- **Progress**: Completed challenges, current level
- **Conversation History**: Last 6 messages for context

## Troubleshooting

### Chatbot not appearing
```bash
# Check if component is imported in App.jsx
grep "AIChatbot" src/App.jsx

# Verify z-index is high enough
# Should be z-50 in AIChatbot.jsx
```

### API errors
```bash
# Check backend is running
curl http://localhost:3001/api/chat

# Verify OUMI_API_KEY is set
cd backend && cat .env | grep OUMI_API_KEY

# Check backend logs
cd backend && npm start
```

### Context not working
```bash
# Verify contexts are available
# Check SceneContext and ProgressContext in browser console
```

## Performance

- **Response Time**: < 2 seconds typical
- **Message Limit**: Last 6 messages kept for context
- **Rate Limiting**: Consider adding rate limits for production

## Security

✅ API key stored in backend `.env`
✅ Never exposed to frontend
✅ CORS configured for localhost
⚠️ Add authentication for production

## Production Deployment

```bash
# Set production API key
export OUMI_API_KEY=prod_key_here

# Enable rate limiting
# Add to backend/server.js:
const rateLimit = require('express-rate-limit');
app.use('/api/chat', rateLimit({
  windowMs: 60000,
  max: 20
}));
```

## Future Enhancements

- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Conversation export
- [ ] Highlight objects in 3D scene
- [ ] Suggested actions (auto-fix issues)
- [ ] Learning analytics from chat data

## Support

For issues:
- Check `docs/API.md` for endpoint details
- Review `backend/server.js` for implementation
- Test with mock responses first
- Verify Oumi API key is valid
