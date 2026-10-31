import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showClose = true
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-4xl'
  }[size] || 'max-w-lg';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#172033]/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Center container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className={`relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all w-full ${sizeClasses} border border-[#EAECEF] my-8 animate-in zoom-in-95 duration-150`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showClose) && (
            <div className="px-6 py-4 border-b border-[#EAECEF] flex items-center justify-between gap-4 bg-[#FFFDF7]/40">
              <div>
                {title && (
                  <h3 className="text-base font-semibold text-[#172033]">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-xs text-[#64748B] mt-0.5">{description}</p>
                )}
              </div>
              {showClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 bg-[#FFFDF7]/60 border-t border-[#EAECEF] flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

