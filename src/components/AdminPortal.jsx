import React, { useState, useEffect } from 'react';
import { 
  INITIAL_ADMIN_FARMERS, 
  INITIAL_ADMIN_LAB_ORDERS, 
  INITIAL_ADMIN_PHARMACY_ORDERS,
  INITIAL_ADMIN_BROADCASTS,
  INITIAL_DISPATCHED_LAB_READINGS
} from '../data/mockAdminData';
import { 
  ShieldCheck, 
  Users, 
  Waves, 
  FlaskConical, 
  Pill, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  X, 
  Save, 
  Download, 
  TrendingUp, 
  ArrowRight, 
  Activity,
  FileText,
  Truck,
  RotateCcw,
  Sparkles,
  Cloud,
  Key,
  Send,
  Bell,
  Radio,
  FileCheck2,
  Droplets,
  HelpCircle,
  Copy
} from 'lucide-react';
import { getOrGenerateUserId, seedAllFarmersToSupabase, syncUserToSupabase } from '../utils/userIdGenerator';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { getFarmerPonds, generateInitialFarmerPonds } from '../utils/farmDataHelper';

// Helper to load admin farmers combined with locally registered users
function loadCombinedAdminFarmers() {
  let list = [...INITIAL_ADMIN_FARMERS];
  try {
    const saved = localStorage.getItem('well_aqua_admin_farmers');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
  } catch (e) {}

  // Merge registered users from localStorage (wellaqua_registered_users)
  try {
    const regRaw = localStorage.getItem('wellaqua_registered_users');
    if (regRaw) {
      const registered = JSON.parse(regRaw);
      if (Array.isArray(registered)) {
        registered.forEach(regUser => {
          const uId = regUser.user_id || regUser.userId || regUser.id;
          const uPhone = (regUser.phone || '').replace(/\D/g, '').slice(-10);
          const already = list.some(f => {
            const fPhone = (f.phone || '').replace(/\D/g, '').slice(-10);
            return (uId && (f.id === uId || f.userId === uId)) || (uPhone && fPhone === uPhone);
          });
          if (!already && uId) {
            list.unshift({
              id: uId,
              userId: uId,
              name: regUser.full_name || regUser.name || 'Registered Farmer',
              farmName: regUser.farm_name || regUser.farmName || 'Coastal Aqua Farm',
              phone: regUser.phone ? (regUser.phone.startsWith('+91') ? regUser.phone : `+91 ${regUser.phone}`) : '+91 98480 12345',
              email: regUser.email || '',
              pin: regUser.login_pin || regUser.pin || '1234',
              location: regUser.location || 'Andhra Pradesh',
              caaRegNo: regUser.caaRegNo || `CAA/2025/REG/${Math.floor(10000 + Math.random() * 90000)}`,
              mpedaId: regUser.mpedaId || `MPEDA-REG-${Math.floor(1000 + Math.random() * 9000)}`,
              totalAreaAcres: Number(regUser.total_acres || regUser.totalAreaAcres) || 4.0,
              totalPondsCount: Number(regUser.total_ponds || regUser.totalPondsCount) || 3,
              primarySpecies: regUser.primary_species || regUser.primarySpecies || 'L. vannamei (Pacific White)',
              status: 'Verified',
              joinedDate: new Date().toISOString().split('T')[0],
              lastActive: 'Active User',
              criticalAlertsCount: 0
            });
          }
        });
      }
    }
  } catch (e) {}

  return list;
}

