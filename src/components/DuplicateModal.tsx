'use client';

import { useEffect } from 'react';

interface DuplicateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DuplicateModal({ isOpen, onClose }: DuplicateModalProps) {
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
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-amber-100 mb-6">
          <svg className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">لقد قمت بإرسال طلبية من قبل</h3>
        <p className="text-gray-700 mb-2 text-lg">
          تم تسجيل طلبيتك بنجاح، وسيتصل بك فريقنا لتأكيدها.
        </p>
        <p className="text-gray-500 mb-8">
          يمكنك إرسال طلبية جديدة بعد 24 ساعة.
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
