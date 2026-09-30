import React, { useState } from 'react';
import {
  MapPin,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Eye,
  Globe2,
  Calendar,
} from 'lucide-react';

interface MapHotspot {
  id: string;
  name: string;
  state: string;
  coords: { x: number; y: number }; // Percentage relative to India Map SVG
  signals: number;
  theme: 'Water Access' | 'Public Safety' | 'Roads & Transit' | 'Healthcare' | 'Sanitation';
  urgency: 'Critical' | 'High' | 'Medium';
  budget: string;
  scheme: string;
  status: 'Approved' | 'Reviewing' | 'Field Visit';
  recentQuote: string;
}

const INDIA_HOTSPOTS: MapHotspot[] = [
  {
    id: 'HOT-RJ-01',
    name: 'Kalyanpur, Barmer',
    state: 'Rajasthan',
    coords: { x: 26, y: 38 },
    signals: 1284,
    theme: 'Water Access',
    urgency: 'Critical',
    budget: '₹18.6L',
    scheme: 'Jal Jeevan Mission',
    status: 'Reviewing',
    recentQuote: 'हमारे गांव में पीने का पानी 4 दिन में एक बार आता है। टैंकर का पानी भी गंदा है।',
  },
  {
    id: 'HOT-RJ-02',
    name: 'Bassi Transit Hub',
    state: 'Rajasthan',
    coords: { x: 32, y: 34 },
    signals: 842,
    theme: 'Public Safety',
    urgency: 'High',
    budget: '₹7.4L',
    scheme: 'National Lighting (SLNP)',
    status: 'Field Visit',
    recentQuote: 'Bus terminal has zero street lighting after 8 PM. Commuters feel unsafe.',
  },
  {
    id: 'HOT-UP-01',
    name: 'Gorakhpur Rural Block',
    state: 'Uttar Pradesh',
    coords: { x: 55, y: 36 },
    signals: 640,
    theme: 'Sanitation',
    urgency: 'High',
    budget: '₹12.2L',
    scheme: 'Swachh Bharat Rural',
    status: 'Reviewing',
    recentQuote: 'नाला टूटने से बारिश का गंदा पानी घरों के सामने भर जाता है।',
  },
  {
    id: 'HOT-WB-01',
    name: 'Sundarbans Delta',
    state: 'West Bengal',
    coords: { x: 74, y: 48 },
    signals: 780,
    theme: 'Water Access',
    urgency: 'Critical',
    budget: '₹24.0L',
    scheme: 'State Water Works',
    status: 'Approved',
    recentQuote: 'লবণাক্ততার কারণে নলকূপের জল খাওয়ার যোগ্য নয়। ফিল্টার ইউনিট দরকার।',
  },
  {
    id: 'HOT-MH-01',
    name: 'Vidarbha Cluster',
    state: 'Maharashtra',
    coords: { x: 42, y: 55 },
    signals: 920,
    theme: 'Water Access',
    urgency: 'High',
    budget: '₹28.5L',
    scheme: 'Solar Agri Pump Scheme',
    status: 'Field Visit',
    recentQuote: 'पाणी पुरवठा अनियमित आहे. सौर ऊर्जा पंप बसवले तर शेतीला फायदा होईल.',
  },
  {
    id: 'HOT-KA-01',
    name: 'Raichur North',
    state: 'Karnataka',
    coords: { x: 39, y: 72 },
    signals: 510,
    theme: 'Healthcare',
    urgency: 'High',
    budget: '₹15.8L',
    scheme: 'National Health Mission',
    status: 'Reviewing',
    recentQuote: 'ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರದಲ್ಲಿ ವೈದ್ಯರು ವಾರಕ್ಕೆ ಒಂದು ದಿನ ಮಾತ್ರ ಇರುತ್ತಾರೆ.',
  },
  {
    id: 'HOT-TN-01',
    name: 'Dharmapuri Link',
    state: 'Tamil Nadu',
    coords: { x: 44, y: 84 },
    signals: 480,
    theme: 'Roads & Transit',
    urgency: 'Medium',
    budget: '₹19.4L',
    scheme: 'PMGSY Rural Roads',
    status: 'Approved',
    recentQuote: 'மழைக்காலத்தில் பள்ளி செல்லும் சாலை முற்றிலும் சேதமடைகிறது.',
  },
  {
    id: 'HOT-AS-01',
    name: 'Majuli Island',
    state: 'Assam',
    coords: { x: 88, y: 32 },
    signals: 420,
    theme: 'Public Safety',
    urgency: 'Critical',
    budget: '₹16.0L',
    scheme: 'Disaster Resilient Fund',
    status: 'Reviewing',
    recentQuote: 'বানপানীৰ সময়ত নদীৰ পাৰ খহি যোগাযোগ বিচ্ছিন্ন হৈ পৰে।',
  },
];

