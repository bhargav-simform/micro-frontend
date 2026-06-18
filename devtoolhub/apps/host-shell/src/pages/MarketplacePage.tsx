import { useState } from 'react';
import { Link } from 'react-router';
import { usePlugins } from '../api/pluginRegistry';
import { usePluginStore } from '../store/pluginStore';
import type { PluginMeta, PluginCategory } from '@devtoolhub/shared-types';
import styles from './MarketplacePage.module.css';

const CATEGORIES: { value: PluginCategory | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'api', label: 'API' },
  { value: 'data', label: 'Data' },
  { value: 'security', label: 'Security' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'editor', label: 'Editor' },
];

const FRAMEWORK_COLORS: Record<string, string> = {
  react: '#61dafb',
  vue: '#42b883',
  svelte: '#ff3e00',
};

export function MarketplacePage() {
  const [category, setCategory] = useState<PluginCategory | undefined>(undefined);
  const { data: plugins, isLoading, isError } = usePlugins(category);
  const { install, uninstall, isInstalled } = usePluginStore();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Plugin Marketplace</h1>
        <p className={styles.subtitle}>Discover and install developer tools</p>
      </div>

      <div className={styles.filters}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.label}
            className={[styles.filterBtn, category === cat.value && styles.filterBtnActive].filter(Boolean).join(' ')}
            onClick={() => setCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading && <div className={styles.loading}>Loading plugins...</div>}
      {isError && <div className={styles.error}>Failed to load plugins. Is the registry running on port 4000?</div>}

      {plugins && (
        <div className={styles.grid}>
          {plugins.map(plugin => (
            <PluginCard
              key={plugin.id}
              plugin={plugin}
              installed={isInstalled(plugin.id)}
              onInstall={() => install(plugin)}
              onUninstall={() => uninstall(plugin.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface PluginCardProps {
  plugin: PluginMeta;
  installed: boolean;
  onInstall: () => void;
  onUninstall: () => void;
}

function PluginCard({ plugin, installed, onInstall, onUninstall }: PluginCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.icon}>{plugin.icon}</span>
        <div className={styles.cardMeta}>
          <span
            className={styles.framework}
            style={{ color: FRAMEWORK_COLORS[plugin.framework] ?? '#888' }}
          >
            {plugin.framework}
          </span>
          <span className={styles.version}>v{plugin.version}</span>
        </div>
      </div>
      <h3 className={styles.cardTitle}>{plugin.name}</h3>
      <p className={styles.cardDesc}>{plugin.description}</p>
      <div className={styles.tags}>
        {plugin.tags.slice(0, 3).map(t => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
      </div>
      <div className={styles.cardActions}>
        {installed ? (
          <>
            <Link to={`/plugins/${plugin.id}`} className={styles.openBtn}>Open</Link>
            <button className={styles.uninstallBtn} onClick={onUninstall}>Uninstall</button>
          </>
        ) : (
          <button className={styles.installBtn} onClick={onInstall}>Install</button>
        )}
      </div>
    </div>
  );
}
