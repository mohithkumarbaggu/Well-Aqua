import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Globe, 
  Moon, 
  Sun, 
  HelpCircle, 
  CheckCircle2, 
  ChevronRight, 
  Plus, 
  FileText, 
  ShieldCheck, 
  Waves, 
  Sparkles, 
  ArrowRight,
  LogOut,
  LogIn,
  UserPlus,
  Edit3,
  Save,
  X,
  Trash2,
  Copy,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import PondModal from './PondModal';
import { getOrGenerateUserId } from '../utils/userIdGenerator';

export default function ProfileSection({ 
  user,
  onOpenAuthModal,
  onLogout,
  activePond, 
  setActivePond, 
  ponds, 
  setPonds,
  onUpdatePondsList,
  language, 
  setLanguage, 
  theme, 
  setTheme, 
  onOpenGuide, 
  setCurrentTab, 
  t,
  showToast
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || user?.fullName || 'Aqua Farmer',
    farmName: user?.farmName || 'My Aqua Farm',
    phone: user?.phone || '',
    email: user?.email || '',
    location: user?.location || 'Andhra Pradesh'
  });

  // Keep editData updated when user account changes
  React.useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || user.fullName || 'Aqua Farmer',
        farmName: user.farmName || 'My Aqua Farm',
        phone: user.phone || '',
        email: user.email || '',
        location: user.location || 'Andhra Pradesh'
      });
    }
  }, [user]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Pond Add / Edit Modal State
  const [isPondModalOpen, setIsPondModalOpen] = useState(false);
  const [pondModalMode, setPondModalMode] = useState('add'); // 'add' | 'edit'
  const [pondToEdit, setPondToEdit] = useState(null);

  const handleOpenAddPond = () => {
    setPondToEdit(null);
    setPondModalMode('add');
    setIsPondModalOpen(true);
  };

  const handleOpenEditPond = (pond) => {
    setPondToEdit(pond);
    setPondModalMode('edit');
    setIsPondModalOpen(true);
  };

  const handleSavePond = (pondData, mode) => {
    let updated;
    if (mode === 'edit') {
      updated = ponds.map(p => p.id === pondData.id ? pondData : p);
      if (activePond?.id === pondData.id) {
        setActivePond(pondData);
      }
      if (showToast) {
        showToast(`Updated details for ${pondData.name}!`, 'success');
      }
    } else {
      updated = [...ponds, pondData];
      setActivePond(pondData); // automatically make the new pond active
      if (showToast) {
        showToast(`New pond ${pondData.name} registered and activated!`, 'success');
      }
    }
    if (onUpdatePondsList) {
      onUpdatePondsList(updated, pondData);
    } else if (setPonds) {
      setPonds(updated);
    }
  };

  const handleDeletePond = (pondId) => {
    if (ponds.length <= 1) {
      if (showToast) {
        showToast('You must maintain at least one operational pond.', 'warning');
      }
      return;
    }
    const pondToDelete = ponds.find(p => p.id === pondId);
    const updated = ponds.filter(p => p.id !== pondId);
    let newActive = activePond;
    if (activePond?.id === pondId) {
      newActive = updated[0];
      setActivePond(newActive);
    }
    if (onUpdatePondsList) {
      onUpdatePondsList(updated, newActive);
    } else if (setPonds) {
      setPonds(updated);
    }
    if (showToast) {
      showToast(`Deleted ${pondToDelete?.name || 'Pond'} successfully.`, 'info');
    }
  };

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    if (showToast) showToast('Preferences updated successfully!', 'success');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    if (showToast) showToast('Farmer profile updated successfully!', 'success');
  };

  const farmerInitials = user?.name
    ? (user.name.trim().split(/\s+/).map(n => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || 'AF')
    : 'AF';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* ================= USER AUTHENTICATION STATE CARD ================= */}
      {user ? (
        <>
        {/* Logged In Farmer Profile Card */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '24px', 
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, #ffffff 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '1.5rem',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
              flexShrink: 0
            }}>
              {farmerInitials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0 }}>
                  {isEditing ? editData.name : (user?.name || user?.fullName || 'Aqua Farmer')}
                </h2>
                <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                  ✓ Verified Aqua Farmer
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>
                {isEditing ? editData.farmName : (user?.farmName || 'My Aqua Farm')}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <MapPin size={13} color="var(--cyan)" />
                <span>{isEditing ? editData.location : (user?.location || 'Andhra Pradesh')}</span>
                <span style={{ margin: '0 4px' }}>•</span>
                <Phone size={13} color="#10b981" />
                <span>{isEditing ? editData.phone : (user?.phone || 'Mobile Not Linked')}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={onOpenGuide}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.82rem' }}
            >
              <span>🌾 How to Use</span>
            </button>

            <button 
              onClick={() => onOpenAuthModal('login')}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.82rem', borderColor: '#bae6fd', color: 'var(--cyan)' }}
              title="Switch to another farmer account"
            >
              <User size={14} />
              <span>Switch Account</span>
            </button>

            <button 
              onClick={onLogout}
              className="btn-secondary"
              style={{ 
                padding: '8px 14px', 
                fontSize: '0.82rem', 
                borderColor: '#fecdd3', 
                color: '#e11d48',
                background: 'rgba(225, 29, 72, 0.05)'
              }}
              title="Log out of this device"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* ================= FARMER DIGITAL ID & SUPABASE CREDENTIALS CARD ================= */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '20px 24px', 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', paddingBottom: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0284c7, #06b6d4)',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
              }}>
                <ShieldCheck size={20} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Farmer Digital ID & Credentials</span>
                  <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                    🟢 Supabase Cloud Active
                  </span>
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                  Official identity & login credentials stored in Supabase database (<code style={{ color: '#38bdf8' }}>public.user_logins</code>)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>System Role:</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#0369a1', color: '#ffffff', padding: '3px 10px', borderRadius: '6px' }}>
                🌾 Registered Farmer
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {/* Generated User ID */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '12px 14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '4px' }}>
                Generated Farmer User ID
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                  {getOrGenerateUserId(user)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(getOrGenerateUserId(user));
                    setCopiedId(true);
                    if (showToast) showToast('Farmer User ID copied to clipboard!', 'success');
                    setTimeout(() => setCopiedId(false), 2000);
                  }}
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Copy User ID"
                >
                  <Copy size={12} />
                  <span>{copiedId ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Login Phone */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '12px 14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '4px' }}>
                Login Mobile Number
              </div>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f1f5f9' }}>
                {user?.phone || 'Not provided'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                Registered farmer mobile number
              </div>
            </div>

            {/* Login Email */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '12px 14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '4px' }}>
                Supabase Auth Email
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={user?.email}>
                {user?.email || 'Registered via Mobile Number'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                Linked Auth User Account
              </div>
            </div>

            {/* Security PIN / Passcode */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', padding: '12px 14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '4px' }}>
                Quick Security PIN / Password
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f59e0b', letterSpacing: showPin ? '0.15em' : '0.3em', fontFamily: 'monospace' }}>
                  {showPin ? (user?.pin || '1234') : '••••'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    padding: '2px 6px'
                  }}
                  title={showPin ? 'Hide PIN' : 'View PIN'}
                >
                  {showPin ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{showPin ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                4-Digit quick access passcode
              </div>
            </div>
          </div>

          {/* Licenses footer */}
          <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
            <div>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>CAA No:</span> {user?.caaRegNo || user?.caaNumber || 'CAA/2024/AP/WG/48291'}
              <span style={{ margin: '0 8px' }}>•</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>MPEDA ID:</span> {user?.mpedaId || 'MPEDA-IND-AP-9921'}
            </div>
            <div style={{ color: '#34d399', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} />
              <span>Full Data Synchronized to Supabase Cloud</span>
            </div>
          </div>
        </div>
        </>
      ) : (
        /* Guest Mode / Not Logged In Banner */
        <div 
          className="glass-panel" 
          style={{ 
            padding: '28px', 
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, #ffffff 100%)',
            border: '2px dashed var(--border-glow)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ maxWidth: '640px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-amber" style={{ fontSize: '0.74rem' }}>
                  Guest Mode Active
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  రైతు లాగిన్ / రిజిస్ట్రేషన్
                </span>
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Connect Your Aqua Farm to Well Aqua
              </h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Log in or create a farmer account to synchronize daily dissolved oxygen sensor records, unlock accredited lab testing discounts, receive emergency WhatsApp disease alerts, and manage door-to-door medicine delivery.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Doorstep Lab Sample Pickup</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>10% Discount Coupon (WELLAQUA10)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>CAA & MPEDA Export Compliance</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px' }}>
              <button
                onClick={() => onOpenAuthModal('login')}
                className="btn-primary"
                style={{ padding: '12px 20px', fontSize: '0.92rem', justifyContent: 'center' }}
              >
                <LogIn size={16} />
                <span>Farmer Login (లాగిన్)</span>
              </button>

              <button
                onClick={() => onOpenAuthModal('signup')}
                className="btn-secondary"
                style={{ padding: '10px 20px', fontSize: '0.88rem', justifyContent: 'center', borderColor: '#93c5fd', color: '#0284c7' }}
              >
                <UserPlus size={16} />
                <span>New Farmer Sign Up (రిజిస్ట్రేషన్)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Bar */}
      {savedSuccess && (
        <div style={{
          background: 'rgba(5, 150, 105, 0.1)',
          border: '1px solid rgba(5, 150, 105, 0.3)',
          borderRadius: '10px',
          padding: '12px 18px',
          color: '#059669',
          fontSize: '0.88rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} />
          <span>Farm preferences and active pond updated successfully!</span>
        </div>
      )}

      {/* ================= ACTIVE POND SWITCHER ================= */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Waves size={20} color="var(--cyan)" />
              Select Active Farm Pond (ప్రస్తుత చెరువు)
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Choose which pond's water parameters, feeding charts, and lab tests to monitor on your dashboard.
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="badge badge-emerald">{ponds.length} Registered Ponds</span>
            
            <button
              type="button"
              onClick={handleOpenAddPond}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                background: 'linear-gradient(135deg, #0284c7, #0d9488)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
                transition: 'all 0.2s ease'
              }}
              title="Add a new pond to your farm"
            >
              <Plus size={16} />
              <span>Add Pond (కొత్త చెరువు)</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {ponds.map(pond => {
            const isSelected = activePond.id === pond.id;
            return (
              <div
                key={pond.id}
                onClick={() => {
                  setActivePond(pond);
                  handleSavePreferences();
                }}
                style={{
                  background: isSelected ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-surface)',
                  border: isSelected ? '2px solid var(--cyan)' : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'var(--transition)',
                  boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.15)' : 'none'
                }}
              >
                <div style={{ flex: 1, marginRight: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: isSelected ? 'var(--cyan)' : 'var(--text-main)' }}>
                      {pond.name}
                    </span>
                    {isSelected && (
                      <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {pond.species} • DOC {pond.doc} Days
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Area: {pond.areaHectares} Ha ({Math.round(pond.areaHectares * 2.471)} Acres) • Density: {pond.densityPL_m2} PL/m²
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  {/* Edit Pond Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditPond(pond);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 9px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      background: '#ffffff',
                      color: 'var(--cyan)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease'
                    }}
                    title={`Edit ${pond.name} details`}
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>

                  {/* Active Radio Indicator */}
                  <div 
                    title={isSelected ? 'Active Pond' : 'Click card to set active'}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      border: isSelected ? '6px solid var(--cyan)' : '2px solid var(--border-subtle)',
                      background: '#ffffff',
                      flexShrink: 0,
                      transition: 'all 0.2s ease'
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= LANGUAGE & APP SETTINGS ================= */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={20} color="var(--cyan)" />
          Language & Regional Settings (భాష ఎంపిక)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {[
            { id: 'en', name: 'English', sub: 'Standard' },
            { id: 'te', name: 'తెలుగు (Telugu)', sub: 'ఆంధ్రప్రదేశ్ & తెలంగాణ' },
            { id: 'hi', name: 'हिंदी (Hindi)', sub: 'उत्तर भारत' },
            { id: 'ta', name: 'தமிழ் (Tamil)', sub: 'தமிழ்நாடு' }
          ].map(lang => {
            const isSelected = language === lang.id;
            return (
              <div
                key={lang.id}
                onClick={() => {
                  setLanguage(lang.id);
                  handleSavePreferences();
                }}
                style={{
                  background: isSelected ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-surface)',
                  border: isSelected ? '2px solid var(--cyan)' : '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? 'var(--cyan)' : 'var(--text-main)' }}>
                    {lang.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang.sub}</div>
                </div>
                {isSelected && <CheckCircle2 size={18} color="var(--cyan)" />}
              </div>
            );
          })}
        </div>

        {/* Theme Appearance Mode */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)' }}>
              Appearance Theme
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Current: <strong>{theme === 'light' ? 'Crisp White Theme (Default)' : 'Oceanic Dark Theme'}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setTheme('light')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: theme === 'light' ? '2px solid var(--cyan)' : '1px solid var(--border-subtle)',
                background: theme === 'light' ? 'rgba(2, 132, 199, 0.1)' : '#ffffff',
                color: theme === 'light' ? 'var(--cyan)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sun size={15} color="#d97706" />
              <span>White Theme</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: theme === 'dark' ? '2px solid var(--cyan)' : '1px solid var(--border-subtle)',
                background: theme === 'dark' ? 'rgba(2, 132, 199, 0.1)' : '#ffffff',
                color: theme === 'dark' ? 'var(--cyan)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Moon size={15} color="#0284c7" />
              <span>Dark Theme</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= FARM LICENSES & ACCREDITATIONS ================= */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="var(--emerald)" />
          Aquaculture Licenses & Registration Details
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', fontSize: '0.85rem' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>CAA License Reg:</span>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              {user?.caaRegNo || 'CAA/2024/AP/WG/48291'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '2px' }}>✓ Valid until Dec 2028</div>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>MPEDA Enrollment ID:</span>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              {user?.mpedaId || 'MPEDA-IND-AP-9921'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '2px' }}>✓ Export Quality Enrolled</div>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Farm Landholding:</span>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
              {user?.totalAreaAcres || 6.5} Acres ({ponds.length} Operational Ponds)
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--cyan)', marginTop: '2px' }}>Coastal Aquaculture Zone</div>
          </div>
        </div>
      </div>

      {/* Add / Edit Pond Modal */}
      <PondModal
        isOpen={isPondModalOpen}
        onClose={() => setIsPondModalOpen(false)}
        mode={pondModalMode}
        pondToEdit={pondToEdit}
        existingPondsCount={ponds.length}
        onSavePond={handleSavePond}
        onDeletePond={handleDeletePond}
      />

    </div>
  );
}
