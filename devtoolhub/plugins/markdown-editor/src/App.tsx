import { useState, useMemo } from 'react';
import { marked } from 'marked';
import type { PluginProps } from '@devtoolhub/shared-types';
import styles from './App.module.css';

const DEFAULT_MD = `# Hello, Markdown! 📝

Write your **markdown** here and see a _live preview_.

## Features
- Live preview
- Export to file
- Light / dark theme

## Code
\`\`\`javascript
const hello = () => console.log('Hello, DevToolHub!');
hello();
\`\`\`

> Tip: This plugin demonstrates isolated state and CSS scoping.
`;

export default function MarkdownEditorApp({ pluginId: _pluginId }: PluginProps) {
  const [md, setMd] = useState(DEFAULT_MD);
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => marked(md), [md]);

  const exportFile = () => {
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyMd = async () => {
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <h2 className={styles.title}>📝 Markdown Editor</h2>
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={copyMd}>
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
          <button className={styles.actionBtn} onClick={exportFile}>⬇️ Export</button>
        </div>
      </div>
      <div className={styles.editor}>
        <div className={styles.pane}>
          <div className={styles.paneLabel}>Markdown</div>
          <textarea
            className={styles.textarea}
            value={md}
            onChange={e => setMd(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className={styles.divider} />
        <div className={styles.pane}>
          <div className={styles.paneLabel}>Preview</div>
          <div
            className={styles.preview}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
