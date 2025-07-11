// Chrome storage adapter for Zustand persist
export const chromeStorage = {
  getItem: (name: string): Promise<any> => {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get([name], (result: any) => {
          resolve(result[name] || null);
        });
      } else {
        // Fallback to localStorage for development
        resolve(localStorage.getItem(name));
      }
    });
  },
  
  setItem: (name: string, value: any): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ [name]: value }, () => {
          resolve();
        });
      } else {
        // Fallback to localStorage for development
        localStorage.setItem(name, JSON.stringify(value));
        resolve();
      }
    });
  },
  
  removeItem: (name: string): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.remove([name], () => {
          resolve();
        });
      } else {
        // Fallback to localStorage for development
        localStorage.removeItem(name);
        resolve();
      }
    });
  }
}; 