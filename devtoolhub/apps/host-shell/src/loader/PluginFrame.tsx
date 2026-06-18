import { Suspense, lazy, useMemo } from 'react';
import type { ComponentType } from 'react';
import type { PluginMeta } from '@devtoolhub/shared-types';
import { AuthProvider } from '@devtoolhub/auth-sdk';
import { PluginBoundary } from './PluginBoundary';
import { VuePluginWrapper } from './VuePluginWrapper';
import { SveltePluginWrapper } from './SveltePluginWrapper';
import { loadPlugin } from './pluginLoader';
import { useAuthStore } from '../store/authStore';

interface Props {
  plugin: PluginMeta;
}

type AnyComponent = ComponentType<{ pluginId: string }>;

export function PluginFrame({ plugin }: Props) {
  const authState = useAuthStore(state => state.authState);

  const PluginComponent = useMemo(() => {
    return lazy(async (): Promise<{ default: AnyComponent }> => {
      const component = await loadPlugin(plugin);

      if (plugin.framework === 'vue') {
        const raw = component as unknown;
        const Wrapper: AnyComponent = ({ pluginId }) => (
          <VuePluginWrapper component={raw} pluginId={pluginId} />
        );
        return { default: Wrapper };
      }

      if (plugin.framework === 'svelte') {
        const raw = component as unknown;
        const Wrapper: AnyComponent = ({ pluginId }) => (
          <SveltePluginWrapper component={raw} pluginId={pluginId} />
        );
        return { default: Wrapper };
      }

      return { default: component as AnyComponent };
    });
  }, [plugin.id]);

  return (
    <PluginBoundary plugin={plugin}>
      <Suspense
        fallback={
          <div className="plugin-loading">
            <div className="plugin-loading-spinner" />
            <p>Loading {plugin.name}...</p>
          </div>
        }
      >
        <AuthProvider value={authState}>
          <PluginComponent pluginId={plugin.id} />
        </AuthProvider>
      </Suspense>
    </PluginBoundary>
  );
}
