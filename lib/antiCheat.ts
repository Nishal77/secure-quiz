// Anti-cheat utilities for tab switch detection
import { supabase } from './supabaseClient';

let tabSwitchCount = 0;
let isPageVisible = true;
let lastBlurTime: number | null = null;

/**
 * Initialize tab switch detection
 */
export function initTabSwitchDetection(sessionId: string) {
  // Page visibility API
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      handleTabSwitch(sessionId, 'visibilitychange');
    }
  });

  // Window blur/focus events
  window.addEventListener('blur', () => {
    handleTabSwitch(sessionId, 'blur');
  });

  window.addEventListener('focus', () => {
    // Reset blur tracking when focus returns
    lastBlurTime = null;
  });

  // Prevent common keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
    }
  });

  // Prevent right-click context menu (optional, can be disabled)
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Prevent text selection (optional, can be disabled)
  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
  });
}

/**
 * Handle tab switch event
 */
async function handleTabSwitch(sessionId: string, type: 'blur' | 'visibilitychange') {
  if (!document.hidden && type === 'visibilitychange') {
    return; // Page is visible, ignore
  }

  const now = Date.now();
  
  // Debounce: ignore if same event within 500ms
  if (lastBlurTime && now - lastBlurTime < 500) {
    return;
  }

  lastBlurTime = now;
  tabSwitchCount++;

  try {
    // Call edge function to log tab switch
    const { error } = await supabase.functions.invoke('tab-switch', {
      body: {
        sessionId,
        switchType: type,
      },
    });

    if (error) {
      console.error('Failed to log tab switch:', error);
    }
  } catch (error) {
    console.error('Error logging tab switch:', error);
  }
}

/**
 * Get current tab switch count
 */
export function getTabSwitchCount(): number {
  return tabSwitchCount;
}

/**
 * Reset tab switch detection (for testing)
 */
export function resetTabSwitchDetection() {
  tabSwitchCount = 0;
  lastBlurTime = null;
  isPageVisible = true;
}

