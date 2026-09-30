import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  AudioLines,
  Award,
  Bot,
  BrainCircuit,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Database,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Globe2,
  HelpCircle,
  Info,
  Layers,
  Lightbulb,
  MapPin,
  MessageSquare,
  Mic,
  MicOff,
  Radio,
  RefreshCw,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { askGeminiCivicAssistant } from './lib/gemini';
import { CivicMapDashboard } from './components/CivicMapDashboard';

// --- TYPES ---
interface CitizenSignal {
  id: string;
  originalQuote: string;
  summary: string;
  language: string;
  channel: 'Voice Note' | 'WhatsApp / SMS' | 'Community Portal';
  location: string;
  theme: 'Water Access' | 'Public Safety' | 'Roads & Transit' | 'Healthcare' | 'Sanitation';
  timestamp: string;
  urgency: 'High' | 'Medium' | 'Critical';
  status: 'Structured' | 'Under Review' | 'Triaged';
}

interface CivicHotspot {
  id: string;
  place: string;
  district: string;
  theme: string;
  signalCount: number;
  changeRate: string;
  primaryNeed: string;
  urgency: 'Critical' | 'High' | 'Medium';
  sentiment: string;
}

interface PolicyRecommendation {
  id: string;
  title: string;
  location: string;
  theme: string;
  confidenceScore: number;
  estimatedBudget: string;
  signalBasis: string;
  sourcesCount: number;
  status: 'Pending Human Sign-Off' | 'Field Visit Scheduled' | 'Approved for Budgeting';
  criteriaBreakdown: {
    demandConcentration: number;
    sourceDiversity: number;
    urgencyPattern: number;
    feasibility: number;
  };
}

// --- INITIAL SEED DATA ---
const INITIAL_SIGNALS: CitizenSignal[] = [
  {
    id: 'SIG-2048',
    originalQuote: 'हमारे गांव में पानी का टैंकर हफ्ते में सिर्फ एक बार आता है। बच्चे स्कूल जाने से पहले पानी भरने के लिए 3 घंटे लाइन में खड़े रहते हैं।',
    summary: 'Reliable drinking water supply augmentation needed for Kalyanpur hamlet',
    language: 'Hindi (हिंदी)',
    channel: 'Voice Note',
    location: 'Kalyanpur, Rajasthan',
    theme: 'Water Access',
    timestamp: '10 min ago',
    urgency: 'High',
    status: 'Structured',
  },
  {
    id: 'SIG-2047',
    originalQuote: 'The main bus shelter near Bassi market has zero lighting. Women workers wait here in complete darkness after 7 PM.',
    summary: 'Decentralized solar illumination required along Bassi bus junction corridor',
    language: 'English',
    channel: 'WhatsApp / SMS',
    location: 'Bassi, Jaipur',
    theme: 'Public Safety',
    timestamp: '25 min ago',
    urgency: 'High',
    status: 'Under Review',
  },
  {
    id: 'SIG-2046',
    originalQuote: 'আমাদের পাড়ায় স্বাস্থ্যকেন্দ্র অনেক দূরে। জরুরি অবস্থায় কোনো অ্যাম্বুলেন্স সহজে আসতে পারে না।',
    summary: 'Primary healthcare transit gap & emergency triage access in Ward 14',
    language: 'Bengali (বাংলা)',
    channel: 'Voice Note',
    location: 'Malda, West Bengal',
    theme: 'Healthcare',
    timestamp: '42 min ago',
    urgency: 'Critical',
    status: 'Structured',
  },
  {
    id: 'SIG-2045',
    originalQuote: 'हमारे स्कूल तक जाने वाली सड़क बारिश में पूरी तरह बह जाती है। बच्चे 2 महीने से स्कूल नहीं जा पा रहे।',
    summary: 'All-weather road elevation & culvert installation on primary school route',
    language: 'Hindi (हिंदी)',
    channel: 'Voice Note',
    location: 'Dausa District, Rajasthan',
    theme: 'Roads & Transit',
    timestamp: '1 hr ago',
    urgency: 'High',
    status: 'Triaged',
  },
  {
    id: 'SIG-2044',
    originalQuote: 'मुख्य नाल्या तुंबल्यामुळे सांडपाणी रस्त्यावर येत आहे. डेंग्यूची भीती निर्माण झाली आहे.',
    summary: 'Stormwater drainage unblocking & disinfection required to prevent vector outbreak',
    language: 'Marathi (मराठी)',
    channel: 'Community Portal',
    location: 'Vidisha Sector 3',
    theme: 'Sanitation',
    timestamp: '2 hrs ago',
    urgency: 'Medium',
    status: 'Structured',
  },
];

