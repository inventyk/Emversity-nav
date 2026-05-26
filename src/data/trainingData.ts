/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Objection {
  id: number;
  category: string;
  subCategory: string;
  objection: string;
  callerEmotion: string;
  idealResponse: string;
  keyDataPoints: string;
  dos: string;
  donts: string;
  difficulty: "Easy" | "Medium" | "Hard";
  followUp: string;
}

export interface CounsellingStep {
  id: number;
  title: string;
  description: string;
  role: "Student" | "Parent" | "Both" | "General";
  guidelines: string;
  scriptTemplate: string;
}

export interface ProfilingCategory {
  category: string;
  questions: string[];
}

export const PROFILING_QUESTIONS: ProfilingCategory[] = [
  {
    category: "1. Career Aspiration & Purpose",
    questions: [
      "What inspired you to consider a healthcare-related field? Was it someone you know in this line, or your own interest in helping people?",
      "When you think of your future career, what kind of work excites you the most? Working with patients, using technology, research, or management?",
      "Do you see yourself more in a hospital, lab, or corporate healthcare setup?",
      "Is your goal to become a healthcare professional or to enter the medical industry in general?",
      "What kind of impact do you hope to create through your career?"
    ]
  },
  {
    category: "2. Decision Triggers / Influences",
    questions: [
      "Were you primarily preparing for NEET or exploring other healthcare options too?",
      "What made you start looking for alternative medical careers, was it interest, time, competition, or cost?",
      "Have you explored what the Allied Health Sciences field actually involves?",
      "What made you curious about Allied Health instead of waiting for another NEET attempt?",
      "Did someone guide or recommend you to look at healthcare courses recently?"
    ]
  },
  {
    category: "3. Interest & Strength Mapping",
    questions: [
      "Which subjects did you enjoy the most in school, Biology, Physics, or Chemistry?",
      "Do you prefer hands-on work and practical learning, or theory and research?",
      "Would you describe yourself as more people-oriented or technology-oriented?",
      "Do you like working behind the scenes (labs, diagnostics) or directly helping patients?",
      "Are you curious about how hospitals and healthcare systems work behind the scenes?"
    ]
  },
  {
    category: "4. Motivational Priorities",
    questions: [
      "What’s most important to you right now, getting a stable job soon, pursuing a strong professional degree, or studying what you love?",
      "How important is studying at a well-known university versus focusing on skill-based learning?",
      "Are you open to exploring international career pathways after graduation?"
    ]
  },
  {
    category: "5. Parental Perspective",
    questions: [
      "What kind of career do you envision for your child, hospital-based, research-oriented, or something globally relevant?",
      "Were you initially considering only MBBS, or are you open to other healthcare streams?",
      "Do you prefer programs with clear job placement or those that allow for higher studies later?",
      "How do you usually decide on colleges, based on brand, affordability, or job outcomes?"
    ]
  },
  {
    category: "6. Vision for the Future",
    questions: [
      "If everything goes right in 5 years, what would you like to be doing?",
      "Where do you see yourself working, in India or abroad?",
      "What does a ‘successful career’ look like to you personally?",
      "When you imagine your dream job, what’s the one thing that excites you most about it?"
    ]
  },
  {
    category: "7. Soft Probes to Deepen Emotional Connection",
    questions: [
      "That’s interesting, what made you feel this field could be right for you?",
      "If you weren’t considering healthcare, what other options were you exploring?",
      "What do you think makes a career ‘worth it’, salary, satisfaction, or respect?",
      "Do you want to work in an environment where every day feels meaningful, or something more routine and stable?"
    ]
  }
];

export const COUNSELLING_STEPS: CounsellingStep[] = [
  {
    id: 1,
    title: "Introduction: Permission & Purpose",
    description: "Always open the call politely and request 5 minutes. (KEEP VERBATIM - DO NOT CHANGE)",
    role: "Both",
    guidelines: "If student: say Rohit's script. If parent: invite parent to stay on speaker, speak to both.",
    scriptTemplate: "Hi, am I speaking with [Name]? ... Hi [Name], this is [CounsellorName] from Emversity. You enquired showing interest in allied healthcare or hospitality courses, right? Great. I just wanted a quick 5-minute chat to understand where you're at and see if we can help with the next step."
  },
  {
    id: 2,
    title: "Introduce Emversity",
    description: "Briefly explain Emversity's role as a skill and university integration partner.",
    role: "General",
    guidelines: "Emphasize industry-linkage, NSDC/HSSC approvals, and custom VR labs inside partner campuses.",
    scriptTemplate: "You may or may not have heard of Emversity, we’re an Industry Skilling Partner to UGC-recognized universities. Our role is to make university degree programs more career-oriented by integrating real-world skills, internships, and placement support. All academic exams and degrees are granted by direct universities, while Emversity sets up skill labs, VR practice simulators, and coordinates top-tier clinical hospital internships so you graduate 100% job-ready."
  },
  {
    id: 3,
    title: "Build Rapport & Discover Needs",
    description: "Perform quick eligibility check and profile profiling.",
    role: "General",
    guidelines: "Check hometown, stream percentage (PCB/PCM/Commerce), NEET attempt, decision makers, and relocation comfort.",
    scriptTemplate: "Before we talk about courses, can I ask a few quick questions to understand you better? Which city are you currently based in? Who helps you with career decisions, mom or dad? What stream did you choose in 12th and what percentage did you secure? Also, are you open to relocating to a premier campus for outstanding placements?"
  },
  {
    id: 4,
    title: "Align the Solution & Bridge",
    description: "Align your course pitch to their specific motive.",
    role: "Both",
    guidelines: "For job-seekers, pitches are placement-driven. For NEET droppers, frame AHS as a powerful parallel pathway.",
    scriptTemplate: "Thanks for sharing that! Based on your biological sciences background and focus on career security, B.Sc Honours in Allied Health Science is an absolute match. Courses like Medical Lab Technology or Cardiac Technology have immediate vacancy pools where leading corporate chains hire directly after graduation."
  },
  {
    id: 5,
    title: "Explain Emversity USPs (VR & Live Labs)",
    description: "Translate the high-tech training format to understandable words.",
    role: "General",
    guidelines: "Highlight the 3D Virtual Reality headset labs which mimic active OTs and emergency rooms safely.",
    scriptTemplate: "Our unique differentiator is Virtual Reality (VR) simulation labs. Imagine you put on a pair of special headset glasses and suddenly you are standing inside an immersive 3D hospital operation theatre. You practice advanced procedures like giving injections, handling trauma nodes, or diagnostic setups again and again, till you are perfectly confident before going near real patients."
  },
  {
    id: 6,
    title: "Invite to Career Counselling Session & ₹499 Ask",
    description: "Present the personalized counseling session. Key focus is Value, not fee.",
    role: "Both",
    guidelines: "Describe what they get: full roadmap, entry priorities, scholarship assessments. Silence after asking.",
    scriptTemplate: "[Name], here's the thing — 5 minutes on a phone call isn't enough to plan a lifetime career. What we do next is a guided, personalized 1-on-1 counseling session (30 to 40 mins) with a senior medical career counselor. It's ₹499. In that, you'll get a tailored roadmap, 3-4 specific course structures with exact fees, and walk-ins don't get priority for our laptop and scholarship distributions. Should I block a slot for you?"
  },
  {
    id: 7,
    title: "Handle Questions & Obstacle Filtering",
    description: "Solve key hesitations or objections dynamically.",
    role: "General",
    guidelines: "Use standard response rules matching the specific objection type.",
    scriptTemplate: "Fair question! Free counseling is usually a sales pitch in disguise. Ours is paid because the counselor spends 40 dedicated minutes solely on your stream, interest, and budget. The ₹499 fee just makes sure we both take this crucial career decision seriously. Honestly, ₹499 is less than a movie ticket, but it can shape your entire future."
  },
  {
    id: 8,
    title: "Book the Slot (Two Alternating Times)",
    description: "Offer two distinct schedule options to drive decision.",
    role: "General",
    guidelines: "Avoid open questions like 'when are you free?'. Instead, suggest slot details.",
    scriptTemplate: "I have Monday at 11 AM or Tuesday at 4 PM open this week for the video slot. Which one of these works better for you and your parents to sit together?"
  },
  {
    id: 9,
    title: "Recap & Confirm Details",
    description: "Verify critical variables back to the user.",
    role: "General",
    guidelines: "Summarize stream, location, day, time.",
    scriptTemplate: "Excellent. Just to confirm: we are booking the slot for [Day/Time] to map out alternatives for [Stream/Percentage] from [City]. I will share the counselor's contact and the safe payment link on your Whatsapp right now."
  },
  {
    id: 10,
    title: "Mandatory Referral Ask",
    description: "Request other candidate references if available.",
    role: "General",
    guidelines: "Do not omit this, ask friendly.",
    scriptTemplate: "Before we close, do you have any friends or classmates who are also looking for great NEET alternatives or professional courses? We'd be happy to support their journey as well."
  },
  {
    id: 11,
    title: "Final Warm Close",
    description: "Provide a friendly exit and schedule reminders.",
    role: "General",
    guidelines: "Set expectations for reminder calls.",
    scriptTemplate: "Thank you so much of your time! I'm confident this session will give you total clarity. We will drop a short reminder call 30 minutes before the scheduled time. Wishing you absolute success in your healthcare journey!"
  }
];

