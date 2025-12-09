import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const useAIEvaluation = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const submitForEvaluation = useCallback(async (submissionData, challengeId, userId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/challenges/submit`, {
        submissionData,
        challengeId,
        userId
      });

      const { executionId } = response.data;

      // Poll for results
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await axios.get(
            `${API_URL}/api/workflow-status/${executionId}`
          );

          if (statusResponse.data.completed) {
            clearInterval(pollInterval);
            setResult(statusResponse.data.outputs.evaluation_result);
            setLoading(false);
          }
        } catch (err) {
          clearInterval(pollInterval);
          setError(err.message);
          setLoading(false);
        }
      }, 2000);

      // Timeout after 60 seconds
      setTimeout(() => {
        clearInterval(pollInterval);
        if (loading) {
          setError('Evaluation timeout');
          setLoading(false);
        }
      }, 60000);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [loading]);

  return { submitForEvaluation, loading, result, error };
};
