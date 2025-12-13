const express = require('express');
const cors = require('cors');
const axios = require('axios');
const BackendChatService = require('./chatService');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize chat service
const chatService = new BackendChatService();

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

// AI Chatbot endpoint with Oumi-style architecture
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Process message through chat service
    const result = await chatService.processMessage(message, conversationHistory);

    res.json({
      response: result.content,
      provider: result.provider,
      success: result.success,
      responseTime: result.responseTime,
      tokens: result.tokens,
      fallbackUsed: result.fallbackUsed,
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

// Chat service health check
app.get('/api/chat/health', async (req, res) => {
  try {
    const status = await chatService.checkProviderHealth();
    res.json({
      status: 'ok',
      providers: status,
      fallbackChain: chatService.fallbackChain
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// Route to specific provider (for testing)
app.post('/api/chat/provider/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await chatService.routeToProvider(provider, message, conversationHistory);

    res.json({
      response: result.content,
      provider: result.provider,
      success: result.success,
      tokens: result.tokens,
      error: result.error,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Provider routing error:', error);
    res.status(500).json({ 
      error: 'Failed to route to provider',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`CADemy Backend running on port ${PORT}`);
  console.log('Chat service initialized with providers:', Object.keys(chatService.providers));
});
