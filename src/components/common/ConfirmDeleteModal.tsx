import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  message,
  itemName,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-[380px] rounded-3xl bg-surface-1 dark:bg-surface-1-dark border border-hairline-light dark:border-hairline-dark p-6 shadow-2xl z-10 text-center"
          >
            {/* Trash icon circle */}
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center mb-4">
              <Trash2 size={24} strokeWidth={2} />
            </div>

            <h3 className="text-[19px] font-semibold text-ink dark:text-ink-dark">
              {title}
            </h3>

            {itemName && (
              <p className="text-[14px] font-medium text-action dark:text-action-dark mt-1 truncate">
                "{itemName}"
              </p>
            )}

            <p className="text-[13px] text-ink-muted dark:text-ink-dark-muted mt-2 leading-relaxed">
              {message || 'Are you sure you want to delete this? This action cannot be undone.'}
            </p>

            <div className="flex items-center gap-2.5 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 px-4 rounded-full bg-surface-2 dark:bg-surface-2-dark text-ink dark:text-ink-dark text-[14px] font-medium border border-hairline-light dark:border-hairline-dark hover:bg-hairline-light/30 transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onCancel();
                }}
                className="flex-1 py-3 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-[14px] font-medium transition-colors shadow-sm active:scale-95"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