export default function AdminPortal({ 
  onSwitchToFarmer, 
  onInspectFarmer, 
  currentUser,
  showToast,
  onPondsUpdated
}) {
  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'farmers' | 'ponds' | 'labs' | 'pharmacy'
  
  // Persistent Farmers State (Merged with registered users)
  const [farmers, setFarmers] = useState(() => loadCombinedAdminFarmers());

  // Persistent Lab Bookings State
  const [labOrders, setLabOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('well_aqua_admin_labs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_ADMIN_LAB_ORDERS;
  });

  // Persistent Pharmacy Orders State
  const [pharmacyOrders, setPharmacyOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('well_aqua_admin_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_ADMIN_PHARMACY_ORDERS;
  });

  // Persistent Broadcast Updates State
  const [broadcasts, setBroadcasts] = useState(() => {
    try {
      const saved = localStorage.getItem('well_aqua_admin_broadcasts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(
            b => b.id !== 'BC-2026-101' && 
                 b.id !== 'BC-2026-102' && 
                 b.id !== 'BC-2026-103' && 
                 !b.title?.toLowerCase().includes('white spot') && 
                 !b.title?.toLowerCase().includes('export subsidy')
          );
          localStorage.setItem('well_aqua_admin_broadcasts', JSON.stringify(cleaned));
          return cleaned;
        }
      }
    } catch (e) {}
    return INITIAL_ADMIN_BROADCASTS;
  });

  // Persistent Dispatched Lab Readings (Water & Soil) State
  const [dispatchedLabReadings, setDispatchedLabReadings] = useState(() => {
    try {
      const saved = localStorage.getItem('well_aqua_admin_dispatched_tests');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_DISPATCHED_LAB_READINGS;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('well_aqua_admin_farmers', JSON.stringify(farmers));
    } catch (e) {}
  }, [farmers]);

  useEffect(() => {
    try {
      localStorage.setItem('well_aqua_admin_labs', JSON.stringify(labOrders));
    } catch (e) {}
  }, [labOrders]);

  useEffect(() => {
    try {
      localStorage.setItem('well_aqua_admin_orders', JSON.stringify(pharmacyOrders));
    } catch (e) {}
  }, [pharmacyOrders]);

  useEffect(() => {
    try {
      localStorage.setItem('well_aqua_admin_broadcasts', JSON.stringify(broadcasts));
    } catch (e) {}
  }, [broadcasts]);

  useEffect(() => {
    try {
      localStorage.setItem('well_aqua_admin_dispatched_tests', JSON.stringify(dispatchedLabReadings));
    } catch (e) {}
  }, [dispatchedLabReadings]);

  // Sync cloud user accounts from Supabase user_logins into admin directory on mount
  useEffect(() => {
    async function fetchSupabaseUsers() {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await supabase.from('user_logins').select('*');
        if (!error && Array.isArray(data) && data.length > 0) {
          setFarmers(prev => {
            const updated = [...prev];
            let changed = false;
            data.forEach(su => {
              const uId = su.user_id || su.id;
              const suPhone = (su.phone || '').replace(/\D/g, '').slice(-10);
              const exists = updated.some(f => {
                const fPhone = (f.phone || '').replace(/\D/g, '').slice(-10);
                return (uId && (f.id === uId || f.userId === uId)) || (suPhone && fPhone === suPhone);
              });
              if (!exists && uId) {
                changed = true;
                updated.unshift({
                  id: uId,
                  userId: uId,
                  name: su.full_name || 'Registered Farmer',
                  farmName: su.farm_name || 'Aqua Farm',
                  phone: su.phone ? (su.phone.startsWith('+91') ? su.phone : `+91 ${su.phone}`) : '+91 98480 12345',
                  email: su.email || '',
                  pin: su.login_pin || '1234',
                  location: su.location || 'Andhra Pradesh',
                  caaRegNo: `CAA/2025/REG/${Math.floor(10000 + Math.random() * 90000)}`,
                  mpedaId: `MPEDA-REG-${Math.floor(1000 + Math.random() * 9000)}`,
                  totalAreaAcres: Number(su.total_acres) || 4.0,
                  totalPondsCount: Number(su.total_ponds) || 3,
                  primarySpecies: su.primary_species || 'L. vannamei (Pacific White)',
                  status: 'Verified',
                  joinedDate: su.last_login_at ? su.last_login_at.split('T')[0] : new Date().toISOString().split('T')[0],
                  lastActive: 'Active User',
                  criticalAlertsCount: 0
                });
              }
            });
            return changed ? updated : prev;
          });
        }
      } catch (err) {
        console.warn('Notice loading Supabase users for admin:', err);
      }
    }
    fetchSupabaseUsers();
  }, []);

  // Search & Filters
  const [farmerSearch, setFarmerSearch] = useState('');
  const [farmerStatusFilter, setFarmerStatusFilter] = useState('ALL');

  // Modals State
  const [isEditFarmerModalOpen, setIsEditFarmerModalOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [isAddFarmerModalOpen, setIsAddFarmerModalOpen] = useState(false);
  const [newFarmerForm, setNewFarmerForm] = useState({
    name: '',
    farmName: '',
    phone: '+91 ',
    email: '',
    location: '',
    caaRegNo: 'CAA/2025/AP/' + Math.floor(10000 + Math.random() * 90000),
    mpedaId: 'MPEDA-IND-AP-' + Math.floor(1000 + Math.random() * 9000),
    totalPondsCount: 3,
    totalAreaAcres: 5.0,
    primarySpecies: 'L. vannamei (Pacific White)',
    status: 'Verified'
  });

  // Dispatch Water & Soil Test Readings Modal State
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchForm, setDispatchForm] = useState(() => {
    const firstF = (farmers && farmers[0]) || null;
    return {
      farmerId: firstF ? firstF.id : '',
      farmerName: firstF ? firstF.name : '',
      farmName: firstF ? firstF.farmName : '',
      pondId: 'ALL',
      pondName: 'All Ponds (Batch Update)',
      testDate: new Date().toISOString().split('T')[0],
      technicianName: 'Dr. Ramesh Varma (Senior Microbiologist)',
      labFacility: 'Well Aqua Coastal Central Diagnostic Facility, Bhimavaram',
      // Water readings
      doMorning: 5.8,
      doEvening: 7.2,
      phMorning: 7.8,
      phEvening: 8.2,
      salinity: 16.0,
      alkalinity: 140,
      tan: 0.04,
      no2: 0.02,
      temperature: 29.5,
      waterColor: 'Planktonic Golden Green',
      // Soil readings
      soilPh: 7.2,
      organicCarbonPct: 1.15,
      h2sPpm: 0.003,
      ironPpm: 'Normal / Trace',
      sludgeDepthCm: 3.2,
      recommendations: 'Water and soil parameters are in optimal culture range. Maintain aeration protocol.'
    };
  });

  // Active selected farmer & their actual ponds for dispatch
  const selectedFarmer = farmers.find(f => f.id === dispatchForm.farmerId) || farmers[0] || null;
  const selectedFarmerPonds = selectedFarmer ? getFarmerPonds(selectedFarmer) : [];

  // Handler when admin changes target farmer in dispatch studio / modal
  const handleSelectFarmerForDispatch = (farmerId) => {
    const target = farmers.find(f => f.id === farmerId);
    if (!target) return;
    const targetPonds = getFarmerPonds(target);
    const firstPond = targetPonds && targetPonds.length > 0 ? targetPonds[0] : null;
    const pParams = firstPond?.waterParameters || {};
    const sParams = firstPond?.soilParameters || {};

    setDispatchForm(prev => ({
      ...prev,
      farmerId: target.id,
      farmerName: target.name,
      farmName: target.farmName,
      pondId: firstPond ? firstPond.id : 'ALL',
      pondName: firstPond ? firstPond.name : 'All Ponds (Batch Update)',
      doMorning: pParams.doMorning != null ? pParams.doMorning : 5.8,
      doEvening: pParams.doEvening != null ? pParams.doEvening : 7.2,
      phMorning: pParams.phMorning != null ? pParams.phMorning : 7.8,
      phEvening: pParams.phEvening != null ? pParams.phEvening : 8.2,
      salinity: pParams.salinity != null ? pParams.salinity : 16.0,
      alkalinity: pParams.alkalinity != null ? pParams.alkalinity : 140,
      tan: pParams.tan != null ? pParams.tan : 0.04,
      no2: pParams.no2 != null ? pParams.no2 : 0.02,
      temperature: pParams.temperature != null ? pParams.temperature : 29.5,
      waterColor: pParams.waterColor || 'Planktonic Golden Green',
      soilPh: sParams.soilPh != null ? sParams.soilPh : 7.2,
      organicCarbonPct: sParams.organicCarbonPct != null ? sParams.organicCarbonPct : 1.15,
      h2sPpm: sParams.h2sPpm != null ? sParams.h2sPpm : 0.003,
      ironPpm: sParams.ironPpm || 'Normal / Trace',
      sludgeDepthCm: sParams.sludgeDepthCm != null ? sParams.sludgeDepthCm : 3.2
    }));
  };

  // Handler when admin changes pond in dispatch studio / modal
  const handleSelectPondForDispatch = (pondId) => {
    if (pondId === 'ALL') {
      setDispatchForm(prev => ({
        ...prev,
        pondId: 'ALL',
        pondName: 'All Ponds (Batch Update)'
      }));
      return;
    }
    const foundPond = selectedFarmerPonds.find(p => p.id === pondId);
    if (foundPond) {
      const pParams = foundPond.waterParameters || {};
      const sParams = foundPond.soilParameters || {};
      setDispatchForm(prev => ({
        ...prev,
        pondId: foundPond.id,
        pondName: foundPond.name,
        doMorning: pParams.doMorning != null ? pParams.doMorning : prev.doMorning,
        doEvening: pParams.doEvening != null ? pParams.doEvening : prev.doEvening,
        phMorning: pParams.phMorning != null ? pParams.phMorning : prev.phMorning,
        phEvening: pParams.phEvening != null ? pParams.phEvening : prev.phEvening,
        salinity: pParams.salinity != null ? pParams.salinity : prev.salinity,
        alkalinity: pParams.alkalinity != null ? pParams.alkalinity : prev.alkalinity,
        tan: pParams.tan != null ? pParams.tan : prev.tan,
        no2: pParams.no2 != null ? pParams.no2 : prev.no2,
        temperature: pParams.temperature != null ? pParams.temperature : prev.temperature,
        waterColor: pParams.waterColor || prev.waterColor,
        soilPh: sParams.soilPh != null ? sParams.soilPh : prev.soilPh,
        organicCarbonPct: sParams.organicCarbonPct != null ? sParams.organicCarbonPct : prev.organicCarbonPct,
        h2sPpm: sParams.h2sPpm != null ? sParams.h2sPpm : prev.h2sPpm,
        ironPpm: sParams.ironPpm || prev.ironPpm,
        sludgeDepthCm: sParams.sludgeDepthCm != null ? sParams.sludgeDepthCm : prev.sludgeDepthCm
      }));
    }
  };

  // Broadcast Updates Modal State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    category: 'Weather & Monsoon Alert',
    priority: 'Urgent',
    targetDistrict: 'All Coastal Andhra Districts',
    content: ''
  });

  // Reset PIN Modal State
  const [isResetPinModalOpen, setIsResetPinModalOpen] = useState(false);
  const [pinFarmer, setPinFarmer] = useState(null);
  const [newPinInput, setNewPinInput] = useState('');

  // Filtered Farmers
  const filteredFarmers = farmers.filter(f => {
    const matchesSearch = 
      f.name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      f.farmName.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      f.phone.includes(farmerSearch) ||
      f.location.toLowerCase().includes(farmerSearch.toLowerCase()) ||
      (f.caaRegNo && f.caaRegNo.toLowerCase().includes(farmerSearch.toLowerCase()));
    
    const matchesStatus = farmerStatusFilter === 'ALL' || f.status === farmerStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalPondsMonitored = farmers.reduce((sum, f) => sum + (Number(f.totalPondsCount) || 0), 0);
  const totalAcreage = farmers.reduce((sum, f) => sum + (Number(f.totalAreaAcres) || 0), 0).toFixed(1);
  const activeAlertsCount = farmers.reduce((sum, f) => sum + (f.criticalAlertsCount || 0), 0);

  // Supabase Cloud Sync State
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncToSupabase = async () => {
    setIsSyncing(true);
    try {
      await seedAllFarmersToSupabase();
      if (showToast) {
        showToast(`✅ Successfully synced all ${farmers.length} farmers and login credentials to Supabase!`, 'success');
      }
    } catch (err) {
      if (showToast) showToast('Failed to sync users to Supabase: ' + err.message, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Open Lab Dispatch Modal (Water & Soil Readings)
  const handleOpenDispatchModal = (farmer = null) => {
    const target = farmer || (farmers && farmers[0]) || null;
    if (!target) return;
    const targetPonds = getFarmerPonds(target);
    const firstPond = targetPonds && targetPonds.length > 0 ? targetPonds[0] : null;
    const pParams = firstPond?.waterParameters || {};
    const sParams = firstPond?.soilParameters || {};

    setDispatchForm({
      farmerId: target.id,
      farmerName: target.name,
      farmName: target.farmName,
      pondId: firstPond ? firstPond.id : 'ALL',
      pondName: firstPond ? firstPond.name : 'All Ponds (Batch Update)',
      testDate: new Date().toISOString().split('T')[0],
      technicianName: 'Dr. Ramesh Varma (Senior Aquatic Pathologist)',
      labFacility: 'Well Aqua Coastal Diagnostic Hub, Bhimavaram',
      doMorning: pParams.doMorning != null ? pParams.doMorning : 5.8,
      doEvening: pParams.doEvening != null ? pParams.doEvening : 7.2,
      phMorning: pParams.phMorning != null ? pParams.phMorning : 7.8,
      phEvening: pParams.phEvening != null ? pParams.phEvening : 8.2,
      salinity: pParams.salinity != null ? pParams.salinity : 16.0,
      alkalinity: pParams.alkalinity != null ? pParams.alkalinity : 140,
      tan: pParams.tan != null ? pParams.tan : 0.04,
      no2: pParams.no2 != null ? pParams.no2 : 0.02,
      temperature: pParams.temperature != null ? pParams.temperature : 29.5,
      waterColor: pParams.waterColor || 'Planktonic Golden Green',
      soilPh: sParams.soilPh != null ? sParams.soilPh : 7.2,
      organicCarbonPct: sParams.organicCarbonPct != null ? sParams.organicCarbonPct : 1.15,
      h2sPpm: sParams.h2sPpm != null ? sParams.h2sPpm : 0.003,
      ironPpm: sParams.ironPpm || 'Normal / Trace',
      sludgeDepthCm: sParams.sludgeDepthCm != null ? sParams.sludgeDepthCm : 3.2,
      recommendations: 'Water and soil parameters are in optimal culture range. Maintain aeration protocol.'
    });
    setIsDispatchModalOpen(true);
  };

  // Dispatch Official Lab Readings to Farmer & Sync with Supabase
  const handleSendLabReadings = async (e) => {
    e.preventDefault();
    if (!dispatchForm.farmerId) {
      alert('Please select a farmer to send lab readings to');
      return;
    }

    const targetFarmer = farmers.find(f => f.id === dispatchForm.farmerId);
    if (!targetFarmer) return;

    const dispatchRecord = {
      id: `DISP-LAB-${Date.now()}`,
      farmerId: targetFarmer.id,
      farmerName: targetFarmer.name,
      farmName: targetFarmer.farmName,
      pondId: dispatchForm.pondId || `pond-${targetFarmer.id}-1`,
      pondName: dispatchForm.pondName || 'All Ponds',
      date: dispatchForm.testDate || new Date().toISOString().split('T')[0],
      testedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      technicianName: dispatchForm.technicianName || 'Well Aqua Field Specialist',
      labFacility: dispatchForm.labFacility || 'Well Aqua Coastal Central Diagnostic Facility',
      waterParameters: {
        doMorning: parseFloat(dispatchForm.doMorning) || 5.8,
        doEvening: parseFloat(dispatchForm.doEvening) || 7.2,
        phMorning: parseFloat(dispatchForm.phMorning) || 7.8,
        phEvening: parseFloat(dispatchForm.phEvening) || 8.2,
        salinity: parseFloat(dispatchForm.salinity) || 16.0,
        alkalinity: parseFloat(dispatchForm.alkalinity) || 140,
        tan: parseFloat(dispatchForm.tan) || 0.04,
        no2: parseFloat(dispatchForm.no2) || 0.02,
        temperature: parseFloat(dispatchForm.temperature) || 29.5,
        waterColor: dispatchForm.waterColor || 'Planktonic Golden Green'
      },
      soilParameters: {
        soilPh: parseFloat(dispatchForm.soilPh) || 7.2,
        organicCarbonPct: parseFloat(dispatchForm.organicCarbonPct) || 1.15,
        h2sPpm: parseFloat(dispatchForm.h2sPpm) || 0.003,
        ironPpm: dispatchForm.ironPpm || 'Normal / Trace',
        sludgeDepthCm: parseFloat(dispatchForm.sludgeDepthCm) || 3.0
      },
      recommendations: dispatchForm.recommendations || 'Parameters in normal range. Maintain aeration protocol.'
    };

    // 1. Save to dispatched list in state & localStorage
    const updatedDispatched = [dispatchRecord, ...dispatchedLabReadings];
    setDispatchedLabReadings(updatedDispatched);
    try {
      localStorage.setItem('well_aqua_admin_dispatched_tests', JSON.stringify(updatedDispatched));
    } catch (e) {}

    // 2. Update the target farmer's active pond telemetry in localStorage & memory
    let updatedPondsList = [];
    try {
      const pondsList = getFarmerPonds(targetFarmer);
      const isTargetAll = dispatchForm.pondId === 'ALL' || !dispatchForm.pondId;

      updatedPondsList = pondsList.map(p => {
        const isMatch = isTargetAll || 
                        p.id === dispatchForm.pondId || 
                        p.name === dispatchForm.pondName || 
                        (pondsList.length === 1);
        if (isMatch) {
          return {
            ...p,
            hasRecordedWaterParams: true,
            hasCustomReport: true,
            isNewBatch: false,
            lastLabUpdate: new Date().toISOString(),
            lastUpdatedBy: dispatchForm.technicianName || 'Admin Diagnostics Hub',
            waterParameters: {
              ...(p.waterParameters || {}),
              ...dispatchRecord.waterParameters
            },
            soilParameters: {
              ...(p.soilParameters || {}),
              ...dispatchRecord.soilParameters
            }
          };
        }
        return p;
      });

      // Save across all identifier keys for this farmer
      const keysToSave = [
        targetFarmer.id ? `well_aqua_ponds_${targetFarmer.id}` : null,
        targetFarmer.userId ? `well_aqua_ponds_${targetFarmer.userId}` : null,
        targetFarmer.authUserId ? `well_aqua_ponds_${targetFarmer.authUserId}` : null
      ].filter(Boolean);

      for (const k of keysToSave) {
        localStorage.setItem(k, JSON.stringify(updatedPondsList));
      }
    } catch (err) {
      console.warn('Error saving updated pond for farmer:', err);
    }

    // 3. Add to target farmer's bookings / lab reports
    try {
      const bookingsList = getFarmerBookings(targetFarmer);
      const newBooking = {
        id: dispatchRecord.id,
        serviceTitle: 'Comprehensive Water & Soil Quality Laboratory Panel',
        labName: dispatchRecord.labFacility,
        pondName: dispatchRecord.pondName,
        bookingDate: dispatchRecord.date,
        timeSlot: dispatchRecord.testedAt,
        status: 'Report Ready (Dispatched by Admin)',
        assignedTechnician: dispatchRecord.technicianName,
        price: 650,
        hasReport: true,
        reportData: {
          water: dispatchRecord.waterParameters,
          soil: dispatchRecord.soilParameters,
          notes: dispatchRecord.recommendations,
          dispatchedAt: new Date().toISOString()
        }
      };
      const updatedBookings = [newBooking, ...bookingsList];
      const bKeys = [
        targetFarmer.id ? `well_aqua_bookings_${targetFarmer.id}` : null,
        targetFarmer.userId ? `well_aqua_bookings_${targetFarmer.userId}` : null,
        targetFarmer.authUserId ? `well_aqua_bookings_${targetFarmer.authUserId}` : null
      ].filter(Boolean);
      for (const bk of bKeys) {
        localStorage.setItem(bk, JSON.stringify(updatedBookings));
      }
    } catch (err) {}

    // 4. Notify parent App.jsx so live dashboard updates immediately if viewing this farmer
    if (onPondsUpdated && updatedPondsList.length > 0) {
      onPondsUpdated(targetFarmer.id, updatedPondsList, targetFarmer);
    }

    // 5. Sync to Supabase water_parameters and lab_bookings if configured
    if (isSupabaseConfigured) {
      try {
        await supabase.from('water_parameters').insert([{
          pond_id: dispatchRecord.pondId,
          dissolved_oxygen_ppm: dispatchRecord.waterParameters.doMorning,
          ph: dispatchRecord.waterParameters.phMorning,
          salinity_ppt: dispatchRecord.waterParameters.salinity,
          alkalinity_ppm: dispatchRecord.waterParameters.alkalinity,
          ammonia_ppm: dispatchRecord.waterParameters.tan,
          nitrite_ppm: dispatchRecord.waterParameters.no2,
          temperature_c: dispatchRecord.waterParameters.temperature
        }]);

        await supabase.from('lab_bookings').upsert({
          id: dispatchRecord.id,
          farmer_id: targetFarmer.id && targetFarmer.id.length > 20 ? targetFarmer.id : null,
          pond_id: dispatchRecord.pondId,
          service_title: 'Official Water & Soil Lab Test',
          lab_name: dispatchRecord.labFacility,
          booking_date: dispatchRecord.date,
          time_slot: dispatchRecord.testedAt,
          status: 'Report Ready (Dispatched)',
          price: 650,
          assigned_technician: dispatchRecord.technicianName,
          farmer_notes: dispatchRecord.recommendations
        }, { onConflict: 'id' });
      } catch (sbErr) {
        console.warn('Supabase lab reading sync notice:', sbErr);
      }
    }

    setIsDispatchModalOpen(false);
    if (showToast) {
      showToast(`✅ Official Water & Soil Test readings successfully saved & sent to ${targetFarmer.name}'s ${dispatchRecord.pondName}!`, 'success');
    }
  };

  // Publish Broadcast Updates to All Farmers
  const handlePublishBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastForm.title.trim() || !broadcastForm.content.trim()) {
      alert('Please fill in Broadcast Title and Message');
      return;
    }
    const newBroadcast = {
      id: `BC-${Date.now()}`,
      title: broadcastForm.title,
      category: broadcastForm.category || 'General Advisory',
      priority: broadcastForm.priority || 'Normal',
      targetDistrict: broadcastForm.targetDistrict || 'All Farmers (Statewide)',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: 'Well Aqua Central Command',
      content: broadcastForm.content,
      readCount: 0,
      active: true
    };
    const updated = [newBroadcast, ...broadcasts];
    setBroadcasts(updated);
    try {
      localStorage.setItem('well_aqua_admin_broadcasts', JSON.stringify(updated));
    } catch (e) {}
    setIsBroadcastModalOpen(false);
    setBroadcastForm({
      title: '',
      category: 'Weather & Monsoon Alert',
      priority: 'Urgent',
      targetDistrict: 'All Coastal Andhra Districts',
      content: ''
    });
    if (showToast) {
      showToast(`📢 Update Broadcasted to all farmers in ${newBroadcast.targetDistrict}!`, 'success');
    }
  };

  // Delete / Expire Broadcast
  const handleDeleteBroadcast = (broadcastId) => {
    const updated = broadcasts.filter(b => b.id !== broadcastId);
    setBroadcasts(updated);
    try {
      localStorage.setItem('well_aqua_admin_broadcasts', JSON.stringify(updated));
    } catch (e) {}
    if (showToast) showToast('Broadcast notification removed.', 'info');
  };

  // Open Reset PIN Modal
  const handleOpenResetPinModal = (farmer) => {
    setPinFarmer(farmer);
    setNewPinInput(farmer.pin || '1234');
    setIsResetPinModalOpen(true);
  };

  // Save Reset PIN
  const handleSaveResetPin = (e) => {
    e.preventDefault();
    if (!newPinInput || newPinInput.length < 4) {
      alert('PIN must be at least 4 digits');
      return;
    }
    const updated = farmers.map(f => f.id === pinFarmer.id ? { ...f, pin: newPinInput } : f);
    setFarmers(updated);
    try {
      localStorage.setItem('well_aqua_admin_farmers', JSON.stringify(updated));
    } catch (e) {}

    // Sync to Supabase user_logins
    syncUserToSupabase({
      ...pinFarmer,
      pin: newPinInput
    });

    setIsResetPinModalOpen(false);
    if (showToast) {
      showToast(`🔑 Security PIN for ${pinFarmer.name} updated to "${newPinInput}"!`, 'success');
    }
  };

  // Toggle Suspend / Activate Farmer
  const handleToggleSuspendFarmer = (farmerId) => {
    const target = farmers.find(f => f.id === farmerId);
    if (!target) return;
    const newStatus = target.status === 'Suspended' ? 'Verified' : 'Suspended';
    const updated = farmers.map(f => f.id === farmerId ? { ...f, status: newStatus } : f);
    setFarmers(updated);
    try {
      localStorage.setItem('well_aqua_admin_farmers', JSON.stringify(updated));
    } catch (e) {}
    if (showToast) {
      showToast(`Farmer ${target.name} status updated to: ${newStatus}`, newStatus === 'Suspended' ? 'error' : 'success');
    }
  };

  // Handlers for Farmer Management
  const handleOpenEditFarmer = (farmer) => {
    setEditingFarmer({ ...farmer });
    setIsEditFarmerModalOpen(true);
  };

  const handleSaveEditFarmer = (e) => {
    e.preventDefault();
    setFarmers(prev => prev.map(f => f.id === editingFarmer.id ? editingFarmer : f));
    setIsEditFarmerModalOpen(false);
    if (showToast) showToast(`Farmer ${editingFarmer.name} updated successfully!`, 'success');
  };

  const handleSaveNewFarmer = (e) => {
    e.preventDefault();
    if (!newFarmerForm.name.trim() || !newFarmerForm.farmName.trim()) {
      alert('Please enter Farmer Name and Farm Name');
      return;
    }
    const created = {
      ...newFarmerForm,
      id: `farmer_${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      criticalAlertsCount: 0
    };
    setFarmers([created, ...farmers]);
    setIsAddFarmerModalOpen(false);
    setNewFarmerForm({
      name: '',
      farmName: '',
      phone: '+91 ',
      email: '',
      location: '',
      caaRegNo: 'CAA/2025/AP/' + Math.floor(10000 + Math.random() * 90000),
      mpedaId: 'MPEDA-IND-AP-' + Math.floor(1000 + Math.random() * 9000),
      totalPondsCount: 3,
      totalAreaAcres: 5.0,
      primarySpecies: 'L. vannamei (Pacific White)',
      status: 'Verified'
    });
    if (showToast) showToast(`New farmer ${created.name} registered into admin directory!`, 'success');
  };

  const handleDeleteFarmer = (farmerId, farmerName) => {
    if (window.confirm(`Are you sure you want to deactivate and remove farmer "${farmerName}"?`)) {
      setFarmers(prev => prev.filter(f => f.id !== farmerId));
      if (showToast) showToast(`Farmer ${farmerName} removed.`, 'info');
    }
  };

  // Handlers for Lab Orders
  const handleUpdateLabStatus = (orderId, newStatus, newStep) => {
    setLabOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          statusStep: newStep,
          hasReport: newStep === 4 ? true : order.hasReport
        };
      }
      return order;
    }));
    if (showToast) showToast(`Lab order ${orderId} updated to: ${newStatus}`, 'success');
  };

  // Handlers for Pharmacy Orders
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setPharmacyOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, orderStatus: newStatus } : o));
    if (showToast) showToast(`Order ${orderId} updated to: ${newStatus}`, 'success');
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = ['ID,Name,FarmName,Phone,Email,Location,Ponds,Acres,Species,CAA_Reg,Status'];
    const rows = farmers.map(f => 
      `"${f.id}","${f.name}","${f.farmName}","${f.phone}","${f.email}","${f.location}",${f.totalPondsCount},${f.totalAreaAcres},"${f.primarySpecies}","${f.caaRegNo}","${f.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `well_aqua_farmers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) showToast('Farmer roster exported as CSV!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      
      {/* ================= 1. ADMIN COMMAND HEADER ================= */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '24px 28px', 
          background: 'linear-gradient(135deg, #0f172a 0%, #0369a1 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 10px 30px rgba(2, 132, 199, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            flexShrink: 0
          }}>
            👑
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                Well Aqua Super-Admin Portal
              </h1>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.25)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)', fontSize: '0.72rem', fontWeight: 700 }}>
                ● Operations Headquarters (Bhimavaram)
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#cbd5e1', margin: '4px 0 0 0' }}>
              Central oversight of all registered coastal farmers, pond water telemetry, accredited lab queues, and medicine dispatch.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCSV}
            className="btn-secondary"
            style={{
              padding: '9px 16px',
              fontSize: '0.84rem',
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleOpenDispatchModal()}
            style={{
              padding: '9px 16px',
              fontSize: '0.84rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
            }}
            title="Dispatch Water & Soil Testing Readings directly to any farmer"
          >
            <Droplets size={15} />
            <span>+ Send Lab Data</span>
          </button>

          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            style={{
              padding: '9px 16px',
              fontSize: '0.84rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#0f172a',
              border: 'none',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)'
            }}
            title="Broadcast emergency alerts, weather advisories, or updates to farmers"
          >
            <Radio size={15} />
            <span>📢 Post Update</span>
          </button>

          <button
            onClick={() => setIsAddFarmerModalOpen(true)}
            className="btn-primary"
            style={{
              padding: '9px 18px',
              fontSize: '0.84rem',
              background: '#10b981',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Plus size={16} />
            <span>+ Add Farmer</span>
          </button>

          <button
            onClick={onSwitchToFarmer}
            style={{
              padding: '9px 18px',
              fontSize: '0.84rem',
              fontWeight: 700,
              background: '#ffffff',
              color: '#0f172a',
              border: 'none',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            title="Switch back to standard farmer app view"
          >
            <ArrowRight size={15} />
            <span>← Switch to Farmer App</span>
          </button>
        </div>
      </div>

      {/* ================= 2. ADMIN NAVIGATION TABS ================= */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        overflowX: 'auto', 
        paddingBottom: '4px',
        borderBottom: '1px solid var(--border-subtle)',
        scrollbarWidth: 'none'
      }}>
        {[
          { id: 'overview', label: 'Command Overview', icon: <TrendingUp size={16} /> },
          { id: 'farmers', label: `User Control (${farmers.length})`, icon: <Users size={16} /> },
          { id: 'dispatch_readings', label: '🧪 Send Water & Soil Readings', icon: <Droplets size={16} /> },
          { id: 'broadcast', label: `📢 Broadcast Updates (${broadcasts.filter(b => b.active).length})`, icon: <Radio size={16} /> },
          { id: 'ponds', label: `Live Ponds (${totalPondsMonitored})`, icon: <Waves size={16} /> },
          { id: 'labs', label: `Field Testing Queue (${labOrders.length})`, icon: <FlaskConical size={16} /> },
          { id: 'pharmacy', label: `Medicine Orders (${pharmacyOrders.length})`, icon: <Pill size={16} /> }
        ].map(tab => {
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              style={{
                padding: '10px 18px',
                fontSize: '0.88rem',
                fontWeight: 700,
                borderRadius: '10px 10px 0 0',
                border: '1px solid transparent',
                borderBottom: isActive ? '3px solid var(--cyan)' : '3px solid transparent',
                background: isActive ? 'var(--bg-surface)' : 'transparent',
                color: isActive ? 'var(--cyan)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'var(--transition)'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= 3. TAB 1: EXECUTIVE COMMAND OVERVIEW ================= */}
      {adminTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Executive KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', borderLeft: '4px solid var(--cyan)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>REGISTERED FARMERS</span>
                <Users size={18} color="var(--cyan)" />
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-main)', margin: '6px 0 2px' }}>
                {farmers.length}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                ✓ Across 6 Coastal AP Districts
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', borderLeft: '4px solid #059669' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>OPERATIONAL PONDS</span>
                <Waves size={18} color="#059669" />
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-main)', margin: '6px 0 2px' }}>
                {totalPondsMonitored} Ponds
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Total Area: <strong style={{ color: 'var(--text-main)' }}>{totalAcreage} Acres</strong>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', borderLeft: '4px solid #2563eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>TODAY'S LAB REQUESTS</span>
                <FlaskConical size={18} color="#2563eb" />
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-main)', margin: '6px 0 2px' }}>
                {labOrders.length}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 600 }}>
                {labOrders.filter(o => o.statusStep < 4).length} Active Field Collections
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', borderLeft: '4px solid #d97706' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
                <span>MEDICINE ORDERS</span>
                <Pill size={18} color="#d97706" />
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-main)', margin: '6px 0 2px' }}>
                {pharmacyOrders.length}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 600 }}>
                ₹{pharmacyOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()} Total Value
              </div>
            </div>
          </div>

          {/* Critical Alerts Banner */}
          <div className="glass-panel" style={{ padding: '22px', borderRadius: '14px', border: '1px solid #fecdd3', background: 'rgba(254, 242, 242, 0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <AlertTriangle size={20} color="#e11d48" />
              <h3 style={{ fontSize: '1.15rem', color: '#9f1239', margin: 0, fontWeight: 800 }}>
                Emergency Water Quality Alerts Requiring Field Attention ({activeAlertsCount})
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #fecdd3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#9f1239', fontSize: '0.92rem' }}>
                    Godavari Sunrise Prawn Hatcheries • Pond #3 (Creek Side)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Farmer: Venkata Ramana Raju (+91 94401 55678) • Kaikaluru, Eluru District
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#e11d48', marginTop: '2px', fontWeight: 600 }}>
                    ⚠️ Low Dissolved Oxygen: 3.4 ppm (Threshold: min 4.0 ppm) • Paddle-wheel aerator speed boost advised
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href="tel:+919440155678" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#0284c7' }}>
                    <Phone size={13} /> Call Farmer
                  </a>
                  <button 
                    onClick={() => {
                      if (showToast) showToast('Emergency WhatsApp Alert dispatched to Venkata Ramana Raju!', 'success');
                    }}
                    className="btn-primary" 
                    style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#e11d48', border: 'none' }}
                  >
                    🚨 Send Emergency Alert
                  </button>
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #fed7aa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#9a3412', fontSize: '0.92rem' }}>
                    Penna River Estuary Aqua Park • Pond #4 (Intensive Basin)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Farmer: B. Jagadeesh Reddy (+91 99890 33411) • Indukurpet, Nellore District
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#c2410c', marginTop: '2px', fontWeight: 600 }}>
                    ⚠️ High Total Ammonia Nitrogen (TAN): 0.65 mg/L (Limit: 0.5 mg/L) • Yucca ammonia binder application requested
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href="tel:+919989033411" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#0284c7' }}>
                    <Phone size={13} /> Call Farmer
                  </a>
                  <button 
                    onClick={() => {
                      if (showToast) showToast('Yucca Ammonia prescription sent to B. Jagadeesh Reddy!', 'success');
                    }}
                    className="btn-primary" 
                    style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#d97706', border: 'none' }}
                  >
                    💊 Send Prescription
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Roster Snapshot */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>
                  Recent Registered Farmers
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                  Click "Inspect Farm" on any farmer to review their active ponds and live telemetry.
                </p>
              </div>
              <button 
                onClick={() => setAdminTab('farmers')} 
                style={{ color: 'var(--cyan)', fontWeight: 700, fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>View Full Farmers Roster ({farmers.length})</span>
                <ArrowRight size={15} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {farmers.slice(0, 3).map(farmer => (
                <div 
                  key={farmer.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                        {farmer.name}
                      </div>
                      <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                        {farmer.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>
                      {farmer.farmName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} color="var(--cyan)" />
                      <span>{farmer.location}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
                    <span>{farmer.totalPondsCount} Ponds • {farmer.totalAreaAcres} Acres</span>
                    <button
                      onClick={() => onInspectFarmer(farmer)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--cyan)' }}
                    >
                      <Eye size={13} />
                      <span>Inspect Farm</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= 4. TAB 2: FARMERS & ACCOUNTS DIRECTORY ================= */}
      {adminTab === 'farmers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Search & Filter Bar */}
          <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search by farmer name, farm, phone, CAA ID, or district..."
                  value={farmerSearch}
                  onChange={(e) => setFarmerSearch(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', fontSize: '0.86rem', borderRadius: '10px' }}
                />
              </div>

              <select
                value={farmerStatusFilter}
                onChange={(e) => setFarmerStatusFilter(e.target.value)}
                className="input-field"
                style={{ padding: '9px 12px', borderRadius: '10px', fontSize: '0.86rem' }}
              >
                <option value="ALL">All Statuses</option>
                <option value="Verified">Verified Only</option>
                <option value="Pending Verification">Pending Verification</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Showing <strong>{filteredFarmers.length}</strong> of {farmers.length} farmers
              </div>

              <button
                type="button"
                onClick={handleSyncToSupabase}
                disabled={isSyncing}
                style={{
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: isSyncing ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                }}
                title="Sync all registered farmers and user login credentials to Supabase public.user_logins table"
              >
                <Cloud size={14} />
                <span>{isSyncing ? 'Syncing...' : 'Sync to Supabase'}</span>
              </button>
            </div>
          </div>

          {/* Farmers Table */}
          <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 14px' }}>Farmer & Farm Name</th>
                  <th style={{ padding: '12px 14px' }}>User ID & Credentials</th>
                  <th style={{ padding: '12px 14px' }}>Contact & Location</th>
                  <th style={{ padding: '12px 14px' }}>Ponds & Species</th>
                  <th style={{ padding: '12px 14px' }}>CAA & MPEDA Licenses</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.map((farmer, idx) => (
                  <tr 
                    key={farmer.id}
                    style={{ 
                      borderBottom: idx === filteredFarmers.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
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
                          {farmer.name.trim().split(/\s+/).map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.94rem' }}>
                            {farmer.name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {farmer.farmName}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ 
                          fontSize: '0.78rem', 
                          fontFamily: 'monospace', 
                          fontWeight: 800, 
                          color: '#0284c7', 
                          background: 'rgba(2, 132, 199, 0.1)', 
                          padding: '2px 8px', 
                          borderRadius: '6px',
                          width: 'fit-content'
                        }}>
                          {farmer.userId || getOrGenerateUserId(farmer)}
                        </span>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Key size={11} color="#f59e0b" />
                          <span>PIN: <strong style={{ color: 'var(--text-main)' }}>{farmer.pin || '1234'}</strong></span>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-main)' }}>
                        <Phone size={13} color="#059669" />
                        <span>{farmer.phone}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} color="var(--cyan)" />
                        <span>{farmer.location}</span>
                      </div>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        {farmer.totalPondsCount} Ponds ({farmer.totalAreaAcres} Acres)
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--cyan)', marginTop: '2px' }}>
                        {farmer.primarySpecies}
                      </div>
                    </td>

                    <td style={{ padding: '14px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      <div style={{ color: 'var(--text-main)' }}>{farmer.caaRegNo || 'Pending'}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{farmer.mpedaId || 'Pending'}</div>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span className={`badge ${farmer.status === 'Verified' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.72rem' }}>
                        {farmer.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleOpenDispatchModal(farmer)}
                          style={{
                            padding: '5px 9px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: '1px solid #bae6fd',
                            background: 'rgba(2, 132, 199, 0.08)',
                            color: '#0284c7',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Send Water & Soil Testing Readings to this farmer"
                        >
                          <Droplets size={12} />
                          <span>Send Data</span>
                        </button>

                        <button
                          onClick={() => handleOpenResetPinModal(farmer)}
                          style={{
                            padding: '5px 9px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: '1px solid #ddd6fe',
                            background: 'rgba(124, 58, 237, 0.08)',
                            color: '#7c3aed',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="View or Change Farmer Security PIN"
                        >
                          <Key size={12} />
                          <span>PIN</span>
                        </button>

                        <button
                          onClick={() => onInspectFarmer(farmer)}
                          className="btn-secondary"
                          style={{ padding: '5px 9px', fontSize: '0.74rem', color: 'var(--cyan)' }}
                          title="Open farmer dashboard and review active telemetry"
                        >
                          <Eye size={12} />
                          <span>Inspect</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditFarmer(farmer)}
                          className="btn-secondary"
                          style={{ padding: '5px 9px', fontSize: '0.74rem', color: '#d97706' }}
                          title="Edit farmer registration details"
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleToggleSuspendFarmer(farmer.id)}
                          style={{
                            padding: '5px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: farmer.status === 'Suspended' ? '1px solid #10b981' : '1px solid #f59e0b',
                            background: 'transparent',
                            color: farmer.status === 'Suspended' ? '#10b981' : '#d97706',
                            cursor: 'pointer'
                          }}
                          title={farmer.status === 'Suspended' ? 'Re-activate account' : 'Suspend account'}
                        >
                          {farmer.status === 'Suspended' ? 'Activate' : 'Suspend'}
                        </button>

                        <button
                          onClick={() => handleDeleteFarmer(farmer.id, farmer.name)}
                          style={{ padding: '5px', borderRadius: '6px', color: '#e11d48', background: 'transparent', border: 'none', cursor: 'pointer' }}
                          title="Deactivate farmer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ================= TAB: SEND WATER & SOIL TESTING READINGS ================= */}
      {adminTab === 'dispatch_readings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Header Banner */}
          <div className="glass-panel" style={{ padding: '22px 26px', borderRadius: '16px', background: 'linear-gradient(135deg, #0f172a 0%, #0369a1 100%)', color: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.4rem' }}>🧪</span>
                  <h3 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 800, color: '#ffffff' }}>
                    Water & Soil Diagnostic Dispatch Engine
                  </h3>
                  <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.25)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)', fontSize: '0.72rem' }}>
                    Direct-to-Pond Telemetry
                  </span>
                </div>
                <p style={{ fontSize: '0.86rem', color: '#cbd5e1', margin: '6px 0 0' }}>
                  Input accredited laboratory test results and transmit live water & bottom soil telemetry directly into any farmer's pond telemetry monitor and lab report history.
                </p>
              </div>

              <button
                onClick={() => handleOpenDispatchModal()}
                style={{
                  padding: '10px 18px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                }}
              >
                <Plus size={16} />
                <span>+ Launch Full Dispatch Studio</span>
              </button>
            </div>
          </div>

          {/* Inline Quick Dispatch Studio Form */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <Droplets size={20} color="var(--cyan)" />
              <h3 style={{ fontSize: '1.18rem', margin: 0, fontWeight: 800 }}>
                Transmit New Water & Soil Telemetry Data
              </h3>
            </div>

            <form onSubmit={handleSendLabReadings} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Farmer and Target Selection */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', background: 'var(--bg-surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Select Target Farmer:
                  </label>
                  <select
                    value={dispatchForm.farmerId}
                    onChange={(e) => handleSelectFarmerForDispatch(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontWeight: 600 }}
                  >
                    {farmers.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name} — {f.farmName} ({f.location.split(',')[0]}) [ID: {f.userId || getOrGenerateUserId(f)}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Select Pond / Basin:
                  </label>
                  <select
                    value={dispatchForm.pondId}
                    onChange={(e) => handleSelectPondForDispatch(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontWeight: 600 }}
                  >
                    <option value="ALL">🌟 ALL Ponds ({selectedFarmerPonds.length} Ponds - Batch Update)</option>
                    {selectedFarmerPonds.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.hasRecordedWaterParams ? '✓ (Current pH: ' + (p.waterParameters?.phMorning || '7.8') + ', DO: ' + (p.waterParameters?.doMorning || '5.8') + ')' : '🌱 (Awaiting Telemetry)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Testing Facility / Lab:
                  </label>
                  <input
                    type="text"
                    value={dispatchForm.labFacility}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, labFacility: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Certified Field Technician:
                  </label>
                  <input
                    type="text"
                    value={dispatchForm.technicianName}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, technicianName: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                    required
                  />
                </div>
              </div>

              {/* Real-time Telemetry Status Banner for Selected Target */}
              {selectedFarmer && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: (selectedFarmerPonds.find(p => p.id === dispatchForm.pondId)?.hasRecordedWaterParams) 
                    ? 'rgba(16, 185, 129, 0.08)' 
                    : 'rgba(2, 132, 199, 0.08)',
                  border: (selectedFarmerPonds.find(p => p.id === dispatchForm.pondId)?.hasRecordedWaterParams) 
                    ? '1px solid rgba(16, 185, 129, 0.3)' 
                    : '1px solid rgba(2, 132, 199, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.86rem'
                }}>
                  <span style={{ fontSize: '1.3rem' }}>
                    {(selectedFarmerPonds.find(p => p.id === dispatchForm.pondId)?.hasRecordedWaterParams) ? '📊' : '🌱'}
                  </span>
                  <div>
                    <div>
                      <strong>Target Farmer: {dispatchForm.farmerName} ({dispatchForm.farmName})</strong> — <em>{dispatchForm.pondName}</em>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {(selectedFarmerPonds.find(p => p.id === dispatchForm.pondId)?.hasRecordedWaterParams)
                        ? '✓ Verified lab telemetry is already active for this pond. Entering new readings will push a calibrated update.'
                        : '🌱 Currently in pending status (awaiting lab entry). Saving these values will instantly activate live charts and parameter cards on the farmer dashboard.'}
                    </div>
                  </div>
                </div>
              )}

              {/* Water Quality Telemetry Panel */}
              <div style={{ background: 'rgba(2, 132, 199, 0.04)', border: '1px solid rgba(2, 132, 199, 0.2)', padding: '18px', borderRadius: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Droplets size={18} color="#0284c7" />
                  <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0369a1' }}>
                    Water Quality Parameters (నీటి నాణ్యత పారామితులు)
                  </h4>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      DO Morning (6 AM, ppm):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={dispatchForm.doMorning}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, doMorning: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      DO Evening (6 PM, ppm):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={dispatchForm.doEvening}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, doEvening: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      pH Value (Morning):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={dispatchForm.phMorning}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, phMorning: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Salinity (ppt):
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={dispatchForm.salinity}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, salinity: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Alkalinity (ppm CaCO3):
                    </label>
                    <input
                      type="number"
                      value={dispatchForm.alkalinity}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, alkalinity: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      TAN Ammonia (mg/L):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={dispatchForm.tan}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, tan: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Nitrite NO2 (mg/L):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={dispatchForm.no2}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, no2: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Water Temp (°C):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={dispatchForm.temperature}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, temperature: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px' }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Soil Quality Telemetry Panel */}
              <div style={{ background: 'rgba(180, 83, 9, 0.04)', border: '1px solid rgba(180, 83, 9, 0.2)', padding: '18px', borderRadius: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Waves size={18} color="#b45309" />
                  <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#9a3412' }}>
                    Bottom Soil Quality & Sludge Metrics (చెరువు అడుగు మట్టి పరీక్ష)
                  </h4>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Soil pH:
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={dispatchForm.soilPh}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, soilPh: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Organic Carbon (OC %):
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={dispatchForm.organicCarbonPct}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, organicCarbonPct: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Hydrogen Sulfide H2S (ppm):
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={dispatchForm.h2sPpm}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, h2sPpm: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Black Sludge Depth (cm):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={dispatchForm.sludgeDepthCm}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, sludgeDepthCm: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px' }}
                      required
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Available Soil Iron / Mineral State:
                    </label>
                    <input
                      type="text"
                      value={dispatchForm.ironPpm}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, ironPpm: e.target.value })}
                      className="input-field"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Agronomist Advice & Send Button */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Laboratory Diagnosis & Corrective Actions for Farmer:
                </label>
                <textarea
                  rows={2}
                  value={dispatchForm.recommendations}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, recommendations: e.target.value })}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '0.86rem' }}
                  placeholder="Enter specific aeration, liming, or probiotic dosage advice..."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                  }}
                >
                  <Send size={16} />
                  <span>Transmit Water & Soil Telemetry to Farmer</span>
                </button>
              </div>
            </form>
          </div>

          {/* Recently Dispatched Lab Reports Table */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.18rem', margin: 0, fontWeight: 800 }}>
                  Diagnostic Reports Dispatched by Central Admin ({dispatchedLabReadings.length})
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                  All transmitted telemetry reports are instantly synchronized to farmer devices and Supabase lab records.
                </p>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '10px 12px' }}>Report ID & Date</th>
                    <th style={{ padding: '10px 12px' }}>Farmer & Pond</th>
                    <th style={{ padding: '10px 12px' }}>Water Readings</th>
                    <th style={{ padding: '10px 12px' }}>Soil Readings</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dispatchedLabReadings.map((report, idx) => (
                    <tr key={report.id || idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0284c7' }}>
                          {report.id}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {report.date} ({report.testedAt})
                        </div>
                      </td>

                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                          {report.farmerName}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {report.pondName}
                        </div>
                      </td>

                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                            DO: {report.waterParameters.doMorning} ppm
                          </span>
                          <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                            pH: {report.waterParameters.phMorning}
                          </span>
                          <span style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                            Sal: {report.waterParameters.salinity} ppt
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ background: 'rgba(180, 83, 9, 0.1)', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                            Soil pH: {report.soilParameters?.soilPh || 7.2}
                          </span>
                          <span style={{ background: 'rgba(180, 83, 9, 0.1)', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                            Sludge: {report.soilParameters?.sludgeDepthCm || 3.0} cm
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '12px' }}>
                        <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                          ✓ Dispatched
                        </span>
                      </td>

                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            const farmerObj = farmers.find(f => f.id === report.farmerId);
                            if (farmerObj) onInspectFarmer(farmerObj);
                          }}
                          className="btn-secondary"
                          style={{ padding: '5px 9px', fontSize: '0.74rem', color: 'var(--cyan)' }}
                          title="View farmer's live dashboard with this updated telemetry"
                        >
                          <Eye size={12} />
                          <span>Inspect Pond</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB: BROADCAST UPDATES & ADVISORIES ================= */}
      {adminTab === 'broadcast' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Header Banner */}
          <div className="glass-panel" style={{ padding: '22px 26px', borderRadius: '16px', background: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)', color: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.4rem' }}>📢</span>
                  <h3 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 800, color: '#ffffff' }}>
                    Statewide & District Broadcast Updates Center
                  </h3>
                  <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.25)', color: '#ffffff', fontSize: '0.72rem' }}>
                    Live Alert Feed
                  </span>
                </div>
                <p style={{ fontSize: '0.86rem', color: '#fef3c7', margin: '6px 0 0' }}>
                  Publish critical weather warnings, disease outbreak protocols, harvest market prices, and government advisories to all registered coastal farmers.
                </p>
              </div>

              <button
                onClick={() => setIsBroadcastModalOpen(true)}
                style={{
                  padding: '10px 18px',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  background: '#ffffff',
                  color: '#9a3412',
                  border: 'none',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
                }}
              >
                <Plus size={16} />
                <span>+ Create New Broadcast</span>
              </button>
            </div>
          </div>

          {/* Active Broadcasts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
            {broadcasts.map(broadcast => (
              <div 
                key={broadcast.id}
                className="glass-panel"
                style={{
                  padding: '20px',
                  borderRadius: '14px',
                  borderLeft: broadcast.priority === 'Urgent' 
                    ? '5px solid #e11d48' 
                    : broadcast.priority === 'Warning' 
                    ? '5px solid #f59e0b' 
                    : '5px solid #0284c7',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <span 
                      className="badge" 
                      style={{ 
                        fontSize: '0.72rem',
                        background: broadcast.priority === 'Urgent' ? 'rgba(225, 29, 72, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        color: broadcast.priority === 'Urgent' ? '#e11d48' : '#d97706',
                        border: '1px solid currentColor'
                      }}
                    >
                      {broadcast.priority} Alert
                    </span>

                    <button
                      onClick={() => handleDeleteBroadcast(broadcast.id)}
                      style={{ color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
                      title="Retract / Delete Broadcast"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-main)' }}>
                    {broadcast.title}
                  </h4>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <MapPin size={12} color="var(--cyan)" />
                    <span>{broadcast.targetDistrict}</span>
                    <span>•</span>
                    <span>{broadcast.category}</span>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                    {broadcast.content}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Published: {broadcast.date} at {broadcast.time}</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>● Active on Farmer Dashboard</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ================= 5. TAB 5: LIVE PONDS & TELEMETRY OVERSIGHT ================= */}
      {adminTab === 'ponds' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>
              Coastal Ponds Multi-Farm Sensor Stream (చెరువుల పర్యవేక్షణ)
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Real-time Dissolved Oxygen, pH, Salinity, and Ammonia readings across all managed client farms.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '16px' }}>
            {farmers.map(farmer => {
              const isAlert = farmer.criticalAlertsCount > 0;
              return (
                <div 
                  key={farmer.id}
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    borderRadius: '14px',
                    borderLeft: isAlert ? '5px solid #e11d48' : '5px solid #10b981',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                          {farmer.farmName}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Owner: <strong>{farmer.name}</strong> • {farmer.location.split(',')[0]}
                        </div>
                      </div>
                      <span className={`badge ${isAlert ? 'badge-rose' : 'badge-emerald'}`} style={{ fontSize: '0.72rem' }}>
                        {isAlert ? '⚠️ Check Required' : '✓ Normal'}
                      </span>
                    </div>

                    {/* Sensor Snapshot Pills */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '14px' }}>
                      <div style={{ background: 'var(--bg-surface)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>DO (6 AM)</div>
                        <div style={{ fontWeight: 800, fontSize: '0.98rem', color: isAlert ? '#e11d48' : '#059669', marginTop: '2px' }}>
                          {isAlert ? '3.4 ppm' : '5.2 ppm'}
                        </div>
                      </div>

                      <div style={{ background: 'var(--bg-surface)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>pH Value</div>
                        <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-main)', marginTop: '2px' }}>
                          7.9
                        </div>
                      </div>

                      <div style={{ background: 'var(--bg-surface)', padding: '8px 10px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Ammonia</div>
                        <div style={{ fontWeight: 800, fontSize: '0.98rem', color: isAlert ? '#d97706' : '#059669', marginTop: '2px' }}>
                          {isAlert ? '0.65 mg/L' : '0.12 mg/L'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{farmer.totalPondsCount} Operational Ponds</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleOpenDispatchModal(farmer)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem', borderColor: '#38bdf8', color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Enter / update water & soil testing data for this farmer"
                      >
                        <Droplets size={13} />
                        <span>Enter Water Data</span>
                      </button>
                      <button
                        onClick={() => onInspectFarmer(farmer)}
                        className="btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={13} />
                        <span>Inspect Farm</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 6. TAB 4: LAB TEST QUEUE & DISPATCH ================= */}
      {adminTab === 'labs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>
                Accredited Lab Diagnostic Queue & Field Collections
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Manage doorstep sample collections, assign virologists, and advance test verification statuses.
              </p>
            </div>
            <span className="badge badge-cyan">{labOrders.length} Total Bookings</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {labOrders.map(order => (
              <div 
                key={order.id}
                className="glass-panel"
                style={{
                  padding: '20px',
                  borderRadius: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div style={{ maxWidth: '650px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                      {order.serviceTitle}
                    </span>
                    <span className="badge badge-cyan" style={{ fontFamily: 'monospace', fontSize: '0.74rem' }}>
                      {order.id}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span>Farmer: <strong style={{ color: 'var(--text-main)' }}>{order.farmerName}</strong> ({order.phone})</span>
                    <span>•</span>
                    <span>Pond: <strong>{order.pondName}</strong></span>
                    <span>•</span>
                    <span style={{ color: '#d97706', fontWeight: 600 }}>Scheduled: {order.date} ({order.timeSlot})</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Truck size={14} color="var(--cyan)" />
                    <span>Assigned Technician: <strong>{order.assignedTechnician || 'Unassigned'}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span className={`badge ${order.statusStep === 4 ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                    {order.status}
                  </span>

                  {/* Status Advance Dropdown */}
                  <select
                    value={order.statusStep}
                    onChange={(e) => {
                      const step = Number(e.target.value);
                      const statusMap = {
                        1: 'Sample Collection Scheduled',
                        2: 'Technician Dispatched',
                        3: 'Testing in Progress',
                        4: 'Report Ready (Clean / Passed)'
                      };
                      handleUpdateLabStatus(order.id, statusMap[step], step);
                    }}
                    className="input-field"
                    style={{ padding: '6px 10px', fontSize: '0.82rem', borderRadius: '8px' }}
                  >
                    <option value={1}>1. Scheduled</option>
                    <option value={2}>2. Dispatched</option>
                    <option value={3}>3. Lab Testing</option>
                    <option value={4}>4. Report Issued</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 7. TAB 5: PHARMACY ORDERS FULFILLMENT ================= */}
      {adminTab === 'pharmacy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>
                Aquaculture Medicine & Probiotics Fulfillment
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Track farmer supply orders, manage Bhimavaram warehouse dispatch, and mark orders delivered.
              </p>
            </div>
            <span className="badge badge-emerald">{pharmacyOrders.length} Active Orders</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pharmacyOrders.map(order => (
              <div 
                key={order.orderId}
                className="glass-panel"
                style={{
                  padding: '20px',
                  borderRadius: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                      {order.orderId}
                    </span>
                    <span className="badge badge-cyan">{order.paymentStatus}</span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Customer: <strong style={{ color: 'var(--text-main)' }}>{order.farmerName}</strong> ({order.phone}) • {order.farmName}
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '6px' }}>
                    Items: {order.items.map(it => `${it.qty}x ${it.name}`).join(', ')}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Deliver to: {order.deliveryAddress}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--cyan)' }}>
                    ₹{order.totalAmount.toLocaleString()}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}
                      className="input-field"
                      style={{ padding: '6px 10px', fontSize: '0.82rem', borderRadius: '8px' }}
                    >
                      <option value="Processing at Bhimavaram Hub">Processing</option>
                      <option value="Dispatched (Out for Delivery)">Out for Delivery</option>
                      <option value="Delivered to Farm Dyke">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT FARMER ================= */}
      {isEditFarmerModalOpen && editingFarmer && (
        <div className="modal-overlay" onClick={() => setIsEditFarmerModalOpen(false)} style={{ zIndex: 1200 }}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px', padding: '28px', borderRadius: '20px', background: '#ffffff' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Edit Farmer Account
              </h3>
              <button onClick={() => setIsEditFarmerModalOpen(false)} style={{ padding: '4px', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditFarmer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Farmer Name:</label>
                  <input
                    type="text"
                    value={editingFarmer.name}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, name: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Farm Name:</label>
                  <input
                    type="text"
                    value={editingFarmer.farmName}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, farmName: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Phone Number:</label>
                  <input
                    type="tel"
                    value={editingFarmer.phone}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, phone: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Email Address:</label>
                  <input
                    type="email"
                    value={editingFarmer.email}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, email: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Location / District:</label>
                <input
                  type="text"
                  value={editingFarmer.location}
                  onChange={(e) => setEditingFarmer({ ...editingFarmer, location: e.target.value })}
                  className="input-field"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Total Ponds:</label>
                  <input
                    type="number"
                    value={editingFarmer.totalPondsCount}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, totalPondsCount: Number(e.target.value) })}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Total Acres:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingFarmer.totalAreaAcres}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, totalAreaAcres: Number(e.target.value) })}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Verification Status:</label>
                  <select
                    value={editingFarmer.status}
                    onChange={(e) => setEditingFarmer({ ...editingFarmer, status: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending Verification">Pending</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <button type="button" onClick={() => setIsEditFarmerModalOpen(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={15} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW FARMER ================= */}
      {isAddFarmerModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddFarmerModalOpen(false)} style={{ zIndex: 1200 }}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '620px', padding: '28px', borderRadius: '20px', background: '#ffffff' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>New Registration</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '4px 0 0', color: 'var(--text-main)' }}>
                  Add Farmer Account to Directory
                </h3>
              </div>
              <button onClick={() => setIsAddFarmerModalOpen(false)} style={{ padding: '4px', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveNewFarmer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Farmer Full Name:</label>
                  <input
                    type="text"
                    value={newFarmerForm.name}
                    onChange={(e) => setNewFarmerForm({ ...newFarmerForm, name: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                    placeholder="e.g. Ramesh Varma"
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Farm / Hatchery Name:</label>
                  <input
                    type="text"
                    value={newFarmerForm.farmName}
                    onChange={(e) => setNewFarmerForm({ ...newFarmerForm, farmName: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                    placeholder="e.g. Varma Coastal Aqua Farms"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Mobile Number:</label>
                  <input
                    type="tel"
                    value={newFarmerForm.phone}
                    onChange={(e) => setNewFarmerForm({ ...newFarmerForm, phone: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                    placeholder="+91 98480 12345"
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Email Address:</label>
                  <input
                    type="email"
                    value={newFarmerForm.email}
                    onChange={(e) => setNewFarmerForm({ ...newFarmerForm, email: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                    placeholder="farmer@wellaqua.farm"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Location / Mandal / District:</label>
                <input
                  type="text"
                  value={newFarmerForm.location}
                  onChange={(e) => setNewFarmerForm({ ...newFarmerForm, location: e.target.value })}
                  className="input-field"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                  placeholder="e.g. Mogalthur, West Godavari District, Andhra Pradesh"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Number of Ponds:</label>
                  <input
                    type="number"
                    value={newFarmerForm.totalPondsCount}
                    onChange={(e) => setNewFarmerForm({ ...newFarmerForm, totalPondsCount: Number(e.target.value) })}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Total Area (Acres):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newFarmerForm.totalAreaAcres}
                    onChange={(e) => setNewFarmerForm({ ...newFarmerForm, totalAreaAcres: Number(e.target.value) })}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Cultivated Species:</label>
                  <select
                    value={newFarmerForm.primarySpecies}
                    onChange={(e) => setNewFarmerForm({ ...newFarmerForm, primarySpecies: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                  >
                    <option value="L. vannamei (Pacific White)">L. vannamei (White)</option>
                    <option value="P. monodon (Black Tiger)">P. monodon (Black Tiger)</option>
                    <option value="GIFT Tilapia">GIFT Tilapia</option>
                    <option value="Indian Major Carps">Carps (Rohu/Catla)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <button type="button" onClick={() => setIsAddFarmerModalOpen(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 22px', background: '#10b981', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} />
                  <span>Add Farmer to System</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DISPATCH WATER & SOIL READINGS ================= */}
      {isDispatchModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDispatchModalOpen(false)} style={{ zIndex: 1200 }}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', borderRadius: '20px', background: '#ffffff' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>Official Diagnostics Dispatch</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '4px 0 0', color: 'var(--text-main)' }}>
                  Send Water & Soil Test Readings
                </h3>
              </div>
              <button onClick={() => setIsDispatchModalOpen(false)} style={{ padding: '4px', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendLabReadings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Farmer and Target */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Target Farmer:</label>
                  <select
                    value={dispatchForm.farmerId}
                    onChange={(e) => handleSelectFarmerForDispatch(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.85rem' }}
                  >
                    {farmers.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name} — {f.farmName} [ID: {f.userId || getOrGenerateUserId(f)}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Select Pond / Basin:</label>
                  <select
                    value={dispatchForm.pondId}
                    onChange={(e) => handleSelectPondForDispatch(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.85rem' }}
                  >
                    <option value="ALL">🌟 ALL Ponds ({selectedFarmerPonds.length} Ponds - Batch Update)</option>
                    {selectedFarmerPonds.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.hasRecordedWaterParams ? '✓ (Current pH: ' + (p.waterParameters?.phMorning || '7.8') + ', DO: ' + (p.waterParameters?.doMorning || '5.8') + ')' : '🌱 (Awaiting Telemetry)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Diagnostic Lab:</label>
                  <input
                    type="text"
                    value={dispatchForm.labFacility}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, labFacility: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.85rem' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Technician:</label>
                  <input
                    type="text"
                    value={dispatchForm.technicianName}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, technicianName: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.85rem' }}
                    required
                  />
                </div>
              </div>

              {/* Real-time Telemetry Status Banner for Modal Target */}
              {selectedFarmer && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: (selectedFarmerPonds.find(p => p.id === dispatchForm.pondId)?.hasRecordedWaterParams) 
                    ? 'rgba(16, 185, 129, 0.08)' 
                    : 'rgba(2, 132, 199, 0.08)',
                  border: (selectedFarmerPonds.find(p => p.id === dispatchForm.pondId)?.hasRecordedWaterParams) 
                    ? '1px solid rgba(16, 185, 129, 0.3)' 
                    : '1px solid rgba(2, 132, 199, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.84rem'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>
                    {(selectedFarmerPonds.find(p => p.id === dispatchForm.pondId)?.hasRecordedWaterParams) ? '📊' : '🌱'}
                  </span>
                  <div>
                    <div>
                      <strong>Target: {dispatchForm.farmerName}</strong> — <em>{dispatchForm.pondName}</em>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {(selectedFarmerPonds.find(p => p.id === dispatchForm.pondId)?.hasRecordedWaterParams)
                        ? '✓ Verified lab telemetry is already active for this pond.'
                        : '🌱 Currently in pending status (awaiting lab entry). Saving will activate the farmer dashboard.'}
                    </div>
                  </div>
                </div>
              )}

              {/* Water Parameters */}
              <div style={{ background: 'rgba(2, 132, 199, 0.05)', border: '1px solid #bae6fd', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontWeight: 800, color: '#0284c7', fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Droplets size={16} /> Water Quality Metrics
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block' }}>DO Morning (ppm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={dispatchForm.doMorning}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, doMorning: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block' }}>DO Evening (ppm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={dispatchForm.doEvening}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, doEvening: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block' }}>pH (Morning)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={dispatchForm.phMorning}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, phMorning: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block' }}>Salinity (ppt)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={dispatchForm.salinity}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, salinity: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block' }}>Alkalinity (ppm)</label>
                    <input
                      type="number"
                      value={dispatchForm.alkalinity}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, alkalinity: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block' }}>Ammonia TAN (mg/L)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={dispatchForm.tan}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, tan: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block' }}>Nitrite NO2 (mg/L)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={dispatchForm.no2}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, no2: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block' }}>Temp (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={dispatchForm.temperature}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, temperature: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px' }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Soil Parameters */}
              <div style={{ background: 'rgba(180, 83, 9, 0.05)', border: '1px solid #fed7aa', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontWeight: 800, color: '#9a3412', fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Waves size={16} /> Bottom Soil & Sludge Metrics
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block' }}>Soil pH</label>
                    <input
                      type="number"
                      step="0.1"
                      value={dispatchForm.soilPh}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, soilPh: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block' }}>Organic Carbon (%)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={dispatchForm.organicCarbonPct}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, organicCarbonPct: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block' }}>H2S (ppm)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={dispatchForm.h2sPpm}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, h2sPpm: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block' }}>Sludge Depth (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={dispatchForm.sludgeDepthCm}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, sludgeDepthCm: Number(e.target.value) })}
                      className="input-field"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px' }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Diagnosis & Treatment Guidance:</label>
                <textarea
                  rows={2}
                  value={dispatchForm.recommendations}
                  onChange={(e) => setDispatchForm({ ...dispatchForm, recommendations: e.target.value })}
                  className="input-field"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.84rem' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsDispatchModalOpen(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 22px', background: '#0284c7', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Send size={15} />
                  <span>Send Live Telemetry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: BROADCAST ADVISORY ================= */}
      {isBroadcastModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBroadcastModalOpen(false)} style={{ zIndex: 1200 }}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', padding: '26px', borderRadius: '18px', background: '#ffffff' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>Mass Notification</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '4px 0 0', color: 'var(--text-main)' }}>
                  📢 Broadcast Update to Farmers
                </h3>
              </div>
              <button onClick={() => setIsBroadcastModalOpen(false)} style={{ padding: '4px', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePublishBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Alert / Announcement Title:</label>
                <input
                  type="text"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  className="input-field"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px' }}
                  placeholder="e.g. Cyclone Jawad Advisory: Low-Pressure Depression in Bay of Bengal"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Category:</label>
                  <select
                    value={broadcastForm.category}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, category: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.82rem' }}
                  >
                    <option value="Weather & Monsoon Alert">Weather Alert</option>
                    <option value="Disease Outbreak Warning">Disease Warning</option>
                    <option value="Market & Shrimp Pricing">Market Price</option>
                    <option value="Govt Subsidy / CAA">Govt Notice</option>
                    <option value="General Advisory">General</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Priority Level:</label>
                  <select
                    value={broadcastForm.priority}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, priority: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.82rem' }}
                  >
                    <option value="Urgent">🚨 Urgent</option>
                    <option value="Warning">⚠️ Warning</option>
                    <option value="Normal">ℹ️ Normal</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Target District:</label>
                  <select
                    value={broadcastForm.targetDistrict}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, targetDistrict: e.target.value })}
                    className="input-field"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.82rem' }}
                  >
                    <option value="All Farmers (Statewide)">All Statewide</option>
                    <option value="West Godavari District">West Godavari</option>
                    <option value="Krishna District">Krishna</option>
                    <option value="Nellore District">Nellore</option>
                    <option value="Bapatla District">Bapatla</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Broadcast Message Details:</label>
                <textarea
                  rows={4}
                  value={broadcastForm.content}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, content: e.target.value })}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '0.86rem' }}
                  placeholder="Provide explicit operational advice for farmers (e.g. increase aeration, stop feeding, check salinity)..."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsBroadcastModalOpen(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 22px', background: '#d97706', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Radio size={15} />
                  <span>Broadcast Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: RESET FARMER PIN ================= */}
      {isResetPinModalOpen && pinFarmer && (
        <div className="modal-overlay" onClick={() => setIsResetPinModalOpen(false)} style={{ zIndex: 1200 }}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px', padding: '26px', borderRadius: '18px', background: '#ffffff' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={20} color="#7c3aed" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  Manage Farmer PIN
                </h3>
              </div>
              <button onClick={() => setIsResetPinModalOpen(false)} style={{ padding: '4px', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px', fontSize: '0.84rem' }}>
              <div>Farmer: <strong style={{ color: 'var(--text-main)' }}>{pinFarmer.name}</strong></div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                User ID: <span style={{ fontFamily: 'monospace', color: '#0284c7', fontWeight: 700 }}>{pinFarmer.userId || getOrGenerateUserId(pinFarmer)}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Phone: {pinFarmer.phone}
              </div>
            </div>

            <form onSubmit={handleSaveResetPin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  New 4-Digit Login PIN:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '1.2rem', fontFamily: 'monospace', letterSpacing: '4px', textAlign: 'center', fontWeight: 800 }}
                  required
                />
              </div>

              {/* Quick Preset Buttons */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setNewPinInput('1234')}
                  style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f1f5f9', cursor: 'pointer' }}
                >
                  Set 1234
                </button>
                <button
                  type="button"
                  onClick={() => setNewPinInput('9900')}
                  style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f1f5f9', cursor: 'pointer' }}
                >
                  Set 9900
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const rnd = String(Math.floor(1000 + Math.random() * 9000));
                    setNewPinInput(rnd);
                  }}
                  style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f1f5f9', cursor: 'pointer' }}
                >
                  Random 4-Digit
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" onClick={() => setIsResetPinModalOpen(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', background: '#7c3aed', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Key size={14} />
                  <span>Update PIN</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
