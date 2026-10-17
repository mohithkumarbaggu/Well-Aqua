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
  const last10 = cleanPhone.slice(-10);
  const formattedPhone = last10 ? `+91 ${last10}` : '+91 9999999999';
  const pin = userData.pin || userData.pinCode || userData.pin_code || '1234';
  const email = userData.email || `farmer.${last10 || 'user'}@gmail.com`;

  const loginPayload = {
    id: userId,
    user_id: userId,
    full_name: userData.name || userData.full_name || 'Aqua Farmer',
    phone: formattedPhone,
    email: email,
    pin_code: String(pin),
    farm_name: userData.farmName || userData.farm_name || 'Coastal Aqua Farm',
    location: userData.location || 'Andhra Pradesh',
    total_acres: parseFloat(userData.totalAreaAcres || userData.total_acres || 5.0),
    total_ponds: parseInt(userData.totalPondsCount || userData.total_ponds || 3, 10),
    primary_species: userData.primarySpecies || userData.primary_species || 'Vannamei Shrimp',
    role: userData.role || 'farmer',
    last_login_at: new Date().toISOString()
  };

  try {
    // Also save in localStorage for instant offline access and quick fallback
    try {
      const storedRaw = localStorage.getItem('wellaqua_registered_users');
      const storedUsers = storedRaw ? JSON.parse(storedRaw) : [];
      const existingIdx = storedUsers.findIndex(u => {
        const uPhone = (u.phone || '').replace(/\D/g, '').slice(-10);
        return (u.user_id && u.user_id === userId) || (last10 && uPhone === last10);
      });
      if (existingIdx >= 0) {
        storedUsers[existingIdx] = { ...storedUsers[existingIdx], ...loginPayload };
      } else {
        storedUsers.push(loginPayload);
      }
      localStorage.setItem('wellaqua_registered_users', JSON.stringify(storedUsers));
    } catch (lsErr) {
      console.warn('LocalStorage user sync note:', lsErr);
    }

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

    return { success: true, userId, user: loginPayload };
  } catch (err) {
    console.warn('Supabase sync exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Validates farmer credentials against Supabase user_logins table
 * and local registry using the password/passcode created during signup.
 * Strictly verifies registered accounts so only created accounts can log in.
 */
export async function authenticateFarmer(phoneOrUserId, passcode) {
  if (!phoneOrUserId || !phoneOrUserId.trim()) {
    return { success: false, message: 'Please enter your Mobile Number or Farmer User ID.' };
  }
  if (!passcode || !passcode.trim()) {
    return { success: false, message: 'Please enter the password / passcode created during signup.' };
  }

  const rawInput = phoneOrUserId.trim();
  const cleanPhone = rawInput.replace(/\D/g, '');
  const last10 = cleanPhone.slice(-10);
  const enteredPasscode = passcode.trim();

  // 1. Try querying Supabase user_logins table
  if (isSupabaseConfigured) {
    try {
      const filterConditions = [];
      if (last10 && last10.length >= 7) {
        filterConditions.push(`phone.ilike.%${last10}%`);
      }
      filterConditions.push(`user_id.ilike.${rawInput}`);
      filterConditions.push(`email.ilike.${rawInput}`);

      const { data, error } = await supabase
        .from('user_logins')
        .select('*')
        .or(filterConditions.join(','));

      if (!error && data && data.length > 0) {
        const matched = data.find(
          row => String(row.pin_code || row.login_pin || '').trim() === enteredPasscode
        );

        if (matched) {
          // Standardize returned farmer object
          return {
            success: true,
            user: {
              id: matched.user_id || matched.id,
              userId: matched.user_id || matched.id,
              farmerId: matched.user_id || matched.id,
              name: matched.full_name,
              farmName: matched.farm_name,
              phone: matched.phone,
              email: matched.email,
              location: matched.location,
              totalAreaAcres: parseFloat(matched.total_acres) || 5.0,
              totalPondsCount: parseInt(matched.total_ponds, 10) || 3,
              primarySpecies: matched.primary_species || 'Vannamei Shrimp',
              caaRegNo: 'CAA/2025/REG/' + Math.floor(10000 + Math.random() * 90000),
              mpedaId: 'MPEDA-REG-' + Math.floor(1000 + Math.random() * 9000)
            }
          };
        } else {
          return {
            success: false,
            reason: 'WRONG_PASSCODE',
            message: 'Incorrect passcode. Please enter the password you created during signup.'
          };
        }
      }
    } catch (err) {
      console.warn('Supabase authentication check note:', err);
    }

    // Also check profiles table in Supabase
    try {
      const profFilters = [];
      if (last10 && last10.length >= 7) {
        profFilters.push(`phone.ilike.%${last10}%`);
      }
      profFilters.push(`farmer_id.ilike.${rawInput}`);
      profFilters.push(`email.ilike.${rawInput}`);

      const { data: profData, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .or(profFilters.join(','));

      if (!profErr && profData && profData.length > 0) {
        const matchedProf = profData.find(
          row => String(row.login_pin || '').trim() === enteredPasscode
        );
        if (matchedProf) {
          return {
            success: true,
            user: {
              id: matchedProf.id || matchedProf.farmer_id,
              userId: matchedProf.farmer_id || matchedProf.id,
              farmerId: matchedProf.farmer_id || matchedProf.id,
              name: matchedProf.full_name,
              farmName: matchedProf.farm_name,
              phone: matchedProf.phone,
              email: matchedProf.email,
              location: matchedProf.location,
              totalAreaAcres: parseFloat(matchedProf.total_acres) || 5.0,
              totalPondsCount: parseInt(matchedProf.total_ponds, 10) || 3,
              primarySpecies: matchedProf.primary_species || 'Vannamei Shrimp',
              caaRegNo: matchedProf.caa_reg_no || 'CAA/2025/REG/' + Math.floor(10000 + Math.random() * 90000),
              mpedaId: matchedProf.mpeda_id || 'MPEDA-REG-' + Math.floor(1000 + Math.random() * 9000)
            }
          };
        } else {
          return {
            success: false,
            reason: 'WRONG_PASSCODE',
            message: 'Incorrect passcode. Please enter the password you created during signup.'
          };
        }
      }
    } catch (err) {
      console.warn('Supabase profiles fallback lookup note:', err);
    }
  }

  // 2. Check localStorage registry (wellaqua_registered_users)
  try {
    const storedRaw = localStorage.getItem('wellaqua_registered_users');
    const storedUsers = storedRaw ? JSON.parse(storedRaw) : [];

    const foundInLocal = storedUsers.find(u => {
      const uPhone = (u.phone || '').replace(/\D/g, '').slice(-10);
      const uUserId = (u.user_id || u.userId || u.farmerId || '').toLowerCase();
      const uEmail = (u.email || '').toLowerCase();
      const inputLower = rawInput.toLowerCase();

      return (
        (last10 && last10.length >= 7 && uPhone === last10) ||
        uUserId === inputLower ||
        uEmail === inputLower
      );
    });

    if (foundInLocal) {
      const userPin = String(foundInLocal.pin_code || foundInLocal.pin || foundInLocal.login_pin || '').trim();
      if (userPin === enteredPasscode) {
        return {
          success: true,
          user: {
            id: foundInLocal.user_id || foundInLocal.id || 'farmer_user',
            userId: foundInLocal.user_id || foundInLocal.id || foundInLocal.farmerId,
            farmerId: foundInLocal.user_id || foundInLocal.id || foundInLocal.farmerId,
            name: foundInLocal.full_name || foundInLocal.name,
            farmName: foundInLocal.farm_name || foundInLocal.farmName,
            phone: foundInLocal.phone,
            email: foundInLocal.email,
            location: foundInLocal.location,
            totalAreaAcres: parseFloat(foundInLocal.total_acres || foundInLocal.totalAreaAcres) || 5.0,
            totalPondsCount: parseInt(foundInLocal.total_ponds || foundInLocal.totalPondsCount, 10) || 3,
            primarySpecies: foundInLocal.primary_species || foundInLocal.primarySpecies || 'Vannamei Shrimp',
            caaRegNo: foundInLocal.caaRegNo || 'CAA/2025/REG/48291',
            mpedaId: foundInLocal.mpedaId || 'MPEDA-REG-9921'
          }
        };
      } else {
        return {
          success: false,
          reason: 'WRONG_PASSCODE',
          message: 'Incorrect passcode. Please enter the password you created during signup.'
        };
      }
    }
  } catch (lsErr) {
    console.warn('LocalStorage auth lookup note:', lsErr);
  }

  // 3. User not registered: ONLY accounts created by user can log in!
  return {
    success: false,
    reason: 'NOT_FOUND',
    message: 'No registered account found with this Mobile Number or User ID. Only accounts created in Sign Up can log in.'
  };
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
