import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import type { PluginMeta } from '@devtoolhub/shared-types';
import { eventBus } from '@devtoolhub/event-bus';

interface Props {
  plugin: PluginMeta;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PluginBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    eventBus.emit('plugin-error', {
      pluginId: this.props.plugin.id,
      error: error.message,
      stack: info.componentStack ?? undefined,
    });
    console.error(`[PluginBoundary] Plugin "${this.props.plugin.id}" crashed:`, error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="plugin-error-fallback">
          <div className="plugin-error-icon">⚠️</div>
          <h3>Plugin failed to load</h3>
          <p className="plugin-error-name">{this.props.plugin.name}</p>
          {this.state.error && (
            <p className="plugin-error-message">{this.state.error.message}</p>
          )}
          <button onClick={this.handleRetry}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}
