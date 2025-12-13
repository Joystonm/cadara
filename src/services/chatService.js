// Chat Service with Oumi-style architecture
// Handles prompt management, provider routing, and fallback logic

import chatConfig from '../config/chatConfig';

class ChatService {
  constructor(config = chatConfig) {
    this.config = config;
    this.providers = { ...config.providers };
    this.fallbackChain = [...config.fallbackChain];
    this.context = this.buildContext();
  }

  buildContext() {
    const { context } = this.config;
    return `${context.platform} is a ${context.description} with ${context.tech.join(', ')}. 
Features: ${context.features.join(', ')}. 
Modes: ${context.modes.join(', ')}.`;
  }

  buildPrompt(message, conversationHistory = []) {
    const messages = [
      { role: 'system', content: this.config.prompts.system },
      ...conversationHistory.slice(-this.config.ui.contextMessages),
      { role: 'user', content: message }
    ];

    return messages;
  }

  async callProvider(provider, messages) {
    const config = this.providers[provider];
    
    if (provider === 'groq') {
      return this.callGroq(messages, config);
    } else if (provider === 'oumi') {
      return this.callOumi(messages, config);
    }
    
    throw new Error(`Unknown provider: ${provider}`);
  }

  async callGroq(messages, config) {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content.trim(),
      provider: config.name,
      tokens: data.usage?.total_tokens || 0
    };
  }

  async callOumi(messages, config) {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: messages[messages.length - 1].content,
        context: this.context,
        conversationHistory: messages.slice(1, -1) // Exclude system and current message
      })
    });

    if (!response.ok) {
      throw new Error(`Oumi API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.response,
      provider: data.provider || config.name,
      tokens: data.tokens || 0,
      responseTime: data.responseTime
    };
  }

  async sendMessage(message, conversationHistory = []) {
    const messages = this.buildPrompt(message, conversationHistory);
    const startTime = Date.now();
    
    // Try providers in fallback order
    for (let i = 0; i < this.fallbackChain.length; i++) {
      const providerName = this.fallbackChain[i];
      
      try {
        if (this.config.dev.enableLogging) {
          console.log(`Attempting provider: ${providerName}`);
        }
        
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
        if (this.config.dev.enableLogging) {
          console.warn(`Provider ${providerName} failed:`, error.message);
        }
        
        // If this is the last provider, return fallback response
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
    const { fallback } = this.config.prompts;
    
    if (userMessage.includes('boolean') || userMessage.includes('union') || userMessage.includes('subtract')) {
      return fallback.boolean;
    } else if (userMessage.includes('challenge') || userMessage.includes('next')) {
      return fallback.challenge;
    } else if (userMessage.includes('move') || userMessage.includes('rotate') || userMessage.includes('scale')) {
      return fallback.transform;
    } else if (userMessage.includes('error') || userMessage.includes('fix') || userMessage.includes('problem')) {
      return fallback.error;
    } else {
      return fallback.default;
    }
  }

  // Route to specific provider (for testing or specific needs)
  async routeToProvider(provider, message, conversationHistory = []) {
    const messages = this.buildPrompt(message, conversationHistory);
    
    try {
      const result = await this.callProvider(provider, messages);
      return {
        content: result.content,
        provider: result.provider,
        success: true
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

  // Get provider status
  async getProviderStatus() {
    const status = {};
    
    for (const [name, config] of Object.entries(this.providers)) {
      try {
        // Simple health check
        const testMessage = [{ role: 'user', content: 'test' }];
        await this.callProvider(name, testMessage);
        status[name] = { available: true, endpoint: config.endpoint };
      } catch (error) {
        status[name] = { available: false, error: error.message };
      }
    }
    
    return status;
  }
}

export default ChatService;
