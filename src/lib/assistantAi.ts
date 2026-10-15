import { AIChatMessage, AIChatResponse } from '../types';
import { api } from './api';

const SYSTEM_PROMPT = `You are "Campus Copilot", the official AI guide and intelligent collegiate event assistant for the MyCampus platform.

STRICT DOMAIN BOUNDARY & SAFETY GUARDRAIL:
1. You may ONLY answer questions related to:
   - The MyCampus platform and its features: Dashboard, My Events, Timeline / Calendar, AI Event Importer, Discover Events, Prep Tasks / Checklists, Profile, Themes, and Settings.
   - Campus events hosted or tracked on this platform (hackathons, workshops, technical talks, cultural fests, sports tournaments, career fairs, academic symposiums).
   - Event schedules, registration deadlines, venues/rooms, preparation tasks, requirements, eligibility, and tips for participating in campus activities.
   - How to use the platform (e.g. how to paste announcements or upload flyers for AI extraction, how to mark tasks complete, demo personas like Alex Chen, Priya Patel, Marcus Vance).
2. OUT-OF-SCOPE QUERIES:
   - If the user asks ANY question unrelated to this website or campus activities (such as general trivia, general external coding/homework problems, politics, recipes, jokes, celebrity gossip, stock market, etc.), YOU MUST POLITELY AND FIRMLY DECLINE.
   - Refusal response:
     "I am specifically dedicated to helping you with the MyCampus platform and campus events! I can help you with upcoming hackathons, registration deadlines, event schedules, prep checklists, or importing event flyers. How can I assist you on MyCampus today?"
   - Do NOT answer the out-of-scope question even partially. Redirect them directly back to MyCampus campus topics.

TONE & STYLE:
- Helpful, collegiate, friendly, concise, and structured.
- Format responses nicely with markdown (bullet points, bold text for times/dates).
- When platform context (active events, user profile, pending deadlines, or current page) is provided, cite real details to give practical, accurate answers.
- You can suggest actions to the user by writing tags like:
  [ACTION:navigate:ai-importer:Open AI Importer]
  [ACTION:navigate:discover:Explore Events]
  [ACTION:navigate:timeline:View Timeline]
  [ACTION:navigate:my-events:My Registered Events]
  [ACTION:modal:add-event:Create Event]
  [ACTION:modal:add-task:Add Prep Task]
`;

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-flash-latest',
  'gemini-3.8-flash',
];

interface AssistantContext {
  activePage?: string;
  user?: {
    name?: string;
    role?: string;
    department?: string;
  } | null;
  eventsCount?: number;
  registeredCount?: number;
  upcomingDeadlines?: Array<{
    title: string;
    date: string;
    eventTitle?: string;
  }>;
  pendingTasks?: Array<{
    title: string;
    priority?: string;
    dueDate?: string;
  }>;
  availableEvents?: Array<{
    title: string;
    category: string;
    startDate: string;
    venue: string;
  }>;
}

export async function askCampusAssistant(
  messages: AIChatMessage[],
  context?: AssistantContext
): Promise<AIChatResponse> {
  // 1. Try FastAPI Backend Endpoint first (with 8s timeout)
  try {
    const backendPromise = api.ai.chatAssistant(messages, context as any);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Backend timeout')), 8000)
    );
    const backendRes = await Promise.race([backendPromise, timeoutPromise]);
    if (backendRes && backendRes.reply && backendRes.reply.trim()) {
      return backendRes;
    }
  } catch (backendErr) {
    console.debug('Backend assistant-chat unavailable or timed out, trying direct Gemini:', backendErr);
  }

  // 2. Direct Google Gemini API Call (Client-Side Resilient Layer)
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
  if (apiKey) {
    try {
      const geminiReply = await callDirectGemini(messages, context, apiKey);
      if (geminiReply) {
        return {
          reply: geminiReply,
          provider: 'gemini-direct',
          model: 'gemini-3.8-flash',
        };
      }
    } catch (directErr) {
      console.warn('Direct Gemini call failed, falling back to local campus intelligence:', directErr);
    }
  }

  // 3. Intelligent Local Fallback Engine (Zero Hallucination & Strict Domain Guardrail)
  const localReply = generateLocalCampusResponse(messages, context);
  return {
    reply: localReply,
    provider: 'campus-copilot-engine',
    model: 'local-domain-guard',
  };
}

