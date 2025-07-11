import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppData {
  id: number;
  app: string;
  label: string;
  key: string;
  path: string;
}

interface AppSelectionStore {
  selectedApps: string[];
  apps: AppData[];
  _persistedApps: AppData[];
  toggleApp: (appKey: string) => void;
  setSelectedApps: (appKeys: string[]) => void;
  isAppSelected: (appKey: string) => boolean;
  getAllApps: () => AppData[];
  addApp: (app: Omit<AppData, 'id'>) => void;
  deleteApp: (appKey: string) => void;
  isCustomApp: (appKey: string) => boolean;
}

export const allApps: AppData[] = [
  {
    id: 1,
    app: "Rp",
    label: "Ride Plan",
    key: "ride-plan",
    path: "/planning/ride-planner",
  },
  {
    id: 2,
    app: "Neo",
    label: "Neo",
    key: "via-hub-dev",
    path: "/network-optimizer",
  },
  {
    id: 5,
    app: "Sm",
    label: "Shift Manager",
    key: "shift-manager",
    path: "/shift-manager",
  },
  {
    id: 3,
    app: "Fl",
    label: "Flexity",
    key: "configuration-service",
    path: "/configuration-service",
  },
];

export const useAppSelectionStore = create<AppSelectionStore>()(
  persist(
    (set, get) => ({
      selectedApps: allApps.map(app => app.key) || [], // Default to all selected
      // apps is a merge of config apps and custom apps from storage
      get apps() {
        // Get custom apps (id > 3 and not in allApps)
        const storedApps = (get()._persistedApps || []) as AppData[];
        const customApps = storedApps.filter(
          (a) => a.id > 3 && !allApps.some((conf) => conf.key === a.key)
        );
        return [...allApps, ...customApps];
      },
      // Internal: only for persistence
      _persistedApps: [],
      toggleApp: (appKey: string) => {
        set((state) => {
          const currentSelectedApps = Array.isArray(state.selectedApps) ? state.selectedApps : [];
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
        return get().apps;
      },
      addApp: (newApp: Omit<AppData, 'id'>) => {
        set((state) => {
          const newId = Math.max(...state.apps.map(app => app.id), 0) + 1;
          const appToAdd: AppData = { ...newApp, id: newId };
          // Only custom apps are persisted
          const customApps = [
            ...((state._persistedApps as AppData[]) || []),
            appToAdd,
          ];
          return {
            _persistedApps: customApps,
            selectedApps: [...state.selectedApps, newApp.key],
          };
        });
      },
      deleteApp: (appKey: string) => {
        set((state) => {
          // Only custom apps are persisted
          const customApps = ((state._persistedApps as AppData[]) || []).filter(app => app.key !== appKey);
          const newSelectedApps = state.selectedApps.filter(key => key !== appKey);
          return {
            _persistedApps: customApps,
            selectedApps: newSelectedApps
          };
        });
      },
      isCustomApp: (appKey: string) => {
        return !allApps.some(app => app.key === appKey);
      },
    }),
    {
      name: 'app-selection-storage',
      partialize: (state) => ({
        selectedApps: [
          // Always include all config app keys
          ...new Set([...(state.selectedApps || []), ...allApps.map(a => a.key)])
        ],
        _persistedApps: state._persistedApps,
      }),
    }
  )
); 