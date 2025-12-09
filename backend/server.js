const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Kestra API configuration
const KESTRA_URL = process.env.KESTRA_URL || 'http://localhost:8080';

// Submit challenge for evaluation
app.post('/api/challenges/submit', async (req, res) => {
  try {
    const { submissionData, challengeId, userId } = req.body;

    // Trigger Kestra workflow
    const response = await axios.post(
      `${KESTRA_URL}/api/v1/executions/cademy.evaluation/challenge-submission-pipeline`,
      {
        inputs: {
          submission_data: JSON.stringify(submissionData),
          challenge_id: challengeId,
          user_id: userId
        }
      }
    );

    const executionId = response.data.id;

    res.json({
      success: true,
      executionId,
      message: 'Evaluation started'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get workflow execution status
app.get('/api/workflow-status/:executionId', async (req, res) => {
  try {
    const { executionId } = req.params;

    const response = await axios.get(
      `${KESTRA_URL}/api/v1/executions/${executionId}`
    );

    const execution = response.data;

    res.json({
      status: execution.state.current,
      outputs: execution.outputs,
      completed: execution.state.current === 'SUCCESS'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student progress
app.get('/api/users/:userId/progress', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch from database (placeholder)
    const progress = {
      user_id: userId,
      completed_challenges: ['challenge_1', 'challenge_2'],
      scores: [85, 92, 78],
      total_challenges: 10,
      current_level: 'intermediate'
    };

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update learning path
app.put('/api/users/:userId/learning-path', async (req, res) => {
  try {
    const { userId } = req.params;
    const learningPath = req.body;

    // Store in database (placeholder)
    console.log(`Updated learning path for user ${userId}:`, learningPath);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Oumi evaluation endpoint
app.post('/api/oumi/evaluate', async (req, res) => {
  try {
    const { summary, challenge_id, prompt } = req.body;

    // Call Oumi evaluator (placeholder - replace with actual Oumi SDK)
    const evaluation = {
      score: 85,
      feedback: 'Good work! Model meets requirements with minor alignment issues.',
      suggestions: [
        'Align cylinder with cube center',
        'Check boolean operation order'
      ],
      error_locations: [],
      correctness: {
        requirements_met: true,
        operations_correct: true,
        alignment_accurate: false
      }
    };

    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Oumi personalization endpoint
app.post('/api/oumi/personalize', async (req, res) => {
  try {
    const { user_analysis, progress_history, prompt } = req.body;

    // Call Oumi for personalization (placeholder)
    const recommendations = {
      suggested_challenges: ['challenge_5', 'challenge_6'],
      focus_areas: ['boolean operations', 'precision alignment'],
      estimated_time: 3600,
      tips: [
        'Practice with simpler shapes first',
        'Use grid snapping for alignment'
      ]
    };

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Store submission results
app.post('/api/submissions/store', async (req, res) => {
  try {
    const { user_id, challenge_id, score, feedback, passed } = req.body;

    // Store in database (placeholder)
    console.log('Storing submission:', { user_id, challenge_id, score, passed });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new challenge
app.post('/api/challenges/create', async (req, res) => {
  try {
    const challenge = req.body;

    // Store challenge (placeholder)
    console.log('Creating challenge:', challenge.id);

    res.json({ success: true, challenge_id: challenge.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trigger learning path update
app.post('/api/learning-path/update/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { trigger_event } = req.body;

    // Trigger Kestra workflow
    const response = await axios.post(
      `${KESTRA_URL}/api/v1/executions/cademy.personalization/learning-path-agent`,
      {
        inputs: {
          user_id: userId,
          trigger_event: trigger_event || 'periodic'
        }
      }
    );

    res.json({ success: true, executionId: response.data.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build system prompt with CADemy context
    const systemPrompt = `You are an expert CAD tutor assistant for CADemy, an interactive 3D modeling learning platform.

CADemy Features:
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

Be concise, helpful, and encouraging. Use simple language for beginners.`;

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      messages.push(...conversationHistory.slice(-6)); // Keep last 6 messages for context
    }

    // Add current context if provided
    if (context) {
      const contextMsg = `Current context: ${JSON.stringify(context)}`;
      messages.push({ role: 'system', content: contextMsg });
    }

    // Add user message
    messages.push({ role: 'user', content: message });

    // Call Oumi API (placeholder - replace with actual Oumi SDK)
    const oumiResponse = await callOumiAPI(messages);

    res.json({
      response: oumiResponse.content,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to get response',
      message: error.message 
    });
  }
});

// Oumi API integration
async function callOumiAPI(messages) {
  const OUMI_API_KEY = process.env.OUMI_API_KEY;
  
  if (!OUMI_API_KEY) {
    throw new Error('OUMI_API_KEY not configured');
  }

  // Placeholder implementation - replace with actual Oumi SDK
  // Example: const response = await oumi.chat.completions.create({ messages, model: 'oumi-v1' });
  
  // Mock response for development
  const userMessage = messages[messages.length - 1].content.toLowerCase();
  
  let response = '';
  if (userMessage.includes('boolean') || userMessage.includes('union') || userMessage.includes('subtract')) {
    response = 'Boolean operations let you combine shapes! **Union** merges objects, **Subtract** removes one from another, and **Intersect** keeps only overlapping parts. Try selecting two objects and clicking the operation button.';
  } else if (userMessage.includes('challenge') || userMessage.includes('next')) {
    response = 'Great question! Complete your current challenge by meeting all requirements, then submit for AI evaluation. Once you pass, the next challenge unlocks automatically. Check the Mission Panel for current objectives.';
  } else if (userMessage.includes('move') || userMessage.includes('rotate') || userMessage.includes('scale')) {
    response = 'To transform objects: 1) Select an object by clicking it, 2) Choose Move/Rotate/Scale from the toolbar, 3) Drag the colored arrows/circles to transform. Press ESC to deselect.';
  } else if (userMessage.includes('error') || userMessage.includes('fix') || userMessage.includes('problem')) {
    response = 'I can help debug! Common issues: 1) Objects not aligning - use grid snap, 2) Boolean operation failed - ensure objects overlap, 3) Can\'t select object - click directly on the mesh. What specific error are you seeing?';
  } else {
    response = `I'm here to help with CADemy! I can assist with:
- 3D modeling techniques
- Challenge completion
- Tool usage (move, rotate, scale)
- Boolean operations
- Troubleshooting issues

What would you like to know?`;
  }

  return { content: response };
}

app.listen(PORT, () => {
  console.log(`CADemy Backend running on port ${PORT}`);
});
