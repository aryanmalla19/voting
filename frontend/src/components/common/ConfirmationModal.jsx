"use client"

import { FaExclamationTriangle, FaTimes } from "react-icons/fa"

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 h-6 w-6 mr-3" />
            <h2 className="text-xl font-semibold text-neutral-dark">{title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>
        <p className="text-neutral-dark mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="btn btn-outline border-gray-300 text-neutral-dark hover:bg-gray-100">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="btn btn-danger bg-red-600 hover:bg-red-700 text-white">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
