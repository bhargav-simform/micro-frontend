import { Link } from 'react-router';
import { usePluginStore } from '../store/pluginStore';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { installedPlugins, uninstall } = usePluginStore();

  if (installedPlugins.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📦</div>
        <h2>No plugins installed</h2>
        <p>Browse the marketplace to install your first plugin.</p>
        <Link to="/marketplace" className={styles.marketplaceLink}>Go to Marketplace</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Plugins</h1>
      <p className={styles.subtitle}>{installedPlugins.length} plugin{installedPlugins.length !== 1 ? 's' : ''} installed</p>
      <div className={styles.grid}>
        {installedPlugins.map(plugin => (
          <div key={plugin.id} className={styles.card}>
            <div className={styles.cardLeft}>
              <span className={styles.icon}>{plugin.icon}</span>
              <div>
                <h3 className={styles.cardTitle}>{plugin.name}</h3>
                <p className={styles.cardMeta}>
                  {plugin.framework} · v{plugin.version}
                </p>
              </div>
            </div>
            <div className={styles.cardActions}>
              <Link to={`/plugins/${plugin.id}`} className={styles.openBtn}>Open</Link>
              <button className={styles.removeBtn} onClick={() => uninstall(plugin.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
