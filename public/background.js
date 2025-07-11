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
}); 