import { useMemo, useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Activity, ArrowRight, AudioLines, Bell, BookOpen, BrainCircuit, Check, ChevronDown,
  CircleHelp, ClipboardList, Clock3, Database, FileCheck2, Filter, Globe2, Info,
  Layers3, Lightbulb, Map, MapPin, Menu, MessageSquareText, Mic, MoreHorizontal,
  Network, PanelRight, PenLine, Play, Plus, Radio, Search, Send, Settings2, ShieldCheck,
  Sparkles, Target, TrendingUp, Users, Volume2, X, Zap
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type RequestItem = {
  id: string;
  quote: string;
  summary: string;
  language: string;
  channel: string;
  place: string;
  time: string;
  status: string;
  theme: string;
};

const baseRequests: RequestItem[] = [
  { id: 'SIG-2048', quote: 'हमारे गांव में पानी का टैंकर हफ्ते में सिर्फ एक बार आता है।', summary: 'Reliable drinking water needed for Kalyanpur hamlet', language: 'Hindi', channel: 'Voice note', place: 'Kalyanpur, Rajasthan', time: '12 min ago', status: 'Structured', theme: 'Water access' },
  { id: 'SIG-2047', quote: 'The bus stop has no light. Women wait here after sunset.', summary: 'Lighting and safety near the Bassi bus stop', language: 'English', channel: 'Text', place: 'Bassi, Jaipur', time: '27 min ago', status: 'Under review', theme: 'Public safety' },
  { id: 'SIG-2046', quote: 'हमारे स्कूल तक जाने वाली सड़क बारिश में बंद हो जाती है।', summary: 'All-weather road access to government school', language: 'Hindi', channel: 'Voice note', place: 'Dausa, Rajasthan', time: '41 min ago', status: 'Structured', theme: 'Roads' },
  { id: 'SIG-2045', quote: 'আমাদের পাড়ায় স্বাস্থ্যকেন্দ্র অনেক দূরে।', summary: 'Primary healthcare access gap in Ward 14', language: 'Bengali', channel: 'Text', place: 'Malda, West Bengal', time: '1 hr ago', status: 'Triaged', theme: 'Healthcare' },
];

const navItems = [
  { href: '/', label: 'Control room', icon: Activity },
  { href: '/intake', label: 'Citizen intake', icon: MessageSquareText },
  { href: '/evidence', label: 'Evidence library', icon: Database },
  { href: '/recommendations', label: 'Recommendations', icon: Lightbulb },
];

const hotspots = [
  { place: 'Jaipur rural belt', issue: 'Water reliability', signals: '1,284', change: '+18%', color: 'saffron', x: '69%', y: '38%' },
  { place: 'Bassi block', issue: 'Road connectivity', signals: '842', change: '+11%', color: 'coral', x: '54%', y: '57%' },
  { place: 'Dausa district', issue: 'School access', signals: '617', change: '+8%', color: 'teal', x: '77%', y: '69%' },
];

const recommendations = [
  { id: 'REC-31', title: 'Add 3 community water points in Kalyanpur', place: 'Kalyanpur, Rajasthan', type: 'Water access', confidence: 'High confidence', score: '87', budget: '₹18.6 lakh', basis: '1,284 citizen signals · 4 source types', color: 'teal' },
  { id: 'REC-29', title: 'Solar lighting corridor near Bassi bus stop', place: 'Bassi, Jaipur', type: 'Public safety', confidence: 'High confidence', score: '82', budget: '₹7.4 lakh', basis: '842 citizen signals · 3 source types', color: 'saffron' },
  { id: 'REC-24', title: 'Raise and surface the school access road', place: 'Dausa district', type: 'Roads', confidence: 'Needs field check', score: '71', budget: '₹31.2 lakh', basis: '617 citizen signals · monsoon pattern', color: 'coral' },
];

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ErrorBoundary>
            <CivicApp />
          </ErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function CivicApp() {
  const [location, setLocation] = useLocation();
  const [requests, setRequests] = useState<RequestItem[]>(baseRequests);
  const [language, setLanguage] = useState('Hindi');
  const [channel, setChannel] = useState('Voice note');
  const [newRequest, setNewRequest] = useState('');
  const [selectedRec, setSelectedRec] = useState<typeof recommendations[number] | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState('');

  const currentPath = location.split('?')[0];
  const pageTitle = currentPath === '/intake' ? 'Citizen intake' : currentPath === '/evidence' ? 'Evidence library' : currentPath === '/recommendations' ? 'Recommendations' : 'Control room';

  const submitRequest = () => {
    if (!newRequest.trim()) return;
    const item: RequestItem = {
      id: `SIG-${2050 + requests.length}`,
      quote: newRequest.trim(),
      summary: 'New citizen signal awaiting AI structuring',
      language,
      channel,
      place: 'Demo location · Rajasthan',
      time: 'just now',
      status: 'New signal',
      theme: 'Needs triage',
    };
    setRequests((current) => [item, ...current]);
    setNewRequest('');
    setToast('Signal received and added to the evidence stream.');
    setLocation('/evidence');
    window.setTimeout(() => setToast(''), 3200);
  };

  const content = currentPath === '/' ? (
    <Dashboard requests={requests} onOpenRecommendation={setSelectedRec} />
  ) : currentPath === '/intake' ? (
    <Intake language={language} setLanguage={setLanguage} channel={channel} setChannel={setChannel} value={newRequest} setValue={setNewRequest} onSubmit={submitRequest} />
  ) : currentPath === '/evidence' ? (
    <Evidence requests={requests} />
  ) : currentPath === '/recommendations' ? (
    <Recommendations onOpen={setSelectedRec} />
  ) : <NotFound />;

  return (
    <div className="noise min-h-[100dvh] bg-background">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col bg-[hsl(var(--sidebar))] px-5 py-6 text-[hsl(var(--sidebar-foreground))] transition-transform duration-300 lg:translate-x-0 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-start justify-between">
          <Link href="/" className="flex items-center gap-3" data-testid="link-brand">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-[13px] bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]">
              <Network size={21} strokeWidth={2.2} />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[hsl(var(--sidebar))] bg-[#4fc2a2]" />
            </div>
            <div>
              <div className="font-display text-[24px] leading-none tracking-tight">Civic Pluse AI</div>
              <div className="mt-1 font-mono-civic text-[9px] uppercase tracking-[.18em] text-[hsl(var(--sidebar-foreground)/.55)]">public intelligence</div>
            </div>
          </Link>
          <button className="rounded-lg p-1 text-[hsl(var(--sidebar-foreground)/.6)] hover:bg-white/10 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" data-testid="button-close-navigation"><X size={18} /></button>
        </div>
        <div className="mt-12">
          <div className="mb-3 px-3 font-mono-civic text-[9px] uppercase tracking-[.2em] text-[hsl(var(--sidebar-foreground)/.42)]">Workspace</div>
          <nav className="space-y-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.href;
              return <Link key={item.href} href={item.href} onClick={() => setMobileNavOpen(false)} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition-colors ${active ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]' : 'text-[hsl(var(--sidebar-foreground)/.66)] hover:bg-white/8 hover:text-[hsl(var(--sidebar-foreground))]'}`} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
                <Icon size={17} strokeWidth={active ? 2.4 : 1.8} />
                <span>{item.label}</span>
                {item.href === '/evidence' && <span className="ml-auto rounded-full bg-[#4fc2a2]/20 px-2 py-0.5 font-mono-civic text-[9px] text-[#79d8bd]">{requests.length}</span>}
              </Link>;
            })}
          </nav>
        </div>
        <div className="mt-auto">
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/[.055] p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[hsl(var(--sidebar-foreground)/.8)]"><span className="pulse-dot h-2 w-2 rounded-full bg-[#4fc2a2]" /> Demo data live</div>
            <p className="mt-2 text-[11px] leading-relaxed text-[hsl(var(--sidebar-foreground)/.47)]">Signals shown here are a representative Rajasthan pilot dataset.</p>
          </div>
          <div className="flex items-center gap-3 border-t border-white/10 pt-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9b36a] text-[11px] font-bold text-[#25304a]">AK</div>
            <div className="min-w-0"><div className="truncate text-xs font-semibold">Ananya Kapoor</div><div className="truncate text-[10px] text-[hsl(var(--sidebar-foreground)/.45)]">District planning unit</div></div>
            <button className="ml-auto text-[hsl(var(--sidebar-foreground)/.4)] hover:text-white" aria-label="Open account settings" data-testid="button-account-settings"><Settings2 size={15} /></button>
          </div>
        </div>
      </aside>

      {mobileNavOpen && <button className="fixed inset-0 z-30 bg-[#172036]/45 lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation overlay" data-testid="button-navigation-overlay" />}
      <main className="min-h-[100dvh] lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-[70px] items-center justify-between border-b border-border/75 bg-background/90 px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button className="rounded-xl p-2 hover:bg-[hsl(var(--muted))] lg:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation" data-testid="button-open-navigation"><Menu size={20} /></button>
            <div><div className="font-mono-civic text-[9px] uppercase tracking-[.2em] text-muted-foreground">Rajasthan pilot / {pageTitle}</div><div className="mt-0.5 text-[15px] font-semibold tracking-[-.02em]">Good morning, Ananya <span className="text-muted-foreground">·</span> <span className="font-normal text-muted-foreground">Tuesday, 18 June 2024</span></div></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-[11px] text-muted-foreground sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#3eb39a]" /> Updated 2 min ago</div>
            <button className="relative rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="View notifications" data-testid="button-notifications"><Bell size={18} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#e26455]" /></button>
            <button className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-muted" aria-label="Help center" data-testid="button-help"><CircleHelp size={17} /></button>
          </div>
        </header>
        <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">{content}</div>
      </main>

      {toast && <div role="status" className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-4 py-3 text-xs font-medium text-[hsl(var(--primary-foreground))] shadow-xl"><Check size={15} className="text-[#5fd0ad]" /> {toast}</div>}
      {selectedRec && <ExplainabilityPanel recommendation={selectedRec} onClose={() => setSelectedRec(null)} />}
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="mb-6 flex items-end justify-between gap-5"><div><div className="font-mono-civic text-[9px] uppercase tracking-[.2em] text-[hsl(var(--secondary))]">{eyebrow}</div><h1 className="mt-2 font-display text-[34px] leading-none tracking-[-.025em] text-foreground sm:text-[40px]">{title}</h1>{description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>}</div>{action}</div>;
}

function Dashboard({ requests, onOpenRecommendation }: { requests: RequestItem[]; onOpenRecommendation: (rec: typeof recommendations[number]) => void }) {
  return <div className="space-y-7">
    <section className="fade-up flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <SectionHeading eyebrow="Control room / live overview" title="From voice to public value." description="A clear line from what citizens say to what planners can act on — grounded in local evidence." />
      <Link href="/intake" className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-3 text-xs font-semibold text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5" data-testid="link-capture-signal"><Plus size={16} /> Capture a signal <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></Link>
    </section>

    <section className="fade-up fade-up-delay-1 rounded-2xl border border-border bg-card p-5 civic-shadow sm:p-6">
      <div className="mb-5 flex items-center justify-between"><div><div className="font-mono-civic text-[9px] uppercase tracking-[.18em] text-muted-foreground">The signal loop</div><p className="mt-1 text-sm font-semibold">One citizen voice, four moments of clarity.</p></div><div className="hidden items-center gap-2 rounded-full bg-[hsl(var(--muted))] px-3 py-1.5 text-[10px] text-muted-foreground sm:flex"><Sparkles size={12} className="text-[hsl(var(--accent))]" /> Explainable by design</div></div>
      <div className="grid gap-2 md:grid-cols-[1fr_28px_1fr_28px_1fr_28px_1.1fr]">
        <LoopStep n="01" icon={<AudioLines size={18} />} label="Citizen signal" detail="“Paani hafte mein ek baar…”" tint="amber" />
        <LoopArrow />
        <LoopStep n="02" icon={<BrainCircuit size={18} />} label="AI structures" detail="Need · place · urgency" tint="teal" />
        <LoopArrow />
        <LoopStep n="03" icon={<Map size={18} />} label="Hotspot insight" detail="1,284 signals cluster" tint="coral" />
        <LoopArrow />
        <LoopStep n="04" icon={<Lightbulb size={18} />} label="Policy recommendation" detail="3 water points · ₹18.6L" tint="navy" />
      </div>
    </section>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Signals received" value="4,862" delta="+12.4%" note="this month" icon={<Radio size={17} />} color="teal" />
      <MetricCard label="Districts represented" value="18" delta="+3" note="since last week" icon={<MapPin size={17} />} color="saffron" />
      <MetricCard label="Needs structured" value="91.6%" delta="+4.8%" note="model confidence" icon={<FileCheck2 size={17} />} color="coral" />
      <MetricCard label="Recommendations ready" value="27" delta="8 new" note="awaiting review" icon={<Target size={17} />} color="navy" />
    </section>

    <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
      <section className="fade-up fade-up-delay-2 overflow-hidden rounded-2xl border border-border bg-card civic-shadow">
        <div className="flex items-start justify-between border-b border-border/70 px-5 py-5 sm:px-6"><div><div className="font-mono-civic text-[9px] uppercase tracking-[.18em] text-muted-foreground">Demand geography</div><h2 className="mt-1 text-[17px] font-semibold tracking-[-.02em]">Where people are asking</h2></div><button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-[11px] font-medium text-muted-foreground hover:bg-muted" data-testid="button-map-filters"><Filter size={13} /> Filters <ChevronDown size={13} /></button></div>
        <div className="relative h-[335px] overflow-hidden bg-[#dfe6da] map-grid">
          <div className="absolute inset-[28px] rounded-[45%] border-[22px] border-[#c9d6c7]/80 opacity-80" />
          <div className="absolute inset-x-[13%] top-[29%] h-[1px] rotate-[18deg] bg-[#a8beb0]" /><div className="absolute inset-x-[24%] top-[57%] h-[1px] -rotate-[16deg] bg-[#a8beb0]" /><div className="absolute left-[58%] top-[8%] h-[110%] w-[1px] rotate-[28deg] bg-[#a8beb0]" />
          <div className="absolute left-[39%] top-[17%] font-mono-civic text-[9px] uppercase tracking-[.14em] text-[#718d82]">Jaipur</div><div className="absolute left-[63%] top-[57%] font-mono-civic text-[9px] uppercase tracking-[.14em] text-[#718d82]">Dausa</div><div className="absolute left-[22%] top-[64%] font-mono-civic text-[9px] uppercase tracking-[.14em] text-[#718d82]">Ajmer</div>
          {hotspots.map((spot, index) => <button key={spot.place} className="group absolute -translate-x-1/2 -translate-y-1/2 text-left" style={{ left: spot.x, top: spot.y }} data-testid={`button-hotspot-${index}`}><span className={`absolute -inset-4 rounded-full ${spot.color === 'saffron' ? 'bg-[#efaa45]/20' : spot.color === 'coral' ? 'bg-[#e26455]/20' : 'bg-[#1b9b8d]/20'} animate-pulse`} /><span className={`relative flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#e2eadc] shadow-md ${spot.color === 'saffron' ? 'bg-[#efaa45]' : spot.color === 'coral' ? 'bg-[#e26455]' : 'bg-[#1b9b8d]'}`}><span className="h-1.5 w-1.5 rounded-full bg-[#fff6dc]" /></span><span className="absolute left-5 top-5 hidden w-36 rounded-lg border border-[#b6cabb] bg-[#f5f4e7]/95 p-2 shadow-lg group-hover:block"><span className="block text-[10px] font-semibold text-[#273a3d]">{spot.place}</span><span className="mt-0.5 block text-[10px] text-[#667d74]">{spot.signals} signals · {spot.issue}</span></span></button>)}
          <div className="absolute bottom-4 left-4 flex gap-3 rounded-lg border border-[#c2d0c2] bg-[#f5f4e7]/90 px-3 py-2 text-[9px] font-medium text-[#5d726b] backdrop-blur"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#efaa45]" /> High demand</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#1b9b8d]" /> Emerging</span></div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border border-t border-border">{hotspots.map((spot) => <div key={spot.place} className="px-4 py-4"><div className="text-[11px] font-semibold">{spot.place}</div><div className="mt-1 flex items-center justify-between gap-2 text-[10px] text-muted-foreground"><span>{spot.signals} signals</span><span className="font-mono-civic text-[#198b7e]">{spot.change}</span></div></div>)}</div>
      </section>
      <section className="fade-up fade-up-delay-3 rounded-2xl border border-border bg-card civic-shadow">
        <div className="flex items-start justify-between border-b border-border/70 px-5 py-5 sm:px-6"><div><div className="font-mono-civic text-[9px] uppercase tracking-[.18em] text-muted-foreground">Evidence stream</div><h2 className="mt-1 text-[17px] font-semibold tracking-[-.02em]">Latest citizen signals</h2></div><Link href="/evidence" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Open evidence library" data-testid="link-open-evidence"><ArrowRight size={17} /></Link></div>
        <div className="divide-y divide-border/70">{requests.slice(0, 4).map((item) => <SignalRow key={item.id} item={item} />)}</div>
        <Link href="/intake" className="mx-5 my-4 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-[11px] font-semibold text-muted-foreground hover:border-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary))]" data-testid="link-add-signal"><Plus size={14} /> Add a citizen signal</Link>
      </section>
    </div>

    <section className="rounded-2xl border border-border bg-[hsl(var(--primary))] p-5 text-[hsl(var(--primary-foreground))] sm:p-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><div className="flex items-center gap-2 font-mono-civic text-[9px] uppercase tracking-[.2em] text-[hsl(var(--accent))]"><Zap size={12} /> Decision queue</div><h2 className="mt-2 font-display text-[27px]">Three recommendations are ready for a human review.</h2><p className="mt-1 text-xs text-[hsl(var(--primary-foreground)/.56)]">AI explains the why. Your team decides the what next.</p></div><Link href="/recommendations" className="group inline-flex items-center gap-2 self-start rounded-xl bg-[hsl(var(--accent))] px-4 py-3 text-xs font-semibold text-[hsl(var(--accent-foreground))] hover:brightness-105" data-testid="link-review-queue">Review queue <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></Link></div>
    </section>

    <section className="grid gap-3 lg:grid-cols-3">
      <ProofCard n="01" icon={<Globe2 size={17} />} title="Inclusive by default" detail="Voice, text, and local languages turn lived experience into usable public evidence." tint="teal" />
      <ProofCard n="02" icon={<Layers3 size={17} />} title="Evidence, not anecdotes" detail="Demand clusters combine citizen signals with field notes, seasonality, and public datasets." tint="saffron" />
      <ProofCard n="03" icon={<ShieldCheck size={17} />} title="Governable by design" detail="Every recommendation shows its basis and stops at a human review before action." tint="coral" />
    </section>
  </div>;
}

function LoopStep({ n, icon, label, detail, tint }: { n: string; icon: React.ReactNode; label: string; detail: string; tint: string }) {
  const tintClass = tint === 'amber' ? 'bg-[#fff1d6] text-[#ae6d16]' : tint === 'teal' ? 'bg-[#d9f0e9] text-[#197d70]' : tint === 'coral' ? 'bg-[#fae1da] text-[#ba5649]' : 'bg-[#e1e7f3] text-[#334a75]';
  return <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-background/65 p-3"><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tintClass}`}>{icon}</div><div className="min-w-0"><div className="flex items-center gap-2"><span className="font-mono-civic text-[9px] text-muted-foreground">{n}</span><span className="truncate text-[12px] font-semibold">{label}</span></div><div className="mt-1 truncate text-[10px] text-muted-foreground">{detail}</div></div></div>;
}

function LoopArrow() { return <div className="hidden items-center justify-center text-muted-foreground md:flex"><ArrowRight size={15} /></div>; }

function MetricCard({ label, value, delta, note, icon, color }: { label: string; value: string; delta: string; note: string; icon: React.ReactNode; color: string }) {
  const c = color === 'teal' ? 'text-[#198b7e] bg-[#dcefe9]' : color === 'saffron' ? 'text-[#a46d1b] bg-[#faecd2]' : color === 'coral' ? 'text-[#ba594d] bg-[#fae2db]' : 'text-[#465d88] bg-[#e2e8f3]';
  return <div className="rounded-2xl border border-border bg-card p-4 civic-shadow"><div className="flex items-center justify-between"><span className="text-[11px] font-medium text-muted-foreground">{label}</span><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${c}`}>{icon}</span></div><div className="mt-4 flex items-end gap-2"><span className="font-display text-[30px] leading-none">{value}</span><span className="mb-0.5 font-mono-civic text-[10px] text-[#198b7e]">{delta}</span></div><div className="mt-2 text-[10px] text-muted-foreground">{note}</div></div>;
}

function ProofCard({ n, icon, title, detail, tint }: { n: string; icon: React.ReactNode; title: string; detail: string; tint: string }) {
  const c = tint === 'teal' ? 'bg-[#dcefe9] text-[#198b7e]' : tint === 'saffron' ? 'bg-[#faecd2] text-[#a46d1b]' : 'bg-[#fae2db] text-[#ba594d]';
  return <div className="rounded-2xl border border-border bg-card p-5 civic-shadow"><div className="flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-lg ${c}`}>{icon}</span><span className="font-mono-civic text-[9px] text-muted-foreground">{n}</span></div><h3 className="mt-4 text-[14px] font-semibold">{title}</h3><p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{detail}</p></div>;
}

function SignalRow({ item }: { item: RequestItem }) {
  return <div className="group px-5 py-4 transition-colors hover:bg-background/60 sm:px-6" data-testid={`row-signal-${item.id}`}><div className="flex gap-3"><div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.channel === 'Voice note' ? 'bg-[#faecd2] text-[#aa701c]' : 'bg-[#dcefe9] text-[#198b7e]'}`}>{item.channel === 'Voice note' ? <Volume2 size={15} /> : <PenLine size={15} />}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><span className="truncate text-xs font-semibold">{item.summary}</span><span className="shrink-0 font-mono-civic text-[9px] text-muted-foreground">{item.time}</span></div><p className="mt-1 truncate text-[11px] italic leading-relaxed text-muted-foreground">“{item.quote}”</p><div className="mt-2 flex items-center gap-2 text-[9px] text-muted-foreground"><span>{item.place}</span><span className="h-1 w-1 rounded-full bg-border" /><span className="font-mono-civic">{item.status}</span></div></div></div></div>;
}

function Intake({ language, setLanguage, channel, setChannel, value, setValue, onSubmit }: { language: string; setLanguage: (value: string) => void; channel: string; setChannel: (value: string) => void; value: string; setValue: (value: string) => void; onSubmit: () => void }) {
  const langs = ['Hindi', 'English', 'Marathi', 'Bengali', 'Tamil'];
  return <div className="mx-auto max-w-[1050px]">
    <SectionHeading eyebrow="Citizen intake / demo mode" title="Make a need visible." description="Capture the words as they are spoken. Civic Pluse AI keeps the original voice, then turns it into structured evidence for the people planning the next step." action={<div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-[10px] text-muted-foreground sm:flex"><ShieldCheck size={13} className="text-[#198b7e]" /> Private by default</div>} />
    <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
      <section className="rounded-2xl border border-border bg-card p-5 civic-shadow sm:p-7">
        <div className="flex items-center justify-between border-b border-border/70 pb-5"><div><div className="font-mono-civic text-[9px] uppercase tracking-[.18em] text-muted-foreground">Step 01 / tell us</div><h2 className="mt-1 text-[19px] font-semibold">What does your community need?</h2></div><span className="font-mono-civic text-[10px] text-muted-foreground">DEMO-INTAKE</span></div>
        <div className="mt-6"><label className="mb-3 block text-xs font-semibold">Choose the language you’re most comfortable in</label><div className="flex flex-wrap gap-2">{langs.map((lang) => <button key={lang} onClick={() => setLanguage(lang)} className={`rounded-full border px-3.5 py-2 text-[11px] font-medium transition-colors ${language === lang ? 'border-[hsl(var(--secondary))] bg-[#dcefe9] text-[#176f64]' : 'border-border bg-background text-muted-foreground hover:border-[hsl(var(--secondary))]'}`} data-testid={`button-language-${lang.toLowerCase()}`}>{lang}{language === lang && <Check size={12} className="ml-1.5 inline" />}</button>)}</div></div>
        <div className="mt-7"><label className="mb-3 block text-xs font-semibold">Choose a channel</label><div className="grid grid-cols-2 gap-3"><button onClick={() => setChannel('Voice note')} className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${channel === 'Voice note' ? 'border-[#d9a54e] bg-[#fff3de]' : 'border-border bg-background hover:border-[#d9a54e]'}`} data-testid="button-channel-voice"><span className={`flex h-9 w-9 items-center justify-center rounded-lg ${channel === 'Voice note' ? 'bg-[#efb960] text-[#523a13]' : 'bg-muted text-muted-foreground'}`}><Mic size={17} /></span><span><span className="block text-xs font-semibold">Voice note</span><span className="mt-0.5 block text-[10px] text-muted-foreground">Speak naturally</span></span></button><button onClick={() => setChannel('Text')} className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${channel === 'Text' ? 'border-[hsl(var(--secondary))] bg-[#e3f2ee]' : 'border-border bg-background hover:border-[hsl(var(--secondary))]'}`} data-testid="button-channel-text"><span className={`flex h-9 w-9 items-center justify-center rounded-lg ${channel === 'Text' ? 'bg-[#73c9b3] text-[#145b52]' : 'bg-muted text-muted-foreground'}`}><PenLine size={17} /></span><span><span className="block text-xs font-semibold">Type a message</span><span className="mt-0.5 block text-[10px] text-muted-foreground">Write in your words</span></span></button></div></div>
        <div className="mt-7"><label htmlFor="request-message" className="mb-3 block text-xs font-semibold">Your message <span className="font-normal text-muted-foreground">— include a place if you can</span></label><div className="relative"><textarea id="request-message" value={value} onChange={(event) => setValue(event.target.value)} placeholder={channel === 'Voice note' ? 'Try: “The water point is 4 km away and the tanker comes once a week…”' : 'Tell us what is happening in your area…'} className="min-h-[155px] w-full resize-none rounded-xl border border-input bg-background p-4 pr-12 text-sm leading-relaxed outline-none transition-shadow placeholder:text-muted-foreground/60 focus:border-[hsl(var(--secondary))] focus:ring-4 focus:ring-[hsl(var(--secondary)/.11)]" data-testid="input-citizen-message" /><div className="absolute bottom-3 right-3 font-mono-civic text-[9px] text-muted-foreground">{value.length}/500</div></div><div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground"><Info size={12} /> Your words stay attached to the evidence record.</div></div>
        <button onClick={onSubmit} disabled={!value.trim()} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] py-3.5 text-xs font-semibold text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45" data-testid="button-submit-citizen-signal"><Send size={15} /> Send this signal <ArrowRight size={14} /></button>
      </section>
      <section className="relative overflow-hidden rounded-2xl bg-[hsl(var(--primary))] p-6 text-[hsl(var(--primary-foreground))] sm:p-8"><div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-[hsl(var(--accent)/.2)]" /><div className="absolute -right-6 -top-6 h-28 w-28 rounded-full border border-[hsl(var(--accent)/.25)]" /><div className="relative"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"><Globe2 size={21} /></div><h2 className="mt-7 font-display text-[35px] leading-[.98]">Every language is a planning language.</h2><p className="mt-5 max-w-sm text-sm leading-relaxed text-[hsl(var(--primary-foreground)/.62)]">A voice note in Hindi, a text in Bengali, or a message typed on a shared phone — each one can become a signal a district team can see.</p><div className="mt-10 space-y-4 border-t border-white/10 pt-5"><IntakeProof icon={<AudioLines size={16} />} title="Keep the original" detail="The source quote stays attached." /><IntakeProof icon={<BrainCircuit size={16} />} title="Structure with context" detail="Need, place and urgency are extracted." /><IntakeProof icon={<Users size={16} />} title="Build collective evidence" detail="One voice joins a larger pattern." /></div></div></section>
    </div>
  </div>;
}

function IntakeProof({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) { return <div className="flex gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[hsl(var(--accent))]">{icon}</div><div><div className="text-xs font-semibold">{title}</div><div className="mt-0.5 text-[11px] text-[hsl(var(--primary-foreground)/.48)]">{detail}</div></div></div>; }

function Evidence({ requests }: { requests: RequestItem[] }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => requests.filter((item) => `${item.summary} ${item.quote} ${item.place}`.toLowerCase().includes(query.toLowerCase())), [requests, query]);
  return <div className="space-y-6"><SectionHeading eyebrow="Evidence library / all incoming signals" title="The words behind the map." description="Review the source signals that power each hotspot and recommendation. Demo records are clearly marked; no backend is connected." action={<Link href="/intake" className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-3 text-xs font-semibold text-[hsl(var(--primary-foreground))]" data-testid="link-evidence-add"><Plus size={15} /> Add signal</Link>} />
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search signals, places or themes…" className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-xs outline-none focus:border-[hsl(var(--secondary))]" data-testid="input-search-evidence" /></div><button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-3 text-xs text-muted-foreground hover:bg-muted" data-testid="button-filter-evidence"><Filter size={14} /> All themes <ChevronDown size={13} /></button><div className="font-mono-civic text-[10px] text-muted-foreground">{filtered.length} records</div></div>
    <div className="overflow-hidden rounded-2xl border border-border bg-card civic-shadow"><div className="hidden grid-cols-[1.1fr_1.8fr_1fr_.8fr_.8fr] gap-4 border-b border-border bg-background/50 px-5 py-3 font-mono-civic text-[9px] uppercase tracking-[.12em] text-muted-foreground md:grid"><span>Signal</span><span>Citizen words</span><span>Place / language</span><span>Channel</span><span>Status</span></div><div className="divide-y divide-border/70">{filtered.map((item) => <div key={item.id} className="grid gap-3 px-5 py-4 transition-colors hover:bg-background/60 md:grid-cols-[1.1fr_1.8fr_1fr_.8fr_.8fr] md:items-center md:gap-4" data-testid={`row-evidence-${item.id}`}><div><div className="font-mono-civic text-[10px] text-[hsl(var(--secondary))]">{item.id}</div><div className="mt-1 text-xs font-semibold">{item.summary}</div><div className="mt-1 text-[10px] text-muted-foreground">{item.theme}</div></div><div className="text-xs italic leading-relaxed text-muted-foreground">“{item.quote}”</div><div><div className="text-xs">{item.place}</div><div className="mt-1 text-[10px] text-muted-foreground">{item.language}</div></div><div className="flex items-center gap-1.5 text-xs text-muted-foreground">{item.channel === 'Voice note' ? <Volume2 size={14} /> : <PenLine size={14} />}{item.channel}</div><div><span className={`inline-flex rounded-full px-2 py-1 text-[9px] font-semibold ${item.status === 'New signal' ? 'bg-[#fae2db] text-[#b45448]' : item.status === 'Under review' ? 'bg-[#faecd2] text-[#9b671b]' : 'bg-[#dcefe9] text-[#197568]'}`}>{item.status}</span><div className="mt-1 text-[9px] text-muted-foreground">{item.time}</div></div></div>)}</div>{filtered.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">No signals match that search.</div>}</div>
  </div>;
}

function Recommendations({ onOpen }: { onOpen: (rec: typeof recommendations[number]) => void }) {
  const [filter, setFilter] = useState('All');
  const filtered = recommendations.filter((rec) => filter === 'All' || rec.type === filter);
  return <div className="space-y-6"><SectionHeading eyebrow="Decision queue / explainable AI" title="Recommendations with receipts." description="Every proposed action carries its evidence trail: the demand, the confidence, the estimated cost, and what still needs a human check." action={<div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-[10px] text-muted-foreground sm:flex"><ShieldCheck size={13} className="text-[#198b7e]" /> Human review required</div>} />
    <div className="flex flex-wrap gap-2">{['All', 'Water access', 'Public safety', 'Roads'].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full border px-3 py-2 text-[11px] font-medium ${filter === item ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border-border bg-card text-muted-foreground hover:bg-muted'}`} data-testid={`button-filter-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>)}</div>
    <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]"><div className="space-y-3">{filtered.map((rec, index) => <button key={rec.id} onClick={() => onOpen(rec)} className="group w-full rounded-2xl border border-border bg-card p-5 text-left civic-shadow transition-transform hover:-translate-y-0.5 sm:p-6" data-testid={`button-recommendation-${rec.id}`}><div className="flex items-start justify-between gap-4"><div className="flex items-start gap-3"><span className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg ${rec.color === 'teal' ? 'bg-[#dcefe9] text-[#198b7e]' : rec.color === 'saffron' ? 'bg-[#faecd2] text-[#a46d1b]' : 'bg-[#fae2db] text-[#b4554b]'}`}><Lightbulb size={17} /></span><div><div className="font-mono-civic text-[9px] uppercase tracking-[.16em] text-muted-foreground">{rec.id} · {rec.type}</div><h2 className="mt-1 text-[15px] font-semibold leading-snug">{rec.title}</h2><div className="mt-1 text-xs text-muted-foreground">{rec.place}</div></div></div><ArrowRight size={17} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" /></div><div className="mt-5 grid grid-cols-3 gap-3 border-t border-border/70 pt-4"><div><div className="font-mono-civic text-[9px] uppercase text-muted-foreground">Confidence</div><div className="mt-1 text-xs font-semibold">{rec.score}/100</div></div><div><div className="font-mono-civic text-[9px] uppercase text-muted-foreground">Est. budget</div><div className="mt-1 text-xs font-semibold">{rec.budget}</div></div><div><div className="font-mono-civic text-[9px] uppercase text-muted-foreground">Basis</div><div className="mt-1 truncate text-xs font-semibold">{rec.basis.split(' · ')[0]}</div></div></div></button>)}</div><div className="rounded-2xl border border-border bg-[#e4ebe4] p-6"><div className="flex items-center gap-2 font-mono-civic text-[9px] uppercase tracking-[.18em] text-[#56756a]"><BrainCircuit size={14} /> How to read this</div><h2 className="mt-3 font-display text-[28px] leading-tight text-[#263c3d]">The model recommends. The district decides.</h2><p className="mt-3 text-xs leading-relaxed text-[#5e756d]">Civic Pluse AI surfaces patterns, not verdicts. Open any recommendation to see the citizen evidence, signals that shaped the score, and the questions still open.</p><div className="mt-7 space-y-3">{['Demand concentration', 'Source diversity', 'Urgency pattern', 'Implementation fit'].map((label, index) => <div key={label} className="rounded-xl border border-[#c8d7ca] bg-[#eff4eb] p-3"><div className="flex items-center justify-between text-xs font-semibold text-[#365853]"><span>{label}</span><span className="font-mono-civic text-[10px] text-[#729187]">{[92, 78, 71, 64][index]}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#d4e1d4]"><div className={`h-full rounded-full ${index === 0 ? 'w-[92%] bg-[#1b9b8d]' : index === 1 ? 'w-[78%] bg-[#67b9a1]' : index === 2 ? 'w-[71%] bg-[#e6a744]' : 'w-[64%] bg-[#d57c69]'}`} /></div></div>)}</div></div></div>
  </div>;
}

