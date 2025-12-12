// Application constants
export const QUIZ_CONFIG = {
  MAX_TAB_SWITCHES: 5, // Maximum allowed tab switches before auto-submit
  AUTO_SAVE_INTERVAL: 2000, // Auto-save every 2 seconds
  SERVER_TIME_SYNC_INTERVAL: 30000, // Sync server time every 30 seconds
  TIMER_UPDATE_INTERVAL: 1000, // Update timer every second
} as const;

export const ROUTES = {
  HOME: '/',
  QUIZ: '/quiz',
  ADMIN: '/admin',
  ADMIN_SESSIONS: '/admin/sessions',
  ADMIN_RESULTS: '/admin/results',
  ADMIN_EVENTS: '/admin/events',
} as const;