export const OBJECTIONS: Objection[] = [
  {
    id: 1,
    category: "AHS Awareness",
    subCategory: "What is AHS",
    objection: "What exactly is AHS? I've never heard of it. Is it just another paramedical diploma?",
    callerEmotion: "Confused",
    idealResponse: "AHS stands for Allied Health Sciences — full B.Sc./B.Sc.(Hons) degree programs, NOT diplomas. AHS professionals form over 60% of the global healthcare workforce — lab technologists, OT technicians, radiology experts, physiotherapists. India needs 6.5 million AHS professionals by 2030 but currently meets only 4-5% of that demand. UGC-recognized degree with massive career potential.",
    keyDataPoints: "60% healthcare = AHS; India needs 6.5M by 2030; Only 4-5% met; 95% gap",
    dos: "Use relatable analogies; Share career examples",
    donts: "Never say 'paramedical'; Don't compare negatively with MBBS",
    difficulty: "Easy",
    followUp: "Share brochure; Invite to demo"
  },
  {
    id: 2,
    category: "AHS Awareness",
    subCategory: "Job Scope",
    objection: "Healthcare means only doctors and nurses. What jobs can AHS graduates get?",
    callerEmotion: "Dismissive",
    idealResponse: "Doctors and nurses = only 40% of healthcare staff. The remaining 60% are AHS professionals — lab technologists, radiology techs operating MRI machines, OT technicians assisting surgeries. India has a 95% shortage. Graduates work in hospitals, diagnostic labs, rehab centers, and global healthcare in USA, UK, Canada, Australia. Sector growing 14-28% annually.",
    keyDataPoints: "95% AHS shortage; Growing 14-28%/yr; Global demand in US/UK/Canada/Australia; 1.9M jobs annually worldwide",
    dos: "List specific roles; Mention hiring hospitals",
    donts: "Don't be defensive; Don't dismiss concern",
    difficulty: "Easy",
    followUp: "Share career pathway doc"
  },
  {
    id: 3,
    category: "AHS Awareness",
    subCategory: "BSc Hons vs Regular",
    objection: "I've never heard of B.Sc. Hons. Will employers recognize it?",
    callerEmotion: "Doubtful",
    idealResponse: "B.Sc.(Hons) has deeper curriculum, mandatory practical exposure (VR labs, hospital internships). Regular B.Sc. grads: only 30-35% get jobs. Healthcare Hons grads: 70-80% placement starting ₹25-30K/month. Hons also opens direct PhD path under UGC guidelines without always needing a master's.",
    keyDataPoints: "Regular BSc: 30-35% employment; Hons: 70-80%; Starting ₹25-30K/mo; Direct PhD eligible",
    dos: "Explain Hons = deeper specialization; Show curriculum",
    donts: "Don't belittle regular BSc",
    difficulty: "Medium",
    followUp: "Share curriculum; Connect with faculty"
  },
  {
    id: 4,
    category: "AHS Awareness",
    subCategory: "Regulatory Recognition",
    objection: "Is this course recognized by any government body?",
    callerEmotion: "Suspicious",
    idealResponse: "Absolutely — governed by NCAHP (National Commission for Allied Healthcare Professions), established by Govt of India in 2021. Covers ~56 professions. From 2025-26, students MUST enrol only in NCAHP-recognized colleges. After completion, students register with State Allied Healthcare Council & get unique ID on Central Register. All our partner universities are NCAHP-compliant.",
    keyDataPoints: "NCAHP est. 2021; ~56 professions; Mandatory from 2025-26; Central Register ID; Renewal every 5 yrs",
    dos: "Show NCAHP website; Name university accreditations (NAAC, UGC)",
    donts: "Never claim unverified accreditations",
    difficulty: "Medium",
    followUp: "Share NCAHP details; Show NAAC certificate"
  },
  {
    id: 5,
    category: "AHS Awareness",
    subCategory: "Old Uni New Course",
    objection: "University started AHS recently. How can I trust a new course?",
    callerEmotion: "Skeptical",
    idealResponse: "Best of both worlds! University brings decades of credibility, infrastructure & brand — your degree carries weight. New AHS course means latest curriculum, VR labs, dual-teacher models, hospital tie-ups. Healthcare creates 1.9M jobs annually with 15-28% growth. New programs at established universities are often the most innovative.",
    keyDataPoints: "1.9M healthcare jobs/yr; 15-28% growth; University brand = degree credibility",
    dos: "Highlight university track record; Show infrastructure investment",
    donts: "Don't dismiss concern; Don't promise unverified batch data",
    difficulty: "Medium",
    followUp: "Arrange campus visit to see labs"
  },
  {
    id: 6,
    category: "Fee Objection",
    subCategory: "Fees Too High",
    objection: "Fees are ₹8 lakhs! Another college offers same for ₹5 lakhs. Why pay more?",
    callerEmotion: "Price-Sensitive",
    idealResponse: "Our grads start at ₹30K/month vs ₹15K/month from less recognized colleges. ₹15K monthly gap = ₹1.5L/year. Within 2-3 years, the extra ₹3L is recovered. After 5 years: our grads ~₹1L/month vs others ₹40-50K. Over 40-year career = crores difference. You're investing in VR labs, dual-teacher model, hospital internships, career-abroad support.",
    keyDataPoints: "₹30K/mo vs ₹15K/mo; Gap recovers in 2-3 yrs; 5-yr: ₹1L/mo vs ₹40-50K; 40-yr career = crores",
    dos: "Use ROI calculation; Compare lifetime earnings",
    donts: "Never badmouth competitors; Don't be defensive",
    difficulty: "Hard",
    followUp: "Offer fee breakdown; Discuss loan/scholarship"
  },
  {
    id: 7,
    category: "Fee Objection",
    subCategory: "Cannot Afford",
    objection: "We cannot afford this. What scholarships exist? Single-income family.",
    callerEmotion: "Anxious",
    idealResponse: "Scholarships via portal. Loan facilitation through banking partners — university provides bonafide certificate & fee breakup. Internship stipends ₹7K-15K/month. Investment recovers quickly: starting salaries ₹3-6L/year mean loan repaid within 2-3 years of working.",
    keyDataPoints: "Scholarships via portal; Loan support; Stipends ₹7K-15K/mo; Starting ₹3-6 LPA; ROI 2-3 years",
    dos: "Be empathetic; Present all financial options; Calculate EMI",
    donts: "Never make parent feel judged; Don't pressure",
    difficulty: "Hard",
    followUp: "Connect finance team; Send loan guide; Follow up 48 hrs"
  },
  {
    id: 8,
    category: "Fee Objection",
    subCategory: "Installment Concerns",
    objection: "Can we pay in installments? Lump sum too heavy.",
    callerEmotion: "Stressed",
    idealResponse: "Fee structure already has installments — typically 3/year (e.g. AMET: ₹80K + ₹50K Dec + ₹50K Mar). Seat blocking only ₹25,000. Education loans available where EMI starts post-completion at some banks. Very manageable starting amount.",
    keyDataPoints: "3 installments/yr; Seat blocking ₹25K; Loan EMI post-completion option; BDC ₹30K",
    dos: "Show exact installment schedule; Offer loan partner connection",
    donts: "Don't pressure full amount; Don't promise unofficial plans",
    difficulty: "Medium",
    followUp: "Share fee structure; Connect university finance"
  },
  {
    id: 9,
    category: "Fee Objection",
    subCategory: "Competitor Cheaper",
    objection: "XYZ college offers AHS at ₹3L total. Why is yours expensive?",
    callerEmotion: "Challenging",
    idealResponse: "At ₹3L, most colleges offer only classroom teaching with basic labs. Our program includes VR simulation labs, dual-teacher model, guaranteed hospital internships at Apollo/Manipal/Medanta, career-abroad support, and learner's kit. Graduates earn ₹25-30K/month vs ₹12-15K elsewhere. Real cost isn't fees — it's what your child earns after.",
    keyDataPoints: "VR labs; Dual-teacher; Hospital tie-ups; Learner's kit; ₹25-30K vs ₹12-15K starting",
    dos: "Acknowledge price difference; Show inclusions; Use earning projection",
    donts: "Never badmouth competitor",
    difficulty: "Hard",
    followUp: "Create side-by-side comparison; Invite to demo"
  },
  {
    id: 10,
    category: "MBBS / NEET",
    subCategory: "MBBS vs AHS",
    objection: "My child should only do MBBS. AHS is not a real career.",
    callerEmotion: "Proud / Rigid",
    idealResponse: "MBBS is great — takes 5.5+ years plus specialization (8-10 years total). AHS is 4 years, then start earning immediately — gaining 1.5-2.5 year head start. Many AHS professionals earn ₹7-10L/year by the time MBBS students still study. AHS is not alternative to MBBS — it's a parallel, powerful healthcare pathway.",
    keyDataPoints: "MBBS: 5.5+ yrs + specialization; AHS: 3-4 yrs; 1.5-2.5 yr head start; AHS ₹7-10L while MBBS studying",
    dos: "Respect MBBS aspiration; Position AHS as parallel",
    donts: "Never say MBBS is waste; Don't create parent-child conflict",
    difficulty: "Hard",
    followUp: "Share career timeline comparison"
  },
  {
    id: 11,
    category: "MBBS / NEET",
    subCategory: "NEET Drop Year",
    objection: "Scored low in NEET. Want drop year for MBBS. Why consider AHS?",
    callerEmotion: "Disappointed",
    idealResponse: "In 2025: 24L appeared for NEET, only 1.18L MBBS seats = <5% selection. Among droppers: only 30-40% secure seat next year. AHS growing 14-28% annually. Enter workforce faster, start earning ₹3-6 LPA. Can pursue PG/global careers later. AHS isn't backup — it's a smart strategic healthcare pathway.",
    keyDataPoints: "24L NEET, 1.18L seats = <5%; Droppers: 30-40% success; AHS 14-28% growth; ₹3-6 LPA entry",
    dos: "Validate feelings; Present data; Position as strategic choice",
    donts: "Don't belittle NEET; Don't call it 'backup plan'",
    difficulty: "Hard",
    followUp: "Share NEET statistics; Explore AHS specializations"
  },
  {
    id: 12,
    category: "MBBS / NEET",
    subCategory: "Govt College Wait",
    objection: "Waiting for government college seats. Fees much lower.",
    callerEmotion: "Patient",
    idealResponse: "24L+ NEET students, ~50K govt seats = <3% selection. Many govt college grads lack hands-on training. Our programs: VR labs, dual-teacher, hospital internships, career-abroad guidance. Waiting = losing entire year of learning & earnings. Over 40-year career, one year makes huge difference. Come to demo session.",
    keyDataPoints: "24L+ students; ~50K govt seats = <3%; 1 yr delay cost over 40-yr career",
    dos: "Focus on opportunity cost; Use 40-year math",
    donts: "Don't criticize govt colleges",
    difficulty: "Medium",
    followUp: "Invite to demo; Offer parallel application"
  },
  {
    id: 13,
    category: "Course Comparison",
    subCategory: "AHS vs Nursing",
    objection: "Daughter should do B.Sc. Nursing. Nursing has guaranteed jobs.",
    callerEmotion: "Traditional",
    idealResponse: "Nursing is noble. AHS offers advanced technical roles — operating MRI machines, working in OTs, running cardiac labs. WHO: 60% of global healthcare staff are AHS roles. Abroad, AHS techs earn ₹30-40 LPA vs lower for nurses unless specialized. AHS offers broader careers: research, teaching, management, entrepreneurship.",
    keyDataPoints: "WHO: 60% healthcare = AHS; Abroad: AHS ₹30-40 LPA; Broader career options",
    dos: "Respect nursing; Show AHS as complementary",
    donts: "Never disparage nursing",
    difficulty: "Medium",
    followUp: "Share career comparison chart"
  },
  {
    id: 14,
    category: "Course Comparison",
    subCategory: "AHS vs B.Pharma",
    objection: "B.Pharma seems better — pharmacy is everywhere. Why AHS?",
    callerEmotion: "Practical",
    idealResponse: "AHS = direct hospital patient care (equipment, surgery, diagnostics). Pharmacy = increasingly retail/behind-counter. Starting: AHS ₹4-6L vs Pharmacy ₹2-3L. AI may replace dispensing roles but AHS clinical roles = automation-proof. Global access easier in AHS vs strict pharmacy licensing abroad.",
    keyDataPoints: "AHS: ₹4-6L vs Pharma: ₹2-3L; AHS = hospital; Pharmacy = retail; AHS is AI-proof",
    dos: "Use salary comparison; Highlight AI-proof nature",
    donts: "Don't demean pharmacy",
    difficulty: "Medium",
    followUp: "Share salary comparison"
  },
  {
    id: 15,
    category: "Course Comparison",
    subCategory: "AHS vs BDS",
    objection: "Have BDS seat but expensive. Should I consider AHS?",
    callerEmotion: "Cost-Conscious",
    idealResponse: "BDS: ₹15-20L fees + ₹10L clinic setup. 40K BDS grads/yr competing for limited positions. AHS: ~₹8L, job-ready on graduation. 1.9M AHS jobs annually worldwide. Hospitals/diagnostics absorb AHS quickly. Better ROI for cost-conscious families.",
    keyDataPoints: "BDS: ₹15-20L + ₹10L setup; 40K BDS grads/limited jobs; AHS: ~₹8L, job-ready; 1.9M jobs worldwide",
    dos: "Use total cost including setup; Show job market data",
    donts: "Don't dismiss BDS entirely",
    difficulty: "Medium",
    followUp: "Offer ROI comparison doc"
  },
  {
    id: 16,
    category: "Course Comparison",
    subCategory: "AHS vs Biotech",
    objection: "Should I do B.Sc. Biotechnology or AHS?",
    callerEmotion: "Curious",
    idealResponse: "AHS = clinical, patient-facing, employable after UG. Biotech = research-focused, typically needs PG/PhD. Entry: AHS ₹3-6L vs Biotech ₹2-3L. Healthcare $372B vs Biotech $80B. Global mobility easier with AHS. If you love labs AND want immediate employment, AHS is stronger.",
    keyDataPoints: "AHS: clinical, employable after UG; Biotech needs PG/PhD; AHS ₹3-6L vs Biotech ₹2-3L; Healthcare $372B",
    dos: "Acknowledge science interest; Use industry size data",
    donts: "Don't dismiss biotech",
    difficulty: "Easy",
    followUp: "Show career timeline comparison"
  },
  {
    id: 17,
    category: "Course Comparison",
    subCategory: "AHS vs Agriculture",
    objection: "Father wants B.Sc. Agriculture — farming family. Why AHS?",
    callerEmotion: "Conflicted",
    idealResponse: "AHS demand is urban + global; agriculture = rural/govt-dependent. Healthcare: 1.9M jobs/yr vs limited agri positions. Starting: AHS ₹4-6L vs Agri ₹2-4L. Placements faster. Global mobility easier. Healthcare = ₹372B evergreen industry. Honor farming roots while building financial independence faster.",
    keyDataPoints: "AHS urban+global; Agri rural/govt; 1.9M healthcare jobs/yr; AHS ₹4-6L vs Agri ₹2-4L",
    dos: "Respect traditions; Use concrete numbers",
    donts: "Never disrespect agriculture/farming",
    difficulty: "Medium",
    followUp: "Show career pathway supporting family"
  },
  {
    id: 18,
    category: "Course Details",
    subCategory: "MLT Salary & Jobs",
    objection: "What salary after MLT? What kind of jobs?",
    callerEmotion: "Practical",
    idealResponse: "MLT = backbone of diagnosis. Test blood, urine, tissues. Entry (0-4 yrs) ₹3-6 LPA: Lab Technician, Phlebotomist. Mid (5-9 yrs) ₹6-10 LPA: Senior Technologist. Senior (10+ yrs) ₹10-15+ LPA: Lab Manager, QC Analyst, Lab Owner. International lab opportunities available.",
    keyDataPoints: "MLT Entry: ₹3-6L; Mid: ₹6-10L; Senior: ₹10-15L+; Lab Owner possible",
    dos: "Give specific salary ranges; Name roles; Mention lab ownership",
    donts: "Don't guarantee exact salaries",
    difficulty: "Easy",
    followUp: "Share MLT career ladder"
  },
  {
    id: 19,
    category: "Course Details",
    subCategory: "A&OTT Details",
    objection: "What does Anesthesia & OT Technology involve? Is it safe?",
    callerEmotion: "Concerned",
    idealResponse: "A&OTT: assist doctors during surgery — preparing patients/equipment, assisting anesthesia, maintaining OT. Structured, supervised environment with safety protocols. Entry (0-4 yrs) ₹3-5 LPA. Mid (5-9 yrs) ₹5-8 LPA. Senior (10+ yrs) ₹9-18+ LPA as OT Manager or Clinical Trainer. Most respected AHS role.",
    keyDataPoints: "A&OTT Entry: ₹3-5L; Mid: ₹5-8L; Senior: ₹9-18L+; OT Manager/Clinical Trainer",
    dos: "Address safety proactively; Explain structured training",
    donts: "Don't minimize seriousness; Don't exaggerate danger",
    difficulty: "Medium",
    followUp: "Share curriculum; Offer lab tour"
  },
  {
    id: 20,
    category: "Course Details",
    subCategory: "CVT Details",
    objection: "Child interested in hearts. What does CVT involve?",
    callerEmotion: "Interested",
    idealResponse: "CVT: diagnosing/treating heart & blood vessel diseases. Operate ECG, echocardiography, assist angioplasty & cardiac catheterization. Heart disease = India's #1 killer → extremely high demand, low supply. Entry ₹3-6L, Mid ₹6-8L, Senior ₹9-18+ LPA. Roles: CVT Technologist, Cath Lab Tech, Cardiac Electrophysiology Tech.",
    keyDataPoints: "CVT Entry: ₹3-6L; Mid: ₹6-8L; Senior: ₹9-18L+; Heart disease = #1 killer; High demand, low supply",
    dos: "Connect to India's heart stats; Name specific roles",
    donts: "Don't scare with disease stats",
    difficulty: "Easy",
    followUp: "Share CVT career pathway"
  },
  {
    id: 21,
    category: "Course Details",
    subCategory: "MRIT Details",
    objection: "Want to work with MRI/CT scan machines. Which course?",
    callerEmotion: "Motivated",
    idealResponse: "MRIT (Medical Radiology & Imaging Technology). Covers X-ray, CT, MRI, ultrasound, mammography. Entry (0-4 yrs) ₹3-6L: Radiology Tech/X-Ray Tech. Mid (5-9 yrs) ₹7-9L: Senior CT/MRI Technologist. Senior (10+ yrs) ₹10-20+ LPA: Radiology Manager/Imaging Head. Core to modern diagnosis, high India + global demand.",
    keyDataPoints: "MRIT Entry: ₹3-6L; Mid: ₹7-9L; Senior: ₹10-20L+; X-ray, CT, MRI, ultrasound, mammography",
    dos: "Match interest precisely; Show tech angle",
    donts: "Don't confuse with radiotherapy",
    difficulty: "Easy",
    followUp: "Share MRIT specialization details"
  },
  {
    id: 22,
    category: "Course Details",
    subCategory: "CPT Details",
    objection: "Want to be in OT during heart surgeries. Any course?",
    callerEmotion: "Excited",
    idealResponse: "Cardiac Perfusion Technology (CPT)! Operate heart-lung machine during open-heart surgery — control blood circulation & oxygen when heart/lungs temporarily stopped. Work with surgeons & anesthesiologists. Entry ₹4-7L, Mid (ECMO Specialist) ₹8-14L, Senior (Chief Perfusionist) ₹15-30+ LPA. Elite, life-saving career with few trained professionals.",
    keyDataPoints: "CPT Entry: ₹4-7L; Mid: ₹8-14L; Senior: ₹15-30L+; Heart-lung machine; Very few trained professionals",
    dos: "Match passion; Emphasize elite nature; Strong salary data",
    donts: "Don't oversimplify training; Don't create unrealistic timeline",
    difficulty: "Easy",
    followUp: "Share CPT video; Connect with CPT professional"
  },
  {
    id: 23,
    category: "Course Details",
    subCategory: "EMT Details",
    objection: "Want fast-paced career in ambulances/emergency rooms.",
    callerEmotion: "Adventurous",
    idealResponse: "EMT (Emergency Medical Technology). Respond to emergencies, first aid, CPR, stabilize patients, pre-hospital transport. First responders saving lives before hospital. Entry ₹3-6L, Mid ₹6-7.5L, Senior ₹8-15+ LPA. Post-COVID demand surged. Roles: EMT, Paramedic, Trauma Care Tech, Emergency Response Officer.",
    keyDataPoints: "EMT Entry: ₹3-6L; Mid: ₹6-7.5L; Senior: ₹8-15L+; Post-COVID surge; First responder roles",
    dos: "Validate passion; Show post-COVID demand",
    donts: "Don't romanticize stress; Don't understate physical demands",
    difficulty: "Easy",
    followUp: "Share EMT career stories"
  },
  {
    id: 24,
    category: "Course Details",
    subCategory: "MBA Healthcare",
    objection: "Want to manage hospitals, not treat patients. Any course?",
    callerEmotion: "Business-Minded",
    idealResponse: "MBA in Healthcare & Pharma Management. Hospital Administrator, Pharma Product Manager, Health Insurance Executive, Public Health Program Manager. Entry ₹4-7L, Mid ₹8-15L, Senior (Hospital Director/CEO) ₹18-40+ LPA. AMET: 2 years, ₹6L total. Fastest-growing industry with massive demand for skilled managers.",
    keyDataPoints: "MBA Entry: ₹4-7L; Mid: ₹8-15L; Senior: ₹18-40L+; 2 years; AMET: ₹6L total",
    dos: "Validate management aspiration; Show high ceiling; Connect healthcare + business",
    donts: "Don't oversell CEO as guaranteed",
    difficulty: "Easy",
    followUp: "Share MBA details; Connect alumni"
  },
  {
    id: 25,
    category: "Placement & ROI",
    subCategory: "No Track Record",
    objection: "What is your placement record? Can you guarantee a job?",
    callerEmotion: "Demanding",
    idealResponse: "Transparent: we're in our 3rd batch, no direct AHS placement record yet. But university's overall placement ecosystem is strong. Hospital tie-ups: Manipal, Apollo, Medanta. India needs ~65L AHS professionals — demand ensures qualified grads get absorbed. Internship stipends up to ₹1.5L. Visit to see hospital tie-ups firsthand.",
    keyDataPoints: "3rd batch; University ecosystem strong; Tie-ups: Manipal, Apollo, Medanta; India needs 65L AHS; Stipends ₹1.5L",
    dos: "Be honest; Highlight university ecosystem; Use demand data; Invite demo",
    donts: "Never guarantee 100% placement; Don't fabricate data",
    difficulty: "Hard",
    followUp: "Invite for demo; Share demand reports"
  },
  {
    id: 26,
    category: "Placement & ROI",
    subCategory: "Salary Too Low vs Engineering",
    objection: "₹3-6L starting too low. Engineering starts ₹8-10L.",
    callerEmotion: "Comparing",
    idealResponse: "Engineering ₹8-10L is only top 10-15% from premier institutes. Average: ₹3-4L with 60% unemployment. AHS: ₹3-6L with near-zero unemployment (demand > supply). Growth steeper: Mid ₹6-10L, Senior ₹10-20L+. International: ₹20-40L. Near-zero unemployment changes the picture completely.",
    keyDataPoints: "Engineering ₹8-10L only top 10-15%; Avg engineer: ₹3-4L, 60% unemployed; AHS: near-zero unemployment; International: ₹20-40L",
    dos: "Acknowledge comparison; Use realistic engineering data",
    donts: "Don't bash engineering; Don't exaggerate AHS",
    difficulty: "Medium",
    followUp: "Share salary progression chart"
  },
  {
    id: 27,
    category: "Placement & ROI",
    subCategory: "International Careers",
    objection: "Can my child work abroad? Which countries?",
    callerEmotion: "Aspirational",
    idealResponse: "AHS in high demand: USA, UK, Canada, Australia, Middle East. US MLT: $50-70K/yr (₹40-55L). UK: £25-40K. Career-abroad support included in program. Global healthcare worker shortage: 18M by 2030. We help with licensing, visa, job applications.",
    keyDataPoints: "US MLT: $50-70K/yr; UK: £25-40K; Global shortage: 18M by 2030; Career-abroad support included",
    dos: "Name countries + salaries; Explain licensing briefly",
    donts: "Don't guarantee foreign placement; Don't overstate ease",
    difficulty: "Medium",
    followUp: "Share international pathway; Connect career-abroad team"
  },
  {
    id: 28,
    category: "Delay / Urgency",
    subCategory: "Need Time to Think",
    objection: "Need time to think. I'll get back later.",
    callerEmotion: "Hesitant",
    idealResponse: "Respect that. One thing: 4 crore students graduate yearly, <40% employable. Last year 1 in 5 who delayed couldn't secure seats — intakes closed. Suggest attending free, no-commitment demo session first. Think of it as a test drive. Can I book a slot this weekend?",
    keyDataPoints: "4 crore grads/yr, <40% employable; 1 in 5 lost seats; Demo = free, no commitment",
    dos: "Respect need; Create gentle urgency with data; Offer demo; Book specific time",
    donts: "Never pressure or guilt-trip; Don't call aggressively",
    difficulty: "Hard",
    followUp: "Book demo; Send reminder; Follow up 48 hrs"
  },
  {
    id: 29,
    category: "Delay / Urgency",
    subCategory: "Wait for Results",
    objection: "Want to wait for board exam results first.",
    callerEmotion: "Cautious",
    idealResponse: "Seats are limited, first-come first-served. Many universities close intakes before results. Secure seat with just ₹25K blocking fee, complete formalities after results. If you wait, best universities and specializations may be gone. Early movers get first pick of hostel and scholarship slots.",
    keyDataPoints: "Seats limited; Seat blocking: ₹25K; Scholarships fill early; Complete after results",
    dos: "Validate logic; Show seat risk; Offer low-commitment blocking",
    donts: "Don't rush; Don't create fake scarcity",
    difficulty: "Medium",
    followUp: "Send seat availability; Offer provisional admission"
  },
  {
    id: 30,
    category: "Delay / Urgency",
    subCategory: "Consulting Family",
    objection: "Need to discuss with spouse/in-laws/elders.",
    callerEmotion: "Respectful",
    idealResponse: "Absolutely — family decisions should involve everyone. Can I prepare detailed info package (fees, careers, salaries, accreditations) for your family? Better yet, attend demo together. 70-75% of families who visit finalize within a week. Shall I suggest a convenient date?",
    keyDataPoints: "70-75% finalize after demo; Family info package available",
    dos: "Respect family dynamics; Support discussion; Invite whole family",
    donts: "Don't bypass family; Don't push individual decision",
    difficulty: "Medium",
    followUp: "Send family pack; Book family demo"
  },
  {
    id: 31,
    category: "Demo / Campus",
    subCategory: "Campus Too Far",
    objection: "Why travel so far for counselling? Send details online.",
    callerEmotion: "Reluctant",
    idealResponse: "Can share brochures online. But data shows: 70-75% who attend offline demo finalize within a week. Like a test drive — wouldn't buy a car without driving. Experience VR labs, dual-teacher model, meet faculty firsthand. We may have demo locations closer to you.",
    keyDataPoints: "70-75% demo conversion; Test drive analogy; Nearby demo locations possible",
    dos: "Use test drive analogy; Offer alternative locations",
    donts: "Don't minimize distance concern",
    difficulty: "Medium",
    followUp: "Send online materials; Check nearby demo schedule"
  },
  {
    id: 32,
    category: "Demo / Campus",
    subCategory: "Visited Other Colleges",
    objection: "Already visited 3-4 colleges. What's different?",
    callerEmotion: "Tired",
    idealResponse: "Appreciate your research. Our differentiators: (1) Dual-teacher model (academic + industry) — unique. (2) VR simulation labs. (3) Guaranteed tier-1 hospital internships (Apollo, Manipal, Medanta). (4) Career-abroad support built in. (5) Learner's kit with laptop. Compare these specifics at our demo.",
    keyDataPoints: "Dual-teacher (unique); VR labs; Tier-1 internships; Career-abroad; Learner's kit",
    dos: "Acknowledge effort; Give specific differentiators",
    donts: "Don't dismiss other colleges; Don't claim 'best' without specifics",
    difficulty: "Medium",
    followUp: "Send comparison matrix; Book priority demo"
  },
  {
    id: 33,
    category: "Relocation / Hostel",
    subCategory: "Relocation Fear",
    objection: "Daughter never lived away. Not comfortable with relocation.",
    callerEmotion: "Protective",
    idealResponse: "80% of relocated students get placed/abroad within 6-12 months. Builds independence, networking, confidence. Hostels: 24/7 security, wardens, meals, Wi-Fi, medical support. 90% of parents rate safety as top satisfaction. Hostel = comprehensive solution cheaper than private rentals when safety/food factored in.",
    keyDataPoints: "80% relocated students placed/abroad 6-12 months; 90% parent safety satisfaction; 24x7 security",
    dos: "Address safety first; Share testimonials; Describe hostel features",
    donts: "Never minimize concern; Always offer local alternatives",
    difficulty: "Hard",
    followUp: "Share hostel photos; Connect with hostel parents; Campus visit"
  },
  {
    id: 34,
    category: "Relocation / Hostel",
    subCategory: "Hostel Expensive",
    objection: "₹1.25L/year hostel too expensive on top of tuition.",
    callerEmotion: "Overwhelmed",
    idealResponse: "₹1.25L includes food (3 meals + snacks), accommodation, Wi-Fi, security, laundry, generator backup. Private rent: ₹8-10K/month (₹96K-1.2L) WITHOUT food/security. Add food + internet + safety = private costs more with less security. Hostel is actually cost-effective.",
    keyDataPoints: "Hostel ₹1.25L includes food/Wi-Fi/security/laundry; Private rent ₹8-10K/mo WITHOUT food; Hostel more cost-effective",
    dos: "Break down value; Compare with private accommodation",
    donts: "Don't dismiss cost; Don't make hostel mandatory",
    difficulty: "Medium",
    followUp: "Share hostel value breakdown"
  },
  {
    id: 35,
    category: "University Specific",
    subCategory: "University Ranking",
    objection: "What is university ranking? Want top-ranked only.",
    callerEmotion: "Status-Conscious",
    idealResponse: "AMET: NAAC A. AJU: NAAC A (first private in Jharkhand/Bihar/WB). Yenepoya: NAAC A+. Presidency: NAAC A. LPU: NIRF ranked. All UGC-recognized. Rankings matter, but training quality, hospital internships & placement ecosystem matter more for career — where Emversity programs excel.",
    keyDataPoints: "AMET: NAAC A; AJU: NAAC A; Yenepoya: NAAC A+; Presidency: NAAC A; LPU: NIRF ranked",
    dos: "Name specific accreditations; Balance ranking with outcomes",
    donts: "Don't claim false rankings",
    difficulty: "Medium",
    followUp: "Share accreditation docs; Offer university choices"
  },
  {
    id: 36,
    category: "University Specific",
    subCategory: "University Location",
    objection: "Any university near our city?",
    callerEmotion: "Practical",
    idealResponse: "21 partner universities across India: Chennai (AMET), Bengaluru (Yenepoya, Presidency), Jamshedpur (AJU), Delhi NCR (KRMU), Indore (Medi-Caps), Pune (ADYPU), Dehradun (DBS), Kolkata (Techno India), Punjab (LPU), Nashik (Sanjivani), Mumbai (Universal SkillTech). Which city are you nearest?",
    keyDataPoints: "21 universities; Chennai, Bangalore, Delhi NCR, Pune, Kolkata, Indore, Punjab, Mumbai, Nashik, Dehradun, Jamshedpur",
    dos: "Ask location first; Match nearest; Show map",
    donts: "Don't assume location; Don't push single university",
    difficulty: "Easy",
    followUp: "Send location map; Share nearest 2-3 university details"
  },
  {
    id: 37,
    category: "Product Routing",
    subCategory: "Non-Medical Interest",
    objection: "Commerce stream, wants hospitality management. Options?",
    callerEmotion: "Open",
    idealResponse: "For Commerce: BBA in Hospitality (3-4 yrs, entrepreneurial), B.Voc Hospitality (vocational, practical), Gateway (premium, immersive). If open to relocating: Gateway = Priority 1. If location fixed: BBA at nearby university. B.Voc if budget tight. What's preference on location?",
    keyDataPoints: "BBA: 3-4 yrs; B.Voc: vocational; Gateway: premium; Commerce eligible all three; Relocate = Gateway first",
    dos: "Ask relocation; Match product to location; Follow persona routing",
    donts: "Never pitch BSc/Cert-AHP to non-medical; Don't overwhelm with options",
    difficulty: "Medium",
    followUp: "Share relevant brochure; Book demo"
  },
  {
    id: 38,
    category: "Product Routing",
    subCategory: "Medical Aspiration",
    objection: "PCB background, wants healthcare. Best program?",
    callerEmotion: "Seeking Guidance",
    idealResponse: "For PCB + healthcare: BSc (Hons) AHS = hero product. 4-year degree with mandatory hospital internship from NAAC-accredited universities with VR labs. Questions: university nearby or open to relocate? Family comfort on fees? If both work: BSc. If affordability tough + no loan: SPRINT-AHP as faster alternative.",
    keyDataPoints: "BSc = hero product; PCB eligible; Check location + affordability; Fallback: SPRINT-AHP only if BSc doesn't fit",
    dos: "Always pitch BSc first; Ask location + affordability",
    donts: "Never start with SPRINT-AHP; Don't skip needs assessment",
    difficulty: "Medium",
    followUp: "Identify nearest university; Book demo"
  },
  {
    id: 39,
    category: "Trust & Credibility",
    subCategory: "Never Heard of Emversity",
    objection: "Who is Emversity? Never heard of you. How can I trust?",
    callerEmotion: "Suspicious",
    idealResponse: "Emversity = technology & skill integration partner for universities. 21 NAAC-accredited partner universities. We bring VR labs, dual-teacher models, industry linkages, placement support. Goal: train 100K healthcare professionals by 2030. Degree comes from the university — Emversity empowers it with world-class methodology.",
    keyDataPoints: "21 partners; NAAC-accredited; VR labs + dual-teacher; 100K by 2030; Degree from university",
    dos: "Clarify role; Name universities; Show accreditations; Be transparent",
    donts: "Don't overstate role; Don't claim Emversity grants degree; Don't be defensive",
    difficulty: "Hard",
    followUp: "Share overview; Show university agreements; Invite campus visit"
  },
  {
    id: 40,
    category: "Trust & Credibility",
    subCategory: "Mixed Online Reviews",
    objection: "Found negative reviews online. How do I know this is genuine?",
    callerEmotion: "Research-Oriented",
    idealResponse: "Appreciate thorough research. Online reviews for any institution are mixed — dissatisfied voices are louder. Recommend: visit campus, meet students, see VR labs firsthand. Ask for verifiable facts: accreditation certificates, hospital tie-up documents. 70-75% of parents who visit finalize because they see reality vs hearsay.",
    keyDataPoints: "Accreditation certs available; Hospital tie-ups verifiable; 70-75% finalize after visit",
    dos: "Acknowledge research; Don't dismiss negatives; Offer proof; Push in-person visit",
    donts: "Don't attack reviewers; Don't claim 100% positive",
    difficulty: "Hard",
    followUp: "Arrange visit; Share accreditation docs; Connect with students"
  },
  {
    id: 41,
    category: "Persona-Based",
    subCategory: "Single Mother Financial Stress",
    objection: "Single mother, two jobs. Can't take loan. Options for son?",
    callerEmotion: "Emotional",
    idealResponse: "Based on stream: PCB → SPRINT-AHP (affordable, faster healthcare). Non-PCB → B.Voc Hospitality (most affordable). Both lead to ₹3-4 LPA careers. Scholarship applications through portal. Internship stipends during course. Career begins without crushing financial burden.",
    keyDataPoints: "SPRINT-AHP for PCB+low income; B.Voc for non-medical+low income; Scholarships; Stipends; ₹3-4 LPA start",
    dos: "Show maximum empathy; Present only affordable options; Never make them feel judged",
    donts: "Never pressure for loan; Don't push premium products",
    difficulty: "Hard",
    followUp: "Connect scholarship team; Send affordable program details"
  },
  {
    id: 42,
    category: "Persona-Based",
    subCategory: "Farmer Family Rural",
    objection: "We are farmers from village. Is this for city people? Will child adjust?",
    callerEmotion: "Humble",
    idealResponse: "Not at all! Healthcare needs all backgrounds. Many best health workers come from rural families. Hostels designed for smooth transition — meals, wardens, mentoring. Starting salary ₹3-6 LPA means supporting family within 4 years. Healthcare is an equalizer — background doesn't limit future.",
    keyDataPoints: "Healthcare needs rural representation; Hostel support; ₹3-6 LPA; Family support in 4 years",
    dos: "Show deep respect; Address adjustment; Highlight independence; Use local language",
    donts: "Never patronize; Don't use complex jargon",
    difficulty: "Hard",
    followUp: "Use local language; Connect rural alumni; Arrange comfort visit"
  },
  {
    id: 43,
    category: "Persona-Based",
    subCategory: "Wealthy Business Family",
    objection: "Can afford any college. Why your program over prestigious medical college?",
    callerEmotion: "Affluent",
    idealResponse: "Focus on quality: VR simulation labs (practice before real patients), dual-teacher model (academic + industry expertise), guaranteed tier-1 hospital internships (Apollo, Manipal), career-abroad support. BSc Hons from NAAC A/A+ universities is globally recognized. Best investment = practical exposure — our core strength.",
    keyDataPoints: "VR labs unique; Dual-teacher exclusive; Tier-1 internships; Career-abroad; NAAC A/A+",
    dos: "Focus on quality not price; Highlight unique features; Use prestige language",
    donts: "Don't focus on affordability; Don't be apologetic about fees",
    difficulty: "Medium",
    followUp: "Offer VIP campus tour; Connect with university leadership"
  },
  {
    id: 44,
    category: "Persona-Based",
    subCategory: "Govt Employee Benefits",
    objection: "Work in government. Can I use employee benefits for admission?",
    callerEmotion: "Informed",
    idealResponse: "Many govt employee welfare schemes provide subsidized education loans. Banks offer preferential rates for govt employees. Post-matric state scholarships can apply to UGC-recognized programs like ours. University provides all documentation needed. Can help identify which benefits apply to your specific department.",
    keyDataPoints: "Govt welfare schemes; Subsidized loan rates; Post-matric scholarships; University provides docs",
    dos: "Show awareness of govt benefits; Help identify schemes",
    donts: "Don't promise specific benefits without verification",
    difficulty: "Medium",
    followUp: "Research applicable schemes; Connect loan partner"
  },
  {
    id: 45,
    category: "Persona-Based",
    subCategory: "NRI / Gulf Returnee",
    objection: "Returned from Dubai. Is degree valid internationally?",
    callerEmotion: "Global Mindset",
    idealResponse: "BSc Hons from UGC-recognized universities = international validity. AHS in demand: Middle East, USA, UK, Canada, Australia. Career-abroad support for licensing and applications. English-medium instruction suits international school background. Perfect bridge between international experience and India's healthcare boom.",
    keyDataPoints: "UGC = international validity; AHS demand globally; Career-abroad support; English-medium",
    dos: "Acknowledge international perspective; Emphasize global validity",
    donts: "Don't be parochial; Don't undersell international angle",
    difficulty: "Medium",
    followUp: "Share international pathway; Connect career-abroad team"
  },
  {
    id: 46,
    category: "Demo Urgency",
    subCategory: "Limited Seats",
    objection: "Student interested but no hurry. Create urgency for demo.",
    callerEmotion: "Casual",
    idealResponse: "Universities have limited AHS seats (AMET: 240 BSc). Last year seats filled 6 weeks before deadline. This weekend's demo: 20 spots, free, no obligation. Students who attend demos are 3x more likely to get preferred specialization. Shall I reserve a spot?",
    keyDataPoints: "AMET: 240 seats; Filled 6 wks early; Demo: 20 spots, free; 3x preferred spec chance",
    dos: "Use real scarcity; Offer specific numbers; Low-commitment demo; Ask specific time",
    donts: "Don't create fake urgency; Don't pressure aggressively",
    difficulty: "Medium",
    followUp: "Book demo immediately; Send calendar invite; Remind 24hrs"
  },
  {
    id: 47,
    category: "Demo Urgency",
    subCategory: "Scholarship Deadline",
    objection: "Use scholarship deadline to drive demo attendance.",
    callerEmotion: "Undecided",
    idealResponse: "Scholarship applications close soon — first-come, first-served. Demo attendees get priority counselling and application support. Early applicants received up to ₹50K-1L support. This Saturday's demo includes dedicated scholarship guidance. Can I confirm your slot?",
    keyDataPoints: "Scholarships close soon; First-come first-served; Demo = priority counselling; Up to ₹50K-1L",
    dos: "Connect demo to scholarship benefit; Use real deadlines",
    donts: "Don't fabricate amounts; Don't guarantee scholarship",
    difficulty: "Medium",
    followUp: "Confirm demo; Send scholarship link; Pre-screen eligibility"
  },
  {
    id: 48,
    category: "Demo Urgency",
    subCategory: "Batch Starting Soon",
    objection: "Academic session starts soon. Delay = gap year.",
    callerEmotion: "Procrastinating",
    idealResponse: "Session starts July/August. Admission process: 3-4 weeks (demo, documentation, seat blocking, bridge course). Waiting till June = very little margin. Gap year costs ₹6-10L in lost first-year earnings over 40-year career. Demo this Saturday: 2 hours, free, complete clarity. Lock it in?",
    keyDataPoints: "Session: July/Aug; Process: 3-4 weeks; Gap year: ₹6-10L lost; Demo: 2 hrs, free",
    dos: "Use career math for gap year cost; Make demo easy/low-risk",
    donts: "Don't threaten; Don't exaggerate timelines",
    difficulty: "Medium",
    followUp: "Book demo; Send session dates; Create follow-up schedule"
  },
  {
    id: 49,
    category: "Emotional / Trust",
    subCategory: "Child Not Studious",
    objection: "Child doesn't study much. Will they manage 4-year healthcare course?",
    callerEmotion: "Worried",
    idealResponse: "Many students who struggle in classrooms thrive in healthcare because learning is hands-on. Dual-teacher model: theory + real hospital exposure + VR simulations + clinical practice. Not just textbooks — it's doing. Many 'average' students find passion with patients and equipment. Would you like to bring your child to see the labs?",
    keyDataPoints: "Hands-on learning; Dual-teacher; VR simulations; Average students thrive in practical courses",
    dos: "Validate concern; Reframe as different learning style; Invite for lab experience",
    donts: "Never label the child; Don't promise transformation",
    difficulty: "Hard",
    followUp: "Invite student for lab visit; Connect faculty mentor"
  },
  {
    id: 50,
    category: "Emotional / Trust",
    subCategory: "Child Wants Engineering",
    objection: "Child wants engineering but we think healthcare better. Convince them?",
    callerEmotion: "Conflicted",
    idealResponse: "Rather than convincing, bring child to demo. Let them experience VR labs, OT simulations, cardiac monitoring tech. Healthcare today IS technology — MRI, robotic surgery, AI diagnostics. Many engineering-minded students love healthcare tech. Choice should be theirs — informed, not pressured. If after demo they still prefer engineering, that's fine.",
    keyDataPoints: "Healthcare = technology-heavy; MRI, robotics, AI diagnostics; Demo changes perspective; Choice = student's",
    dos: "Support family harmony; Show tech angle; Make it student's discovery",
    donts: "Never take sides; Don't force healthcare; Don't create conflict",
    difficulty: "Hard",
    followUp: "Book demo for student; Show tech focus; Respect autonomy"
  }
];
