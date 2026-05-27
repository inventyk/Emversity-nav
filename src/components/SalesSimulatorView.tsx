/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OBJECTIONS, COUNSELLING_STEPS, Objection, CounsellingStep, PROFILING_QUESTIONS } from '../data/trainingData';
import { COLLEGES, getCoordinatesFromPincode, getHaversineDistance } from '../data';

// Comprehensive dictionary specifying exactly which cities mapped to coordinates belong to which state, to ensure state-aware lookups.
const STATE_CITIES_COORDS: Record<string, Record<string, { name: string, lat: number, lng: number }>> = {
  "Maharashtra": {
    "nashik": { name: "Nashik, Maharashtra", lat: 19.9975, lng: 73.7898 },
    "nasik": { name: "Nashik, Maharashtra", lat: 19.9975, lng: 73.7898 },
    "mumbai": { name: "Mumbai, Maharashtra", lat: 19.0760, lng: 72.8777 },
    "pune": { name: "Pune, Maharashtra", lat: 18.5204, lng: 73.8567 },
    "solapur": { name: "Solapur, Maharashtra", lat: 17.6599, lng: 75.9064 },
    "kopargaon": { name: "Kopargaon, Maharashtra", lat: 19.9010, lng: 74.4949 },
    "shirdi": { name: "Shirdi, Maharashtra", lat: 19.7691, lng: 74.4080 },
    "ahmednagar": { name: "Ahmednagar, Maharashtra", lat: 19.0948, lng: 74.7480 },
    "vasai": { name: "Vasai, Maharashtra", lat: 19.3504, lng: 72.9170 },
    "nagpur": { name: "Nagpur, Maharashtra", lat: 21.1458, lng: 79.0882 },
    "thane": { name: "Thane, Maharashtra", lat: 19.2183, lng: 72.9781 }
  },
  "Karnataka": {
    "bangalore": { name: "Bengaluru, Karnataka", lat: 12.9716, lng: 77.5946 },
    "bengaluru": { name: "Bengaluru, Karnataka", lat: 12.9716, lng: 77.5946 },
    "hubli": { name: "Hubballi, Karnataka", lat: 15.3647, lng: 75.1242 },
    "hubballi": { name: "Hubballi, Karnataka", lat: 15.3647, lng: 75.1242 },
    "mangalore": { name: "Mangaluru, Karnataka", lat: 12.9141, lng: 74.8560 },
    "mysore": { name: "Mysuru, Karnataka", lat: 12.2958, lng: 76.6394 }
  },
  "Tamil Nadu": {
    "chennai": { name: "Chennai, Tamil Nadu", lat: 13.0827, lng: 80.2707 },
    "coimbatore": { name: "Coimbatore, Tamil Nadu", lat: 11.0168, lng: 76.9558 }
  },
  "Telangana": {
    "hyderabad": { name: "Hyderabad, Telangana", lat: 17.3850, lng: 78.4867 },
    "sangareddy": { name: "Sangareddy, Telangana", lat: 17.6253, lng: 78.0494 }
  },
  "West Bengal": {
    "kolkata": { name: "Kolkata, West Bengal", lat: 22.5726, lng: 88.3639 }
  },
  "Uttarakhand": {
    "dehradun": { name: "Dehradun, Uttarakhand", lat: 30.3165, lng: 78.0322 }
  },
  "Jharkhand": {
    "jamshedpur": { name: "Jamshedpur, Jharkhand", lat: 22.8046, lng: 86.2029 },
    "ranchi": { name: "Ranchi, Jharkhand", lat: 23.3441, lng: 85.3091 }
  },
  "Haryana": {
    "gurugram": { name: "Gurugram, Haryana", lat: 28.4595, lng: 77.0266 },
    "faridabad": { name: "Faridabad, Haryana", lat: 28.4089, lng: 77.3178 }
  },
  "Punjab": {
    "mohali": { name: "Mohali, Punjab", lat: 30.6953, lng: 76.6575 },
    "phagwara": { name: "Phagwara, Punjab", lat: 31.2536, lng: 75.7057 },
    "amritsar": { name: "Amritsar, Punjab", lat: 31.6340, lng: 74.8723 }
  },
  "Uttar Pradesh": {
    "allahabad": { name: "Allahabad, Uttar Pradesh", lat: 25.4358, lng: 81.8463 },
    "lucknow": { name: "Lucknow, Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
    "kanpur": { name: "Kanpur, Uttar Pradesh", lat: 26.4499, lng: 80.3319 }
  },
  "Sikkim": {
    "singtam": { name: "Singtam, Sikkim", lat: 27.2354, lng: 88.4988 }
  },
  "Madhya Pradesh": {
    "indore": { name: "Indore, Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
    "bhopal": { name: "Bhopal, Madhya Pradesh", lat: 23.2599, lng: 77.4126 }
  },
  "Jammu & Kashmir": {
    "kashmir": { name: "Kashmir Region, J&K", lat: 34.0837, lng: 74.7973 },
    "kasmir": { name: "Kashmir Region, J&K", lat: 34.0837, lng: 74.7973 },
    "srinagar": { name: "Srinagar, J&K", lat: 34.0837, lng: 74.7973 },
    "jammu": { name: "Jammu, J&K", lat: 32.7266, lng: 74.8570 }
  },
  "Kerala": {
    "kerala": { name: "Kerala Region", lat: 9.9312, lng: 76.2673 },
    "kochi": { name: "Kochi, Kerala", lat: 9.9312, lng: 76.2673 },
    "erjanakulam": { name: "Ernakulam, Kerala", lat: 9.9816, lng: 76.2998 },
    "ernakulam": { name: "Ernakulam, Kerala", lat: 9.9816, lng: 76.2998 },
    "trivandrum": { name: "Thiruvananthapuram, Kerala", lat: 8.5241, lng: 76.9366 },
    "thiruvananthapuram": { name: "Thiruvananthapuram, Kerala", lat: 8.5241, lng: 76.9366 }
  },
  "Goa": {
    "goa": { name: "Goa Region", lat: 15.4909, lng: 73.8278 },
    "panaji": { name: "Panaji, Goa", lat: 15.4909, lng: 73.8278 },
    "margao": { name: "Margao, Goa", lat: 15.1509, lng: 73.9855 }
  },
  "Delhi": {
    "delhi": { name: "Delhi & NCR Region", lat: 28.6139, lng: 77.2090 },
    "new delhi": { name: "New Delhi", lat: 28.6139, lng: 77.2090 },
    "noida": { name: "Noida, NCR", lat: 28.5355, lng: 77.3910 }
  },
  "Gujarat": {
    "gujarat": { name: "Gujarat Region", lat: 23.0225, lng: 72.5714 },
    "ahmedabad": { name: "Ahmedabad, Gujarat", lat: 23.0225, lng: 72.5714 },
    "surat": { name: "Surat, Gujarat", lat: 21.1702, lng: 72.8311 },
    "vadodara": { name: "Vadodara, Gujarat", lat: 22.3072, lng: 73.1812 }
  },
  "Rajasthan": {
    "rajasthan": { name: "Rajasthan Region", lat: 26.9124, lng: 75.7873 },
    "jaipur": { name: "Jaipur, Rajasthan", lat: 26.9124, lng: 75.7873 },
    "jodhpur": { name: "Jodhpur, Rajasthan", lat: 26.2389, lng: 73.0243 },
    "udaipur": { name: "Udaipur, Rajasthan", lat: 24.5854, lng: 73.7125 }
  },
  "Bihar": {
    "bihar": { name: "Bihar Region", lat: 25.5941, lng: 85.1376 },
    "patna": { name: "Patna, Bihar", lat: 25.5941, lng: 85.1376 }
  },
  "Odisha": {
    "odisha": { name: "Odisha Region", lat: 20.2961, lng: 85.8245 },
    "orissa": { name: "Odisha Region", lat: 20.2961, lng: 85.8245 },
    "bhubaneswar": { name: "Bhubaneswar, Odisha", lat: 20.2961, lng: 85.8245 }
  },
  "Assam": {
    "assam": { name: "Assam Region", lat: 26.1158, lng: 91.7086 },
    "guwahati": { name: "Guwahati, Assam", lat: 26.1158, lng: 91.7086 },
    "northeast": { name: "North East Region", lat: 26.1158, lng: 91.7086 }
  },
  "Himachal Pradesh": {
    "himachal": { name: "Himachal Pradesh", lat: 31.1048, lng: 77.1734 },
    "shimla": { name: "Shimla, HP", lat: 31.1048, lng: 77.1734 }
  },
  "Andhra Pradesh": {
    "andhra": { name: "Andhra Pradesh", lat: 16.5062, lng: 80.6480 },
    "ap": { name: "Andhra Pradesh", lat: 16.5062, lng: 80.6480 },
    "vijayawada": { name: "Vijayawada, AP", lat: 16.5062, lng: 80.6480 },
    "visakhapatnam": { name: "Visakhapatnam, AP", lat: 17.6868, lng: 83.2185 }
  },
  "Chhattisgarh": {
    "chhattisgarh": { name: "Chhattisgarh", lat: 21.2514, lng: 81.6296 },
    "raipur": { name: "Raipur, Chhattisgarh", lat: 21.2514, lng: 81.6296 }
  }
};
import { 
  Play, 
  Volume2, 
  Settings, 
  Sparkles, 
  RefreshCw, 
  Sliders, 
  X, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronRight, 
  MessageSquare,
  User,
  Heart,
  Calendar,
  DollarSign,
  Briefcase,
  HelpCircle,
  FileText,
  VolumeX,
  Plus,
  Search
} from 'lucide-react';

interface SalesSimulatorViewProps {
  leadName: string;
  setLeadName: (v: string) => void;
  leadRelation: 'Student' | 'Parent';
  setLeadRelation: (v: 'Student' | 'Parent') => void;
  counsellorName: string;
  setCounsellorName: (v: string) => void;
  leadLocation: string;
  setLeadLocation: (v: string) => void;
  leadPincode: string;
  setLeadPincode: (v: string) => void;
  lead12thStream: 'PCB' | 'PCM' | 'Commerce' | 'Arts' | 'Other';
  setLead12thStream: (v: 'PCB' | 'PCM' | 'Commerce' | 'Arts' | 'Other') => void;
  lead12thMarks: number;
  setLead12thMarks: (v: number) => void;
  leadExamStatus: 'None' | 'NEET' | 'CET' | 'Both';
  setLeadExamStatus: (v: 'None' | 'NEET' | 'CET' | 'Both') => void;
  leadExamScore: number;
  setLeadExamScore: (v: number) => void;
  modelProvider: 'local' | 'groq' | 'openrouter';
  setModelProvider: (v: 'local' | 'groq' | 'openrouter') => void;
  modelApiKey: string;
  setModelApiKey: (v: string) => void;
  selectedModel: string;
  setSelectedModel: (v: string) => void;
  aiTemperature: number;
  setAiTemperature: (v: number) => void;
  showSettingsModal: boolean;
  setShowSettingsModal: (v: boolean) => void;
  currentCounsellingStep: number;
  setCurrentCounsellingStep: (v: number) => void;
  activeConflictObjectionId: number | null;
  setActiveConflictObjectionId: (v: number | null) => void;
  conflictSearchQuery: string;
  setConflictSearchQuery: (v: string) => void;
  conflictSelectedCategory: string;
  setConflictSelectedCategory: (v: string) => void;
  customAISpeechVariants: Record<number, string>;
  setCustomAISpeechVariants: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  customAIObjectionVariants: Record<number, string>;
  setCustomAIObjectionVariants: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  isAiLoading: boolean;
  setIsAiLoading: (v: boolean) => void;
  aiErrorMessage: string;
  setAiErrorMessage: (v: string) => void;
  leadProgramInterest: string;
  setLeadProgramInterest: (v: string) => void;
}

const GROQ_MODELS = [
  { id: 'llama-3.3-70b-specdec', name: 'Llama 3.3 70B (High Persuasion)' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B (Balanced Hybrid)' },
  { id: 'gemma2-9b-it', name: 'Gemma 2 9B (Clean & Direct)' },
  { id: 'llama3-70b-8192', name: 'Llama 3 70B (Deep Reasoning)' },
];

const OPENROUTER_MODELS = [
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B Instruct (Free)' },
  { id: 'google/gemini-2.1-flash:free', name: 'Gemini 2.1 Flash (Free - Fast)' },
  { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 Distil (Free - Thoughtful)' },
  { id: 'microsoft/phi-3-medium-128k-instruct:free', name: 'Phi 3 Medium 128k (Free)' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku (Paid - Elite)' },
];

const PROGRAM_INFOS: Record<string, { name: string; descEn: string; descHi: string }> = {
  All: {
    name: "Allied Health Sciences",
    descEn: "specialized medical fields like Medical Lab Science, Operation Theatre, Imaging, Emergency Care, and Physiotherapy, which form the back-bone of any modern hospital and handle 80% of clinical operations.",
    descHi: "specialized medical fields jaise Medical Lab Science, Operation Theatre, Imaging, Emergency Care, aur Physiotherapy, jo kisi bhi modern hospital ki back-bone hote hain aur 80% clinical operations ko handle karte hain."
  },
  'A&OTT': {
    name: "Anaesthesia & Operation Theatre Technology (A&OTT)",
    descEn: "critical care support, drug dose preparation, and high-tech surgical machinery setup in active Operation Theatres to assist surgeons during complex surgeries.",
    descHi: "critical care support, anesthesia dose preparation, aur high-tech surgical machinery setup Operation Theatre me, jo complex surgeries ke waqt surgeons ko closely assist karta hai."
  },
  CVT: {
    name: "Cardiovascular Technology (CVT)",
    descEn: "diagnosing and monitoring heart-related disorders, operating high-end ECG and cath-lab equipment, and supporting cardiac teams in life-saving heart procedures.",
    descHi: "heart-related disorders ko diagnose aur monitor karna, high-end ECG aur cath-lab machines operate karna, aur life-saving heart operations me cardiac teams ko support karna."
  },
  MLS: {
    name: "Medical Laboratory Science (MLS)",
    descEn: "conducting precise clinical pathology lab tests, chemical body-fluid analysis, and molecular diagnostics to trace and identify critical infections or blood disorders.",
    descHi: "precise clinical pathology lab tests karna, chemical body-fluid screening aur molecular diagnostics conduct karna taaki critical infections aur blood diseases identify ho sakein."
  },
  MRIT: {
    name: "Medical Radiology & Imaging Technology (MRIT)",
    descEn: "operating high-tech diagnostic imagers like MRI, CT Scan, X-Ray, and Ultrasound systems, and analyzing anatomical visuals to diagnose precise internal illnesses.",
    descHi: "high-tech diagnostic imaging equipment jaise MRI, CT Scan, X-Ray, aur Ultrasound machines operate karna aur anatomical pictures analyze karke body ke andar ki illness confirm karna."
  },
  BPT: {
    name: "Physiotherapy (BPT)",
    descEn: "treating muscular and skeletal recovery, rehabilitation therapy, post-accident trauma healing, and dynamic sports injury alignments using advanced therapeutic exercises.",
    descHi: "muscular aur skeletal recovery treatment, physical rehabilitation training, post-accident movement recovery, aur sports injury recovery advanced exercises ke through coordinate karna."
  },
  EMT: {
    name: "Emergency Medical Technology (EMT)",
    descEn: "first-responder trauma medicine, rapid ambulance operations, critical emergency room stabilizing acts, and immediate life-support procedures for critical patients.",
    descHi: "first-responder trauma service, fast ambulance logistics, critical emergency ICU stabilization, aur life-saving immediate treatment procedures critical patients ke liye manage karna."
  }
};

export default function SalesSimulatorView({
  leadName,
  setLeadName,
  leadRelation,
  setLeadRelation,
  counsellorName,
  setCounsellorName,
  leadLocation,
  setLeadLocation,
  leadPincode,
  setLeadPincode,
  lead12thStream,
  setLead12thStream,
  lead12thMarks,
  setLead12thMarks,
  leadExamStatus,
  setLeadExamStatus,
  leadExamScore,
  setLeadExamScore,
  modelProvider,
  setModelProvider,
  modelApiKey,
  setModelApiKey,
  selectedModel,
  setSelectedModel,
  aiTemperature,
  setAiTemperature,
  showSettingsModal,
  setShowSettingsModal,
  currentCounsellingStep,
  setCurrentCounsellingStep,
  activeConflictObjectionId,
  setActiveConflictObjectionId,
  conflictSearchQuery,
  setConflictSearchQuery,
  conflictSelectedCategory,
  setConflictSelectedCategory,
  customAISpeechVariants,
  setCustomAISpeechVariants,
  customAIObjectionVariants,
  setCustomAIObjectionVariants,
  isAiLoading,
  setIsAiLoading,
  aiErrorMessage,
  setAiErrorMessage,
  leadProgramInterest,
  setLeadProgramInterest,
}: SalesSimulatorViewProps) {
  
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi'>(() => (localStorage.getItem('sim_selected_language') as any) || 'English');
  const [selectedTone, setSelectedTone] = useState<'Standard' | 'Empathetic' | 'Urgent' | 'Scientific'>('Standard');
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [testConnectionStatus, setTestConnectionStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  const [simStateFilter, setSimStateFilter] = useState<string>(() => localStorage.getItem('sim_state_filter') || 'All');
  const [simFocusOnlyFilter, setSimFocusOnlyFilter] = useState<boolean>(() => localStorage.getItem('sim_focus_only') !== 'false');

  React.useEffect(() => {
    localStorage.setItem('sim_state_filter', simStateFilter);
  }, [simStateFilter]);

  React.useEffect(() => {
    localStorage.setItem('sim_focus_only', String(simFocusOnlyFilter));
  }, [simFocusOnlyFilter]);

  const simulatorStates = useMemo(() => {
    const states = Array.from(new Set(COLLEGES.map(c => c.state))).filter(Boolean).sort();
    return states;
  }, []);

  const [simSearchInput, setSimSearchInput] = useState<string>(leadLocation || '');
  const [isSimGeocoding, setIsSimGeocoding] = useState<boolean>(false);
  const [simGeocodeError, setSimGeocodeError] = useState<string>('');
  
  // Track precise geocoded coordinates exactly like Campus Matchmaker
  const [simSearchedLocation, setSimSearchedLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
    type?: string;
  } | null>(null);

  // Initialize simSearchedLocation from initial leadPincode / leadLocation props
  React.useEffect(() => {
    if (!simSearchedLocation) {
      let coords = getCoordinatesFromPincode(leadPincode);
      if (!coords) {
        coords = { name: leadLocation || 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567 };
      }
      setSimSearchedLocation({
        name: coords.name,
        lat: coords.lat,
        lng: coords.lng
      });
    }
  }, [leadPincode, leadLocation]);

  React.useEffect(() => {
    if (leadLocation && !simSearchInput) {
      setSimSearchInput(leadLocation);
    }
  }, [leadLocation]);

  const handleSimLocationSearch = async (queryStr: string) => {
    const cleanQuery = queryStr.trim().toLowerCase();
    if (!cleanQuery) return;

    setIsSimGeocoding(true);
    setSimGeocodeError('');

    // A) Check if numeric string represents a PIN code
    const pinDigits = cleanQuery.replace(/\D/g, '');
    if (pinDigits.length >= 4) {
      const pinResult = getCoordinatesFromPincode(pinDigits);
      if (pinResult) {
        setLeadLocation(pinResult.name.split(',')[0]);
        setLeadPincode(pinDigits);
        setSimSearchedLocation({
          name: pinResult.name,
          lat: pinResult.lat,
          lng: pinResult.lng,
          type: 'pincode'
        });
        setIsSimGeocoding(false);
        return;
      }
    }

    // B) Always search across all states and cities first in our high-fidelity static dictionary globally
    for (const st of Object.keys(STATE_CITIES_COORDS)) {
      const citiesMap = STATE_CITIES_COORDS[st];
      const foundCityKey = Object.keys(citiesMap).find(cityKey => 
        cleanQuery === cityKey || cleanQuery.includes(cityKey) || cityKey.includes(cleanQuery)
      );
      if (foundCityKey) {
        const matched = citiesMap[foundCityKey];
        setLeadLocation(matched.name.split(',')[0]);
        setSimSearchedLocation({
          name: matched.name,
          lat: matched.lat,
          lng: matched.lng,
          type: 'city'
        });
        setIsSimGeocoding(false);
        return;
      }
    }

    // C) Search matches in COLLEGE names and addresses
    const matchedCol = COLLEGES.find(
      c => c.name.toLowerCase().includes(cleanQuery) ||
           c.city.toLowerCase().includes(cleanQuery) ||
           c.address.toLowerCase().includes(cleanQuery)
    );

    if (matchedCol) {
      setLeadLocation(matchedCol.city);
      const defaultPincodes: Record<string, string> = {
        'indore': '452001',
        'pune': '411057',
        'thane': '400601',
        'kopargaon': '423601'
      };
      const usePin = defaultPincodes[matchedCol.city.toLowerCase()] || '411057';
      setLeadPincode(usePin);
      setSimSearchedLocation({
        name: `${matchedCol.city}, ${matchedCol.state}`,
        lat: matchedCol.lat,
        lng: matchedCol.lng,
        type: 'city'
      });
      setIsSimGeocoding(false);
      return;
    }

    // D) OpenStreetMap Nominatim Dynamic Geocoding live API fetch (with automatic fast abort timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryStr + ', India')}&format=json&limit=1`,
        {
          signal: controller.signal,
          headers: { 'Accept-Language': 'en' }
        }
      );
      clearTimeout(timeoutId);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const displayName = item.display_name.split(',')[0];
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        setLeadLocation(displayName);
        // Try to guess or extract a pincode from display_name using regex
        const pinMatch = item.display_name.match(/\b\d{6}\b/);
        if (pinMatch) {
          setLeadPincode(pinMatch[0]);
        }
        setSimSearchedLocation({
          name: item.display_name.split(',')[0] + ', India',
          lat,
          lng,
          type: 'custom'
        });
        setIsSimGeocoding(false);
        return;
      }
    } catch (err) {
      console.error(err);
    }

    // Fallback simply
    setLeadLocation(queryStr);
    setIsSimGeocoding(false);
  };

  const handleSimGpsLocation = () => {
    if (!navigator.geolocation) {
      setSimGeocodeError("Geolocation is not supported by your browser software.");
      return;
    }
    setIsSimGeocoding(true);
    setSimGeocodeError('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || "Pune";
            const pincode = data.address.postcode || "411057";
            setLeadLocation(city);
            setLeadPincode(pincode);
            setSimSearchInput(city);
            setSimSearchedLocation({
              name: city,
              lat: latitude,
              lng: longitude,
              type: 'custom'
            });
          }
        } catch (e) {
          setLeadLocation("Pune");
          setLeadPincode("411057");
          setSimSearchedLocation({
            name: "Pune",
            lat: 18.5204,
            lng: 73.8567,
            type: 'city'
          });
        } finally {
          setIsSimGeocoding(false);
        }
      },
      (error) => {
        setSimGeocodeError("GPS local mapping denied or timed out. Defaulting to Pune.");
        setIsSimGeocoding(false);
        setLeadLocation("Pune");
        setLeadPincode("411057");
        setSimSearchedLocation({
          name: "Pune",
          lat: 18.5204,
          lng: 73.8567,
          type: 'city'
        });
      },
      { timeout: 5000 }
    );
  };

  React.useEffect(() => {
    localStorage.setItem('sim_selected_language', selectedLanguage);
  }, [selectedLanguage]);

  // Filter objections dynamically
  const activeStep = COUNSELLING_STEPS.find(s => s.id === currentCounsellingStep) || COUNSELLING_STEPS[0];
  const activeObjection = OBJECTIONS.find(o => o.id === activeConflictObjectionId);

  const parsedCategories = useMemo(() => {
    return Array.from(new Set(OBJECTIONS.map(o => o.category)));
  }, []);

  const filteredObjections = useMemo(() => {
    return OBJECTIONS.filter(o => {
      const matchCat = conflictSelectedCategory === 'All' || o.category === conflictSelectedCategory;
      const matchQuery = !conflictSearchQuery.trim() || 
        o.objection.toLowerCase().includes(conflictSearchQuery.toLowerCase()) ||
        o.subCategory.toLowerCase().includes(conflictSearchQuery.toLowerCase()) ||
        o.category.toLowerCase().includes(conflictSearchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [conflictSelectedCategory, conflictSearchQuery]);

  // Key Objections recommended
  const topObjections = useMemo(() => {
    return OBJECTIONS.filter(o => [4, 6, 7, 9, 10, 13, 28, 29, 33, 39, 40, 41].includes(o.id));
  }, []);

  // Web TTS Engine
  const speakText = (text: string) => {
    if (!window.speechSynthesis) {
      alert("TTS audio synthesis not supported in this browser. Please open in other browser tools.");
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#]/g, ''); // Remove markdown markers
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Choose custom English speaking voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-US')) || voices[0];
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingText(null);
    utterance.onerror = () => setSpeakingText(null);
    
    setSpeakingText(text);
    window.speechSynthesis.speak(utterance);
  };

  const cancelSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingText(null);
  };

  // Find nearest college based on state and focus filters, and pincode or location
  const nearestFocusCollegeResult = useMemo(() => {
    const coords = simSearchedLocation || getCoordinatesFromPincode(leadPincode) || { name: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567 };

    const focusIds = ['ajeenkya', 'alard', 'universal-skilltech', 'sanjivani', 'medicaps'];
    
    // Filter COLLEGES based on focus colleges filter and state filter
    let filteredColleges = COLLEGES;
    if (simFocusOnlyFilter) {
      filteredColleges = filteredColleges.filter(c => focusIds.includes(c.id));
    }
    if (simStateFilter !== 'All') {
      filteredColleges = filteredColleges.filter(c => c.state === simStateFilter);
    }

    if (filteredColleges.length === 0) return null;

    let nearestCol = filteredColleges[0];
    let minDistance = Infinity;

    filteredColleges.forEach(col => {
      const dist = getHaversineDistance(coords.lat, coords.lng, col.lat, col.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestCol = col;
      }
    });

    return {
      college: nearestCol,
      distance: minDistance,
      coordsName: coords.name
    };
  }, [simSearchedLocation, leadPincode, simStateFilter, simFocusOnlyFilter]);

  // Personalize current counselling step template
  const getPersonalizedScript = (step: CounsellingStep, tone: typeof selectedTone = selectedTone, lang: typeof selectedLanguage = selectedLanguage) => {
    // If AI customized script exists, return it!
    const key = step.id * 100 + (lang === 'English' ? 0 : 50) + (tone === 'Standard' ? 0 : tone === 'Empathetic' ? 1 : tone === 'Urgent' ? 2 : 3);
    if (customAISpeechVariants[key]) {
      return customAISpeechVariants[key];
    }

    const nearestUnit = nearestFocusCollegeResult?.college;
    const nearestDist = nearestFocusCollegeResult?.distance;
    const colName = nearestUnit ? nearestUnit.name : "our elite partner university";
    const colDist = nearestUnit ? `${nearestDist} km` : "your near distance";
    const colFeeStr = nearestUnit ? nearestUnit.programFee : "7.2L total";
    const colPlac = nearestUnit ? `${nearestUnit.avgPlacementPackage} LPA` : "6 LPA";

    let colProg = "";
    if (lang === 'English') {
      if (leadProgramInterest === 'All' || !leadProgramInterest) {
        colProg = "Allied Health Sciences (covering crucial tracks like A&OTT for Operation Theatres, CVT for Cardiac diagnostics, MLS for pathology testing, MRIT for MRI/CT scans, BPT for physical rehabilitation, and EMT for emergency ambulance support, which together handle 80% of hospital operations)";
      } else {
        const info = PROGRAM_INFOS[leadProgramInterest] || PROGRAM_INFOS['All'];
        colProg = `${info.name} (where you will study ${info.descEn})`;
      }
    } else {
      if (leadProgramInterest === 'All' || !leadProgramInterest) {
        colProg = "Allied Health Sciences (jisey check karein toh isme multiple paths hain: A&OTT me operation theatres, CVT me heart machinery diagnosis, MLS me Pathology lab testing, MRIT me CT scan/MRI set, BPT me rehabilitation exercises, aur EMT me emergency ICU trauma coordinate, jo hospitals ka 80% work force manage hai)";
      } else {
        const info = PROGRAM_INFOS[leadProgramInterest] || PROGRAM_INFOS['All'];
        colProg = `${info.name} (jiski study me aap ${info.descHi})`;
      }
    }

    // Build Student Profile Insights string
    let academicMatchText = "";
    if (lang === 'English') {
      if (lead12thStream === 'PCB') {
        academicMatchText = `your strong 12th Biology stream with ${lead12thMarks}% marks is an absolute perfect fit for high-demand Allied Healthcare programs.`;
      } else if (lead12thStream === 'PCM') {
        academicMatchText = `your 12th Mathematical background with ${lead12thMarks}% marks gives you a massive advantage in handling complex medical radiology and cardiac technology equipment.`;
      } else {
        academicMatchText = `since you completed ${lead12thStream} stream with ${lead12thMarks}% marks, our healthcare management and global hospitality program track is a perfect carrier launchpad.`;
      }

      if (leadExamStatus === 'NEET' || leadExamStatus === 'Both') {
        academicMatchText += ` Since NEET was taken with a score of ${leadExamScore}, Allied Health is the most magnificent alternative to save gap-years and extra donations.`;
      } else if (leadExamStatus === 'CET') {
        academicMatchText += ` Your CET score of ${leadExamScore} validates your clinical potential, qualifying you for advanced tech-lab placements.`;
      }
    } else {
      if (lead12thStream === 'PCB') {
        academicMatchText = `aapka strong 12th Biology stream with ${lead12thMarks}% marks, high-demand Allied Healthcare programs ke liye ek absolute perfect fit hai.`;
      } else if (lead12thStream === 'PCM') {
        academicMatchText = `aapka 12th Mathematical background with ${lead12thMarks}% marks, high-tech medical radiology aur cardiac technology machines handle karne ke liye ek bada advantage hai.`;
      } else {
        academicMatchText = `kyoki aapne ${lead12thStream} stream with ${lead12thMarks}% marks ke sath 12th complete kiya hai, hamara healthcare management pathway ek perfect career option hai.`;
      }

      if (leadExamStatus === 'NEET' || leadExamStatus === 'Both') {
        academicMatchText += ` NEET me aapka score ${leadExamScore} hone se, Allied Health ek best option hai door-to-door placement security save karne aur gap-years ko waste na karne ke liye.`;
      } else if (leadExamStatus === 'CET') {
        academicMatchText += ` Aapka CET score ${leadExamScore} aapki high technical and diagnostic potential confirm karta hai.`;
      }
    }

    // Determine greetings based on Parent vs Student relation inside the active script
    const greeting = leadRelation === 'Parent' 
      ? (lang === 'English' ? `Hello Sir/Ma'am, parent of ${leadName}` : `Namaskar Sir/Ma'am, ${leadName} ke guardian`)
      : (lang === 'English' ? `Hello ${leadName}` : `Namaskar ${leadName}`);

    const relationSuffix = leadRelation === 'Parent'
      ? (lang === 'English' ? "your child's career safety, practical VR skills, and direct placement protection" : "aapke child ke safe career, hands-on practical VR skills, aur direct high-salary placement support")
      : (lang === 'English' ? "your personal interest in high-tech medical fields, VR headsets training, and exciting job placements" : "aapke high-tech allied medical fields me career interest, VR training labs, aur exciting clinical placements");

    let defaultText = step.scriptTemplate
      .replace(/\[Name\]/g, leadName)
      .replace(/\[CounsellorName\]/g, counsellorName)
      .replace(/\[Stream\]/g, "12th Science Stream")
      .replace(/\[City\]/g, leadLocation);

    // English Template sets
    if (lang === 'English') {
      if (tone === 'Standard') {
        const standardTemplates: Record<number, string> = {
          1: `Hello, am I speaking with ${leadRelation === 'Parent' ? `${leadName}'s Parent` : leadName}? This is ${counsellorName} from Emversity. I noticed you made an inquiry regarding our elite Allied Health or Hospitality parameters. I would love to take 5 minutes to outline the scope here. Are you free to speak right now?`,
          2: `Emversity operates as the exclusive skilling partner for elite UGC-recognized universities. While the direct university certifies you, Emversity manages the state-of-the-art simulation labs, VR technology training, and top-tier clinical hospital placements. Our closest premium partner center is ${colName} (located only ${colDist} from your zone).`,
          3: `Before we go deep, let me capture a few details. We noted you reside in ${leadLocation}. Who is the primary career advisory support in your family, mom or dad? Also, ${academicMatchText} Are you open to everyday transit or relocating to our secure campus at ${colName} inside ${nearestUnit?.city || 'the nearest hub'} for high-exposure placements?`,
          4: `Thank you for sharing. Based on your background, a B.Sc Honours in Allied Health sciences is an outstanding match. Especially at ${colName} where programs like ${colProg} are actively training students with remarkable direct global tie-ups.`,
          5: `The highlight of our system is our premium VR (Virtual Reality) simulation technology. We don't just teach from books. You put on a 3D headset and are transported into an immersive ICU or Operation Theatre setup. You can practice blood draws, diagnostic operating, and surgical prep infinite times with zero fear before entering real hospitals!`,
          6: `To really detail this, we coordinate a 1-on-1 career counselling slot with a senior health advisory doctor. The nominal fee is just ₹499. This covers complete course fitment, total program fees of ${colFeeStr} at ${colName} (at distance of ${colDist}), scholarship reports, and booking eligibility of a free laptop. Shall we lock a convenient time for you?`,
          7: `A super question! Standard free counselling is usually just a generic sales spiel. We charge a tiny ₹499 fee to ensure we secure 40 dedicated, highly serious minutes with a senior clinical expert. It's affordable, yet it will fully shape your professional medical career path.`,
          8: `I am looking at slots this week. We have Monday at 11:00 AM or Tuesday at 4:30 PM open. Which slot suits you and your family best so everyone can join together?`,
          9: `Excellent choice! Let's lock it. We are holding a slot for you to discuss customized seats, Allied Health criteria with average packages up to ${colPlac} at ${colName} (only ${colDist} from ${leadLocation}). I'll transfer the safe ₹499 digital booking link right now to your WhatsApp.`,
          10: `Before we wrap up, do you have any friend, classmate or fellow candidate exploring options? We would love to evaluate and support their career pathways too.`,
          11: `Thank you so much! Our team will send a meeting reminder 30 minutes prior. Have a great day and professional wishes for a bright clinical future!`
        };
        return standardTemplates[step.id] || standardTemplates[1];
      }

      if (tone === 'Empathetic') {
        const empatheticTemplates: Record<number, string> = {
          1: `Hello, my dear friend. I hope you're having a warm day. Am I speaking with ${leadRelation === 'Parent' ? `the caring parent of ${leadName}` : leadName}? This is ${counsellorName} from Emversity. I want to reassure you that choosing a healthcare career is the most noble and stable decision you can make for your family's future. Are you comfortable talking for a few minutes right now?`,
          2: `Please know that we treat our students like family. We partner with top UGC universities, but Emversity holds your hand through the entire journey. We've set up beautiful VR labs and secure hostel beds. Our nearest snug campus is ${colName} (just ${colDist} from your home in ${leadLocation}), keeping you close to family.`,
          3: `To understand your aspirations better, let's chat. ${academicMatchText} We want to ensure ${relationSuffix} is fully taken care of. Would you feel comfortable traveling daily or moving to ${colName} where we have 24/7 warden-guarded separate hostels?`,
          4: `I feel so happy listening to your goals. For your profile, B.Sc Honours in Allied Health Sci is a beautiful fit. At ${colName}, you will study premium modules like ${colProg}. It's highly rewarding, stress-free, and protects your career forever.`,
          5: `I understand that practicing on real patients for the first time can feel scary. That is why we built special VR immersive simulation wings! You can practice blood collection and tech tools in a safe, mistake-friendly 3D simulator until you are 100% confident. It's gentle, interactive, and completely safe.`,
          6: `To map this out comfortably with your parents, let's schedule a dedicated counseling conversation with our chief career doctor. We take a tiny commitment fee of ₹499, which ensures full 1-on-1 focus. We will explain total tuition structures (around ${colFeeStr} at ${colName}), student transport, and laptop quotas. Shall we set it up to bring you peace of mind?`,
          7: `I completely understand your query about the fee, and it's a very valid concern. We keep an ultra-nominal ₹499 fee purely to select serious candidates who value a high-quality 40-minute consultation. It goes directly towards booking your dedicated career advisor's premium medical hours.`,
          8: `I want to suggest a relaxing time. We have slots on Monday at 11:00 AM or Tuesday at 4:30 PM. Let's pick a slot so both you and your parents can securely clear all your doubts.`,
          9: `Wonderful! I'm so glad we're doing this. Your dedicated counseling meet is approved for ${colName} (only ${colDist} from you). We will protect your priority token for scholarship placements up to ${colPlac}. I'm sharing the absolute secure payment bridge to your WhatsApp. You are in safe hands!`,
          10: `By the way, is there any close classmate or sibling who would also love to discover high-paying medical careers? We would love to guide them with the same warmth.`,
          11: `Thank you so much for your precious time. We will support you at every single step. Look out for our call reminder 30 minutes before. Step forward with total confidence!`
        };
        return empatheticTemplates[step.id] || empatheticTemplates[1];
      }

      if (tone === 'Urgent') {
        const urgentTemplates: Record<number, string> = {
          1: `Hello, is this ${leadName}? This is ${counsellorName} from Emversity. I am calling on high priority because early 2026 seats for hospital-aligned specialized courses are closing rapidly. Do you have 2 critical minutes to lock your profile guidelines?`,
          2: `Time is of the essence! While UGC universities handle standard academic registries, Emversity manages the high-tech VR infrastructure and premium clinical placements at major hospital chains. Our nearest high-placement center is ${colName} (a close ${colDist} away), and the specialized seats in your region are already 85% full.`,
          3: `We need to move fast. You're in ${leadLocation} right? ${academicMatchText} To secure high-paying placements, we must act. Are you ready to daily transit or reserve a hostel seat at ${colName} before hostel blocks are locked out?`,
          4: `No time should be wasted on generic degrees! B.Sc Honours in Allied Health Sci is the highest-growing field in 2026. At ${colName}, specialized lanes like ${colProg} have direct placement tie-ups. Waiting means missing these premium pipelines.`,
          5: `Why do standard graduates struggle? Because they lack hands-on practice. Our premium VR dual-teacher training ensures you gain high-demand clinical skills instantly. This is a game changer that makes you job-ready 2 years ahead of others!`,
          6: `To block your seat on immediate priority, we must schedule a 1-on-1 video slot with our senior registrar. The booking fee is ₹499. This locks your eligibility check, ${colName} fee breakdown (${colFeeStr}), and a free student laptop. Let's lock this immediately before the countdown ends!`,
          7: `Look, free advice has no accountability. We request ₹499 purely to filter out casual web-surfers. This fee registers you in our system on prime list status, giving you preference for limited laptops and direct scholarship allocations.`,
          8: `I have only 2 slots left for this week: Monday at 11:00 AM and Tuesday at 4:30 PM. Let's grab one right now before other applicants lock it!`,
          9: `Smart move! I have booked your premium slot for ${colName} (only ${colDist} away). This locks your placement priority target of ${colPlac}. I am sending the active reservation link right now on WhatsApp. It expires in 15 minutes!`,
          10: `Quickly, is there any classmate you want to refer so they don't miss out on these early batch seats? We can queue them up right now.`,
          11: `Confirmed! Your prioritized advisor link is active. Please complete the ₹499 checkout instantly. We will call you exactly 30 minutes prior. Let's make this clinical career happen today!`
        };
        return urgentTemplates[step.id] || urgentTemplates[1];
      }

      if (tone === 'Scientific') {
        const scientificTemplates: Record<number, string> = {
          1: `Greetings. Am I connected with ${leadRelation === 'Parent' ? `the primary guardian of ${leadName}` : leadName}? This is clinical advisor ${counsellorName} representing Emversity. We are analyzing the career data models in the Indian healthcare sector. Do you have 5 minutes to verify your academic profiling parameters?`,
          2: `To maintain academic rigor, all degrees are issued by UGC-approved universities under standard academic frameworks. Emversity functions as the technological implementation partner, integrating advanced VR simulation modules and high-tier hospital placement parameters. Our nearest partner node is ${colName} (located at coordinates within ${colDist}).`,
          3: `Let us confirm the input parameters. Area of residence registered: ${leadLocation}. ${academicMatchText} Regarding geographical mobility, will you commute or utilize the dual-occupancy residential hostels at ${colName} to maximize placement percentages?`,
          4: `The descriptive diagnostic data indicates a strong qualification for B.Sc Honours in Allied Health Sciences. At ${colName}, you will undergo specialized training in ${colProg}. These programs align with high-demand clinical technology protocols.`,
          5: `Standard lecture methods show only a 30% retention rate. Our proprietary 3D VR simulated environment provides immersive multi-user training in virtual ICUs and Operation Theatres, resulting in a proven 90% increase in clinical procedure accuracy!`,
          6: `To systematize your pathway, let us book a 1-on-1 counseling slot with our chief medical career supervisor. The nominal diagnostic registry fee is ₹499. This covers structured program fee validation (${colFeeStr} at ${colName}), scholarship algorithms, and laptop priority processing. Shall we schedule?`,
          7: `A logical point of query. The ₹499 fee is implemented as a standard self-selection filter to optimize consultation hours with senior specialists. This ensures high-accuracy career mapping and priority hardware scheduling.`,
          8: `Let us look at schedule optimization. The vacant slots are Monday at 11:00 AM and Tuesday at 4:30 PM. Which coordinate matches your availability index?`,
          9: `Scheduling parameters validated. The counseling meet has been queued for ${colName} (coordinates: ${colDist} away) targeting career packages averaging ${colPlac}. The secure SSL transaction link is being dispatched to your WhatsApp number.`,
          10: `Do you have any peer-group data points to analyze? We can apply our clinical eligibility mapping to match their educational streams too.`,
          11: `Data synchronization complete. Our scheduling algorithm will trigger a notification check exactly 30 minutes before the session. Good luck with your upcoming clinical evaluation!`
        };
        return scientificTemplates[step.id] || scientificTemplates[1];
      }
    }

    // Hindi Template sets
    if (lang === 'Hindi') {
      if (tone === 'Standard') {
        const standardHindiTemplates: Record<number, string> = {
          1: `${greeting}, kya meri baat ${leadRelation === 'Parent' ? `${leadName} ke parents` : leadName} se ho rahi hai? Main Emversity se ${counsellorName} baat kar rahi hoon. Aapne hamare Allied Healthcare aur Hospital courses ke regarding enquiry ki thi. Is career ke behtareen scope ko samjhane ke liye bas 5 minute aapse baat karni thi. Kya abhi baat ho sakti hai?`,
          2: `Emversity UGC-recognized top universities ka official academic and placement partner hai. Aapka degree certificate seedhe partner university degi, par college ke inside high-tech lab setup, virtual reality (VR) training, aur bade hospitals me practical clinical training Emversity manage karti hai. Aapke sabse nearest partner campus ${colName} hai (jo aapke ghar se sirf ${colDist} ki distance par hai).`,
          3: `Aage discuss karne se pehle, aapki kuch details confirm karna chahungi. Aap abhi ${leadLocation} se bol rahe hain, right? Aur ghar me career ka main decision kaun leta hai, mummy ya papa? Aur ${academicMatchText} kya aap top hospitals me practical training ke liye hamare ${colName} campus jane me comfortable hain?`,
          4: `Information ke liye thank you! Aapki profile ke according B.Sc Honours in Allied Health Sciences aapke liye ek perfect career match hai. Hamare nearest campus ${colName} me ${colProg} jaise high-demand courses available hain jahan medical companies har saal acche package par recruit karti hain.`,
          5: `Hamara sabse unique feature hai Virtual Reality (VR) Simulation Lab. Isme students ko special 3D headset pehnakar seedhe ek real operation theatre ya ICU ka digital experience milta hai! Bina kisi risk ke, aap injection lagana, blood test karna, ya machines operate karna jitni baar chahein practice kar sakte hain, taaki hospital duties shuru karne se pehle aap 100% expert ho jayein.`,
          6: `Is process ko detail me samajhne ke liye, hamara next step hai ki hum ek senior career expert ke sath aapki 1-on-1 online counseling meeting schedule karein. Iski booking fee sirf ₹499 hai. Isme aapko ${colName} ki total fees (${colFeeStr}), scholarship criteria, hostel, aur free laptop distribution list me seat secure karne ki poori guide mil jayegi. Kya main aapka slot lock kar doon?`,
          7: `Aapka sawaal bilkul genuine hai! Free counseling me usually log serious interest ke bina connect hote hain. Hum sirf ₹499 isliye charge karte hain taaki senior doctor poore 40 minutes dedicatedly sirf aur sirf aapke child ke marks aur budget ke hisab se best career plan decide karein. Ye ek basic commitment fee hai jo unka time secure karti hai.`,
          8: `Main is week ke available slots check kar rahi hoon. Mere paas Monday morning 11:00 AM aur Tuesday evening 4:30 PM ke do slots khali hain. Aap aur aapke parents kis time par comfortable rahenge taaki sab sath me connect ho sakein?`,
          9: `Bahut hi accha decision! Main aapki career counseling booking register kar rahi hoon jahan hum seedhe ${colName} (distance: ${colDist}) ke admission, scholarship, aur lagbhag ${colPlac} tak ke average initial salary package ke baare me discuss karenge. Main turant payment link aapke WhatsApp par share karti/karta hoon.`,
          10: `Aur call complete karne se pehle, kya aapke classmates ya friends bhi NEET ke alawa medical field me career options dhoondh rahe hain? Hum unhe bhi ek proper pathway guide kar sakte hain.`,
          11: `Bahut-bahut dhanyavad aapke valuable time ke liye! Hamari team session se 30 minutes pehle aapko call ya message reminder bhej degi. Ek behtareen medical career banane ke liye aapko best wishes!`
        };
        return standardHindiTemplates[step.id] || standardHindiTemplates[1];
      }

      if (tone === 'Empathetic') {
        const empatheticHindiTemplates: Record<number, string> = {
          1: `${greeting}, namaskar. Main hope karti hoon ki aapka din accha guzar raha hoga. Main Emversity se ${counsellorName} baat kar rahi hoon. Main aap ko yeh saaf taur par bolna chahti hoon ki medical field chunna samaj sewa aur bacche ke future secure karne ka ek bahut hi accha decision hai. Kya aapke paas 5 minutes ka samay hai shanti se baat karne ke liye?`,
          2: `Hum apne har ek student ko apne family member ki tarah treat karte hain. UGC-verified partner universities ke sath hamara tie-up hai, par bacche ke hostel ki safety, overall security aur allied courses ki practical clinical training hum khud closely manage karte hain. Hamara sabse safe campus ${colName} aapke ghar se sirf ${colDist} door hai, jisse ya jab bhi baccha chahe ghar aasaani se aa-ja sake.`,
          3: `Hum chahte hain ki baccha bina kisi pressure ke padhai kare. ${academicMatchText} Hum chahte hain ki unki safe career journey ki poori responsibility hum lein. Kya baccha hamare ${colName} campus ke secure hostel environment me rehne ke liye comfortable hai?`,
          4: `Aapki baatein sunkar mujhe sach me bahut khushi hui. Aapki profile ke liye B.Sc Honours in Allied Health Sci se behtar aur safe koi doosra course nahi ho sakta. ${colName} me ${colProg} complete karne ke baad aapko seedhe Apollo ya Manipal jaise top hospital partners me direct secure placement support milega.`,
          5: `Normally students ko shuruat me clinical duties jaise blood withdraw karna ya injection lagane se thodi ghabrahat hoti hai, jo ki bilkul natural hai. Isliye humne special VR (Virtual Reality) simulation labs setup kiye hain. Yahan student 3D headset pehan kar pehle ek fake clinical room me unlimited times practice kar ke apna darr door kar sakta hai.`,
          6: `Is safe career pathway ko aapke parents ko acche se samjhane ke liye, hum hamare senior medical career advisor ke sath ek reassuring 1-on-1 session book kartey hain. Iski booking fee sirf ₹499 hai. Isme hum ${colName} ki total fees (${colFeeStr}), easy installment schemes, hostel safety aur free laptop allocation process completely discuss karenge. Kya main ise book kar doon?`,
          7: `Main aapki chinta ko poori tarah se samajh sakti hoon, hamare liye commercial aspects se zyada aapka trust aur peace of mind matter karta hai. Ye ₹499 ki minimal registration fee sirf serious families ko filter karne ke liye hai, taaki hamare senior doctors ka limited time un students ke liye utilize ho jo sach me clear path chahte hain.`,
          8: `Hum chahte hain ki aap aur aapke parents bina kisi jaldbazi ke aaram se details samajhein. Monday morning 11:00 AM ya Tuesday evening 4:30 PM, kaun sa time aapke liye sabse relaxing rahega?`,
          9: `Bahut hi buddhimata poorn nirnay! Maine aapka counseling session ${colName} (distance: ${colDist}) ke liye register kar diya hai. Yahan se students ko lagbhag ${colPlac} ka placement package mila hai. Main counseling details aur safe payment link abhi aapke WhatsApp par send kar rahi hoon.`,
          11: `Aapka bahut-bahut aabhar hamare sath judne ke liye! Session se 30 minutes pehle hum aapko final reminder call zaroor karenge. Aap bilkul chinta mat kijiye, sab bahut accha hoga!`
        };
        return empatheticHindiTemplates[step.id] || empatheticHindiTemplates[1];
      }

      if (tone === 'Urgent') {
        const urgentHindiTemplates: Record<number, string> = {
          1: `${greeting}, dhyan dijiye! Aaj subah se admission portal par seats book karne ke liye bahut rush hai. Main Emversity se Senior Coordinator ${counsellorName} baat kar rahi hoon. 2026 Batch ke allotment slots bahut fast speed se reserve ho rahe hain. Kya aapke paas 2 minutes ka time hai aapke child ki preference check karne ke liye?`,
          2: `Dekhiye, degree certification seedhe govt university se hi milega, par Emversity ki clinical training lab seats aur partner hospitals ke batches limited hote hain! Hamara aapke sabse nearest campus ${colName} hai (distance: ${colDist}). Yahan special healthcare courses ki seats lagbhag full hone ki kagar par hain.`,
          3: `Isme bilkul delay mat kijiye! Aapka location ${leadLocation} hai. Aur ${academicMatchText} agar is baar admission opportunity miss ho gayi, toh 1 saal ka educational gap ho jayega jo professional life me bada setback ban sakta hai. Kya aap ${colName} campus aur hostel options finalize karne ke liye ready hain taaki hum aaj hi seat secure kar sakein?`,
          4: `Aaj kal normal standard degrees karke lakhon graduates dhoondh rahe hain, par niche allied medical fields me vacancies vacant padi hain! ${colName} me ${colProg} jaise courses direct hospital recruitments se synced hain. Agar is samay process start nahi kiya, toh ye limited opportunity close ho jayegi.`,
          5: `Pure theoretical learning ka trend ab khatam ho gaya hai! Hamari latest 3D VR simulation tech hi students ko industry-grade professionals banati hai, jisse unhe first interview me hi high salary offers milte hain. Ye tech unhe baaki college students se 2 saal aage rakhti hai.`,
          6: `Admission control list me priority pane ke liye, hume seedhe Senior Registrar ke sath immediate 1-on-1 counseling block karni padegi. Iski booking commitment fee sirf ₹499 hai. Isme digital eligibility crosscheck, minimum available fee structure (${colFeeStr} at ${colName}), merit scholarships aur mandatory laptop reservation turant finalize ho jayega. Kya main timeline block kar doon?`,
          7: `Yakeen maniye, genuine and serious advice hamesha premium hoti. Ye ₹499 sirf serious and prioritized candidates ko register karne ke liye hai. Ise pay karte hi aapka entry ticket book ho jata hai aur priority scholarship allocation system me aap sabse top position par aa jate hain.`,
          8: `Mere dashboard me is samay sirf do priority seats khali hain: Monday morning 11:00 AM ya Tuesday evening 4:30 PM. Turant decide kijiye, varna ye system-generated slots expire ho jayenge!`,
          9: `Very smart choice! Maine aapka priority session ${colName} (distance: ${colDist} km) ke liye schedule kar diya hai jahan average starting package ${colPlac} tak record kiya gaya hai. WhatsApp par share kiye gaye portal link se ₹499 booking complete karein, ye session link sirf 15 minutes ke liye valid hai!`,
          10: `Kya aapke pass candidates ki references hain jo medical path me interest rakhte hain? Unki details please abhi share kijiye taaki dono ki counseling aur admission sequence hum simultaneously lock kar sakein.`,
          11: `Excellent! Setup completed. Payment notification receive hote hi aapka official reference ID generate ho jayega. Meeting se half-an-hour pehle final alarm update aapko mil jayega. All the best!`
        };
        return urgentHindiTemplates[step.id] || urgentHindiTemplates[1];
      }

      if (tone === 'Scientific') {
        const scientificHindiTemplates: Record<number, string> = {
          1: `${greeting}, namaskar. Main Emversity career research cell se ${counsellorName} baat kar rahi hoon. National Commission for Allied and Healthcare Professions (NCAHP) Act 2021 ke health workforce data indicators ke mutabiq, clinical operations me expert staff ka lagbhag 40% absolute shortage chal raha hai. Aapka academic portfolio scan karne ke liye kya 5 minutes ka samay mil sakta hai?`,
          2: `Admissions protocol ke basic rules ke mutabiq, all degree certificates UGC-approved partner universities dwara issue kiye jayenge. Emversity ki specialization high-fidelity virtual reality simulation labs aur clinical hospital placement mapping framework deploy karna hai. Geographically, aapke coordinates se nearest high-tech node ${colName} campus hai (jo strictly ${colDist} door hai).`,
          3: `Mathematical analysis confirm karein: aapka current regional hub ${leadLocation} hai. Aur ${academicMatchText} optimal professional proficiency ke liye kya aap daily ${colName} commute karenge ya campus ke secure in-house academic residential hostels choice karna chahenge jisse clinical practice matrix maximum ho sake?`,
          4: `Statistical evaluation aur profile eligibility assessment ke basis par, B.Sc Honours in Allied Health Sciences aapke score metrics ke liye optimal match hai. ${colName} me run ho rahe ${colProg} programs ki current healthcare ecosystem me recruitment index kaafi strong hai.`,
          5: `Applied medical research ke scientific studies se ye prove hua hai ki class lectures ka knowledge retention index sirf 30% hai, jabki virtual reality simulation labs ki training se diagnostic accuracy 90% tak upgrade ho jati hai! Hamari labs directly visual models and simulated room setups provide karti hain.`,
          6: `Is total parameters and placement curve ko process wise evaluate karne ke liye, hume Chief Career Analyst ke sath ek personalized 1-on-1 feedback session book karna hoga. Iski evaluation charges sirf ₹499 hai. Isme fee modules (${colFeeStr} at ${colName}), dynamic scholarship curves, aur hardware/laptop distribution criteria evaluate kiya jayega. Kya main session schedule kar doon?`,
          7: `Ye ek intellectual and logical process fee hai. ₹499 ensures high-quality execution, taaki hum core research analysts ke hours strictly un candidates ke liye assign kar sakein jinke data profiles healthcare standards ke liye fit hain.`,
          8: `Schedule timeline me abhi do slots available hain: Monday morning 11:00 AM ya Tuesday evening 4:30 PM. Aap kis evaluation window ko prioritize karenge?`,
          9: `Data entry finalized! Aapka analytical session ${colName} (distance: ${colDist}) ke liye block kar diya gaya hai jiska performance placement package lagbhag ${colPlac} initial median salary range track hua hai. Portal gateway link abhi aapke automatic WhatsApp API se dispatch ho raha hai.`,
          10: `Kya aapke metrics range me koi aur diagnostic candidates hain jo without NEET high-salary technical hospital medical paths investigate karna chahte hain? Unka basic academic record please verify karwayein.`,
          11: `Admissions confirmation pipeline successful. Session schedule se strictly 30 minutes pehle humara digital server automatic alert notification trigger kar dega. Healthcare automation and professional analytics me entrance ke liye hamari poori team ki taraf se shubhkamnayein.`
        };
        return scientificHindiTemplates[step.id] || scientificHindiTemplates[1];
      }
    }

    return defaultText;
  };

  // Get Personalized Objection Response
  const getPersonalizedObjection = (obj: Objection) => {
    if (customAIObjectionVariants[obj.id]) {
      return customAIObjectionVariants[obj.id];
    }
    return obj.idealResponse.replace(/Rohit/g, leadName);
  };

  // Call API to rewrite Script or Objection handling!
  const triggerAiRewriteCompletions = async (type: 'script' | 'objection', targetId: number, customPromptMessage: string) => {
    if (modelProvider === 'local') {
      alert("AI settings are currently offline (Local Mode). Please enter a Groq or OpenRouter API key in the settings panel to enable actual LLM models!");
      return;
    }
    if (!modelApiKey.trim()) {
      setAiErrorMessage("Invalid credentials. Please open the settings panel (gear icon) and paste a valid API key.");
      return;
    }

    setIsAiLoading(true);
    setAiErrorMessage('');
    
    const apiUrl = modelProvider === 'groq' 
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://openrouter.ai/api/v1/chat/completions';

    const systemPrompt = type === 'script'
      ? `You are an elite, highly persuasive sales manager training counselors for Emversity (UGC-approved allied health degree partner with 23+ campuses, VR simulation training, and ₹499 career demo sessions).
         Your task is to take the counselor script and modify it based on the name specified, relation (${leadRelation}), stream (${lead12thStream}), marks (${lead12thMarks}%), regional location (${leadLocation}, pincode: ${leadPincode}), program interest (${leadProgramInterest}), and the requested emotional tone and language guidelines: Lang="${selectedLanguage}", Tone="${selectedTone}". Prompt: "${customPromptMessage}".
         Create a natural, highly conversational script tailored exactly to whether the target person is indeed a Student (beta) or Parent (parents' protection). Keep it concise (1-2 paragraphs) for phone practicability.`
      : `You are an expert sales trainer simulating an objection call for Emversity's admission desk.
         The caller has raised this objection: "${customPromptMessage}".
         The caller relation is: ${leadRelation}. The student name is ${leadName}. Target parameters: 12th stream is ${lead12thStream}, marks is ${lead12thMarks}%, exam score is ${leadExamScore}.
         Using Emversity's Ideal response and Key Data Points, create a highly empathetic and persuasive phone response.
         Follow the Do's and Don'ts meticulously. Conclude by smoothly guiding them to reserve our ₹499 counseling session.
         Keep it brief and natural.`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${modelApiKey}`,
          'Content-Type': 'application/json',
          ...(modelProvider === 'openrouter' ? {
            'HTTP-Referer': 'https://ai.studio/build',
            'X-Title': 'Emversity Campus Advisor Desk'
          } : {})
        },
        body: JSON.stringify({
          model: selectedModel,
          temperature: aiTemperature,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: customPromptMessage }
          ]
        })
      });

      if (!response.ok) {
        const errDetails = await response.text();
        throw new Error(`API returned error status ${response.status}: ${errDetails || 'Unauthorized/Failed endpoint lookup'}`);
      }

      const data = await response.json();
      const outputText = data.choices?.[0]?.message?.content || "No text generated.";

      if (type === 'script') {
        const key = targetId * 100 + (selectedLanguage === 'English' ? 0 : 50) + (selectedTone === 'Standard' ? 0 : selectedTone === 'Empathetic' ? 1 : selectedTone === 'Urgent' ? 2 : 3);
        setCustomAISpeechVariants(prev => ({
          ...prev,
          [key]: outputText
        }));
      } else {
        setCustomAIObjectionVariants(prev => ({
          ...prev,
          [targetId]: outputText
        }));
      }
    } catch (e: any) {
      console.error(e);
      setAiErrorMessage(e.message || "An error occurred during communication with the AI provider.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const testConnectionAndKey = async (provider: 'groq' | 'openrouter', apiKeyString: string, modelStr: string) => {
    if (!apiKeyString.trim()) {
      setTestConnectionStatus('failed');
      return;
    }
    setTestConnectionStatus('idle');

    const testUrl = provider === 'groq' 
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://openrouter.ai/api/v1/chat/completions';

    try {
      const response = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKeyString}`,
          'Content-Type': 'application/json',
          ...(provider === 'openrouter' ? {
            'HTTP-Referer': 'https://ai.studio/build',
            'X-Title': 'Test Link'
          } : {})
        },
        body: JSON.stringify({
          model: modelStr,
          messages: [{ role: 'user', content: 'Say hello ' }],
          max_tokens: 10
        })
      });

      if (response.ok) {
        setTestConnectionStatus('success');
      } else {
        setTestConnectionStatus('failed');
      }
    } catch (e) {
      console.error(e);
      setTestConnectionStatus('failed');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Control Deck & Persona configuration */}
      <section className="glass-panel rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-6 text-[#14b8a6] opacity-10 pointer-events-none">
          <Sliders className="w-16 h-16" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#14b8a6] uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Counselor Practice Deck
            </span>
            <h2 className="text-white text-2xl font-extrabold tracking-tight font-sans">
              Dynamic Objection Handling & Call Simulator
            </h2>
            <p className="text-[#a1a1aa] text-xs leading-relaxed max-w-2xl font-sans">
              Develop elite sales conviction. Simulate real-time leads, track sequential scripted steps, and instantly resolve complex objections raised in the middle of talking. Connect the AI models below to craft custom scenarios dynamically!
            </p>
          </div>

          <div className="flex items-center gap-3">
            {modelProvider === 'local' ? (
              <span className="bg-[#3f3f46]/30 border border-[#3f3f46] text-[#71717a] font-mono text-[10px] rounded-full py-1 px-3">
                🔌 Offline Local Fallback Mode
              </span>
            ) : (
              <span className="bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] font-mono text-[10.5px] rounded-full py-1 px-3 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Active Model: {selectedModel.split('/').pop()}
              </span>
            )}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 border border-[#3f3f46] hover:border-[#14b8a6] rounded-xl glass-pill/20 text-white transition-all text-xs cursor-pointer"
              title="Simulator Core Configuration"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lead Persona settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#27272a]/60">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#71717a] uppercase font-bold block" htmlFor="sim-counselor-name-input">
              👤 Training Counselor Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-[#71717a]" />
              <input
                id="sim-counselor-name-input"
                type="text"
                placeholder="Maya"
                value={counsellorName}
                onChange={(e) => setCounsellorName(e.target.value)}
                className="w-full glass-input hover:border-[#3f3f46] focus:border-[#14b8a6] focus:outline-none rounded-xl py-2 px-9 text-xs text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#71717a] uppercase font-bold block" htmlFor="sim-lead-name-input">
              👨‍🎓 Candidate / Lead Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-[#71717a]" />
              <input
                id="sim-lead-name-input"
                type="text"
                placeholder="Rohit"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="w-full glass-input hover:border-[#3f3f46] focus:border-[#14b8a6] focus:outline-none rounded-xl py-2 px-9 text-xs text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#71717a] uppercase font-bold block" htmlFor="sim-lead-relation">
              🤝 Target Relation on Call
            </label>
            <div className="flex glass-input rounded-xl p-0.5">
              {(['Student', 'Parent'] as const).map(rel => (
                <button
                  key={rel}
                  id={`relation-btn-${rel.toLowerCase()}`}
                  onClick={() => setLeadRelation(rel)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    leadRelation === rel
                      ? 'glass-pill text-white font-bold'
                      : 'text-[#71717a] hover:text-[#a1a1aa]'
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 📍 Student Proximity Profiling & Center Matchmaker (Focused on the Focus 5 Partner Colleges) */}
        <div className="mt-4 pt-4 border-t border-[#27272a]/60 grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          {/* Inputs Section */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-3.5 bg-[#141416]/50 border border-[#27272a]/40 p-4 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-[#14b8a6] opacity-5 pointer-events-none">
              <Plus className="w-12 h-12" />
            </div>
            
            <div className="space-y-3.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[#14b8a6] text-sm animate-pulse">📍</span>
                <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">
                  Student Location Parameters
                </span>
              </div>
              
              {/* Location Search Input (Identical to Campus Matchmaker) */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-[#a1a1aa] uppercase font-bold block" htmlFor="sim-search-input">
                  🔍 Find Nearest College (City, Area or Pincode)
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="e.g. Solapur, Indore, 411057..."
                    value={simSearchInput}
                    onChange={(e) => setSimSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSimLocationSearch(simSearchInput);
                    }}
                    className="flex-1 glass-input hover:border-[#3d3d41] focus:border-[#14b8a6] focus:outline-none rounded-xl py-2 px-3 text-xs text-white"
                    id="sim-search-input"
                  />
                  <button
                    onClick={handleSimGpsLocation}
                    className="px-2.5 py-2 bg-[#115e59]/20 text-[#2dd4bf] border border-[#14b8a6]/30 hover:bg-[#115e59]/30 rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-1"
                    title="Use Device GPS"
                    id="btn-sim-gps"
                  >
                    📍 <span className="text-[9px]">GPS</span>
                  </button>
                  <button
                    disabled={isSimGeocoding}
                    onClick={() => handleSimLocationSearch(simSearchInput)}
                    className="px-3 py-2 bg-[#14b8a6]/20 text-[#2dd4bf] border border-[#14b8a6]/45 hover:bg-[#14b8a6]/30 rounded-xl text-xs font-bold disabled:opacity-50 transition-all cursor-pointer"
                    id="btn-sim-locate"
                  >
                    {isSimGeocoding ? '...' : 'Search'}
                  </button>
                </div>
                {simGeocodeError && (
                  <p className="text-[9px] text-red-400 font-mono">{simGeocodeError}</p>
                )}
              </div>

              {/* Manual Override Inputs for State/Zip */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-[#a1a1aa] uppercase font-bold block" htmlFor="sim-lead-location">
                    📍 Area Resolved
                  </label>
                  <input
                    id="sim-lead-location"
                    type="text"
                    value={leadLocation}
                    onChange={(e) => {
                      setLeadLocation(e.target.value);
                      setSimSearchInput(e.target.value);
                    }}
                    className="w-full glass-input hover:border-[#3f3f46] focus:border-[#14b8a6] focus:outline-none rounded-xl py-1.5 px-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-[#a1a1aa] uppercase font-bold block" htmlFor="sim-lead-pincode">
                    🔢 PIN Code
                  </label>
                  <input
                    id="sim-lead-pincode"
                    type="text"
                    maxLength={6}
                    value={leadPincode}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLeadPincode(val);
                      if (val.length >= 4) {
                        const coords = getCoordinatesFromPincode(val);
                        if (coords) {
                          setSimSearchedLocation({
                            name: coords.name,
                            lat: coords.lat,
                            lng: coords.lng,
                            type: 'pincode'
                          });
                        }
                      }
                    }}
                    className="w-full glass-input hover:border-[#3f3f46] focus:border-[#14b8a6] focus:outline-none rounded-xl py-1.5 px-2.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* State and Focus Campus Filters (Dynamic nearest college selection) */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-[#a1a1aa] uppercase font-bold block" htmlFor="sim-state-filter">
                    🏛️ State Filter
                  </label>
                  <select
                    id="sim-state-filter"
                    value={simStateFilter}
                    onChange={(e) => setSimStateFilter(e.target.value)}
                    className="w-full glass-input hover:border-[#3f3f46] focus:border-[#14b8a6] focus:outline-none rounded-xl py-1.5 px-2.5 text-xs text-white cursor-pointer"
                  >
                    <option value="All">All States (20+ Campuses)</option>
                    {simulatorStates.map(stateName => (
                      <option key={stateName} value={stateName}>{stateName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-[#a1a1aa] uppercase font-bold block leading-none mb-1">
                    ⚡ Focus Campus Filter
                  </span>
                  <button
                    type="button"
                    onClick={() => setSimFocusOnlyFilter(!simFocusOnlyFilter)}
                    className={`w-full inline-flex items-center justify-between rounded-xl border px-2.5 py-1.5 text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                      simFocusOnlyFilter 
                        ? 'bg-teal-500/10 hover:bg-teal-500/20 text-[#14b8a6] border-teal-500/30' 
                        : 'bg-[#18181b] border-[#27272a] hover:bg-[#202022] text-[#a1a1aa]'
                    }`}
                  >
                    <span>{simFocusOnlyFilter ? '🚀 Focus 5 Only' : '🌍 All Campuses'}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${simFocusOnlyFilter ? 'bg-[#14b8a6] animate-pulse' : 'bg-zinc-500'}`} />
                  </button>
                </div>
              </div>

              {/* Student Academic Profiling Section */}
              <div className="border-t border-[#27272a]/60 pt-3 space-y-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-500 text-xs">🎓</span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                    Student Background Profile
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-[#a1a1aa] uppercase font-bold block flex justify-between" htmlFor="sim-program-interest">
                    <span>💡 Intended Program Track</span>
                    <span className="text-[#14b8a6] text-[8px] font-mono">Dynamic Speech Adaptation</span>
                  </label>
                  <select
                    id="sim-program-interest"
                    value={leadProgramInterest}
                    onChange={(e) => setLeadProgramInterest(e.target.value)}
                    className="w-full glass-input hover:border-[#3f3f46] focus:border-[#14b8a6] focus:outline-none rounded-xl py-1.5 px-2.5 text-xs text-white cursor-pointer"
                  >
                    <option value="All">🧬 All / General (Showcase All Fields)</option>
                    <option value="A&OTT">🏥 Anaesthesia & Operation Theatre Tech (A&OTT)</option>
                    <option value="CVT">🫀 Cardiovascular Technology (CVT)</option>
                    <option value="MLS">🔬 Medical Laboratory Science (MLS / MLT)</option>
                    <option value="MRIT">🩻 Medical Radiology & Imaging Tech (MRIT)</option>
                    <option value="BPT">🤸 Physiotherapy (BPT)</option>
                    <option value="EMT">🚨 Emergency Medical Technology (EMT)</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-[#71717a] uppercase font-bold block">
                      12th Stream (Science)
                    </label>
                    <select
                      value={lead12thStream}
                      onChange={(e) => setLead12thStream(e.target.value as any)}
                      className="w-full glass-input focus:border-[#14b8a6] focus:outline-none rounded-xl py-1.5 px-2 text-xs text-white cursor-pointer"
                    >
                      <option value="PCB">PCB (Bio)</option>
                      <option value="PCM">PCM (Maths)</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Arts">Humanities / Arts</option>
                      <option value="Other">Other / Vocational</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-[#a1a1aa] uppercase font-bold block flex justify-between">
                      <span>12th Marks</span>
                      <span className="text-[#14b8a6] font-mono">{lead12thMarks}%</span>
                    </label>
                    <input
                      type="range"
                      min={40}
                      max={100}
                      value={lead12thMarks}
                      onChange={(e) => setLead12thMarks(Number(e.target.value))}
                      className="w-full accent-[#14b8a6] cursor-pointer glass-pill rounded-lg appearance-none h-1.5 mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-[#71717a] uppercase font-bold block">
                      Exams Taken
                    </label>
                    <select
                      value={leadExamStatus}
                      onChange={(e) => setLeadExamStatus(e.target.value as any)}
                      className="w-full glass-input focus:border-[#14b8a6] focus:outline-none rounded-xl py-1.5 px-2 text-xs text-white cursor-pointer"
                    >
                      <option value="None">None</option>
                      <option value="NEET">NEET Exam</option>
                      <option value="CET">State CET Exam</option>
                      <option value="Both">Both NEET & CET</option>
                    </select>
                  </div>

                  {leadExamStatus !== 'None' && (
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-[#a1a1aa] uppercase font-bold block">
                        Score / Percentile
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={720}
                        value={leadExamScore}
                        onChange={(e) => setLeadExamScore(Number(e.target.value))}
                        className="w-full glass-input hover:border-[#3f3f46] focus:border-[#14b8a6] focus:outline-none rounded-xl py-1.5 px-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[10px] text-[#71717a] leading-relaxed font-sans mt-2">
              Allied health counseling pitches are automatically moderated! We resolve coordinates to find the closest Focus University, dynamically injecting academic details, streaming eligibilities, and distances into standard call dialogues.
            </p>
          </div>

          {/* Results Matcher Deck */}
          <div className="md:col-span-7 glass-panel shadow-inner rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[#27272a]/40 pb-2.5 mb-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#14b8a6]/10 text-[#14b8a6] text-[9.5px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border border-[#14b8a6]/20 font-mono">
                  Closest Focus University Suggested
                </span>
              </div>
              {nearestFocusCollegeResult && (
                <div className="text-[11px] font-extrabold text-[#14b8a6] font-mono bg-[#14b8a6]/10 px-2.5 py-0.5 rounded-lg border border-[#14b8a6]/20">
                  Distance: {nearestFocusCollegeResult.distance} km away
                </div>
              )}
            </div>

            {nearestFocusCollegeResult ? (
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="text-sm font-black text-white leading-snug">
                      {nearestFocusCollegeResult.college.name}
                    </h3>
                    <p className="text-[10.5px] text-[#71717a] mt-0.5 flex items-center gap-1">
                      <span>📍</span> {nearestFocusCollegeResult.college.address}
                    </p>
                  </div>
                </div>

                {/* Info Array derived directly from Matchmaker assets */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-[#27272a]/30 pt-3 text-[10.5px]">
                  <div>
                    <span className="text-[#a1a1aa] block text-[9.5px] font-mono uppercase tracking-widest">Available Tech Programs</span>
                    <p className="text-white font-semibold truncate text-[11px] mt-0.5" title={nearestFocusCollegeResult.college.programsList.join(', ')}>
                      {nearestFocusCollegeResult.college.programsList.join(', ')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#a1a1aa] block text-[9.5px] font-mono uppercase tracking-widest">Campus Booking Fee</span>
                    <p className="text-white font-semibold text-[11px] mt-0.5">
                      {nearestFocusCollegeResult.college.programFee}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#a1a1aa] block text-[9.5px] font-mono uppercase tracking-widest font-bold">LPA ROI Performance</span>
                    <p className="text-[#10b981] font-extrabold text-[11px] mt-0.5">
                      {nearestFocusCollegeResult.college.avgPlacementPackage} LPA avg package
                    </p>
                  </div>
                  <div>
                    <span className="text-[#a1a1aa] block text-[9.5px] font-mono uppercase tracking-widest">Hostel and Food Wings</span>
                    <p className="text-white font-semibold text-[11px] mt-0.5">
                      {nearestFocusCollegeResult.college.hostelAvailable}
                    </p>
                  </div>
                </div>

                <div className="bg-[#1c1c1e] rounded-xl p-2.5 text-[10.5px] text-[#a1a1aa] leading-relaxed border border-[#27272a]/60">
                  <span className="font-bold text-white block mb-0.5 text-[10px] uppercase font-mono tracking-widest">⭐ Campus Matchmaker unique USP highlights</span>
                  {nearestFocusCollegeResult.college.uniquePoints}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#71717a] py-6 text-center italic">Type any valid pin code/hometown to execute proximity search...</p>
            )}
          </div>
        </div>
      </section>

      {/* Main interactive grid splitting into standard counseling script vs mid-call objections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Span 2): Counselling Script Timeline & Core dialogue */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Timeline workflow bar */}
          <div className="glass-panel rounded-2xl p-4 shadow-lg overflow-x-auto">
            <div className="flex min-w-[700px] items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 glass-pill z-0 -translate-y-1/2" />
              {COUNSELLING_STEPS.map((step, idx) => {
                const isActive = step.id === currentCounsellingStep;
                const isPassed = step.id < currentCounsellingStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      setCurrentCounsellingStep(step.id);
                      setSelectedTone('Standard');
                    }}
                    className="relative z-10 flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer"
                    id={`navigation-step-${step.id}`}
                    title={`Go to step: ${step.title}`}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-bold transition-all ${
                      isActive 
                        ? 'bg-[#14b8a6] border-[#14b8a6] text-white shadow-md shadow-[#14b8a6]/20 scale-110' 
                        : isPassed
                        ? 'bg-[#10b981] border-[#10b981] text-white'
                        : 'bg-[#18181b] border-[#27272a] text-[#71717a] hover:border-[#a1a1aa]'
                    }`}>
                      {step.id}
                    </div>
                    <span className={`text-[9px] font-mono font-semibold max-w-[65px] text-center leading-tight tracking-tight ${
                      isActive ? 'text-[#14b8a6] font-bold' : 'text-[#71717a]'
                    }`}>
                      {step.title.split(':')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Dialogue Card */}
          <div className="glass-panel rounded-3xl p-6 shadow-xl space-y-6 relative">
            <div className="flex justify-between items-start border-b border-[#27272a] pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#14b8a6] uppercase font-extrabold block">
                  Counselling Script: Step {activeStep.id} of 11
                </span>
                <h3 className="text-white text-lg font-bold font-sans">
                  {activeStep.title}
                </h3>
                <p className="text-[#a1a1aa] text-[11px]">
                  {activeStep.description}
                </p>
              </div>

              <div className="glass-pill/40 border border-[#27272a] rounded-xl px-2.5 py-1 text-[9px] text-[#71717a] font-mono">
                PITCH TARGET: <strong className="text-white font-sans">{activeStep.role === 'Both' ? leadRelation : activeStep.role}</strong>
              </div>
            </div>

            {/* AI Speech customizer Language & Tone selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#71717a] uppercase font-bold block">
                  🗣️ Select Advisor Language
                </span>
                <div className="flex bg-[#18181b] p-1 rounded-xl border border-[#27272a] gap-1">
                  {[
                    { id: 'English', label: '🇺🇸 English Script' },
                    { id: 'Hindi', label: '🇮🇳 Hinglish Hybrid' }
                  ].map(langOption => {
                    const isSel = selectedLanguage === langOption.id;
                    return (
                      <button
                        key={langOption.id}
                        onClick={() => {
                          setSelectedLanguage(langOption.id as any);
                          cancelSpeech();
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                          isSel 
                            ? 'bg-[#14b8a6] text-white font-extrabold shadow-sm' 
                            : 'text-[#a1a1aa] hover:text-white hover:glass-pill/30'
                        }`}
                      >
                        {langOption.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#71717a] uppercase font-bold block">
                  🎭 Select Advisor Emotional Tone
                </span>
                <div className="flex flex-wrap gap-1 bg-[#18181b] p-1 rounded-xl border border-[#27272a]">
                  {[
                    { id: 'Standard', label: '📞 Standard', icon: FileText },
                    { id: 'Empathetic', label: '💝 Empathetic', icon: Heart },
                    { id: 'Urgent', label: '⏳ Urgent', icon: Calendar },
                    { id: 'Scientific', label: '🔬 Scientific', icon: ShieldCheck }
                  ].map(t => {
                    const Icon = t.icon;
                    const isSel = selectedTone === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSelectedTone(t.id as any);
                          cancelSpeech();
                        }}
                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                          isSel 
                            ? 'bg-[#14b8a6] text-white font-extrabold shadow-sm' 
                            : 'text-[#a1a1aa] hover:text-white hover:glass-pill/30'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* The Speech Box */}
            <div className="p-5 glass-input rounded-2xl space-y-4 shadow-inner relative group min-h-[160px] flex flex-col justify-between">
              
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-2 grow">
                  <RefreshCw className="w-8 h-8 text-[#14b8a6] animate-spin" />
                  <span className="text-xs font-mono text-[#a1a1aa]">Optimizing script with direct LLM model...</span>
                </div>
              ) : (
                <div className="space-y-3 grow">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#71717a]">
                    <span>Advisor Speech Output:</span>
                    {(selectedTone !== 'Standard' || selectedLanguage !== 'English') && customAISpeechVariants[activeStep.id * 100 + (selectedLanguage === 'English' ? 0 : 50) + (selectedTone === 'Standard' ? 0 : selectedTone === 'Empathetic' ? 1 : selectedTone === 'Urgent' ? 2 : 3)] && (
                      <span className="text-[#10b981] font-semibold">✨ Optimized with customized {selectedModel.split('/').pop()}</span>
                    )}
                  </div>
                  <p className="text-white text-[12.5px] leading-relaxed font-sans whitespace-pre-wrap">
                    {getPersonalizedScript(activeStep, selectedTone)}
                  </p>
                </div>
              )}

              {aiErrorMessage && (
                <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 text-xs font-sans tracking-wide">
                  ⚠️ {aiErrorMessage}
                </div>
              )}

              {/* Speech actions */}
              <div className="flex justify-between items-center pt-3 border-t border-[#27272a]/40 mt-4">
                <div className="flex gap-2">
                  {speakingText === getPersonalizedScript(activeStep, selectedTone) ? (
                    <button
                      onClick={cancelSpeech}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                    >
                      <VolumeX className="w-4 h-4" />
                      Mute Audio
                    </button>
                  ) : (
                    <button
                      onClick={() => speakText(getPersonalizedScript(activeStep, selectedTone))}
                      disabled={isAiLoading}
                      className="px-3.5 py-1.5 bg-[#14b8a6] hover:bg-[#0f766e] text-white disabled:opacity-50 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                      title="Read advisor speech out loud using browser TTS engine"
                    >
                      <Volume2 className="w-4 h-4 text-white" />
                      Read Aloud (TTS)
                    </button>
                  )}

                  {/* AI Refiner trigger */}
                  {modelProvider !== 'local' && (
                    <button
                      onClick={() => triggerAiRewriteCompletions('script', activeStep.id, `Personalize this advisor counselling script: "${activeStep.scriptTemplate}" for student name "${leadName}", relation "${leadRelation}", in a highly persuasive tone of style: "${selectedTone}". Keep length concise.`)}
                      disabled={isAiLoading}
                      className="px-3.5 py-1.5 border border-[#3f3f46] hover:border-[#14b8a6] glass-pill/40 hover:glass-pill text-[#e4e4e7] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Optimize using the selected Groq/OpenRouter model"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#14b8a6]" />
                      Improve with AI (LLM)
                    </button>
                  )}
                </div>

                <div className="flex gap-1">
                  <button
                    disabled={currentCounsellingStep === 1}
                    onClick={() => {
                      setCurrentCounsellingStep(currentCounsellingStep - 1);
                      setSelectedTone('Standard');
                      cancelSpeech();
                    }}
                    className="p-1 px-3 border border-[#27272a] hover:border-[#3f3f46] text-[#a1a1aa] hover:text-white rounded-lg text-xs font-bold cursor-pointer disabled:opacity-30"
                  >
                    Prev
                  </button>
                  <button
                    disabled={currentCounsellingStep === COUNSELLING_STEPS.length}
                    onClick={() => {
                      setCurrentCounsellingStep(currentCounsellingStep + 1);
                      setSelectedTone('Standard');
                      cancelSpeech();
                    }}
                    className="p-1 px-3 glass-pill hover:bg-[#3f3f46] text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Next Step Progress
                  </button>
                </div>
              </div>
            </div>

            {/* Core profiling screening questions help card */}
            <div className="p-4 bg-[#141416] border border-[#27272a] rounded-2xl space-y-2">
              <h4 className="text-[10px] font-mono text-[#14b8a6] uppercase font-bold block flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Step-Related Profiling Probes Checklist
              </h4>
              <p className="text-[#a1a1aa] text-[11px] leading-relaxed">
                During Step 3 and 4, click and prompt these standard Profiling Probes to build a strong psychological lead profile:
              </p>
              <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1 mt-2 border border-[#27272a] rounded-xl p-3 bg-[#111113]">
                {PROFILING_QUESTIONS.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[9.5px] font-bold font-mono text-white block">{cat.category}</span>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-[10px] text-[#71717a]">
                      {cat.questions.map((q, qidx) => (
                        <li key={qidx} className="leading-relaxed hover:text-[#e4e4e7] transition-colors">{q}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Objection Handler Deck, Interruption Panel */}
        <div className="space-y-6">
          
          {/* Objections Database Search Deck */}
          <div className="glass-panel rounded-3xl p-5 shadow-xl space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#14b8a6]" />
              Objections Repo (50 Mapped Cases)
            </h4>

            {/* Inputs and search */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#71717a]" />
                <input
                  type="text"
                  placeholder="Type category or keyword (e.g., Fees, MBBS)..."
                  value={conflictSearchQuery}
                  onChange={(e) => setConflictSearchQuery(e.target.value)}
                  className="w-full glass-input hover:border-[#3f3f46] focus:border-[#14b8a6] focus:outline-none rounded-xl py-2 pl-9 pr-3 text-xs text-white"
                />
              </div>

              <select
                aria-label="Filter objections by category"
                value={conflictSelectedCategory}
                onChange={(e) => setConflictSelectedCategory(e.target.value)}
                className="w-full glass-input focus:border-[#14b8a6] focus:outline-none rounded-xl py-2 px-3 text-xs text-white"
              >
                <option value="All">All Categories ({OBJECTIONS.length})</option>
                {parsedCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Quick recommend tags lists */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[9.5px] font-mono text-[#71717a] uppercase font-bold block">🚨 Common Objections Discussed</span>
              <div className="flex flex-wrap gap-1">
                {topObjections.slice(0, 7).map(obj => (
                  <button
                    key={obj.id}
                    onClick={() => {
                      setActiveConflictObjectionId(obj.id);
                      setSelectedTone('Standard');
                      cancelSpeech();
                    }}
                    className={`text-[9.5px] font-mono font-medium rounded-md px-1.5 py-0.5 border transition-all cursor-pointer ${
                      activeConflictObjectionId === obj.id
                        ? 'bg-red-500/20 border-red-500 text-red-300'
                        : 'bg-[#27272b]/30 border-[#27272a] text-[#a1a1aa] hover:border-[#71717a]'
                    }`}
                  >
                    #{obj.id} {obj.subCategory}
                  </button>
                ))}
              </div>
            </div>

            {/* Core list matching search query */}
            <div className="space-y-1.5">
              <span className="text-[9.5px] font-mono text-[#71717a] uppercase font-bold block font-sans">
                Full Objections Database ({filteredObjections.length} found)
              </span>
              <div className="max-h-[220px] overflow-y-auto space-y-1.5 border border-[#27272a] rounded-xl p-2 bg-[#18181b] pr-1 scrollbar-thin">
                {filteredObjections.map(obj => {
                  const isAct = obj.id === activeConflictObjectionId;
                  return (
                    <button
                      key={obj.id}
                      onClick={() => {
                        setActiveConflictObjectionId(obj.id);
                        setSelectedTone('Standard');
                        cancelSpeech();
                      }}
                      className={`w-full text-left p-2.5 rounded-lg border text-[11px] leading-tight transition-all flex justify-between items-start gap-2 cursor-pointer ${
                        isAct
                          ? 'bg-[#271515] border-red-500/40 text-red-200 font-semibold'
                          : 'bg-[#111113] border-[#27272a] text-[#a1a1aa] hover:border-[#313135] hover:text-[#e4e4e7]'
                      }`}
                    >
                      <div className="space-y-1">
                        <strong className="block text-[#e4e4e7] leading-normal">#{obj.id}. {obj.objection.replace(/Rohit/g, leadName)}</strong>
                        <span className="text-[9px] text-[#71717a] font-mono uppercase block">{obj.category} &rsaquo; {obj.subCategory}</span>
                      </div>
                      <span className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded ${
                        obj.difficulty === 'Hard' ? 'bg-red-950/40 text-red-400' : 'bg-[#14b8a6]/20 text-[#14b8a6]'
                      }`}>{obj.difficulty}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Interruption State (If an objection is activated!) */}
          <AnimatePresence mode="wait">
            {activeConflictObjectionId !== null && activeObjection ? (
              <motion.div
                key="objection-popup"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#271515] border border-red-500/20 rounded-3xl p-5 lg:p-6 shadow-2xl relative overflow-hidden space-y-4"
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-500/5 rounded-full pointer-events-none" />
                
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center gap-1 bg-red-950/40 text-red-400 px-2.5 py-0.5 rounded-full border border-red-500/20 text-[10px] font-semibold font-mono">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    CALL OBJECTION INTERRUPT!
                  </span>
                  <button
                    onClick={() => {
                      setActiveConflictObjectionId(null);
                      cancelSpeech();
                    }}
                    className="text-[#71717a] hover:text-white p-1"
                    title="Dismiss objection & resume regular pitch"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Simulated caller speechbubble */}
                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-mono text-red-400 font-bold block">
                    🔴 Candidate ({leadName}'s {leadRelation === 'Student' ? 'Student' : 'Parent'}) objects:
                  </span>
                  <div className="bg-[#18181b]/95 border border-[#27272a] rounded-2xl rounded-tl-none p-4 relative text-white text-[12px] leading-relaxed italic">
                    "{activeObjection.objection.replace(/Rohit/g, leadName)}"
                    <div className="absolute -top-3 left-0 w-3 h-3 bg-[#18181b] border-l border-t border-[#27272a] transform -rotate-45" />
                  </div>
                </div>

                {/* Objection details metrics */}
                <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                  <div className="p-2 bg-[#18181b] rounded-xl border border-[#27272a]">
                    <span className="text-[8.5px] font-mono text-[#71717a] uppercase font-bold block">Caller Emotion</span>
                    <strong className="text-rose-400 font-sans">{activeObjection.callerEmotion}</strong>
                  </div>
                  <div className="p-2 bg-[#18181b] rounded-xl border border-[#27272a]">
                    <span className="text-[8.5px] font-mono text-[#71717a] uppercase font-bold block">Difficulty Level</span>
                    <span className={`font-mono text-xs font-semibold ${
                      activeObjection.difficulty === 'Hard' ? 'text-red-500' : 'text-[#14b8a6]'
                    }`}>{activeObjection.difficulty}</span>
                  </div>
                </div>

                {/* Rule-based Response playbook */}
                <div className="space-y-2 text-[11px]">
                  <div className="p-3 bg-[#18181b]/50 border border-green-500/10 rounded-xl space-y-1">
                    <span className="text-[9px] font-mono text-green-500 uppercase font-bold block">DO's (Actionable)</span>
                    <p className="text-[#a1a1aa] leading-relaxed">{activeObjection.dos}</p>
                  </div>
                  <div className="p-3 bg-[#18181b]/50 border border-red-500/10 rounded-xl space-y-1">
                    <span className="text-[9px] font-mono text-red-500 uppercase font-bold block">DONT's (Forbidden)</span>
                    <p className="text-[#71717a] leading-relaxed">{activeObjection.donts}</p>
                  </div>
                  <div className="p-3 bg-[#18181b]/50 border border-blue-500/10 rounded-xl space-y-1">
                    <span className="text-[9px] font-mono text-[#38bdf8] uppercase font-bold block">Verify Key Data Points</span>
                    <p className="text-white font-mono text-[9px]">{activeObjection.keyDataPoints}</p>
                  </div>
                </div>

                {/* Counselor rebuttal dialogue */}
                <div className="p-4 glass-input rounded-xl space-y-3 shadow-inner">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-green-400 font-bold block">💡 Elite Response Rebuttal Script:</span>
                    {customAIObjectionVariants[activeObjection.id] && (
                      <span className="text-[#38bdf8]">LLM Customized</span>
                    )}
                  </div>
                  <p className="text-white text-xs leading-relaxed font-sans">
                    {getPersonalizedObjection(activeObjection)}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[#27272a]/40">
                    {speakingText === getPersonalizedObjection(activeObjection) ? (
                      <button
                        onClick={cancelSpeech}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10.5px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <VolumeX className="w-3.5 h-3.5" />
                        Mute Rebuttal
                      </button>
                    ) : (
                      <button
                        onClick={() => speakText(getPersonalizedObjection(activeObjection))}
                        className="px-3 py-1 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg text-[10.5px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-white" />
                        Read Aloud
                      </button>
                    )}

                    {modelProvider !== 'local' && (
                      <button
                        onClick={() => triggerAiRewriteCompletions('objection', activeObjection.id, `Objection raised: "${activeObjection.objection}". Caller is ${leadRelation} named ${leadName} feeling ${activeObjection.callerEmotion}. Standard response: "${activeObjection.idealResponse}". Generate a powerful personalized rebuttal using the Do's and Don'ts.`)}
                        disabled={isAiLoading}
                        className="px-3 py-1 border border-[#3f3f46] hover:border-red-400 text-white rounded-lg text-[10.5px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-red-400" />
                        AI Personalize
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => {
                      setActiveConflictObjectionId(null);
                      cancelSpeech();
                    }}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 border-t border-red-500/20 cursor-pointer shadow"
                  >
                    <Check className="w-4 h-4" />
                    Accept and Resume Script Progress
                  </button>
                </div>
              </motion.div>
            ) : (
              // Default panel showing instructions on how to trigger a conflict
              <motion.div
                key="objection-idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel rounded-3xl p-5 lg:p-6 shadow-xl space-y-4 text-center py-12"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-white text-sm font-bold">Interrupt with conflict / objection</h4>
                <p className="text-[#a1a1aa] text-[11px] leading-relaxed max-w-xs mx-auto">
                  objections can be thrown in the middle of talking. If a parent or candidate objects, select the relevant conflict type below! The flow immediately pivots to the objection handling rebuttal system.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Settings Modal (Credentials configuration for Groq / OpenRouter) */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 space-y-5"
            >
              <div className="flex justify-between items-start border-b border-[#27272a] pb-4">
                <div className="space-y-1">
                  <h3 className="text-white font-extrabold text-lg flex items-center gap-1.5 font-sans">
                    <Settings className="w-5 h-5 text-[#14b8a6]" />
                    LLM Provider Configurations
                  </h3>
                  <p className="text-[#a1a1aa] text-xs">Configure Groq or OpenRouter keys locally.</p>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1 text-[#71717a] hover:text-white rounded-lg hover:glass-pill/30"
                  aria-label="Close Settings"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Provider Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-[#71717a] uppercase font-bold block" htmlFor="settings-provider-select">
                  API Model Provider
                </label>
                <select
                  id="settings-provider-select"
                  value={modelProvider}
                  onChange={(e) => {
                    const p = e.target.value as any;
                    setModelProvider(p);
                    if (p === 'groq') {
                      setSelectedModel(GROQ_MODELS[0].id);
                    } else if (p === 'openrouter') {
                      setSelectedModel(OPENROUTER_MODELS[0].id);
                    } else {
                      setSelectedModel('local_fallback');
                    }
                  }}
                  className="w-full glass-input focus:border-[#14b8a6] focus:outline-none rounded-xl py-2 px-3 text-xs text-white"
                >
                  <option value="local">Local Rule Fallback (No Key Needed)</option>
                  <option value="groq">Groq Client Proxy</option>
                  <option value="openrouter">OpenRouter API Portal</option>
                </select>
              </div>

              {modelProvider !== 'local' && (
                <>
                  {/* API Key Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-[#71717a] uppercase font-bold block" htmlFor="settings-api-key-input">
                      {modelProvider === 'groq' ? 'Groq' : 'OpenRouter'} API Connection Secret Key
                    </label>
                    <input
                      id="settings-api-key-input"
                      type="password"
                      placeholder="Paste your API key here (saved locally)"
                      value={modelApiKey}
                      onChange={(e) => setModelApiKey(e.target.value)}
                      className="w-full glass-input focus:border-[#14b8a6] focus:outline-none rounded-xl py-2 px-3 text-xs text-white font-mono"
                    />
                    <span className="text-[9.5px] text-[#71717a] leading-relaxed block">
                      Saved client-side within browser storage only. Keeps keys completely secure.
                    </span>
                  </div>

                  {/* Model Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-[#71717a] uppercase font-bold block" htmlFor="settings-model-select">
                      Available Model List
                    </label>
                    <select
                      id="settings-model-select"
                      aria-label="Select Model"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full glass-input focus:border-[#14b8a6] focus:outline-none rounded-xl py-2 px-3 text-xs text-white"
                    >
                      {modelProvider === 'groq' 
                        ? GROQ_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)
                        : OPENROUTER_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)
                      }
                    </select>
                  </div>

                  {/* Temperature slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#71717a] uppercase font-bold">
                      <label htmlFor="settings-temp-slider">AI Temperature (Creativity)</label>
                      <span className="text-white">{aiTemperature}</span>
                    </div>
                    <input
                      id="settings-temp-slider"
                      type="range"
                      min="0.1"
                      max="1.2"
                      step="0.1"
                      value={aiTemperature}
                      onChange={(e) => setAiTemperature(Number(e.target.value))}
                      className="w-full accent-[#14b8a6] bg-[#18181b] rounded-lg h-1"
                    />
                  </div>

                  {/* Test connection results */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => testConnectionAndKey(modelProvider, modelApiKey, selectedModel)}
                      className="px-3.5 py-1.5 border border-[#3f3f46] hover:border-[#10b981] bg-[#18181b] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Test Key Speed Connection
                    </button>

                    {testConnectionStatus === 'success' && (
                      <span className="text-xs text-emerald-400 font-semibold font-mono flex items-center gap-1">
                        <Check className="w-4 h-4" /> Connection Success!
                      </span>
                    )}
                    {testConnectionStatus === 'failed' && (
                      <span className="text-xs text-rose-500 font-semibold font-mono flex items-center gap-1">
                        <X className="w-4 h-4" /> Connection Failed
                      </span>
                    )}
                  </div>
                </>
              )}

              {/* Close Button */}
              <div className="pt-4 border-t border-[#27272a]">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="w-full py-2.5 bg-[#14b8a6] hover:bg-[#0f766e] text-white font-extrabold rounded-xl text-xs shadow cursor-pointer justify-center flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Save Configurations & Return
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
