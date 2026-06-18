import { useState } from 'react';
import { useAuth } from '@devtoolhub/auth-sdk';
import { httpClient } from '@devtoolhub/http-sdk';
import type { PluginProps } from '@devtoolhub/shared-types';
import styles from './App.module.css';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestState {
  method: HttpMethod;
  url: string;
  headers: string;
  params: string;
  body: string;
}

interface ResponseState {
  status: number | null;
  statusText: string;
  data: unknown;
  time: number | null;
  error: string | null;
}

export default function ApiTesterApp({ pluginId: _pluginId }: PluginProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'headers' | 'params' | 'body'>('params');
  const [loading, setLoading] = useState(false);
  const [req, setReq] = useState<RequestState>({
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: '{\n  "Accept": "application/json"\n}',
    params: '',
    body: '{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}',
  });
  const [res, setRes] = useState<ResponseState>({
    status: null,
    statusText: '',
    data: null,
    time: null,
    error: null,
  });

  const sendRequest = async () => {
    setLoading(true);
    setRes({ status: null, statusText: '', data: null, time: null, error: null });
    const start = Date.now();

    try {
      let headers: Record<string, string> = {};
      try { headers = JSON.parse(req.headers || '{}'); } catch { /* ignore */ }

      let params: Record<string, string> = {};
      if (req.params.trim()) {
        req.params.split('&').forEach(pair => {
          const [k, v] = pair.split('=');
          if (k) params[k.trim()] = v?.trim() ?? '';
        });
      }

      const config = {
        method: req.method,
        url: req.url,
        headers,
        params,
        data: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.parse(req.body || '{}') : undefined,
      };

      const response = await httpClient.request(config);
      setRes({
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        time: Date.now() - start,
        error: null,
      });
    } catch (err: unknown) {
      const axErr = err as { response?: { status: number; statusText: string; data: unknown }; message: string };
      if (axErr.response) {
        setRes({
          status: axErr.response.status,
          statusText: axErr.response.statusText,
          data: axErr.response.data,
          time: Date.now() - start,
          error: null,
        });
      } else {
        setRes({ status: null, statusText: '', data: null, time: Date.now() - start, error: axErr.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const statusColor = res.status
    ? res.status < 300 ? '#10b981' : res.status < 400 ? '#f59e0b' : '#ef4444'
    : 'inherit';

  return (
    <div className={styles.container}>
      <div className={styles.pluginHeader}>
        <h2 className={styles.title}>🔌 API Tester</h2>
        {user && <span className={styles.userBadge}>👤 {user.name}</span>}
      </div>

      <div className={styles.requestBar}>
        <select
          className={styles.methodSelect}
          value={req.method}
          onChange={e => setReq(r => ({ ...r, method: e.target.value as HttpMethod }))}
          style={{ color: METHOD_COLORS[req.method] }}
        >
          {(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as HttpMethod[]).map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input
          className={styles.urlInput}
          type="url"
          placeholder="https://api.example.com/endpoint"
          value={req.url}
          onChange={e => setReq(r => ({ ...r, url: e.target.value }))}
        />
        <button className={styles.sendBtn} onClick={sendRequest} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <div className={styles.tabs}>
        {(['params', 'headers', 'body'] as const).map(tab => (
          <button
            key={tab}
            className={[styles.tab, activeTab === tab && styles.tabActive].filter(Boolean).join(' ')}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'params' && (
          <div>
            <p className={styles.tabHint}>Format: key=value&key2=value2</p>
            <textarea
              className={styles.codeArea}
              rows={4}
              placeholder="key=value&another=param"
              value={req.params}
              onChange={e => setReq(r => ({ ...r, params: e.target.value }))}
            />
          </div>
        )}
        {activeTab === 'headers' && (
          <textarea
            className={styles.codeArea}
            rows={6}
            value={req.headers}
            onChange={e => setReq(r => ({ ...r, headers: e.target.value }))}
          />
        )}
        {activeTab === 'body' && (
          <textarea
            className={styles.codeArea}
            rows={8}
            placeholder="JSON body"
            value={req.body}
            onChange={e => setReq(r => ({ ...r, body: e.target.value }))}
            disabled={req.method === 'GET' || req.method === 'DELETE'}
          />
        )}
      </div>

      {(res.status !== null || res.error) && (
        <div className={styles.response}>
          <div className={styles.responseHeader}>
            <span className={styles.responseTitle}>Response</span>
            <div className={styles.responseMeta}>
              {res.status && (
                <span className={styles.statusBadge} style={{ color: statusColor }}>
                  {res.status} {res.statusText}
                </span>
              )}
              {res.time !== null && (
                <span className={styles.timeBadge}>{res.time}ms</span>
              )}
            </div>
          </div>
          {res.error ? (
            <div className={styles.errorBody}>{res.error}</div>
          ) : (
            <pre className={styles.responseBody}>
              {JSON.stringify(res.data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: '#10b981',
  POST: '#6366f1',
  PUT: '#f59e0b',
  DELETE: '#ef4444',
  PATCH: '#8b5cf6',
};
