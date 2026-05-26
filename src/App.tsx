/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COLLEGES, POPULAR_LOCATIONS, getCoordinatesFromPincode, getHaversineDistance } from './data';
import { College, GeocodedLocation, SearchCriteria } from './types';
import MapIndicator from './components/MapIndicator';
import DashboardCharts from './components/DashboardCharts';
import MetricCards from './components/MetricCards';
import { 
  Search, 
  Filter, 
  MapPin, 
  GraduationCap, 
  Coins, 
  Clock, 
  BookOpen, 
  FileText, 
  FileVideo, 
  Navigation, 
  User, 
  Home, 
  Tv, 
  Compass, 
  ExternalLink,
  Phone,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Trash2
} from 'lucide-react';

const CONTACT_AND_HELP_INFO: Record<string, {
  fst: string;
  ism: string;
  scholarships: string;
  loans: string;
  hostelCapacity?: string;
  hostelAmenities?: string;
  refundPolicy?: string;
}> = {
  amet: {
    fst: "Suganya (7639094290) / Abdul Hadhi (7010730078) / Lakshmi A (6369899463)",
    ism: "Ankit",
    scholarships: "Eligible for state & national scholarships via the National Scholarship Portal (NSP).",
    loans: "Provides Bonafide Certificate following the initial payment of ₹91,361 (including token booking + caution deposit + application fee). Students can independently apply in any preferred bank (no direct bank tie-up).",
    hostelCapacity: "Accommodates 2200+ students across well-furnished Boys and Girls wings.",
    hostelAmenities: "24-hr secure RO water, DG doctors on campus, gym, laundry, sports fields, Wi-Fi, Newspaper, TV lounges, fire safety.",
    refundPolicy: "Booking amount refundable under standard UGC guidelines."
  },
  "st-peters-chennai": {
    fst: "Naveen KS (9364148800) / Nivetha A (9003769158) / Priyanka TP (priyanka.tp@emversity.com)",
    ism: "Ankit",
    scholarships: "Eligible for state-level Tamil Nadu government scholarships (submit via online portal).",
    loans: "Provides Bonafide Certificate once ₹90,600 (semester fee & application fee) is paid. Students can approach any public or private bank for processing education loans independently.",
    hostelCapacity: "Capacity: 1000+ residents.",
    hostelAmenities: "Separate hostels for Boys/Girls, medical check-ups, reading lounges, TV halls, high-speed Wi-Fi, multi-sharing options.",
    refundPolicy: "Non-Refundable booking fee (Standard norms match institutional guidelines)."
  },
  "st-peters-bengaluru": {
    fst: "Suhana (8217388879) / Manasa RV (9902836394) / Sneha Dhanapal (7010808198)",
    ism: "Ankit",
    scholarships: "Eligible for Karnataka State Scholarships and SSP portal applications.",
    loans: "Provides Bonafide certificate upon payment of ₹90,550. No direct tie-up; bank loan files can be launched at Indian Bank, AXIS, or ICICI.",
    hostelCapacity: "Separate wings for Boys and Girls at Off-Campus Bengaluru.",
    hostelAmenities: "Smart AV workspaces, reading corners, full wellness checkups, modern shared rooms.",
    refundPolicy: "Registration is under standard UGC guidelines."
  },
  "st-marys-rehab": {
    fst: "Arimanda Greeshma (6301955540) / Jyothi Vani (8247831991) / D Karthik (8686702088)",
    ism: "Rahul",
    scholarships: "State scholarship details available on Telangana e-Kalyan portal.",
    loans: "Eligible for Vidya Lakshmi Portal support. Direct loan processing via Central Bank of India (Deshmukhi Branch) with bonafide letter.",
    hostelCapacity: "On-campus modern facilities with AC/Non-AC variants.",
    hostelAmenities: "24/7 in-house hospital, sports courts, meditation gardens, motion capture lab access.",
    refundPolicy: "UGC compliant refund norms. Booking token is distinct."
  },
  "yenepoya": {
    fst: "Prathiba J (9686057325)",
    ism: "Rahul",
    scholarships: "Yenepoya Foundation Merit Scholarships & Karnataka SSP Portal.",
    loans: "Academic bonafide letter supplied for educational loan processing in leading national and regional banks.",
    hostelCapacity: "Spacious multi-sharing housing blocks.",
    hostelAmenities: "Access to Yenepoyas massive teaching hospital, RO drinking water, Wi-Fi systems.",
    refundPolicy: "Booking amount of ₹26,000 is 100% REFUNDED if the student fails the entrance exam (up to 3 attempts)."
  },
  "presidency": {
    fst: "Not Mentioned (Direct Support)",
    ism: "Rahul",
    scholarships: "Academic merit scholarship based on 10+2 marks, and Karnataka state portal entries.",
    loans: "Direct ICICI Bank documents linkage. Bonafide letters supported for processing with any other national bank.",
    hostelCapacity: "Capacity: 2000+ rooms.",
    hostelAmenities: "Wi-Fi, laundry, indoor games, medical nurse on campus, direct BMTC access.",
    refundPolicy: "Compliant with Karnataka private university guidelines."
  },
  "arka-jain": {
    fst: "Neha Sharma (9113703120) / Dheeraj Kumar (7488032302)",
    ism: "CCH-Manoj",
    scholarships: "Jharkhand e-Kalyan Post-Matric Scholarship, AJUCET criteria discount scholarships.",
    loans: "Vidyalakshmi scheme, GuruJi Student Credit Card scheme (Jharkhand Government) and West Bengal Student Credit Card scheme supported.",
    hostelCapacity: "Premium girls-only & boys housing.",
    hostelAmenities: "Fridge, washing machines, Wi-Fi, 24/7 security, 3-times daily nutritious meals.",
    refundPolicy: "Refundable security deposits (10K) after graduation. Token booking is non-refundable."
  },
  "kr-mangalam": {
    fst: "Kiran Gaud (8917079964) / Vishal Saroha (7027152986) / Ravi Das (9779769799)",
    ism: "Syed Sahil",
    scholarships: "Haryana state merit scholarships, discount based on NEET/JEE or 12th PCB percentage.",
    loans: "Tie-ups with leading financial authorities (ICICI, Axis, IDFC, multiple NBFCs), Vidyalakshmi Loan scheme.",
    hostelCapacity: "AC / Non-AC double and triple sharing options.",
    hostelAmenities: "4-times daily meals (veg and non-veg), laundry, AC rooms, gymnasium, sports clubs, 24/7 guards.",
    refundPolicy: "Booking fee refundable excluding standard application costs."
  },
  "medicaps": {
    fst: "Girish Kulkarni (8839619779) / Chanchal Shrivas (9575262354)",
    ism: "Ankit",
    scholarships: "Madhya Pradesh state scholarships, NSP portal schemes.",
    loans: "Supports Vidya Lakshmi scheme and bonafide letters for educational credit files at SBI and nationalized banks.",
    hostelCapacity: "Lush green 53-acre modern hostels.",
    hostelAmenities: "Gym, Wi-Fi, bus terminals, RO filtration plants, indoor games rooms.",
    refundPolicy: "Subject to state and UGC rules."
  },
  "ajeenkya": {
    fst: "Maya Sharma (9131449122) / Aniket Bandre (8149667956) / Anjali Ingale (9309909538)",
    ism: "Ankit",
    scholarships: "Maharashtra State MahaDBT Scholarship schemes (OBC/EBC/SC/ST benefits).",
    loans: "Complete support for private and cooperative banks. Bonafide documents provided post-booking.",
    hostelCapacity: "Spacious student blocks with multiple layouts.",
    hostelAmenities: "High-speed Wi-Fi, laundry, refrigerators, TVs, security lounges.",
    refundPolicy: "Non-refundable booking fee."
  },
  "dbs-global": {
    fst: "Amit Mandal (8171969111)",
    ism: "Syed Sahil",
    scholarships: "Uttarakhand domicile scholarship advantages up to 25% discount, Merit scholarships.",
    loans: "Bonafide letters issued for credit line approvals in nationalized and regional banks.",
    hostelCapacity: "Modern campus housing with twin and solo units.",
    hostelAmenities: "e-Library, computer labs, robotics cells, gym, common study area.",
    refundPolicy: "State norm compliant."
  },
  "techno-india": {
    fst: "Rinika Mukhopadhyay (8617286877) / Priyanka Roy (7872007742) / Manabendra Saha (7363043890)",
    ism: "Ankit",
    scholarships: "West Bengal Swami Vivekananda Merit-cum-Means (SVMCM), Kanyashree Prakalpa (for female students), Aikyashree Minority Scholarship.",
    loans: "West Bengal Student Credit Card Scheme (extremely popular, low-interest), bonafide letters for personal/education loan.",
    hostelCapacity: "PG networks across Salt Lake Sector-V.",
    hostelAmenities: "24/7 security, Wi-Fi, CCTV, food & lodging near campus docks.",
    refundPolicy: "Refundable according to state rules."
  },
  "lpu": {
    fst: "Pallika Gaba (7009894808) / Silvia Sidana (7347228511) / Balwinder Kaur (9988246141)",
    ism: "Syed Sahil",
    scholarships: "LPU NEST Entrance Scholarship, national portal benefits, and state schemes.",
    loans: "Direct tie-up with nationalized banks (SBI, PNB) and leading NBFC credit lines.",
    hostelCapacity: "Accommodation for 4000+ residents managed by Pro-Bricks housing authority.",
    hostelAmenities: "Air conditioning, high-speed Wi-Fi, laundry, swimming pool, indoor games, cricket net practice ground.",
    refundPolicy: "Standard institutional refund metrics."
  },
  "sanjivani": {
    fst: "Shivani Sali (8080930589)",
    ism: "Ankit",
    scholarships: "MahaDBT benefits, EBC concessions.",
    loans: "Bonafide support for cooperative and nationalized banks across Ahmednagar, Maharashtra.",
    hostelCapacity: "Boys & Girls lodging near Shirdi highway.",
    hostelAmenities: "Smartboards, playgrounds, Wi-Fi, cafeteria, gym, bus transit.",
    refundPolicy: "UGC compliant."
  },
  "hcg-gha": {
    fst: "Shubha Jain (7975256545) / Vishal S (7846801695) / Lalitha A (6366685337)",
    ism: "Rahul",
    scholarships: "National Scholarship benefits, health-service bursaries.",
    loans: "Bonafide support for private and government banks.",
    hostelCapacity: "Convenient off-campus rentals.",
    hostelAmenities: "Direct access to Bangalore HCG hospitals, clinical training center, digital classrooms.",
    refundPolicy: "UGC norm compliant."
  },
  "hcg-suchirayu": {
    fst: "Gunaroopa Kotian (9916262674) / Madhura Sunit (8088547361)",
    ism: "Rahul",
    scholarships: "Karnataka State SSP portal schemes.",
    loans: "Bonafide processing with regional banks.",
    hostelCapacity: "Cozy rooms for nursing cohorts.",
    hostelAmenities: "Suchirayu Hospital medical tie-up, safe girls-hostel with security and warden.",
    refundPolicy: "Institutional norms."
  },
  "universal-skilltech": {
    fst: "Pawan Pandey (8459497735) / Sneha Raghu Jadhav (7977486221)",
    ism: "Ankit",
    scholarships: "MahaDBT concessions for Maharashtra domiciles.",
    loans: "Supports general educational loans via national banks.",
    hostelCapacity: "In-campus tech-enabled shared rooms.",
    hostelAmenities: "WiFi access, digital labs, and placement circles.",
    refundPolicy: "Standard rules."
  },
  "maya-devi": {
    fst: "Rani Gupta (9997241741)",
    ism: "Syed Sahil",
    scholarships: "Uttarakhand state portal scholarships.",
    loans: "Bonafide letters for bank loans.",
    hostelCapacity: "Picturesque 5-star mountain hostels.",
    hostelAmenities: "Scenic solar-powered environment, robotics, culinary labs, Wifi, smart classrooms.",
    refundPolicy: "State laws apply."
  },
  "saraswati-group": {
    fst: "Amanpreet (9876143469) / Shobha Chauhan (8054711473)",
    ism: "Syed Sahil",
    scholarships: "Punjab state scholarship schemes, SC/ST tuition waivers.",
    loans: "Bonafide letters issued upon enrollment booking.",
    hostelCapacity: "Homely hostels in Mohali/Chandigarh area.",
    hostelAmenities: "Free Wi-Fi, fully AC corridors, dining rooms, library access.",
    refundPolicy: "Non-refundable register costs."
  },
  "medhavi": {
    fst: "Prashant Shukla (7985025869) / Asheesh Kumar (8239188527) / Lalit Kumar (8171432128)",
    ism: "Unlisted",
    scholarships: "Sikkim state board concessions, Medhavi Merit tests.",
    loans: "Specialized skill-loan tie-ups, Vidyalakshmi scheme clearance.",
    hostelCapacity: "Lower Chisopani Singtam blocks.",
    hostelAmenities: "Practical bridge courses, 100% placement circles.",
    refundPolicy: "UGC rule compliant."
  },
  "alard": {
    fst: "Manoj Sharma (7798514159) / Kishor Galande (9975751963)",
    ism: "Unlisted",
    scholarships: "MahaDBT portal, minority scholarship support.",
    loans: "Supports bonafide educational credits in Hinjawadi IT corridor banks.",
    hostelCapacity: "Pune campus rooms.",
    hostelAmenities: "IT park proximity, AI labs, fitness hubs.",
    refundPolicy: "UGC guidelines."
  },
  "nehru-gram": {
    fst: "Ved Prakash Singh (8920848236)",
    ism: "Unlisted",
    scholarships: "UP state post-matric schemes.",
    loans: "Bonafide tracking with regional cooperative banks.",
    hostelCapacity: "Allahabad hostel wings.",
    hostelAmenities: "Peaceful environment, Wi-Fi terminals.",
    refundPolicy: "Standard norms."
  },
  "mvm-allied": {
    fst: "Arshad Ali (9620418133)",
    ism: "Rahul",
    scholarships: "Karnataka State SSP portal schemes.",
    loans: "Bonafide support for banks, Axis and ICICI connections.",
    hostelCapacity: "Airport Road Palanahalli wings.",
    hostelAmenities: "Modern clinical laboratories, Wi-Fi, smart boards, cafeteria.",
    refundPolicy: "Institutional norms."
  }
};

