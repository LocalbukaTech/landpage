'use client';

import * as React from 'react';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '@/lib/utils';

const toastVariants = cva(
  'pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-lg border bg-white px-4 py-3 text-sm shadow-lg transition-all dark:border-neutral-800 dark:bg-neutral-900',
  {
    variants: {
      variant: {
        default: 'border-neutral-200 text-neutral-900 dark:text-neutral-50',
        success:
          'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950 dark:text-emerald-50',
        destructive:
          'border-red-200 bg-red-50 text-red-900 dark:border-red-800/60 dark:bg-red-950 dark:text-red-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type ToastVariant = NonNullable<
  VariantProps<typeof toastVariants>['variant']
>;

export type ToastProps = {
  id: number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  duration?: number;
  variant?: ToastVariant;
};

type ToastInternal = ToastProps & {createdAt: number};

type ToastContextValue = {
  toasts: ToastInternal[];
  show: (toast: Omit<ToastProps, 'id'>) => void;
  dismiss: (id: number) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({children}: {children: React.ReactNode}) {
  const [toasts, setToasts] = React.useState<ToastInternal[]>([]);
  const idRef = React.useRef(1);

  const dismiss = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = React.useCallback(
    (toast: Omit<ToastProps, 'id'>) => {
      const id = idRef.current++;
      const duration = toast.duration ?? 4000;
      const createdAt = Date.now();

      setToasts((prev) => [
        ...prev,
        {
          id,
          title: toast.title,
          description: toast.description,
          action: toast.action,
          duration,
          variant: toast.variant ?? 'default',
          createdAt,
        },
      ]);

      window.setTimeout(() => {
        dismiss(id);
      }, duration);
    },
    [dismiss]
  );

  const value = React.useMemo(
    () => ({toasts, show, dismiss}),
    [toasts, show, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToastContext() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToastContext must be used within <ToastProvider>');
  }
  return ctx;
}

export function ToastView({toast}: {toast: ToastInternal}) {
  return (
    <div
      className={cn(
        toastVariants({variant: toast.variant}),
        'animate-in slide-in-from-right-5 fade-in-0'
      )}>
      <div className='flex flex-1 flex-col gap-0.5'>
        {toast.title ? (
          <div className='font-semibold leading-tight'>{toast.title}</div>
        ) : null}
        {toast.description ? (
          <div className='text-xs text-neutral-600 dark:text-neutral-300'>
            {toast.description}
          </div>
        ) : null}
      </div>
      {toast.action ? (
        <div className='ml-2 shrink-0'>{toast.action}</div>
      ) : null}
    </div>
  );
}

export function Toaster() {
  const {toasts} = useToastContext();

  return (
    <div className='pointer-events-none fixed inset-0 z-10000 flex flex-col items-end justify-end gap-2 px-4 py-6 sm:px-6'>
      <div className='flex w-full flex-col items-end gap-2 sm:max-w-sm'>
        {toasts.map((toast) => (
          <ToastView key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
}
