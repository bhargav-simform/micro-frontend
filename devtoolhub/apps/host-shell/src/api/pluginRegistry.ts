import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@devtoolhub/http-sdk';
import type { PluginMeta } from '@devtoolhub/shared-types';

const REGISTRY_URL = import.meta.env.VITE_REGISTRY_URL ?? 'http://localhost:4000';

export const pluginKeys = {
  all: ['plugins'] as const,
  filtered: (category: string) => ['plugins', category] as const,
  byId: (id: string) => ['plugins', id] as const,
};

export function usePlugins(category?: string) {
  return useQuery({
    queryKey: category ? pluginKeys.filtered(category) : pluginKeys.all,
    queryFn: async () => {
      const { data } = await httpClient.get<PluginMeta[]>(`${REGISTRY_URL}/plugins`);
      return category ? data.filter(p => p.category === category) : data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlugin(id: string) {
  return useQuery({
    queryKey: pluginKeys.byId(id),
    queryFn: async () => {
      const { data } = await httpClient.get<PluginMeta>(`${REGISTRY_URL}/plugins/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });
}
