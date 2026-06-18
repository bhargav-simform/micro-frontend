import type { PluginMeta } from '@devtoolhub/shared-types';
import type { ComponentType } from 'react';
import {
  __federation_method_setRemote,
  __federation_method_getRemote,
  __federation_method_unwrapDefault,
} from '__federation__';

const loadedRemotes = new Set<string>();

export async function loadPlugin(plugin: PluginMeta): Promise<ComponentType<{ pluginId: string }>> {
  const { scope, remoteUrl, exposedModule } = plugin;

  if (!loadedRemotes.has(scope)) {
    __federation_method_setRemote(scope, {
      url: () => Promise.resolve(remoteUrl),
      format: 'esm',
      from: 'vite',
    });
    loadedRemotes.add(scope);
  }

  const module = await __federation_method_getRemote(scope, exposedModule);
  return __federation_method_unwrapDefault(module) as ComponentType<{ pluginId: string }>;
}
