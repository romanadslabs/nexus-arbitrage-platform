// Error Handler for Nexus Platform
// This script suppresses browser extension errors and handles console warnings

(function() {
  'use strict';

  // Store original console methods
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;

  // Patterns to suppress (browser extension errors)
  const suppressedPatterns = [
    'message port closed',
    'content.js',
    'chrome.runtime',
    'browser.runtime',
    'extension',
    'chrome-extension://',
    'moz-extension://',
    'edge-extension://',
    'safari-extension://'
  ];

  // React DevTools warning pattern
  const reactDevToolsPattern = 'Download the React DevTools';

  // Check if message should be suppressed
  function shouldSuppress(message) {
    if (typeof message !== 'string') return false;
    
    const lowerMessage = message.toLowerCase();
    return suppressedPatterns.some(pattern => 
      lowerMessage.includes(pattern.toLowerCase())
    );
  }

  // Override console.error
  console.error = function(...args) {
    const message = args[0];
    
    if (shouldSuppress(message)) {
      // Store suppressed error for debugging (optional)
      if (window.nexusDebugMode) {
        console.log('[Suppressed Error]:', ...args);
      }
      return;
    }
    
    originalConsoleError.apply(console, args);
  };

  // Override console.warn
  console.warn = function(...args) {
    const message = args[0];
    
    if (typeof message === 'string' && message.includes(reactDevToolsPattern)) {
      return; // Suppress React DevTools warning
    }
    
    originalConsoleWarn.apply(console, args);
  };

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    const reason = event.reason;
    
    // Suppress extension-related promise rejections
    if (typeof reason === 'string' && shouldSuppress(reason)) {
      event.preventDefault();
      return;
    }
    
    // Log other promise rejections
    console.error('Unhandled Promise Rejection:', reason);
  });

  // Handle global errors
  window.addEventListener('error', function(event) {
    const error = event.error;
    const message = event.message;
    
    // Suppress extension-related errors
    if (shouldSuppress(message)) {
      event.preventDefault();
      return;
    }
    
    // Log other errors
    console.error('Global Error:', error || message);
  });

  // Debug mode (can be enabled via console)
  window.nexusDebugMode = false;
  
  // Enable debug mode: window.nexusDebugMode = true;
  // Disable debug mode: window.nexusDebugMode = false;

  console.log('🔧 Nexus Platform Error Handler initialized');
})(); 