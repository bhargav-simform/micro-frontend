import styles from './ErrorFallback.module.css';

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorFallback({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚠️</div>
      <h3 className={styles.title}>{title}</h3>
      {message && <p className={styles.message}>{message}</p>}
      {onRetry && (
        <button className={styles.retryBtn} onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
