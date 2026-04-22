// LinkGuard Extension - Common Error Fixes
// Run this script in browser console to diagnose issues

console.log('🛡️ LinkGuard Extension Diagnostics');
console.log('=====================================');

// Check if extension is loaded
function checkExtensionLoaded() {
  console.log('\n1. Checking Extension Status...');
  
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    console.log('✅ Chrome extension API available');
    
    if (chrome.runtime.id) {
      console.log('✅ Extension loaded with ID:', chrome.runtime.id);
    } else {
      console.log('❌ Extension ID not found - extension may not be loaded');
    }
  } else {
    console.log('❌ Chrome extension API not available');
    console.log('💡 Solution: Make sure you\'re running this in a Chrome extension context');
  }
}

// Check API connection
async function checkAPIConnection() {
  console.log('\n2. Checking API Connection...');
  
  const apiUrl = 'http://localhost:5001/api/scan';
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: 'https://google.com' })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API connection successful');
      console.log('📊 Sample response:', data);
    } else {
      console.log('❌ API returned error:', response.status, response.statusText);
      console.log('💡 Solution: Check if backend server is running on port 5001');
    }
  } catch (error) {
    console.log('❌ API connection failed:', error.message);
    
    if (error.message.includes('CORS')) {
      console.log('💡 CORS Error Solution:');
      console.log('   Add this to your backend server.js:');
      console.log('   app.use(cors({ origin: ["http://localhost:5173", "chrome-extension://*"] }));');
    } else if (error.message.includes('fetch')) {
      console.log('💡 Network Error Solution:');
      console.log('   1. Start backend: cd backend && npm run dev');
      console.log('   2. Verify backend runs on http://localhost:5001');
      console.log('   3. Check firewall/antivirus blocking connections');
    }
  }
}

// Check content script injection
function checkContentScript() {
  console.log('\n3. Checking Content Script...');
  
  const linkGuardElements = document.querySelectorAll('.linkguard-indicator, .linkguard-loading');
  
  if (linkGuardElements.length > 0) {
    console.log('✅ Content script is working');
    console.log('📊 Found', linkGuardElements.length, 'LinkGuard indicators');
  } else {
    console.log('❌ Content script not detected');
    console.log('💡 Solutions:');
    console.log('   1. Refresh the page');
    console.log('   2. Check if extension is enabled');
    console.log('   3. Reload extension in chrome://extensions/');
  }
  
  // Check for links on page
  const links = document.querySelectorAll('a[href]');
  console.log('📊 Found', links.length, 'links on page');
  
  if (links.length === 0) {
    console.log('💡 No links found - content script has nothing to process');
  }
}

// Check extension permissions
function checkPermissions() {
  console.log('\n4. Checking Extension Permissions...');
  
  if (typeof chrome !== 'undefined' && chrome.permissions) {
    chrome.permissions.getAll((permissions) => {
      console.log('📋 Extension permissions:', permissions);
      
      const requiredPermissions = ['activeTab', 'storage', 'webNavigation'];
      const hasAllPermissions = requiredPermissions.every(perm => 
        permissions.permissions.includes(perm)
      );
      
      if (hasAllPermissions) {
        console.log('✅ All required permissions granted');
      } else {
        console.log('❌ Missing required permissions');
        console.log('💡 Solution: Reload extension in chrome://extensions/');
      }
    });
  } else {
    console.log('❌ Cannot check permissions - not in extension context');
  }
}

// Check local storage
function checkStorage() {
  console.log('\n5. Checking Extension Storage...');
  
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.sync.get(null, (items) => {
      console.log('📦 Extension storage:', items);
      
      if (Object.keys(items).length === 0) {
        console.log('💡 No settings found - extension will use defaults');
      } else {
        console.log('✅ Extension settings loaded');
      }
    });
  } else {
    console.log('❌ Cannot access extension storage');
  }
}

// Check for common errors in console
function checkConsoleErrors() {
  console.log('\n6. Common Error Patterns...');
  
  // Override console.error to catch LinkGuard errors
  const originalError = console.error;
  const errors = [];
  
  console.error = function(...args) {
    const message = args.join(' ');
    if (message.toLowerCase().includes('linkguard') || 
        message.toLowerCase().includes('failed to fetch') ||
        message.toLowerCase().includes('cors')) {
      errors.push(message);
    }
    originalError.apply(console, args);
  };
  
  setTimeout(() => {
    console.error = originalError;
    
    if (errors.length > 0) {
      console.log('❌ Found LinkGuard-related errors:');
      errors.forEach(error => console.log('   -', error));
    } else {
      console.log('✅ No LinkGuard errors detected in console');
    }
  }, 1000);
}

// Main diagnostic function
async function runDiagnostics() {
  console.log('🔍 Running LinkGuard Extension Diagnostics...\n');
  
  checkExtensionLoaded();
  await checkAPIConnection();
  checkContentScript();
  checkPermissions();
  checkStorage();
  checkConsoleErrors();
  
  console.log('\n🎯 Quick Fixes:');
  console.log('================');
  console.log('1. Restart backend: cd backend && npm run dev');
  console.log('2. Reload extension: chrome://extensions/ → Reload');
  console.log('3. Refresh this page');
  console.log('4. Check browser console for errors (F12)');
  console.log('5. Verify PNG icons exist in icons/ folder');
  
  console.log('\n📞 Need More Help?');
  console.log('==================');
  console.log('1. Check SETUP_GUIDE.md for detailed instructions');
  console.log('2. Verify all files are in correct locations');
  console.log('3. Test with a simple website like google.com');
  console.log('4. Make sure Chrome Developer Mode is enabled');
}

// Auto-run diagnostics
runDiagnostics();

// Export functions for manual testing
window.LinkGuardDiagnostics = {
  checkExtensionLoaded,
  checkAPIConnection,
  checkContentScript,
  checkPermissions,
  checkStorage,
  runDiagnostics
};