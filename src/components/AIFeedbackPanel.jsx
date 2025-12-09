import React from 'react';
import { useAIEvaluation } from '../hooks/useAIEvaluation';

export const AIFeedbackPanel = ({ submissionData, challengeId, userId, onComplete }) => {
  const { submitForEvaluation, loading, result, error } = useAIEvaluation();

  const handleSubmit = () => {
    submitForEvaluation(submissionData, challengeId, userId);
  };

  return (
    <div className="ai-feedback-panel bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">AI Evaluation</h2>

      {!result && !loading && (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Submit for AI Review
        </button>
      )}

      {loading && (
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span>AI is evaluating your model...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Score</h3>
            <div className={`text-3xl font-bold ${result.passed ? 'text-green-600' : 'text-orange-600'}`}>
              {result.final_score}/100
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Feedback</h4>
            <p className="text-gray-700">{result.feedback}</p>
          </div>

          {result.suggestions && result.suggestions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Suggestions</h4>
              <ul className="list-disc list-inside space-y-1">
                {result.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-gray-700">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-gray-600">Rule-based Score</div>
              <div className="text-lg font-semibold">{result.rule_component}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <div className="text-gray-600">AI Score</div>
              <div className="text-lg font-semibold">{result.ai_component}</div>
            </div>
          </div>

          {result.passed && (
            <button
              onClick={onComplete}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Continue to Next Challenge
            </button>
          )}
        </div>
      )}
    </div>
  );
};
