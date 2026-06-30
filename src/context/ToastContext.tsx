import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ToastMessage } from '../types';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface ToastContextType {
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, title, message, type };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full sm:w-96 px-4 sm:px-0">
        {toasts.map((toast) => {
          let Icon = Info;
          let iconColor = 'text-blue-500';
          let borderColor = 'border-blue-500/30';
          let bgColor = 'bg-white/70 dark:bg-slate-900/80';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            iconColor = 'text-emerald-500';
            borderColor = 'border-emerald-500/30';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            iconColor = 'text-amber-500';
            borderColor = 'border-amber-500/30';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            iconColor = 'text-rose-500';
            borderColor = 'border-rose-500/30';
          }

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 rounded-xl border ${borderColor} ${bgColor} backdrop-blur-md shadow-2xl transition-all duration-300 animate-slide-in`}
              role="alert"
            >
              <div className={`mt-0.5 shrink-0 ${iconColor}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {toast.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
