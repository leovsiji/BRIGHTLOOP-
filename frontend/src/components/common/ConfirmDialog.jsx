import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action? This operation cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showClose={!isLoading}
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4 py-2">
        <div className={`p-2.5 rounded-full shrink-0 ${isDanger ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#172033] mb-1">
            {title}
          </h4>
          <p className="text-xs text-[#64748B] leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

