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