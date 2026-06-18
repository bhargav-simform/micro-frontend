import { Link } from 'react-router';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            🛠️ DevToolHub
          </h1>
          <p className={styles.heroSubtitle}>
            A VS Code-style plugin marketplace for developer tools.
            Install, run, and isolate tools built in React, Vue, and Svelte —
            all loaded dynamically at runtime.
          </p>
          <div className={styles.heroActions}>
            <Link to="/marketplace" className={styles.primaryCta}>
              Browse Marketplace
            </Link>
            <Link to="/dashboard" className={styles.secondaryCta}>
              My Plugins
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Platform Features</h2>
        <div className={styles.featureGrid}>
          {FEATURES.map(f => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const FEATURES = [
  { icon: '⚡', title: 'Runtime Federation', desc: 'Plugins are discovered and loaded dynamically at runtime. No rebuild needed when a new plugin ships.' },
  { icon: '🧩', title: 'Multi-Framework', desc: 'React, Vue 3, and Svelte plugins all coexist in one shell. Each framework runs in isolation.' },
  { icon: '🔒', title: 'Plugin Isolation', desc: 'Each plugin has its own state, styles (CSS Modules), and error boundary. One crash does not affect others.' },
  { icon: '🔗', title: 'Shared Event Bus', desc: 'Plugins communicate via a typed event bus — no direct dependencies between them.' },
  { icon: '🔑', title: 'Shared Auth SDK', desc: 'The host owns authentication. Plugins consume user and token via a shared read-only context.' },
  { icon: '📦', title: 'Monorepo Workspaces', desc: 'pnpm workspaces with shared packages for types, UI, auth, HTTP, and events.' },
];
