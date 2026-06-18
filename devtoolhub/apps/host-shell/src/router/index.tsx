import { createBrowserRouter } from 'react-router';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { MarketplacePage } from '../pages/MarketplacePage';
import { DashboardPage } from '../pages/DashboardPage';
import { PluginPage } from '../pages/PluginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'marketplace', element: <MarketplacePage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'plugins/:pluginId', element: <PluginPage /> },
    ],
  },
]);
