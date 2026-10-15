import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  CalendarCheck2, 
  Layers,
  Sparkles,
  Code2,
  Mic,
  Wrench,
  Palette,
  Briefcase,
  Trophy,
  GraduationCap,
  X
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { EventCard } from '../components/events/EventCard';
import { EmptyState } from '../components/common/EmptyState';
import { CampusEvent, EventCategory } from '../types';

type StatusFilter = 'all' | 'registered' | 'waitlisted' | 'attended';

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'all': Layers,
  'Hackathon': Code2,
  'Tech Talk': Mic,
  'Workshop': Wrench,
  'Cultural': Palette,
  'Career': Briefcase,
  'Sports': Trophy,
  'Academic': GraduationCap,
};

export const MyEvents: React.FC = () => {
  const { 
    events, 
    registeredEvents, 
    setIsAddEventModalOpen,
    setActivePage 
  } = useEvents();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');

  const categories: ('all' | EventCategory)[] = [
    'all',
    'Hackathon',
    'Tech Talk',
    'Workshop',
    'Cultural',
    'Career',
    'Sports',
    'Academic',
  ];

  // Filter user's events
  const filteredEvents = useMemo(() => {
    return events.filter((e: CampusEvent) => {
      const isMyEvent = e.registrationStatus !== 'not_registered';
      if (!isMyEvent) return false;

      if (statusFilter !== 'all' && e.registrationStatus !== statusFilter) {
        return false;
      }

      if (categoryFilter !== 'all' && e.category !== categoryFilter) {
        return false;
      }

      if (localSearch.trim()) {
        const query = localSearch.toLowerCase();
        const matchesTitle = e.title.toLowerCase().includes(query);
        const matchesVenue = e.venue.toLowerCase().includes(query);
        const matchesOrganizer = e.organizer.toLowerCase().includes(query);
        const matchesTags = e.tags.some((t: string) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesVenue && !matchesOrganizer && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [events, statusFilter, categoryFilter, localSearch]);

  const counts = useMemo(() => {
    const myEventsList = events.filter((e: CampusEvent) => e.registrationStatus !== 'not_registered');
    return {
      all: myEventsList.length,
      registered: myEventsList.filter((e: CampusEvent) => e.registrationStatus === 'registered').length,
      waitlisted: myEventsList.filter((e: CampusEvent) => e.registrationStatus === 'waitlisted').length,
      attended: myEventsList.filter((e: CampusEvent) => e.registrationStatus === 'attended').length,
    };
  }, [events]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22251F] border border-[#353830] text-[#C6FF3D] text-xs font-mono font-semibold mb-2 shadow-sm">
            <CalendarCheck2 className="w-3.5 h-3.5 stroke-[2]" />
            <span>Enrolled Activities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F3F0E8] tracking-tight">
            My Enrolled Events
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A89F] mt-1">
            Personal calendar of confirmed RSVPs, waitlisted spots, and past completions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActivePage('discover')}
            className="px-4 py-2 rounded-xl border border-[#353830] bg-[#1A1D19] text-[#A5A89F] hover:text-[#F3F0E8] hover:bg-[#22251F] text-xs font-semibold transition-all shadow-sm active:scale-95"
          >
            Discover Catalog
          </button>
          <button
            onClick={() => setIsAddEventModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C6FF3D] hover:bg-[#C6FF3D]/90 text-[#111311] text-xs font-bold transition-all shadow-[0_4px_16px_-4px_rgba(198,255,61,0.35)] active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-3xl p-5 border border-[#353830] shadow-card space-y-4">
        {/* Status Tabs & Search */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#353830]/80 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shadow-sm ${
                statusFilter === 'all'
                  ? 'bg-[#C6FF3D] text-[#111311] shadow-[0_2px_12px_-2px_rgba(198,255,61,0.35)]'
                  : 'bg-[#1A1D19] text-[#A5A89F] hover:text-[#F3F0E8] border border-[#353830]'
              }`}
            >
              All Enrolled ({counts.all})
            </button>
            <button
              onClick={() => setStatusFilter('registered')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shadow-sm ${
                statusFilter === 'registered'
                  ? 'bg-[#C6FF3D] text-[#111311] shadow-[0_2px_12px_-2px_rgba(198,255,61,0.35)]'
                  : 'bg-[#1A1D19] text-[#A5A89F] hover:text-[#F3F0E8] border border-[#353830]'
              }`}
            >
              Registered ({counts.registered})
            </button>
            <button
              onClick={() => setStatusFilter('waitlisted')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shadow-sm ${
                statusFilter === 'waitlisted'
                  ? 'bg-[#FF7138] text-white shadow-[0_2px_12px_-2px_rgba(255,113,56,0.35)]'
                  : 'bg-[#1A1D19] text-[#A5A89F] hover:text-[#F3F0E8] border border-[#353830]'
              }`}
            >
              Waitlisted ({counts.waitlisted})
            </button>
            <button
              onClick={() => setStatusFilter('attended')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shadow-sm ${
                statusFilter === 'attended'
                  ? 'bg-[#F3F0E8] text-[#111311] shadow-[0_2px_12px_-2px_rgba(243,240,232,0.35)]'
                  : 'bg-[#1A1D19] text-[#A5A89F] hover:text-[#F3F0E8] border border-[#353830]'
              }`}
            >
              Attended ({counts.attended})
            </button>
          </div>

          <div className="w-full sm:w-72 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777C72]" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search your saved events..."
              className="w-full pl-9 pr-8 py-2 bg-[#1A1D19] text-[#F3F0E8] placeholder:text-[#777C72] border border-[#353830] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#C6FF3D] focus:ring-1 focus:ring-[#C6FF3D] transition-all shadow-sm"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#777C72] hover:text-[#F3F0E8] rounded-md hover:bg-[#22251F]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-[#777C72] mr-1 flex items-center gap-1 font-mono uppercase font-semibold">
            <Filter className="w-3 h-3 stroke-[2]" />
            Category:
          </span>
          {categories.map((cat) => {
            const isSelected = categoryFilter === cat;
            const IconComponent = categoryIconMap[cat] || Sparkles;

            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border shadow-sm ${
                  isSelected
                    ? 'bg-[#22251F] text-[#C6FF3D] border-[#C6FF3D]'
                    : 'bg-[#1A1D19] text-[#A5A89F] hover:text-[#F3F0E8] border-[#353830]'
                }`}
              >
                <IconComponent className={`w-3 h-3 stroke-[2] ${isSelected ? 'text-[#C6FF3D]' : 'text-[#777C72]'}`} />
                <span>{cat === 'all' ? 'All Categories' : cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={CalendarCheck2}
          title="No enrolled events match your filter"
          description="You can browse the full campus directory and register for hackathons, career workshops, or tech talks."
          actionLabel="Discover Campus Events"
          onAction={() => setActivePage('discover')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt: CampusEvent) => (
            <EventCard key={evt.id} event={evt} showQuickRegister />
          ))}
        </div>
      )}
    </div>
  );
};
