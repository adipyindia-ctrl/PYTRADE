'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'error' | 'info';
}

interface ToastContextValue {
  toast: (opts: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles = {
  success: {
    container: 'border-green-200 bg-white',
    icon: 'text-green-600',
    Icon: CheckCircle,
  },
  error: {
    container: 'border-red-200 bg-white',
    icon: 'text-red-600',
    Icon: AlertCircle,
  },
  info: {
    container: 'border-blue-200 bg-white',
    icon: 'text-blue-600',
    Icon: Info,
  },
};

function ToastItem({
  message,
  onDismiss,
}: {
  message: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  const styles = variantStyles[message.variant];
  const { Icon } = styles;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex items-start gap-3 w-full max-w-sm rounded-xl border shadow-lg p-4',
        'animate-in slide-in-from-right-5 fade-in duration-300',
        styles.container
      )}
    >
      <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', styles.icon)} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{message.title}</p>
        {message.description && (
          <p className="text-xs text-gray-500 mt-0.5">{message.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(message.id)}
        className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (opts: Omit<ToastMessage, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { ...opts, id }]);
      const timer = setTimeout(() => dismiss(id), 4000);
      timersRef.current.set(id, timer);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container: top-right on desktop, bottom-center on mobile */}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className={cn(
          'fixed z-[60] flex flex-col gap-2 pointer-events-none',
          /* Mobile: bottom center */
          'bottom-[5rem] left-1/2 -translate-x-1/2 items-center w-[calc(100vw-2rem)]',
          /* Desktop: top right */
          'sm:bottom-auto sm:top-4 sm:right-4 sm:left-auto sm:translate-x-0 sm:items-end sm:w-auto'
        )}
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full sm:w-auto">
            <ToastItem message={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

export default ToastProvider;
