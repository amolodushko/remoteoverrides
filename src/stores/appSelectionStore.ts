import { create } from "zustand";
import { persist } from "zustand/middleware";
import { chromeStorage } from "./chromeStorage";
import { defaultApps, type AppData } from "../constants/apps";

interface AppSelectionStore {
  selectedApps: string[];
  apps: AppData[];
  appOrder: string[]; // Store app keys in the order they should be displayed
  draggedAppKey: string | null;
  toggleApp: (appKey: string) => void;
  setSelectedApps: (appKeys: string[]) => void;
  isAppSelected: (appKey: string) => boolean;
  getAllApps: () => AppData[];
  addApp: (app: Omit<AppData, "id">) => void;
  deleteApp: (appKey: string) => void;
  isCustomApp: (appKey: string) => boolean;
  setDraggedApp: (appKey: string | null) => void;
  handleDrop: (targetAppKey: string) => void;
  ensureStorageExists: () => Promise<void>;
}



export const useAppSelectionStore = create<AppSelectionStore>()(
  persist(
    (set, get) => ({
      selectedApps: defaultApps.map((app) => app.key), // Default to all selected
      apps: [...defaultApps],
      appOrder: defaultApps.map((app) => app.key), // Initialize with default order
      draggedAppKey: null,
      toggleApp: (appKey: string) => {
        set((state) => {
          const currentSelectedApps = Array.isArray(state.selectedApps)
            ? state.selectedApps
            : [];
          const newSelectedApps = [...currentSelectedApps];
          const index = newSelectedApps.indexOf(appKey);
          if (index > -1) {
            newSelectedApps.splice(index, 1);
          } else {
            newSelectedApps.push(appKey);
          }
          return { selectedApps: newSelectedApps };
        });
      },
      setSelectedApps: (appKeys: string[]) => {
        set({ selectedApps: appKeys });
      },
      isAppSelected: (appKey: string) => {
        const selectedApps = get().selectedApps || [];
        return selectedApps.includes(appKey);
      },
      getAllApps: () => {
        const { apps, appOrder } = get();
        // Sort apps according to the stored order
        const appMap = new Map(apps.map((app) => [app.key, app]));
        return appOrder
          .map((key) => appMap.get(key))
          .filter(Boolean) as AppData[];
      },
      addApp: (newApp: Omit<AppData, "id">) => {
        set((state) => {
          // Avoid duplicates
          if (state.apps.some((app) => app.key === newApp.key)) {
            return {};
          }
          const newId = Math.max(...state.apps.map((app) => app.id), 0) + 1;
          const appToAdd: AppData = { ...newApp, id: newId };
          return {
            apps: [...state.apps, appToAdd],
            appOrder: [...state.appOrder, newApp.key],
            selectedApps: [...state.selectedApps, newApp.key],
          };
        });
      },
      deleteApp: (appKey: string) => {
        set((state) => {
          const newApps = state.apps.filter((app) => app.key !== appKey);
          const newSelectedApps = state.selectedApps.filter(
            (key) => key !== appKey
          );
          const newAppOrder = state.appOrder.filter((key) => key !== appKey);
          return {
            apps: newApps,
            selectedApps: newSelectedApps,
            appOrder: newAppOrder,
          };
        });
      },
      isCustomApp: (appKey: string) => {
        return !defaultApps.some((app) => app.key === appKey);
      },
      setDraggedApp: (appKey: string | null) => {
        set({ draggedAppKey: appKey });
      },
      handleDrop: (targetAppKey: string) => {
        const { draggedAppKey } = get();

        if (!draggedAppKey || draggedAppKey === targetAppKey) {
          return;
        }

        set((state) => {
          const draggedIndex = state.appOrder.indexOf(draggedAppKey);
          const targetIndex = state.appOrder.indexOf(targetAppKey);

          if (draggedIndex === -1 || targetIndex === -1) {
            return {};
          }

          const newAppOrder = [...state.appOrder];
          const [draggedKey] = newAppOrder.splice(draggedIndex, 1);
          newAppOrder.splice(targetIndex, 0, draggedKey);

          return {
            appOrder: newAppOrder,
            draggedAppKey: null,
          };
        });
      },
      ensureStorageExists: async () => {
        // Check if storage exists by trying to read it
        if (typeof chrome !== 'undefined' && chrome.storage) {
          try {
            chrome.storage.local.get(['app-selection-storage'], (result) => {
              // If storage doesn't exist, create it with default values
              if (!result['app-selection-storage']) {
                const defaultState = {
                  selectedApps: defaultApps.map((app) => app.key),
                  apps: [...defaultApps],
                  appOrder: defaultApps.map((app) => app.key),
                };
                
                // Force persist the default state
                set(defaultState);
                
                console.log('Created app-selection-storage with default values');
              }
            });
          } catch (error) {
            console.error('Error checking/creating storage:', error);
          }
        }
      },
    }),
    {
      name: "app-selection-storage",
      storage: chromeStorage,
      partialize: (state) => ({
        selectedApps: state.selectedApps,
        apps: [
          ...defaultApps,
          ...state.apps.filter(
            (app) => !defaultApps.some((a) => a.key === app.key)
          ),
        ],
        appOrder: state.appOrder || defaultApps.map((app) => app.key),
      }),
      onRehydrateStorage: () => (state) => {
        // This callback is called when the store is rehydrated
        // If state is null, it means no storage existed, so we force persist the default state
        if (!state) {
          // Force persist the default state to ensure storage is created
          const defaultState = {
            selectedApps: defaultApps.map((app) => app.key),
            apps: [...defaultApps],
            appOrder: defaultApps.map((app) => app.key),
          };
          // Trigger a set to force persistence
          useAppSelectionStore.setState(defaultState);
        }
      },
    }
  )
);
