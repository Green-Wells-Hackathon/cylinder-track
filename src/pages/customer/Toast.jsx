// components/Toast.jsx
import React, { useState, useEffect } from 'react';

export const Toast = () => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleShowToast = (event) => {
      setToast(event.detail);
      setTimeout(() => setToast(null), 3000);
    };

    window.addEventListener('showToast', handleShowToast);
    return () => window.removeEventListener('showToast', handleShowToast);
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl border-l-4 border-green-700">
        <div className="flex items-center space-x-3">
          <div className="animate-bounce">✅</div>
          <div>
            <div className="font-bold text-sm">Item Added!</div>
            <div className="text-sm opacity-90">{toast.message}</div>
          </div>
        </div>
      </div>
    </div>
  );
};