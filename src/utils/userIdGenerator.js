import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { INITIAL_ADMIN_FARMERS } from '../data/mockAdminData';

/**
 * Generates an authentic, structured Farmer User ID.
 * Example format: AQ-AP-9848-4829
 * AQ = Well Aqua
 * AP = State code (e.g. AP, TN, GJ, OD, IND)
 * 9848 = Last 4 digits of phone
 * 4829 = Unique 4-digit token
 */
export function generateFarmerUserId(phone = '', name = '', location = '') {
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-4) || '1234';
  const locLower = (location || '').toLowerCase();
  
  let stateCode = 'AP';
  if (locLower.includes('gujarat') || locLower.includes('surat')) stateCode = 'GJ';
  else if (locLower.includes('odisha') || locLower.includes('balasore')) stateCode = 'OD';
  else if (locLower.includes('tamil') || locLower.includes('nagapattinam')) stateCode = 'TN';
  else if (locLower.includes('andhra') || locLower.includes('bhimavaram') || locLower.includes('nellore') || locLower.includes('eluru')) stateCode = 'AP';

  const randomToken = Math.floor(1000 + Math.random() * 9000);
  return `AQ-${stateCode}-${cleanPhone}-${randomToken}`;
}

/**
 * Standardizes or retrieves a user's Farmer User ID.
 * If user already has one, preserves it; otherwise generates a consistent one.
 */
export function getOrGenerateUserId(user) {
  if (!user) return 'AQ-AP-1234-9900';
  if (user.userId && user.userId.startsWith('AQ-')) return user.userId;
  if (user.farmerId && user.farmerId.startsWith('AQ-')) return user.farmerId;
  if (user.id && user.id.startsWith('AQ-')) return user.id;
  
  // Deterministic fallback for demo user
  if (user.id === 'farmer_01' || (user.phone && user.phone.includes('9848012345'))) {
    return 'AQ-AP-1234-9921';
  }

  return generateFarmerUserId(user.phone, user.name, user.location);
}

/**
 * Persists the user's login details, security PIN, and generated User ID into Supabase.
 * Writes to both 'user_logins' (direct credentials table) and 'profiles' (relational table).
 */
export async function syncUserToSupabase(userData) {
  if (!isSupabaseConfigured || !userData) return { success: false, reason: 'Not configured' };

  const userId = getOrGenerateUserId(userData);
  const cleanPhone = (userData.phone || '').replace(/\D/g, '');
  const pin = userData.pin || userData.pinCode || '1234';
  const email = userData.email || `farmer.${cleanPhone.slice(-4) || 'user'}@gmail.com`;

  const loginPayload = {
    id: userId,
    user_id: userId,
    full_name: userData.name || userData.full_name || 'Aqua Farmer',
    phone: cleanPhone ? `+91 ${cleanPhone}` : '+91 9848012345',
    email: email,
    pin_code: String(pin),
    farm_name: userData.farmName || userData.farm_name || 'Coastal Aqua Farm',
    location: userData.location || 'Bhimavaram, Andhra Pradesh',
    total_acres: parseFloat(userData.totalAreaAcres || userData.total_acres || 5.0),
    total_ponds: parseInt(userData.totalPondsCount || userData.total_ponds || 3, 10),
    primary_species: userData.primarySpecies || userData.primary_species || 'Vannamei Shrimp',
    role: userData.role || 'farmer',
    last_login_at: new Date().toISOString()
  };

  try {
    // 1. Save to dedicated 'user_logins' credentials table
    const { error: loginErr } = await supabase
      .from('user_logins')
      .upsert(loginPayload, { onConflict: 'user_id' });

    if (loginErr) {
      console.warn('Supabase user_logins table sync notice:', loginErr.message);
    } else {
      console.log('✅ Successfully saved user login details to Supabase (user_logins):', userId);
    }

    // 2. Also attempt saving to 'profiles' table with farmer_id
    if (userData.authUserId || (userData.id && userData.id.length > 20)) {
      const profileId = userData.authUserId || userData.id;
      const profilePayload = {
        id: profileId,
        farmer_id: userId,
        full_name: loginPayload.full_name,
        farm_name: loginPayload.farm_name,
        phone: loginPayload.phone,
        email: loginPayload.email,
        login_pin: String(pin),
        location: loginPayload.location,
        total_acres: loginPayload.total_acres,
        total_ponds: loginPayload.total_ponds,
        primary_species: loginPayload.primary_species,
        updated_at: new Date().toISOString()
      };

      const { error: profileErr } = await supabase
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'id' });

      if (profileErr) {
        console.warn('Supabase profiles sync notice:', profileErr.message);
      } else {
        console.log('✅ Successfully updated Supabase profiles table:', profileId);
      }
    }

    return { success: true, userId };
  } catch (err) {
    console.warn('Supabase sync exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Seeds all initial farmers and demo accounts into Supabase user_logins table.
 */
export async function seedAllFarmersToSupabase() {
  if (!isSupabaseConfigured) return;

  const defaultPins = ['1234', '5678', '9900', '4321', '8899', '2468', '1357'];

  for (let i = 0; i < INITIAL_ADMIN_FARMERS.length; i++) {
    const f = INITIAL_ADMIN_FARMERS[i];
    const generatedId = `AQ-AP-${f.phone.replace(/\D/g, '').slice(-4)}-${1000 + i * 111}`;
    
    await syncUserToSupabase({
      ...f,
      userId: generatedId,
      pin: defaultPins[i % defaultPins.length]
    });
  }
}