function ExplainabilityPanel({ recommendation, onClose }: { recommendation: typeof recommendations[number]; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex justify-end"><button className="absolute inset-0 bg-[#1c263d]/35 backdrop-blur-[2px]" onClick={onClose} aria-label="Close recommendation details" data-testid="button-close-explainability-overlay" /><aside className="relative h-full w-full max-w-[520px] overflow-y-auto border-l border-border bg-[hsl(var(--card))] p-6 shadow-2xl sm:p-8"><div className="flex items-center justify-between"><div className="flex items-center gap-2 font-mono-civic text-[9px] uppercase tracking-[.18em] text-[hsl(var(--secondary))]"><PanelRight size={14} /> Explainability panel</div><button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Close explainability panel" data-testid="button-close-explainability"><X size={19} /></button></div><div className="mt-9"><div className="flex items-center gap-2 font-mono-civic text-[10px] text-muted-foreground">{recommendation.id} <span className="h-1 w-1 rounded-full bg-border" /> {recommendation.type}</div><h2 className="mt-3 font-display text-[37px] leading-[.98] tracking-tight">{recommendation.title}</h2><p className="mt-4 text-sm text-muted-foreground">{recommendation.place}</p></div><div className="mt-8 rounded-2xl bg-[hsl(var(--primary))] p-5 text-[hsl(var(--primary-foreground))]"><div className="flex items-end justify-between"><div><div className="font-mono-civic text-[9px] uppercase tracking-[.16em] text-[hsl(var(--primary-foreground)/.55)]">Recommendation confidence</div><div className="mt-2 font-display text-[51px] leading-none text-[hsl(var(--accent))]">{recommendation.score}<span className="text-[22px] text-[hsl(var(--primary-foreground)/.5)]">/100</span></div></div><div className="rounded-full bg-[#4fc2a2]/20 px-3 py-1.5 text-[10px] font-semibold text-[#8de0c7]">{recommendation.confidence}</div></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[hsl(var(--accent))]" style={{ width: `${recommendation.score}%` }} /></div></div><div className="mt-8"><div className="font-mono-civic text-[9px] uppercase tracking-[.18em] text-muted-foreground">Why the model suggested this</div><div className="mt-4 space-y-3"><Reason icon={<Users size={16} />} title="Demand is concentrated" text="Signals from 14 nearby villages point to the same access gap." value="1,284 signals" /><Reason icon={<TrendingUp size={16} />} title="The pattern is growing" text="Mentions are up 18% in the last 30 days, across voice and text." value="+18%" /><Reason icon={<Layers3 size={16} />} title="Sources agree" text="Citizen reports align with field survey notes and seasonal data." value="4 source types" /></div></div><div className="mt-8 rounded-xl border border-[#e7c986] bg-[#fff5dc] p-4"><div className="flex gap-3"><CircleHelp size={17} className="mt-0.5 shrink-0 text-[#a46d1b]" /><div><div className="text-xs font-semibold text-[#72511f]">Still needs a human check</div><p className="mt-1 text-[11px] leading-relaxed text-[#8a6c38]">Confirm land availability for the third water point before sending this to the works committee.</p></div></div></div><button onClick={onClose} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--secondary))] py-3.5 text-xs font-semibold text-white hover:brightness-105" data-testid="button-mark-for-review"><Check size={15} /> Mark as reviewed</button></aside></div>;
}

function Reason({ icon, title, text, value }: { icon: React.ReactNode; title: string; text: string; value: string }) { return <div className="flex gap-3 rounded-xl border border-border/80 bg-background/55 p-3.5"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#dcefe9] text-[#198b7e]">{icon}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div className="text-xs font-semibold">{title}</div><span className="shrink-0 font-mono-civic text-[9px] text-[#198b7e]">{value}</span></div><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{text}</p></div></div>; }

export default App;