const WEEKLY_TREND = [
  { week: 'W1', ingested: 320, structured: 240, budget: '₹6.2L' },
  { week: 'W2', ingested: 580, structured: 460, budget: '₹11.8L' },
  { week: 'W3', ingested: 890, structured: 710, budget: '₹18.4L' },
  { week: 'W4', ingested: 1340, structured: 1080, budget: '₹27.5L' },
  { week: 'W5', ingested: 1890, structured: 1540, budget: '₹39.0L' },
  { week: 'W6', ingested: 2410, structured: 1980, budget: '₹48.2L' },
  { week: 'W7', ingested: 2743, structured: 2280, budget: '₹57.2L' },
];

const THEME_BREAKDOWN = [
  { theme: 'Water Access', count: 1284, pct: 47, color: '#06B6D4', budget: '₹26.5L' },
  { theme: 'Public Safety', count: 842, pct: 31, color: '#EA580C', budget: '₹14.8L' },
  { theme: 'Roads & Transit', count: 617, pct: 23, color: '#FBBF24', budget: '₹31.2L' },
  { theme: 'Healthcare', count: 480, pct: 17, color: '#10B981', budget: '₹15.8L' },
  { theme: 'Sanitation', count: 390, pct: 14, color: '#818CF8', budget: '₹12.2L' },
];

