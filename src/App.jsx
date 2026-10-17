import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import LabBookingSection from './components/LabBookingSection';
import MedicineStoreSection from './components/MedicineStoreSection';
import PondPerformanceSection from './components/PondPerformanceSection';
import CartDrawer from './components/CartDrawer';
import LabReportModal from './components/LabReportModal';
import FarmerGuideModal from './components/FarmerGuideModal';
import ProfileSection from './components/ProfileSection';
import AuthModal from './components/AuthModal';
import AuthScreen from './components/AuthScreen';
import Toast from './components/Toast';
import FarmReportModal from './components/FarmReportModal';
import AdminPortal from './components/AdminPortal';
import { getFarmerPonds, getFarmerBookings } from './utils/farmDataHelper';
import { getOrGenerateUserId } from './utils/userIdGenerator';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';

import { 
  MOCK_POND_BATCHES, 
  MOCK_LAB_BOOKINGS 
} from './data/mockData';
import { TRANSLATIONS } from './data/translations';

import { 
  LayoutDashboard, 
  FlaskConical, 
  Pill, 
  TrendingUp, 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  Heart,
  Waves, 
  User
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  // User Authentication State: prompts login/signup first on open!
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('well_aqua_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [ponds, setPonds] = useState(() => getFarmerPonds(user));
  const [activePond, setActivePond] = useState(() => {
    const list = getFarmerPonds(user);
    return list[0] || MOCK_POND_BATCHES[0];
  });
  const [bookings, setBookings] = useState(() => getFarmerBookings(user));
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isFarmReportModalOpen, setIsFarmReportModalOpen] = useState(false);

  const [isGuest, setIsGuest] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Admin Inspection State
  const [inspectingFarmer, setInspectingFarmer] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const handleInspectFarmer = (farmer) => {
    setInspectingFarmer(farmer);
    const farmerUser = {
      id: farmer.id,
      name: farmer.name,
      email: farmer.email,
      phone: farmer.phone,
      farmName: farmer.farmName,
      location: farmer.location,
      totalPonds: farmer.pondsCount || 4,
      caaNumber: farmer.caaNumber,
      isGuest: false
    };
    setUser(farmerUser);
    const farmerPonds = getFarmerPonds(farmerUser);
    setPonds(farmerPonds);
    if (farmerPonds && farmerPonds.length > 0) {
      setActivePond(farmerPonds[0]);
    }
    setCurrentTab('dashboard');
    showToast(`Inspecting Farm: ${farmer.farmName} (${farmer.name})`, 'info');
  };

  const handleExitInspection = () => {
    setInspectingFarmer(null);
    setCurrentTab('admin');
    showToast('Exited farm inspection mode. Back in Admin Portal.', 'info');
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (farmerData) => {
    const generatedId = getOrGenerateUserId(farmerData);
    const standardizedFarmer = {
      ...farmerData,
      userId: generatedId,
      farmerId: generatedId
    };
    setUser(standardizedFarmer);
    setIsGuest(false);
    try {
      localStorage.setItem('well_aqua_user', JSON.stringify(standardizedFarmer));
    } catch (e) {
      console.warn('Storage save notice:', e);
    }
    const farmerPonds = getFarmerPonds(standardizedFarmer);
    const farmerBookings = getFarmerBookings(standardizedFarmer);
    setPonds(farmerPonds);
    setActivePond(farmerPonds[0] || farmerPonds);
    setBookings(farmerBookings);
    showToast(`Welcome, ${standardizedFarmer.name}! User ID: ${generatedId}`, 'success');
  };

  const handleUpdatePondReport = (updatedPond) => {
    setActivePond(updatedPond);
    const updatedPonds = ponds.map(p => p.id === updatedPond.id ? updatedPond : p);
    setPonds(updatedPonds);
    if (user?.id) {
      try {
        localStorage.setItem(`well_aqua_ponds_${user.id}`, JSON.stringify(updatedPonds));
      } catch (e) {
        console.warn('Save pond data error:', e);
      }
    }
    showToast(`Farm report updated for ${updatedPond.name}!`, 'success');
  };

  const handleUpdatePondsList = (updatedPonds, newActivePond) => {
    setPonds(updatedPonds);
    if (newActivePond) {
      setActivePond(newActivePond);
    } else if (!updatedPonds.some(p => p.id === activePond?.id)) {
      setActivePond(updatedPonds[0] || null);
    }
    const storageKey = user?.id ? `well_aqua_ponds_${user.id}` : 'well_aqua_ponds_guest';
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedPonds));
    } catch (e) {
      console.warn('Save pond list error:', e);
    }
    if (user) {
      const updatedUser = { ...user, totalPondsCount: updatedPonds.length, totalPonds: updatedPonds.length };
      setUser(updatedUser);
      try {
        localStorage.setItem('well_aqua_user', JSON.stringify(updatedUser));
      } catch (e) {}
    }
  };

  const handleLogout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Supabase signOut error:', e);
    }
    try {
      localStorage.removeItem('well_aqua_user');
    } catch (e) {}
    setUser(null);
    setIsGuest(false);
    showToast('Logged out successfully.', 'info');
  };
  
  // Theme state: White / Light theme by default
  const [theme, setTheme] = useState('light');
  // Language state
  const [language, setLanguage] = useState('en');

  // Sync Supabase Auth session on startup
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        const u = data.session.user;
        const meta = u.user_metadata || {};
        setUser({
          id: u.id,
          name: meta.name || 'Mohith Kumar Baggu',
          farmName: meta.farmName || 'Srimannarayana Coastal Aqua Farm',
          phone: meta.phone || '+91 98480 12345',
          email: u.email || 'mohith.baggu@wellaqua.farm',
          location: meta.location || 'Bhimavaram, West Godavari District, Andhra Pradesh',
          caaRegNo: meta.caaRegNo || 'CAA/2024/AP/WG/48291',
          mpedaId: meta.mpedaId || 'MPEDA-IND-AP-9921',
          totalAreaAcres: meta.acres || 6.5,
          totalPondsCount: meta.pondCount || 3,
          primarySpecies: meta.species || 'Vannamei Shrimp'
        });
      }
    }).catch(err => console.warn('Supabase session load:', err));

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const meta = u.user_metadata || {};
        setUser({
          id: u.id,
          name: meta.name || 'Mohith Kumar Baggu',
          farmName: meta.farmName || 'Srimannarayana Coastal Aqua Farm',
          phone: meta.phone || '+91 98480 12345',
          email: u.email || 'mohith.baggu@wellaqua.farm',
          location: meta.location || 'Bhimavaram, West Godavari District, Andhra Pradesh',
          caaRegNo: meta.caaRegNo || 'CAA/2024/AP/WG/48291',
          mpedaId: meta.mpedaId || 'MPEDA-IND-AP-9921',
          totalAreaAcres: meta.acres || 6.5,
          totalPondsCount: meta.pondCount || 3,
          primarySpecies: meta.species || 'Vannamei Shrimp'
        });
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Sync theme attribute to document body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Current translation bundle
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleAdminLoginSuccess = () => {
    const adminUser = {
      id: 'admin_master',
      name: 'System Administrator',
      farmName: 'Well Aqua Central Command',
      email: 'admin@wellaqua.farm',
      phone: '+91 99000 00000',
      role: 'ADMIN',
      isAdmin: true,
      totalAreaAcres: 50,
      totalPondsCount: 15
    };
    setUser(adminUser);
    setIsGuest(false);
    try {
      localStorage.setItem('well_aqua_user', JSON.stringify(adminUser));
    } catch (e) {}
    setCurrentTab('admin');
    showToast('👑 Admin Access Granted (Passcode Verified)', 'success');
  };

  // If not logged in and not exploring as guest, render FULLSCREEN Auth portal!
  if (!user && !isGuest) {
    return (
      <>
        <AuthScreen
          onLoginSuccess={handleLoginSuccess}
          onContinueGuest={() => setIsGuest(true)}
          onAdminLoginSuccess={handleAdminLoginSuccess}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activePond={activePond}
        cartCount={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        onOpenGuide={() => setIsGuideOpen(true)}
        user={user}
        onOpenAuthModal={handleOpenAuth}
        t={t}
      />

      {/* Admin Farm Inspection Banner */}
      {inspectingFarmer && currentTab !== 'admin' && (
        <div style={{
          background: 'linear-gradient(90deg, #0f172a, #1e293b)',
          color: '#f8fafc',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '2px solid #f59e0b',
          fontSize: '0.85rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ 
              background: '#f59e0b', 
              color: '#0f172a', 
              padding: '2px 8px', 
              borderRadius: '4px', 
              fontWeight: 800, 
              fontSize: '0.72rem',
              letterSpacing: '0.04em'
            }}>
              👑 ADMIN INSPECTION MODE
            </span>
            <span>
              Currently viewing <strong>{inspectingFarmer.name}</strong> • <em>{inspectingFarmer.farmName} ({inspectingFarmer.location})</em>
            </span>
          </div>
          <button
            onClick={handleExitInspection}
            style={{
              background: '#f59e0b',
              color: '#0f172a',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 14px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            ← Return to Admin Portal
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="main-wrapper" style={{ flex: 1 }}>
        {currentTab === 'admin' && (
          <AdminPortal
            onSwitchToFarmer={() => setCurrentTab('dashboard')}
            onInspectFarmer={handleInspectFarmer}
            currentUser={user}
            showToast={showToast}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardOverview
            activePond={activePond}
            setCurrentTab={setCurrentTab}
            bookings={bookings}
            t={t}
            onOpenGuide={() => setIsGuideOpen(true)}
            user={user}
            onOpenReportModal={() => setIsFarmReportModalOpen(true)}
          />
        )}

        {currentTab === 'lab' && (
          <LabBookingSection
            activePond={activePond}
            ponds={ponds}
            bookings={bookings}
            setBookings={setBookings}
            setSelectedReport={setSelectedReport}
            setIsReportModalOpen={setIsReportModalOpen}
            showToast={showToast}
          />
        )}

        {currentTab === 'pharmacy' && (
          <MedicineStoreSection
            cart={cart}
            setCart={setCart}
            setIsCartOpen={setIsCartOpen}
            showToast={showToast}
          />
        )}

        {currentTab === 'performance' && (
          <PondPerformanceSection
            activePond={activePond}
            setActivePond={setActivePond}
            ponds={ponds}
            onOpenReportModal={() => setIsFarmReportModalOpen(true)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileSection
            user={user}
            onOpenAuthModal={handleOpenAuth}
            onLogout={handleLogout}
            activePond={activePond}
            setActivePond={setActivePond}
            ponds={ponds}
            setPonds={setPonds}
            onUpdatePondsList={handleUpdatePondsList}
            language={language}
            setLanguage={setLanguage}
            theme={theme}
            setTheme={setTheme}
            onOpenGuide={() => setIsGuideOpen(true)}
            setCurrentTab={setCurrentTab}
            t={t}
            showToast={showToast}
          />
        )}
      </main>

      {/* Real Farm Report Data Entry Modal */}
      <FarmReportModal
        isOpen={isFarmReportModalOpen}
        onClose={() => setIsFarmReportModalOpen(false)}
        activePond={activePond}
        onSaveReport={handleUpdatePondReport}
      />

      {/* Farmer Authentication Modal (Login / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
        onAdminLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Toast Notification Banner */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />

      {/* Farmer Onboarding / How to Use Guide Modal */}
      <FarmerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        setCurrentTab={setCurrentTab}
        language={language}
      />

      {/* Cart Drawer Slide-over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
      />

      {/* Certified Lab Report Modal */}
      {isReportModalOpen && (
        <LabReportModal
          report={selectedReport}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}

      {/* Mobile Sticky Bottom Navigation for field farmers */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <button 
          onClick={() => setCurrentTab('dashboard')} 
          className={`mobile-tab-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>

        <button 
          onClick={() => setCurrentTab('lab')} 
          className={`mobile-tab-btn ${currentTab === 'lab' ? 'active' : ''}`}
        >
          <FlaskConical size={20} />
          <span>Lab Test</span>
        </button>

        <button 
          onClick={() => setCurrentTab('pharmacy')} 
          className={`mobile-tab-btn ${currentTab === 'pharmacy' ? 'active' : ''}`}
        >
          <Pill size={20} />
          <span>Store</span>
        </button>

        <button 
          onClick={() => setCurrentTab('performance')} 
          className={`mobile-tab-btn ${currentTab === 'performance' ? 'active' : ''}`}
        >
          <TrendingUp size={20} />
          <span>Report</span>
        </button>

        <button 
          onClick={() => setCurrentTab('profile')} 
          className={`mobile-tab-btn ${currentTab === 'profile' ? 'active' : ''}`}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>

      {/* Footer */}
      <footer style={{
        background: 'rgba(5, 11, 20, 0.95)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '36px 20px 48px',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ background: '#ffffff', padding: '3px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                <img src="/well-aqua-logo-tight.png" alt="Well Aqua" style={{ height: '26px', width: 'auto' }} />
              </div>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>Well <span style={{ color: 'var(--cyan)' }}>Aqua</span></span>
            </div>
            <p style={{ maxWidth: '480px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
              Healthy and sustainable aquaculture. Dedicated to empowering shrimp and fish farmers with scientific advisory, certified lab testing networks, genuine aquatic medicines, and harvest analytics.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PhoneCall size={16} color="var(--cyan)" />
              <span>Farmer Toll-Free: <strong>1800-425-AQUA (2782)</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={16} color="#10b981" />
              <span>WhatsApp Agro-Doctor: <strong>+91 94401 22334</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
              <ShieldCheck size={14} color="#10b981" /> MPEDA & CAA Compliant
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
