import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Bell, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown, 
  Zap, 
  Search, 
  ExternalLink,
  Laptop,
  Check,
  Award,
  Users,
  Compass,
  HelpCircle,
  Bot,
  KeyRound,
  Database,
  Palette,
  MessageSquareText,
  ShieldAlert
} from 'lucide-react';
import { MyCampusLogo } from '../components/common/MyCampusLogo';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user, navigate } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('All');
  const [interactiveTaskChecked, setInteractiveTaskChecked] = useState<boolean>(false);

  const triggerCopilot = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Event Importer',
      badge: 'Multimodal Vision & Text',
      description:
        'Drop in promotional flyers, Instagram posters, or paste messy WhatsApp announcements. Gemini AI extracts date, time, venue, and agendas with zero hallucination guarantee and honest missing-field alerts.',
    },
    {
      icon: Search,
      title: 'Campus Event Discovery',
      badge: 'Multi-Category Filter',
      description:
        'Explore hackathons, distinguished tech talks, career showcases, and workshops. Instant keyword search, venue filters, and RSVP status tracking keep you plugged into campus life.',
    },
    {
      icon: Clock,
      title: 'Personal Event Timeline',
      badge: 'Unified Agenda Feed',
      description:
        'One combined chronological timeline synchronizing event dates, registration deadlines, and prep milestones. Avoid scheduling blindspots and stay ahead of critical cutoffs.',
    },
    {
      icon: CheckCircle2,
      title: 'Preparation Checklist',
      badge: 'Actionable Tasks',
      description:
        'Turn events into actionable preparation tasks. Track resume printouts, hardware kits, team registration deadlines, and pre-reading papers with priority tags.',
    },
    {
      icon: Bell,
      title: 'Notifications & Conflict Detection',
      badge: 'Deterministic Rules',
      description:
        'Stay alert with 48-hour registration warnings and automated room change updates. The deterministic scheduler immediately alerts you if two registered events overlap.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Discover or Import',
      desc: 'Browse verified campus events or paste raw flyers and poster graphics directly into the Gemini-powered AI Importer.',
    },
    {
      number: '02',
      title: 'Track & Schedule',
      desc: 'RSVP in one click. Our deterministic scheduler automatically detects calendar conflicts and builds your unified milestone timeline.',
    },
    {
      number: '03',
      title: 'Prepare & Attend',
      desc: 'Complete generated preparation checklists, print resumes, pack hardware gear, and arrive fully prepared to excel.',
    },
  ];

  const faqs = [
    {
      category: 'Judge Demo',
      icon: KeyRound,
      badge: '1-Click Autofill',
      q: 'How do I access the live judge demonstration?',
      a: 'Three dedicated judge profiles are pre-configured: Campus Explorer (demo1@mycampus.demo), Event Organizer (demo2@mycampus.demo), and AI Feature Tester (demo3@mycampus.demo). All three share the password "demo123". Click "Try Live Demo", choose any profile card to autofill, and sign in immediately.',
      actionText: 'Launch Live Demo',
      actionUrl: '/login',
    },
    {
      category: 'Gemini AI',
      icon: Sparkles,
      badge: 'Zero Fabrication',
      q: 'How does the AI Event Importer extract details without hallucinating?',
      a: 'The importer is backed by Google Gemini Vision. It adheres to strict deterministic validation rules: if a registration deadline or room number is missing from the flyer graphic, it highlights a transparent missing-field warning rather than inventing data. Extracted dates and times are strictly audited against calendar rules.',
      actionText: 'Explore Capabilities',
      actionAnchor: 'features',
    },
    {
      category: 'Privacy & Security',
      icon: Database,
      badge: 'SQLite Isolation',
      q: 'Is my demo session data isolated from other accounts?',
      a: 'Yes. Each demo identity has its own isolated dataset stored in SQLite. Events, tasks, and notifications created under one persona are completely invisible to the others. A "Reset Demo Data" button is also accessible in the top header to restore pristine sample records anytime.',
    },
    {
      category: 'Privacy & Security',
      icon: ShieldCheck,
      badge: 'Role Guardrails',
      q: 'Can demo accounts access administrative functions?',
      a: 'No. Demo accounts are strictly non-administrative evaluation sessions. Backend authorization checks enforce student roles and immediately reject administrative operations with HTTP 403 Forbidden.',
    },
    {
      category: 'Themes & UI',
      icon: Palette,
      badge: '2 Color Modes',
      q: 'Can I switch between Light Mode and Night Mode?',
      a: 'Yes! MyCampus supports two high-contrast visual modes: a clean off-white Light Mode for daytime readability and a deep charcoal Night Mode with electric lime accents for late-night study sessions. Toggle between them anytime using the Sun/Moon icon in the header.',
    },
    {
      category: 'Gemini AI',
      icon: Bot,
      badge: 'Campus Copilot ⌘K',
      q: 'How does the floating Campus Copilot assistant help users?',
      a: 'Campus Copilot is our intelligent in-app assistant powered by Google Gemini. It has real-time awareness of all campus events, deadlines, and prep tasks. It strictly answers questions regarding MyCampus and campus life, helping students find events and navigate features seamlessly.',
      actionText: 'Open Copilot (⌘K)',
      actionTriggerCopilot: true,
    },
  ];

  const demoAccounts = [
    {
      id: 'demo1@mycampus.demo',
      role: 'Campus Explorer',
      user: 'Jordan Lee',
      year: '2nd Year Sophomore',
      summary: 'Exploring national hackathons, faculty keynotes, and student organization mixers.',
    },
    {
      id: 'demo2@mycampus.demo',
      role: 'Event Organizer',
      user: 'Maya Patel',
      year: '3rd Year Junior (ACM Vice Chair)',
      summary: 'Organizing collegiate DevSprints, auditorium AV checks, volunteer rosters, and sponsor booths.',
    },
    {
      id: 'demo3@mycampus.demo',
      role: 'AI Feature Tester',
      user: 'Devon Brooks',
      year: '4th Year Senior (AI Systems)',
      summary: 'Testing multimodal poster flyer OCR, text extraction prompts, and confidence calibration.',
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#111311] text-[#F3F0E8] font-sans selection:bg-[#C6FF3D] selection:text-[#111311]">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-50 bg-[#151713]/90 backdrop-blur-md border-b border-[#353830]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <MyCampusLogo size="sm" showSubtitle={true} subtitle="Your Event Journey" />
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#A5A89F]">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#F3F0E8] transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#F3F0E8] transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-[#F3F0E8] transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Theme Switcher */}
            <ThemeToggle variant="compact" />

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 rounded-xl bg-[#22251F] border border-[#353830] hover:border-[#C6FF3D] text-[#C6FF3D] text-xs font-medium transition-all shadow-card"
                >
                  Go to Dashboard →
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#A5A89F] hover:text-[#F3F0E8] hover:bg-[#22251F] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-xl bg-[#C6FF3D] text-[#111311] text-xs font-bold hover:bg-[#C6FF3D]/90 active:scale-95 transition-all shadow-card flex items-center gap-1.5"
                >
                  <span>Try Live Demo</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden bg-tech-grid">
        {/* Subtle glow backdrop */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none" 
          style={{ backgroundColor: 'var(--theme-accent-primary)', opacity: 0.08 }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Demo evaluation pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1D19] border border-[#353830] text-[11px] font-medium text-[#A5A89F] mb-6 shadow-card">
            <span className="w-2 h-2 rounded-full bg-[#C6FF3D] animate-pulse" />
            <span>Collegiate Judge Demo Environment</span>
            <span className="text-[#353830]">•</span>
            <span className="text-[#C6FF3D] font-mono">v1.0 Live</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-[#F3F0E8] tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Every Campus Event.{' '}
            <span className="text-[#C6FF3D] inline-block">One Smart Place.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#A5A89F] max-w-2xl mx-auto leading-relaxed">
            Discover campus activities, import messy flyers with multimodal Gemini AI, manage personalized timelines, and prepare effortlessly for hackathons, seminars, and club activities.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#C6FF3D] text-[#111311] font-bold text-sm hover:bg-[#C6FF3D]/90 active:scale-95 transition-all shadow-[0_0_20px_rgba(198,255,61,0.25)] flex items-center justify-center gap-2"
            >
              <span>Try Live Demo</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1A1D19] hover:bg-[#22251F] border border-[#353830] text-[#F3F0E8] text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Features</span>
              <ChevronDown className="w-4 h-4 text-[#777C72]" />
            </button>
          </div>

          {/* Demo Accounts Quick Glance */}
          <div className="mt-12 pt-8 border-t border-[#22251F] max-w-3xl mx-auto">
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#777C72] mb-3">
              Preset Demo Accounts for Judging • Shared Password: <span className="text-[#C6FF3D]">demo123</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              {demoAccounts.map((acc, idx) => (
                <div
                  key={acc.id}
                  onClick={() => navigate('/login')}
                  className="p-3 rounded-xl bg-[#151713] border border-[#353830] hover:border-[#C6FF3D]/60 cursor-pointer transition-all group shadow-card"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-[#C6FF3D] bg-[#22251F] px-1.5 py-0.5 rounded border border-[#353830]">
                      Demo {idx + 1}
                    </span>
                    <span className="text-[10px] text-[#777C72] font-mono truncate">{acc.id}</span>
                  </div>
                  <div className="font-semibold text-xs text-[#F3F0E8] group-hover:text-[#C6FF3D] transition-colors">
                    {acc.role}
                  </div>
                  <div className="text-[11px] text-[#777C72] truncate">{acc.user}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Product Dashboard Live Preview */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="rounded-2xl border border-[#353830] bg-[#151713] shadow-modal overflow-hidden p-2 sm:p-4">
            <div className="flex items-center justify-between pb-3 px-2 border-b border-[#22251F] text-xs text-[#777C72]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF7138]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#C6FF3D]/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#353830]" />
                <span className="font-mono text-[11px] ml-2 text-[#A5A89F]">MyCampus Command Center</span>
              </div>
              <span className="font-mono text-[11px] text-[#C6FF3D] hidden sm:inline-block">● Real SQLite & Gemini Active</span>
            </div>

            {/* Simulated Live UI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
              {/* Event Card Preview */}
              <div className="p-4 rounded-xl bg-[#1A1D19] border border-[#353830] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#22251F] text-[#C6FF3D] border border-[#353830]">
                      Hackathon
                    </span>
                    <span className="text-[10px] font-semibold text-[#C6FF3D] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D]" /> Registered
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#F3F0E8] leading-snug">
                    HackNova 2026: 36-Hour National Collegiate Hackathon
                  </h4>
                  <p className="text-xs text-[#A5A89F] mt-1.5 line-clamp-2">
                    36 hours of intensive engineering, collaborative AI prototyping, and $15,000 in prizes.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#22251F] flex items-center justify-between text-[11px] text-[#777C72]">
                  <span>Oct 17, 09:00 AM</span>
                  <span className="text-[#A5A89F]">Innovation Hall A</span>
                </div>
              </div>

              {/* Multimodal AI Importer Preview */}
              <div className="p-4 rounded-xl bg-[#1A1D19] border border-[#353830] flex flex-col justify-between relative overflow-hidden">
                <div 
                  className="absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none" 
                  style={{ backgroundColor: 'var(--theme-accent-primary)', opacity: 0.08 }}
                />
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#C6FF3D]" />
                    <span className="text-[11px] font-mono text-[#C6FF3D] font-bold">Gemini Vision OCR</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#151713] border border-[#353830] mb-2 font-mono text-[11px] text-[#A5A89F]">
                    <div className="text-[#C6FF3D]">✓ Extracted: Autonomous Drone Grand Prix</div>
                    <div className="text-[10px] text-[#777C72] mt-1">Confidence: 94% • 0 Fabrications</div>
                  </div>
                  <p className="text-xs text-[#A5A89F] leading-relaxed">
                    Accurately pulls date, venue, and suggested checklist tasks from uploaded event poster image.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#22251F] flex items-center justify-between text-[11px]">
                  <span className="text-[#777C72]">Provider: Gemini 2.5 Flash</span>
                  <span className="text-[#C6FF3D] font-mono">100% Deterministic</span>
                </div>
              </div>

              {/* Interactive Checklist Preview */}
              <div className="p-4 rounded-xl bg-[#1A1D19] border border-[#353830] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#F3F0E8] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C6FF3D]" />
                      Preparation Tasks
                    </span>
                    <span className="text-[10px] text-[#777C72] font-mono">Interactive</span>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div 
                      onClick={() => setInteractiveTaskChecked(!interactiveTaskChecked)}
                      className="p-2 rounded-lg bg-[#151713] border border-[#353830] hover:border-[#C6FF3D]/50 cursor-pointer transition-all flex items-center gap-2 text-xs"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${interactiveTaskChecked ? 'bg-[#C6FF3D] border-[#C6FF3D] text-[#111311]' : 'border-[#777C72]'}`}>
                        {interactiveTaskChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`truncate flex-1 ${interactiveTaskChecked ? 'line-through text-[#777C72]' : 'text-[#F3F0E8]'}`}>
                        Form team & register on Devpost
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#22251F] text-[#FF7138]">High</span>
                    </div>

                    <div className="p-2 rounded-lg bg-[#151713] border border-[#353830] flex items-center gap-2 text-xs opacity-75">
                      <div className="w-4 h-4 rounded border border-[#777C72] flex items-center justify-center" />
                      <span className="truncate flex-1 text-[#F3F0E8]">
                        Pack Ethernet dongle & charger
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#22251F] text-[#A5A89F]">Prep</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-[#22251F] flex items-center justify-between text-[11px] text-[#777C72]">
                  <span>Timeline Milestones: 25 items</span>
                  <span className="text-[#C6FF3D]">Auto-Synced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-20 border-t border-[#353830] bg-[#151713] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-[#C6FF3D] mb-2">
              Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold font-heading text-[#F3F0E8] tracking-tight">
              Engineered for the Modern Campus Journey
            </h3>
            <p className="mt-3 text-sm sm:text-base text-[#A5A89F]">
              Five core pillars that transform how students discover, track, and prepare for collegiate events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className={`p-6 rounded-2xl bg-[#1A1D19] border border-[#353830] hover:border-[#C6FF3D]/50 transition-all group shadow-card flex flex-col justify-between ${idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#22251F] border border-[#353830] group-hover:border-[#C6FF3D] flex items-center justify-center text-[#C6FF3D] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151713] text-[#A5A89F] border border-[#353830]">
                        {feat.badge}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold font-heading text-[#F3F0E8] group-hover:text-[#C6FF3D] transition-colors">
                      {feat.title}
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-[#A5A89F] leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#22251F] flex items-center gap-1 text-xs text-[#C6FF3D] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore in Live Demo</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="py-20 border-t border-[#353830] relative bg-[#111311]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-[#C6FF3D] mb-2">
              Simple 3-Step Workflow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold font-heading text-[#F3F0E8] tracking-tight">
              From Flyer to Front Row
            </h3>
            <p className="mt-3 text-sm text-[#A5A89F]">
              How students transform messy campus announcements into structured schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {steps.map((st, i) => (
              <div
                key={st.number}
                className="p-6 rounded-2xl bg-[#1A1D19] border border-[#353830] relative shadow-card"
              >
                <div className="font-mono text-3xl font-extrabold text-[#C6FF3D] mb-3">
                  {st.number}
                </div>
                <h4 className="text-base font-bold text-[#F3F0E8] mb-2 font-heading">
                  {st.title}
                </h4>
                <p className="text-xs text-[#A5A89F] leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Professional FAQ Section */}
      <section id="faq" className="py-24 border-t border-[#353830] bg-[#151713] relative overflow-hidden">
        {/* Subtle background ambient blur */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1D19] border border-[#353830] text-[#C6FF3D] text-xs font-semibold mb-3 shadow-xs">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Evaluation FAQ & Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F3F0E8] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#A5A89F] leading-relaxed">
              Transparent answers regarding the Google Gemini Vision engine, demo accounts, and data isolation.
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {['All', 'Judge Demo', 'Gemini AI', 'Privacy & Security', 'Themes & UI'].map((cat) => {
                const isSelected = selectedFaqCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedFaqCategory(cat)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150',
                      isSelected
                        ? 'bg-[#C6FF3D] text-[#111311] font-semibold shadow-xs'
                        : 'bg-[#1A1D19] hover:bg-[#22251F] text-[#A5A89F] hover:text-[#F3F0E8] border border-[#353830]'
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3.5">
            {faqs
              .filter((faq) => selectedFaqCategory === 'All' || faq.category === selectedFaqCategory)
              .map((faq, i) => {
                const isOpen = openFaq === i;
                const Icon = faq.icon;
                return (
                  <div
                    key={faq.q}
                    className={cn(
                      'rounded-2xl border transition-all duration-200 overflow-hidden',
                      isOpen
                        ? 'bg-[#1A1D19] border-[#C6FF3D]/70 shadow-lg ring-1 ring-[#C6FF3D]/20'
                        : 'bg-[#1A1D19] border-[#353830] hover:border-[#353830]/80 hover:shadow-xs'
                    )}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full p-4 sm:p-5 flex items-start justify-between text-left gap-4 group"
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors mt-0.5',
                            isOpen
                              ? 'bg-[#C6FF3D] text-[#111311] shadow-xs'
                              : 'bg-[#22251F] text-[#A5A89F] border border-[#353830] group-hover:text-[#F3F0E8]'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#777C72]">
                              {faq.category}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-[#777C72]" />
                            <span className="text-[10px] font-medium text-[#C6FF3D]">
                              {faq.badge}
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-[#F3F0E8] group-hover:text-[#C6FF3D] transition-colors leading-snug">
                            {faq.q}
                          </h3>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 mt-1',
                          isOpen
                            ? 'bg-[#C6FF3D]/10 text-[#C6FF3D] rotate-180'
                            : 'bg-[#22251F] text-[#777C72] group-hover:bg-[#22251F]/80 group-hover:text-[#F3F0E8]'
                        )}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-[13px] text-[#A5A89F] leading-relaxed border-t border-[#22251F] pt-4 pl-14 sm:pl-16">
                        <p>{faq.a}</p>
                        {faq.actionText && (
                          <div className="mt-4 pt-3 border-t border-[#22251F]/60 flex items-center gap-3">
                            <button
                              onClick={() => {
                                if (faq.actionUrl) navigate(faq.actionUrl);
                                else if (faq.actionAnchor) scrollToSection(faq.actionAnchor);
                                else if (faq.actionTriggerCopilot) triggerCopilot();
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C6FF3D] hover:underline"
                            >
                              <span>{faq.actionText}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Interactive "Need help?" Campus Copilot AI Callout */}
          <div className="mt-12 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#1A1D19] via-[#20251E] to-[#1A1D19] border border-[#353830] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C6FF3D] to-emerald-500 text-[#111311] flex items-center justify-center shadow-lg flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#F3F0E8]">
                  Have a specific question not listed here?
                </h4>
                <p className="text-xs text-[#A5A89F] mt-1">
                  Ask our in-app AI <strong>Campus Copilot</strong> anytime — it understands every event, deadline, and feature!
                </p>
              </div>
            </div>
            <button
              onClick={triggerCopilot}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C6FF3D] text-[#111311] text-xs font-bold shadow-md hover:bg-[#d6ff6f] transition-all hover:scale-105 active:scale-95 flex-shrink-0"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Copilot</span>
              <kbd className="hidden sm:inline bg-[#111311]/20 px-1.5 py-0.5 rounded text-[10px] font-mono">⌘K</kbd>
            </button>
          </div>
        </div>
      </section>

      {/* 7. Enhanced Professional Footer */}
      <footer className="py-14 border-t border-[#353830] bg-[#151713] text-xs text-[#777C72]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#22251F]">
            {/* Column 1: Brand */}
            <div className="md:col-span-2 space-y-3">
              <MyCampusLogo size="sm" showSubtitle={true} subtitle="Collegiate Evaluation" />
              <p className="text-xs text-[#A5A89F] max-w-sm leading-relaxed">
                Transform messy announcements and promotional flyers into a structured, unified campus event journey.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-[#C6FF3D]">
                <ShieldCheck className="w-4 h-4" />
                <span>Deterministic Validation • Zero Hallucination Vision</span>
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h5 className="font-mono text-[11px] uppercase tracking-wider text-[#F3F0E8] font-bold mb-3">
                Platform
              </h5>
              <ul className="space-y-2 text-xs text-[#A5A89F]">
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-[#C6FF3D] transition-colors">
                    Capabilities
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#C6FF3D] transition-colors">
                    3-Step Workflow
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('faq')} className="hover:text-[#C6FF3D] transition-colors">
                    Evaluation FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Evaluation Access */}
            <div>
              <h5 className="font-mono text-[11px] uppercase tracking-wider text-[#F3F0E8] font-bold mb-3">
                Evaluation Access
              </h5>
              <ul className="space-y-2 text-xs text-[#A5A89F]">
                <li>
                  <button onClick={() => navigate('/login')} className="text-[#C6FF3D] hover:underline font-semibold flex items-center gap-1">
                    <span>Try Judge Live Demo</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </li>
                <li className="text-[11px] text-[#777C72]">
                  Password: <code className="bg-[#1A1D19] px-1.5 py-0.5 rounded text-[#C6FF3D] font-mono">demo123</code>
                </li>
                <li className="text-[11px] text-[#777C72]">
                  Isolated SQLite Datasets
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>
              © 2026 MyCampus Project. All sample student and event records are fictional.
            </div>
            <div className="flex items-center gap-4 text-[#777C72]">
              <span>Privacy Guardrails Active</span>
              <span>•</span>
              <span>Powered by Google Gemini</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
