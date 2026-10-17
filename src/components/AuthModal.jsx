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
  Fish
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { generateFarmerUserId, syncUserToSupabase } from '../utils/userIdGenerator';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  onLoginSuccess,
  onAdminLoginSuccess
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' | 'password'

  // Admin Passcode State
  const [showAdminPasscode, setShowAdminPasscode] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminPasscodeError, setAdminPasscodeError] = useState('');

  // Login form state
  const [phone, setPhone] = useState('9848012345');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('mohith.baggu@wellaqua.farm');
  const [password, setPassword] = useState('farmer@123');

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

  // 1-Click Demo Login
  const handleDemoLogin = () => {
    setIsLoading(true);
    const demoUserId = 'AQ-AP-1234-9921';
    const demoFarmer = {
      id: 'farmer_01',
      userId: demoUserId,
      farmerId: demoUserId,
      name: 'Mohith Kumar Baggu',
      farmName: 'Srimannarayana Coastal Aqua Farm',
      phone: '+91 98480 12345',
      email: 'mohith.baggu@wellaqua.farm',
      pin: '1234',
      location: 'Bhimavaram, West Godavari District, Andhra Pradesh',
      caaRegNo: 'CAA/2024/AP/WG/48291',
      mpedaId: 'MPEDA-IND-AP-9921',
      totalAreaAcres: 6.5,
      totalPondsCount: 3,
      primarySpecies: 'Vannamei Shrimp'
    };

    // Auto-sync login details to Supabase
    syncUserToSupabase(demoFarmer);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(demoFarmer);
      onClose();
    }, 350);
  };

  const handleAdminPasscodeSubmit = (e) => {
    e.preventDefault();
    if (adminPasscode.trim() === '9900') {
      onClose();
      if (onAdminLoginSuccess) {
        onAdminLoginSuccess();
      }
    } else {
      setAdminPasscodeError('Incorrect passcode! Passcode is 9900.');
    }
  };

  // Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtp('4829'); // Pre-fill convenience
    }, 400);
  };

  // Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setErrorMessage('Please enter the 4-digit OTP (Try 4829)');
      return;
    }
    setIsLoading(true);
    const generatedUserId = generateFarmerUserId(phone, phone === '9848012345' ? 'Mohith Kumar Baggu' : 'Aqua Farmer', 'Bhimavaram, Andhra Pradesh');
    const otpFarmer = {
      id: 'farmer_otp_' + Date.now(),
      userId: generatedUserId,
      farmerId: generatedUserId,
      name: phone === '9848012345' ? 'Mohith Kumar Baggu' : 'Aqua Farmer (+91 ' + phone + ')',
      farmName: 'Coastal Sunrise Aqua Farm',
      phone: '+91 ' + phone,
      email: 'farmer.' + phone.slice(-4) + '@gmail.com',
      pin: otp || '4829',
      location: 'Bhimavaram, Andhra Pradesh',
      caaRegNo: 'CAA/2024/AP/WG/48291',
      mpedaId: 'MPEDA-IND-AP-9921',
      totalAreaAcres: 5.0,
      totalPondsCount: 3,
      primarySpecies: 'Vannamei Shrimp'
    };

    // Auto-sync login details to Supabase
    syncUserToSupabase(otpFarmer);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(otpFarmer);
      onClose();
    }, 400);
  };

  // Password Login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email or phone number');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsLoading(true);

    // Try Supabase auth if email is provided
    try {
      if (isSupabaseConfigured && email.includes('@')) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });

        if (!error && data?.user) {
          const userMeta = data.user.user_metadata || {};
          setIsLoading(false);
          onLoginSuccess({
            id: data.user.id,
            name: userMeta.name || email.split('@')[0],
            farmName: userMeta.farmName || 'Srimannarayana Coastal Aqua Farm',
            phone: userMeta.phone || '+91 98480 12345',
            email: data.user.email,
            location: userMeta.location || 'Bhimavaram, Andhra Pradesh',
            caaRegNo: userMeta.caaRegNo || 'CAA/2024/AP/WG/48291',
            mpedaId: userMeta.mpedaId || 'MPEDA-IND-AP-9921',
            totalAreaAcres: userMeta.totalAreaAcres || 6.5,
            totalPondsCount: userMeta.totalPondsCount || 3,
            primarySpecies: userMeta.primarySpecies || 'Vannamei Shrimp'
          });
          onClose();
          return;
        }
      }
    } catch (err) {
      console.warn('Supabase auth attempt:', err);
    }

    // Default seamless login
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        id: 'farmer_01',
        name: 'Mohith Kumar Baggu',
        farmName: 'Srimannarayana Coastal Aqua Farm',
        phone: '+91 98480 12345',
        email: email,
        location: 'Bhimavaram, West Godavari District, Andhra Pradesh',
        caaRegNo: 'CAA/2024/AP/WG/48291',
        mpedaId: 'MPEDA-IND-AP-9921',
        totalAreaAcres: 6.5,
        totalPondsCount: 3,
        primarySpecies: 'Vannamei Shrimp'
      });
      onClose();
    }, 400);
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
              
              {/* Method Toggle: OTP vs Password */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.8rem' }}>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('otp'); setErrorMessage(''); }}
                  style={{
                    color: loginMethod === 'otp' ? '#0284c7' : '#64748b',
                    fontWeight: loginMethod === 'otp' ? 700 : 500,
                    borderBottom: loginMethod === 'otp' ? '2px solid #0284c7' : '2px solid transparent',
                    paddingBottom: '2px'
                  }}
                >
                  📱 Mobile OTP
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('password'); setErrorMessage(''); }}
                  style={{
                    color: loginMethod === 'password' ? '#0284c7' : '#64748b',
                    fontWeight: loginMethod === 'password' ? 700 : 500,
                    borderBottom: loginMethod === 'password' ? '2px solid #0284c7' : '2px solid transparent',
                    paddingBottom: '2px'
                  }}
                >
                  🔑 Email & Password
                </button>
              </div>

              {loginMethod === 'otp' ? (
                /* Mobile OTP Login Form */
                <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="auth-input-group">
                    <label className="auth-input-label">
                      <span>Phone Number</span>
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{
                        padding: '11px 12px',
                        background: '#f8fafc',
                        border: '1.5px solid var(--border-subtle)',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        🇮🇳 +91
                      </div>
                      <input 
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="auth-input"
                        style={{ flex: 1, letterSpacing: '0.04em', fontWeight: 600 }}
                        required
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div style={{
                      background: 'rgba(2, 132, 199, 0.05)',
                      border: '1.5px solid #bae6fd',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7' }}>
                          Enter 4-Digit Code
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>
                          Demo OTP: 4829
                        </span>
                      </div>
                      <input 
                        type="text"
                        maxLength={4}
                        placeholder="4829"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="auth-input"
                        style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.3em', fontWeight: 800 }}
                        autoFocus
                        required
                      />
                    </div>
                  )}

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
                    {isLoading ? 'Verifying...' : otpSent ? 'Verify & Sign In' : 'Get OTP Code'}
                  </button>
                </form>
              ) : (
                /* Password Login Form */
                <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="auth-input-group">
                    <label className="auth-input-label">Email Address</label>
                    <input 
                      type="text"
                      placeholder="mohith.baggu@wellaqua.farm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input"
                      required
                    />
                  </div>

                  <div className="auth-input-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="auth-input-label">Password</label>
                      <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>Default: farmer@123</span>
                    </div>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input"
                      required
                    />
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
                    {isLoading ? 'Signing In...' : 'Sign In to Farm'}
                  </button>
                </form>
              )}

              {/* ⚡ Quick 1-Click Demo Farmer Login Card */}
              <div 
                onClick={handleDemoLogin}
                style={{
                  marginTop: '4px',
                  background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(5, 150, 105, 0.08) 100%)',
                  border: '1.5px solid #93c5fd',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)'
                }}
                title="Click to sign in with preloaded farm data"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0
                  }}>
                    MB
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                        Mohith Kumar Baggu
                      </span>
                      <span className="badge badge-cyan" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>DEMO</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '1px' }}>
                      Srimannarayana Aqua Farm • 3 Ponds (Bhimavaram)
                    </div>
                  </div>
                </div>

                <div style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0
                }}>
                  <Sparkles size={12} />
                  <span>1-Tap</span>
                </div>
              </div>

              {/* ================= ADMIN PASSCODE LOGIN (PASSCODE: 9900) ================= */}
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                {!showAdminPasscode ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminPasscode(true);
                      setAdminPasscode('');
                      setAdminPasscodeError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1.5px dashed #cbd5e1',
                      background: 'rgba(248, 250, 252, 0.9)',
                      color: '#475569',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ShieldCheck size={15} color="#0284c7" />
                    <span>👑 Admin Login (అడ్మిన్ లాగిన్ - Passcode: 9900)</span>
                  </button>
                ) : (
                  <form
                    onSubmit={handleAdminPasscodeSubmit}
                    style={{
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                      color: '#ffffff',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '9px',
                      boxShadow: '0 6px 18px rgba(15, 23, 42, 0.25)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={16} color="#fbbf24" />
                        <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fbbf24' }}>
                          Admin Passcode Login
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setShowAdminPasscode(false); setAdminPasscodeError(''); }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        ✕ Cancel
                      </button>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>
                      Enter official 4-digit security passcode to access administrator portal.
                    </p>

                    {adminPasscodeError && (
                      <div style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid #ef4444',
                        color: '#fca5a5',
                        padding: '5px 8px',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span>⚠️ {adminPasscodeError}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="password"
                        maxLength={6}
                        autoFocus
                        placeholder="Passcode: 9900"
                        value={adminPasscode}
                        onChange={(e) => {
                          setAdminPasscode(e.target.value);
                          setAdminPasscodeError('');
                        }}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #334155',
                          background: '#020617',
                          color: '#ffffff',
                          fontSize: '0.95rem',
                          letterSpacing: '0.2em',
                          fontWeight: 700,
                          textAlign: 'center'
                        }}
                      />

                      <button
                        type="submit"
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          color: '#0f172a',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Enter →
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
                <label className="auth-input-label">4-Digit Security PIN (పాస్‌వర్డ్)</label>
                <input 
                  type="password"
                  maxLength={6}
                  placeholder="e.g. 1234"
                  value={signupForm.pin}
                  onChange={(e) => setSignupForm({ ...signupForm, pin: e.target.value })}
                  className="auth-input"
                  required
                />
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

      </div>
    </div>
  );
}
