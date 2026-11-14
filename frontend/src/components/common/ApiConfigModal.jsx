import React, { useState } from 'react';
import { Server, CheckCircle2, AlertTriangle, ExternalLink, X, RefreshCw } from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl, checkApiHealth } from '../../services/api';

export const ApiConfigModal = ({ isOpen, onClose, onConnected }) => {
  const [urlInput, setUrlInput] = useState(getApiBaseUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const cleanUrl = urlInput.trim().replace(/\/+$/, '');
      if (!cleanUrl) {
        setTestResult({ success: false, message: 'Please enter a valid URL' });
        setTesting(false);
        return;
      }

      // Temporarily set URL to test
      setApiBaseUrl(cleanUrl);
      const health = await checkApiHealth();

      if (health.connected) {
        setTestResult({
          success: true,
          message: `Connected successfully! (Latency: ${health.latency}ms)`,
        });
        setTimeout(() => {
          onConnected?.();
          onClose();
        }, 800);
      } else {
        setTestResult({
          success: false,
          message: health.error || 'Connection failed. Verify the URL and that FastAPI is running.',
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleReset = () => {
    setApiBaseUrl(null);
    setUrlInput(getApiBaseUrl());
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-surface-border shadow-xl max-w-md w-full p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-main">Configure Backend API</h3>
              <p className="text-[11px] text-secondary">Connect frontend to your live Railway service</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-main hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-main block mb-1">
              FastAPI Backend Endpoint URL
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://your-app-name.up.railway.app"
              className="w-full px-3 py-2 text-xs font-mono border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="text-[11px] text-secondary mt-1">
              Enter your Railway public domain (e.g. <code>https://auropulseai-production.up.railway.app</code>).
            </p>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{testResult.message}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-surface-border">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-secondary hover:text-main underline"
          >
            Reset to Default
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-secondary hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTestAndSave}
              disabled={testing}
              className="px-4 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing...' : 'Connect & Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiConfigModal;
