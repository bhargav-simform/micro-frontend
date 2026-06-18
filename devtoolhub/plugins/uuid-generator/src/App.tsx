import { useState } from 'react';
import type { PluginProps } from '@devtoolhub/shared-types';
import styles from './App.module.css';

function generateUuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGeneratorApp({ pluginId: _pluginId }: PluginProps) {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = () => {
    setUuids(Array.from({ length: count }, () => generateUuidV4()));
  };

  const copyOne = async (uuid: string, idx: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🎲 UUID Generator</h2>
        <span className={styles.badge}>v4</span>
      </div>

      <div className={styles.controls}>
        <label className={styles.label}>
          Count
          <input
            className={styles.countInput}
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={e => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
          />
        </label>
        <button className={styles.generateBtn} onClick={generate}>
          Generate {count} UUID{count !== 1 ? 's' : ''}
        </button>
        {uuids.length > 0 && (
          <button className={styles.copyAllBtn} onClick={copyAll}>
            {copiedAll ? '✅ Copied!' : '📋 Copy All'}
          </button>
        )}
      </div>

      {uuids.length > 0 && (
        <div className={styles.list}>
          {uuids.map((uuid, idx) => (
            <div key={uuid} className={styles.uuidRow}>
              <code className={styles.uuid}>{uuid}</code>
              <button className={styles.copyBtn} onClick={() => copyOne(uuid, idx)}>
                {copiedIdx === idx ? '✅' : '📋'}
              </button>
            </div>
          ))}
        </div>
      )}

      {uuids.length === 0 && (
        <div className={styles.empty}>
          <p>Click Generate to create UUIDs</p>
        </div>
      )}
    </div>
  );
}
