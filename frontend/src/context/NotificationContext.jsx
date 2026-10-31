import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showNotification = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {/* Toast rendering portal */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-white border-[#16A34A]/20 text-[#172033]'
                : toast.type === 'error'
                ? 'bg-white border-[#DC2626]/20 text-[#172033]'
                : 'bg-white border-[#EAECEF] text-[#172033]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="w-5 h-5 text-[#DC2626]" />
              )}
              {toast.type === 'info' && (
                <Info className="w-5 h-5 text-[#FBBF24]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-sm font-semibold text-[#172033] mb-0.5">{toast.title}</p>
              )}
              <p className="text-xs text-[#64748B] leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react/only-export-components -- hook must live with its context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

