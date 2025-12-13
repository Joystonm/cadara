# CADemy Chatbot Architecture

## Overview

The CADemy chatbot now implements an **Oumi-style architecture** with sophisticated prompt handling, provider routing, and fallback logic. This ensures reliable AI assistance even when individual providers fail.

## Architecture Components

### 1. Chat Service (`src/services/chatService.js`)
- **Prompt Management**: Builds context-aware prompts with conversation history
- **Provider Routing**: Routes requests to available AI providers
- **Fallback Logic**: Automatically switches providers when one fails
- **Configuration**: Uses centralized config for easy customization

### 2. Backend Chat Service (`backend/chatService.js`)
- **Server-side Processing**: Handles API calls to external providers
- **Provider Health Monitoring**: Tracks provider availability
- **Timeout Management**: Prevents hanging requests
- **Token Usage Tracking**: Monitors API usage

### 3. Configuration (`src/config/chatConfig.js`)
- **Provider Settings**: Endpoints, models, timeouts, priorities
- **Fallback Chain**: Order of provider attempts
- **Prompts**: System prompts and fallback responses
- **UI Settings**: Message limits, context size, display options

## Provider Architecture

### Primary Provider: Oumi
- **Role**: Advanced reasoning and detailed responses
- **Endpoint**: `/api/chat` (routed through backend)
- **Model**: `oumi-flash`
- **Priority**: 0 (highest)
- **Timeout**: 8 seconds

### Fallback Provider: Groq
- **Role**: Fast, reliable responses when Oumi fails
- **Endpoint**: Direct API call to Groq
- **Model**: `llama-3.1-8b-instant`
- **Priority**: 1 (fallback)
- **Timeout**: 10 seconds

### Fallback Responses
- **Role**: Static responses when all providers fail
- **Categories**: Boolean operations, challenges, transforms, errors, general
- **Purpose**: Ensure users always get helpful information

## Request Flow

```
User Message
    ↓
Prompt Builder (adds context + history)
    ↓
Provider Router
    ↓
Try Oumi → Success? → Return Response
    ↓ (if failed)
Try Groq → Success? → Return Response
    ↓ (if failed)
Static Fallback → Return Fallback Response
```

## Key Features

### 1. Intelligent Fallback
- Automatically tries next provider if current one fails
- Tracks which provider was used for transparency
- Maintains conversation context across provider switches

### 2. Context Management
- Keeps last 4 messages for conversation context
- Builds CADemy-specific system prompts
- Maintains platform context across all interactions

### 3. Performance Monitoring
- Tracks response times for each provider
- Monitors token usage
- Logs provider failures for debugging

### 4. Configuration Flexibility
- Easy to add new providers
- Configurable fallback chains
- Adjustable timeouts and parameters

## Usage Examples

### Basic Chat
```javascript
const chatService = new ChatService();
const result = await chatService.sendMessage("How do I create a cube?");
console.log(result.content); // Response text
console.log(result.provider); // "Oumi" or "Groq"
console.log(result.success); // true/false
```

### Provider-Specific Routing
```javascript
// Test specific provider
const result = await chatService.routeToProvider('groq', message);
```

### Health Check
```javascript
const status = await chatService.getProviderStatus();
console.log(status); // Provider availability status
```

## Environment Variables

```bash
# Frontend (.env)
VITE_GROQ_API_KEY=your_groq_api_key_here

# Backend (.env)
GROQ_API_KEY=your_groq_api_key_here
OUMI_API_KEY=your_oumi_api_key_here
OUMI_API_ENDPOINT=https://api.oumi.ai/v1/chat/completions
```

## API Endpoints

### Chat Endpoint
```
POST /api/chat
{
  "message": "User message",
  "conversationHistory": [...],
  "context": "Optional context"
}
```

### Health Check
```
GET /api/chat/health
```

### Provider-Specific Testing
```
POST /api/chat/provider/:provider
{
  "message": "Test message",
  "conversationHistory": [...]
}
```

## Debug Panel

The `ChatDebugPanel` component provides real-time testing:
- Test individual providers
- Check provider health
- Monitor response times
- View fallback behavior

## Benefits

1. **Reliability**: Never fails completely due to fallback chain
2. **Performance**: Uses fastest available provider
3. **Transparency**: Shows which provider handled each request
4. **Flexibility**: Easy to add/remove providers
5. **Monitoring**: Built-in health checks and performance tracking
6. **Context Awareness**: Maintains conversation context
7. **CADemy-Specific**: Tailored prompts for 3D modeling education

## Future Enhancements

- **Load Balancing**: Distribute requests across multiple instances
- **Caching**: Cache common responses for faster delivery
- **Analytics**: Track usage patterns and optimize prompts
- **A/B Testing**: Compare provider performance
- **Rate Limiting**: Prevent API quota exhaustion
- **Streaming**: Real-time response streaming for long answers
