import { useOverrideStore } from "../../../stores/overrideStore";
import { useState, useEffect } from "react";

export function useOverrideValue(app: string): string | null {
  const override = useOverrideStore((state) => state.overrides[app]?.override);
  const [pageOverrideValue, setPageOverrideValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get current override from page localStorage
  const getPageOverride = async () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      try {
        const response = await chrome.runtime.sendMessage({
          type: 'GET_PAGE_OVERRIDE',
          app: app
        });
        return response.overrideValue || null;
      } catch (error) {
        console.error('Error getting page override:', error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    if(override){
      return;
    }
    const loadPageOverride = async () => {
      setIsLoading(true);
      const pageValue = await getPageOverride();
      setPageOverrideValue(pageValue);
      setIsLoading(false);
    };

    loadPageOverride();
  }, [override]);
  
  if(isLoading){
    return "loading...";
  }

  return override || pageOverrideValue || null;
} 