const INITIAL_HOTSPOTS: CivicHotspot[] = [
  {
    id: 'HOT-101',
    place: 'Kalyanpur Hamlet',
    district: 'Jaipur Rural',
    theme: 'Water Access',
    signalCount: 1284,
    changeRate: '+18% this month',
    primaryNeed: 'Sub-surface piped community water points & filtration unit',
    urgency: 'High',
    sentiment: '94% urgent distress',
  },
  {
    id: 'HOT-102',
    place: 'Bassi Transit Junction',
    district: 'Jaipur East',
    theme: 'Public Safety',
    signalCount: 842,
    changeRate: '+11% this month',
    primaryNeed: 'Solar high-mast illumination & emergency surveillance call point',
    urgency: 'High',
    sentiment: '88% female commuter concern',
  },
  {
    id: 'HOT-103',
    place: 'Dausa School Corridor',
    district: 'Dausa District',
    theme: 'Roads & Transit',
    signalCount: 617,
    changeRate: '+24% monsoon surge',
    primaryNeed: 'Raised bituminous surfacing with 2 concrete box-culverts',
    urgency: 'Critical',
    sentiment: '91% parent & teacher reports',
  },
];

const INITIAL_RECOMMENDATIONS: PolicyRecommendation[] = [
  {
    id: 'REC-31',
    title: 'Deploy 3 Decentralised Community Solar Water Points in Kalyanpur',
    location: 'Kalyanpur, Rajasthan',
    theme: 'Water Access',
    confidenceScore: 87,
    estimatedBudget: '₹18.6 Lakh',
    signalBasis: '1,284 citizen signals across 4 local source channels',
    sourcesCount: 4,
    status: 'Pending Human Sign-Off',
    criteriaBreakdown: {
      demandConcentration: 92,
      sourceDiversity: 88,
      urgencyPattern: 85,
      feasibility: 83,
    },
  },
  {
    id: 'REC-29',
    title: 'Solar Lighting Corridor along Bassi Bus Junction Perimeter',
    location: 'Bassi, Jaipur',
    theme: 'Public Safety',
    confidenceScore: 82,
    estimatedBudget: '₹7.4 Lakh',
    signalBasis: '842 citizen signals validated via commuter SMS & audio notes',
    sourcesCount: 3,
    status: 'Pending Human Sign-Off',
    criteriaBreakdown: {
      demandConcentration: 85,
      sourceDiversity: 80,
      urgencyPattern: 82,
      feasibility: 81,
    },
  },
  {
    id: 'REC-24',
    title: 'Raise Elevation & Build Culvert Drainage for Dausa School Access Road',
    location: 'Dausa District, Rajasthan',
    theme: 'Roads & Transit',
    confidenceScore: 78,
    estimatedBudget: '₹31.2 Lakh',
    signalBasis: '617 verified reports detailing monsoon school transit cutoff',
    sourcesCount: 3,
    status: 'Field Visit Scheduled',
    criteriaBreakdown: {
      demandConcentration: 80,
      sourceDiversity: 74,
      urgencyPattern: 88,
      feasibility: 70,
    },
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'control-room' | 'national-map' | 'intake' | 'evidence' | 'recommendations' | 'ask-ai' | 'governance'
  >('control-room');
  const [darkMode, setDarkMode] = useState(true);

  // Signals and state
  const [signals, setSignals] = useState<CitizenSignal[]>(INITIAL_SIGNALS);
  const [recommendations, setRecommendations] = useState<PolicyRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [selectedHotspot, setSelectedHotspot] = useState<CivicHotspot | null>(INITIAL_HOTSPOTS[0]);

  // Citizen Intake Form State
  const [intakeText, setIntakeText] = useState('');
  const [intakeLang, setIntakeLang] = useState('Hindi (हिंदी)');
  const [intakeChannel, setIntakeChannel] = useState<'Voice Note' | 'WhatsApp / SMS' | 'Community Portal'>('Voice Note');
  const [intakeLocation, setIntakeLocation] = useState('Jaipur District');
  const [isSimulatingAudio, setIsSimulatingAudio] = useState(false);
  const [intakeSubmitted, setIntakeSubmitted] = useState(false);

  // Chat State
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    {
      role: 'model',
      text: 'Namaste! I am Civics Plus, your explainable civic intelligence assistant. Ask me about public infrastructure schemes, grievance pathways (such as Jal Jeevan Mission, PMGSY, or Solar Lighting), or how your community can aggregate signals into verified civic action.',
    },
  ]);
  const [userQuery, setUserQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatLang, setChatLang] = useState<'English' | 'Hindi' | 'Hinglish'>('English');

  // Filter state for Evidence Library
  const [evidenceFilter, setEvidenceFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Citizen Intake Submission
  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intakeText.trim()) return;

    // AI Semantic Structuring heuristic simulation
    let theme: CitizenSignal['theme'] = 'Water Access';
    let urgency: CitizenSignal['urgency'] = 'High';
    const lower = intakeText.toLowerCase();

    if (lower.includes('road') || lower.includes('सड़क') || lower.includes('गड्ढा') || lower.includes('culvert')) {
      theme = 'Roads & Transit';
    } else if (lower.includes('light') || lower.includes('safety') || lower.includes('अंधेरा') || lower.includes('रात')) {
      theme = 'Public Safety';
    } else if (lower.includes('health') || lower.includes('doctor') || lower.includes('अस्पताल') || lower.includes('दवा')) {
      theme = 'Healthcare';
    } else if (lower.includes('drain') || lower.includes('कचरा') || lower.includes('सफाई') || lower.includes('नाली')) {
      theme = 'Sanitation';
    }

    if (lower.includes('urgent') || lower.includes('तुरंत') || lower.includes('emergency') || lower.includes('जान')) {
      urgency = 'Critical';
    }

    const newSignal: CitizenSignal = {
      id: `SIG-${Math.floor(2050 + Math.random() * 500)}`,
      originalQuote: intakeText,
      summary: `Automated Gemini structure: Citizen requested intervention for ${theme.toLowerCase()} in ${intakeLocation}`,
      language: intakeLang,
      channel: intakeChannel,
      location: intakeLocation,
      theme,
      timestamp: 'Just now',
      urgency,
      status: 'Structured',
    };

    setSignals([newSignal, ...signals]);
    setIntakeSubmitted(true);
    setTimeout(() => {
      setIntakeSubmitted(false);
      setIntakeText('');
    }, 3000);
  };

  // Handle Human-in-the-Loop decision
  const handleApproveRec = (recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === recId
          ? {
              ...r,
              status:
                r.status === 'Pending Human Sign-Off'
                  ? 'Field Visit Scheduled'
                  : r.status === 'Field Visit Scheduled'
                  ? 'Approved for Budgeting'
                  : 'Approved for Budgeting',
            }
          : r
      )
    );
  };

  // Handle Ask Civics Plus
  const handleSendChat = async (presetPrompt?: string) => {
    const textToSend = presetPrompt || userQuery;
    if (!textToSend.trim() || chatLoading) return;

    setUserQuery('');
    const updatedHistory = [...chatHistory, { role: 'user' as const, text: textToSend }];
    setChatHistory(updatedHistory);
    setChatLoading(true);

    try {
      const response = await askGeminiCivicAssistant(textToSend, chatLang);
      setChatHistory([...updatedHistory, { role: 'model', text: response }]);
    } catch {
      setChatHistory([
        ...updatedHistory,
        {
          role: 'model',
          text: 'Civics Plus encountered a momentary network timeout. Please verify your connection or retry.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Filtered signals
  const filteredSignals = signals.filter((s) => {
    const matchesFilter = evidenceFilter === 'All' || s.theme === evidenceFilter;
    const matchesSearch =
      s.originalQuote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-[#EA580C] selection:text-white transition-colors duration-200 ${darkMode ? 'bg-[#0B1120] text-slate-100' : 'bg-[#F8FAFC] text-[#0F172A]'}`}>
      {/* Top Banner / Hackathon Compliance Ribbon */}
      <div className="bg-[#0B2545] text-white px-4 py-2 border-b border-[#1E3A8A]/40 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded font-bold bg-[#EA580C] text-white text-[10px] tracking-wider uppercase">
            Official Hackathon Entry
          </span>
          <span className="font-medium text-slate-200">
            Code for Communities Hackathon • <strong className="text-white">Track: Cooperation</strong>
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Powered by Google Gemini 2.5 Flash
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">Digital Public Good (DPG) Prototype</span>
        </div>
      </div>

      {/* Main Brand Header & Navigation Bar */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-xs transition-colors duration-200 ${darkMode ? 'bg-[#0F172A]/95 border-[#1E293B]' : 'bg-white/95 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0B2545] to-[#134074] flex items-center justify-center text-white shadow-sm border border-[#1E3A8A]/30">
                <Building2 className="h-5 w-5 text-[#EA580C]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-[#0B2545]">
                    Civics <span className="text-[#EA580C]">Plus</span>
                  </span>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                    v2.5
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                  From Citizen Voice to Actionable Civic Insights.
                </p>
              </div>
            </div>

            {/* Nav Tabs */}
            <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
              {[
                { id: 'control-room', label: 'Control Room', icon: Activity },
                { id: 'national-map', label: 'India Map & Analytics', icon: Globe2 },
                { id: 'intake', label: 'Citizen Intake', icon: Mic },
                { id: 'evidence', label: 'Evidence Library', icon: Database },
                { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
                { id: 'ask-ai', label: 'Ask Civics Plus', icon: Bot },
                { id: 'governance', label: 'Governance & DPG', icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]'
                        : darkMode
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ========================================================================= */}
        {/* 1. CONTROL ROOM TAB */}
        {/* ========================================================================= */}
        {activeTab === 'control-room' && (
          <div className="space-y-6">
            {/* Holographic Cyber-Civic Hero Deck */}
            <div className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 transition-all ${darkMode ? 'bg-gradient-to-br from-[#0B152B] via-[#0E1D3A] to-[#162B50] border border-orange-500/30 shadow-[0_0_40px_rgba(234,88,12,0.15)] text-white' : 'bg-gradient-to-r from-[#0B2545] via-[#134074] to-[#1D4E89] text-white shadow-md'}`}>
              {/* Background Cyber Grid Accent */}
              <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-orange-200 backdrop-blur-md shadow-xs">
                    <span className="h-2 w-2 rounded-full bg-[#EA580C] animate-ping"></span>
                    AI-Powered Participatory Civic Prioritization
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                    From Citizen Voice to Actionable Civic Insights.
                  </h1>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Civics Plus captures unstructured citizen voice notes and messages in local dialects,
                    synthesizes geographic demand hotspots, and drafts explainable infrastructure work proposals with
                    mandatory human review.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('intake')}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#F97316] hover:to-[#EA580C] text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(234,88,12,0.5)] transition-all active:scale-95 cursor-pointer"
                    >
                      <Mic className="h-4 w-4" />
                      Simulate Citizen Voice Intake
                    </button>
                    <button
                      onClick={() => setActiveTab('national-map')}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-bold border border-cyan-500/40 transition-all backdrop-blur-md cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    >
                      <Globe2 className="h-4 w-4" />
                      Explore India Map &amp; Charts
                    </button>
                    <button
                      onClick={() => setActiveTab('recommendations')}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition-all backdrop-blur-md cursor-pointer"
                    >
                      <Eye className="h-4 w-4 text-emerald-400" />
                      Review 3 Policy Proposals
                    </button>
                  </div>
                </div>

                {/* Animated Holographic Circular Radar HUD */}
                <div className="hidden lg:flex flex-col items-center justify-center p-6 rounded-2xl bg-black/50 border border-orange-500/40 relative overflow-hidden shrink-0 w-72 shadow-[0_0_35px_rgba(234,88,12,0.25)]">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* Concentric rings */}
                    <div className="absolute inset-0 rounded-full border border-orange-500/20"></div>
                    <div className="absolute inset-4 rounded-full border border-orange-500/30"></div>
                    <div className="absolute inset-8 rounded-full border border-orange-500/40"></div>
                    {/* Radar Crosshairs */}
                    <div className="absolute inset-x-0 top-1/2 h-[1px] bg-orange-500/30"></div>
                    <div className="absolute inset-y-0 left-1/2 w-[1px] bg-orange-500/30"></div>
                    {/* Radar Sweep Needle */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'conic-gradient(from 0deg, transparent 270deg, rgba(234, 88, 12, 0.45) 360deg)',
                        animation: 'radarSweep 2.5s linear infinite',
                      }}
                    ></div>
                    {/* Center Core */}
                    <div className="h-3.5 w-3.5 rounded-full bg-[#EA580C] shadow-[0_0_15px_#EA580C] animate-ping"></div>
                    {/* Radar Target Blips */}
                    <div className="absolute top-8 right-10 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399] animate-pulse"></div>
                    <div className="absolute bottom-10 left-8 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE] animate-pulse"></div>
                  </div>
                  <div className="mt-4 flex flex-col items-center gap-1 font-mono text-[11px] text-orange-400">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>ACTIVE RADAR: 36 STATES</span>
                    </div>
                    <span className="text-[10px] text-slate-400">0 AUDIT DEFICITS • 100% EXPLAINABLE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key KPI Metrics Grid (Cyber-Styled) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: 'Citizen Signals Captured',
                  value: '2,743',
                  change: '+24% this week',
                  icon: Users,
                  color: 'text-cyan-400',
                  accent: 'border-cyan-500/30',
                },
                {
                  label: 'Vernacular Dialects Supported',
                  value: '18 Languages',
                  change: 'Preserves original voice',
                  icon: Globe2,
                  color: 'text-emerald-400',
                  accent: 'border-emerald-500/30',
                },
                {
                  label: 'Clustered Hotspots',
                  value: '14 Active',
                  change: 'Zero isolated complaints',
                  icon: Compass,
                  color: 'text-orange-400',
                  accent: 'border-orange-500/30',
                },
                {
                  label: 'Decisions with Human Sign-Off',
                  value: '100% Gate',
                  change: 'No autonomous spending',
                  icon: ShieldCheck,
                  color: 'text-amber-400',
                  accent: 'border-amber-500/30',
                },
              ].map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-xl border transition-all ${darkMode ? 'bg-[#0B1325]/90 border-slate-800 hover:border-orange-500/60 shadow-lg hover:shadow-[0_0_20px_rgba(234,88,12,0.2)]' : 'bg-white border-slate-200 shadow-xs'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{kpi.label}</span>
                      <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800/80' : 'bg-slate-100'} ${kpi.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <div className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{kpi.value}</div>
                    <div className="mt-1 text-xs font-medium text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {kpi.change}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Split Section: Geographic Hotspots & Live Signals Pulse */}
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left Column: Geographic Demand Hotspots */}
              <div className={`lg:col-span-7 p-6 rounded-2xl border transition-all ${darkMode ? 'bg-[#0B1325]/90 border-slate-800 shadow-xl text-white' : 'bg-white border-slate-200 shadow-xs text-slate-900'} space-y-4`}>
                <div className={`flex items-center justify-between border-b pb-4 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div>
                    <h2 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      <MapPin className="h-5 w-5 text-[#EA580C]" />
                      Synthesized Civic Demand Hotspots
                    </h2>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Isolated citizen grievances clustered into actionable spatial infrastructure priorities.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/20 text-[#EA580C] border border-orange-500/30">
                    3 High Priority
                  </span>
                </div>

                <div className="space-y-3">
                  {INITIAL_HOTSPOTS.map((hotspot) => {
                    const isSelected = selectedHotspot?.id === hotspot.id;
                    return (
                      <div
                        key={hotspot.id}
                        onClick={() => setSelectedHotspot(hotspot)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#EA580C] bg-[#EA580C]/10 shadow-[0_0_15px_rgba(234,88,12,0.25)]'
                            : (darkMode ? 'border-slate-800 hover:border-orange-500/40 bg-slate-900/60' : 'border-slate-200 hover:border-slate-300 bg-white')
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>{hotspot.place}</h3>
                              <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>({hotspot.district})</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                                {hotspot.theme}
                              </span>
                            </div>
                            <p className={`mt-1 text-xs font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{hotspot.primaryNeed}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`text-base font-extrabold ${darkMode ? 'text-orange-400' : 'text-[#0B2545]'}`}>
                              {hotspot.signalCount}
                            </span>
                            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                              Signals
                            </span>
                          </div>
                        </div>

                        <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                          <span className="font-semibold text-emerald-400">{hotspot.changeRate}</span>
                          <span>Sentiment: {hotspot.sentiment}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Hotspot Deep Dive */}
                {selectedHotspot && (
                  <div className={`mt-4 p-4 rounded-xl border text-xs space-y-2 ${darkMode ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    <div className="flex items-center justify-between font-bold">
                      <span className={darkMode ? 'text-slate-200' : 'text-slate-700'}>Detailed Hotspot Breakdown: {selectedHotspot.place}</span>
                      <span className="text-[#EA580C]">Action Ready</span>
                    </div>
                    <p>
                      <strong>AI Synthesis:</strong> Instead of treating 1,280+ voice notes as distinct grievances,
                      Gemini clusters them by GPS cluster proximity and entity co-occurrence, generating an explainable
                      engineering estimate for public planners.
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Live Ingestion Pulse */}
              <div className={`lg:col-span-5 p-6 rounded-2xl border transition-all ${darkMode ? 'bg-[#0B1325]/90 border-slate-800 shadow-xl text-white' : 'bg-white border-slate-200 shadow-xs text-slate-900'} space-y-4`}>
                <div className={`flex items-center justify-between border-b pb-4 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Live Intake Pulse</h2>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">● LIVE_FEED</span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
                  {signals.slice(0, 4).map((s) => (
                    <div key={s.id} className={`p-3.5 rounded-xl border space-y-2 ${darkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50/60'}`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-orange-400">{s.id}</span>
                        <span className="text-slate-400">{s.timestamp}</span>
                      </div>
                      <p className={`text-xs italic border-l-2 border-[#EA580C] pl-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        "{s.originalQuote}"
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-semibold border border-blue-500/30">
                          {s.language}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                          {s.channel}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                          {s.theme}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab('evidence')}
                  className={`w-full py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${darkMode ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}
                >
                  View All Signals in Evidence Library
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* National India Geospatial Map & Full Analytics Dashboard */}
            <div className="pt-2">
              <CivicMapDashboard darkMode={darkMode} />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* NATIONAL INDIA MAP & ANALYTICS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'national-map' && (
          <div className="space-y-6">
            <CivicMapDashboard darkMode={darkMode} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. CITIZEN INTAKE TAB */}
        {/* ========================================================================= */}
        {activeTab === 'intake' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono">
                [LIVE_INGESTION_TERMINAL] • LANGUAGE-FIRST ONBOARDING
              </span>
              <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Make Every Community Voice Visible.
              </h2>
              <p className={`text-sm max-w-xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Citizens submit in whatever dialect or channel they have (voice note, SMS, or text).
                Civics Plus preserves the exact original voice while structuring it for district planners.
              </p>
            </div>

            {/* Quick Demo Pre-fills */}
            <div className={`p-4 rounded-xl border space-y-2.5 transition-all ${darkMode ? 'bg-[#0B1325]/90 border-slate-800 text-slate-200 shadow-lg' : 'bg-slate-100/80 border-slate-200 text-slate-700'}`}>
              <span className="text-xs font-bold flex items-center gap-1.5 text-orange-400">
                <Sparkles className="h-3.5 w-3.5" />
                Select a sample citizen voice transmission to simulate:
              </span>
              <div className="grid sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIntakeText(
                      'हमारे गांव में पीने का पानी 4 दिन में एक बार आता है। टैंकर का पानी भी गंदा है और बच्चे बीमार हो रहे हैं।'
                    );
                    setIntakeLang('Hindi (हिंदी)');
                    setIntakeChannel('Voice Note');
                    setIntakeLocation('Kalyanpur, Rajasthan');
                  }}
                  className={`text-left p-3 rounded-xl border transition-all font-medium cursor-pointer ${darkMode ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-orange-500/50 text-slate-200' : 'bg-white hover:bg-orange-50/60 border-slate-200 text-slate-700'}`}
                >
                  💧 <strong className="text-orange-400">Hindi Voice:</strong> Drinking water shortage in Kalyanpur
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIntakeText(
                      'The bus terminal has no street lighting. Women commuters feel unsafe walking to the junction after 8 PM.'
                    );
                    setIntakeLang('English');
                    setIntakeChannel('WhatsApp / SMS');
                    setIntakeLocation('Bassi, Jaipur');
                  }}
                  className={`text-left p-3 rounded-xl border transition-all font-medium cursor-pointer ${darkMode ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-orange-500/50 text-slate-200' : 'bg-white hover:bg-orange-50/60 border-slate-200 text-slate-700'}`}
                >
                  💡 <strong className="text-cyan-400">English SMS:</strong> Unlit bus terminal commuter safety
                </button>
              </div>
            </div>

            {/* Intake Form */}
            <form onSubmit={handleIntakeSubmit} className={`p-6 sm:p-8 rounded-2xl border transition-all space-y-5 ${darkMode ? 'bg-[#0B1325]/90 border-slate-800 shadow-2xl text-white' : 'bg-white border-slate-200 shadow-sm text-slate-900'}`}>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Original Dialect / Language
                  </label>
                  <select
                    value={intakeLang}
                    onChange={(e) => setIntakeLang(e.target.value)}
                    className={`w-full text-xs font-medium px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#EA580C] ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  >
                    <option>Hindi (हिंदी)</option>
                    <option>Bengali (বাংলা)</option>
                    <option>Marathi (मराठी)</option>
                    <option>Tamil (தமிழ்)</option>
                    <option>Telugu (తెలుగు)</option>
                    <option>English</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Capture Channel
                  </label>
                  <select
                    value={intakeChannel}
                    onChange={(e) => setIntakeChannel(e.target.value as any)}
                    className={`w-full text-xs font-medium px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#EA580C] ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  >
                    <option>Voice Note</option>
                    <option>WhatsApp / SMS</option>
                    <option>Community Portal</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Village / Block Location
                  </label>
                  <input
                    type="text"
                    value={intakeLocation}
                    onChange={(e) => setIntakeLocation(e.target.value)}
                    placeholder="e.g. Bassi, Jaipur"
                    className={`w-full text-xs font-medium px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#EA580C] ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`block text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Citizen Speech / Natural Message
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSimulatingAudio(!isSimulatingAudio);
                      if (!isSimulatingAudio) {
                        setIntakeText('गाँव के प्राथमिक स्वास्थ्य केंद्र में डॉक्टर हफ़्ते में सिर्फ एक दिन आते हैं।');
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      isSimulatingAudio
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                        : (darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                    }`}
                  >
                    {isSimulatingAudio ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5 text-[#EA580C]" />}
                    {isSimulatingAudio ? 'Simulating Acoustic Input...' : 'Simulate Audio Recording'}
                  </button>
                </div>

                {/* 24-Band Neon Audio Spectrum Equalizer */}
                {(intakeChannel === 'Voice Note' || isSimulatingAudio) && (
                  <div className={`p-4 rounded-xl border mb-3 space-y-2 ${darkMode ? 'bg-black/60 border-orange-500/30 shadow-[0_0_20px_rgba(234,88,12,0.15)]' : 'bg-orange-50/80 border-orange-200/80'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="text-[11px] font-bold text-orange-400 font-mono">
                          {isSimulatingAudio ? 'ACOUSTIC_STREAM_LIVE • 16kHz HD RECORDING' : 'AUDIO_SENSOR_READY • SUPPORTS 18 VERNACULAR DIALECTS'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40">
                        SPECTRUM_LEVEL: -14dB
                      </span>
                    </div>

                    <div className="flex items-end gap-1 h-9 pt-2">
                      {[12, 28, 16, 32, 22, 14, 30, 26, 18, 34, 24, 16, 30, 20, 34, 14, 28, 22, 32, 18, 26, 12, 30, 16].map((h, i) => (
                        <span
                          key={i}
                          className="flex-1 bg-gradient-to-t from-[#EA580C] via-[#F97316] to-[#FBBF24] rounded-full animate-pulse"
                          style={{
                            height: `${h}px`,
                            animationDuration: `${0.45 + (i % 5) * 0.12}s`,
                            animationDelay: `${i * 30}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <textarea
                  rows={4}
                  value={intakeText}
                  onChange={(e) => setIntakeText(e.target.value)}
                  placeholder="Record or paste citizen grievance in any language..."
                  className={`w-full text-sm p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#EA580C] font-mono ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900'}`}
                  required
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className={`text-[11px] flex items-center gap-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  PII stripped automatically before public clustering.
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#F97316] hover:to-[#EA580C] text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(234,88,12,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  Process with Gemini &amp; Structure Signal
                </button>
              </div>

              {intakeSubmitted && (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 animate-fade-in shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong>Signal Structured Successfully!</strong> Added to the live pulse and clustered into the district evidence database.
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. EVIDENCE LIBRARY TAB */}
        {/* ========================================================================= */}
        {activeTab === 'evidence' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Evidence Library</h2>
                <p className="text-xs text-slate-500">
                  Audit trail of citizen voice inputs, language preservation, and Gemini entity extractions.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search signals..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#EA580C] w-48"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={evidenceFilter}
                  onChange={(e) => setEvidenceFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#EA580C] bg-white font-medium"
                >
                  <option value="All">All Themes</option>
                  <option value="Water Access">Water Access</option>
                  <option value="Public Safety">Public Safety</option>
                  <option value="Roads & Transit">Roads & Transit</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Sanitation">Sanitation</option>
                </select>
              </div>
            </div>

            {/* Evidence Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Signal ID</th>
                      <th className="py-3 px-4">Original Vernacular Voice</th>
                      <th className="py-3 px-4">Structured AI Summary</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Theme</th>
                      <th className="py-3 px-4">Urgency</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredSignals.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono-civic font-bold text-[#0B2545]">{item.id}</td>
                        <td className="py-3 px-4 max-w-xs text-slate-800 italic">
                          "{item.originalQuote}"
                          <span className="block text-[10px] text-slate-400 not-italic font-sans mt-0.5">
                            {item.language} • {item.channel}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-sm text-slate-700">{item.summary}</td>
                        <td className="py-3 px-4 text-slate-600">{item.location}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                            {item.theme}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.urgency === 'Critical'
                                ? 'bg-red-100 text-red-700'
                                : item.urgency === 'High'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {item.urgency}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                            <Check className="h-3 w-3" />
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. RECOMMENDATIONS TAB (Human in the Loop) */}
        {/* ========================================================================= */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1 font-mono">
                  <BrainCircuit className="h-4 w-4" />
                  [DECISION_GATE] • HUMAN-IN-THE-LOOP ALLOCATION
                </div>
                <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Explainable Infrastructure Priorities
                </h2>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  AI calculates demand concentration and estimates budget. District officials retain 100% sign-off authority.
                </p>
              </div>

              <div className={`p-3.5 rounded-xl border text-xs max-w-sm ${darkMode ? 'bg-blue-500/10 border-blue-500/30 text-cyan-300' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                <strong>Safety Governance:</strong> No automated procurement or budget transfer is executed without an authorized human official's cryptographic sign-off.
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid gap-6">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`p-6 rounded-2xl border transition-all space-y-4 ${darkMode ? 'bg-[#0B1325]/90 border-slate-800 hover:border-orange-500/60 shadow-xl hover:shadow-[0_0_25px_rgba(234,88,12,0.2)] text-white' : 'bg-white border-slate-200 shadow-xs hover:border-slate-300 text-slate-900'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono font-bold text-xs text-orange-400">{rec.id}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                          {rec.theme}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            rec.status === 'Approved for Budgeting'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : rec.status === 'Field Visit Scheduled'
                              ? 'bg-blue-500/20 text-cyan-400 border border-blue-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </div>
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{rec.title}</h3>
                      <p className={`text-xs mt-0.5 flex items-center gap-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <MapPin className="h-3 w-3 text-orange-400" />
                        {rec.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-semibold">Estimated Cost</span>
                        <span className={`text-lg font-extrabold ${darkMode ? 'text-white' : 'text-[#0B2545]'}`}>{rec.estimatedBudget}</span>
                      </div>
                      <div className={`h-10 w-px hidden sm:block ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-semibold">Confidence Score</span>
                        <span className="text-xl font-extrabold text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]">{rec.confidenceScore}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Criteria Progress Bars */}
                  <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border text-xs ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <div>
                      <span className="text-slate-400 block mb-1">Demand Concentration</span>
                      <div className={`h-2 w-full rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div
                          className="h-full bg-emerald-400 rounded-full shadow-[0_0_8px_#34D399]"
                          style={{ width: `${rec.criteriaBreakdown.demandConcentration}%` }}
                        ></div>
                      </div>
                      <span className={`font-bold mt-1 block ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        {rec.criteriaBreakdown.demandConcentration}%
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Source Diversity</span>
                      <div className={`h-2 w-full rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div
                          className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#22D3EE]"
                          style={{ width: `${rec.criteriaBreakdown.sourceDiversity}%` }}
                        ></div>
                      </div>
                      <span className={`font-bold mt-1 block ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        {rec.criteriaBreakdown.sourceDiversity}%
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Urgency Pattern</span>
                      <div className={`h-2 w-full rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div
                          className="h-full bg-amber-400 rounded-full shadow-[0_0_8px_#FBBF24]"
                          style={{ width: `${rec.criteriaBreakdown.urgencyPattern}%` }}
                        ></div>
                      </div>
                      <span className={`font-bold mt-1 block ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        {rec.criteriaBreakdown.urgencyPattern}%
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Feasibility &amp; Fit</span>
                      <div className={`h-2 w-full rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div
                          className="h-full bg-indigo-400 rounded-full shadow-[0_0_8px_#818CF8]"
                          style={{ width: `${rec.criteriaBreakdown.feasibility}%` }}
                        ></div>
                      </div>
                      <span className={`font-bold mt-1 block ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        {rec.criteriaBreakdown.feasibility}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <span className="text-xs text-slate-400 italic">
                      Basis: {rec.signalBasis}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveRec(rec.id)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#F97316] hover:to-[#EA580C] text-white text-xs font-bold shadow-[0_0_15px_rgba(234,88,12,0.4)] flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <FileCheck className="h-4 w-4 text-amber-300" />
                        {rec.status === 'Pending Human Sign-Off'
                          ? 'Sign & Schedule Field Visit'
                          : rec.status === 'Field Visit Scheduled'
                          ? 'Approve for Budget Allocation'
                          : 'Download Approved Proposal Brief'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. ASK CIVIC PLUSE AI TAB */}
        {/* ========================================================================= */}
        {activeTab === 'ask-ai' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-bold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                <Bot className="h-4 w-4 text-[#EA580C]" />
                Google Gemini 2.5 Flash Assistant
              </div>
              <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Ask Civics Plus
              </h2>
              <p className={`text-sm max-w-xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Inquire about welfare schemes, grievance mechanisms, or how community requests become prioritized projects.
              </p>
            </div>

            {/* Quick Question Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                'Drinking water criteria under Jal Jeevan Mission',
                'Road repair subsidy for rural schools',
                'How does Civics Plus protect citizen privacy?',
                'Solar street lighting guidelines',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(chip)}
                  className={`text-xs px-3.5 py-2 rounded-full border font-medium transition-all cursor-pointer ${darkMode ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-orange-500/40' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'}`}
                >
                  💬 {chip}
                </button>
              ))}
            </div>

            {/* Chat Box Container */}
            <div className={`rounded-2xl border overflow-hidden flex flex-col h-[520px] transition-all ${darkMode ? 'bg-[#0B1325]/95 border-slate-800 shadow-2xl text-white' : 'bg-white border-slate-200 shadow-sm'}`}>
              {/* Chat Sub-Header */}
              <div className={`px-4 py-3 border-b flex items-center justify-between text-xs ${darkMode ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                <span className="font-bold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Gemini Knowledge Engine
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Response dialect:</span>
                  <select
                    value={chatLang}
                    onChange={(e) => setChatLang(e.target.value as any)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium focus:outline-none ${darkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Hinglish">Hinglish</option>
                  </select>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'model' && (
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#0B2545] to-[#134074] border border-orange-500/30 flex items-center justify-center text-white shrink-0 shadow-[0_0_10px_rgba(234,88,12,0.3)]">
                        <Bot className="h-4 w-4 text-[#EA580C]" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white rounded-br-none shadow-[0_0_15px_rgba(234,88,12,0.3)]'
                          : (darkMode ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none' : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200')
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[#0B2545] flex items-center justify-center text-white shrink-0">
                      <RefreshCw className="h-4 w-4 text-[#EA580C] animate-spin" />
                    </div>
                    <div className={`rounded-2xl p-4 text-xs italic border ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      Civics Plus is consulting regional policy data via Gemini...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className={`p-3 border-t flex items-center gap-2 ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Ask about schemes, eligibility, or local civic routing..."
                  className={`flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#EA580C] ${darkMode ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900'}`}
                />
                <button
                  onClick={() => handleSendChat()}
                  disabled={chatLoading || !userQuery.trim()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#F97316] hover:to-[#EA580C] disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)] cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Ask</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. GOVERNANCE & DPG TAB */}
        {/* ========================================================================= */}
        {activeTab === 'governance' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono">
                [DPG_ALLIANCE_COMPLIANCE] • OPEN DIGITAL PUBLIC GOOD
              </span>
              <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Designed for Public Trust &amp; Agency.
              </h2>
              <p className={`text-sm max-w-xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Civics Plus strictly aligns with Digital Public Good standards: transparent algorithms, zero automated spending, and human accountability.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: '1. Human-in-the-Loop Safeguard',
                  desc: 'The model recommends; the district decides. No public budget allocation or procurement contract is ever issued automatically without human approval.',
                  icon: ShieldCheck,
                },
                {
                  title: '2. Preserving Dialect & Voice',
                  desc: 'We never discard the original citizen recording or phrasing. The original vernacular evidence remains permanently tied to the structured ticket.',
                  icon: Mic,
                },
                {
                  title: '3. Data Privacy by Design',
                  desc: 'Names, phone numbers, and identifying biometric tokens are stripped before aggregation into public hotspot clusters.',
                  icon: Eye,
                },
                {
                  title: '4. Open & Interoperable',
                  desc: 'Built following Digital Public Good guidelines to easily plug into municipal grievance redressal systems and open GIS backends.',
                  icon: Globe2,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className={`p-5 rounded-2xl border space-y-2 transition-all ${darkMode ? 'bg-[#0B1325]/90 border-slate-800 shadow-lg text-white' : 'bg-white border-slate-200 shadow-xs text-slate-900'}`}>
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Icon className="h-5 w-5 text-[#EA580C]" />
                      <span className={darkMode ? 'text-white' : 'text-slate-900'}>{item.title}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#134074] border border-orange-500/30 text-white space-y-3 shadow-xl">
              <h3 className="font-extrabold text-base text-orange-200">
                Judges &amp; Mentors Statement
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                "Civics Plus does not seek to replace civil servants or municipal planners — it gives them a clearer,
                vernacular-inclusive, and statistically clustered evidence base to act on behalf of the communities who need it most."
              </p>
              <div className="text-[11px] text-slate-400 font-mono pt-1">
                Code for Communities Hackathon • Track: Cooperation • Google Cloud Run &amp; Gemini 2.5 Flash
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 text-center text-xs space-y-1 transition-all ${darkMode ? 'bg-[#040810] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
        <p className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
          Civics Plus — From Citizen Voice to Actionable Civic Insights.
        </p>
        <p className="text-[11px] text-slate-400">
          Submitted to the Code for Communities Hackathon (Cooperation Track). Engineered with Google Gemini &amp; Google Cloud technologies.
        </p>
      </footer>
    </div>
  );
}
