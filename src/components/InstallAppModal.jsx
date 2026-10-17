import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Globe, X, CheckCircle2, ArrowRight } from 'lucide-react';

export default function InstallAppModal({ isOpen, onClose }) {
  const [canPrompt, setCanPrompt] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.deferredInstallPrompt) {
      setCanPrompt(true);
    }

    const handleInstallable = () => {
      setCanPrompt(true);
    };

    window.addEventListener('wellaqua:installable', handleInstallable);
    return () => {
      window.removeEventListener('wellaqua:installable', handleInstallable);
    };
  }, []);

  if (!isOpen) return null;

  const handleNativePrompt = async () => {
    if (typeof window !== 'undefined' && window.deferredInstallPrompt) {
      const promptEvent = window.deferredInstallPrompt;
      promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice && choice.outcome === 'accepted') {
        setInstallSuccess(true);
        window.deferredInstallPrompt = null;
        setCanPrompt(false);
        setTimeout(() => {
          onClose();
          setInstallSuccess(false);
        }, 2500);
      }
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 22px 16px',
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: '#ffffff',
              padding: '6px',
              borderRadius: '14px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}>
              <img 
                src="/well-aqua-logo-tight.png" 
                alt="Well Aqua" 
                style={{ width: '40px', height: 'auto', display: 'block' }} 
              />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Install Well Aqua App
              </h3>
              <p style={{ fontSize: '0.82rem', margin: '2px 0 0', opacity: 0.9 }}>
                Direct APK-like installation from Google Chrome
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 22px' }}>
          {installSuccess ? (
            <div style={{
              padding: '24px 16px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle2 size={46} color="#16a34a" />
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 700 }}>
                App Successfully Installed!
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                Well Aqua is now on your home screen. You can launch it anytime without a browser bar.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Direct Chrome Install Button if ready */}
              {canPrompt && (
                <button
                  type="button"
                  onClick={handleNativePrompt}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #007AFF 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.98rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 6px 18px rgba(2, 132, 199, 0.35)'
                  }}
                >
                  <Download size={20} />
                  <span>Tap to Install App Now (Chrome APK)</span>
                </button>
              )}

              {/* Instructions Guide */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  How to Install on Mobile Devices:
                </div>

                {/* Google Chrome on Android */}
                <div style={{
                  background: 'rgba(241, 245, 249, 0.8)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <div style={{
                    background: '#ffffff',
                    padding: '6px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    color: '#0284c7'
                  }}>
                    <Globe size={22} />
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#1e293b', lineHeight: 1.45 }}>
                    <div style={{ fontWeight: 700, marginBottom: '2px', color: '#0f172a' }}>
                      Google Chrome (Android):
                    </div>
                    <div>
                      1. Tap Chrome's menu icon <strong>(⋮)</strong> in top right.<br />
                      2. Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.<br />
                      3. Tap <strong>"Install"</strong> to download the WebAPK icon to your phone!
                    </div>
                  </div>
                </div>

                {/* Safari on iPhone */}
                <div style={{
                  background: 'rgba(241, 245, 249, 0.8)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <div style={{
                    background: '#ffffff',
                    padding: '6px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    color: '#000000'
                  }}>
                    <Smartphone size={22} />
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#1e293b', lineHeight: 1.45 }}>
                    <div style={{ fontWeight: 700, marginBottom: '2px', color: '#0f172a' }}>
                      Safari (iPhone / iPad):
                    </div>
                    <div>
                      1. Tap the <strong>Share</strong> button (square with arrow ↑) at the bottom.<br />
                      2. Scroll down and tap <strong>"Add to Home Screen"</strong>.<br />
                      3. Tap <strong>"Add"</strong> in the top-right corner.
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '0.78rem',
                color: '#065f46',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>Works offline, opens instantly in full screen with zero browser bars!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
