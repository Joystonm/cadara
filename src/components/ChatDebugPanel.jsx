import React, { useState } from 'react';
import ChatService from '../services/chatService';

export default function ChatDebugPanel() {
  const [chatService] = useState(() => new ChatService());
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('auto');

  const testMessage = async () => {
    if (!message.trim() || loading) return;
    
    setLoading(true);
    setResult(null);

    try {
      let response;
      if (selectedProvider === 'auto') {
        response = await chatService.sendMessage(message);
      } else {
        response = await chatService.routeToProvider(selectedProvider, message);
      }
      setResult(response);
    } catch (error) {
      setResult({
        content: error.message,
        provider: 'Error',
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    setLoading(true);
    try {
      const status = await chatService.getProviderStatus();
      setResult({
        content: JSON.stringify(status, null, 2),
        provider: 'Health Check',
        success: true
      });
    } catch (error) {
      setResult({
        content: error.message,
        provider: 'Health Check Error',
        success: false
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-4 left-4 w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 z-50">
      <h3 className="text-white font-semibold mb-4">Chat Service Debug</h3>
      
      {/* Provider Selection */}
      <div className="mb-4">
        <label className="block text-slate-300 text-sm mb-2">Provider</label>
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
        >
          <option value="auto">Auto (Fallback Chain)</option>
          <option value="oumi">Oumi Only</option>
          <option value="groq">Groq Only</option>
        </select>
      </div>

      {/* Message Input */}
      <div className="mb-4">
        <label className="block text-slate-300 text-sm mb-2">Test Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter test message..."
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none"
          rows="3"
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={testMessage}
          disabled={loading || !message.trim()}
          className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm transition-colors"
        >
          {loading ? 'Testing...' : 'Test Message'}
        </button>
        <button
          onClick={checkHealth}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm transition-colors"
        >
          Health Check
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm font-medium">Result</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${result.success ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-xs text-slate-400">{result.provider}</span>
            </div>
          </div>
          
          <div className="text-slate-100 text-sm whitespace-pre-wrap mb-2">
            {result.content}
          </div>
          
          {result.responseTime && (
            <div className="text-xs text-slate-400">
              Response time: {result.responseTime}ms
            </div>
          )}
          
          {result.tokens && (
            <div className="text-xs text-slate-400">
              Tokens: {result.tokens}
            </div>
          )}
          
          {result.fallbackUsed && (
            <div className="text-xs text-yellow-400">
              Fallback used
            </div>
          )}
          
          {result.error && (
            <div className="text-xs text-red-400 mt-1">
              Error: {result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
