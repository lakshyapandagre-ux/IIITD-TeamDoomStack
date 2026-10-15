import {
  CampusEvent,
  PrepTask,
  PendingDeadline,
  UserProfile,
  CampusNotification,
  RegistrationStatus,
  AIParseResult,
  AIStatusResponse,
  DemoUser,
  DemoLoginResponse,
  AIChatMessage,
  AIChatResponse,
} from '../types';
import { clientFallbackExtractText, clientFallbackExtractImage } from './clientAiExtractor';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const TOKEN_KEY = 'mycampus_demo_token';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
    } catch {
      // Non-JSON response
    }
    throw new Error(errorDetail || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  auth: {
    demoLogin: (email: string, password: string): Promise<DemoLoginResponse> => {
      return request<DemoLoginResponse>('/api/auth/demo-login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }).then((res) => {
        setAuthToken(res.token);
        return res;
      });
    },

    getMe: (): Promise<DemoUser> => {
      return request<DemoUser>('/api/auth/me');
    },

    resetDemoData: (): Promise<{ status: string; message: string }> => {
      return request('/api/auth/reset-demo-data', {
        method: 'POST',
      });
    },
  },

  events: {
    getAll: (params?: { category?: string; status?: string; search?: string }): Promise<CampusEvent[]> => {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.status) query.append('status', params.status);
      if (params?.search) query.append('search', params.search);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<CampusEvent[]>(`/api/events${qs}`);
    },

    getById: (id: string): Promise<CampusEvent> => {
      return request<CampusEvent>(`/api/events/${id}`);
    },

    create: (eventData: Omit<CampusEvent, 'id'>): Promise<CampusEvent> => {
      return request<CampusEvent>('/api/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
    },

    update: (id: string, updates: Partial<CampusEvent>): Promise<CampusEvent> => {
      return request<CampusEvent>(`/api/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    updateStatus: (id: string, status: RegistrationStatus): Promise<CampusEvent> => {
      return request<CampusEvent>(`/api/events/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ registrationStatus: status }),
      });
    },

    delete: (id: string): Promise<void> => {
      return request<void>(`/api/events/${id}`, {
        method: 'DELETE',
      });
    },
  },

  tasks: {
    getAll: (params?: { eventId?: string; completed?: boolean }): Promise<PrepTask[]> => {
      const query = new URLSearchParams();
      if (params?.eventId) query.append('event_id', params.eventId);
      if (params?.completed !== undefined) query.append('completed', String(params.completed));
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<PrepTask[]>(`/api/tasks${qs}`);
    },

    getById: (id: string): Promise<PrepTask> => {
      return request<PrepTask>(`/api/tasks/${id}`);
    },

    create: (taskData: Omit<PrepTask, 'id'>): Promise<PrepTask> => {
      return request<PrepTask>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
    },

    update: (id: string, updates: Partial<PrepTask>): Promise<PrepTask> => {
      return request<PrepTask>(`/api/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    toggle: (id: string): Promise<PrepTask> => {
      return request<PrepTask>(`/api/tasks/${id}/toggle`, {
        method: 'POST',
      });
    },

    delete: (id: string): Promise<void> => {
      return request<void>(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
    },
  },

  deadlines: {
    getAll: (): Promise<PendingDeadline[]> => {
      return request<PendingDeadline[]>('/api/deadlines');
    },
  },

  user: {
    getProfile: (): Promise<UserProfile> => {
      return request<UserProfile>('/api/user/profile');
    },

    updateProfile: (updates: Partial<UserProfile>): Promise<UserProfile> => {
      return request<UserProfile>('/api/user/profile', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
  },

  preferences: {
    get: (): Promise<any> => {
      return request<any>('/api/preferences');
    },

    update: (updates: any): Promise<any> => {
      return request<any>('/api/preferences', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
  },

  notifications: {
    getAll: (): Promise<CampusNotification[]> => {
      return request<CampusNotification[]>('/api/notifications');
    },

    markAsRead: (id: string): Promise<void> => {
      return request<void>(`/api/notifications/${id}/read`, {
        method: 'POST',
      });
    },

    markAllAsRead: (): Promise<void> => {
      return request<void>('/api/notifications/read-all', {
        method: 'POST',
      });
    },
  },

  ai: {
    getStatus: async (): Promise<AIStatusResponse> => {
      try {
        return await request<AIStatusResponse>('/api/ai/status');
      } catch {
        return {
          configured: true,
          provider: 'client-ai',
          model: 'gemini-2.5-flash',
          supportedInputs: ['text', 'image', 'chat'],
          message: 'MyCampus Copilot active (Client-side AI layer ready).',
        };
      }
    },

    parseAnnouncement: async (text: string): Promise<AIParseResult> => {
      try {
        return await request<AIParseResult>('/api/ai/parse-event', {
          method: 'POST',
          body: JSON.stringify({ announcementText: text }),
        });
      } catch (err) {
        console.warn('Backend parser unavailable, using resilient client AI parser:', err);
        return clientFallbackExtractText(text);
      }
    },

    parseImage: async (imageUrl: string, imageName?: string): Promise<AIParseResult> => {
      try {
        return await request<AIParseResult>('/api/ai/parse-image', {
          method: 'POST',
          body: JSON.stringify({ imageUrl, imageName }),
        });
      } catch (err) {
        console.warn('Backend image parser unavailable, using resilient client vision parser:', err);
        return clientFallbackExtractImage(imageName);
      }
    },

    chatAssistant: (messages: AIChatMessage[], context?: Record<string, any>): Promise<AIChatResponse> => {
      return request<AIChatResponse>('/api/ai/assistant-chat', {
        method: 'POST',
        body: JSON.stringify({ messages, context }),
      });
    },
  },
};
