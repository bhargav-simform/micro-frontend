export type PluginCategory = 'api' | 'data' | 'security' | 'productivity' | 'editor';

export type PluginFramework = 'react' | 'vue' | 'svelte';

export interface PluginMeta {
  id: string;
  name: string;
  description: string;
  version: string;
  category: PluginCategory;
  framework: PluginFramework;
  remoteUrl: string;
  scope: string;
  exposedModule: string;
  icon: string;
  tags: string[];
  author: string;
  installed?: boolean;
}

export interface PluginProps {
  pluginId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export type EventName =
  | 'plugin-installed'
  | 'plugin-uninstalled'
  | 'token-updated'
  | 'env-variable-updated'
  | 'theme-changed'
  | 'plugin-error';

export interface EventPayloadMap {
  'plugin-installed': { pluginId: string; pluginMeta: PluginMeta };
  'plugin-uninstalled': { pluginId: string };
  'token-updated': { token: string; expiresAt: number };
  'env-variable-updated': { key: string; value: string };
  'theme-changed': { theme: 'light' | 'dark' };
  'plugin-error': { pluginId: string; error: string; stack?: string };
}
