import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Search, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  Users,
  Flame,
  ArrowRight,
  Code2,
  Mic,
  Wrench,
  Palette,
  Briefcase,
  Trophy,
  GraduationCap,
  Layers,
  X
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { EventCard } from '../components/events/EventCard';
import { EmptyState } from '../components/common/EmptyState';
import { CategoryBadge } from '../components/common/Badge';
import { CampusEvent, EventCategory } from '../types';
import { formatDate } from '../lib/utils';

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

export const DiscoverEvents: React.FC = () => {
  const { events, openEventDetail, updateEventRegistration } = useEvents();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const featuredEvent = events.find((e: CampusEvent) => e.isFeatured) || events[0];

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

  const venues = [
    { label: 'All Campus Venues', value: 'all' },
    { label: 'Student Innovation Center', value: 'Student Innovation Center' },
    { label: 'Turing Lecture Hall', value: 'Turing Lecture Hall' },
    { label: 'University Recreation Pavilion', value: 'University Recreation Pavilion' },
    { label: 'Campus Amphitheater', value: 'Campus Amphitheater' },
    { label: 'Gates Computer Lab', value: 'Gates Computer Lab' },
    { label: 'Virtual (Online)', value: 'Virtual' },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((e: CampusEvent) => {
      if (selectedCategory !== 'all' && e.category !== selectedCategory) {
        return false;
      }

      if (selectedVenue !== 'all') {
        if (selectedVenue === 'Virtual' && !e.isVirtual) return false;
        if (selectedVenue !== 'Virtual' && !e.venue.includes(selectedVenue)) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = e.title.toLowerCase().includes(query);
        const matchesDesc = e.shortDescription.toLowerCase().includes(query);
        const matchesVenue = e.venue.toLowerCase().includes(query);
        const matchesOrganizer = e.organizer.toLowerCase().includes(query);
        const matchesTags = e.tags.some((t: string) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesVenue && !matchesOrganizer && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [events, selectedCategory, selectedVenue, searchQuery]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header section with gradient headline */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22251F] border border-[#353830] text-[#C6FF3D] text-xs font-mono font-semibold mb-2 shadow-sm">
            <Compass className="w-3.5 h-3.5 stroke-[2]" />
            <span>Campus Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F3F0E8] tracking-tight">
            Discover Campus Events
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A89F] mt-1">
            Browse hackathons, technical workshops, guest speaker panels, and recreational mixers.
          </p>
        </div>

        <div className="text-xs text-[#777C72] font-mono">
          Showing <span className="text-[#C6FF3D] font-bold">{filteredEvents.length}</span> of {events.length} events
        </div>
      </div>

      {/* Featured Spotlight Banner */}
      {featuredEvent && (
        <div 
          onClick={() => openEventDetail(featuredEvent)}
          className="relative bg-[#151713] rounded-3xl overflow-hidden border border-[#353830] shadow-card cursor-pointer group p-6 sm:p-8 transition-all hover:border-[#C6FF3D]/70"
        >
          <div className="ambient-hero-glow" />
          <div className="flex items-center justify-between pb-4 border-b border-[#353830]/80 mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FF7138]/10 text-[#FF7138] text-xs font-mono font-bold border border-[#FF7138]/30">
                <Flame className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Featured Showcase</span>
              </span>
            </div>
            <span className="text-xs text-[#A5A89F] font-mono">
              RSVP Closes {formatDate(featuredEvent.registrationDeadline)}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <CategoryBadge category={featuredEvent.category} size="md" />
                <span className="text-xs text-[#777C72] font-medium">• Hosted by {featuredEvent.organizer}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#F3F0E8] tracking-tight group-hover:text-[#C6FF3D] transition-colors">
                {featuredEvent.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#A5A89F] leading-relaxed line-clamp-3">
                {featuredEvent.fullDescription || featuredEvent.shortDescription}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="glass-card p-3 rounded-xl border border-[#353830]">
                  <span className="text-[10px] text-[#777C72] font-mono uppercase font-semibold block">Date & Time</span>
                  <span className="text-xs font-semibold text-[#F3F0E8] mt-0.5 block truncate">
                    {formatDate(featuredEvent.startDate)}
                  </span>
                  <span className="text-[11px] text-[#A5A89F] font-mono">
                    {featuredEvent.startTime}
                  </span>
                </div>

                <div className="glass-card p-3 rounded-xl border border-[#353830]">
                  <span className="text-[10px] text-[#777C72] font-mono uppercase font-semibold block">Location</span>
                  <span className="text-xs font-semibold text-[#F3F0E8] mt-0.5 block truncate">
                    {featuredEvent.venue}
                  </span>
                  <span className="text-[11px] text-[#A5A89F] font-mono truncate">
                    {featuredEvent.room || 'Main Hall'}
                  </span>
                </div>

                <div className="glass-card p-3 rounded-xl border border-[#353830] col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[#777C72] font-mono uppercase font-semibold block">Capacity</span>
                  <span className="text-xs font-semibold text-[#C6FF3D] mt-0.5 block font-mono">
                    {featuredEvent.attendeesCount} / {featuredEvent.capacity || 'Unlimited'}
                  </span>
                  <span className="text-[11px] text-[#A5A89F] font-mono">
                    {featuredEvent.registrationFee || 'Free'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEventDetail(featuredEvent);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#C6FF3D] text-[#111311] font-bold text-xs hover:bg-[#C6FF3D]/90 transition-all flex items-center gap-2 shadow-[0_4px_16px_-4px_rgba(198,255,61,0.35)] active:scale-95"
                >
                  <span>Explore Schedule & Speakers</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Poster Media Box */}
            <div className="lg:col-span-5 h-64 sm:h-72 rounded-2xl overflow-hidden bg-[#22251F] border border-[#353830] relative group shadow-md">
              <img
                src={featuredEvent.bannerImage}
                alt={featuredEvent.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151713] via-transparent to-black/30" />
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar Row */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777C72]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, organizer, keyword, or #tag..."
              className="w-full pl-10 pr-10 py-2.5 bg-[#1A1D19] text-[#F3F0E8] placeholder:text-[#777C72] border border-[#353830] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#C6FF3D] focus:ring-1 focus:ring-[#C6FF3D] transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#777C72] hover:text-[#F3F0E8] rounded-md hover:bg-[#22251F]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Venue Selector */}
          <div className="w-full sm:w-64">
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#1A1D19] text-[#F3F0E8] border border-[#353830] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#C6FF3D] focus:ring-1 focus:ring-[#C6FF3D] transition-all cursor-pointer shadow-sm"
            >
              {venues.map((v) => (
                <option key={v.value} value={v.value} className="bg-[#1A1D19] text-[#F3F0E8]">
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const IconComponent = categoryIconMap[cat] || Sparkles;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border shadow-sm ${
                  isSelected
                    ? 'bg-[#C6FF3D] text-[#111311] border-[#C6FF3D] shadow-[0_2px_12px_-2px_rgba(198,255,61,0.35)]'
                    : 'bg-[#1A1D19] text-[#A5A89F] border-[#353830] hover:text-[#F3F0E8] hover:border-[#C6FF3D]/50 hover:bg-[#22251F]'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 stroke-[2] ${isSelected ? 'text-[#111311]' : 'text-[#777C72]'}`} />
                <span>{cat === 'all' ? 'All Categories' : cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No events match your search criteria"
          description="Try broadening your keyword or selecting 'All Categories' to discover more campus opportunities."
          action={{
            label: 'Clear Filters',
            onClick: () => {
              setSelectedCategory('all');
              setSelectedVenue('all');
              setSearchQuery('');
            },
          }}
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
