import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          aria-label="Close"
        >
          &times;
        </button>
        {title && <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
};

export default Modal; 