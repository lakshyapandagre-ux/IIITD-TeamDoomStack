import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  UserCheck, 
  Calendar, 
  ShieldAlert, 
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Code2,
  Users,
  BrainCircuit,
  Compass
} from 'lucide-react';
import { MyCampusLogo } from '../components/common/MyCampusLogo';
import { useAuth } from '../context/AuthContext';

interface DemoProfile {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  badge: string;
  year: string;
  department: string;
  description: string;
  highlights: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const DEMO_PROFILES: DemoProfile[] = [
  {
    id: 'demo1',
    email: 'demo1@mycampus.demo',
    password: 'demo123',
    name: 'Jordan Lee',
    role: 'Campus Explorer',
    badge: 'Demo Persona 1',
    year: '2nd Year (Sophomore)',
    department: 'Computer Science & Interactive Media',
    description: 'Active student exploring national collegiate hackathons, faculty keynotes, and student organization mixers.',
    highlights: ['Upcoming HackNova 2026', 'Personal Timeline Sync', 'Pre-Event Checklist Tasks'],
    icon: Compass,
  },
  {
    id: 'demo2',
    email: 'demo2@mycampus.demo',
    password: 'demo123',
    name: 'Maya Patel',
    role: 'Event Organizer',
    badge: 'Demo Persona 2',
    year: '3rd Year (Junior • ACM Vice Chair)',
    department: 'Software Systems & Management',
    description: 'Student leader coordinating collegiate DevSprints, auditorium AV logistics, catering contracts, and volunteer schedules.',
    highlights: ['Sample Organized Events', 'AV & Catering Checklists', 'Volunteer Roster Management'],
    icon: Users,
  },
  {
    id: 'demo3',
    email: 'demo3@mycampus.demo',
    password: 'demo123',
    name: 'Devon Brooks',
    role: 'AI Feature Tester',
    badge: 'Demo Persona 3',
    year: '4th Year (Senior)',
    department: 'Artificial Intelligence & Data Systems',
    description: 'Testing multimodal poster OCR, announcement text parsing, confidence scoring, and zero-hallucination validation.',
    highlights: ['Gemini Multimodal Vision OCR', 'Missing Field Honest Alerts', 'Automated Agenda Extraction'],
    icon: BrainCircuit,
  },
];

export const LoginPage: React.FC = () => {
  const { login, navigate, isSupabaseActive, signInWithSupabase } = useAuth();
  const [email, setEmail] = useState<string>('demo1@mycampus.demo');
  const [password, setPassword] = useState<string>('demo123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('demo1');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autofillToast, setAutofillToast] = useState<string | null>(null);

  const handleSelectProfile = (profile: DemoProfile) => {
    setSelectedProfileId(profile.id);
    setEmail(profile.email);
    setPassword(profile.password);
    setErrorMessage(null);
    setAutofillToast(`Autofilled credentials for ${profile.role}`);
    setTimeout(() => setAutofillToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      if (isSupabaseActive && !email.endsWith('@mycampus.demo') && signInWithSupabase) {
        await signInWithSupabase(email, password);
      } else {
        await login(email, password);
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Login failed. Please verify your credentials.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111311] text-[#F3F0E8] font-sans flex flex-col justify-between relative overflow-hidden bg-tech-grid">
      <div className="ambient-hero-glow" />

      {/* Top Header */}
      <header className="px-6 py-6 max-w-7xl w-full mx-auto flex items-center justify-between relative z-10">
        <MyCampusLogo 
          size="md" 
          showSubtitle 
          subtitle="Evaluation Portal" 
          onClick={() => navigate('/')} 
        />

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#A5A89F] hover:text-[#C6FF3D] px-3.5 py-2 rounded-xl border border-[#353830] bg-[#1A1D19]/80 backdrop-blur-md transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          <span>Back to Landing</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 relative z-10 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22251F] border border-[#353830] text-[#C6FF3D] text-xs font-mono font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 stroke-[2]" />
            <span>Collegiate Judge Demonstration Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F3F0E8] tracking-tight">
            Select a Demo Persona
          </h1>

          <p className="text-xs sm:text-sm text-[#A5A89F] max-w-lg mx-auto leading-relaxed">
            Choose an isolated demo profile below to 1-click autofill credentials and explore realistic campus data.
          </p>

          {autofillToast && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-[#C6FF3D] text-xs font-mono font-semibold animate-in fade-in zoom-in-95 duration-150">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{autofillToast}</span>
            </div>
          )}
        </div>

        {/* 3 Personas Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {DEMO_PROFILES.map((profile) => {
            const isSelected = selectedProfileId === profile.id;
            const IconComponent = profile.icon;

            return (
              <div
                key={profile.id}
                onClick={() => handleSelectProfile(profile)}
                className={`relative rounded-3xl p-6 border transition-all duration-200 cursor-pointer shadow-card flex flex-col justify-between card-interactive ${
                  isSelected
                    ? 'bg-[#1A1D19] border-[#C6FF3D] shadow-[0_4px_24px_-6px_rgba(198,255,61,0.25)]'
                    : 'bg-[#151713]/80 border-[#353830] hover:border-[#C6FF3D]/50 hover:bg-[#1A1D19]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-[#22251F] text-[#C6FF3D] border border-[#353830]">
                      {profile.badge}
                    </span>
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#C6FF3D] text-[#111311] border-[#C6FF3D]' : 'bg-[#22251F] text-[#777C72] border-[#353830]'
                    }`}>
                      <IconComponent className="w-4 h-4 stroke-[2]" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold font-heading text-[#F3F0E8] leading-tight">
                    {profile.role}
                  </h3>
                  <p className="text-xs font-semibold text-[#A5A89F] mt-0.5">
                    {profile.name} • <span className="text-[#777C72]">{profile.year}</span>
                  </p>

                  <p className="text-xs text-[#777C72] mt-3 leading-relaxed">
                    {profile.description}
                  </p>

                  {/* Persona Highlights */}
                  <div className="mt-4 pt-3 border-t border-[#292D27] space-y-1.5">
                    {profile.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-[#A5A89F]">
                        <CheckCircle2 className="w-3 h-3 text-[#C6FF3D] flex-shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#292D27] flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-[#777C72]">
                    {profile.email}
                  </span>
                  <span className={`font-semibold font-mono text-[11px] ${isSelected ? 'text-[#C6FF3D]' : 'text-[#777C72]'}`}>
                    {isSelected ? '✓ Selected' : 'Select →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sign In Form Box */}
        <div className="max-w-md w-full mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-[#353830] shadow-modal">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-[#FF7138]/10 border border-[#FF7138]/30 flex items-start gap-2.5 text-xs text-[#FF7138]">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-[#A5A89F] mb-1.5 tracking-wider">
                Demo Account Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777C72]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo1@mycampus.demo"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#111311] text-[#F3F0E8] border border-[#353830] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#C6FF3D] focus:ring-1 focus:ring-[#C6FF3D] font-mono transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-[#A5A89F] mb-1.5 tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777C72]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="demo123"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#111311] text-[#F3F0E8] border border-[#353830] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#C6FF3D] focus:ring-1 focus:ring-[#C6FF3D] font-mono transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#777C72] hover:text-[#F3F0E8] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-[#777C72] mt-1.5 font-mono">
                Universal preset demo password: <span className="text-[#C6FF3D] font-bold">demo123</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#C6FF3D] hover:bg-[#C6FF3D]/90 text-[#111311] font-bold text-xs sm:text-sm transition-all shadow-[0_4px_20px_-4px_rgba(198,255,61,0.4)] flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-[#111311] border-t-transparent animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {DEMO_PROFILES.find((p) => p.email === email)?.role || 'Judge'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="px-6 py-6 max-w-7xl w-full mx-auto text-center relative z-10 border-t border-[#353830]/60">
        <p className="text-xs text-[#777C72] font-mono">
          🔒 Fictional collegiate evaluation dataset • No real student records collected • Isolated per-account SQLite sandbox
        </p>
      </footer>
    </div>
  );
};
