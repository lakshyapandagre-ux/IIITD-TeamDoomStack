import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  MapPin, 
  ChevronRight, 
  BookmarkCheck,
  Flame,
  Sparkles,
  TrendingUp,
  CalendarDays,
  Target,
  ListTodo
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { EventCard } from '../components/events/EventCard';
import { TaskItem } from '../components/tasks/TaskItem';
import { CategoryBadge } from '../components/common/Badge';
import { formatDate, getDaysRemaining } from '../lib/utils';
import { CampusEvent, PrepTask, PendingDeadline } from '../types';

export const Dashboard: React.FC = () => {
  const { 
    events, 
    registeredEvents, 
    tasks, 
    deadlines, 
    profile, 
    setActivePage, 
    openEventDetail,
    setIsAddEventModalOpen,
    setIsAddTaskModalOpen,
    updateEventRegistration
  } = useEvents();

  // Find the closest upcoming event from registered events
  const nextEvent = useMemo(() => {
    const sorted = [...registeredEvents].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return sorted[0] || events[0];
  }, [registeredEvents, events]);

  // Live countdown state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!nextEvent?.startDate) return;

    const calculateTime = () => {
      const target = new Date(`${nextEvent.startDate}T10:00:00`).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft((prev) => {
          if (
            prev.days === days &&
            prev.hours === hours &&
            prev.minutes === minutes &&
            prev.seconds === seconds
          ) {
            return prev;
          }
          return { days, hours, minutes, seconds };
        });
      } else {
        setTimeLeft((prev) => {
          if (prev.days === 0 && prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
            return prev;
          }
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [nextEvent?.startDate]);

  const completedTasksCount = tasks.filter((t: PrepTask) => t.isCompleted).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  // Upcoming 7 days events count
  const upcomingNext7Days = useMemo(() => {
    return events.filter((e) => {
      const days = getDaysRemaining(e.startDate);
      return days >= 0 && days <= 7;
    });
  }, [events]);

  // Week schedule dates
  const weekDays = [
    { day: 'Mon', date: '12', hasEvent: false, label: '' },
    { day: 'Tue', date: '13', isToday: true, hasEvent: false, label: 'Today' },
    { day: 'Wed', date: '14', hasEvent: false, label: '' },
    { day: 'Thu', date: '15', hasEvent: true, label: 'RSVP' },
    { day: 'Fri', date: '16', hasEvent: true, label: 'AI Talk' },
    { day: 'Sat', date: '17', hasEvent: true, label: 'HackNova' },
    { day: 'Sun', date: '18', hasEvent: true, label: 'Demos' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Hero Welcome Command Header */}
      <div className="relative bg-[#1A1D19] rounded-3xl p-6 sm:p-8 border border-[#353830] shadow-card overflow-hidden">
        <div className="ambient-hero-glow" />
        <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Greeting & Summary */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22251F] border border-[#353830] text-[#C6FF3D] text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C6FF3D] animate-pulse" />
              <span>Fall Semester 2026</span>
              <span className="text-[#353830]">•</span>
              <span className="text-[#A5A89F] font-normal">Academic Session</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F3F0E8] tracking-tight leading-tight">
                Welcome back, <span className="text-[#C6FF3D]">{profile?.name.split(' ')[0] || 'Jordan'}</span> 👋
              </h1>
              <p className="text-sm sm:text-base text-[#A5A89F] max-w-xl leading-relaxed">
                Your campus schedule is synchronized. You are enrolled in{' '}
                <strong className="text-[#F3F0E8] font-semibold">{registeredEvents.length} events</strong> with{' '}
                <strong className="text-[#FF7138] font-semibold">{deadlines.length} action deadlines</strong> and{' '}
                <strong className="text-[#C6FF3D] font-semibold">{progressPercent}%</strong> prep progress.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setIsAddEventModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#C6FF3D] text-[#111311] font-bold text-xs hover:bg-[#C6FF3D]/90 transition-all flex items-center gap-2 shadow-[0_4px_16px_-4px_rgba(198,255,61,0.35)] active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Event</span>
              </button>
              <button
                onClick={() => setIsAddTaskModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#22251F] hover:bg-[#22251F]/80 text-[#F3F0E8] border border-[#353830] text-xs font-semibold transition-all flex items-center gap-2 hover:border-[#C6FF3D]/60 active:scale-95"
              >
                <ListTodo className="w-4 h-4 text-[#C6FF3D] stroke-[2]" />
                <span>Add Task</span>
              </button>
              <button
                onClick={() => setActivePage('timeline')}
                className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-[#22251F] text-[#A5A89F] hover:text-[#F3F0E8] border border-[#353830] text-xs font-medium transition-all active:scale-95"
              >
                <span>View Timeline</span>
              </button>
            </div>
          </div>

          {/* Right Column: Clean Milestone Card */}
          {nextEvent && (
            <div className="lg:col-span-5 bg-[#151713] p-5 sm:p-6 rounded-2xl border border-[#353830] shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#292D27]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C6FF3D]" />
                  <span className="font-bold text-xs uppercase tracking-wider text-[#A5A89F]">Next Milestone</span>
                </div>
                <CategoryBadge category={nextEvent.category} size="sm" />
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-bold font-heading text-[#F3F0E8] truncate" title={nextEvent.title}>
                  {nextEvent.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-[#777C72] mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C6FF3D]" />
                    <span>{formatDate(nextEvent.startDate)}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 truncate max-w-[150px]">
                    <MapPin className="w-3.5 h-3.5 text-[#FF7138]" />
                    <span className="truncate">{nextEvent.room || nextEvent.venue}</span>
                  </span>
                </div>
              </div>

              {/* Perfectly Proportioned Countdown Grid */}
              <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                <div className="bg-[#1A1D19] py-2.5 px-1.5 rounded-xl border border-[#353830]">
                  <span className="text-lg sm:text-xl font-extrabold font-heading text-[#C6FF3D] block leading-none">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-[#777C72] font-semibold mt-1 block">Days</span>
                </div>
                <div className="bg-[#1A1D19] py-2.5 px-1.5 rounded-xl border border-[#353830]">
                  <span className="text-lg sm:text-xl font-extrabold font-heading text-[#C6FF3D] block leading-none">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-[#777C72] font-semibold mt-1 block">Hours</span>
                </div>
                <div className="bg-[#1A1D19] py-2.5 px-1.5 rounded-xl border border-[#353830]">
                  <span className="text-lg sm:text-xl font-extrabold font-heading text-[#C6FF3D] block leading-none">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-[#777C72] font-semibold mt-1 block">Mins</span>
                </div>
                <div className="bg-[#1A1D19] py-2.5 px-1.5 rounded-xl border border-[#353830]">
                  <span className="text-lg sm:text-xl font-extrabold font-heading text-[#FF7138] block leading-none">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-[#777C72] font-semibold mt-1 block">Secs</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#292D27] flex items-center justify-between">
                <span className="text-[11px] text-[#777C72]">
                  {nextEvent.registrationStatus === 'registered' ? 'Confirmed Participant' : 'Registration Open'}
                </span>
                <button
                  onClick={() => openEventDetail(nextEvent)}
                  className="text-xs font-bold text-[#C6FF3D] hover:underline flex items-center gap-1 active:scale-95"
                >
                  <span>Event Details</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bento 1: Registered Events */}
        <div 
          onClick={() => setActivePage('my-events')}
          className="card-interactive bg-[#1A1D19] p-5 rounded-2xl border border-[#353830] hover:border-[#C6FF3D]/70 cursor-pointer group shadow-card flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#777C72]">Registered Events</span>
              <div className="w-8 h-8 rounded-xl bg-[#22251F] border border-[#353830] flex items-center justify-center text-[#C6FF3D] shadow-sm">
                <BookmarkCheck className="w-4 h-4 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-heading text-[#F3F0E8]">{registeredEvents.length}</span>
              <span className="text-xs text-[#777C72] font-mono">confirmed</span>
            </div>
          </div>
          <p className="text-xs text-[#A5A89F] mt-4 flex items-center gap-1 group-hover:text-[#C6FF3D] transition-colors font-medium">
            <span>View all enrolled</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
          </p>
        </div>

        {/* Bento 2: Upcoming 7 Days */}
        <div 
          onClick={() => setActivePage('timeline')}
          className="card-interactive bg-[#1A1D19] p-5 rounded-2xl border border-[#353830] hover:border-[#C6FF3D]/70 cursor-pointer group shadow-card flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#777C72]">Upcoming in 7 Days</span>
              <div className="w-8 h-8 rounded-xl bg-[#22251F] border border-[#353830] flex items-center justify-center text-[#C6FF3D] shadow-sm">
                <CalendarDays className="w-4 h-4 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-heading text-[#F3F0E8]">{upcomingNext7Days.length}</span>
              <span className="text-xs text-[#777C72] font-mono">active events</span>
            </div>
          </div>
          <p className="text-xs text-[#A5A89F] mt-4 flex items-center gap-1 group-hover:text-[#C6FF3D] transition-colors font-medium">
            <span>Open schedule</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
          </p>
        </div>

        {/* Bento 3: Pending Deadlines */}
        <div 
          onClick={() => setActivePage('timeline')}
          className="card-interactive bg-[#1A1D19] p-5 rounded-2xl border border-[#353830] hover:border-[#FF7138]/70 cursor-pointer group shadow-card flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#777C72]">Pending Deadlines</span>
              <div className="w-8 h-8 rounded-xl bg-[#22251F] border border-[#353830] flex items-center justify-center text-[#FF7138] shadow-sm">
                <Clock className="w-4 h-4 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-heading text-[#F3F0E8]">{deadlines.length}</span>
              <span className="text-xs text-[#FF7138] font-mono font-semibold">action items</span>
            </div>
          </div>
          <p className="text-xs text-[#A5A89F] mt-4 flex items-center gap-1 group-hover:text-[#FF7138] transition-colors font-medium">
            <span>View deadlines</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
          </p>
        </div>

        {/* Bento 4: Prep Checklist Progress */}
        <div className="card-interactive bg-[#1A1D19] p-5 rounded-2xl border border-[#353830] shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#777C72]">Checklist Progress</span>
              <div className="w-8 h-8 rounded-xl bg-[#22251F] border border-[#353830] flex items-center justify-center text-[#C6FF3D] shadow-sm">
                <CheckCircle2 className="w-4 h-4 stroke-[2]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-heading text-[#F3F0E8]">{progressPercent}%</span>
              <span className="text-xs text-[#777C72] font-mono">
                {completedTasksCount}/{tasks.length} tasks
              </span>
            </div>
          </div>

          <div className="w-full bg-[#22251F] rounded-full h-2 mt-4 overflow-hidden border border-[#353830]">
            <div 
              className="bg-[#C6FF3D] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#C6FF3D]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Featured Event Spotlight */}
      {nextEvent && (
        <div className="bg-[#151713] rounded-3xl border border-[#353830] p-6 sm:p-8 shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-[#353830] mb-6">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#FF7138] stroke-[2.5]" />
              <h3 className="font-heading font-bold text-sm text-[#F3F0E8] uppercase tracking-wider font-mono">
                Spotlight Event
              </h3>
            </div>
            <span className="text-xs text-[#C6FF3D] font-mono font-semibold bg-[#22251F] px-2.5 py-1 rounded-lg border border-[#353830]">
              {nextEvent.registrationStatus === 'registered' ? 'Confirmed RSVP' : 'Open Registration'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Poster */}
            <div className="lg:col-span-5 h-56 rounded-2xl overflow-hidden bg-[#22251F] border border-[#353830] relative group">
              <img
                src={nextEvent.bannerImage}
                alt={nextEvent.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151713] via-transparent to-black/40" />

              <div className="absolute top-3 left-3">
                <CategoryBadge category={nextEvent.category} />
              </div>
            </div>

            {/* Event Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-[#777C72] font-medium">
                  Hosted by {nextEvent.organizer}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#F3F0E8] tracking-tight">
                  {nextEvent.title}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-[#A5A89F] leading-relaxed">
                {nextEvent.shortDescription}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-[#1A1D19] p-3 rounded-xl border border-[#353830] min-w-0">
                  <span className="text-[10px] text-[#777C72] block font-mono font-semibold uppercase">Schedule</span>
                  <p className="text-xs font-semibold text-[#F3F0E8] mt-0.5 truncate">{formatDate(nextEvent.startDate)}</p>
                  <p className="text-[11px] text-[#A5A89F] font-mono truncate">{nextEvent.startTime}</p>
                </div>

                <div className="bg-[#1A1D19] p-3 rounded-xl border border-[#353830] min-w-0">
                  <span className="text-[10px] text-[#777C72] block font-mono font-semibold uppercase">Venue</span>
                  <p className="text-xs font-semibold text-[#F3F0E8] mt-0.5 truncate" title={nextEvent.venue}>{nextEvent.venue}</p>
                  <p className="text-[11px] text-[#A5A89F] truncate">{nextEvent.room || 'Main Auditorium'}</p>
                </div>

                <div className="bg-[#1A1D19] p-3 rounded-xl border border-[#353830] col-span-2 sm:col-span-1 min-w-0">
                  <span className="text-[10px] text-[#777C72] block font-mono font-semibold uppercase">Deadline</span>
                  <p className="text-xs font-semibold text-[#FF7138] mt-0.5 truncate">{formatDate(nextEvent.registrationDeadline)}</p>
                  <p className="text-[11px] text-[#A5A89F] truncate">{nextEvent.registrationFee || 'Free Entry'}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => openEventDetail(nextEvent)}
                  className="px-4 py-2.5 rounded-xl bg-[#C6FF3D] hover:bg-[#C6FF3D]/90 text-[#111311] font-bold text-xs transition-all shadow-card flex items-center gap-1.5 active:scale-95"
                >
                  <span>View Full Details</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => {
                    updateEventRegistration(
                      nextEvent.id,
                      nextEvent.registrationStatus === 'registered' ? 'not_registered' : 'registered'
                    );
                  }}
                  className={`px-4 py-2.5 rounded-xl border border-[#353830] text-xs font-semibold transition-all active:scale-95 ${
                    nextEvent.registrationStatus === 'registered'
                      ? 'bg-[#22251F] text-[#FF7138] hover:border-[#FF7138]'
                      : 'bg-[#22251F] text-[#C6FF3D] hover:border-[#C6FF3D]'
                  }`}
                >
                  {nextEvent.registrationStatus === 'registered' ? 'Cancel RSVP' : 'Register Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Events Catalog Rail */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-heading text-[#F3F0E8] tracking-tight">
              Curated Upcoming Events
            </h3>
            <p className="text-xs text-[#777C72]">Handpicked opportunities on your campus</p>
          </div>
          <button
            onClick={() => setActivePage('discover')}
            className="text-xs font-semibold text-[#C6FF3D] hover:underline flex items-center gap-1"
          >
            <span>Explore all ({events.length})</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 3).map((evt: CampusEvent) => (
            <EventCard key={evt.id} event={evt} showQuickRegister />
          ))}
        </div>
      </div>

      {/* Weekly Schedule & Preparation Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Schedule Strip */}
        <div className="lg:col-span-7 bg-[#151713] rounded-3xl p-5 sm:p-6 border border-[#353830] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#353830]">
            <div>
              <h3 className="text-sm font-bold font-heading text-[#F3F0E8]">
                Weekly Calendar Strip
              </h3>
              <p className="text-xs text-[#777C72]">October 12 – 18, 2026</p>
            </div>
            <button
              onClick={() => setActivePage('timeline')}
              className="text-xs font-semibold text-[#C6FF3D] hover:underline flex items-center gap-1"
            >
              <span>Full timeline</span>
              <ChevronRight className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((wd) => (
              <div
                key={wd.day}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  wd.isToday
                    ? 'bg-[#C6FF3D] text-[#111311] border-[#C6FF3D] font-bold shadow-md'
                    : wd.hasEvent
                    ? 'bg-[#1A1D19] text-[#F3F0E8] border-[#353830]'
                    : 'bg-[#151713] text-[#777C72] border-[#22251F]'
                }`}
              >
                <span className={`text-[10px] block font-mono ${wd.isToday ? 'text-[#111311] font-bold' : 'text-[#777C72]'}`}>
                  {wd.day}
                </span>
                <span className={`text-base font-bold block mt-0.5 ${wd.isToday ? 'text-[#111311]' : 'text-[#F3F0E8]'}`}>
                  {wd.date}
                </span>
                {wd.hasEvent && (
                  <div className="mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${wd.isToday ? 'bg-[#111311]' : 'bg-[#C6FF3D]'}`} />
                    {wd.label && (
                      <span className={`text-[9px] hidden sm:block truncate mt-0.5 font-mono ${wd.isToday ? 'text-[#111311] font-bold' : 'text-[#A5A89F]'}`}>
                        {wd.label}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pending Deadlines Sub-list */}
          <div className="pt-2 border-t border-[#353830] space-y-2">
            <span className="text-xs text-[#777C72] font-mono uppercase tracking-wider block">
              Urgent Deadlines
            </span>
            {deadlines.length === 0 ? (
              <p className="text-xs text-[#777C72] py-2">No pending deadlines.</p>
            ) : (
              deadlines.slice(0, 3).map((dl: PendingDeadline) => (
                <div key={dl.id} className="p-3 bg-[#1A1D19] rounded-xl border border-[#353830] flex items-center justify-between gap-3 card-interactive">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#F3F0E8] truncate">{dl.title}</span>
                      {dl.isUrgent && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF7138]/10 text-[#FF7138] border border-[#FF7138]/30">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#777C72] mt-0.5 font-mono">
                      {dl.eventTitle} • Due {formatDate(dl.deadlineDate)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const related = events.find((e) => e.id === dl.eventId);
                      if (related) openEventDetail(related);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#22251F] hover:bg-[#C6FF3D] hover:text-[#111311] text-[#C6FF3D] text-xs font-semibold border border-[#353830] transition-colors"
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Preparation Checklist */}
        <div className="lg:col-span-5 bg-[#151713] rounded-3xl p-5 sm:p-6 border border-[#353830] shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#353830]">
            <div>
              <h3 className="text-sm font-bold font-heading text-[#F3F0E8]">
                Preparation Checklist
              </h3>
              <p className="text-xs text-[#777C72]">Tasks for registered events</p>
            </div>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="p-1.5 rounded-xl bg-[#22251F] border border-[#353830] text-[#C6FF3D] hover:border-[#C6FF3D] transition-colors"
              title="Add task"
              aria-label="Add task"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.slice(0, 5).map((task: PrepTask) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>

          <div className="pt-2 border-t border-[#353830] flex items-center justify-between text-xs">
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="text-[#C6FF3D] hover:underline font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add task</span>
            </button>
            <button
              onClick={() => setActivePage('timeline')}
              className="text-[#777C72] hover:text-[#F3F0E8] font-medium flex items-center gap-1"
            >
              <span>All tasks</span>
              <ChevronRight className="w-3 h-3 stroke-[2]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