export const CivicMapDashboard: React.FC<{ darkMode?: boolean }> = ({ darkMode = true }) => {
  const [selectedHotspot, setSelectedHotspot] = useState<MapHotspot>(INDIA_HOTSPOTS[0]);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(6);

  const filteredHotspots = activeFilter === 'All' 
    ? INDIA_HOTSPOTS 
    : INDIA_HOTSPOTS.filter(h => h.theme === activeFilter);

  return (
    <div className="space-y-6">
      {/* Top Telemetry Header */}
      <div className={`p-6 rounded-2xl border transition-all ${darkMode ? 'bg-[#0B1325]/90 border-slate-800 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-900 shadow-xs'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-[#EA580C] text-xs font-bold border border-orange-500/30 mb-2 font-mono">
              <span className="h-2 w-2 rounded-full bg-[#EA580C] animate-ping"></span>
              NATIONAL_GEOSPATIAL_TELEMETRY
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              India Geospatial Intelligence &amp; Analytics Hub
            </h2>
            <p className={`text-xs sm:text-sm mt-1 max-w-2xl ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Real-time clustering of rural and urban vernacular voice signals across 36 States &amp; UTs into verified public works pipelines.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 self-start lg:self-center">
            {['All', 'Water Access', 'Public Safety', 'Roads & Transit', 'Healthcare'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === f
                    ? 'bg-[#EA580C] text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]'
                    : (darkMode ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive India Map on Left + District Breakdown on Right */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive India Geospatial Map */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border transition-all ${darkMode ? 'bg-[#0B1325]/90 border-slate-800 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-900 shadow-xs'} flex flex-col justify-between`}>
          <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-800">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-[#EA580C]" />
                Interactive India Demand Map (8 Key Hotspots)
              </h3>
              <span className="text-[11px] text-slate-400">Click any pulsing beacon to load district voice proof</span>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ● 8 REGIONS ACTIVE
            </span>
          </div>

          {/* India Map Graphic Container */}
          <div className="relative w-full h-[460px] flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-[#060B14] to-[#0A1224] border border-slate-800/80 p-4">
            {/* Background Grid & Radar Sweep */}
            <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none"></div>

            {/* Stylized India Geography Contour (High-Detail SVG) */}
            <svg
              viewBox="0 0 400 480"
              className="w-full h-full max-h-[440px] drop-shadow-[0_0_25px_rgba(6,182,212,0.15)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="indiaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#0F172A" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#1E293B" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* India Boundary Polygonal Silhouette */}
              <path
                d="M 160 30 
                   L 190 35 L 210 50 L 230 70 L 220 95 L 250 110 L 270 115 L 290 135 L 340 140 
                   L 360 160 L 375 165 L 360 185 L 335 180 L 310 195 L 285 200 L 280 230 
                   L 260 250 L 260 280 L 235 320 L 215 360 L 195 410 L 180 445 L 175 425 
                   L 160 380 L 140 330 L 130 280 L 115 250 L 95 240 L 70 235 L 60 215 
                   L 70 190 L 105 180 L 115 150 L 130 130 L 135 90 L 150 50 Z"
                fill="url(#indiaGrad)"
                stroke="#0284C7"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                className="transition-all"
              />

              {/* State Partition Grid Lines (Decorative Aesthetic) */}
              <path d="M 130 130 Q 180 150 250 110" stroke="#334155" strokeWidth="0.8" fill="none" />
              <path d="M 115 180 Q 200 200 280 200" stroke="#334155" strokeWidth="0.8" fill="none" />
              <path d="M 95 240 Q 180 260 260 250" stroke="#334155" strokeWidth="0.8" fill="none" />
              <path d="M 130 280 Q 190 320 235 320" stroke="#334155" strokeWidth="0.8" fill="none" />
              <path d="M 140 330 Q 180 370 215 360" stroke="#334155" strokeWidth="0.8" fill="none" />

              {/* Coordinates Markers */}
              <text x="30" y="460" fill="#64748B" fontSize="9" fontFamily="monospace">8°4'N / 68°7'E</text>
              <text x="290" y="460" fill="#64748B" fontSize="9" fontFamily="monospace">37°6'N / 97°25'E</text>
            </svg>

            {/* Interactive Hotspot Beacons Placed by Percentage */}
            {filteredHotspots.map((spot) => {
              const isSelected = selectedHotspot.id === spot.id;
              return (
                <div
                  key={spot.id}
                  onClick={() => setSelectedHotspot(spot)}
                  style={{
                    left: `${spot.coords.x}%`,
                    top: `${spot.coords.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Outer pulsating wave */}
                  <span
                    className={`absolute -inset-2 rounded-full animate-ping opacity-60 ${
                      spot.urgency === 'Critical' ? 'bg-red-500' : spot.urgency === 'High' ? 'bg-orange-500' : 'bg-cyan-500'
                    }`}
                  ></span>

                  {/* Core Pin Button */}
                  <div
                    className={`relative h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px] transition-transform group-hover:scale-125 shadow-lg ${
                      isSelected
                        ? 'bg-[#EA580C] text-white ring-4 ring-orange-500/40 shadow-[0_0_20px_#EA580C]'
                        : spot.urgency === 'Critical'
                        ? 'bg-red-500 text-white'
                        : spot.urgency === 'High'
                        ? 'bg-orange-500 text-white'
                        : 'bg-cyan-500 text-white'
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                  </div>

                  {/* Hover Tag */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-white text-[10px] font-mono px-2 py-1 rounded border border-orange-500/50 pointer-events-none shadow-xl z-30">
                    {spot.name} • {spot.signals} Signals
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500"></span> Critical Need
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-500"></span> High Priority
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-500"></span> Medium Priority
              </span>
            </div>
            <span>Click Pin to Inspect Voice Proof</span>
          </div>
        </div>

        {/* Right Column: Selected Hotspot Telemetry Card */}
        <div className={`lg:col-span-5 p-6 rounded-2xl border transition-all ${darkMode ? 'bg-[#0B1325]/90 border-slate-800 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-900 shadow-xs'} space-y-4`}>
          <div className="flex items-start justify-between border-b pb-4 border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider block">
                {selectedHotspot.id} • {selectedHotspot.state}
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">{selectedHotspot.name}</h3>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                selectedHotspot.urgency === 'Critical'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
              }`}
            >
              {selectedHotspot.urgency} Urgency
            </span>
          </div>

          {/* 3 Telemetry Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">Signals Clustered</span>
              <span className="text-xl font-extrabold text-orange-400">{selectedHotspot.signals}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">Est. Work Budget</span>
              <span className="text-xl font-extrabold text-white">{selectedHotspot.budget}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">Department Status</span>
              <span className="text-xs font-bold text-emerald-400 block mt-1">{selectedHotspot.status}</span>
            </div>
          </div>

          {/* Vernacular Proof Audio Box */}
          <div className="p-4 rounded-xl bg-black/60 border border-orange-500/30 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-orange-400 flex items-center gap-1.5 font-mono">
                <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                PRIMARY CITIZEN VOICE RECORDING
              </span>
              <span className="text-[10px] text-slate-400 font-mono">16kHz HD Verified</span>
            </div>
            <p className="text-xs italic text-slate-200 border-l-2 border-[#EA580C] pl-2.5 leading-relaxed">
              "{selectedHotspot.recentQuote}"
            </p>
          </div>

          {/* Target Welfare Scheme Allocation */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Matching Central / State Scheme:</span>
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
              {selectedHotspot.scheme}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => alert(`Civics Plus Dispatch Ticket created for ${selectedHotspot.name}! Routed to District Magistrate.`)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#F97316] hover:to-[#EA580C] text-white text-xs font-bold shadow-[0_0_20px_rgba(234,88,12,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            Generate Field Inspection Order for {selectedHotspot.name}
          </button>
        </div>
      </div>

      {/* Analytics Charts Grid: Weekly Trend Line Graph + Theme Bar Chart */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: 7-Week Signal Growth Line Graph (Interactive SVG Area Curve) */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border transition-all ${darkMode ? 'bg-[#0B1325]/90 border-slate-800 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-900 shadow-xs'} space-y-4`}>
          <div className="flex items-center justify-between border-b pb-4 border-slate-800">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                7-Week Citizen Signal Growth &amp; Budget Curve
              </h3>
              <p className="text-xs text-slate-400">Comparing Ingested Vernacular Signals vs Structured Public Work Proposals</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
              +757% GROWTH
            </span>
          </div>

          {/* Interactive SVG Line Graph */}
          <div className="relative h-64 w-full pt-4">
            <svg viewBox="0 0 700 240" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EA580C" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#EA580C" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="areaGradientCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Reference Grid Lines */}
              {[40, 90, 140, 190].map((y, i) => (
                <line key={i} x1="30" y1={y} x2="680" y2={y} stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
              ))}

              {/* Ingested Signals Area & Line (Orange) */}
              <polygon
                points="40,210 40,195 140,175 240,150 340,120 440,85 540,55 640,30 640,210"
                fill="url(#areaGradient)"
              />
              <polyline
                points="40,195 140,175 240,150 340,120 440,85 540,55 640,30"
                fill="none"
                stroke="#EA580C"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_10px_#EA580C]"
              />

              {/* Structured Signals Line (Cyan) */}
              <polyline
                points="40,200 140,185 240,165 340,140 440,105 540,75 640,50"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_#06B6D4]"
              />

              {/* Data Nodes */}
              {[
                { x: 40, y: 195, i: 0 },
                { x: 140, y: 175, i: 1 },
                { x: 240, y: 150, i: 2 },
                { x: 340, y: 120, i: 3 },
                { x: 440, y: 85, i: 4 },
                { x: 540, y: 55, i: 5 },
                { x: 640, y: 30, i: 6 },
              ].map((pt) => (
                <circle
                  key={pt.i}
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredWeek === pt.i ? 6 : 4}
                  fill="#EA580C"
                  stroke="#FFF"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredWeek(pt.i)}
                  className="cursor-pointer transition-all shadow-md"
                />
              ))}

              {/* X Axis Week Labels */}
              {WEEKLY_TREND.map((w, i) => (
                <text
                  key={i}
                  x={40 + i * 100}
                  y="230"
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  {w.week}
                </text>
              ))}
            </svg>
          </div>

          {/* Interactive Hover Telemetry Pill */}
          {hoveredWeek !== null && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className="text-orange-400 font-bold">WEEK: {WEEKLY_TREND[hoveredWeek].week}</span>
              <span className="text-slate-300">INGESTED: <strong>{WEEKLY_TREND[hoveredWeek].ingested}</strong></span>
              <span className="text-cyan-300">STRUCTURED: <strong>{WEEKLY_TREND[hoveredWeek].structured}</strong></span>
              <span className="text-emerald-400 font-bold">PIPELINE: {WEEKLY_TREND[hoveredWeek].budget}</span>
            </div>
          )}
        </div>

        {/* Right: Thematic Breakdown Multi-Bar Chart */}
        <div className={`lg:col-span-5 p-6 rounded-2xl border transition-all ${darkMode ? 'bg-[#0B1325]/90 border-slate-800 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-900 shadow-xs'} space-y-4`}>
          <div className="flex items-center justify-between border-b pb-4 border-slate-800">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#EA580C]" />
                Demand Volume by Theme
              </h3>
              <p className="text-xs text-slate-400">Total signals &amp; allocated budgets</p>
            </div>
            <span className="text-xs font-mono text-slate-400">₹57.2L Total</span>
          </div>

          <div className="space-y-4 pt-2">
            {THEME_BREAKDOWN.map((item) => (
              <div key={item.theme} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{item.theme}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{item.budget}</span>
                    <span className="font-mono font-bold text-orange-400">{item.count}</span>
                  </div>
                </div>
                {/* Horizontal Bar */}
                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-1000 shadow-sm"
                    style={{
                      width: `${item.pct * 2}%`,
                      backgroundColor: item.color,
                      boxShadow: `0 0 10px ${item.color}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Ingestion Channels Donut Gauge Summary */}
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Voice Notes</span>
              <span className="text-base font-extrabold text-orange-400">54%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">WhatsApp / SMS</span>
              <span className="text-base font-extrabold text-cyan-400">28%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Web Portals</span>
              <span className="text-base font-extrabold text-emerald-400">18%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
