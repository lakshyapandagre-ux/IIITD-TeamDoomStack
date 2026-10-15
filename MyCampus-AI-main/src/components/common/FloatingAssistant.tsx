import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Bot,
  X,
  Send,
  RotateCcw,
  Minimize2,
  Maximize2,
  Compass,
  ArrowRight,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import { AIChatMessage } from '../../types';
import { askCampusAssistant } from '../../lib/assistantAi';
import { cn } from '../../lib/utils';

const SUGGESTED_QUESTIONS = [
  { label: '🏆 Upcoming Hackathons', query: 'What hackathons and coding events are coming up?' },
  { label: '🤖 How to import a flyer?', query: 'How does the Gemini AI flyer importer work?' },
  { label: '⏳ Check my deadlines', query: 'What are my pending registration deadlines?' },
  { label: '✅ Show my prep tasks', query: 'What preparation tasks do I need to finish?' },
  { label: '👥 Judge Demo Accounts', query: 'How do the judge demo accounts work?' },
  { label: '🎨 Campus Themes', query: 'What themes can I choose from on MyCampus?' },
];

export const FloatingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const {
    events,
    registeredEvents,
    tasks,
    deadlines,
    activePage,
    setActivePage,
    setIsAddEventModalOpen,
    setIsAddTaskModalOpen,
    showToast,
  } = useEvents();

  const { user, currentRoute, navigate } = useAuth();

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: 'assistant',
      content:
        `👋 **Hi there! I'm Campus Copilot**, your AI guide for the **MyCampus** platform.\n\n` +
        `I can help you explore campus events, check registration deadlines, prepare checklists, or import flyers using Gemini OCR vision.\n\n` +
        `*Ask me anything about this website or campus activities below!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen, isMinimized, scrollToBottom]);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K toggles the assistant
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setIsMinimized(false);
            setShowTooltip(false);
          }
          return !prev;
        });
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Show floating tooltip on first load
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 1500);
    const dismissTimer = setTimeout(() => setShowTooltip(false), 9000);
    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setShowTooltip(false);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Conversation refreshed! How can I assist you on MyCampus today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    showToast('Copied to clipboard', 'info');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleActionClick = (actionStr: string) => {
    const parts = actionStr.replace(/^\[ACTION:/, '').replace(/\]$/, '').split(':');
    const [actionType, target] = parts;

    if (actionType === 'navigate') {
      if (['dashboard', 'my-events', 'timeline', 'ai-importer', 'discover', 'settings'].includes(target)) {
        setActivePage(target as any);
        if (currentRoute !== `/${target}`) {
          navigate(`/${target}`);
        }
        showToast(`Navigated to ${target.replace('-', ' ').toUpperCase()}`, 'info');
      }
    } else if (actionType === 'modal') {
      if (target === 'add-event') {
        setIsAddEventModalOpen(true);
      } else if (target === 'add-task') {
        setIsAddTaskModalOpen(true);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: AIChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const contextData = {
        activePage,
        user: user
          ? {
              name: user.name,
              role: user.role_title,
              department: user.department,
            }
          : null,
        eventsCount: events.length,
        registeredCount: registeredEvents.length,
        upcomingDeadlines: deadlines.slice(0, 5).map((d) => ({
          title: d.title,
          date: `${d.deadlineDate} ${d.deadlineTime}`,
          eventTitle: d.eventTitle,
        })),
        pendingTasks: tasks
          .filter((t) => !t.isCompleted)
          .slice(0, 5)
          .map((t) => ({
            title: t.title,
            priority: t.priority,
            dueDate: t.dueDate,
          })),
        availableEvents: events.slice(0, 6).map((e) => ({
          title: e.title,
          category: e.category,
          startDate: e.startDate,
          venue: e.venue,
        })),
      };

      const res = await askCampusAssistant(newMessages, contextData);

      const assistantMsg: AIChatMessage = {
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm currently unable to connect to the assistant service. Please check your network or try again in a moment.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content: string) => {
    const actionRegex = /\[ACTION:([^\]]+)\]/g;
    const actions: Array<{ raw: string; type: string; target: string; label: string }> = [];
    let match;
    while ((match = actionRegex.exec(content)) !== null) {
      const parts = match[1].split(':');
      actions.push({
        raw: match[0],
        type: parts[0] || 'navigate',
        target: parts[1] || '',
        label: parts[2] || 'Open',
      });
    }

    const cleanContent = content.replace(actionRegex, '').trim();

    return (
      <div className="space-y-2.5">
        <div className="text-xs leading-relaxed font-sans text-slate-800 space-y-1">
          {cleanContent.split('\n').map((line, idx) => {
            if (!line.trim()) {
              return <div key={idx} className="h-1.5" />;
            }

            const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
            const isNumbered = /^\d+\.\s/.test(line.trim());
            const displayLine = isBullet
              ? line.trim().replace(/^[-*]\s+/, '')
              : isNumbered
              ? line.trim().replace(/^\d+\.\s+/, '')
              : line;

            const parts = displayLine.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

            return (
              <div
                key={idx}
                className={cn(
                  isBullet && 'flex items-start gap-2 pl-2 my-0.5',
                  isNumbered && 'flex items-start gap-2 pl-2 my-0.5'
                )}
              >
                {isBullet && <span className="text-emerald-600 font-bold leading-5">•</span>}
                {isNumbered && (
                  <span className="text-emerald-700 font-mono text-[10px] mt-0.5 font-bold">
                    {line.trim().match(/^\d+/)?.[0]}.
                  </span>
                )}
                <span className="flex-1">
                  {parts.map((p, pIdx) => {
                    if (p.startsWith('**') && p.endsWith('**')) {
                      return (
                        <strong key={pIdx} className="font-semibold text-slate-950">
                          {p.slice(2, -2)}
                        </strong>
                      );
                    }
                    if (p.startsWith('`') && p.endsWith('`')) {
                      return (
                        <code
                          key={pIdx}
                          className="bg-slate-100 text-emerald-800 px-1.5 py-0.5 rounded text-[11px] font-mono border border-slate-200/80"
                        >
                          {p.slice(1, -1)}
                        </code>
                      );
                    }
                    return <span key={pIdx}>{p}</span>;
                  })}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/70 mt-2">
            {actions.map((act, actIdx) => (
              <button
                key={actIdx}
                onClick={() => handleActionClick(act.raw)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
              >
                {act.type === 'navigate' ? <Compass className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                <span>{act.label}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        {/* Tooltip hint on initial load */}
        {showTooltip && !isOpen && (
          <div className="mb-2 animate-bounce bg-white border border-slate-200 text-slate-800 text-xs px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Need help with campus events? <strong>Ask Copilot</strong></span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-slate-400 hover:text-slate-700 ml-1 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <button
          onClick={handleOpen}
          aria-label="Open Campus AI Assistant"
          className={cn(
            'group relative flex items-center gap-3 px-4 py-3 rounded-full',
            'bg-white border border-slate-200/90 text-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.12)]',
            'hover:border-emerald-400 hover:shadow-[0_12px_35px_rgba(16,185,129,0.2)]',
            'transition-all duration-300 transform hover:scale-105 active:scale-95',
            isOpen && 'hidden'
          )}
        >
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 blur-sm transition duration-300" />

          {/* Button Content */}
          <div className="relative flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
              {/* Online pulse dot */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white"></span>
              </span>
            </div>

            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Campus Copilot
                </span>
                <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block">
                Press <kbd className="font-mono bg-slate-100 border border-slate-200 px-1 py-0.2 rounded text-[9px] text-slate-600">⌘K</kbd>
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Floating Chat Modal (Light Theme Aesthetic) */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-5 right-5 z-50 flex flex-col',
            'w-[calc(100vw-2.5rem)] sm:w-[420px]',
            'bg-white/98 backdrop-blur-2xl border border-slate-200/90 rounded-2xl',
            'shadow-[0_20px_60px_-15px_rgba(0,0,0,0.22)] overflow-hidden transition-all duration-300',
            isMinimized ? 'h-[64px]' : 'h-[600px] max-h-[85vh]'
          )}
        >
          {/* Light Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-slate-50 via-white to-emerald-50/40 border-b border-slate-200/80 select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-slate-900 font-sans">Campus Copilot</h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold font-mono">
                    Gemini 3.8
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Website Guide & Event Assistant
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleClearHistory}
                title="Clear conversation"
                className="p-1.5 rounded-lg hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMinimized((prev) => !prev)}
                title={isMinimized ? 'Maximize' : 'Minimize'}
                className="p-1.5 rounded-lg hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="p-1.5 rounded-lg hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Prompts Carousel */}
              <div className="px-3 py-2.5 bg-slate-50/80 border-b border-slate-100 overflow-x-auto scrollbar-none flex gap-1.5 flex-nowrap">
                {SUGGESTED_QUESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    disabled={isLoading}
                    onClick={() => handleSendMessage(item.query)}
                    className="whitespace-nowrap px-3 py-1 rounded-full bg-white hover:bg-emerald-50 hover:border-emerald-300 text-[11px] font-medium text-slate-700 hover:text-emerald-800 border border-slate-200/90 shadow-2xs transition-all duration-150 flex-shrink-0 active:scale-95 disabled:opacity-50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Message History Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {messages.map((msg, index) => {
                  const isUser = msg.role === 'user';

                  return (
                    <div
                      key={index}
                      className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400 font-medium">
                        <span>{isUser ? 'You' : 'Campus Copilot'}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={cn(
                          'relative max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed transition-all shadow-xs',
                          isUser
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-tr-xs shadow-sm'
                            : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-xs'
                        )}
                      >
                        {isUser ? (
                          <div className="whitespace-pre-wrap font-sans text-xs">{msg.content}</div>
                        ) : (
                          renderMessageContent(msg.content)
                        )}

                        {/* Copy button for Assistant */}
                        {!isUser && (
                          <div className="flex justify-end mt-2 pt-1 border-t border-slate-100">
                            <button
                              onClick={() => handleCopyMessage(msg.content, index)}
                              title="Copy reply"
                              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 text-[10px]"
                            >
                              {copiedIndex === index ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600 font-semibold">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400 font-medium">
                      <span>Campus Copilot</span>
                      <span>•</span>
                      <span>Thinking with Gemini...</span>
                    </div>
                    <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-3.5 shadow-xs flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                      <span className="text-[11px] text-slate-600 font-medium ml-1">Analyzing campus data...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3.5 bg-white border-t border-slate-200/80">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask about events, schedules, or features..."
                      disabled={isLoading}
                      className={cn(
                        'w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 text-slate-900',
                        'border border-slate-200 placeholder-slate-400',
                        'focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                        'disabled:opacity-50 transition-all'
                      )}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className={cn(
                      'p-2.5 rounded-xl font-semibold transition-all duration-150 flex items-center justify-center',
                      inputMessage.trim() && !isLoading
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20 hover:scale-105 active:scale-95'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    )}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Footer Disclaimer & Guardrail Note */}
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
                  <span>Answers questions strictly about MyCampus</span>
                  <span className="font-mono text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    Gemini Powered
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
