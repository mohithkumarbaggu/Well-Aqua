import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isError = toast.type === 'error';

  return (
    <div 
      className="toast-container" 
      role="alert" 
      aria-live="assertive"
    >
      <div 
        className="toast-card"
        style={{
          borderLeftColor: isError ? '#e11d48' : isSuccess ? '#10b981' : '#0284c7'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isSuccess && <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />}
          {isError && <AlertCircle size={18} color="#e11d48" style={{ flexShrink: 0 }} />}
          {!isSuccess && !isError && <Info size={18} color="#0284c7" style={{ flexShrink: 0 }} />}
          
          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {toast.message}
          </div>
        </div>

        <button 
          onClick={onClose}
          style={{ 
            color: 'var(--text-dim)', 
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px'
          }}
          aria-label="Close notification"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
