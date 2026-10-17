import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Phone, 
  Lock, 
  MapPin, 
  Waves, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Cloud,
  ChevronRight,
  Fish,
  Eye,
  EyeOff,
  Download
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { generateFarmerUserId, syncUserToSupabase, authenticateFarmer } from '../utils/userIdGenerator';
import InstallAppModal from './InstallAppModal';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  onLoginSuccess,
  onAdminLoginSuccess
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Admin Passcode State
  const [showAdminPasscode, setShowAdminPasscode] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminPasscodeError, setAdminPasscodeError] = useState('');

  // Login form state (Passcode created in signup)
  const [phoneOrUserId, setPhoneOrUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign up form state
  const [signupForm, setSignupForm] = useState({
    name: '',
    phone: '',
    email: '',
    farmName: '',
    location: 'Bhimavaram, Andhra Pradesh',
    species: 'Vannamei Shrimp',
    pondCount: 3,
    acres: 5.0,
    pin: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdminPasscodeSubmit = (e) => {
    e.preventDefault();
    if (adminPasscode.trim() === '9900') {
      onClose();
      if (onAdminLoginSuccess) {
        onAdminLoginSuccess();
      }
    } else {
      setAdminPasscodeError('Incorrect passcode. Please try again.');
    }
  };

  // Farmer Passcode Login
  const handleFarmerLogin = async (e) => {
    e.preventDefault();
    if (!phoneOrUserId || !phoneOrUserId.trim()) {
      setErrorMessage('Please enter your Mobile Number or Farmer User ID (రైతు మొబైల్ / యూజర్ ID)');
      return;
    }
    if (!password || !password.trim()) {
      setErrorMessage('Please enter the password / passcode created during signup (రహస్య పాస్‌కోడ్)');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await authenticateFarmer(phoneOrUserId, password);
      if (result.success && result.user) {
        setIsLoading(false);
        onLoginSuccess(result.user);
        onClose();
        return;
      } else {
        setIsLoading(false);
        setErrorMessage(result.message || 'Incorrect passcode. Please enter the password you created during signup.');
      }
    } catch (err) {
      console.error('Farmer login error:', err);
      setIsLoading(false);
      setErrorMessage('Authentication error. Please verify your connection.');
    }
  };

  // Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!signupForm.name.trim()) {
      setErrorMessage('Please enter your full name (రైతు పేరు)');
      return;
    }
    if (!signupForm.phone || signupForm.phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!signupForm.farmName.trim()) {
      setErrorMessage('Please enter your farm or hatchery name');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    // Formulate a valid domain email for Supabase Auth (Supabase rejects fake domains like @wellaqua.farm)
    const cleanPhone = signupForm.phone.replace(/\D/g, '');
    const cleanName = signupForm.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'farmer';
    const emailToUse = signupForm.email && signupForm.email.includes('@')
      ? signupForm.email.trim().toLowerCase()
      : `${cleanName}.${cleanPhone}@gmail.com`;

    const rawPin = signupForm.pin ? String(signupForm.pin).trim() : '1234';
    const pwd = rawPin.length >= 6 ? rawPin : `${rawPin}123456`;

    const generatedUserId = generateFarmerUserId(cleanPhone, signupForm.name, signupForm.location);
    let finalUserId = generatedUserId;
    let createdUser = null;

    try {
      if (isSupabaseConfigured) {
        // 1. Sign up with Supabase Auth
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: emailToUse,
          password: pwd,
          options: {
            data: {
              farmerId: generatedUserId,
              name: signupForm.name.trim(),
              farmName: signupForm.farmName.trim(),
              phone: '+91 ' + cleanPhone,
              location: signupForm.location,
              species: signupForm.species,
              pondCount: Number(signupForm.pondCount) || 3,
              acres: Number(signupForm.acres) || 5.0,
              pin: rawPin
            }
          }
        });

        if (signUpError) {
          console.warn('Supabase auth signup notice:', signUpError.message);
          let friendlyMsg = signUpError.message;
          if (signUpError.message.toLowerCase().includes('rate limit')) {
            friendlyMsg = 'Supabase Email Rate Limit Exceeded! Please disable "Confirm email" in Supabase Dashboard (Authentication -> Providers -> Email -> Confirm email: OFF) to allow instant registration.';
          } else if (signUpError.message.toLowerCase().includes('already registered')) {
            friendlyMsg = 'This account is already registered! Please switch to Login tab or use another phone/email.';
          }
          setErrorMessage(friendlyMsg);
          setIsLoading(false);
          return;
        }

        createdUser = authData?.user;
        if (createdUser?.id) {
          finalUserId = createdUser.id;
        }

        // 2. Direct insert into Supabase 'public.profiles' table
        const profilePayload = {
          id: finalUserId,
          farmer_id: generatedUserId,
          full_name: signupForm.name.trim(),
          farm_name: signupForm.farmName.trim(),
          phone: '+91 ' + cleanPhone,
          email: emailToUse,
          login_pin: String(rawPin),
          location: signupForm.location,
          total_acres: Number(signupForm.acres) || 5.0,
          total_ponds: Number(signupForm.pondCount) || 3,
          primary_species: signupForm.species,
          caa_reg_no: 'CAA/2025/REG/' + Math.floor(10000 + Math.random() * 90000),
          mpeda_id: 'MPEDA-REG-' + Math.floor(1000 + Math.random() * 9000),
          updated_at: new Date().toISOString()
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(profilePayload, { onConflict: 'id' });

        if (profileError) {
          console.warn('Supabase profiles table upsert error:', profileError.message);
        } else {
          console.log('✅ Supabase profile successfully saved:', finalUserId);
        }

        // 3. Insert default initial pond in 'public.ponds'
        try {
          await supabase.from('ponds').insert([{
            farmer_id: finalUserId,
            name: 'Pond 1 - Primary Nursery',
            species: signupForm.species,
            area_hectares: Math.round(((Number(signupForm.acres) || 5.0) / 2.471) * 10) / 10,
            doc: 1,
            density_pl_m2: signupForm.species.includes('Vannamei') ? 45 : 25,
            stocking_date: new Date().toISOString().split('T')[0],
            status: 'active',
            fcr: 1.2
          }]);
        } catch (pondErr) {
          console.warn('Supabase pond insert notice:', pondErr);
        }
      }
    } catch (err) {
      console.warn('Supabase registration sync exception:', err);
    }

    // Automatically sync login credentials & user ID to Supabase user_logins table
    syncUserToSupabase({
      userId: generatedUserId,
      name: signupForm.name,
      farmName: signupForm.farmName,
      phone: cleanPhone,
      email: emailToUse,
      pin: rawPin,
      location: signupForm.location,
      totalAreaAcres: signupForm.acres,
      totalPondsCount: signupForm.pondCount,
      primarySpecies: signupForm.species,
      authUserId: createdUser?.id
    });

    setIsLoading(false);

    onLoginSuccess({
      id: finalUserId,
      userId: generatedUserId,
      farmerId: generatedUserId,
      name: signupForm.name.trim(),
      farmName: signupForm.farmName.trim(),
      phone: '+91 ' + cleanPhone,
      email: emailToUse,
      pin: rawPin,
      location: signupForm.location,
      caaRegNo: 'CAA/2025/REG/' + Math.floor(10000 + Math.random() * 90000),
      mpedaId: 'MPEDA-REG-' + Math.floor(1000 + Math.random() * 9000),
      totalAreaAcres: Number(signupForm.acres) || 5.0,
      totalPondsCount: Number(signupForm.pondCount) || 3,
      primarySpecies: signupForm.species
    });

    onClose();
  };

  return (
    <div className="auth-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Sleek Gradient Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          padding: '20px 22px 18px',
          position: 'relative'
        }}>
          {/* Close Button */}
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Close"
          >
            <X size={17} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: '#ffffff',
              padding: '4px 8px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}>
              <img 
                src="/well-aqua-logo-tight.png" 
                alt="Well Aqua" 
                style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
              />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                Well Aqua
              </h2>
              <p style={{ fontSize: '0.72rem', opacity: 0.9, margin: 0, fontWeight: 500 }}>
                Healthy and sustainable aquaculture
              </p>
            </div>
          </div>

          {/* Status Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.72rem',
              background: 'rgba(255, 255, 255, 0.16)',
              padding: '3px 8px',
              borderRadius: '20px',
              fontWeight: 600
            }}>
              <ShieldCheck size={13} color="#86efac" />
              <span>Farmer Portal</span>
            </div>

            {isSupabaseConfigured && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.72rem',
                background: 'rgba(16, 185, 129, 0.3)',
                border: '1px solid rgba(167, 243, 208, 0.5)',
                color: '#ecfdf5',
                padding: '3px 8px',
                borderRadius: '20px',
                fontWeight: 600
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
                <span>Supabase Live</span>
              </div>
            )}
          </div>
        </div>

        {/* Segmented Mode Switcher */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          padding: '4px',
          margin: '16px 20px 0',
          borderRadius: '12px',
          gap: '4px'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '9px 12px',
              fontSize: '0.86rem',
              fontWeight: 700,
              borderRadius: '9px',
              color: mode === 'login' ? '#0284c7' : '#64748b',
              background: mode === 'login' ? '#ffffff' : 'transparent',
              boxShadow: mode === 'login' ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 0.18s ease'
            }}
          >
            Sign In (లాగిన్)
          </button>

          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '9px 12px',
              fontSize: '0.86rem',
              fontWeight: 700,
              borderRadius: '9px',
              color: mode === 'signup' ? '#0284c7' : '#64748b',
              background: mode === 'signup' ? '#ffffff' : 'transparent',
              boxShadow: mode === 'signup' ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 0.18s ease'
            }}
          >
            Create Account (రిజిస్ట్రేషన్)
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '16px 20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Error Message */}
          {errorMessage && (
            <div style={{
              background: 'rgba(225, 29, 72, 0.08)',
              border: '1px solid #fecdd3',
              color: '#e11d48',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ===================== SIGN IN ===================== */}
          {mode === 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Chrome APK Install Banner */}
              <div 
                onClick={() => setShowInstallModal(true)}
                style={{
                  background: 'rgba(2, 132, 199, 0.08)',
                  border: '1px solid rgba(2, 132, 199, 0.25)',
                  borderRadius: '12px',
                  padding: '9px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={16} color="#0284c7" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0369a1' }}>
                    Install Well Aqua App (Chrome APK)
                  </span>
                </div>
                <span style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 700 }}>
                  Install 📲
                </span>
              </div>

              {/* Direct Passcode Login Form */}
              <form onSubmit={handleFarmerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="auth-input-group">
                  <label className="auth-input-label">Mobile Number or Farmer ID (రైతు ID)</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="text"
                      placeholder="e.g. 9848012345 or AQ-AP-1234-9921"
                      value={phoneOrUserId}
                      onChange={(e) => setPhoneOrUserId(e.target.value)}
                      className="auth-input"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label className="auth-input-label">Password / Passcode (రహస్య పాస్‌కోడ్)</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter the passcode created during signup"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input"
                      style={{ paddingRight: '40px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.92rem',
                    borderRadius: '12px',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  {isLoading ? 'Verifying Passcode...' : 'Sign In to Farm'}
                </button>
              </form>

              {/* ================= ADMIN PASSCODE LOGIN (DISCREET LINK) ================= */}
              <div style={{ marginTop: '8px', paddingTop: '10px', borderTop: '0.5px solid rgba(60, 60, 67, 0.12)', display: 'flex', justifyContent: 'center' }}>
                {!showAdminPasscode ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminPasscode(true);
                      setAdminPasscode('');
                      setAdminPasscodeError('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#007AFF',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px'
                    }}
                  >
                    <ShieldCheck size={14} color="#007AFF" />
                    <span>Admin Portal</span>
                    <ChevronRight size={13} />
                  </button>
                ) : (
                  <form
                    onSubmit={handleAdminPasscodeSubmit}
                    style={{
                      width: '100%',
                      background: 'rgba(118, 118, 128, 0.08)',
                      borderRadius: '14px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      border: '0.5px solid rgba(60, 60, 67, 0.15)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.84rem', color: '#000000' }}>
                        Admin Portal
                      </span>
                      <button
                        type="button"
                        onClick={() => { setShowAdminPasscode(false); setAdminPasscodeError(''); }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'rgba(60, 60, 67, 0.6)',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.74rem', color: 'rgba(60, 60, 67, 0.7)' }}>
                      Enter passcode to continue
                    </p>

                    {adminPasscodeError && (
                      <div style={{ color: '#FF3B30', fontSize: '0.75rem', fontWeight: 500 }}>
                        {adminPasscodeError}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="password"
                        maxLength={6}
                        autoFocus
                        placeholder="Passcode"
                        value={adminPasscode}
                        onChange={(e) => {
                          setAdminPasscode(e.target.value);
                          setAdminPasscodeError('');
                        }}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '0.5px solid rgba(60, 60, 67, 0.2)',
                          background: '#ffffff',
                          color: '#000000',
                          fontSize: '1rem',
                          letterSpacing: '0.25em',
                          fontWeight: 700,
                          textAlign: 'center',
                          outline: 'none'
                        }}
                      />

                      <button
                        type="submit"
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#007AFF',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        Unlock
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          )}

          {/* ===================== SIGN UP ===================== */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
              
              <div className="auth-input-group">
                <label className="auth-input-label">
                  <span>Farmer Full Name (రైతు పూర్తి పేరు) *</span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Ramesh Varma"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  className="auth-input"
                  required
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">
                  <span>Email Address (ఈమెయిల్) - Optional</span>
                </label>
                <input 
                  type="email"
                  placeholder="e.g. ramesh@gmail.com (Auto-generated if empty)"
                  value={signupForm.email || ''}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  className="auth-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="auth-input-group">
                  <label className="auth-input-label">Mobile Number</label>
                  <input 
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value.replace(/\D/g, '') })}
                    className="auth-input"
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <label className="auth-input-label">Farm / Hatchery</label>
                  <input 
                    type="text"
                    placeholder="e.g. Varma Farms"
                    value={signupForm.farmName}
                    onChange={(e) => setSignupForm({ ...signupForm, farmName: e.target.value })}
                    className="auth-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="auth-input-group">
                  <label className="auth-input-label">Location / District</label>
                  <select 
                    value={signupForm.location}
                    onChange={(e) => setSignupForm({ ...signupForm, location: e.target.value })}
                    className="auth-input"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <option value="Bhimavaram, Andhra Pradesh">Bhimavaram (AP)</option>
                    <option value="Nellore, Andhra Pradesh">Nellore (AP)</option>
                    <option value="Machilipatnam, Andhra Pradesh">Machilipatnam (AP)</option>
                    <option value="Kakinada, Andhra Pradesh">Kakinada (AP)</option>
                    <option value="Surat, Gujarat">Surat (Gujarat)</option>
                    <option value="Balasore, Odisha">Balasore (Odisha)</option>
                    <option value="Nagapattinam, Tamil Nadu">Nagapattinam (TN)</option>
                  </select>
                </div>

                <div className="auth-input-group">
                  <label className="auth-input-label">Species (జాతి)</label>
                  <select 
                    value={signupForm.species}
                    onChange={(e) => setSignupForm({ ...signupForm, species: e.target.value })}
                    className="auth-input"
                    style={{ fontSize: '0.84rem' }}
                  >
                    <option value="Vannamei Shrimp">Vannamei Shrimp</option>
                    <option value="Black Tiger Prawn">Black Tiger Prawn</option>
                    <option value="GIFT Tilapia">GIFT Tilapia</option>
                    <option value="Indian Major Carps">Carps (రోహు / కట్ల)</option>
                  </select>
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">Create Password / Passcode (రహస్య పాస్‌కోడ్)</label>
                <input 
                  type="password"
                  maxLength={16}
                  placeholder="Create your login passcode (e.g. 1234)"
                  value={signupForm.pin}
                  onChange={(e) => setSignupForm({ ...signupForm, pin: e.target.value })}
                  className="auth-input"
                  required
                />
                <p style={{ margin: '3px 0 0', fontSize: '0.73rem', color: '#0284c7' }}>
                  🔒 The passcode you create here will be used to log in.
                </p>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.92rem',
                  borderRadius: '12px',
                  justifyContent: 'center',
                  fontWeight: 700,
                  marginTop: '4px'
                }}
              >
                {isLoading ? 'Creating Farm Profile...' : 'Complete Registration & Start'}
              </button>
            </form>
          )}

          {/* Skip as Guest Option */}
          <div style={{ textAlign: 'center', paddingTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontWeight: 600,
                padding: '4px 8px'
              }}
            >
              Skip for now & Explore as Guest (అతిథిగా కొనసాగండి)
            </button>
          </div>

          {/* Bottom Security Note */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.72rem',
            color: '#64748b',
            paddingTop: '6px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <ShieldCheck size={13} color="#059669" />
            <span>MPEDA & CAA Compliant • Encrypted Farmer Data</span>
          </div>

        </div>

        {/* ================= PWA INSTALL MODAL ================= */}
        <InstallAppModal 
          isOpen={showInstallModal} 
          onClose={() => setShowInstallModal(false)} 
        />

      </div>
    </div>
  );
}
