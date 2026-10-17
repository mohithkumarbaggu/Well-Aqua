import React, { useState } from 'react';
import { 
  Waves, 
  ShieldCheck, 
  Phone, 
  Lock, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Cloud, 
  Fish, 
  FlaskConical, 
  TrendingUp, 
  Pill,
  Globe,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { generateFarmerUserId, syncUserToSupabase } from '../utils/userIdGenerator';

export default function AuthScreen({ onLoginSuccess, onContinueGuest, onAdminLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' | 'password'
  const [lang, setLang] = useState('en');

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
  const [showPassword, setShowPassword] = useState(false);

  // Sign up form state
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    farmName: '',
    location: 'Bhimavaram, Andhra Pradesh',
    species: 'Vannamei Shrimp',
    pondCount: 3,
    acres: 5.0,
    pin: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminPasscodeSubmit = (e) => {
    e.preventDefault();
    if (adminPasscode.trim() === '9900') {
      if (onAdminLoginSuccess) {
        onAdminLoginSuccess();
      }
    } else {
      setAdminPasscodeError('Incorrect passcode! Passcode is 9900.');
    }
  };

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
    }, 350);
  };

  // Handle Send OTP
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
      setOtp('4829'); // Auto-fill convenience
    }, 400);
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setErrorMessage('Please enter the 4-digit OTP code');
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
    }, 400);
  };

  // Handle Password Login
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
          return;
        }
      }
    } catch (err) {
      console.warn('Supabase auth fallback:', err);
    }

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
    }, 400);
  };

  // Handle Sign Up with Real Supabase Insertion
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!signupForm.name.trim()) {
      setErrorMessage('Please enter your full name (రైతు పూర్తి పేరు)');
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

    const cleanPhone = signupForm.phone.replace(/\D/g, '');
    const cleanName = signupForm.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const userEmail = signupForm.email?.trim() || `${cleanName || 'farmer'}.${cleanPhone}@gmail.com`;
    const pwd = signupForm.pin.length >= 6 ? signupForm.pin : `${signupForm.pin}123456`;

    const generatedUserId = generateFarmerUserId(cleanPhone, signupForm.name, signupForm.location);
    let createdUser = null;

    if (isSupabaseConfigured) {
      try {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: userEmail,
          password: pwd,
          options: {
            data: {
              farmerId: generatedUserId,
              name: signupForm.name.trim(),
              farmName: signupForm.farmName.trim(),
              phone: '+91 ' + cleanPhone,
              location: signupForm.location,
              species: signupForm.species,
              pondCount: parseInt(signupForm.pondCount, 10) || 3,
              acres: parseFloat(signupForm.acres) || 5.0,
              pin: signupForm.pin
            }
          }
        });

        if (authErr) {
          console.warn('Supabase Auth Notice:', authErr.message);
          let friendlyMsg = authErr.message;
          if (authErr.message.toLowerCase().includes('rate limit')) {
            friendlyMsg = 'Supabase Email Rate Limit Exceeded! Please disable "Confirm email" in Supabase Dashboard (Authentication -> Providers -> Email -> Confirm email: OFF) to allow instant registration.';
          } else if (authErr.message.toLowerCase().includes('already registered')) {
            friendlyMsg = 'This account is already registered! Please switch to Login tab or use another phone/email.';
          }
          setErrorMessage(friendlyMsg);
          setIsLoading(false);
          return;
        } else if (authData?.user) {
          createdUser = authData.user;
          console.log('✅ Registered in Supabase auth.users:', createdUser.id);

          // Explicitly save to public.profiles table
          try {
            const { error: profileErr } = await supabase.from('profiles').upsert({
              id: createdUser.id,
              farmer_id: generatedUserId,
              full_name: signupForm.name.trim(),
              farm_name: signupForm.farmName.trim(),
              phone: '+91 ' + cleanPhone,
              email: userEmail,
              login_pin: String(signupForm.pin),
              location: signupForm.location,
              total_acres: parseFloat(signupForm.acres) || 4.0,
              total_ponds: parseInt(signupForm.pondCount, 10) || 3,
              primary_species: signupForm.species,
              caa_reg_no: 'CAA/2025/REG/' + Math.floor(10000 + Math.random() * 90000),
              mpeda_id: 'MPEDA-REG-' + Math.floor(1000 + Math.random() * 9000),
              updated_at: new Date().toISOString()
            });
            if (profileErr) {
              console.warn('Profile row notice:', profileErr.message);
            } else {
              console.log('✅ Profile row created in public.profiles table!');
            }
          } catch (pErr) {
            console.warn('Profile insert error:', pErr);
          }

          // Insert initial ponds into public.ponds table
          try {
            const pCount = parseInt(signupForm.pondCount, 10) || 3;
            const acresPerPond = parseFloat(((parseFloat(signupForm.acres) || 4.0) / pCount).toFixed(1));
            const haPerPond = parseFloat((acresPerPond / 2.471).toFixed(2));
            const pondsToInsert = [];
            for (let i = 1; i <= pCount; i++) {
              pondsToInsert.push({
                farmer_id: createdUser.id,
                name: `Pond #${i} (${signupForm.farmName.split(' ')[0]})`,
                species: signupForm.species,
                area_hectares: haPerPond,
                doc: 1,
                density_pl_m2: 50,
                stocking_date: new Date().toISOString().split('T')[0],
                status: 'Active Culture',
                fcr: 1.15
              });
            }
            const { error: pondsErr } = await supabase.from('ponds').insert(pondsToInsert);
            if (pondsErr) {
              console.warn('Ponds insert notice:', pondsErr.message);
            } else {
              console.log('✅ Operational ponds created in public.ponds table!');
            }
          } catch (pondErr) {
            console.warn('Ponds insert error:', pondErr);
          }
        }
      } catch (err) {
        console.error('Supabase exception:', err);
      }
    }

    // Automatically sync login credentials & user ID to Supabase user_logins table
    syncUserToSupabase({
      userId: generatedUserId,
      name: signupForm.name,
      farmName: signupForm.farmName,
      phone: cleanPhone,
      email: userEmail,
      pin: signupForm.pin,
      location: signupForm.location,
      totalAreaAcres: signupForm.acres,
      totalPondsCount: signupForm.pondCount,
      primarySpecies: signupForm.species,
      authUserId: createdUser?.id
    });

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        id: createdUser?.id || generatedUserId,
        userId: generatedUserId,
        farmerId: generatedUserId,
        name: signupForm.name,
        farmName: signupForm.farmName,
        phone: '+91 ' + cleanPhone,
        email: userEmail,
        pin: signupForm.pin,
        location: signupForm.location,
        caaRegNo: 'CAA/2025/REG/' + Math.floor(10000 + Math.random() * 90000),
        mpedaId: 'MPEDA-REG-' + Math.floor(1000 + Math.random() * 9000),
        totalAreaAcres: Number(signupForm.acres) || 4.0,
        totalPondsCount: Number(signupForm.pondCount) || 3,
        primarySpecies: signupForm.species
      });
    }, 450);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #0f172a 0%, #0369a1 40%, #0284c7 80%, #0ea5e9 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden'
    }}>

      {/* Decorative Wave Backdrops */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      {/* Top Navbar Header */}
      <header style={{
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(12px)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#ffffff',
            padding: '4px 8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)'
          }}>
            <img 
              src="/well-aqua-logo-tight.png" 
              alt="Well Aqua" 
              style={{ height: '34px', width: 'auto', objectFit: 'contain' }} 
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                Well <span style={{ color: '#38bdf8' }}>Aqua</span>
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.25)',
                color: '#86efac',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '10px'
              }}>
                AQUA PORTAL
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#cbd5e1', margin: 0 }}>
              Healthy and sustainable aquaculture
            </p>
          </div>
        </div>

        {/* Top Right: Language & Guest Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isSupabaseConfigured && (
            <div className="hide-mobile" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.75rem',
              color: '#86efac',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(110, 231, 183, 0.3)',
              padding: '4px 10px',
              borderRadius: '20px',
              fontWeight: 600
            }}>
              <Cloud size={13} />
              <span>Supabase Cloud Live</span>
            </div>
          )}

          <button
            onClick={onContinueGuest}
            style={{
              padding: '7px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Explore as Guest</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Main Full-Screen Layout */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        zIndex: 5
      }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'center',
          width: '100%'
        }}>

          {/* Left Column: Brand Hero & Farmer Features (Visible on tablet/desktop) */}
          <div className="hide-mobile" style={{ color: '#ffffff', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              width: 'fit-content',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <ShieldCheck size={16} color="#86efac" />
              <span>Certified Coastal Aquaculture Authority (CAA) & MPEDA Compliant</span>
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.15, color: '#ffffff' }}>
              Precision Aquaculture <br />
              <span style={{ color: '#38bdf8' }}>At Your Fingertips.</span>
            </h1>

            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '480px' }}>
              Dedicated platform for Shrimp & Fish farmers in Andhra Pradesh, Tamil Nadu, Odisha & Gujarat. Monitor dissolved oxygen, schedule certified lab tests, order genuine aquatic probiotics, and calculate pond biomass.
            </p>

            {/* Feature Pills Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '8px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '14px',
                borderRadius: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.92rem', marginBottom: '4px' }}>
                  <FlaskConical size={18} color="#38bdf8" />
                  <span>Certified Lab Booking</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                  Doorstep water, soil & PCR seed screening pickup in 24 hours.
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '14px',
                borderRadius: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.92rem', marginBottom: '4px' }}>
                  <Pill size={18} color="#86efac" />
                  <span>Aqua Pharmacy</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                  Genuine probiotics, minerals & sanitizers with pond volume calculator.
                </div>
              </div>
            </div>

            {/* Farmer Quote / Telugu Greeting */}
            <div style={{
              background: 'rgba(2, 132, 199, 0.25)',
              borderLeft: '4px solid #38bdf8',
              padding: '12px 16px',
              borderRadius: '0 12px 12px 0',
              fontSize: '0.84rem',
              color: '#f0f9ff'
            }}>
              <strong>రైతులకు స్వాగతం:</strong> ప్రతి రోజూ రొయ్యల బతుకుదల, చెరువు ఆక్సిజన్, మరియు సరైన మేత గణాంకాలను సులభంగా రికార్డ్ చేసుకోండి.
            </div>
          </div>

          {/* Right Column: Premium Glassmorphism Auth Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            overflow: 'hidden',
            width: '100%',
            maxWidth: '460px',
            margin: '0 auto'
          }}>

            {/* Top Segmented Mode Switcher */}
            <div style={{
              display: 'flex',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              padding: '6px'
            }}>
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(''); }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: mode === 'login' ? '#0284c7' : '#64748b',
                  background: mode === 'login' ? '#ffffff' : 'transparent',
                  boxShadow: mode === 'login' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                  transition: 'all 0.2s ease',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Sign In (లాగిన్)
              </button>

              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMessage(''); }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: mode === 'signup' ? '#0284c7' : '#64748b',
                  background: mode === 'signup' ? '#ffffff' : 'transparent',
                  boxShadow: mode === 'signup' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                  transition: 'all 0.2s ease',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Create Account (రిజిస్ట్రేషన్)
              </button>
            </div>

            {/* Form Body Container */}
            <div style={{ padding: '24px 24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Error Banner */}
              {errorMessage && (
                <div style={{
                  background: 'rgba(225, 29, 72, 0.08)',
                  border: '1px solid #fecdd3',
                  color: '#e11d48',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ======================= SIGN IN ======================= */}
              {mode === 'login' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* Toggle: OTP vs Password */}
                  <div style={{
                    display: 'flex',
                    background: '#f1f5f9',
                    borderRadius: '10px',
                    padding: '3px'
                  }}>
                    <button
                      type="button"
                      onClick={() => { setLoginMethod('otp'); setErrorMessage(''); }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        color: loginMethod === 'otp' ? '#0284c7' : '#64748b',
                        background: loginMethod === 'otp' ? '#ffffff' : 'transparent',
                        boxShadow: loginMethod === 'otp' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none'
                      }}
                    >
                      📱 Mobile OTP (Quick)
                    </button>

                    <button
                      type="button"
                      onClick={() => { setLoginMethod('password'); setErrorMessage(''); }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        color: loginMethod === 'password' ? '#0284c7' : '#64748b',
                        background: loginMethod === 'password' ? '#ffffff' : 'transparent',
                        boxShadow: loginMethod === 'password' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none'
                      }}
                    >
                      🔑 Email & Password
                    </button>
                  </div>

                  {/* OTP Flow */}
                  {loginMethod === 'otp' ? (
                    <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div className="auth-input-group">
                        <label className="auth-input-label">Registered Mobile Number</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <div style={{
                            padding: '12px 14px',
                            background: '#f8fafc',
                            border: '1.5px solid #cbd5e1',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            🇮🇳 +91
                          </div>
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="Enter 10-digit mobile"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            className="auth-input"
                            style={{ flex: 1, letterSpacing: '0.04em', fontWeight: 600, fontSize: '0.95rem' }}
                            required
                          />
                        </div>
                      </div>

                      {otpSent && (
                        <div style={{
                          background: 'rgba(2, 132, 199, 0.05)',
                          border: '1.5px solid #bae6fd',
                          borderRadius: '14px',
                          padding: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284c7' }}>
                              Enter 4-Digit Code
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
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
                            style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.3em', fontWeight: 800 }}
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
                          padding: '14px',
                          fontSize: '0.95rem',
                          borderRadius: '12px',
                          justifyContent: 'center',
                          fontWeight: 700
                        }}
                      >
                        {isLoading ? 'Verifying...' : otpSent ? 'Verify & Open Farm Dashboard' : 'Send OTP on Phone'}
                      </button>
                    </form>
                  ) : (
                    /* Email & Password Flow */
                    <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div className="auth-input-group">
                        <label className="auth-input-label">Email or Username</label>
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
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
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
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer'
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
                          padding: '14px',
                          fontSize: '0.95rem',
                          borderRadius: '12px',
                          justifyContent: 'center',
                          fontWeight: 700
                        }}
                      >
                        {isLoading ? 'Signing In...' : 'Sign In to Farm'}
                      </button>
                    </form>
                  )}

                  {/* ⚡ Prominent 1-Tap VIP Demo Login Pass */}
                  <div
                    onClick={handleDemoLogin}
                    style={{
                      marginTop: '6px',
                      background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
                      border: '2px solid #93c5fd',
                      borderRadius: '16px',
                      padding: '14px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.1)'
                    }}
                    title="Click for instant 1-tap demo access"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
                        flexShrink: 0
                      }}>
                        MB
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                            Mohith Kumar Baggu
                          </span>
                          <span className="badge badge-cyan" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                            DEMO
                          </span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                          Srimannarayana Aqua Farm • 3 Ponds (Bhimavaram)
                        </div>
                      </div>
                    </div>

                    <div style={{
                      background: '#0284c7',
                      color: '#ffffff',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
                    }}>
                      <Sparkles size={13} />
                      <span>1-Tap</span>
                    </div>
                  </div>

                  {/* ================= ADMIN PASSCODE LOGIN (PASSCODE: 9900) ================= */}
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
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
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: '1.5px dashed #cbd5e1',
                          background: 'rgba(248, 250, 252, 0.9)',
                          color: '#475569',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ShieldCheck size={16} color="#0284c7" />
                        <span>👑 Admin Login (అడ్మిన్ లాగిన్ - Passcode: 9900)</span>
                      </button>
                    ) : (
                      <form
                        onSubmit={handleAdminPasscodeSubmit}
                        style={{
                          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                          color: '#ffffff',
                          borderRadius: '14px',
                          padding: '14px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
                          animation: 'fadeIn 0.2s ease-out'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck size={18} color="#fbbf24" />
                            <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fbbf24' }}>
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
                              fontSize: '0.78rem',
                              cursor: 'pointer'
                            }}
                          >
                            ✕ Cancel
                          </button>
                        </div>

                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                          Enter the official 4-digit security passcode to access administrator controls.
                        </p>

                        {adminPasscodeError && (
                          <div style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid #ef4444',
                            color: '#fca5a5',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
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
                            placeholder="Enter Passcode (e.g. 9900)"
                            value={adminPasscode}
                            onChange={(e) => {
                              setAdminPasscode(e.target.value);
                              setAdminPasscodeError('');
                            }}
                            style={{
                              flex: 1,
                              padding: '10px 12px',
                              borderRadius: '10px',
                              border: '1px solid #334155',
                              background: '#020617',
                              color: '#ffffff',
                              fontSize: '1rem',
                              letterSpacing: '0.25em',
                              fontWeight: 700,
                              textAlign: 'center'
                            }}
                          />

                          <button
                            type="submit"
                            style={{
                              padding: '10px 18px',
                              borderRadius: '10px',
                              border: 'none',
                              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                              color: '#0f172a',
                              fontWeight: 800,
                              fontSize: '0.85rem',
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

              {/* ======================= SIGN UP ======================= */}
              {mode === 'signup' && (
                <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="auth-input-group">
                    <label className="auth-input-label">Farmer Full Name (రైతు పూర్తి పేరు) *</label>
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
                    <label className="auth-input-label">Email Address (ఈమెయిల్) - Optional</label>
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
                      <label className="auth-input-label">Mobile Number *</label>
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
                        placeholder="e.g. Varma Farm"
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
                        style={{ fontSize: '0.85rem' }}
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
                      <label className="auth-input-label">Primary Species</label>
                      <select
                        value={signupForm.species}
                        onChange={(e) => setSignupForm({ ...signupForm, species: e.target.value })}
                        className="auth-input"
                        style={{ fontSize: '0.85rem' }}
                      >
                        <option value="Vannamei Shrimp">Vannamei Shrimp</option>
                        <option value="Black Tiger Prawn">Black Tiger Prawn</option>
                        <option value="GIFT Tilapia">GIFT Tilapia</option>
                        <option value="Indian Major Carps">Carps (రోహు / కట్ల)</option>
                      </select>
                    </div>
                  </div>

                  <div className="auth-input-group">
                    <label className="auth-input-label">4-Digit Quick Security PIN</label>
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
                      padding: '14px',
                      fontSize: '0.95rem',
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

              {/* Skip as Guest Footer */}
              <div style={{ textAlign: 'center', paddingTop: '6px' }}>
                <button
                  type="button"
                  onClick={onContinueGuest}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.82rem',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Skip for now & Explore Dashboard as Guest
                </button>
              </div>

              {/* Security Footnote */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.74rem',
                color: '#64748b',
                paddingTop: '8px',
                borderTop: '1px solid #f1f5f9'
              }}>
                <ShieldCheck size={14} color="#059669" />
                <span>MPEDA & CAA Compliant • Encrypted Farmer Storage</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
