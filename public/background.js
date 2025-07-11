// Background service worker for Remote Override Manager
chrome.runtime.onInstalled.addListener(() => {
  console.log('Remote Override Manager extension installed');
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_OVERRIDE_DATA') {
    // Get override data from storage
    chrome.storage.local.get(['override-storage', 'app-selection-storage'], (result) => {
      sendResponse({
        overrideData: result['override-storage'] || {},
        appSelectionData: result['app-selection-storage'] || {}
      });
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.type === 'SET_OVERRIDE_DATA') {
    // Store override data
    chrome.storage.local.set({
      'override-storage': request.data
    }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.type === 'SET_APP_SELECTION_DATA') {
    // Store app selection data
    chrome.storage.local.set({
      'app-selection-storage': request.data
    }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.type === 'GET_PAGE_OVERRIDE') {
    // Get the specific app's override from the active tab's localStorage
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab && currentTab.id) {
        chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          func: (appKey) => {
            // Get current remoteOverrides from localStorage
            const currentOverrides = localStorage.getItem('remoteOverrides') || '';
            
            // Parse existing overrides to find the specific app
            if (currentOverrides) {
              const overridesArray = currentOverrides.split(',');
              for (const override of overridesArray) {
                const [key, value] = override.split('@');
                if (key === appKey && value) {
                  return value;
                }
              }
            }
            
            return null;
          },
          args: [request.app || '']
        }, (result) => {
          if (chrome.runtime.lastError) {
            console.error('Script execution error:', chrome.runtime.lastError);
            sendResponse({ overrideValue: null, error: chrome.runtime.lastError.message });
          } else {
            const overrideValue = result && result[0] && result[0].result;
            sendResponse({ overrideValue: overrideValue });
          }
        });
      } else {
        sendResponse({ overrideValue: null, error: 'No active tab found' });
      }
    });
    return true; // Keep message channel open for async response
  }

  if (request.type === 'UPDATE_PAGE_OVERRIDE') {
    // Update the active tab's localStorage with override data
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab && currentTab.id) {
        chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          func: (appKey, action, overrideValue) => {
            // Get current remoteOverrides from localStorage
            const currentOverrides = localStorage.getItem('remoteOverrides') || '';
            
            // Parse existing overrides into a map
            const overridesMap = new Map();
            if (currentOverrides) {
              currentOverrides.split(',').forEach(override => {
                const [key, value] = override.split('@');
                if (key && value) {
                  overridesMap.set(key, value);
                }
              });
            }
            
            if (action === 'apply') {
              // Update with new override
              overridesMap.set(appKey, overrideValue);
            } else if (action === 'reset') {
              // Remove the override
              overridesMap.delete(appKey);
            }
            
            // Convert back to string format
            const newOverrides = Array.from(overridesMap.entries())
              .map(([key, value]) => `${key}@${value}`)
              .join(',');
            
            // Save to localStorage
            localStorage.setItem('remoteOverrides', newOverrides);
            
            return newOverrides;
          },
          args: [
            request.app || '', 
            request.action || '', 
            request.value || ''
          ]
        }, (result) => {
          if (chrome.runtime.lastError) {
            console.error('Script execution error:', chrome.runtime.lastError);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            sendResponse({ success: true, result: result });
          }
        });
      } else {
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true; // Keep message channel open for async response
  }

  // Handle badge setting from content script
  if (request.type === 'SET_BADGE') {
    if (request.hasOverride && request.badgeText) {
      const badge = String(request.badgeText).slice(0, 4);
      chrome.action.setBadgeText({ text: badge, tabId: sender.tab ? sender.tab.id : undefined });
      chrome.action.setBadgeBackgroundColor({ color: '#b59f00', tabId: sender.tab ? sender.tab.id : undefined });
      chrome.action.setTitle({ title: request.title || 'Remote Override Manager', tabId: sender.tab ? sender.tab.id : undefined });
    } else {
      chrome.action.setBadgeText({ text: '', tabId: sender.tab ? sender.tab.id : undefined });
      chrome.action.setTitle({ title: 'Remote Override Manager', tabId: sender.tab ? sender.tab.id : undefined });
    }
    return;
  }
}); 