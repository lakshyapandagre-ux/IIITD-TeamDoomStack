import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Check, 
  Filter, 
  Plus, 
  CalendarDays,
  Sparkles,
  ArrowUpRight,
  ListTodo,
  Layers
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { CategoryBadge } from '../components/common/Badge';
import { formatDate, formatShortDate, cn } from '../lib/utils';
import { CampusEvent, PrepTask, PendingDeadline } from '../types';

type TimelineFilter = 'all' | 'events' | 'deadlines' | 'tasks';

interface TimelineItem {
  id: string;
  type: 'event' | 'deadline' | 'task';
  date: string;
  time?: string;
  title: string;
  subtitle?: string;
  category?: string;
  isCompleted?: boolean;
  isUrgent?: boolean;
  originalData: CampusEvent | PrepTask | PendingDeadline;
}

export const Timeline: React.FC = () => {
  const { 
    events, 
    tasks, 
    deadlines, 
    toggleTask, 
    openEventDetail, 
    setIsAddTaskModalOpen,
    setIsAddEventModalOpen 
  } = useEvents();

  const [filterType, setFilterType] = useState<TimelineFilter>('all');

  // Build unified chronological timeline items
  const timelineItems: TimelineItem[] = useMemo(() => {
    const list: TimelineItem[] = [];

    // 1. Events
    events.forEach((evt: CampusEvent) => {
      list.push({
        id: `timeline_evt_${evt.id}`,
        type: 'event',
        date: evt.startDate,
        time: evt.startTime,
        title: evt.title,
        subtitle: `${evt.venue} • ${evt.organizer}`,
        category: evt.category,
        originalData: evt,
      });
    });

    // 2. Deadlines
    deadlines.forEach((dl: PendingDeadline) => {
      list.push({
        id: `timeline_dl_${dl.id}`,
        type: 'deadline',
        date: dl.deadlineDate,
        time: dl.deadlineTime,
        title: dl.title,
        subtitle: `Linked: ${dl.eventTitle}`,
        category: dl.category,
        isUrgent: dl.isUrgent,
        originalData: dl,
      });
    });

    // 3. Tasks
    tasks.forEach((tsk: PrepTask) => {
      list.push({
        id: `timeline_tsk_${tsk.id}`,
        type: 'task',
        date: tsk.dueDate,
        time: tsk.dueTime,
        title: tsk.title,
        subtitle: tsk.eventTitle ? `Linked: ${tsk.eventTitle}` : 'General Preparation',
        isCompleted: tsk.isCompleted,
        isUrgent: tsk.priority === 'high',
        originalData: tsk,
      });
    });

    // Sort by date ascending
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Filter
    if (filterType === 'all') return list;
    if (filterType === 'events') return list.filter((i) => i.type === 'event');
    if (filterType === 'deadlines') return list.filter((i) => i.type === 'deadline');
    if (filterType === 'tasks') return list.filter((i) => i.type === 'task');

    return list;
  }, [events, deadlines, tasks, filterType]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups: { [key: string]: TimelineItem[] } = {};
    timelineItems.forEach((item) => {
      const formatted = formatDate(item.date);
      if (!groups[formatted]) {
        groups[formatted] = [];
      }
      groups[formatted].push(item);
    });
    return groups;
  }, [timelineItems]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22251F] border border-[#353830] text-[#C6FF3D] text-xs font-mono font-semibold mb-2 shadow-sm">
            <Clock className="w-3.5 h-3.5 stroke-[2]" />
            <span>Chronological Journey</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F3F0E8] tracking-tight">
            Event & Task Timeline
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A89F] mt-1">
            Integrated calendar trajectory tracking registration deadlines, prep milestones, and event dates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-[#353830] bg-[#1A1D19] text-[#A5A89F] hover:text-[#F3F0E8] hover:bg-[#22251F] text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#C6FF3D] stroke-[2.5]" />
            <span>Add Task</span>
          </button>
          <button
            onClick={() => setIsAddEventModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#C6FF3D] hover:bg-[#C6FF3D]/90 text-[#111311] text-xs font-bold transition-all shadow-[0_4px_16px_-4px_rgba(198,255,61,0.35)] active:scale-95"
          >
            Add Event
          </button>
        </div>
      </div>

      {/* Filter Tabs & Legend */}
      <div className="glass-card rounded-2xl p-3 border border-[#353830] shadow-card flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm',
              filterType === 'all'
                ? 'bg-[#C6FF3D] text-[#111311] shadow-[0_2px_12px_-2px_rgba(198,255,61,0.35)]'
                : 'bg-[#1A1D19] text-[#A5A89F] hover:text-[#F3F0E8] border border-[#353830]'
            )}
          >
            All Stream ({timelineItems.length})
          </button>
          <button
            onClick={() => setFilterType('events')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm',
              filterType === 'events'
                ? 'bg-[#C6FF3D] text-[#111311] shadow-[0_2px_12px_-2px_rgba(198,255,61,0.35)]'
                : 'bg-[#1A1D19] text-[#A5A89F] hover:text-[#F3F0E8] border border-[#353830]'
            )}
          >
            <Calendar className="w-3.5 h-3.5 stroke-[2]" />
            <span>Events ({events.length})</span>
          </button>
          <button
            onClick={() => setFilterType('deadlines')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm',
              filterType === 'deadlines'
                ? 'bg-[#FF7138] text-white shadow-[0_2px_12px_-2px_rgba(255,113,56,0.35)]'
                : 'bg-[#1A1D19] text-[#A5A89F] hover:text-[#F3F0E8] border border-[#353830]'
            )}
          >
            <Clock className="w-3.5 h-3.5 stroke-[2]" />
            <span>Deadlines ({deadlines.length})</span>
          </button>
          <button
            onClick={() => setFilterType('tasks')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm',
              filterType === 'tasks'
                ? 'bg-[#C6FF3D] text-[#111311] shadow-[0_2px_12px_-2px_rgba(198,255,61,0.35)]'
                : 'bg-[#1A1D19] text-[#A5A89F] hover:text-[#F3F0E8] border border-[#353830]'
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
            <span>Tasks ({tasks.length})</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-[#777C72] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C6FF3D] shadow-[0_0_6px_#C6FF3D]" /> Event
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF7138] shadow-[0_0_6px_#FF7138]" /> Deadline
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#A5A89F]" /> Task
          </span>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-8">
        {Object.keys(groupedByDate).length === 0 ? (
          <div className="text-center py-16 space-y-3 glass-card rounded-3xl border border-[#353830]">
            <Clock className="w-10 h-10 text-[#777C72] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-[#F3F0E8]">No timeline milestones found</h3>
            <p className="text-xs text-[#777C72]">Try changing the filter or add new events and tasks.</p>
          </div>
        ) : (
          Object.entries(groupedByDate).map(([dateStr, items]) => (
            <div key={dateStr} className="relative">
              {/* Date Header Strip */}
              <div className="sticky top-16 z-10 py-2.5 glass-card bg-[#111311]/90 backdrop-blur-md flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#1A1D19] border border-[#353830] text-xs font-bold text-[#F3F0E8] shadow-sm">
                  <CalendarDays className="w-3.5 h-3.5 text-[#C6FF3D] stroke-[2]" />
                  <span>{dateStr}</span>
                </div>
                <div className="h-px bg-[#353830] flex-1" />
              </div>

              {/* Items Vertical Stack */}
              <div className="relative pl-6 ml-4 border-l-2 border-[#353830] space-y-4 pt-3">
                {items.map((item) => {
                  const isEvent = item.type === 'event';
                  const isDeadline = item.type === 'deadline';
                  const isTask = item.type === 'task';

                  return (
                    <div key={item.id} className="relative group">
                      {/* Node Dot with Halo */}
                      <div
                        className={cn(
                          'absolute -left-[31px] top-4 w-4 h-4 rounded-full border-2 border-[#111311] flex items-center justify-center transition-all',
                          isEvent && 'bg-[#C6FF3D] shadow-[0_0_10px_#C6FF3D]',
                          isDeadline && 'bg-[#FF7138] shadow-[0_0_10px_#FF7138]',
                          isTask && (item.isCompleted ? 'bg-[#C6FF3D]' : 'bg-[#777C72]')
                        )}
                      />

                      {/* Timeline Item Box */}
                      <div
                        className={cn(
                          'rounded-2xl p-4 sm:p-5 border transition-all duration-200 card-interactive flex items-start justify-between gap-4 shadow-card',
                          isEvent && 'bg-[#1A1D19] border-[#353830] hover:border-[#C6FF3D]/70 cursor-pointer',
                          isDeadline && 'bg-[#1A1D19] border-[#353830] hover:border-[#FF7138]/70',
                          isTask && (item.isCompleted ? 'border-[#292D27] bg-[#151713]/80 opacity-60' : 'bg-[#1A1D19] border-[#353830] hover:border-[#C6FF3D]/60')
                        )}
                        onClick={() => {
                          if (isEvent) {
                            openEventDetail(item.originalData as CampusEvent);
                          }
                        }}
                      >
                        <div className="min-w-0 flex-1">
                          {/* Type & Time Label */}
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <span
                              className={cn(
                                'text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border',
                                isEvent && 'bg-[#C6FF3D]/10 text-[#C6FF3D] border-[#C6FF3D]/30',
                                isDeadline && 'bg-[#FF7138]/10 text-[#FF7138] border-[#FF7138]/30',
                                isTask && 'bg-[#22251F] text-[#A5A89F] border-[#353830]'
                              )}
                            >
                              {isEvent ? 'Campus Event' : isDeadline ? 'Registration Cutoff' : 'Prep Task'}
                            </span>

                            {item.time && (
                              <span className="text-[11px] text-[#A5A89F] font-mono flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#777C72]" />
                                {item.time}
                              </span>
                            )}

                            {item.isUrgent && (
                              <span className="text-[10px] font-mono font-bold text-[#FF7138] bg-[#FF7138]/10 px-2 py-0.5 rounded-md border border-[#FF7138]/30">
                                Urgent
                              </span>
                            )}

                            {item.category && isEvent && (
                              <span className="text-[10px] text-[#A5A89F] bg-[#22251F] px-2 py-0.5 rounded-md border border-[#353830]">
                                {item.category}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h4
                            className={cn(
                              'text-sm sm:text-base font-bold font-heading text-[#F3F0E8] leading-tight',
                              item.isCompleted && 'line-through text-[#777C72]'
                            )}
                          >
                            {item.title}
                          </h4>

                          {/* Subtitle */}
                          {item.subtitle && (
                            <p className="text-xs text-[#A5A89F] mt-1 font-sans leading-relaxed">
                              {item.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Right Action */}
                        <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                          {isTask && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const taskObj = item.originalData as PrepTask;
                                toggleTask(taskObj.id);
                              }}
                              className={cn(
                                'w-6 h-6 rounded-lg border flex items-center justify-center transition-all shadow-sm',
                                item.isCompleted
                                  ? 'bg-[#C6FF3D] border-[#C6FF3D] text-[#111311]'
                                  : 'border-[#353830] bg-[#151713] hover:border-[#C6FF3D] text-transparent'
                              )}
                              title={item.isCompleted ? 'Mark incomplete' : 'Mark completed'}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          )}

                          {isEvent && (
                            <div className="w-8 h-8 rounded-xl bg-[#22251F] border border-[#353830] flex items-center justify-center text-[#777C72] group-hover:text-[#C6FF3D] group-hover:border-[#C6FF3D]/50 transition-colors">
                              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