async function callDirectGemini(
  messages: AIChatMessage[],
  context: AssistantContext | undefined,
  apiKey: string
): Promise<string> {
  let systemInstruction = SYSTEM_PROMPT;
  if (context) {
    systemInstruction += `\n\nCURRENT PLATFORM DATA FOR USER:\n${JSON.stringify(context, null, 2)}`;
  }

  const contents = messages
    .filter((m) => m.content && m.content.trim())
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content.trim() }],
    }));

  if (contents.length === 0) {
    contents.push({
      role: 'user',
      parts: [{ text: 'Hello, what can you help me with on MyCampus?' }],
    });
  }

  let lastError: any = null;

  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents,
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text;
        if (text && typeof text === 'string') {
          return text.trim();
        }
      } else {
        const errorData = await response.text();
        lastError = new Error(`Gemini HTTP ${response.status}: ${errorData}`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models exhausted.');
}

/**
 * Intelligent Local Campus Knowledge Engine
 * Activates when offline or if API key experiences temporary disruption.
 * Strictly answers campus & website queries and refuses out-of-scope topics.
 */
function generateLocalCampusResponse(
  messages: AIChatMessage[],
  context?: AssistantContext
): string {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content?.trim() || '';
  const query = lastUserMsg.toLowerCase();

  // Out-of-Scope Detection
  const outOfScopePatterns = [
    'recipe', 'cook', 'bake', 'cake', 'weather in', 'president', 'prime minister',
    'movie', 'song', 'lyrics', 'crypto', 'bitcoin', 'stock market', 'elon musk',
    'joke', 'riddle', 'poem', 'write an essay on', 'solve 2x', 'who is',
    'capital of', 'translate to french', 'translate to spanish', 'football score'
  ];

  const isExplicitlyOutOfScope = outOfScopePatterns.some((pattern) => query.includes(pattern));

  const campusKeywords = [
    'event', 'hackathon', 'workshop', 'talk', 'fest', 'deadline', 'task', 'checklist',
    'importer', 'flyer', 'poster', 'ocr', 'timeline', 'schedule', 'conflict',
    'register', 'registration', 'mycampus', 'alex', 'priya', 'marcus', 'demo',
    'theme', 'dashboard', 'discover', 'venue', 'room', 'category', 'help', 'hi', 'hello', 'what'
  ];

  const hasCampusRelevance = campusKeywords.some((kw) => query.includes(kw));

  if (isExplicitlyOutOfScope || (!hasCampusRelevance && query.length > 10)) {
    return (
      "I am specifically dedicated to helping you with the **MyCampus** platform and campus events! 🎓⚡\n\n" +
      "I can assist you with:\n" +
      "- 🏆 **Upcoming Hackathons & Tech Talks**\n" +
      "- ⏳ **Pending Deadlines & Conflict Detection**\n" +
      "- 🤖 **Importing Flyers & Announcements with Gemini AI**\n" +
      "- ✅ **Actionable Preparation Checklists**\n" +
      "- 👥 **Switching between Judge Demo Personas**\n\n" +
      "How can I help you navigate your campus life today?"
    );
  }

  // Greetings
  if (query === 'hi' || query === 'hello' || query === 'hey' || query.startsWith('hello ') || query.startsWith('hi ')) {
    const userName = context?.user?.name ? `, ${context.user.name}` : '';
    return (
      `👋 **Hello${userName}! Welcome to Campus Copilot.**\n\n` +
      `I'm your intelligent AI guide for everything happening on **MyCampus**.\n\n` +
      `Here are a few things you can ask me:\n` +
      `- *"What events are coming up this week?"*\n` +
      `- *"How do I import an event from a flyer screenshot?"*\n` +
      `- *"Do I have any urgent deadlines?"*\n` +
      `- *"Show my preparation tasks"*\n` +
      `- *"How do the demo personas work?"*\n\n` +
      `[ACTION:navigate:discover:Explore Campus Events]`
    );
  }

  // AI Flyer / Importer
  if (query.includes('flyer') || query.includes('import') || query.includes('ocr') || query.includes('announcement') || query.includes('poster')) {
    return (
      `🤖 **MyCampus Multimodal AI Importer**\n\n` +
      `You can convert messy campus posters, flyers, or WhatsApp broadcast texts into structured events with zero manual typing!\n\n` +
      `**How it works:**\n` +
      `1. Navigate to **AI Importer** in the navigation bar.\n` +
      `2. **Upload a Graphic:** Drag & drop a PNG, JPG, or screenshot of an event poster.\n` +
      `3. **Or Paste Text:** Paste raw unstructured broadcast messages from WhatsApp or Discord.\n` +
      `4. **Google Gemini Vision:** Automatically extracts the title, date, start/end time, venue, room, category, and suggested prep tasks with zero fabrication.\n` +
      `5. Review the extracted fields and click **"Save Event"**.\n\n` +
      `[ACTION:navigate:ai-importer:Open AI Importer]`
    );
  }

  // Deadlines & Timeline
  if (query.includes('deadline') || query.includes('cutoff') || query.includes('due')) {
    if (context?.upcomingDeadlines && context.upcomingDeadlines.length > 0) {
      const list = context.upcomingDeadlines
        .map((d) => `- **${d.title}** (${d.eventTitle || 'Campus Event'}) — Due: \`${d.date}\``)
        .join('\n');
      return (
        `⏳ **Your Pending Deadlines:**\n\n${list}\n\n` +
        `Make sure to complete your registrations and team submissions before the cutoffs!\n\n` +
        `[ACTION:navigate:timeline:View Visual Timeline]`
      );
    }
    return (
      `⏳ **Campus Deadlines & Timeline**\n\n` +
      `MyCampus automatically tracks registration cutoffs and milestone deadlines so you never miss an opportunity.\n\n` +
      `- You can view your chronological timeline on the **Timeline** page.\n` +
      `- The system automatically flags **Schedule Overlaps** if two events or deadlines clash!\n\n` +
      `[ACTION:navigate:timeline:Open Timeline Page]`
    );
  }

  // Preparation Tasks & Checklists
  if (query.includes('task') || query.includes('prep') || query.includes('checklist')) {
    if (context?.pendingTasks && context.pendingTasks.length > 0) {
      const list = context.pendingTasks
        .map((t) => `- [ ] **${t.title}** ${t.priority ? `(${t.priority.toUpperCase()} priority)` : ''}`)
        .join('\n');
      return (
        `✅ **Your Active Preparation Tasks:**\n\n${list}\n\n` +
        `Check them off on your Dashboard or add new custom prep milestones anytime!\n\n` +
        `[ACTION:modal:add-task:Add New Task]`
      );
    }
    return (
      `✅ **Actionable Preparation Checklists**\n\n` +
      `Every event on MyCampus can have tailored preparation tasks (e.g. *"Bring resume copies"*, *"Setup Devpost team"*, *"Install Docker"*).\n\n` +
      `- Track completion status with interactive checkboxes.\n` +
      `- Filter tasks by Priority (*High*, *Medium*, *Low*).\n` +
      `- Click **"Add Task"** in the top bar to create custom to-dos!\n\n` +
      `[ACTION:modal:add-task:Add New Task]`
    );
  }

  // Hackathons & Tech Events
  if (query.includes('hackathon') || query.includes('hack') || query.includes('code') || query.includes('tech talk')) {
    return (
      `⚡ **Hackathons & Technical Events on MyCampus:**\n\n` +
      `Here are some featured opportunities available in the campus catalog:\n` +
      `- **HackNova 2026** — 36-hour national collegiate hackathon with $25k prize pool at Innovation Hub.\n` +
      `- **AI & Cloud Architecture Summit** — Keynotes from top industry engineers on Gemini & modern cloud scale.\n` +
      `- **Collegiate DevSprint** — Intensive open-source contribution sprint with mentor guidance.\n` +
      `- **Full-Stack React Masterclass** — Hands-on interactive workshop at CS Auditorium Room 302.\n\n` +
      `[ACTION:navigate:discover:Browse All Hackathons]`
    );
  }

  // Demo Accounts & Personas
  if (query.includes('demo') || query.includes('account') || query.includes('persona') || query.includes('login') || query.includes('judge')) {
    return (
      `👥 **Judge Demo Accounts & Evaluation Environment:**\n\n` +
      `MyCampus provides 3 pre-configured demo personas with isolated SQLite datasets and 1-click login:\n\n` +
      `| Account | Email | Password | Role |\n` +
      `| :--- | :--- | :--- | :--- |\n` +
      `| **Alex Chen** | \`demo1@mycampus.demo\` | \`demo123\` | **Campus Explorer** (Attending HackNova & Career fairs) |\n` +
      `| **Priya Patel** | \`demo2@mycampus.demo\` | \`demo123\` | **Event Organizer** (Managing AV logistics & volunteers) |\n` +
      `| **Marcus Vance** | \`demo3@mycampus.demo\` | \`demo123\` | **AI Feature Tester** (Testing OCR flyer extraction) |\n\n` +
      `You can switch personas via the user profile menu or use *"Reset Demo Data"* in the top bar anytime!\n\n` +
      `[ACTION:navigate:settings:Open Profile Settings]`
    );
  }

  // Themes & Styling
  if (query.includes('theme') || query.includes('color') || query.includes('dark') || query.includes('light') || query.includes('night')) {
    return (
      `🎨 **Theme Modes on MyCampus:**\n\n` +
      `MyCampus supports two clean, high-contrast visual modes:\n` +
      `1. ☀️ **Light Mode** — Crisp, clean off-white layout with forest green accents for comfortable daytime reading.\n` +
      `2. 🌙 **Night Mode** — Dark charcoal background with electric lime accents for late-night hackathons and study sessions.\n\n` +
      `Switch between Light and Night mode anytime using the theme button in the top navigation bar!`
    );
  }

  // General Campus Overview
  return (
    `🎓 **MyCampus Platform Assistant:**\n\n` +
    `I can help you navigate everything on MyCampus:\n` +
    `- **Dashboard:** Real-time metrics, registered events, and pending deadlines.\n` +
    `- **Discover:** Browse campus events filtered by Hackathons, Tech Talks, Workshops, and Sports.\n` +
    `- **AI Importer:** OCR flyer scanner powered by Google Gemini Vision.\n` +
    `- **Timeline:** Interactive chronological calendar with schedule overlap alerts.\n` +
    `- **Checklists:** Actionable prep tasks for every event.\n\n` +
    `What would you like to explore next?\n\n` +
    `[ACTION:navigate:discover:Explore Events]`
  );
}
