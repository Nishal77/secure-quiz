// Comprehensive anti-cheat utilities
import { supabase } from './supabaseClient';

let tabSwitchCount = 0;
let lastBlurTime: number | null = null;
let warningCount = 0;
let isEliminated = false;
let onEliminationCallback: (() => void) | null = null;

const MAX_WARNINGS = 2;
const MAX_TAB_SWITCHES = 3; // 2 warnings + 1 elimination = 3 total

/**
 * Initialize comprehensive anti-cheat system
 */
export function initTabSwitchDetection(
  sessionId: string,
  onWarning?: (count: number) => void,
  onElimination?: () => void
) {
  if (onElimination) {
    onEliminationCallback = onElimination;
  }

  // Prevent text selection
  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
  });

  // Prevent text selection via CSS
  document.addEventListener('mousedown', (e) => {
    if (e.detail > 1) {
      e.preventDefault(); // Prevent double-click selection
    }
  });

  // Block long press (context menu on mobile)
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable paste
  document.addEventListener('paste', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable copy
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable cut
  document.addEventListener('cut', (e) => {
    e.preventDefault();
    return false;
  });

  // Block keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Prevent F12, DevTools, View Source, etc.
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      (e.ctrlKey && e.key === 'U') ||
      (e.ctrlKey && e.key === 'S') ||
      (e.ctrlKey && e.key === 'P') ||
      (e.metaKey && e.key === 'p') || // Cmd+P on Mac
      (e.ctrlKey && e.shiftKey && e.key === 'P') // Ctrl+Shift+P
    ) {
      e.preventDefault();
      return false;
    }

    // Block Ctrl+V (paste)
    if (e.ctrlKey && e.key === 'v') {
      e.preventDefault();
      return false;
    }

    // Block Ctrl+C (copy)
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      return false;
    }

    // Block Print Screen
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      return false;
    }
  });

  // Prevent drag and drop
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });

  // Page visibility API - detect tab/app switch
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      handleTabSwitch(sessionId, 'visibilitychange', onWarning);
    } else {
      // Page is visible again
      removeBlurEffect();
    }
  });

  // Window blur/focus events
  window.addEventListener('blur', () => {
    handleTabSwitch(sessionId, 'blur', onWarning);
  });

  window.addEventListener('focus', () => {
    removeBlurEffect();
    lastBlurTime = null;
  });

  // Prevent right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Mobile: Prevent long press
  let touchStartTime = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartTime = Date.now();
  });

  document.addEventListener('touchend', (e) => {
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration > 500) {
      // Long press detected
      e.preventDefault();
      return false;
    }
  });

  // Apply CSS to prevent selection and add blur effect
  applyAntiCheatStyles();
}

/**
 * Apply CSS styles to prevent selection and add blur effect
 */
function applyAntiCheatStyles() {
  const styleId = 'anti-cheat-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    body, div, p, span, h1, h2, h3, h4, h5, h6, label {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-touch-callout: none !important;
      -webkit-tap-highlight-color: transparent !important;
    }
    
    input[type="radio"], input[type="checkbox"] {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      cursor: pointer !important;
    }
    
    label {
      cursor: pointer !important;
    }
    
    .quiz-blur-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      z-index: 9998;
      pointer-events: none;
    }
    
    .quiz-content-blurred {
      filter: blur(25px) brightness(0.5);
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Add blur effect when tab is switched
 */
function addBlurEffect() {
  // Remove existing overlay if any
  removeBlurEffect();

  // Create blur overlay
  const overlay = document.createElement('div');
  overlay.className = 'quiz-blur-overlay';
  overlay.id = 'quiz-blur-overlay';
  document.body.appendChild(overlay);

  // Blur main content
  const mainContent = document.querySelector('[data-quiz-content]');
  if (mainContent) {
    mainContent.classList.add('quiz-content-blurred');
  }
}

/**
 * Remove blur effect
 */
function removeBlurEffect() {
  const overlay = document.getElementById('quiz-blur-overlay');
  if (overlay) {
    overlay.remove();
  }

  const mainContent = document.querySelector('[data-quiz-content]');
  if (mainContent) {
    mainContent.classList.remove('quiz-content-blurred');
  }
}

/**
 * Handle tab switch event with warning system
 */
async function handleTabSwitch(
  sessionId: string,
  type: 'blur' | 'visibilitychange',
  onWarning?: (count: number) => void
) {
  if (isEliminated) return;

  const now = Date.now();
  
  // Debounce: ignore if same event within 500ms
  if (lastBlurTime && now - lastBlurTime < 500) {
    return;
  }

  lastBlurTime = now;
  tabSwitchCount++;

  // Add blur effect immediately
  addBlurEffect();

  try {
    // Call edge function to log tab switch
    await supabase.functions.invoke('tab-switch', {
      body: {
        sessionId,
        switchType: type,
      },
    });
  } catch (error) {
    console.error('Error logging tab switch:', error);
  }

  // Warning system: 2 warnings, then elimination on 3rd
  if (tabSwitchCount <= MAX_WARNINGS) {
    // Show warning
    warningCount = tabSwitchCount;
    if (onWarning) {
      onWarning(warningCount);
    }
  } else if (tabSwitchCount >= MAX_TAB_SWITCHES) {
    // Eliminate on 3rd switch
    isEliminated = true;
    if (onEliminationCallback) {
      onEliminationCallback();
    }
  }
}

/**
 * Get current tab switch count
 */
export function getTabSwitchCount(): number {
  return tabSwitchCount;
}

/**
 * Get current warning count
 */
export function getWarningCount(): number {
  return warningCount;
}

/**
 * Check if user is eliminated
 */
export function isEliminatedUser(): boolean {
  return isEliminated;
}

/**
 * Reset tab switch detection (for testing)
 */
export function resetTabSwitchDetection() {
  tabSwitchCount = 0;
  warningCount = 0;
  lastBlurTime = null;
  isEliminated = false;
  removeBlurEffect();
}
