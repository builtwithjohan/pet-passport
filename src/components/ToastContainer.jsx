import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map(toast => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className="toast-notification"
            style={{
              borderColor: isError ? 'var(--color-rose)' : isSuccess ? 'var(--color-emerald)' : 'var(--color-brand-accent)'
            }}
          >
            {isError ? (
              <AlertCircle size={18} color="var(--color-rose)" />
            ) : isSuccess ? (
              <CheckCircle2 size={18} color="var(--color-emerald)" />
            ) : (
              <Info size={18} color="var(--color-brand-accent)" />
            )}
            
            <span style={{ flex: 1 }}>{toast.message}</span>
            
            <button
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
