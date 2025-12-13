// Backend Chat Service with Oumi-style architecture
// Handles prompt management, provider routing, and fallback logic

const axios = require('axios');

class BackendChatService {
  constructor() {
    this.providers = {
      oumi: {
        name: 'Oumi',
        endpoint: process.env.OUMI_API_ENDPOINT || 'https://api.oumi.ai/v1/chat/completions',
        model: 'oumi-flash',
        priority: 0,
        timeout: 8000
      },
      groq: {
        name: 'Groq',
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'llama-3.1-8b-instant',
        priority: 1,
        timeout: 10000
      }
    };
    
    this.fallbackChain = ['oumi', 'groq'];
    this.context = this.buildContext();
  }

  buildContext() {
    return `CADara is a 3D modeling education platform with React, Three.js, React Three Fiber. 
Features: Interactive 3D Environment, Progressive Learning, Challenge-based Learning, Transform Controls (move/rotate/scale). 
Modes: Playground (free modeling), Challenge (structured learning), Tutorial (guided learning). 
Tech: React, Three.js, Tailwind CSS, Webpack.`;
  }

  buildPrompt(message, conversationHistory = []) {
    const systemPrompt = `You are an expert CAD tutor assistant for CADara, an interactive 3D modeling learning platform.

CADara Features:
- Interactive 3D playground with cube, sphere, cylinder, cone shapes
- Transform tools: move, rotate, scale
- Boolean operations: union, subtract, intersect
- Guided tutorials and step-by-step challenges
- Real-time feedback and progress tracking

Your role:
- Answer questions about CAD concepts and 3D modeling
- Help troubleshoot modeling issues
- Explain challenge requirements
- Provide step-by-step guidance
- Suggest next learning steps

Be concise, helpful, and encouraging. Use simple language for beginners.

Context: ${this.context}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-4), // Keep last 4 messages for context
      { role: 'user', content: message }
    ];

    return messages;
  }

  async callProvider(provider, messages) {
    const config = this.providers[provider];
    
    if (provider === 'oumi') {
      return this.callOumi(messages, config);
    } else if (provider === 'groq') {
      return this.callGroq(messages, config);
    }
    
    throw new Error(`Unknown provider: ${provider}`);
  }

  async callOumi(messages, config) {
    const OUMI_API_KEY = process.env.OUMI_API_KEY;
    
    if (!OUMI_API_KEY) {
      throw new Error('OUMI_API_KEY not configured');
    }

    try {
      const response = await axios.post(
        config.endpoint,
        {
          model: config.model,
          messages,
          temperature: 0.2,
          max_tokens: 800
        },
        {
          headers: {
            'Authorization': `Bearer ${OUMI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: config.timeout
        }
      );

      return {
        content: response.data.choices[0].message.content.trim(),
        provider: config.name,
        tokens: response.data.usage?.total_tokens || 0
      };
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Oumi API timeout');
      }
      throw new Error(`Oumi API error: ${error.response?.status || error.message}`);
    }
  }

  async callGroq(messages, config) {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not configured');
    }

    try {
      const response = await axios.post(
        config.endpoint,
        {
          model: config.model,
          messages,
          temperature: 0.1,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: config.timeout
        }
      );

      return {
        content: response.data.choices[0].message.content.trim(),
        provider: config.name,
        tokens: response.data.usage?.total_tokens || 0
      };
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Groq API timeout');
      }
      throw new Error(`Groq API error: ${error.response?.status || error.message}`);
    }
  }

  async processMessage(message, conversationHistory = []) {
    const messages = this.buildPrompt(message, conversationHistory);
    const startTime = Date.now();
    
    // Try providers in fallback order
    for (let i = 0; i < this.fallbackChain.length; i++) {
      const providerName = this.fallbackChain[i];
      
      try {
        console.log(`Attempting provider: ${providerName}`);
        const result = await this.callProvider(providerName, messages);
        
        const responseTime = Date.now() - startTime;
        
        return {
          content: result.content,
          provider: result.provider,
          success: true,
          responseTime,
          tokens: result.tokens,
          fallbackUsed: i > 0
        };
      } catch (error) {
        console.warn(`Provider ${providerName} failed:`, error.message);
        
        // If this is the last provider, return error
        if (i === this.fallbackChain.length - 1) {
          return {
            content: this.getFallbackResponse(message),
            provider: 'Fallback',
            success: false,
            error: error.message,
            responseTime: Date.now() - startTime
          };
        }
        
        // Continue to next provider
        continue;
      }
    }
  }

  getFallbackResponse(message) {
    const userMessage = message.toLowerCase();
    
    if (userMessage.includes('boolean') || userMessage.includes('union') || userMessage.includes('subtract')) {
      return 'Boolean operations let you combine shapes! Union merges objects, Subtract removes one from another, and Intersect keeps only overlapping parts. Try selecting two objects and clicking the operation button.';
    } else if (userMessage.includes('challenge') || userMessage.includes('next')) {
      return 'Complete your current challenge by meeting all requirements, then submit for AI evaluation. Once you pass, the next challenge unlocks automatically. Check the Mission Panel for current objectives.';
    } else if (userMessage.includes('move') || userMessage.includes('rotate') || userMessage.includes('scale')) {
      return 'To transform objects: 1) Select an object by clicking it, 2) Choose Move/Rotate/Scale from the toolbar, 3) Drag the colored arrows/circles to transform. Press ESC to deselect.';
    } else if (userMessage.includes('error') || userMessage.includes('fix') || userMessage.includes('problem')) {
      return 'Common issues: 1) Objects not aligning - use grid snap, 2) Boolean operation failed - ensure objects overlap, 3) Can\'t select object - click directly on the mesh. What specific error are you seeing?';
    } else {
      return `I'm here to help with CADara! I can assist with:
- 3D modeling techniques
- Challenge completion  
- Tool usage (move, rotate, scale)
- Boolean operations
- Troubleshooting issues

What would you like to know?`;
    }
  }

  // Route to specific provider (for testing)
  async routeToProvider(provider, message, conversationHistory = []) {
    const messages = this.buildPrompt(message, conversationHistory);
    
    try {
      const result = await this.callProvider(provider, messages);
      return {
        content: result.content,
        provider: result.provider,
        success: true,
        tokens: result.tokens
      };
    } catch (error) {
      return {
        content: `${provider} provider failed: ${error.message}`,
        provider: provider,
        success: false,
        error: error.message
      };
    }
  }

  // Health check for providers
  async checkProviderHealth() {
    const status = {};
    
    for (const [name, config] of Object.entries(this.providers)) {
      try {
        const testMessages = [{ role: 'user', content: 'test' }];
        const result = await this.callProvider(name, testMessages);
        status[name] = { 
          available: true, 
          endpoint: config.endpoint,
          responseTime: result.responseTime || 0
        };
      } catch (error) {
        status[name] = { 
          available: false, 
          error: error.message,
          endpoint: config.endpoint
        };
      }
    }
    
    return status;
  }

  // Update provider configuration
  updateProvider(providerName, config) {
    if (this.providers[providerName]) {
      this.providers[providerName] = { ...this.providers[providerName], ...config };
    }
  }

  // Update fallback chain
  updateFallbackChain(chain) {
    this.fallbackChain = chain;
  }
}

module.exports = BackendChatService;
