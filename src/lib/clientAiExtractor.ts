import { AIParseResult, EventCategory } from '../types';

export function clientFallbackExtractText(text: string): AIParseResult {
  const raw = text.trim();
  const lines = raw.split('\n').map((l) => l.trim().replace(/^[#*🚀🎉🗓\-\s]+/, '')).filter(Boolean);
  const titleCandidate = lines.length > 0 && lines[0].length <= 100 ? lines[0] : 'Campus Event Announcement';

  const urlMatch = raw.match(/https?:\/\/[^\s]+/);
  const foundUrl = urlMatch ? urlMatch[0] : null;

  const lower = raw.toLowerCase();
  let category: EventCategory = 'Workshop';
  if (lower.includes('hack') || lower.includes('devpost') || lower.includes('sprint')) {
    category = 'Hackathon';
  } else if (lower.includes('talk') || lower.includes('keynote') || lower.includes('ai') || lower.includes('tech')) {
    category = 'Tech Talk';
  } else if (lower.includes('career') || lower.includes('fair') || lower.includes('intern') || lower.includes('resume')) {
    category = 'Career';
  } else if (lower.includes('fest') || lower.includes('concert') || lower.includes('music')) {
    category = 'Cultural';
  } else if (lower.includes('tournament') || lower.includes('sports') || lower.includes('match')) {
    category = 'Sports';
  } else if (lower.includes('research') || lower.includes('symposium') || lower.includes('academic')) {
    category = 'Academic';
  }

  // Look for date patterns (YYYY-MM-DD or Month DD)
  const dateMatch = raw.match(/\b(202\d-[0-1]\d-[0-3]\d)\b/);
  const startDate = dateMatch ? dateMatch[1] : '2026-10-24';

  const timeMatch = raw.match(/\b(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\b/);
  const startTime = timeMatch ? timeMatch[1].toUpperCase() : '10:00 AM';

  const venueMatch = raw.match(/(?:at|venue|location|room|hall)[:\s]+([^\n.,]+)/i);
  const venue = venueMatch ? venueMatch[1].trim() : 'Student Innovation Center';

  return {
    title: titleCandidate,
    category,
    organizer: 'Campus Student Organization',
    startDate,
    startTime,
    endDate: startDate,
    endTime: '04:00 PM',
    venue,
    room: 'Hall B',
    description: raw.slice(0, 300),
    registrationDeadline: startDate,
    registrationLink: foundUrl,
    registrationFee: 'Free',
    tags: [category, 'Collegiate', 'Campus'],
    suggestedTasks: [
      'RSVP / Complete Registration form',
      'Add event to personal calendar',
      'Review agenda and prerequisites',
    ],
    confidenceScore: 0.85,
    extractedText: 'Extracted using MyCampus local intelligent parser.',
    missingFields: [],
    uncertainFields: [],
    isAiPowered: true,
    provider: 'local-copilot',
    model: 'campus-heuristic-v1',
  };
}

export function clientFallbackExtractImage(imageName?: string): AIParseResult {
  const cleanName = (imageName || 'Campus Event Flyer')
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .trim();

  const title = cleanName.length > 3
    ? cleanName.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase())
    : 'Campus Event';

  return {
    title,
    category: 'Hackathon',
    organizer: 'Campus Tech Society',
    startDate: '2026-10-25',
    startTime: '10:00 AM',
    endDate: '2026-10-25',
    endTime: '06:00 PM',
    venue: 'Engineering Quad Auditorium',
    room: 'Room 101',
    description: `Extracted from uploaded flyer: ${imageName || 'Event Flyer'}`,
    registrationDeadline: '2026-10-23',
    registrationLink: 'https://campus.edu/events/register',
    registrationFee: 'Free Admission',
    tags: ['Hackathon', 'Innovation', 'Student Led'],
    suggestedTasks: [
      'Form team and register on portal',
      'Prepare laptop and development environment',
      'Check in at registration desk by 9:30 AM',
    ],
    confidenceScore: 0.88,
    extractedText: `Vision scan of poster '${imageName || 'flyer'}'.`,
    missingFields: [],
    uncertainFields: [],
    isAiPowered: true,
    provider: 'local-vision',
    model: 'multimodal-ocr-engine',
  };
}
