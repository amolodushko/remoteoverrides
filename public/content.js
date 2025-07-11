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

function injectBannerWithRetry(currentApp, currentValue, overridesArr) {
  const maxAttempts = 10; // 10 * 500ms = 5s
  let attempts = 0;
  function tryInject() {
    const header = document.querySelector('[data-testid="voc-header"]');
    if (header) {
      // Remove any existing banner first
      const oldBanner = header.querySelector('.via-remote-override-banner');
      if (oldBanner) oldBanner.remove();
      // Create new banner
      const banner = document.createElement('div');
      banner.className = 'via-remote-override-banner';
      banner.style.cssText = `background: #fffbe6; color: #b59f00; border: 1px solid #ffe58f; border-radius: 6px; padding: 4px 12px; margin-bottom: 8px; font-size: 13px; font-family: inherit; font-weight: 500; display: flex; align-items: center; gap: 4px; flex-direction: column; margin-left: 300px; position: absolute; z-index: 8;`;
      banner.innerHTML =
        '<button class="via-remote-override-banner-x" style="position:absolute;top:2px;right:-15px;background:none;border:none;color:#b59f00;font-size:16px;cursor:pointer;line-height:1; border-radius: 6px; border: 1px solid #ffe58f; width: 14px; height: 14px; line-height: 14px; text-align: center;">&times;</button>' +
        '<span style="white-space: nowrap;">Current override: <b>' +
        (currentApp && currentValue ? currentApp + '@' + currentValue : 'none') +
        '</b></span>' +
        '<span>All overrides: <b>' + overridesArr.length + '</b></span>';
      // Add close handler
      banner.querySelector('.via-remote-override-banner-x').onclick = function(e) {
        e.stopPropagation();
        banner.remove();
        // sessionStorage.setItem('via-remote-override-banner-hidden', '1');
      };
      header.prepend(banner);
      return;
    }
    attempts++;
    if (attempts < maxAttempts) {
      setTimeout(tryInject, 500);
    }
  }
  tryInject();
}

// Log current page override and all overrides
(function logOverrides() {
  try {
    const allOverrides = localStorage.getItem('remoteOverrides') || '';
    if (!allOverrides) {
      console.log('No remote overrides set.');
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({ type: 'SET_BADGE', hasOverride: false });
      }
      // Remove any existing banner if present
      injectBannerWithRetry(null, null, []);
      return;
    }
    // Print all overrides
    console.log('All overrides:', allOverrides);
    // Try to find the override for the current app (by hostname or pathname)
    const overridesArr = allOverrides.split(',').filter(Boolean);
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
    // --- Inject banner with retry ---
    injectBannerWithRetry(currentApp, currentValue, overridesArr);
    // --- End inject banner ---
    if (currentApp && currentValue) {
      console.log('%cCurrent page override:  ' + currentApp + '@' + currentValue, 'color: #b59f00; font-weight: bold;');
      // Notify background to set badge with count
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({ type: 'SET_BADGE', hasOverride: true, badgeText: String(overridesArr.length), title: 'Override: ' + currentApp + '@' + currentValue });
      }
    } else {
      console.log('Current page override:  none');
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({ type: 'SET_BADGE', hasOverride: true, badgeText: String(overridesArr.length), title: 'Remote Override Manager' });
      }
    }
  } catch (e) {
    console.log('Error logging overrides:', e);
  }
})(); 