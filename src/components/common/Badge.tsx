import React from 'react';
import { 
   Code2, 
   Mic, 
   Wrench, 
   Palette, 
   Briefcase, 
   Trophy, 
   GraduationCap, 
   Sparkles,
   Check,
   Clock,
   Bookmark,
   CheckCircle2
 } from 'lucide-react';
import { EventCategory, RegistrationStatus } from '../../types';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'neutral' | 'lime' | 'orange' | 'elevated' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  size = 'md',
}) => {
  const variantStyles = {
    neutral: 'bg-[#1A1D19]/90 text-[#A5A89F] border-[#353830]',
    lime: 'bg-[#C6FF3D]/10 text-[#C6FF3D] border-[#C6FF3D]/30',
    orange: 'bg-[#FF7138]/10 text-[#FF7138] border-[#FF7138]/30',
    elevated: 'bg-[#22251F] text-[#F3F0E8] border-[#353830]',
    outline: 'bg-transparent text-[#A5A89F] border-[#353830]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 tracking-tight gap-1',
    md: 'text-xs px-2.5 py-1 tracking-tight gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-lg border backdrop-blur-sm transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};

const categoryIconMap: Record<EventCategory, React.ComponentType<{ className?: string }>> = {
  'Hackathon': Code2,
  'Tech Talk': Mic,
  'Workshop': Wrench,
  'Cultural': Palette,
  'Career': Briefcase,
  'Sports': Trophy,
  'Academic': GraduationCap,
};

export const CategoryBadge: React.FC<{ 
  category: EventCategory; 
  className?: string; 
  size?: 'sm' | 'md';
  showIcon?: boolean;
}> = ({
  category,
  className,
  size = 'sm',
  showIcon = true,
}) => {
  const categoryVariantMap: Record<EventCategory, BadgeProps['variant']> = {
    'Hackathon': 'lime',
    'Tech Talk': 'elevated',
    'Workshop': 'neutral',
    'Cultural': 'orange',
    'Career': 'lime',
    'Sports': 'orange',
    'Academic': 'neutral',
  };

  const IconComponent = categoryIconMap[category] || Sparkles;
  const iconSizeClass = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <Badge variant={categoryVariantMap[category] || 'neutral'} size={size} className={cn('shadow-sm font-semibold', className)}>
      {showIcon && <IconComponent className={cn(iconSizeClass, 'stroke-[2] flex-shrink-0')} />}
      <span>{category}</span>
    </Badge>
  );
};

export const StatusBadge: React.FC<{ status: RegistrationStatus; className?: string }> = ({
  status,
  className,
}) => {
  switch (status) {
    case 'registered':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/40 backdrop-blur-md shadow-sm', className)}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6FF3D] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6FF3D]"></span>
          </span>
          <Check className="w-3 h-3 stroke-[2.5]" />
          <span>Registered</span>
        </span>
      );
    case 'waitlisted':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#FF7138]/10 text-[#FF7138] border border-[#FF7138]/40 backdrop-blur-md shadow-sm', className)}>
          <span className="w-2 h-2 rounded-full bg-[#FF7138]"></span>
          <Clock className="w-3 h-3 stroke-[2.5]" />
          <span>Waitlisted</span>
        </span>
      );
    case 'attended':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-[#22251F]/90 text-[#A5A89F] border border-[#353830] backdrop-blur-md', className)}>
          <CheckCircle2 className="w-3 h-3 text-[#777C72]" />
          <span>Attended</span>
        </span>
      );
    case 'saved':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-[#1A1D19]/90 text-[#C6FF3D] border border-[#353830] backdrop-blur-md', className)}>
          <Bookmark className="w-3 h-3 fill-[#C6FF3D]/20 stroke-[#C6FF3D]" />
          <span>Saved</span>
        </span>
      );
    default:
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-[#151713]/80 text-[#A5A89F] border border-[#353830] backdrop-blur-md', className)}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#777C72]"></span>
          <span>Open</span>
        </span>
      );
  }
};
