import { useState, useEffect } from 'react';
import { useAuth } from '@devtoolhub/auth-sdk';
import { eventBus } from '@devtoolhub/event-bus';
import type { PluginProps } from '@devtoolhub/shared-types';
import styles from './App.module.css';

function decodeJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
    const decode = (str: string) => JSON.parse(atob(str.replace(/-/g, '+').replace(/_/g, '/')));
    return { header: decode(parts[0]), payload: decode(parts[1]), valid: true };
  } catch {
    return { header: null, payload: null, valid: false };
  }
}

export default function JwtDecoderApp({ pluginId: _pluginId }: PluginProps) {
  const { token } = useAuth();
  const [input, setInput] = useState(token ?? '');
  const decoded = input.trim() ? decodeJwt(input.trim()) : null;

  // Auto-refresh when auth token changes via event bus
  useEffect(() => {
    const unsub = eventBus.on('token-updated', ({ token: newToken }) => {
      setInput(newToken);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (token) setInput(token);
  }, [token]);

  const now = Math.floor(Date.now() / 1000);
  const exp = decoded?.payload?.exp as number | undefined;
  const isExpired = exp !== undefined && exp < now;
  const expiresIn = exp ? exp - now : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🔐 JWT Decoder</h2>
        {decoded && (
          <span className={[styles.statusBadge, isExpired ? styles.expired : styles.valid].join(' ')}>
            {isExpired ? 'Expired' : expiresIn !== null ? `Expires in ${formatDuration(expiresIn)}` : 'No expiry'}
          </span>
        )}
      </div>

      <textarea
        className={styles.tokenInput}
        rows={5}
        placeholder="Paste JWT token here..."
        value={input}
        onChange={e => setInput(e.target.value)}
        spellCheck={false}
      />

      {decoded && !decoded.valid && (
        <div className={styles.error}>Invalid JWT format. A valid JWT has 3 parts separated by dots.</div>
      )}

      {decoded?.valid && (
        <div className={styles.sections}>
          <Section title="Header" data={decoded.header} color="#6366f1" />
          <Section title="Payload" data={decoded.payload} color="#10b981" />
          <div className={styles.signatureNote}>
            <span>🔏 Signature</span>
            <p>Verify on your server with your secret key. Client-side verification is not secure.</p>
          </div>
        </div>
      )}

      <div className={styles.examples}>
        <span className={styles.examplesLabel}>Try a sample token:</span>
        <button className={styles.sampleBtn} onClick={() => setInput(SAMPLE_JWT)}>Load sample</button>
      </div>
    </div>
  );
}

function Section({ title, data, color }: { title: string; data: unknown; color: string }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader} style={{ borderLeftColor: color }}>
        <span className={styles.sectionTitle}>{title}</span>
      </div>
      <pre className={styles.sectionBody}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h`;
}

// A real (expired) sample JWT for demo
const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
