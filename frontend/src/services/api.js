/**
 * DiaCare Senior - Unified Frontend API Client
 * Connects to backend REST APIs with resilient timeouts and offline queue integration.
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/+$/, '')}/api`;
  }
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

export async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error(`Connection timed out after ${timeoutMs}ms. Check backend server.`);
    }
    throw error;
  }
}

export function getAuthHeaders() {
  const token = localStorage.getItem('diacare_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// -------------------------------------------------------------
// AUTHENTICATION & DEMO LOGIN
// -------------------------------------------------------------
export async function loginSeniorApi(nameOrPhone, pin) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/auth/senior/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nameOrPhone, pin })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Senior login failed');
  return data;
}

export async function registerSeniorApi(profileData) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/auth/senior/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function loginCaregiverApi(email, password) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/auth/caregiver/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Caregiver login failed');
  return data;
}

export async function demoLoginApi(role = 'SENIOR', profileKey = 'senior_a') {
  const res = await fetchWithTimeout(`${API_BASE_URL}/auth/demo-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, profileKey })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Demo login failed');
  return data;
}

// -------------------------------------------------------------
// SENIOR HOME SCREEN & CORE WORKFLOWS
// -------------------------------------------------------------
export async function getSeniorTodayApi(patientId) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/seniors/${patientId}/today`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not fetch today status');
  return data;
}

export async function getSeniorProfileApi(patientId) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/seniors/${patientId}`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not fetch senior profile');
  return data;
}

export async function updateSeniorProfileApi(patientId, updates) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/seniors/${patientId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not update profile');
  return data;
}

export async function logSymptomApi(patientId, symptomData) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/seniors/${patientId}/symptoms`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(symptomData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not log symptoms');
  return data;
}

export async function logMealApi(patientId, mealData) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/seniors/${patientId}/meals`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(mealData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not log meal');
  return data;
}

export async function logActivityApi(patientId, activityData) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/seniors/${patientId}/activity`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(activityData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not log activity');
  return data;
}

export async function triggerEmergencyApi(patientId) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/seniors/${patientId}/emergency`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({})
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Emergency trigger failed');
  return data;
}

export async function getWeeklySummaryApi(patientId, lang = 'en') {
  const res = await fetchWithTimeout(`${API_BASE_URL}/seniors/${patientId}/summary?lang=${lang}`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not fetch summary');
  return data;
}

export async function syncOfflineQueueApi(patientId, queuedItems) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/seniors/${patientId}/sync-offline`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ queuedItems })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Offline sync failed');
  return data;
}

// -------------------------------------------------------------
// GLUCOSE MANAGEMENT & DETERMINISTIC RISK ENGINE
// -------------------------------------------------------------
export async function logGlucoseApi(readingData) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/glucose`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(readingData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not log blood sugar reading');
  return data;
}

export async function parseVoiceGlucoseApi(transcript, language = 'en') {
  const res = await fetchWithTimeout(`${API_BASE_URL}/glucose/parse-voice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, language })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not parse voice reading');
  return data;
}

export async function getGlucoseHistoryApi(patientId, days = 30) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/glucose/patient/${patientId}?days=${days}`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not fetch readings');
  return data;
}

export async function getGlucoseTrendsApi(patientId) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/glucose/trends/${patientId}`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not fetch trends');
  return data;
}

export async function getGlucoseExplanationApi(readingId) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/glucose/explain/${readingId}`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not fetch explanation');
  return data;
}

// -------------------------------------------------------------
// MEDICATIONS & ESCALATION SIMULATION
// -------------------------------------------------------------
export async function getMedicationsApi(patientId) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/medications/patient/${patientId}`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not fetch medications');
  return data;
}

export async function recordMedicationActionApi(reminderId, action = 'TAKEN') {
  const res = await fetchWithTimeout(`${API_BASE_URL}/medications/action`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reminderId, action })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not update medication status');
  return data;
}

export async function simulateMissedMedicineApi(patientId) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/medications/simulate-missed`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ patientId })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Missed dose simulation failed');
  return data;
}

export async function getMedicationAdherenceApi(patientId) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/medications/adherence/${patientId}`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not fetch adherence');
  return data;
}

// Synthetic client-side fallback when network/backend is spinning up or offline
const getMockCaregiverSummary = (patientId = 'senior_a') => {
  const isB = String(patientId).includes('senior_b') || String(patientId).includes('kamala');
  const isC = String(patientId).includes('senior_c') || String(patientId).includes('george');

  const name = isB ? 'Kamalabai Deshmukh' : isC ? 'George Fernandes' : 'Ramesh Patel';
  const age = isB ? 72 : isC ? 65 : 68;
  const lang = isB ? 'mr' : isC ? 'en' : 'hi';
  const type = isC ? 'Type 1 Diabetes' : 'Type 2 Diabetes';

  const now = Date.now();
  const readings = [
    { timestamp: new Date(now - 3600000 * 2).toISOString(), value: isB ? 135 : isC ? 210 : 142, mealContext: 'after_meal' },
    { timestamp: new Date(now - 3600000 * 6).toISOString(), value: isB ? 112 : isC ? 165 : 108, mealContext: 'fasting' },
    { timestamp: new Date(now - 3600000 * 20).toISOString(), value: isB ? 148 : isC ? 245 : 185, mealContext: 'after_meal' },
    { timestamp: new Date(now - 3600000 * 26).toISOString(), value: isB ? 56 : isC ? 150 : 115, mealContext: 'fasting' },
    { timestamp: new Date(now - 3600000 * 44).toISOString(), value: isB ? 140 : isC ? 190 : 160, mealContext: 'after_meal' },
    { timestamp: new Date(now - 3600000 * 50).toISOString(), value: isB ? 122 : isC ? 140 : 104, mealContext: 'fasting' },
    { timestamp: new Date(now - 3600000 * 68).toISOString(), value: isB ? 155 : isC ? 260 : 195, mealContext: 'after_meal' },
    { timestamp: new Date(now - 3600000 * 74).toISOString(), value: isB ? 118 : isC ? 172 : 112, mealContext: 'fasting' }
  ];

  return {
    status: 'ok',
    patient: {
      id: patientId || 'senior_a',
      name,
      age,
      diabetesType: type,
      preferredLanguage: lang,
      targetRange: { fastingMin: 80, fastingMax: 130, postMealMin: 80, postMealMax: 180 },
      emergencyContact: { name: 'Priya Patel (Daughter)', phone: '+91 98765 43210' }
    },
    todayStatus: {
      latestGlucose: readings[0],
      adherenceRate: isB ? 94 : isC ? 78 : 91,
      totalMedsScheduled: 14,
      takenCount: 12,
      missedCount: 2,
      activeAlertsCount: 1
    },
    trends: {
      average: isB ? 138 : isC ? 186 : 142,
      min: isB ? 56 : isC ? 140 : 104,
      max: isB ? 155 : isC ? 260 : 195,
      timeInRangePercent: isB ? 86 : isC ? 72 : 88,
      trendDirection: 'STABLE'
    },
    readings,
    riskAlerts: [
      {
        _id: 'risk_1',
        level: isB ? 'URGENT' : 'HIGH',
        glucoseValue: isB ? 56 : isC ? 260 : 245,
        mealContext: isB ? 'before_meal' : 'after_meal',
        reason: isB 
          ? 'Hypoglycemia event detected (56 mg/dL) before breakfast.' 
          : isC 
          ? 'Random blood glucose excursion (260 mg/dL) during travel.' 
          : 'Post-dinner reading of 245 mg/dL is above configured target range (80-180 mg/dL)',
        suggestedAction: isB 
          ? 'Rule of 15: Give 15g fast-acting sugar (fruit juice or 3 glucose biscuits), re-test in 15 mins.' 
          : isC 
          ? 'Review insulin dose schedule and ensure adequate hydration.' 
          : 'Advise patient to drink warm water, monitor after 2 hours, and ensure bedtime dose is taken.',
        timestamp: new Date(now - 3600000 * 5).toISOString()
      },
      {
        _id: 'risk_2',
        level: 'ATTENTION',
        glucoseValue: 195,
        mealContext: 'after_meal',
        reason: 'Mild post-prandial spike (195 mg/dL) following lunch.',
        suggestedAction: 'Encourage 15-minute gentle walking and check before evening tea.',
        timestamp: new Date(now - 3600000 * 24).toISOString()
      }
    ],
    symptoms: [
      {
        symptoms: isB ? ['Sweating', 'Shaking'] : isC ? ['Unusual thirst'] : ['Feeling okay'],
        severity: isB ? 'moderate' : 'mild',
        timestamp: new Date(now - 3600000 * 3).toISOString()
      },
      {
        symptoms: ['Dizziness', 'Weakness'],
        severity: 'moderate',
        timestamp: new Date(now - 3600000 * 26).toISOString()
      }
    ],
    activities: [
      {
        type: isB ? 'yoga' : isC ? 'gardening' : 'walking',
        durationMinutes: isB ? 30 : isC ? 35 : 25,
        steps: isB ? 1200 : isC ? 2400 : 2100,
        notes: isB ? 'Senior chair yoga' : isC ? 'Balcony gardening' : 'Morning park walk',
        timestamp: new Date(now - 3600000 * 4).toISOString()
      },
      {
        type: 'walking',
        durationMinutes: 20,
        steps: 1800,
        notes: 'Post-dinner gentle stroll',
        timestamp: new Date(now - 3600000 * 28).toISOString()
      }
    ]
  };
};

export async function getCaregiverSummaryApi(patientId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/caregivers/patient/${patientId}/summary`, {
      headers: getAuthHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.readings?.length > 0 || data.patient)) return data;
    }
    return getMockCaregiverSummary(patientId);
  } catch (err) {
    console.warn('Network issue fetching caregiver summary, using offline fallback data:', err.message);
    return getMockCaregiverSummary(patientId);
  }
}

export async function getCaregiverNotificationsApi(patientId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/caregivers/notifications/${patientId}`, {
      headers: getAuthHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.notifications?.length > 0) return data;
    }
  } catch (err) {
    console.warn('Network issue fetching notifications, using fallback:', err.message);
  }
  return {
    status: 'ok',
    notifications: [
      {
        title: 'HIGH GLUCOSE ALERT',
        message: 'DiaCare Alert: Blood sugar recorded above configured target threshold (245 mg/dL).',
        triggerReason: 'high_glucose',
        status: 'mock_sent',
        recipientContact: '+91 98765 43210',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        title: 'MISSED MEDICINE',
        message: 'Diabetes Care Alert: Evening scheduled dose was not confirmed in designated window.',
        triggerReason: 'missed_medicine',
        status: 'mock_sent',
        recipientContact: '+91 98765 43210',
        timestamp: new Date(Date.now() - 3600000 * 22).toISOString()
      }
    ]
  };
}

export async function sendTestCaregiverAlertApi(patientId, customMessage) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/caregivers/test-alert`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ patientId, customMessage })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Alert dispatch failed');
  return data;
}

export async function getDoctorReportApi(patientId, days = 7) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/doctors/patient/${patientId}/report?days=${days}`, {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not generate clinical report');
  return data;
}

// -------------------------------------------------------------
// DIABETES AI ASSISTANT
// -------------------------------------------------------------
export async function sendChatMessageApi({ message, patientId, language = 'en' }) {
  const res = await fetchWithTimeout(`${API_BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ message, patientId, language })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not contact assistant');
  return data;
}

// -------------------------------------------------------------
// DEMO CONTROLS
// -------------------------------------------------------------
export async function getDemoProfilesApi() {
  const res = await fetchWithTimeout(`${API_BASE_URL}/demo/profiles`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not fetch demo profiles');
  return data;
}

export async function resetDemoDataApi() {
  const res = await fetchWithTimeout(`${API_BASE_URL}/demo/reset`, {
    method: 'POST'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Demo database reset failed');
  return data;
}
