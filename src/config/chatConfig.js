// Chat service configuration
export const chatConfig = {
  // Provider configurations
  providers: {
    oumi: {
      name: 'Oumi',
      endpoint: '/api/chat',
      model: 'oumi-flash',
      priority: 0,
      timeout: 8000,
      maxTokens: 800,
      temperature: 0.2
    },
    groq: {
      name: 'Groq',
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      model: 'llama-3.1-8b-instant',
      priority: 1,
      timeout: 10000,
      maxTokens: 500,
      temperature: 0.1
    }
  },

  // Fallback chain (order matters)
  fallbackChain: ['oumi', 'groq'],

  // Context and prompts
  context: {
    platform: 'CADara',
    description: 'Interactive 3D modeling education platform',
    features: [
      'Interactive 3D Environment',
      'Progressive Learning',
      'Challenge-based Learning',
      'Transform Controls (move/rotate/scale)'
    ],
    modes: [
      'Playground (free modeling)',
      'Challenge (structured learning)',
      'Tutorial (guided learning)'
    ],
    tech: ['React', 'Three.js', 'React Three Fiber', 'Tailwind CSS', 'Webpack']
  },

  // System prompts
  prompts: {
    system: `You are an expert CAD tutor assistant for CADara, an interactive 3D modeling learning platform.

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

Be concise, helpful, and encouraging. Use simple language for beginners.`,

    fallback: {
      boolean: 'Boolean operations let you combine shapes! Union merges objects, Subtract removes one from another, and Intersect keeps only overlapping parts. Try selecting two objects and clicking the operation button.',
      challenge: 'Complete your current challenge by meeting all requirements, then submit for AI evaluation. Once you pass, the next challenge unlocks automatically. Check the Mission Panel for current objectives.',
      transform: 'To transform objects: 1) Select an object by clicking it, 2) Choose Move/Rotate/Scale from the toolbar, 3) Drag the colored arrows/circles to transform. Press ESC to deselect.',
      error: 'Common issues: 1) Objects not aligning - use grid snap, 2) Boolean operation failed - ensure objects overlap, 3) Can\'t select object - click directly on the mesh. What specific error are you seeing?',
      default: `I'm here to help with CADara! I can assist with:
- 3D modeling techniques
- Challenge completion  
- Tool usage (move, rotate, scale)
- Boolean operations
- Troubleshooting issues

What would you like to know?`
    }
  },

  // UI settings
  ui: {
    maxMessages: 50,
    contextMessages: 4,
    typingDelay: 100,
    retryAttempts: 2,
    showProviderInfo: false,
    showResponseTime: false
  },

  // Development settings
  dev: {
    enableLogging: true,
    enableHealthCheck: true,
    mockResponses: false
  }
};

export default chatConfig;
