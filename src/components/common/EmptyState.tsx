import React from 'react';
import { CalendarX, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = CalendarX,
  title,
  description,
  actionLabel,
  onAction,
  action,
  className,
}) => {
  const btnLabel = actionLabel || action?.label;
  const btnAction = onAction || action?.onClick;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-14 text-center rounded-3xl border border-dashed border-[#353830] bg-[#1A1D19]/60 backdrop-blur-sm',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#22251F] border border-[#353830] flex items-center justify-center text-[#777C72] mb-4 shadow-sm">
        <Icon className="w-6 h-6 stroke-[1.8] text-[#C6FF3D]" />
      </div>
      <h4 className="text-base sm:text-lg font-bold text-[#F3F0E8] font-heading mb-1.5">{title}</h4>
      <p className="text-xs sm:text-sm text-[#A5A89F] max-w-md mb-6 leading-relaxed">{description}</p>
      {btnLabel && btnAction && (
        <button
          onClick={btnAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C6FF3D] text-[#111311] text-xs font-bold tracking-tight hover:bg-[#C6FF3D]/90 transition-all shadow-[0_4px_16px_-4px_rgba(198,255,61,0.35)] active:scale-95 focus:outline-none"
        >
          {btnLabel}
        </button>
      )}
    </div>
  );
};
