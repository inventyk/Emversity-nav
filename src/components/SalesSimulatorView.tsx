/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OBJECTIONS, COUNSELLING_STEPS, Objection, CounsellingStep, PROFILING_QUESTIONS } from '../data/trainingData';
import { COLLEGES, getCoordinatesFromPincode, getHaversineDistance } from '../data';
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
}: SalesSimulatorViewProps) {
  
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi'>(() => (localStorage.getItem('sim_selected_language') as any) || 'English');
  const [selectedTone, setSelectedTone] = useState<'Standard' | 'Empathetic' | 'Urgent' | 'Scientific'>('Standard');
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [testConnectionStatus, setTestConnectionStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  const [simSearchInput, setSimSearchInput] = useState<string>(leadLocation || '');
  const [isSimGeocoding, setIsSimGeocoding] = useState<boolean>(false);
  const [simGeocodeError, setSimGeocodeError] = useState<string>('');

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
        setIsSimGeocoding(false);
        return;
      }
    }

    // B) Always search across states and cities in our static dictionary or database
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
      setLeadPincode(defaultPincodes[matchedCol.city.toLowerCase()] || '411057');
      setIsSimGeocoding(false);
      return;
    }

    // C) OpenStreetMap Nominatim Dynamic Geocoding live API fetch (with automatic fast abort timeout)
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
        setLeadLocation(displayName);
        // Try to guess or extract a pincode from display_name using regex
        const pinMatch = item.display_name.match(/\b\d{6}\b/);
        if (pinMatch) {
          setLeadPincode(pinMatch[0]);
        }
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
          }
        } catch (e) {
          setLeadLocation("Pune");
          setLeadPincode("411057");
        } finally {
          setIsSimGeocoding(false);
        }
      },
      (error) => {
        setSimGeocodeError("GPS local mapping denied or timed out. Defaulting to Pune.");
        setIsSimGeocoding(false);
        setLeadLocation("Pune");
        setLeadPincode("411057");
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

  // Find nearest college among Focus 5 Partner Colleges based on pincode or location
  const nearestFocusCollegeResult = useMemo(() => {
    let coords = getCoordinatesFromPincode(leadPincode);
    if (!coords) {
      coords = { name: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567 };
    }

    const focusIds = ['ajeenkya', 'alard', 'universal-skilltech', 'sanjivani', 'medicaps'];
    const focusColleges = COLLEGES.filter(c => focusIds.includes(c.id));

    if (focusColleges.length === 0) return null;

    let nearestCol = focusColleges[0];
    let minDistance = Infinity;

    focusColleges.forEach(col => {
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
  }, [leadPincode]);

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
    const colProg = nearestUnit ? nearestUnit.programsList[0] : "B.Sc. Allied Health Science";
    const colPlac = nearestUnit ? `${nearestUnit.avgPlacementPackage} LPA` : "6 LPA";

    // Build Student Profile Insights string
    let academicMatchText = "";
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

    // Determine greetings based on Parent vs Student relation inside the active script
    const greeting = leadRelation === 'Parent' 
      ? (lang === 'English' ? `Hello Sir/Ma'am, parent of ${leadName}` : `नमस्ते सर/मैडम, ${leadName} के अभिभावक`)
      : (lang === 'English' ? `Hello ${leadName}` : `नमस्ते ${leadName} बेटा`);

    const relationSuffix = leadRelation === 'Parent'
      ? (lang === 'English' ? "your child's career safety, practical VR skills, and direct placement protection" : "आपके बच्चे की सुरक्षित नौकरी, VR स्किल ट्रेनिंग और बड़े अस्पतालों में डायरेक्ट प्लेसमेंट")
      : (lang === 'English' ? "your personal interest in high-tech medical fields, VR headsets training, and exciting job placements" : "आपका मेडिकल फील्ड में करियर बनाने का सपना, VR लैब ट्रेनिंग और आपका डायरेक्ट प्लेसमेंट");

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
          1: `${greeting}, क्या मेरी बात ${leadRelation === 'Parent' ? `${leadName} के माता-पिता` : leadName} से हो रही है? मैं एम्वर्सिटी से ${counsellorName} बात कर रही हूँ। आपने हमारे एलाइड हेल्थकेयर और हॉस्पिटल कोर्सेज के रिगार्डिंग इन्क्वायरी की थी। इस करियर के शानदार स्कोप को समझाने के लिए बस 5 मिनट आपसे बात करनी थी। क्या अभी बात हो सकती है?`,
          2: `एम्वर्सिटी यूजीसी-रिकग्नाइज्ड टॉप यूनिवर्सिटीज का ऑफिशियल एकेडमिक और प्लेसमेंट पार्टनर है। आपका डिग्री सर्टिफिकेट सीधे पार्टनर यूनिवर्सिटी देगी, पर कॉलेज के अन्दर हाई-टेक लैब सेटअप, वर्चुअल रियलिटी (VR) ट्रेनिंग और बड़े अस्पतालों में प्रैक्टिकल क्लिनिकल ट्रेनिंग एम्वर्सिटी हैंडल करती है। आपके यहाँ सबसे नजदीक पार्टनर कैंपस ${colName} है (जो आपके घर से सिर्फ ${colDist} की दूरी पर है)।`,
          3: `आगे डिस्कस करने से पहले आपकी कुछ डिटेल्स जानना चाहूंगी। आप अभी ${leadLocation} से बोल रहे हैं, सही है? घर में करियर का मुख्य निर्णय कौन लेता है, मम्मी या पापा? और ${academicMatchText} क्या आप टॉप अस्पतालों में प्रैक्टिकल क्लिनिकल ट्रेनिंग के लिए हमारे ${colName} कैंपस जाने में कम्फर्टेबल हैं?`,
          4: `जानकारी देने के लिए धन्यवाद! आपकी प्रोफाइल के हिसाब से B.Sc Honours in Allied Health Sci आपके लिए एक परफेक्ट करियर मैच है। हमारे नजदीक कैंपस ${colName} में ${colProg} जैसे काफी डिमांडिंग कोर्सेज उपलब्ध हैं जहाँ मेडिकल कंपनियां हर साल बड़े पैकेज पर हायर करती हैं।`,
          5: `हमारा सबसे अनोखा फीचर है वर्चुअल रियलिटी (VR) सिमुलेशन लैब। इसमें स्टूडेंट्स को स्पेशल 3D हेडसेट पहनाकर सीधे एक असली ऑपरेशन थिएटर या ICU का डिजिटल अनुभव मिलता है! बिना किसी रिस्क के आप इंजेक्शन लगाना, ब्लड टेस्ट करना या मशीन ऑपरेट करना जितनी बार चाहें प्रैक्टिस कर सकते हैं, जिससे हॉस्पिटल जाने से पहले आप 100% निपुण हो जाएं।`,
          6: `इसको अच्छे से समझने के लिए हमारा अगला स्टेप है कि हम एक सीनियर करियर डॉक्टर के साथ आपकी 1-on-1 ऑनलाइन काउंसलिंग मीटिंग बुक करें। इसकी बुकिंग फीस सिर्फ ₹499 है। इसमें आपको ${colName} की टोटल फीस (${colFeeStr}), स्कॉलरशिप क्राइटेरिया, हॉस्टल और फ्री लैपटॉप डिस्ट्रीब्यूशन लिस्ट में नाम सिक्योर करने की पूरी गाइड मिल जाएगी। क्या मैं आपका टाइम लॉक कर दूँ?`,
          7: `आपका सवाल बिल्कुल जायज है! फ्री काउंसलिंग में आमतौर पर लोग बिना सीरियसनेस के बात करते हैं। हम सिर्फ ₹499 इसलिए चार्ज करते हैं ताकि सीनियर डॉक्टर पूरे 40 मिनट डेडीकेटेड होकर सिर्फ और सिर्फ आपके बच्चे के मार्क्स और आर्थिक बजट के हिसाब से बेस्ट करियर प्लान डिसाइड करें। यह मूवी टिकट से भी सस्ता है पर लाइफ बदल देगा!`,
          8: `मैं इस हफ्ते के खाली स्लॉट्स चेक कर रही हूँ। मेरे पास सोमवार सुबह 11:00 बजे और मंगलवार शाम 4:30 बजे के दो स्लॉट्स खाली हैं। आप और आपके पेरेंट्स किस टाइम पर कम्फर्टेबल रहेंगे ताकि सब साथ जुड़ सकें?`,
          9: `बहुत ही बढ़िया फैसला! तो हम आपकी करियर काउंसलिंग बुकिंग सिक्योर कर रहे हैं जिसमें हम सीधे ${colName} (जो सिर्फ ${colDist} दूरी पर है) के एडमिशन, स्कॉलरशिप और लगभग ${colPlac} तक के एवरेज शुरुआती सैलरी पैकेज डिस्कस करेंगे। मैं तुरंत पेमेंट लिंक आपके WhatsApp पर भेज रही हूँ।`,
          10: `और कॉल समाप्त करने से पहले, क्या आपके क्लासमेट या जानने वाले भी नीट के अलावा करियर ऑप्शंस ढूंढ रहे हैं? हम उन्हें भी एक बेहतरीन मेडिकल करियर पाथवे गाइड करेंगे।`,
          11: `बहुत-बहुत धन्यवाद आपके कीमती समय के लिए! हमारी टीम मीटिंग से 30 मिनट पहले आपको एक कॉल रिमाइंडर भेज देगी। एक बेहतरीन मेडिकल करियर बनाने के लिए आपको बहुत-बहुत शुभकामनाएं!`
        };
        return standardHindiTemplates[step.id] || standardHindiTemplates[1];
      }

      if (tone === 'Empathetic') {
        const empatheticHindiTemplates: Record<number, string> = {
          1: `${greeting}, प्रणाम। मैं आशा करती हूँ कि आपका दिन बहुत अच्छा जा रहा होगा। मैं एम्वर्सिटी से ${counsellorName} बात कर रही हूँ। मैं आपको यह विश्वास दिलाना चाहती हूँ कि मेडिकल फील्ड चुनना समाज सेवा और बच्चे के भविष्य की सुरक्षा का सबसे पवित्र फैसला है। क्या आपके पास 5 मिनट का छोटा सा समय है अभी बात करने के लिए?`,
          2: `हम अपने हर स्टूडेंट को अपने परिवार की तरह मानते हैं। यूजीसी-वेरिफाइड टॉप यूनिवर्सिटीज के साथ हमारा टाइ-अप है, पर बच्चे के रहने की सुरक्षा, हॉस्टल सिक्योरिटी और एलाइड साइंस की प्रैक्टिकल ट्रेनिंग हम खुद करीब से संभालते हैं। हमारा नजदीकी कैंपस ${colName} आपके घर से सिर्फ ${colDist} दूरी पर है, जिससे बच्चा कभी भी घर आ-जा सकता है।`,
          3: `हम चाहते हैं कि बच्चा बिना किसी तनाव के आगे बढ़े। ${academicMatchText} हम चाहते हैं कि ${relationSuffix} की पूरी जिम्मेदारी हम लें। क्या बच्चा हमारे ${colName} कैंपस की सुरक्षित हॉस्टल विंग में सुरक्षित रूप से रहने के लिए तैयार है?`,
          4: `आपकी बातें सुनकर मुझे बहुत ख़ुशी हुई! आपकी प्रोफाइल के लिए B.Sc Honours in Allied Health Sci से बेहतर और सुरक्षित कोई दूसरा कोर्स नहीं है। ${colName} में ${colProg} की पढ़ाई करने के बाद आपको सीधे बड़े ब्रांड्स जैसे अपोलो या मनीपाल हॉस्पिटल्स में डायरेक्ट सुरक्षित प्लेसमेंट मिलेगा।`,
          5: `बच्चों को हॉस्पिटल ड्यूटी में शुरू में असली मरीजों का ब्लड ड्रॉ करने या सुई लगाने से थोड़ा घबराहट होती है, जो कि बिल्कुल स्वाभाविक है। इसलिए हमने खास VR (वर्चुअल रियलिटी) सिमुलेशन लैब बनाई हैं। यहाँ बच्चा 3D चश्मा पहनकर पहले एक शांत, फ्रेंडली माहौल वाले सिमुलेटेड रूम में इंजेक्शन लगाने की अनलिमिटेड प्रैक्टिस करके अपना डर दूर कर सकता है!`,
          6: `इस शांत और सुरक्षित पाथवे को अच्छे से आपके पेरेंट्स को समझाने के लिए, हम हमारे चीफ मेडिकल करियर एडवाइजर के साथ एक सुकून भरी 1-on-1 बातचीत बुक कर देते हैं। इसकी बुकिंग फीस सिर्फ ₹499 है। इसमें हम ${colName} की टोटल सुगम फीस (${colFeeStr}), आसान इंस्टॉलमेंट ऑप्शंस, हॉस्टल विंग और फ्री लैपटॉप एलिजिबिलिटी डिस्कस करेंगे। क्या मैं इसे रजिस्टर कर दूँ?`,
          7: `मैं आपकी चिंता को पूरी तरह समझती हूँ, हमारे लिए पैसे से पहले आपकी संतुष्टि जरूरी है। यह ₹499 की छोटी सी टोकन फीस इसलिए है क्योंकि हमारे सीनियर डॉक्टर्स का टाइम बहुत लिमिटेड होता है और हम चाहते हैं कि इसे सिर्फ वे ही पेरेंट्स बुक करें जो अपने बच्चे के भविष्य को लेकर एकदम गंभीर हैं।`,
          8: `हम चाहते हैं कि आप और आपके पेरेंट्स बिना किसी जल्दबाजी के आराम से बात करें। सोमवार सुबह 11:00 बजे या मंगलवार शाम 4:30 बजे, कौन सा समय आपके लिए सबसे सुकून भरा रहेगा?`,
          9: `बहुत ही उत्तम निर्णय! मैंने आपके काउंसलिंग स्लॉट को ${colName} (दूरी: ${colDist}) के लिए रजिस्टर कर दिया है। यहाँ से बच्चों को औसतन ${colPlac} का प्लेसमेंट पैकेज मिला है। मैं काउंसलिंग की बुकिंग और सुरक्षित पे-लिंक तुरंत आपके व्हाट्सएप पर सेंड कर रही हूँ।`,
          10: `क्या आपके आसपास कोई और बेटा या बेटी भी है जो डॉक्टर बनने के अलावा हॉस्पिटल के अन्य सम्मानजनक कोर्सेज एक्सप्लोर करना चाहता है? हम उसे भी पूरा स्नेह और मार्गदर्शन देंगे।`,
          11: `आपका बहुत-बहुत आभार हमसे जुड़ने के लिए! हम मीटिंग शुरू होने से आधा घंटा पहले आपको मैसेज और व्हाट्सएप रिमाइंडर जरूर भेजेंगे। आप बिल्कुल चिंता न करें, सब बहुत अच्छा होगा!`
        };
        return empatheticHindiTemplates[step.id] || empatheticHindiTemplates[1];
      }

      if (tone === 'Urgent') {
        const urgentHindiTemplates: Record<number, string> = {
          1: `${greeting}, तुरंत ध्यान दीजिए! सुबह से एडमिशन पोर्टल पर भारी रश है। मैं एम्वर्सिटी से एलाइड हेल्थकेयर की सीनियर कोआर्डिनेटर ${counsellorName} बोल रही हूँ। 2026 अर्ली सीट्स बहुत तेजी से फुल हो रही हैं। क्या आपके पास 2 मिनट का अर्जेंट समय है आपके बच्चे के स्कोप को तुरंत ब्लॉक करने के लिए?`,
          2: `देखिए, डिग्री डायरेक्ट गवर्नमेंट यूनिवर्सिटी से मिलेगी, पर एम्वर्सिटी की हाई-सीमित लैब्स और टॉप हॉस्पिटल्स क्लिनिकल सीट्स बहुत लिमिटेड हैं! हमारा आपके सबसे करीब पार्टनर कैंपस ${colName} है जो सिर्फ ${colDist} की दूरी पर है। यहाँ स्पेशल एनेस्थीसिया और ओटी कोर्सेज की सीटें पहले ही 90% बुक हो चुकी हैं!`,
          3: `बिल्कुल देरी मत कीजिए! आप ${leadLocation} से हैं। और ${academicMatchText} यदि सीट मिस हो गई तो एक साल का नुकसान करोड़ों की लाइफटाइम अर्निंग गवाने जैसा है। क्या आप तुरंत सीट बुकिंग और ${colName} कैंपस के हॉस्टल के लिए तैयार हैं ताकि हम आज ही सीट लॉक कर सकें?`,
          4: `आजकल साधारण जनरल कोर्सेज करने वाले बेरोजगार घूम रहे हैं! एलाइड हेल्थ साइंस 2026 का सबसे हॉट सेक्टर्स है। ${colName} में ${colProg} जैसे कोर्सेज सीधे कॉर्पोरेट Hospital प्लेसमेंट से जुड़े हुए हैं। देर करने पर ये प्रीमियम कोर्सेज हाथ से निकल जाएंगे!`,
          5: `सालों-साल थ्योरी रटने के दिन चले गए! हमारा 3D VR सिमुलेशन लैब ही आपके बच्चे को तुरंत आधुनिक स्किल्स सिखाता है जिससे उनका डायरेक्ट सिलेक्शन पहले ही इंटरव्यू में हो जाता है। यही वो सीक्रेट है जो हमारे बच्चों को बाकियों से 2 साल आगे रखता है!`,
          6: `सीट पर अपना अधिकार पक्का करने के लिए, हमें तुरंत सीनियर रजिस्ट्रार डॉ. के साथ एक 1-on-1 स्पेशल मीटिंग बुक करनी होगी। इसकी कमिटमेंट फीस सिर्फ ₹499 है। इसमें एलीजिबिलिटी चेक, सबसे कम फीस स्ट्रक्चर (${colFeeStr} एट ${colName}), स्पेशल स्कॉलरशिप्स और कॉलेज लैपटॉप का आवंटन उसी वक्त फाइनल हो जाएगा। क्या मैं स्लॉट ब्लॉक कर दूँ?`,
          7: `ध्यान रहे, फ्री सलाह की कोई गारंटी नहीं होती। ₹499 की राशि केवल गंभीर कैंडिडेट्स को छाँटने के लिए है। यह फीस देते ही आपका नाम प्रायोरिटी लिस्ट में आ जाएगा, जिससे फ्री लैपटॉप डिस्ट्रीब्यूशन और स्कॉलरशिप सीट में आपका क्लेम सबसे टॉप पर फिक्स हो जाएगा!`,
          8: `मेरे पास केवल 2 ही वीआईपी स्लॉट बचे हैं: सोमवार सुबह 11:00 बजे और मंगलवार शाम 4:30 बजे। तुरंत डिसाइड कीजिए, नहीं तो ये स्लॉट भी क्लोज हो जाएंगे!`,
          9: `बहुत ही सटीक फैसला! मैंने आपका स्लॉट ${colName} (सिर्फ ${colDist} किलोमीटर दूर) के लिए रिजर्व लिस्ट में रख दिया है जहाँ औसत पैकेज ${colPlac} जाता है। तुरंत सीट लॉक करने के लिए व्हाट्सएप पर भेजे गए पेमेंट गेटवे लिंक पर क्लिक करके ₹499 पे करें, यह लिंक सिर्फ 15 मिनट काम करेगा!`,
          10: `क्या आपके कोई और दोस्त भी हैं जो एक सिक्योर मेडिकल सीट खोज रहे हैं? उनका नाम भी मुझे तुरंत दीजिए ताकि दोनों की सीट साथ में लॉक हो सके!`,
          11: `शानदार! बुकिंग कन्फर्म हो चुकी है। पेमेंट होते ही आपका ऑफिसियल टोकन एक्टिवेट हो जाएगा। मीटिंग से 30 मिनट पहले आपको फाइनल अलार्म कॉल मिल जाएगा। ऑल द बेस्ट!`
        };
        return urgentHindiTemplates[step.id] || urgentHindiTemplates[1];
      }

      if (tone === 'Scientific') {
        const scientificHindiTemplates: Record<number, string> = {
          1: `${greeting}, सादर प्रणाम। मैं एम्वर्सिटी से ${counsellorName} बात कर रही हूँ। नेशनल कमिशन फॉर एलाइड हेल्थकेयर प्रोफेशन्स (NCAHP) एक्ट 2021 के डाटा इंडिकेटर्स के अनुसार इस सेक्टर में देश में भारी वर्कर्स डेफिसिट है। आपका एकेडमिक डेटा एनालिसिस करने के लिए क्या 5 मिनट का समय मिल सकता है?`,
          2: `एकेडमिक प्रोटोकॉल के अनुसार सभी डिग्री सर्टिफिकेशन्स यूजीसी-वेरिफाइड यूनिवर्सिटीज द्वारा जारी किए जाते हैं। एम्वर्सिटी का कोर फंक्शन एडवांस 3D VR लैब्स और क्लिनिकल हॉस्पिटल प्लेसमेंट्स के पैरामीटर्स इम्प्लीमेंट करना है। आपके जियोग्राफिकल निर्देशांक के सबसे करीब ${colName} कैंपस है जो केवल ${colDist} की दूरी पर स्थित है।`,
          3: `डेटा वेरीफाई करें: आपका स्थान ${leadLocation} है। और ${academicMatchText} प्रैक्टिकल दक्षता बढ़ाने के लिए क्या आप रोजाना ${colName} ट्रेवल करेंगे या कैंपस के इन-हाउस आवासीय हॉस्टल विंग्स को प्रेफर करेंगे जिससे प्लेसमेंट प्रोबेबिलिटी मैक्सिमाइज हो सके?`,
          4: `एनालिटिकल असेसमेंट के आधार पर B.Sc Honours in Allied Health Sci आपके स्कोर के लिए ऑप्टिमम फिट है। ${colName} में ${colProg} जैसे स्पेशलाइज्ड कोर्सेज की क्लिनिकल डिमांड बहुत ही उत्कृष्ट है।`,
          5: `रिसर्च दर्शाती है कि स्क्रीन या बुक लर्निंग का रिटेंशन रेट सिर्फ 30% होता है, जबकि हमारी 3D वर्चुअल रियलिटी (VR) सिमुलेशन लैब्स में ट्रेनिंग करने से क्लिनिकल प्रोसीजर एक्यूरेसी 90% तक बढ़ जाती है! यह टेक्नोलॉजी सीधे ऑपरेशन थिएटर और सिम्युलेटेड ICU का लाइव अभ्यास देती है।`,
          6: `इस पाथवे के कंप्लीट डेटा को समझने के लिए हमें हमारे मेडिकल करियर एनालिस्ट के साथ एक 1-on-1 शेड्यूल्ड सेशन बुक करना होगा। इसकी नॉमिनल प्रोसेसिंग फीस ₹499 है। इसमें ${colName} की फाइनल फीस (${colFeeStr}), स्कॉलरशिप डिजिटल मॉडल और लैपटॉप प्रायोरिटी आवंटन चेक हो जाएगा। क्या मैं स्लॉट बुक करूँ?`,
          7: `एक बहुत ही तर्कसंगत प्रश्न। ₹499 का चार्ज काउंसलिंग ऑप्टिमाइजेशन के लिए है ताकि हम सिर्फ गंभीर और एलिजिबल कैंडिडेट्स के लिए ही सीनियर स्पेशलिस्ट के महत्वपूर्ण कंसल्टेशन ऑवर्स अलोकेट कर सकें।`,
          8: `पोर्टल पर दो वेकेंट शेड्यूल्ड स्लॉट खाली हैं: सोमवार सुबह 11:00 बजे अथवा मंगलवार शाम 4:30 बजे। आपके लिए डेटा कंसल्टेशन का सही विंडो कौन सा रहेगा?`,
          9: `एक्सेलेंट! शेड्यूलिंग प्रोसेस पूरा हो गया है। आपका प्रायोरिटी स्लॉट ${colName} (दूरी: ${colDist}) के लिए कतारबद्ध है जहाँ एवरेज प्लेसमेंट पैकेज ${colPlac} तक रिफ्लेक्ट हुआ है। ₹499 बुकिंग का गेटवे लिंक सीधे आपके व्हाट्सएप नंबर पर डिस्पैच किया जा रहा है।`,
          10: `क्या आपके फ्रेंड सर्कल में कोई अन्य कैंडिडेट भी नीट के बिना हाई-सैलरी मेडिकल करियर एनालिसिस करना चाहता है? उनका डेटा भी सेंड कर दीजिए ताकि हम उनकी एलिजिबिलिटी मैप कर सकें।`,
          11: `कन्फर्मेशन कम्प्लीट! मीटिंग आयोजित होने से ठीक 30 मिनट पूर्व हमारा सर्वर आपको रिमाइंडर डिस्ट्रीब्यूट कर देगा। आपके आगामी क्लिनिकल और प्रोफेशनल करियर इवैल्यूएशन के लिए शुभकामनाएं!`
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
         Your task is to take the counselor script and modify it based on the name specified, relation (${leadRelation}), stream (${lead12thStream}), marks (${lead12thMarks}%), regional location (${leadLocation}, pincode: ${leadPincode}), and the requested emotional tone and language guidelines: Lang="${selectedLanguage}", Tone="${selectedTone}". Prompt: "${customPromptMessage}".
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
      <section className="bg-[#111113] border border-[#27272a] rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-6 text-[#f59e0b] opacity-10 pointer-events-none">
          <Sliders className="w-16 h-16" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#f59e0b] uppercase tracking-widest font-mono flex items-center gap-1.5">
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
              className="p-2 border border-[#3f3f46] hover:border-[#f59e0b] rounded-xl bg-[#27272a]/20 text-white transition-all text-xs cursor-pointer"
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
                className="w-full bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] focus:border-[#f59e0b] focus:outline-none rounded-xl py-2 px-9 text-xs text-white"
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
                className="w-full bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] focus:border-[#f59e0b] focus:outline-none rounded-xl py-2 px-9 text-xs text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#71717a] uppercase font-bold block" htmlFor="sim-lead-relation">
              🤝 Target Relation on Call
            </label>
            <div className="flex bg-[#18181b] border border-[#27272a] rounded-xl p-0.5">
              {(['Student', 'Parent'] as const).map(rel => (
                <button
                  key={rel}
                  id={`relation-btn-${rel.toLowerCase()}`}
                  onClick={() => setLeadRelation(rel)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    leadRelation === rel
                      ? 'bg-[#27272a] text-white font-bold'
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
            <div className="absolute top-0 right-0 p-3 text-[#f59e0b] opacity-5 pointer-events-none">
              <Plus className="w-12 h-12" />
            </div>
            
            <div className="space-y-3.5">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500 text-sm animate-pulse">📍</span>
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
                    className="flex-1 bg-[#18181b] border border-[#27272a] hover:border-[#3d3d41] focus:border-[#f59e0b] focus:outline-none rounded-xl py-2 px-3 text-xs text-white"
                    id="sim-search-input"
                  />
                  <button
                    onClick={handleSimGpsLocation}
                    className="px-2.5 py-2 bg-[#1e1b4b] text-[#818cf8] border border-[#312e81] hover:bg-[#312e81] rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-1"
                    title="Use Device GPS"
                    id="btn-sim-gps"
                  >
                    📍 <span className="text-[9px]">GPS</span>
                  </button>
                  <button
                    disabled={isSimGeocoding}
                    onClick={() => handleSimLocationSearch(simSearchInput)}
                    className="px-3 py-2 bg-[#f59e0b] text-[#09090b] rounded-xl text-xs font-bold hover:bg-[#fbbf24] disabled:opacity-50 transition-all cursor-pointer"
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
                  <label className="text-[9px] font-mono text-[#71717a] uppercase font-bold block">
                    Hometown / Area Resolved
                  </label>
                  <input
                    type="text"
                    value={leadLocation}
                    onChange={(e) => {
                      setLeadLocation(e.target.value);
                      setSimSearchInput(e.target.value);
                    }}
                    className="w-full bg-[#18181b]/70 border border-[#27272a] hover:border-[#3f3f46] focus:border-[#f59e0b] focus:outline-none rounded-xl py-1.5 px-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-[#71717a] uppercase font-bold block">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={leadPincode}
                    onChange={(e) => setLeadPincode(e.target.value)}
                    className="w-full bg-[#18181b]/70 border border-[#27272a] hover:border-[#3f3f46] focus:border-[#f59e0b] focus:outline-none rounded-xl py-1.5 px-2.5 text-xs text-white"
                  />
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
                
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-[#71717a] uppercase font-bold block">
                      12th Stream (Science)
                    </label>
                    <select
                      value={lead12thStream}
                      onChange={(e) => setLead12thStream(e.target.value as any)}
                      className="w-full bg-[#18181b] border border-[#27272a] focus:border-[#f59e0b] focus:outline-none rounded-xl py-1.5 px-2 text-xs text-white cursor-pointer"
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
                      <span className="text-[#f59e0b] font-mono">{lead12thMarks}%</span>
                    </label>
                    <input
                      type="range"
                      min={40}
                      max={100}
                      value={lead12thMarks}
                      onChange={(e) => setLead12thMarks(Number(e.target.value))}
                      className="w-full accent-[#f59e0b] cursor-pointer bg-[#27272a] rounded-lg appearance-none h-1.5 mt-2"
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
                      className="w-full bg-[#18181b] border border-[#27272a] focus:border-[#f59e0b] focus:outline-none rounded-xl py-1.5 px-2 text-xs text-white cursor-pointer"
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
                        className="w-full bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] focus:border-[#f59e0b] focus:outline-none rounded-xl py-1.5 px-2.5 text-xs text-white font-mono"
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
          <div className="md:col-span-7 bg-[#161618] border border-[#27272a]/80 shadow-inner rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[#27272a]/40 pb-2.5 mb-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#f59e0b]/10 text-[#f59e0b] text-[9.5px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border border-[#f59e0b]/20 font-mono">
                  Closest Focus University Suggested
                </span>
              </div>
              {nearestFocusCollegeResult && (
                <div className="text-[11px] font-extrabold text-[#f59e0b] font-mono bg-[#f59e0b]/10 px-2.5 py-0.5 rounded-lg border border-[#f59e0b]/20">
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
          <div className="bg-[#111113] border border-[#27272a] rounded-2xl p-4 shadow-lg overflow-x-auto">
            <div className="flex min-w-[700px] items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#27272a] z-0 -translate-y-1/2" />
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
                        ? 'bg-[#f59e0b] border-[#f59e0b] text-black shadow-md shadow-[#f59e0b]/20 scale-110' 
                        : isPassed
                        ? 'bg-[#10b981] border-[#10b981] text-white'
                        : 'bg-[#18181b] border-[#27272a] text-[#71717a] hover:border-[#a1a1aa]'
                    }`}>
                      {step.id}
                    </div>
                    <span className={`text-[9px] font-mono font-semibold max-w-[65px] text-center leading-tight tracking-tight ${
                      isActive ? 'text-[#f59e0b] font-bold' : 'text-[#71717a]'
                    }`}>
                      {step.title.split(':')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Dialogue Card */}
          <div className="bg-[#111113] border border-[#27272a] rounded-3xl p-6 shadow-xl space-y-6 relative">
            <div className="flex justify-between items-start border-b border-[#27272a] pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#f59e0b] uppercase font-bold block">
                  Counselling Script: Step {activeStep.id} of 11
                </span>
                <h3 className="text-white text-lg font-bold font-sans">
                  {activeStep.title}
                </h3>
                <p className="text-[#a1a1aa] text-[11px]">
                  {activeStep.description}
                </p>
              </div>

              <div className="bg-[#27272a]/40 border border-[#27272a] rounded-xl px-2.5 py-1 text-[9px] text-[#71717a] font-mono">
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
                            ? 'bg-[#f59e0b] text-black font-extrabold shadow-sm' 
                            : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]/30'
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
                            ? 'bg-[#f59e0b] text-black font-extrabold shadow-sm' 
                            : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]/30'
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
            <div className="p-5 bg-[#18181b] border border-[#27272a] rounded-2xl space-y-4 shadow-inner relative group min-h-[160px] flex flex-col justify-between">
              
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-2 grow">
                  <RefreshCw className="w-8 h-8 text-[#f59e0b] animate-spin" />
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
                      className="px-3.5 py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-black disabled:opacity-50 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                      title="Read advisor speech out loud using browser TTS engine"
                    >
                      <Volume2 className="w-4 h-4 text-black" />
                      Read Aloud (TTS)
                    </button>
                  )}

                  {/* AI Refiner trigger */}
                  {modelProvider !== 'local' && (
                    <button
                      onClick={() => triggerAiRewriteCompletions('script', activeStep.id, `Personalize this advisor counselling script: "${activeStep.scriptTemplate}" for student name "${leadName}", relation "${leadRelation}", in a highly persuasive tone of style: "${selectedTone}". Keep length concise.`)}
                      disabled={isAiLoading}
                      className="px-3.5 py-1.5 border border-[#3f3f46] hover:border-[#f59e0b] bg-[#27272a]/40 hover:bg-[#27272a] text-[#e4e4e7] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Optimize using the selected Groq/OpenRouter model"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
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
                    className="p-1 px-3 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Next Step Progress
                  </button>
                </div>
              </div>
            </div>

            {/* Core profiling screening questions help card */}
            <div className="p-4 bg-[#141416] border border-[#27272a] rounded-2xl space-y-2">
              <h4 className="text-[10px] font-mono text-[#f59e0b] uppercase font-bold block flex items-center gap-1.5">
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
                      activeObjection.difficulty === 'Hard' ? 'text-red-500' : 'text-[#f59e0b]'
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
                <div className="p-4 bg-[#18181b] border border-[#27272a] rounded-xl space-y-3 shadow-inner">
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
                className="bg-[#111113] border border-[#27272a] rounded-3xl p-5 lg:p-6 shadow-xl space-y-4 text-center py-12"
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

          {/* Objections Database Search Deck */}
          <div className="bg-[#111113] border border-[#27272a] rounded-3xl p-5 shadow-xl space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#f59e0b]" />
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
                  className="w-full bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] focus:border-[#f59e0b] focus:outline-none rounded-xl py-2 pl-9 pr-3 text-xs text-white"
                />
              </div>

              <select
                aria-label="Filter objections by category"
                value={conflictSelectedCategory}
                onChange={(e) => setConflictSelectedCategory(e.target.value)}
                className="w-full bg-[#18181b] border border-[#27272a] focus:border-[#f59e0b] focus:outline-none rounded-xl py-2 px-3 text-xs text-white"
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
                        obj.difficulty === 'Hard' ? 'bg-red-950/40 text-red-400' : 'bg-amber-950/40 text-[#f59e0b]'
                      }`}>{obj.difficulty}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
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
              className="bg-[#111113] border border-[#27272a] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 space-y-5"
            >
              <div className="flex justify-between items-start border-b border-[#27272a] pb-4">
                <div className="space-y-1">
                  <h3 className="text-white font-extrabold text-lg flex items-center gap-1.5 font-sans">
                    <Settings className="w-5 h-5 text-[#f59e0b]" />
                    LLM Provider Configurations
                  </h3>
                  <p className="text-[#a1a1aa] text-xs">Configure Groq or OpenRouter keys locally.</p>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1 text-[#71717a] hover:text-white rounded-lg hover:bg-[#27272a]/30"
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
                  className="w-full bg-[#18181b] border border-[#27272a] focus:border-[#f59e0b] focus:outline-none rounded-xl py-2 px-3 text-xs text-white"
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
                      className="w-full bg-[#18181b] border border-[#27272a] focus:border-[#f59e0b] focus:outline-none rounded-xl py-2 px-3 text-xs text-white font-mono"
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
                      className="w-full bg-[#18181b] border border-[#27272a] focus:border-[#f59e0b] focus:outline-none rounded-xl py-2 px-3 text-xs text-white"
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
                      className="w-full accent-[#f59e0b] bg-[#18181b] rounded-lg h-1"
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
                  className="w-full py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-black font-extrabold rounded-xl text-xs shadow cursor-pointer justify-center flex items-center gap-1.5"
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
