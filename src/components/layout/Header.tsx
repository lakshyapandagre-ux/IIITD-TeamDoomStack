import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  Plus, 
  Calendar, 
  Clock, 
  Sparkles, 
  Check, 
  ChevronDown, 
  User, 
  SlidersHorizontal,
  X,
  LogOut,
  RotateCcw,
  Users,
  Home,
  CheckCircle2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { MyCampusLogo } from '../common/MyCampusLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

interface HeaderProps {
  onToggleMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    notifications, 
    unreadNotifCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    profile, 
    setIsAddEventModalOpen,
    setActivePage,
    events,
    openEventDetail,
    refreshData,
    showToast
  } = useEvents();

  const { user, logout, switchDemoUser, resetDemoData, navigate } = useAuth();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Ctrl+K / Cmd+K search focus shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNotificationClick = (notifId: string, eventId?: string) => {
    markNotificationAsRead(notifId);
    if (eventId) {
      const targetEvent = events.find((e) => e.id === eventId);
      if (targetEvent) {
        openEventDetail(targetEvent);
        setIsNotifOpen(false);
      }
    }
  };

  const handleSwitchAccount = async (email: string) => {
    try {
      setIsProfileOpen(false);
      await switchDemoUser(email);
      showToast('Switched demo account', 'info');
    } catch (err) {
      showToast('Failed to switch account', 'error');
    }
  };

  const handleResetData = async () => {
    try {
      setIsProfileOpen(false);
      await resetDemoData();
      await refreshData();
      showToast('Demo data restored to initial state', 'success');
    } catch (err) {
      showToast('Failed to reset demo data', 'error');
    }
  };

  const otherDemoAccounts = [
    { email: 'demo1@mycampus.demo', label: 'Demo 1: Campus Explorer', desc: 'HackNova & Student Mixers' },
    { email: 'demo2@mycampus.demo', label: 'Demo 2: Event Organizer', desc: 'DevSprints & Logistics' },
    { email: 'demo3@mycampus.demo', label: 'Demo 3: AI Feature Tester', desc: 'Multimodal Vision OCR' },
  ].filter((a) => a.email !== user?.email);

  return (
    <header className="h-16 glass-header border-b border-[#353830]/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Mobile Hamburger & Logo */}
      <div className="flex items-center gap-2.5 md:hidden">
        <button
          onClick={onToggleMobileNav}
          className="p-2 text-[#A5A89F] hover:text-[#F3F0E8] rounded-xl hover:bg-[#22251F] transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <MyCampusLogo size="xs" />
      </div>

      {/* Global Search Bar with Keyboard Shortcut */}
      <div className="flex-1 max-w-md hidden sm:block relative">
        <div className="relative flex items-center group">
          <Search className="absolute left-3.5 w-4 h-4 text-[#777C72] group-focus-within:text-[#C6FF3D] transition-colors pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, topics, or venues..."
            className="w-full pl-10 pr-16 py-2 bg-[#1A1D19]/90 text-[#F3F0E8] placeholder:text-[#777C72] border border-[#353830] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#C6FF3D] focus:ring-1 focus:ring-[#C6FF3D] transition-all font-sans shadow-sm"
          />
          <div className="absolute right-3 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-[#777C72] hover:text-[#F3F0E8] rounded-md hover:bg-[#22251F]"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono text-[#777C72] bg-[#22251F] px-1.5 py-0.5 rounded border border-[#353830]">
                Ctrl K
              </kbd>
            )}
          </div>
        </div>
      </div>

      {/* Right Actions & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add Event Button */}
        <button
          onClick={() => setIsAddEventModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#22251F] border border-[#353830] hover:border-[#C6FF3D] text-[#C6FF3D] text-xs font-semibold transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Event</span>
        </button>

        {/* Quick Theme Switcher */}
        <ThemeToggle variant="compact" />

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2.5 rounded-xl text-[#A5A89F] hover:text-[#F3F0E8] hover:bg-[#22251F] border border-transparent hover:border-[#353830] transition-colors focus:outline-none"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6FF3D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6FF3D]"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 glass-card rounded-2xl shadow-modal border border-[#353830] py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-4 pb-3 border-b border-[#353830]">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-xs text-[#F3F0E8]">
                    Notifications
                  </span>
                  {unreadNotifCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/30">
                      {unreadNotifCount} new
                    </span>
                  )}
                </div>
                {unreadNotifCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-[#C6FF3D] hover:underline flex items-center gap-1 font-medium transition-colors"
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-[#22251F]/60 py-1">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#777C72] mx-auto opacity-50" />
                    <p className="text-xs text-[#777C72]">You're all caught up!</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id, notif.eventId)}
                      className={cn(
                        'px-4 py-3 hover:bg-[#22251F]/80 cursor-pointer transition-colors flex gap-3 items-start',
                        !notif.read && 'bg-[#151713]/60'
                      )}
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#22251F] border border-[#353830] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        {notif.type === 'deadline' && <Clock className="w-3.5 h-3.5 text-[#FF7138] stroke-[2.5]" />}
                        {notif.type === 'reminder' && <Calendar className="w-3.5 h-3.5 text-[#C6FF3D] stroke-[2.5]" />}
                        {notif.type === 'ai' && <Sparkles className="w-3.5 h-3.5 text-[#C6FF3D] stroke-[2.5]" />}
                        {notif.type === 'update' && <Check className="w-3.5 h-3.5 text-[#A5A89F] stroke-[2.5]" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className={cn('text-xs font-semibold truncate', notif.read ? 'text-[#A5A89F]' : 'text-[#F3F0E8]')}>
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#777C72] line-clamp-2 mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-[#777C72] font-mono mt-1 block">
                          {notif.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile / Demo Judge Switcher Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#22251F] border border-transparent hover:border-[#353830] transition-colors focus:outline-none"
            aria-label="User profile and demo switcher"
          >
            <div className="relative">
              <img
                src={user?.avatar_url || profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                alt={user?.name || 'User'}
                className="w-7 h-7 rounded-lg object-cover border border-[#353830]"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#C6FF3D] border border-[#111311]" />
            </div>

            <div className="hidden md:flex flex-col text-left leading-none">
              <span className="text-xs font-bold text-[#F3F0E8] truncate max-w-[100px]">
                {user?.name?.split(' ')[0] || 'Jordan'}
              </span>
              <span className="text-[10px] text-[#C6FF3D] font-mono truncate max-w-[100px]">
                {user?.role_title || 'Demo Judge'}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#777C72] hidden sm:block" />
          </button>

          {/* Profile Dropdown Panel */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2.5 w-72 glass-card rounded-2xl shadow-modal border border-[#353830] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Active Profile Info */}
              <div className="p-3 bg-[#151713]/80 rounded-xl border border-[#353830] mb-2">
                <p className="text-xs font-bold text-[#F3F0E8] truncate">
                  {user?.name || profile?.name || 'Jordan Lee'}
                </p>
                <p className="text-[11px] text-[#777C72] truncate">
                  {user?.email || profile?.email || 'demo1@mycampus.demo'}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/30">
                    {user?.role_title || 'Campus Explorer'}
                  </span>
                  <span className="text-[10px] text-[#777C72] font-mono">
                    {user?.department?.split('&')[0]}
                  </span>
                </div>
              </div>

              {/* Switch Demo Persona (Judging evaluation) */}
              <div className="px-2 py-1.5 text-[10px] font-mono uppercase text-[#777C72] tracking-wider">
                Switch Demo Persona
              </div>

              <div className="space-y-1 mb-2">
                {otherDemoAccounts.map((account) => (
                  <button
                    key={account.email}
                    onClick={() => handleSwitchAccount(account.email)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#22251F] transition-colors border border-transparent hover:border-[#353830] flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-semibold text-[#F3F0E8] group-hover:text-[#C6FF3D] transition-colors">
                        {account.label}
                      </p>
                      <p className="text-[10px] text-[#777C72]">
                        {account.desc}
                      </p>
                    </div>
                    <Users className="w-3.5 h-3.5 text-[#777C72] group-hover:text-[#C6FF3D]" />
                  </button>
                ))}
              </div>

              {/* Utility actions */}
              <div className="pt-2 border-t border-[#353830] space-y-1">
                <button
                  onClick={handleResetData}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#A5A89F] hover:text-[#F3F0E8] hover:bg-[#22251F] rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#C6FF3D]" />
                  <span>Reset Demo Data</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#A5A89F] hover:text-[#F3F0E8] hover:bg-[#22251F] rounded-xl transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Public Landing Page</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#FF7138] hover:bg-[#FF7138]/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