// 1-line professional explanations based on the course highlights from the PDF
export function getCourseDescription(prName: string): string {
  const norm = prName.toLowerCase();
  
  if (norm.includes('laboratory') || norm.includes('mlt') || norm.includes('mls')) {
    return "Science of testing blood, fluids, and tissues in labs to help doctors diagnose and monitor diseases.";
  }
  if (norm.includes('cardiovascular') || norm.includes('cvt') || norm.includes('cardio')) {
    return "Diagnosing and treating heart and vessel diseases using ECGs, Echo scans, and assisting in cath labs.";
  }
  if (norm.includes('perfusion')) {
    return "Operating high-tech heart-lung bypass machines to support blood flow and life functions during open-heart surgery.";
  }
  if (norm.includes('dialysis') || norm.includes('dt')) {
    return "Treating kidney failure patients by operating advanced artificial blood cleansing and fluid removal systems.";
  }
  if (norm.includes('respiratory') || norm.includes('rt')) {
    return "Caring for patients with asthma, COPD, and lung issues by managing ventilators and oxygen lines.";
  }
  if (norm.includes('anaesthesia') || norm.includes('operation theatre') || norm.includes('aott') || norm.includes('a&ott')) {
    return "Preparing surgery theaters, monitoring patient vitals, and assisting surgical/anesthesia specialists.";
  }
  if (norm.includes('radiology') || norm.includes('imaging') || norm.includes('mrit')) {
    return "Capturing high-def internal scans using X-rays, CT scanners, MRIs, and ultrasounds for medical reports.";
  }
  if (norm.includes('emergency medical') || norm.includes('emergency medicine') || norm.includes('emt') || norm.includes('trauma')) {
    return "Administering fast pre-hospital care, stabilizing trauma/accidents, and handling life-saving ambulances.";
  }
  if (norm.includes('radiotherapy') || norm.includes('rtt')) {
    return "Operating sophisticated high-energy radiation beams to safely treat and destroy cancer cells.";
  }
  if (norm.includes('physiotherapy') || norm.includes('bpt')) {
    return "Restoring physical movement, relieving pain, and rehabilitating muscle/neuro coordination post-injuries.";
  }
  if (norm.includes('occupational therapy') || norm.includes('bot')) {
    return "Helping children and adult patients regain physical, social, and mental independence in daily tasks.";
  }
  if (norm.includes('optometry') || norm.includes('optom')) {
    return "Examining eyesight, assessing visual health, prescribing lenses, and managing early eye issues.";
  }
  if (norm.includes('hospital management') || norm.includes('hospital administration') || norm.includes('bha')) {
    return "Overseeing smooth clinical workflows, scheduling, budgeting, staffing, and regulatory compliance.";
  }
  if (norm.includes('mba') || norm.includes('pharmaceutical management') || norm.includes('healthcare management')) {
    return "Professional management training bridging medical services with drug supplies and clinical operations.";
  }
  if (norm.includes('nursing')) {
    return "Comprehensive patient care, clinical support, administering medications, and ward management.";
  }
  if (norm.includes('pharma') || norm.includes('pharmacy')) {
    return "Studying drug compositions, formulation of medicines, compounding, dispensing, and safety regulations.";
  }
  if (norm.includes('dental') || norm.includes('bds')) {
    return "Surgical and cosmetic treatment of oral diseases, tooth restoration, and mouth health therapies.";
  }
  if (norm.includes('biotechnology')) {
    return "Fusing biological science with technology to engineer new pharmaceutical products, genetics, and vaccines.";
  }
  if (norm.includes('ayurvedic') || norm.includes('bams')) {
    return "Holistic traditional Indian medicine system combining herbal therapeutics with general modern diagnostics.";
  }
  if (norm.includes('health sciences') || norm.includes('bhs')) {
    return "Versatile study of public health, epidemiology, healthcare frameworks, and prevention strategies.";
  }
  if (norm.includes('forensic')) {
    return "Using medical, biological, and chemical test techniques to analyze crime scene evidence for judicial courts.";
  }
  if (norm.includes('agriculture')) {
    return "Modern agricultural engineering covering high-yield crop science, soil nutrition, and agribusiness.";
  }
  if (norm.includes('veterinary')) {
    return "Caring for animal diseases, surgical treatments, livestock wellness, and shielding humans from zoonotic transfers.";
  }
  return "Professional career track offering intensive theoretical knowledge, clinical training, and medical sector utility.";
}

