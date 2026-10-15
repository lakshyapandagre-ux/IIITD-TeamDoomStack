import React from 'react';
import { Calendar, Clock, MapPin, Users, ArrowUpRight, CheckCircle2, UserCheck, Sparkles } from 'lucide-react';
import { CampusEvent } from '../../types';
import { CategoryBadge, StatusBadge } from '../common/Badge';
import { formatDate, getDaysRemaining } from '../../lib/utils';
import { useEvents } from '../../context/EventContext';

interface EventCardProps {
  event: CampusEvent;
  onSelect?: () => void;
  showQuickRegister?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onSelect, 
  showQuickRegister = false 
}) => {
  const { openEventDetail, updateEventRegistration } = useEvents();
  const daysLeft = getDaysRemaining(event.startDate);

  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    } else {
      openEventDetail(event);
    }
  };

  const handleRegisterToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.registrationStatus === 'registered') {
      updateEventRegistration(event.id, 'not_registered');
    } else {
      updateEventRegistration(event.id, 'registered');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group card-interactive bg-[#1A1D19] rounded-2xl border border-[#353830] hover:border-[#C6FF3D]/70 overflow-hidden flex flex-col cursor-pointer shadow-card relative"
    >
      {/* Top Banner Image with Gradient Vignette */}
      <div className="relative h-44 w-full overflow-hidden bg-[#22251F] border-b border-[#353830]">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Ambient Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D19] via-black/20 to-black/50 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <CategoryBadge category={event.category} />
          <StatusBadge status={event.registrationStatus} />
        </div>

        {/* Bottom Metadata Badges */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          {daysLeft >= 0 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md bg-[#111311]/85 text-[#F3F0E8] border border-white/10 text-[11px] font-mono shadow-sm">
              <Clock className="w-3 h-3 text-[#C6FF3D] stroke-[2.5]" />
              <span className="font-semibold">{daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `In ${daysLeft} days`}</span>
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg backdrop-blur-md bg-[#151713]/85 text-[#777C72] border border-[#353830] text-[11px]">
              Past Event
            </span>
          )}

          {event.capacity && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md bg-[#111311]/85 text-[#A5A89F] border border-white/10 text-[11px] font-mono shadow-sm">
              <Users className="w-3 h-3 text-[#777C72]" />
              <span>{event.attendeesCount} / {event.capacity}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Organizer Header */}
          <div className="flex items-center gap-2 mb-1.5">
            {event.clubLogo ? (
              <img src={event.clubLogo} alt="" className="w-4 h-4 rounded-full object-cover border border-[#353830]" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D]" />
            )}
            <p className="text-xs text-[#777C72] font-medium truncate">
              {event.organizer}
            </p>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-[#F3F0E8] font-heading group-hover:text-[#C6FF3D] transition-colors line-clamp-2 leading-snug">
            {event.title}
          </h3>

          {/* Short description */}
          <p className="text-xs text-[#A5A89F] mt-2 line-clamp-2 leading-relaxed">
            {event.shortDescription}
          </p>

          {/* Event Date & Location Row */}
          <div className="mt-4 pt-3 border-t border-[#292D27] space-y-1.5 text-xs text-[#A5A89F]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#22251F] border border-[#353830] flex items-center justify-center flex-shrink-0">
                <Calendar className="w-3 h-3 text-[#C6FF3D] stroke-[2]" />
              </div>
              <span className="text-xs text-[#F3F0E8] font-medium">{formatDate(event.startDate)}</span>
              <span className="text-[#353830]">•</span>
              <span className="text-xs text-[#A5A89F]">{event.startTime}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#22251F] border border-[#353830] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3 h-3 text-[#777C72] stroke-[2]" />
              </div>
              <span className="truncate text-xs text-[#A5A89F]">{event.venue} {event.room ? `(${event.room})` : ''}</span>
            </div>
          </div>
        </div>

        {/* Footer Tags & Actions */}
        <div className="mt-5 pt-3 border-t border-[#292D27] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {event.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#22251F] text-[#A5A89F] border border-[#353830]"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {showQuickRegister && (
              <button
                onClick={handleRegisterToggle}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                  event.registrationStatus === 'registered'
                    ? 'bg-[#22251F] text-[#C6FF3D] border border-[#C6FF3D]/40 hover:border-[#C6FF3D]'
                    : 'bg-[#C6FF3D] text-[#111311] hover:bg-[#C6FF3D]/90'
                }`}
              >
                {event.registrationStatus === 'registered' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Registered</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 stroke-[2]" />
                    <span>Register</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleCardClick}
              className="p-1.5 text-[#777C72] group-hover:text-[#C6FF3D] group-hover:bg-[#22251F] rounded-xl transition-all border border-transparent group-hover:border-[#353830]"
              title="View details"
              aria-label="View event details"
            >
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
