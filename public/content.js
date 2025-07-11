// Content script for Remote Override Manager
console.log('Remote Override Manager content script loaded');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'APPLY_OVERRIDE') {
    // Apply override to the current page
    const { appKey, overrideValue } = request;
    
    // Example: Inject override into page
    // This would be customized based on your specific use case
    if (window.location.pathname.includes(appKey)) {
      // Apply the override logic here
      console.log(`Applying override for ${appKey}: ${overrideValue}`);
      
      // You can inject scripts, modify DOM, etc.
      // For now, just log the override
      sendResponse({ success: true, message: `Override applied: ${overrideValue}` });
    } else {
      sendResponse({ success: false, message: 'App not found on this page' });
    }
  }
});

// Function to get current page info
function getPageInfo() {
  return {
    url: window.location.href,
    pathname: window.location.pathname,
    hostname: window.location.hostname
  };
}

// Send page info to background script
chrome.runtime.sendMessage({
  type: 'PAGE_INFO',
  data: getPageInfo()
}); 

// Log current page override and all overrides
(function logOverrides() {
  try {
    const allOverrides = localStorage.getItem('remoteOverrides') || '';
    if (!allOverrides) {
      console.log('No remote overrides set.');
      return;
    }
    // Print all overrides
    console.log('All overrides:', allOverrides);
    // Try to find the override for the current app (by hostname or pathname)
    const overridesArr = allOverrides.split(',');
    let currentApp = null;
    let currentValue = null;
    // Try to match by pathname or hostname
    for (const entry of overridesArr) {
      const [app, value] = entry.split('@');
      if (!app || !value) continue;
      // Heuristic: if the app name is in the URL, consider it current
      if (window.location.href.includes(app)) {
        currentApp = app;
        currentValue = value;
        break;
      }
    }
    if (currentApp && currentValue) {
      console.log('%cCurrent page override:  ' + currentApp + '@' + currentValue, 'color: #b59f00; font-weight: bold;');
    } else {
      console.log('Current page override:  none');
    }
  } catch (e) {
    console.log('Error logging overrides:', e);
  }
})(); 