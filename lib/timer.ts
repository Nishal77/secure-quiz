// Timer utilities for client-side countdown with server sync
export interface TimerState {
  timeRemaining: number; // in seconds
  isExpired: boolean;
  serverTime: number; // server timestamp in ms
  clientTime: number; // client timestamp in ms
  offset: number; // server - client offset
}

/**
 * Calculate time remaining based on server time and expiration
 */
export function calculateTimeRemaining(
  expiresAt: string,
  serverTime: number,
  clientTime: number,
  offset: number
): number {
  const expiresAtMs = new Date(expiresAt).getTime();
  const adjustedClientTime = clientTime + offset;
  const remaining = Math.max(0, Math.floor((expiresAtMs - adjustedClientTime) / 1000));
  return remaining;
}

/**
 * Format seconds to MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Check if timer has expired
 */
export function isTimerExpired(timeRemaining: number): boolean {
  return timeRemaining <= 0;
}

