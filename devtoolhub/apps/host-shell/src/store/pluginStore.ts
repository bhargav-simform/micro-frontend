import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PluginMeta } from '@devtoolhub/shared-types';
import { eventBus } from '@devtoolhub/event-bus';

interface PluginStore {
  installedPlugins: PluginMeta[];
  install: (plugin: PluginMeta) => void;
  uninstall: (pluginId: string) => void;
  isInstalled: (pluginId: string) => boolean;
}

export const usePluginStore = create<PluginStore>()(
  persist(
    (set, get) => ({
      installedPlugins: [],

      install: (plugin) => {
        if (get().isInstalled(plugin.id)) return;
        set(state => ({
          installedPlugins: [...state.installedPlugins, { ...plugin, installed: true }],
        }));
        eventBus.emit('plugin-installed', { pluginId: plugin.id, pluginMeta: plugin });
      },

      uninstall: (pluginId) => {
        set(state => ({
          installedPlugins: state.installedPlugins.filter(p => p.id !== pluginId),
        }));
        eventBus.emit('plugin-uninstalled', { pluginId });
      },

      isInstalled: (pluginId) => get().installedPlugins.some(p => p.id === pluginId),
    }),
    { name: 'devtoolhub-plugins' }
  )
);
