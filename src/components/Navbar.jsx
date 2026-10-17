import React from 'react';
import { 
  LayoutDashboard, 
  FlaskConical, 
  Pill, 
  TrendingUp, 
  ShoppingCart, 
  User, 
  Waves,
  LogIn,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  activePond, 
  cartCount, 
  setIsCartOpen, 
  onOpenGuide,
  user,
  onOpenAuthModal,
  t
}) {
  return (
    <header className="navbar">
      <div className="nav-container">
        
        {/* Brand / Logo */}
        <div className="nav-brand" onClick={() => setCurrentTab('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <img 
            src="/well-aqua-logo-transparent.png" 
            alt="Well Aqua" 
            style={{ 
              height: '38px', 
              width: 'auto', 
              objectFit: 'contain'
            }} 
          />
          <div className="hide-mobile" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="badge badge-emerald" style={{ fontSize: '0.6rem', padding: '1px 6px', width: 'fit-content' }}>
              ECO PORTAL
            </span>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500, margin: '2px 0 0 0' }}>
              {t.tagline || 'Healthy and sustainable aquaculture'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs or Admin Command Banner */}
        {currentTab === 'admin' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              border: '1.5px solid #f59e0b',
              padding: '6px 14px',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 10px rgba(245, 158, 11, 0.2)'
            }}>
              <ShieldCheck size={16} color="#fbbf24" />
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fbbf24', letterSpacing: '0.04em' }}>
                SUPER-ADMIN COMMAND CENTER
              </span>
              <span style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fef08a', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                Passcode: 9900
              </span>
            </div>
            <span className="hide-mobile" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Full User Control • Send Water & Soil Lab Readings • Broadcast Advisories
            </span>
          </div>
        ) : (
          <nav className="nav-tabs desktop-only" aria-label="Main Navigation">
            <button 
              className={`nav-tab-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentTab('dashboard')}
            >
              <LayoutDashboard size={16} />
              <span>{t.dashboard}</span>
            </button>

            <button 
              className={`nav-tab-btn ${currentTab === 'lab' ? 'active' : ''}`}
              onClick={() => setCurrentTab('lab')}
            >
              <FlaskConical size={16} />
              <span>{t.labBooking}</span>
            </button>

            <button 
              className={`nav-tab-btn ${currentTab === 'pharmacy' ? 'active' : ''}`}
              onClick={() => setCurrentTab('pharmacy')}
            >
              <Pill size={16} />
              <span>{t.pharmacy}</span>
            </button>

            <button 
              className={`nav-tab-btn ${currentTab === 'performance' ? 'active' : ''}`}
              onClick={() => setCurrentTab('performance')}
            >
              <TrendingUp size={16} />
              <span>{t.reports}</span>
            </button>

            <button 
              className={`nav-tab-btn ${currentTab === 'profile' ? 'active' : ''}`}
              onClick={() => setCurrentTab('profile')}
            >
              <User size={16} />
              <span>Profile</span>
            </button>
          </nav>
        )}

        {/* Quick Right Action (Farmer Profile Avatar or Login Button) */}
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>

          {/* Show Admin Portal button ONLY if verified logged-in user is an ADMIN and not currently on admin tab */}
          {(user?.role === 'ADMIN' || user?.isAdmin) && currentTab !== 'admin' && (
            <button
              onClick={() => setCurrentTab('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 11px',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                color: '#1e293b',
                fontWeight: 700,
                fontSize: '0.8rem',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                marginRight: '8px'
              }}
              title="Open Admin Command Portal"
            >
              <ShieldCheck size={14} color="#0284c7" />
              <span className="hide-xs">Admin Control</span>
            </button>
          )}

          {/* Admin Return Button or Farmer Profile Avatar */}
          {currentTab === 'admin' ? (
            <button
              onClick={() => setCurrentTab('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1.5px solid #0284c7',
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
              }}
              title="Switch view to standard farmer application"
            >
              <span>← Switch to Farmer App</span>
            </button>
          ) : user ? (
            <button
              onClick={() => setCurrentTab('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                borderRadius: '20px',
                border: currentTab === 'profile' ? '2px solid var(--cyan)' : '1px solid var(--border-subtle)',
                background: currentTab === 'profile' ? 'rgba(2, 132, 199, 0.1)' : '#ffffff',
                color: currentTab === 'profile' ? 'var(--cyan)' : 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.82rem',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer'
              }}
              title={`Logged in as ${user?.name || 'Farmer'}`}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                {(user?.name || 'Farmer').trim().split(/\s+/).map(p => p[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || 'MB'}
              </div>
              <span className="hide-xs" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span>{(user?.name || 'Farmer').trim().split(/\s+/)[0] || 'Profile'}</span>
                {(user?.userId || user?.farmerId) && (
                  <span style={{ 
                    fontSize: '0.62rem', 
                    background: 'rgba(2, 132, 199, 0.12)', 
                    color: '#0284c7', 
                    padding: '1px 5px', 
                    borderRadius: '4px', 
                    fontFamily: 'monospace', 
                    fontWeight: 800,
                    letterSpacing: '0.02em'
                  }}>
                    {user.userId || user.farmerId}
                  </span>
                )}
              </span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuthModal('login')}
              className="btn-primary"
              style={{
                padding: '6px 11px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap'
              }}
              title="Farmer Login / Sign Up"
            >
              <LogIn size={14} />
              <span>Login</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