export default function App() {
  // 1. Core Proximity search states
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchedLocation, setSearchedLocation] = useState<GeocodedLocation | null>(null);
  const [geocodeSourceMessage, setGeocodeSourceMessage] = useState<string>('');
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [searchMode, setSearchMode] = useState<'proximity' | 'direct'>('proximity');
  const [directSearchInput, setDirectSearchInput] = useState<string>('');

  // Auto-filtering database search as they type
  const directMatchedColleges = useMemo(() => {
    const query = directSearchInput.trim().toLowerCase();
    if (!query) return [];
    return COLLEGES.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query) ||
      c.state.toLowerCase().includes(query)
    );
  }, [directSearchInput]);

  // 2. Filter states
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [programFilter, setProgramFilter] = useState<string>('All');
  const [maxFeeFilter, setMaxFeeFilter] = useState<number>(5.0); // Annual limits in Lakhs
  const [naacFilter, setNaacFilter] = useState<string>('All');
  const [focusOnlyFilter, setFocusOnlyFilter] = useState<boolean>(true);

  // 3. Selection & Sorting states
  const [selectedCollege, setSelectedCollege] = useState<College | null>(COLLEGES[0]);
  const [sortBy, setSortBy] = useState<'distance' | 'fee' | 'intake' | 'placement' | 'name'>('name');
  const [parentTab, setParentTab] = useState<'finance' | 'hostel' | 'academics' | 'contact'>('finance');

  // Compute available states and programs dynamically from colleges dataset
  const uniqueStates = useMemo(() => {
    return Array.from(new Set(COLLEGES.map(c => c.state))).sort();
  }, []);

  const uniquePrograms = useMemo(() => {
    // Collect unique parsed key-categories inside list
    const list = COLLEGES.flatMap(c => c.programsList);
    // Parse to clean categories
    const categoriesSet = new Set<string>();
    list.forEach(p => {
      if (p.includes('Anaesthesia') || p.includes('AOTT') || p.includes('A&OTT')) categoriesSet.add('Operation Theatre Technology');
      if (p.includes('Cardiovascular') || p.includes('CVT') || p.includes('Cardiac')) categoriesSet.add('Cardiovascular Technology');
      if (p.includes('Laboratory') || p.includes('MLT') || p.includes('MLS')) categoriesSet.add('Medical Lab Science');
      if (p.includes('Respiratory') || p.includes('RT')) categoriesSet.add('Respiratory Technology');
      if (p.includes('Physiotherapy') || p.includes('BPT')) categoriesSet.add('Physiotherapy');
      if (p.includes('Occupational') || p.includes('BOT')) categoriesSet.add('Occupational Therapy');
      if (p.includes('Nursing')) categoriesSet.add('Nursing');
      if (p.includes('Hospitality') || p.includes('BBA')) categoriesSet.add('Hospitality Management');
    });
    return Array.from(categoriesSet).sort();
  }, []);

  // A comprehensive dictionary specifying exactly which cities mapped to coordinates belong to which state, to ensure state-aware lookups.
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

  // 4. Resolve location query typing or selecting with premium geocoder (never shows unknown query)
  const handleLocationSearch = async (queryStr: string) => {
    const cleanQuery = queryStr.trim().toLowerCase();
    if (!cleanQuery) return;

    setIsGeocoding(true);
    setGeocodeSourceMessage(`Searching and geocoding "${queryStr}"...`);

    // A) Check if numeric string represents a PIN code
    const pinDigits = cleanQuery.replace(/\D/g, '');
    if (pinDigits.length >= 4) {
      const pinResult = getCoordinatesFromPincode(pinDigits);
      if (pinResult) {
        setSearchedLocation({
          name: pinResult.name,
          lat: pinResult.lat,
          lng: pinResult.lng,
          type: 'pincode',
          pincode: pinDigits
        });
        setGeocodeSourceMessage(`Dynamic geocoder: Resolved pincode ${pinDigits}`);
        setSortBy('distance');
        setIsGeocoding(false);
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
        setSearchedLocation({
          name: matched.name,
          lat: matched.lat,
          lng: matched.lng,
          type: 'city'
        });
        setGeocodeSourceMessage(`State-aware geocoder: Selected ${matched.name}`);
        setSortBy('distance');
        setIsGeocoding(false);
        return;
      }
    }

    // C) Search matches in COLLEGE names and addresses
    const matchedCollege = COLLEGES.find(
      c => c.name.toLowerCase().includes(cleanQuery) ||
           c.city.toLowerCase().includes(cleanQuery) ||
           c.address.toLowerCase().includes(cleanQuery)
    );

    if (matchedCollege) {
      setSearchedLocation({
        name: `${matchedCollege.city}, ${matchedCollege.state}`,
        lat: matchedCollege.lat,
        lng: matchedCollege.lng,
        type: 'city'
      });
      setGeocodeSourceMessage(`Dynamic geocoder: Found campus match at ${matchedCollege.city}`);
      setSortBy('distance');
      setIsGeocoding(false);
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
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        // Format display name simply
        const parts = item.display_name.split(',');
        const displayName = parts[0] + (parts[1] ? ', ' + parts[1] : '') + ', India';
        setSearchedLocation({
          name: displayName,
          lat,
          lng,
          type: 'custom'
        });
        setGeocodeSourceMessage(`OSM Geocoder: Located "${queryStr}" near ${displayName}`);
        setSortBy('distance');
        setIsGeocoding(false);
        return;
      }
    } catch (err) {
      console.warn("Dynamic live geocoding fetch failed or timed out. Falling back to local state keys.", err);
    }

    // E) Fallback to structural state keys if the network call failed/timed out
    const fallbackStateKeys: Record<string, string> = {
      maharashtra: "Maharashtra",
      karnataka: "Karnataka",
      telangana: "Telangana",
      "tamil nadu": "Tamil Nadu",
      tamilnadu: "Tamil Nadu",
      "west bengal": "West Bengal",
      westbengal: "West Bengal",
      bengal: "West Bengal",
      punjab: "Punjab",
      haryana: "Haryana",
      uttarakhand: "Uttarakhand",
      jharkhand: "Jharkhand",
      sikkim: "Sikkim",
      "madhya pradesh": "Madhya Pradesh",
      mp: "Madhya Pradesh",
      "uttar pradesh": "Uttar Pradesh",
      up: "Uttar Pradesh",
      "jammu & kashmir": "Jammu & Kashmir",
      "jammu and kashmir": "Jammu & Kashmir",
      kashmir: "Jammu & Kashmir",
      kasmir: "Jammu & Kashmir",
      jammu: "Jammu & Kashmir",
      kerala: "Kerala",
      goa: "Goa",
      delhi: "Delhi",
      gujarat: "Gujarat",
      rajasthan: "Rajasthan",
      assam: "Assam",
      northeast: "Assam",
      bihar: "Bihar",
      odisha: "Odisha",
      orissa: "Odisha",
      "himachal pradesh": "Himachal Pradesh",
      himachal: "Himachal Pradesh",
      "andhra pradesh": "Andhra Pradesh",
      andhra: "Andhra Pradesh",
      ap: "Andhra Pradesh",
      chhattisgarh: "Chhattisgarh"
    };

    const foundStateKey = Object.keys(fallbackStateKeys).find(k => cleanQuery.includes(k));
    if (foundStateKey) {
      const stateName = fallbackStateKeys[foundStateKey];
      const matchedMap = STATE_CITIES_COORDS[stateName];
      const matchedCity = matchedMap ? Object.values(matchedMap)[0] : { lat: 34.0837, lng: 74.7973 }; // fallback defaults to srinagar coords
      setSearchedLocation({
        name: `${stateName} Region`,
        lat: matchedCity.lat,
        lng: matchedCity.lng,
        type: 'city'
      });
      setGeocodeSourceMessage(`Dynamic geocoder: Focused on ${stateName} State Hub`);
      setSortBy('distance');
      setIsGeocoding(false);
      return;
    }

    // F) Safer Fallback logic - fall back to first college of the list
    const fallbackCollege = COLLEGES[0];
    setSearchedLocation({
      name: `${queryStr} (Fallback Search Zone)`,
      lat: fallbackCollege.lat,
      lng: fallbackCollege.lng,
      type: 'custom'
    });
    setGeocodeSourceMessage(`Dynamic geocoder: Context focused around ${fallbackCollege.city}, ${fallbackCollege.state}`);
    setSortBy('distance');
    setIsGeocoding(false);
  };

  // Clear search beacon state
  const handleClearLocation = () => {
    setSearchedLocation(null);
    setSearchInput('');
    setGeocodeSourceMessage('');
    if (sortBy === 'distance') {
      setSortBy('name');
    }
  };

  // Find the absolute closest college to the searched location (pre-filtering)
  const preClosestCollege = useMemo(() => {
    if (!searchedLocation) return null;
    const sorted = COLLEGES.map(c => ({
      ...c,
      distance: getHaversineDistance(searchedLocation.lat, searchedLocation.lng, c.lat, c.lng)
    })).sort((a,b) => a.distance - b.distance);
    return sorted[0];
  }, [searchedLocation]);

  // 5. Build dynamic colleges list ranked by proximity first, then sliced to 3 elements for uncluttered focus
  const processedColleges = useMemo(() => {
    const primaryState = preClosestCollege ? preClosestCollege.state : '';

    const listWithDistance = COLLEGES.map(c => {
      let distance = 0;
      if (searchedLocation) {
        distance = getHaversineDistance(
          searchedLocation.lat,
          searchedLocation.lng,
          c.lat,
          c.lng
        );
      }
      return { ...c, distance };
    })
    .filter(c => {
      if (focusOnlyFilter) {
        const FOCUS_COLLEGE_IDS = ['ajeenkya', 'alard', 'universal-skilltech', 'sanjivani', 'medicaps'];
        if (!FOCUS_COLLEGE_IDS.includes(c.id)) return false;
      }

      if (regionFilter !== 'All' && c.region !== regionFilter) return false;
      if (stateFilter !== 'All' && c.state !== stateFilter) return false;
      if (statusFilter !== 'All' && c.admissionStatus !== statusFilter) return false;
      
      if (naacFilter !== 'All') {
        if (naacFilter === 'A++' && c.naacGrading !== 'A++') return false;
        if (naacFilter === 'A+' && !['A++', 'A+'].includes(c.naacGrading)) return false;
        if (naacFilter === 'A' && !['A++', 'A+', 'A'].includes(c.naacGrading)) return false;
      }

      if (c.annualFee > maxFeeFilter) return false;

      if (programFilter !== 'All') {
        const checkLower = c.programsList.join(' ').toLowerCase();
        if (programFilter === 'Operation Theatre Technology' && !checkLower.includes('anaesthesia') && !checkLower.includes('aott') && !checkLower.includes('operation')) return false;
        if (programFilter === 'Cardiovascular Technology' && !checkLower.includes('cardio') && !checkLower.includes('cvt')) return false;
        if (programFilter === 'Medical Lab Science' && !checkLower.includes('laboratory') && !checkLower.includes('mls') && !checkLower.includes('mlt')) return false;
        if (programFilter === 'Respiratory Technology' && !checkLower.includes('respiratory') && !checkLower.includes('rt')) return false;
        if (programFilter === 'Physiotherapy' && !checkLower.includes('physio') && !checkLower.includes('bpt')) return false;
        if (programFilter === 'Occupational Therapy' && !checkLower.includes('occupational') && !checkLower.includes('bot')) return false;
        if (programFilter === 'Nursing' && !checkLower.includes('nursing')) return false;
        if (programFilter === 'Hospitality Management' && !checkLower.includes('hospitality') && !checkLower.includes('bba')) return false;
      }

      return true;
    });

    // Custom sorting: sort by distance from given location strictly, or by selected metrics
    const sorted = [...listWithDistance].sort((a, b) => {
      if (searchedLocation) {
        return a.distance - b.distance;
      }
      if (sortBy === 'fee') {
        return a.annualFee - b.annualFee;
      }
      if (sortBy === 'intake') {
        return b.learnerIntake - a.learnerIntake;
      }
      if (sortBy === 'placement') {
        return b.avgPlacementPackage - a.avgPlacementPackage;
      }
      return a.name.localeCompare(b.name);
    });

    // Shortlist limit: "in the geo- proximity navigator it also just show near colleges upto 2-3 but focus with very nearest"
    // "and if the filter is not selected it also search and shows only those colleges only not others"
    if (searchedLocation && stateFilter === 'All' && regionFilter === 'All' && programFilter === 'All' && statusFilter === 'All' && naacFilter === 'All') {
      return sorted.slice(0, 3);
    }

    return sorted;
  }, [searchedLocation, regionFilter, stateFilter, statusFilter, naacFilter, maxFeeFilter, programFilter, sortBy, preClosestCollege, focusOnlyFilter]);

  // Identify nearest college on geocoded location active
  const closestCollege = useMemo(() => {
    if (!searchedLocation || processedColleges.length === 0) return null;
    // Rank fully by absolute distance from target
    const sortedTemp = [...processedColleges].sort((a, b) => a.distance - b.distance);
    return sortedTemp[0];
  }, [searchedLocation, processedColleges]);

  // Auto-select nearest college when a location search completes to trigger interactive mapping immediately
  React.useEffect(() => {
    if (searchedLocation && closestCollege) {
      setSelectedCollege(closestCollege);
    }
  }, [searchedLocation, closestCollege]);

  // Browser GPS Geocoder callback
  const handleGpsLocation = () => {
    if (!navigator.geolocation) {
      setGeocodeSourceMessage("Geolocation API not available in this browser environment.");
      return;
    }
    setGeocodeSourceMessage("Querying coordinates via browser GPS...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSearchedLocation({
          name: "Your GPS Location",
          lat: latitude,
          lng: longitude,
          type: 'custom'
        });
        setGeocodeSourceMessage("Dynamic geocoder: Resolved coordinates from live GPS query.");
        setSearchInput(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setSortBy('distance');
      },
      (error) => {
        setGeocodeSourceMessage(`GPS positioning failed: ${error.message}. Please search via city name or pincode.`);
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#e4e4e7] font-sans antialiased pb-12 selection:bg-[#f59e0b] selection:text-black">
      {/* 1. Interactive Control Header Bar */}
      <header className="sticky top-0 bg-[#09090b]/80 backdrop-blur-md border-b border-[#27272a] z-30 shadow-lg transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#27272a] rounded-2xl shadow-lg text-[#f59e0b]">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h1 className="font-serif italic text-[#f59e0b] tracking-tight text-xl">
                Emversity <span className="text-white font-sans not-italic font-bold">Campus Navigator</span>
              </h1>
              <p className="text-[10px] text-[#71717a] font-mono tracking-wide uppercase">
                Allied Health Selection & Geo-Analytics Core
              </p>
            </div>
          </div>

          {/* Quick links to credentials support */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <a 
              href="https://emversity.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#a1a1aa] hover:text-[#f59e0b] transition-colors"
            >
              Emversity Partner List <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-[#27272a]">|</span>
            <div className="flex items-center gap-1.5 text-[#f59e0b] font-semibold bg-[#27272a]/50 border border-[#f59e0b]/20 rounded-full px-2.5 py-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admission Batch 2026 Live
            </div>
          </div>
        </div>
      </header>

      {/* 2. Top Metric Boards */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        <MetricCards colleges={COLLEGES} />

        {/* 3. Interactive Location & College Selection Core */}
        <section className="border border-[#27272a] bg-[#111113] shadow-lg rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Navigation className="w-24 h-24 text-white" />
          </div>

          {/* Premium Tab Selector for Dual-Search Modes */}
          <div className="flex border-b border-[#27272a] mb-5 gap-6">
            <button
              onClick={() => {
                setSearchMode('proximity');
                setDirectSearchInput('');
              }}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 font-mono flex items-center gap-2 cursor-pointer ${
                searchMode === 'proximity'
                  ? 'border-[#f59e0b] text-[#f59e0b]'
                  : 'border-transparent text-[#71717a] hover:text-[#a1a1aa]'
              }`}
            >
              <MapPin className="w-4 h-4 text-[#f59e0b]" />
              1. Hometown Proximity Finder
            </button>
            <button
              onClick={() => {
                setSearchMode('direct');
              }}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 font-mono flex items-center gap-2 cursor-pointer ${
                searchMode === 'direct'
                  ? 'border-[#f59e0b] text-[#f59e0b]'
                  : 'border-transparent text-[#71717a] hover:text-[#a1a1aa]'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#f59e0b]" />
              2. Search College Directly (Database)
            </button>
          </div>

          {searchMode === 'proximity' ? (
            <>
              <div className="max-w-3xl">
                <span className="text-xs font-bold text-[#f59e0b] uppercase tracking-widest font-mono">
                  Proximity Finder
                </span>
                <h2 className="font-sans text-2xl font-extrabold text-white tracking-tight mt-1">
                  Find Colleges Nearest to Your Area or Pincode
                </h2>
                <p className="text-[#a1a1aa] text-xs mt-1.5 leading-relaxed">
                  Enter your hometown name or zip code digits (e.g. <strong className="text-white">Solapur</strong>, <strong className="text-white">Nashik</strong>, or Pune pincode <strong className="text-white">4123006</strong>). The system computes the precise distance via the Haversine Earth-curving formula to sort candidate campuses by physical proximity.
                </p>
              </div>

              {/* Search Box inputs and suggestion chips */}
              <div className="mt-5 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-[#a1a1aa]" />
                    <input
                      type="text"
                      placeholder="Enter area, city or 6-7 digit pincode (e.g., Solapur, 4123006, Hubballi)..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleLocationSearch(searchInput);
                      }}
                      className="w-full pl-11 pr-4 py-3.5 bg-[#18181b] border border-[#3f3f46] focus:border-[#f59e0b] focus:bg-[#111113] rounded-2xl text-sm font-medium outline-none transition-all text-white placeholder-[#71717a]"
                      id="proximity-search-input"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGpsLocation}
                      className="px-4 py-3.5 bg-[#1e1b4b] text-[#818cf8] border border-[#312e81] hover:bg-[#312e81] rounded-2xl text-sm font-semibold shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                      title="Use My GPS Location"
                      id="btn-trigger-gps"
                    >
                      <MapPin className="w-4 h-4 text-[#818cf8]" />
                      <span>GPS</span>
                    </button>
                    <button
                      disabled={isGeocoding}
                      onClick={() => handleLocationSearch(searchInput)}
                      className="px-6 py-3.5 bg-[#f59e0b] text-[#09090b] rounded-2xl text-sm font-bold hover:bg-[#fbbf24] disabled:opacity-50 shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                      id="btn-trigger-geocode"
                    >
                      {isGeocoding ? (
                        <>
                          <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                          <span>Locating...</span>
                        </>
                      ) : (
                        "Locate Campus"
                      )}
                    </button>
                    {searchedLocation && (
                      <button
                        onClick={handleClearLocation}
                        className="p-3.5 bg-[#27272a] text-[#f43f5e] border border-[#3f3f46] hover:bg-[#3f3f46] rounded-2xl transition-colors cursor-pointer"
                        title="Clear locate search"
                        id="btn-clear-geocode"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick click suggestions for testers to verify Solapur and 4123006 pincodes */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[#71717a] text-xs font-mono">
                  <span>Quick Suggestions:</span>
                  <button
                    onClick={() => handleLocationSearch('Pune')}
                    className="px-2.5 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white border border-[#3f3f46] rounded-lg transition-all cursor-pointer"
                  >
                    📍 Pune, MH (Ajeenkya & Alard)
                  </button>
                  <button
                    onClick={() => handleLocationSearch('Vasai')}
                    className="px-2.5 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white border border-[#3f3f46] rounded-lg transition-all cursor-pointer"
                  >
                    📍 Vasai, Mumbai (Universal)
                  </button>
                  <button
                    onClick={() => handleLocationSearch('Kopargaon')}
                    className="px-2.5 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white border border-[#3f3f46] rounded-lg transition-all cursor-pointer"
                  >
                    📍 Kopargaon, MH (Sanjivani)
                  </button>
                  <button
                    onClick={() => handleLocationSearch('Indore')}
                    className="px-2.5 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white border border-[#3f3f46] rounded-lg transition-all cursor-pointer"
                  >
                    📍 Indore, MP (Medi-Caps)
                  </button>
                  <button
                    onClick={() => handleLocationSearch('Kashmir')}
                    className="px-3 py-1 bg-[#311d4d] hover:bg-[#43236e] text-[#d8b4fe] hover:text-purple border border-[#581c87] rounded-lg transition-all cursor-pointer"
                  >
                    ❄️ Kashmir (J&K Search)
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="max-w-3xl">
                <span className="text-xs font-bold text-[#f59e0b] uppercase tracking-widest font-mono">
                  Direct Database Selection
                </span>
                <h2 className="font-sans text-2xl font-extrabold text-white tracking-tight mt-1">
                  Search & Select Colleges Directly from Database
                </h2>
                <p className="text-[#a1a1aa] text-xs mt-1.5 leading-relaxed">
                  Looking for a specific university? Skip proximity calculations by searching the entire live database by institution title, city, or affiliated state.
                </p>
              </div>

              {/* Direct Search Inputs */}
              <div className="mt-5 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-[#a1a1aa]" />
                  <input
                    type="text"
                    placeholder="Type name, city or state of the college here (e.g. Sanjivani, St. Peters, Yenepoya)..."
                    value={directSearchInput}
                    onChange={(e) => setDirectSearchInput(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#18181b] border border-[#3f3f46] focus:border-[#f59e0b] focus:bg-[#111113] rounded-2xl text-sm font-medium outline-none transition-all text-white placeholder-[#71717a]"
                    id="direct-college-search-input"
                  />
                </div>

                {/* Instant Database Search Results */}
                {directSearchInput.trim() !== '' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-[#18181b] border border-[#27272a] rounded-2xl max-h-[280px] overflow-y-auto space-y-2 custom-scrollbar"
                  >
                    <p className="text-[10px] uppercase font-mono tracking-wider text-[#71717a] font-bold">
                      Matching College Entries ({directMatchedColleges.length})
                    </p>
                    {directMatchedColleges.length === 0 ? (
                      <div className="text-xs text-[#71717a] py-3 text-center">
                        No universities matching "{directSearchInput}" found in database.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {directMatchedColleges.map((colVal) => (
                          <div
                            key={colVal.id}
                            onClick={() => {
                              setSelectedCollege(colVal);
                              setStateFilter(colVal.state);
                              setSearchedLocation({
                                name: colVal.name,
                                lat: colVal.lat,
                                lng: colVal.lng,
                                type: 'city'
                              });
                              setGeocodeSourceMessage(`Direct search match: Selected ${colVal.name} from database`);
                              setSearchInput(`${colVal.city}`);
                              setSortBy('distance');
                              setDirectSearchInput('');
                            }}
                            className="p-3 bg-[#111113] hover:bg-[#27272a] border border-[#27272a] hover:border-[#3f3f46] rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all"
                          >
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-white block truncate max-w-[280px]">
                                {colVal.name}
                              </span>
                              <span className="text-[10px] text-[#a1a1aa] block font-mono">
                                📍 {colVal.city}, {colVal.state}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-[#f59e0b] hover:text-[#fbbf24] flex items-center gap-1 shrink-0">
                              Select <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </>
          )}

          {/* Geocode source description notification */}
          <AnimatePresence>
            {searchedLocation && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 mt-4 bg-[#111113] border border-[#f59e0b]/30 text-[#f59e0b] text-xs font-sans rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#10b981]" />
                  <span>
                    <strong>Selected Base:</strong> {searchedLocation.name} (Lat: {searchedLocation.lat.toFixed(4)}, Lng: {searchedLocation.lng.toFixed(4)})
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#a1a1aa] italic hidden sm:inline">
                  {geocodeSourceMessage}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 4. Split Layout - Navigators, filter grid and Map on the right */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column (2 spans wide): Main Selection Grid & Filters */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Extended Multi-category filter board */}
            <div className="border border-[#27272a] bg-[#111113] rounded-3xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#27272a]">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#f59e0b]" />
                  <h3 className="font-sans font-bold text-white text-base">
                    Search Filters & Criteria
                  </h3>
                </div>

                {/* Focus 5 toggle switch */}
                <div className="flex items-center gap-2.5 bg-[#18181b] border border-[#27272a] px-3 py-1.5 rounded-2xl self-start sm:self-auto">
                  <span className="text-[11px] font-semibold text-[#f59e0b] tracking-wide uppercase">Focus 5 Partner Colleges</span>
                  <button
                    onClick={() => setFocusOnlyFilter(!focusOnlyFilter)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      focusOnlyFilter ? 'bg-[#f59e0b]' : 'bg-[#3f3f46]'
                    }`}
                    id="toggle-focus-colleges"
                    title="Toggle Focus 5 Partner Colleges Filter"
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                        focusOnlyFilter ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {focusOnlyFilter && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs rounded-xl flex items-center justify-between">
                  <span>Currently showing only the <strong>5 Focus Partner Colleges</strong> (Ajeenkya, Alard, Universal, Sanjivani, MediCaps). Toggle off to view all 23 campuses.</span>
                  <button 
                    onClick={() => setFocusOnlyFilter(false)} 
                    className="text-[10px] uppercase font-bold tracking-wider text-[#f59e0b] hover:underline hover:text-amber-200 ml-2"
                  >
                    Show All
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                {/* Filter 1: Region */}
                <div>
                  <label className="text-xs font-semibold text-[#a1a1aa] block mb-1.5">Region</label>
                  <select
                    value={regionFilter}
                    onChange={(e) => { setRegionFilter(e.target.value); setStateFilter('All'); }}
                    className="w-full p-2.5 bg-[#18181b] border border-[#3f3f46] text-white rounded-xl text-xs outline-none focus:border-[#f59e0b] cursor-pointer"
                    id="filter-region-select"
                  >
                    <option value="All" className="bg-[#111113]">All Regions</option>
                    <option value="South" className="bg-[#111113]">South India</option>
                    <option value="North" className="bg-[#111113]">North India</option>
                    <option value="West" className="bg-[#111113]">West India</option>
                    <option value="East" className="bg-[#111113]">East India</option>
                  </select>
                </div>

                {/* Filter 2: State (Context aware) */}
                <div>
                  <label className="text-xs font-semibold text-[#a1a1aa] block mb-1.5">State</label>
                  <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="w-full p-2.5 bg-[#18181b] border border-[#3f3f46] text-white rounded-xl text-xs outline-none focus:border-[#f59e0b] cursor-pointer"
                    id="filter-state-select"
                  >
                    <option value="All" className="bg-[#111113]">All States (Any)</option>
                    {uniqueStates
                      .filter(st => {
                        if (regionFilter === 'All') return true;
                        // filter only states belonging to selected region
                        const collegesInSt = COLLEGES.filter(c => c.state === st);
                        return collegesInSt.some(c => c.region === regionFilter);
                      })
                      .map(st => (
                        <option key={st} value={st} className="bg-[#111113]">{st}</option>
                      ))}
                  </select>
                </div>

                {/* Filter 3: Program Category */}
                <div>
                  <label className="text-xs font-semibold text-[#a1a1aa] block mb-1.5">Target Discipline</label>
                  <select
                    value={programFilter}
                    onChange={(e) => setProgramFilter(e.target.value)}
                    className="w-full p-2.5 bg-[#18181b] border border-[#3f3f46] text-white rounded-xl text-xs outline-none focus:border-[#f59e0b] cursor-pointer"
                    id="filter-program-select"
                  >
                    <option value="All" className="bg-[#111113]">All Disciplines</option>
                    {uniquePrograms.map(p => (
                      <option key={p} value={p} className="bg-[#111113]">{p}</option>
                    ))}
                  </select>
                </div>

                {/* Filter 4: Admission Status */}
                <div>
                  <label className="text-xs font-semibold text-[#a1a1aa] block mb-1.5">Admission Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2.5 bg-[#18181b] border border-[#3f3f46] text-white rounded-xl text-xs outline-none focus:border-[#f59e0b] cursor-pointer"
                    id="filter-status-select"
                  >
                    <option value="All" className="bg-[#111113]">All Statuses</option>
                    <option value="Admission 2026 Open" className="bg-[#111113]">Admissions Open</option>
                    <option value="Admission Hold" className="bg-[#111113]">Admission Hold</option>
                  </select>
                </div>

                {/* Filter 5: NAAC Rating */}
                <div>
                  <label className="text-xs font-semibold text-[#a1a1aa] block mb-1.5">NAAC Standards</label>
                  <select
                    value={naacFilter}
                    onChange={(e) => setNaacFilter(e.target.value)}
                    className="w-full p-2.5 bg-[#18181b] border border-[#3f3f46] text-white rounded-xl text-xs outline-none focus:border-[#f59e0b] cursor-pointer"
                    id="filter-naac-select"
                  >
                    <option value="All" className="bg-[#111113]">Any Grade (Applied/NA/A)</option>
                    <option value="A" className="bg-[#111113]">Grade A or higher</option>
                    <option value="A+" className="bg-[#111113]">Grade A+ or higher</option>
                    <option value="A++" className="bg-[#111113]">Grade A++ strictly</option>
                  </select>
                </div>

                {/* Filter 6: Max Fees Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-[#a1a1aa]">Max Tuition Limit</label>
                    <span className="text-xs font-mono font-extrabold text-[#f59e0b]">
                      {maxFeeFilter.toFixed(2)}L
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.2"
                    value={maxFeeFilter}
                    onChange={(e) => setMaxFeeFilter(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#f59e0b]"
                    id="filter-fees-slider"
                  />
                  <div className="flex justify-between text-[8px] text-[#71717a] font-mono mt-1">
                    <span>1L Per Annum</span>
                    <span>5L Per Annum</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Filtered Results Table with Distance */}
            <div className="border border-[#27272a] bg-[#111113] rounded-3xl shadow-lg overflow-hidden flex flex-col">
              
              {/* Header block details */}
              <div className="p-6 pb-4 border-b border-[#27272a] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-sans font-bold text-white text-base flex items-center gap-2">
                    Suitable Campuses Found 
                    <span className="text-xs font-mono bg-[#27272a] text-[#f59e0b] px-2.5 py-0.5 rounded-full font-bold">
                      {processedColleges.length}
                    </span>
                  </h3>
                  <p className="text-[#a1a1aa] text-xs mt-1">
                    Rank and select institutions below to view geographical routing.
                  </p>
                </div>

                {/* Sorting Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-[#71717a] font-medium whitespace-nowrap">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full sm:w-auto p-1.5 bg-[#18181b] border border-[#3f3f46] text-white rounded-lg text-xs outline-none focus:border-[#f59e0b] cursor-pointer"
                    id="sort-colleges-select"
                  >
                    <option value="name" className="bg-[#111113]">College Name</option>
                    {searchedLocation && <option value="distance" className="bg-[#111113]">🛡️ Proximity Distance</option>}
                    <option value="fee" className="bg-[#111113]">Low Tuition Fee</option>
                    <option value="intake" className="bg-[#111113]">Intake Seat Count</option>
                    <option value="placement" className="bg-[#111113]">Average Placement (LPA)</option>
                  </select>
                </div>
              </div>

              {/* Table section */}
              {processedColleges.length > 0 ? (
                <div className="overflow-x-auto font-sans">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#18181b]/80 border-b border-[#27272a] text-[#a1a1aa] font-semibold text-[10px] uppercase font-mono tracking-wider">
                        <th className="p-4 pl-6">Institution</th>
                        <th className="p-4">Region/State</th>
                        <th className="p-4">Est Batch Intakes</th>
                        <th className="p-4">Annual Fees</th>
                        <th className="p-4">NAAC Grade</th>
                        {searchedLocation && <th className="p-4 text-[#f59e0b]">Distance</th>}
                        <th className="p-4 pr-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272a] text-xs">
                      {processedColleges.map((col) => {
                        const isSelected = selectedCollege?.id === col.id;
                        const isClosest = closestCollege?.id === col.id;

                        return (
                          <tr
                            key={col.id}
                            className={`hover:bg-[#18181b]/50 transition-colors cursor-pointer ${
                              isSelected ? 'bg-[#f59e0b]/5' : ''
                            }`}
                            onClick={() => setSelectedCollege(col)}
                          >
                            <td className="p-4 pl-6">
                              <div className="font-sans font-bold text-white group-hover:text-[#f59e0b] transition-colors flex items-center gap-1.5">
                                {col.name}
                                {isClosest && (
                                  <span className="text-[9px] font-mono bg-amber-500/10 text-[#f59e0b] px-1.5 py-0.5 rounded border border-amber-500/20">
                                    Nearest
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-[#71717a] font-mono mt-0.5">{col.city}</div>
                            </td>
                            <td className="p-4 text-[#a1a1aa]">
                              <span className="font-semibold block text-white">{col.state}</span>
                              <span className="text-[10px] uppercase text-[#71717a]">{col.region} Sector</span>
                            </td>
                            <td className="p-4 font-mono text-[#a1a1aa]">
                              <strong className="text-white">{col.learnerIntake}</strong> Seats
                            </td>
                            <td className="p-4 font-mono font-semibold text-white">
                              ₹{col.annualFee.toFixed(2)}L <span className="text-[10px] text-[#71717a] font-normal">/ yr</span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] border ${
                                col.naacGrading.startsWith('A')
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-[#27272a] text-[#71717a] border-[#3f3f46]'
                              }`}>
                                {col.naacGrading}
                              </span>
                            </td>
                            {searchedLocation && (
                              <td className="p-4 font-mono text-[#f43f5e] font-bold">
                                🚀 {col.distance} KM
                              </td>
                            )}
                            <td className="p-4 pr-6 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCollege(col);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#10b981] text-white hover:bg-[#059669]'
                                    : 'bg-[#27272a] text-[#e4e4e7] hover:bg-[#3f3f46] hover:text-[#f59e0b] border border-[#3f3f46]'
                                }`}
                                id={`select-${col.id}`}
                              >
                                View Route
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-[#71717a] text-sm">
                  <p className="font-medium">No campuses match your selected filters.</p>
                  <button
                    onClick={() => {
                      setRegionFilter('All');
                      setStateFilter('All');
                      setProgramFilter('All');
                      setStatusFilter('All');
                      setMaxFeeFilter(5.0);
                      setNaacFilter('All');
                      setFocusOnlyFilter(false);
                    }}
                    className="mt-3 text-[#f59e0b] hover:underline font-semibold cursor-pointer"
                    id="btn-reset-all-filters"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Staggered SVG Dynamic trends of candidates */}
            <DashboardCharts colleges={processedColleges} />

          </div>

          {/* Right Column: Dynamic SVG Map Navigator */}
          <div className="space-y-6">
            <MapIndicator
              colleges={processedColleges}
              selectedCollege={selectedCollege}
              onSelectCollege={setSelectedCollege}
              searchedLocation={searchedLocation}
              nearestCollege={closestCollege}
            />
          </div>

        </section>

        {/* 5. Rich Selected College Inspection Panel (Spanning full width) */}
        <AnimatePresence mode="wait font-sans">
          {selectedCollege && (
            <motion.section
              key={selectedCollege.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="border border-[#27272a] bg-[#111113] shadow-lg rounded-3xl overflow-hidden p-6 lg:p-8"
              id="details-panel"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6 pb-6 border-b border-[#27272a]">
                <div className="space-y-2">
                  <span className="text-xs font-mono bg-[#27272a] border border-[#3f3f46] text-[#f59e0b] rounded-full py-0.5 px-3 font-semibold">
                    ⭐ Campus Detail Inspector ({selectedCollege.region} India Sector)
                  </span>
                  <h2 className="font-serif text-[#f59e0b] font-extrabold text-2xl lg:text-3xl tracking-tight">
                    {selectedCollege.name}
                  </h2>
                  <p className="text-[#a1a1aa] font-medium text-xs flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-[#f43f5e] shrink-0" />
                    {selectedCollege.address}
                  </p>
                </div>

                {/* Main Action links */}
                <div className="flex flex-wrap items-center gap-3">
                  {selectedCollege.brochureLink && (
                    <a
                      href={selectedCollege.brochureLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-[#3f3f46] hover:border-[#71717a] rounded-xl text-[#e4e4e7] hover:bg-[#18181b] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-emerald-400" />
                      Download Leaflet
                    </a>
                  )}
                  {selectedCollege.paymentLink && (
                    <a
                      href={selectedCollege.paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      Apply Admission 2026
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Grid content detailing everything with Parent-Student Advisory board and Tab Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                
                {/* Left pane: core programmatic and financial details */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Academic offering items */}
                  <div>
                    <h4 className="text-xs font-bold text-[#71717a] uppercase tracking-widest font-mono mb-3 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#f59e0b]" />
                      List of Approved Allied Programs Offered ({selectedCollege.programsCount})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedCollege.programsList.map((pr, idx) => (
                        <div key={idx} className="p-3 bg-[#18181b] border border-[#27272a] rounded-xl flex items-start gap-2.5 h-full hover:border-[#3f3f46] transition-all">
                          <CheckCircle className="w-4 h-4 text-[#f59e0b] grow-0 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-sans font-bold text-[#e4e4e7] text-[11px] block leading-tight">{pr}</span>
                            <span className="font-mono text-[9px] text-[#a1a1aa] block leading-normal">{getCourseDescription(pr)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 👨‍👩‍👧‍👦 Student & Parent Advisory Dashboard */}
                  <div className="border border-[#27272a] bg-[#141416] p-5 lg:p-6 rounded-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#27272a]">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#f59e0b]" />
                          👨‍👩‍👧‍👦 Parent & Student Advisory Board
                        </h4>
                        <p className="text-[#a1a1aa] text-[10.5px]">
                          Reliable, parent-first guidelines regarding financials, hostel safety, loan approvals, and staff helplines.
                        </p>
                      </div>

                      {/* Spark indicator of Admission Status */}
                      <span className="self-start sm:self-auto text-[10px] font-mono bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 rounded-full px-2.5 py-0.5 font-bold">
                        {selectedCollege.admissionStatus} (Batch 2026)
                      </span>
                    </div>

                    {/* Interactive Tab Headers */}
                    <div className="flex flex-wrap gap-1.5 p-1 bg-[#18181b] rounded-xl">
                      {[
                        { id: 'finance', label: '💳 Financial & Bank Support', icon: Coins },
                        { id: 'hostel', label: '🏡 Hostel & Transit', icon: Home },
                        { id: 'academics', label: '📚 Careers & ROI', icon: GraduationCap },
                        { id: 'contact', label: '📞 Helpdesk Hotlines', icon: Phone }
                      ].map((tab) => {
                        const IconComponent = tab.icon;
                        const isCurrent = parentTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setParentTab(tab.id as any)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              isCurrent 
                                ? 'bg-[#f59e0b] text-black shadow-md' 
                                : 'text-[#a1a1aa] hover:text-white hover:bg-[#27272a]/40'
                            }`}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Tab Inner Contents holding precise properties from CSV */}
                    <div className="mt-4 text-xs leading-relaxed text-[#e4e4e7] space-y-4">
                      
                      {parentTab === 'finance' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-[#18181b] rounded-xl border border-[#27272a]">
                              <span className="text-[10px] font-mono uppercase text-[#71717a] font-bold block mb-1">Tuition Fees</span>
                              <p className="text-white font-mono font-bold text-sm">{selectedCollege.programFee}</p>
                              <span className="text-[10px] text-[#a1a1aa] block mt-1">Pay Cycle: {selectedCollege.paymentCycle}</span>
                            </div>

                            <div className="p-4 bg-[#18181b] rounded-xl border border-[#27272a]">
                              <span className="text-[10px] font-mono uppercase text-[#71717a] font-bold block mb-1">Registration & Booking Fees</span>
                              <p className="text-white font-sans font-medium">{selectedCollege.registrationFee}</p>
                              <span className="text-[9px] text-[#71717a] block mt-1">Ref: {CONTACT_AND_HELP_INFO[selectedCollege.id]?.refundPolicy || "UGC guidelines compliant refund structure applies."}</span>
                            </div>
                          </div>

                          <div className="p-4 bg-[#f59e0b]/5 border border-[#f59e0b]/15 rounded-xl space-y-2">
                            <h5 className="font-sans font-semibold text-[#f59e0b] flex items-center gap-1.5 text-[11px]">
                              ℹ️ Scholarship & Loan Facilitation for Parents
                            </h5>
                            <div className="space-y-1 mt-1 text-[11px] text-[#a1a1aa] leading-relaxed">
                              <p>
                                <strong className="text-white">Scholarships:</strong> {CONTACT_AND_HELP_INFO[selectedCollege.id]?.scholarships || "Eligible for state-level post-matric scholarships and SVMCM/SSP application routes depending on student domicile."}
                              </p>
                              <p className="mt-1">
                                <strong className="text-white">Education Loan Support:</strong> {CONTACT_AND_HELP_INFO[selectedCollege.id]?.loans || "Academic bonafide certificate supplied immediately post seat-reservation to initiate educational credit files across any commercial bank."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {parentTab === 'hostel' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-[#18181b] rounded-xl border border-[#27272a] space-y-1">
                              <span className="text-[10px] font-mono uppercase text-[#71717a] font-bold block">Annual Hostel Pricing</span>
                              <p className="text-white font-medium">{selectedCollege.hostelAvailable}</p>
                              <p className="text-[10px] text-[#a1a1aa] mt-0.5">
                                <strong className="text-[#f59e0b]">Capacity:</strong> {CONTACT_AND_HELP_INFO[selectedCollege.id]?.hostelCapacity || "Co-ed blocks available on campus, separate boys and girls wings."}
                              </p>
                            </div>

                            <div className="p-4 bg-[#18181b] rounded-xl border border-[#27272a] space-y-1">
                              <span className="text-[10px] font-mono uppercase text-[#71717a] font-bold block">Safety, Meals & Amenities</span>
                              <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                                {CONTACT_AND_HELP_INFO[selectedCollege.id]?.hostelAmenities || "24x7 security, RO filtered water, continuous guard patrols, high-speed Wi-Fi, hygienic cafeteria serving healthy diet meals daily."}
                              </p>
                              <p className="text-[10px] text-[#71717a] mt-0.5">
                                Includes: {selectedCollege.amenity}
                              </p>
                            </div>
                          </div>

                          <div className="p-4 bg-[#18181b]/50 border border-[#27272a] rounded-xl flex items-start gap-3">
                            <div className="p-2 bg-[#27272a] rounded-lg mt-0.5 shrink-0 text-[#f59e0b]">
                              <Compass className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <h5 className="font-bold text-white text-xs">Transportation Systems & Local Connexions</h5>
                              <p className="text-[#a1a1aa] text-[11px]">
                                {selectedCollege.transportation}
                              </p>
                              <span className="text-[10px] text-[#71717a] block leading-tight">
                                Recommended for daily local day-scholars and transit routes covering key access terminals.
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {parentTab === 'academics' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-[#18181b] rounded-xl border border-[#27272a] space-y-1">
                              <span className="text-[10px] font-mono uppercase text-[#71717a] font-bold block">Eligibility Prerequisite</span>
                              <p className="text-white font-medium">{selectedCollege.eligibility}</p>
                              <span className="text-[10px] text-[#71717a] block mt-1">Course Duration: {selectedCollege.duration}</span>
                            </div>

                            <div className="p-4 bg-[#18181b] rounded-xl border border-[#27272a] space-y-1">
                              <span className="text-[10px] font-mono uppercase text-[#71717a] font-bold block">Career Placement ROI</span>
                              <p className="text-[#f59e0b] font-bold font-mono text-xs">{selectedCollege.roi}</p>
                              <span className="text-[10px] text-[#a1a1aa] block">Average Placement packages around ₹{selectedCollege.avgPlacementPackage.toFixed(2)} LPA.</span>
                            </div>
                          </div>

                          <div className="p-4 bg-[#18181b] rounded-xl border border-[#27272a] space-y-2">
                            <h5 className="font-bold text-white text-xs">⭐ Distinct Academic Ecosystem Highlights</h5>
                            <p className="text-[#a1a1aa] text-[11px] leading-relaxed">
                              {selectedCollege.uniquePoints}
                            </p>
                          </div>
                        </div>
                      )}

                      {parentTab === 'contact' && (
                        <div className="space-y-4">
                          <div className="p-4 bg-[#f59e0b]/5 border border-[#f59e0b]/15 rounded-xl">
                            <h5 className="font-bold text-[#f59e0b] mb-2 flex items-center gap-1 text-xs">
                              📞 Authorized Campus Helplines & Field Support
                            </h5>
                            <p className="text-[11px] text-[#a1a1aa] mb-3 leading-relaxed">
                              Parents can connect directly with the campus owners, supervisors, and Emversity field support team (FST) members to schedule physical visits or resolve fee queries immediately.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 font-mono text-[10px]">
                              <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-xl space-y-1 text-[#e4e4e7]">
                                <span className="text-[#71717a] text-[9px] block uppercase font-bold">University Partner</span>
                                <strong className="text-white block">{selectedCollege.universityOwner.split('(')[0].trim()}</strong>
                                {selectedCollege.universityOwner.includes('(') && (
                                  <a href={`tel:${selectedCollege.universityOwner.match(/\(([^)]+)\)/)?.[1] || ''}`} className="text-[#f59e0b] hover:underline font-bold flex items-center gap-1 mt-1">
                                    <Phone className="w-3 h-3 text-[#f59e0b]" />
                                    {selectedCollege.universityOwner.match(/\(([^)]+)\)/)?.[1] || ''}
                                  </a>
                                )}
                              </div>

                              <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-xl space-y-1 text-[#e4e4e7]">
                                <span className="text-[#71717a] text-[9px] block uppercase font-bold">Active Campus Manager</span>
                                <strong className="text-white block">{selectedCollege.campusManager.split('(')[0].trim()}</strong>
                                {selectedCollege.campusManager.includes('(') && (
                                  <a href={`tel:${selectedCollege.campusManager.match(/\(([^)]+)\)/)?.[1] || ''}`} className="text-[#f59e0b] hover:underline font-bold flex items-center gap-1 mt-1">
                                    <Phone className="w-3 h-3 text-[#f59e0b]" />
                                    {selectedCollege.campusManager.match(/\(([^)]+)\)/)?.[1] || ''}
                                  </a>
                                )}
                              </div>

                              <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-xl space-y-1 text-[#e4e4e7]">
                                <span className="text-[#71717a] text-[9px] block uppercase font-bold">Field Support Team (FST)</span>
                                <p className="text-white font-sans text-[10px] font-semibold">
                                  {CONTACT_AND_HELP_INFO[selectedCollege.id]?.fst.split(' / ')[0] || "Authorized Emversity Support Network"}
                                </p>
                                {CONTACT_AND_HELP_INFO[selectedCollege.id]?.fst && (
                                  <span className="text-[#a1a1aa] block text-[9px] italic">
                                    Full roster: {CONTACT_AND_HELP_INFO[selectedCollege.id]?.fst}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-xl flex justify-between items-center text-[#71717a] text-[10px]">
                            <span>Institutional Relations Head (ISM Manager):</span>
                            <span className="text-[#e4e4e7] font-bold uppercase tracking-wider font-mono bg-[#27272a] px-2.5 py-0.5 rounded-md text-[9px]">
                              {CONTACT_AND_HELP_INFO[selectedCollege.id]?.ism || "Rahul (Authorized)"}
                            </span>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                </div>

                {/* Right side pane of detailing college (Video embedded and contacts) */}
                <div className="space-y-6">
                  
                  {/* Embedded youtube video */}
                  {selectedCollege.campusVideo ? (
                    <div>
                      <h4 className="text-xs font-bold text-[#71717a] uppercase tracking-widest font-mono mb-3 flex items-center gap-1.5">
                        <Tv className="w-4 h-4 text-[#f59e0b]" />
                        Explore Campus Tour Video
                      </h4>
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#27272a] shadow-lg bg-[#18181b]">
                        <iframe
                          src={selectedCollege.campusVideo}
                          title={`${selectedCollege.name} tour`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full border-0"
                          referrerPolicy="no-referrer"
                        ></iframe>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 border border-[#27272a] bg-[#18181b] rounded-2xl text-center flex flex-col justify-center items-center h-48">
                      <FileVideo className="w-8 h-8 text-[#52525b] mb-2 animate-pulse" />
                      <span className="text-xs font-medium text-[#71717a]">Video Walkthrough Unlisted</span>
                      <p className="text-[10px] text-[#52525b] mt-1 max-w-xs leading-normal">
                        Visit our admission cell or explore emversity coordinate maps for visual assets.
                      </p>
                    </div>
                  )}

                  {/* Highlights checklist details */}
                  <div className="p-5 bg-[#18181b] border border-[#27272a] rounded-2xl space-y-4">
                    <div>
                      <h5 className="text-[10px] uppercase font-bold text-[#71717a] font-mono tracking-widest">
                        Academic Specifications
                      </h5>
                      <ul className="text-xs space-y-2 mt-2">
                        <li className="flex justify-between border-b border-[#27272a] pb-1.5 text-[#a1a1aa]">
                          <span className="font-medium">Minimum Duration:</span>
                          <span className="font-semibold text-white">{selectedCollege.duration}</span>
                        </li>
                        <li className="flex justify-between border-b border-[#27272a] pb-1.5 text-[#a1a1aa]">
                          <span className="font-medium">Eligibility Target:</span>
                          <span className="font-semibold text-white">{selectedCollege.eligibility}</span>
                        </li>
                        <li className="flex justify-between border-b border-[#27272a] pb-1.5 text-[#a1a1aa]">
                          <span className="font-medium">NAAC Grade Value:</span>
                          <span className="font-semibold text-[#f59e0b]">{selectedCollege.naacGrading} Certified</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-[10px] uppercase font-bold text-[#71717a] font-mono tracking-widest">
                        Unique Advantages
                      </h5>
                      <p className="text-[11px] text-[#a1a1aa] leading-relaxed font-sans mt-2">
                        {selectedCollege.uniquePoints}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-[10px] uppercase font-bold text-[#71717a] font-mono tracking-widest">
                        General Registration Batch
                      </h5>
                      <p className="text-[11.5px] text-[#a1a1aa] leading-relaxed font-sans mt-2">
                        Admission process commenced on <strong className="text-white">{selectedCollege.admissionStartDate || 'Jan 5th, 2026'}</strong>. Interested families should register early via official portal to block seat allocation prior to the entry deadline.
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Structured Footer */}
      <footer className="mt-16 border-t border-[#27272a] bg-[#09090b] py-12 text-[#71717a] text-xs text-center font-mono">
        <div className="max-w-7xl mx-auto px-4 space-y-3 font-sans">
          <p className="font-sans font-medium text-[#a1a1aa]">
            © 2026 Emversity Campus Navigator. All rights reserved.
          </p>
          <p className="max-w-xl mx-auto leading-relaxed text-[10px] text-[#52525b]">
            Precision distance calculation based on geodesic tracking models. Values represented reflect tentative academic calendars, batch registries, and program catalogs as of admission year 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}
