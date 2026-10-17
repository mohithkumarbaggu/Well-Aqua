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
  EyeOff,
  ChevronRight,
  Shield,
  X
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
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setShowAdminPasscode(false);
      if (onAdminLoginSuccess) {
        onAdminLoginSuccess();
      }
    } else {
      setAdminPasscodeError('Incorrect passcode. Please try again.');
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
      setOtp('');
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

          {/* Right Column: Authentic iOS Cupertino Style Auth Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(30px) saturate(190%)',
            WebkitBackdropFilter: 'blur(30px) saturate(190%)',
            borderRadius: '26px',
            boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.35), 0 0 1px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.75)',
            overflow: 'hidden',
            width: '100%',
            maxWidth: '430px',
            margin: '0 auto',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif'
          }}>

            {/* iOS Segmented Control (Sign In / Create Account) */}
            <div style={{
              display: 'flex',
              background: 'rgba(118, 118, 128, 0.12)',
              borderRadius: '13px',
              padding: '3px',
              margin: '22px 22px 6px 22px'
            }}>
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(''); }}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: mode === 'login' ? '#000000' : 'rgba(60, 60, 67, 0.75)',
                  background: mode === 'login' ? '#ffffff' : 'transparent',
                  boxShadow: mode === 'login' ? '0 3px 8px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMessage(''); }}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: mode === 'signup' ? '#000000' : 'rgba(60, 60, 67, 0.75)',
                  background: mode === 'signup' ? '#ffffff' : 'transparent',
                  boxShadow: mode === 'signup' ? '0 3px 8px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                Create Account
              </button>
            </div>

            {/* Form Body Container */}
            <div style={{ padding: '16px 22px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* iOS Error Callout */}
              {errorMessage && (
                <div style={{
                  background: 'rgba(255, 59, 48, 0.1)',
                  border: '0.5px solid rgba(255, 59, 48, 0.3)',
                  color: '#FF3B30',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ======================= iOS SIGN IN ======================= */}
              {mode === 'login' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* Subtle Sub-toggle: Mobile OTP vs Phone & PIN */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '18px',
                    marginBottom: '2px'
                  }}>
                    <button
                      type="button"
                      onClick={() => { setLoginMethod('otp'); setErrorMessage(''); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px 2px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: loginMethod === 'otp' ? '#007AFF' : 'rgba(60, 60, 67, 0.6)',
                        borderBottom: loginMethod === 'otp' ? '2px solid #007AFF' : '2px solid transparent',
                        cursor: 'pointer'
                      }}
                    >
                      Mobile OTP
                    </button>

                    <button
                      type="button"
                      onClick={() => { setLoginMethod('password'); setErrorMessage(''); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px 2px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: loginMethod === 'password' ? '#007AFF' : 'rgba(60, 60, 67, 0.6)',
                        borderBottom: loginMethod === 'password' ? '2px solid #007AFF' : '2px solid transparent',
                        cursor: 'pointer'
                      }}
                    >
                      Email & Password
                    </button>
                  </div>

                  {/* OTP Flow */}
                  {loginMethod === 'otp' ? (
                    <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      
                      {/* iOS Inset Grouped Cell */}
                      <div style={{
                        background: 'rgba(118, 118, 128, 0.08)',
                        borderRadius: '14px',
                        border: '0.5px solid rgba(60, 60, 67, 0.15)',
                        overflow: 'hidden'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'rgba(60, 60, 67, 0.8)', marginRight: '10px' }}>
                            🇮🇳 +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="Mobile Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            style={{
                              flex: 1,
                              border: 'none',
                              background: 'transparent',
                              outline: 'none',
                              fontSize: '0.96rem',
                              fontWeight: 500,
                              color: '#000000'
                            }}
                            required
                          />
                        </div>

                        {otpSent && (
                          <>
                            <div style={{ height: '0.5px', background: 'rgba(60, 60, 67, 0.12)', marginLeft: '16px' }} />
                            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'rgba(60, 60, 67, 0.8)' }}>
                                Verification Code
                              </span>
                              <input
                                type="text"
                                maxLength={4}
                                placeholder="4 digits"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                style={{
                                  width: '100px',
                                  textAlign: 'right',
                                  border: 'none',
                                  background: 'transparent',
                                  outline: 'none',
                                  fontSize: '1.05rem',
                                  fontWeight: 700,
                                  letterSpacing: '0.2em',
                                  color: '#007AFF'
                                }}
                                autoFocus
                                required
                              />
                            </div>
                          </>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                          width: '100%',
                          height: '46px',
                          borderRadius: '13px',
                          border: 'none',
                          background: '#007AFF',
                          color: '#ffffff',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(0, 122, 255, 0.28)',
                          transition: 'opacity 0.15s ease'
                        }}
                      >
                        {isLoading ? 'Verifying...' : otpSent ? 'Sign In to Farm' : 'Send Verification Code'}
                      </button>
                    </form>
                  ) : (
                    /* Password Flow */
                    <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{
                        background: 'rgba(118, 118, 128, 0.08)',
                        borderRadius: '14px',
                        border: '0.5px solid rgba(60, 60, 67, 0.15)',
                        overflow: 'hidden'
                      }}>
                        <div style={{ padding: '12px 14px' }}>
                          <input
                            type="text"
                            placeholder="Email or User ID"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                              width: '100%',
                              border: 'none',
                              background: 'transparent',
                              outline: 'none',
                              fontSize: '0.95rem',
                              fontWeight: 500,
                              color: '#000000'
                            }}
                            required
                          />
                        </div>

                        <div style={{ height: '0.5px', background: 'rgba(60, 60, 67, 0.12)', marginLeft: '16px' }} />

                        <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', position: 'relative' }}>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password or PIN"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                              flex: 1,
                              border: 'none',
                              background: 'transparent',
                              outline: 'none',
                              fontSize: '0.95rem',
                              fontWeight: 500,
                              color: '#000000',
                              paddingRight: '30px'
                            }}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              position: 'absolute',
                              right: '14px',
                              background: 'none',
                              border: 'none',
                              color: 'rgba(60, 60, 67, 0.6)',
                              cursor: 'pointer',
                              padding: '2px'
                            }}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                          width: '100%',
                          height: '46px',
                          borderRadius: '13px',
                          border: 'none',
                          background: '#007AFF',
                          color: '#ffffff',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(0, 122, 255, 0.28)'
                        }}
                      >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </button>
                    </form>
                  )}

                </div>
              )}

              {/* ======================= iOS SIGN UP ======================= */}
              {mode === 'signup' && (
                <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* Personal & Contact Group */}
                  <div style={{
                    background: 'rgba(118, 118, 128, 0.08)',
                    borderRadius: '14px',
                    border: '0.5px solid rgba(60, 60, 67, 0.15)',
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '12px 14px' }}>
                      <input
                        type="text"
                        placeholder="Farmer Full Name"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          outline: 'none',
                          fontSize: '0.92rem',
                          fontWeight: 500,
                          color: '#000000'
                        }}
                        required
                      />
                    </div>

                    <div style={{ height: '0.5px', background: 'rgba(60, 60, 67, 0.12)', marginLeft: '16px' }} />

                    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgba(60, 60, 67, 0.8)', marginRight: '8px' }}>
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="Mobile Number"
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value.replace(/\D/g, '') })}
                        style={{
                          flex: 1,
                          border: 'none',
                          background: 'transparent',
                          outline: 'none',
                          fontSize: '0.92rem',
                          fontWeight: 500,
                          color: '#000000'
                        }}
                        required
                      />
                    </div>

                    <div style={{ height: '0.5px', background: 'rgba(60, 60, 67, 0.12)', marginLeft: '16px' }} />

                    <div style={{ padding: '12px 14px' }}>
                      <input
                        type="text"
                        placeholder="Farm or Hatchery Name"
                        value={signupForm.farmName}
                        onChange={(e) => setSignupForm({ ...signupForm, farmName: e.target.value })}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          outline: 'none',
                          fontSize: '0.92rem',
                          fontWeight: 500,
                          color: '#000000'
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Location & Species Group */}
                  <div style={{
                    background: 'rgba(118, 118, 128, 0.08)',
                    borderRadius: '14px',
                    border: '0.5px solid rgba(60, 60, 67, 0.15)',
                    overflow: 'hidden'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px' }}>
                      <span style={{ fontSize: '0.86rem', color: 'rgba(60, 60, 67, 0.75)', fontWeight: 500 }}>District</span>
                      <select
                        value={signupForm.location}
                        onChange={(e) => setSignupForm({ ...signupForm, location: e.target.value })}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          outline: 'none',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: '#007AFF',
                          cursor: 'pointer',
                          textAlign: 'right'
                        }}
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

                    <div style={{ height: '0.5px', background: 'rgba(60, 60, 67, 0.12)', marginLeft: '16px' }} />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px' }}>
                      <span style={{ fontSize: '0.86rem', color: 'rgba(60, 60, 67, 0.75)', fontWeight: 500 }}>Species</span>
                      <select
                        value={signupForm.species}
                        onChange={(e) => setSignupForm({ ...signupForm, species: e.target.value })}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          outline: 'none',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: '#007AFF',
                          cursor: 'pointer',
                          textAlign: 'right'
                        }}
                      >
                        <option value="Vannamei Shrimp">Vannamei Shrimp</option>
                        <option value="Black Tiger Prawn">Black Tiger Prawn</option>
                        <option value="GIFT Tilapia">GIFT Tilapia</option>
                        <option value="Indian Major Carps">Carps (రోహు / కట్ల)</option>
                      </select>
                    </div>

                    <div style={{ height: '0.5px', background: 'rgba(60, 60, 67, 0.12)', marginLeft: '16px' }} />

                    <div style={{ padding: '12px 14px' }}>
                      <input
                        type="password"
                        maxLength={6}
                        placeholder="Create 4-Digit Security PIN"
                        value={signupForm.pin}
                        onChange={(e) => setSignupForm({ ...signupForm, pin: e.target.value.replace(/\D/g, '') })}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          outline: 'none',
                          fontSize: '0.92rem',
                          fontWeight: 500,
                          color: '#000000'
                        }}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      height: '46px',
                      borderRadius: '13px',
                      border: 'none',
                      background: '#007AFF',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(0, 122, 255, 0.28)'
                    }}
                  >
                    {isLoading ? 'Creating Profile...' : 'Create Farm Account'}
                  </button>
                </form>
              )}

              {/* Bottom Actions: Guest Exploration & Discreet Admin Portal Link */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                paddingTop: '10px',
                borderTop: '0.5px solid rgba(60, 60, 67, 0.12)'
              }}>
                <button
                  type="button"
                  onClick={onContinueGuest}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(60, 60, 67, 0.75)',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Skip for now & Explore as Guest
                </button>

                {/* Discreet Admin Portal Link without visible passcode */}
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminPasscode(true);
                    setAdminPasscode('');
                    setAdminPasscodeError('');
                  }}
                  style={{
                    background: 'transparent',
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
                  <Shield size={13} />
                  <span>Admin Portal</span>
                  <ChevronRight size={12} />
                </button>
              </div>

              {/* Security Footnote */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '0.72rem',
                color: 'rgba(60, 60, 67, 0.5)'
              }}>
                <ShieldCheck size={13} color="#34C759" />
                <span>MPEDA & CAA Compliant • Encrypted Farm Data</span>
              </div>

            </div>

          </div>

          {/* ================= iOS ADMIN PASSCODE MODAL SHEET ================= */}
          {showAdminPasscode && (
            <div 
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '16px'
              }}
              onClick={() => { setShowAdminPasscode(false); setAdminPasscodeError(''); }}
            >
              <div 
                style={{
                  width: '100%',
                  maxWidth: '320px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(25px)',
                  WebkitBackdropFilter: 'blur(25px)',
                  borderRadius: '20px',
                  boxShadow: '0 20px 48px rgba(0, 0, 0, 0.35)',
                  overflow: 'hidden',
                  textAlign: 'center',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ padding: '22px 20px 18px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(0, 122, 255, 0.1)',
                    color: '#007AFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    <Lock size={22} />
                  </div>
                  
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 4px', color: '#000000' }}>
                    Admin Portal
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(60, 60, 67, 0.75)', margin: 0 }}>
                    Enter passcode to continue
                  </p>

                  {adminPasscodeError && (
                    <div style={{ color: '#FF3B30', fontSize: '0.78rem', marginTop: '8px', fontWeight: 500 }}>
                      {adminPasscodeError}
                    </div>
                  )}

                  <form onSubmit={handleAdminPasscodeSubmit} style={{ marginTop: '16px' }}>
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
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '0.5px solid rgba(60, 60, 67, 0.25)',
                        background: 'rgba(118, 118, 128, 0.12)',
                        color: '#000000',
                        fontSize: '1.1rem',
                        letterSpacing: '0.3em',
                        textAlign: 'center',
                        fontWeight: 700,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />

                    {/* Apple Style Modal Dual Actions */}
                    <div style={{
                      display: 'flex',
                      borderTop: '0.5px solid rgba(60, 60, 67, 0.18)',
                      marginTop: '18px',
                      marginRight: '-20px',
                      marginLeft: '-20px',
                      marginBottom: '-18px'
                    }}>
                      <button
                        type="button"
                        onClick={() => { setShowAdminPasscode(false); setAdminPasscodeError(''); }}
                        style={{
                          flex: 1,
                          padding: '13px',
                          background: 'none',
                          border: 'none',
                          borderRight: '0.5px solid rgba(60, 60, 67, 0.18)',
                          color: '#007AFF',
                          fontSize: '0.94rem',
                          fontWeight: 400,
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        style={{
                          flex: 1,
                          padding: '13px',
                          background: 'none',
                          border: 'none',
                          color: '#007AFF',
                          fontSize: '0.94rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Unlock
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
