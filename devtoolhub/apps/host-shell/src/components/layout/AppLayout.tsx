import { useState } from 'react';
import { Outlet, NavLink } from 'react-router';
import { eventBus } from '@devtoolhub/event-bus';
import { useAuthStore } from '../../store/authStore';
import { usePluginStore } from '../../store/pluginStore';
import styles from './AppLayout.module.css';

export function AppLayout() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { authState, login, logout } = useAuthStore();
  const { installedPlugins } = usePluginStore();

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    eventBus.emit('theme-changed', { theme: next });
  };

  const handleMockLogin = () => {
    login(
      { id: '1', email: 'dev@devtoolhub.io', name: 'Dev User', roles: ['admin'] },
      'mock-jwt-token-xyz'
    );
  };

  return (
    <div className={styles.layout} data-theme={theme}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🛠️</span>
          <span className={styles.brandName}>DevToolHub</span>
        </div>
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>
            Home
          </NavLink>
          <NavLink to="/marketplace" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>
            Marketplace
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>
            Dashboard
            {installedPlugins.length > 0 && (
              <span className={styles.badge}>{installedPlugins.length}</span>
            )}
          </NavLink>
        </nav>
        <div className={styles.headerActions}>
          <button className={styles.themeBtn} onClick={toggleTheme} title="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {authState.isAuthenticated ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>{authState.user?.name}</span>
              <button className={styles.authBtn} onClick={logout}>Logout</button>
            </div>
          ) : (
            <button className={styles.authBtn} onClick={handleMockLogin}>Login (Mock)</button>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
