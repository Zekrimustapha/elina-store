'use client';

import { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center animate-in zoom-in-95 duration-300">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">تم تأكيد طلبك بنجاح</h3>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          شكراً لك! سيتصل بك فريقنا قريباً لتأكيد طلبك.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-colors"
        >
          حسناً
        </button>
      </div>
    </div>
  );
}
