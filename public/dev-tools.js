// Nexus Platform Dev Tools
// Provides debugging and development utilities

(function() {
  'use strict';
  
  // Wait for error handler to be available
  function waitForErrorHandler() {
    if (typeof window.errorHandler !== 'undefined') {
      initializeDevTools();
    } else {
      setTimeout(waitForErrorHandler, 100);
    }
  }
  
  function initializeDevTools() {
    // Enhanced dev tools with error handler integration
    window.nexusDevTools = {
      // Help command
      help: function() {
        console.group('🔧 Nexus Platform Dev Tools');
        console.log('Available commands:');
        console.log('• errorHandler.getSuppressedErrors() - Get suppressed errors');
        console.log('• errorHandler.clearSuppressedErrors() - Clear suppressed errors');
        console.log('• window.nexusDebugMode = true/false - Toggle debug mode');
        console.log('• nexusDevTools.help() - Show this help');
        console.log('• nexusDevTools.toggleDebugMode() - Toggle debug mode');
        console.log('• nexusDevTools.getStatus() - Get system status');
        console.log('• nexusDevTools.testError() - Test error handling');
        console.groupEnd();
      },
      
      // Get suppressed errors
      getSuppressedErrors: function() {
        if (window.errorHandler) {
          return window.errorHandler.getSuppressedErrors();
        }
        return [];
      },
      
      // Clear suppressed errors
      clearSuppressedErrors: function() {
        if (window.errorHandler) {
          window.errorHandler.clearSuppressedErrors();
          console.log('✅ Suppressed errors cleared');
        }
      },
      
      // Toggle debug mode
      toggleDebugMode: function() {
        window.nexusDebugMode = !window.nexusDebugMode;
        console.log(`🔧 Debug mode: ${window.nexusDebugMode ? 'ON' : 'OFF'}`);
        return window.nexusDebugMode;
      },
      
      // Get system status
      getStatus: function() {
        const status = {
          errorHandler: !!window.errorHandler,
          debugMode: window.nexusDebugMode || false,
          suppressedErrors: this.getSuppressedErrors().length,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString()
        };
        
        console.group('🔧 Nexus Platform Status');
        console.table(status);
        console.groupEnd();
        
        return status;
      },
      
      // Test error handling
      testError: function() {
        console.log('🧪 Testing error handling...');
        
        // Test 1: Extension error (should be suppressed)
        console.error('message port closed before a response was received');
        
        // Test 2: Real error (should NOT be suppressed)
        console.error('This is a test error for debugging');
        
        console.log('✅ Error handling test completed');
      },
      
      // Get error handler info
      getErrorHandlerInfo: function() {
        if (window.errorHandler) {
          console.group('🔧 Error Handler Info');
          console.log('Instance:', window.errorHandler);
          console.log('Suppressed errors:', this.getSuppressedErrors());
          console.log('Methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.errorHandler)));
          console.groupEnd();
        } else {
          console.log('❌ Error handler not available');
        }
      }
    };
    
    // Initialize debug mode
    if (typeof window.nexusDebugMode === 'undefined') {
      window.nexusDebugMode = false;
    }
    
    console.log('🔧 Nexus Platform Dev Tools loaded');
    console.log('Type nexusDevTools.help() for available commands');
  }
  
  // Start initialization
  waitForErrorHandler();
})(); 