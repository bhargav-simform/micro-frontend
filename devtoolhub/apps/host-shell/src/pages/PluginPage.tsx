import { useParams, Link } from 'react-router';
import { usePlugin } from '../api/pluginRegistry';
import { usePluginStore } from '../store/pluginStore';
import { PluginFrame } from '../loader/PluginFrame';
import styles from './PluginPage.module.css';

export function PluginPage() {
  const { pluginId } = useParams<{ pluginId: string }>();
  const { data: plugin, isLoading, isError } = usePlugin(pluginId!);
  const { isInstalled, install } = usePluginStore();

  if (isLoading) {
    return <div className={styles.loading}>Loading plugin info...</div>;
  }

  if (isError || !plugin) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundIcon}>🔍</div>
        <h2>Plugin not found</h2>
        <p>The plugin "{pluginId}" could not be found in the registry.</p>
        <Link to="/marketplace" className={styles.backLink}>Back to Marketplace</Link>
      </div>
    );
  }

  const installed = isInstalled(plugin.id);

  return (
    <div className={styles.container}>
      <div className={styles.pluginHeader}>
        <Link to="/dashboard" className={styles.backLink}>← Dashboard</Link>
        <div className={styles.pluginInfo}>
          <span className={styles.pluginIcon}>{plugin.icon}</span>
          <div>
            <h1 className={styles.pluginName}>{plugin.name}</h1>
            <p className={styles.pluginMeta}>
              {plugin.framework} · v{plugin.version} · {plugin.category}
            </p>
          </div>
        </div>
        {!installed && (
          <button className={styles.installBtn} onClick={() => install(plugin)}>
            Install Plugin
          </button>
        )}
      </div>

      <div className={styles.pluginBody}>
        <PluginFrame plugin={plugin} />
      </div>
    </div>
  );
}
