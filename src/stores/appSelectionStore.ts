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
      selectedApps: allApps.map(app => app.key), // Default to all selected
      apps: [...allApps],
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
          // Avoid duplicates
          if (state.apps.some(app => app.key === newApp.key)) {
            return {};
          }
          const newId = Math.max(...state.apps.map(app => app.id), 0) + 1;
          const appToAdd: AppData = { ...newApp, id: newId };
          return {
            apps: [...state.apps, appToAdd],
            selectedApps: [...state.selectedApps, newApp.key],
          };
        });
      },
      deleteApp: (appKey: string) => {
        set((state) => {
          const newApps = state.apps.filter(app => app.key !== appKey);
          const newSelectedApps = state.selectedApps.filter(key => key !== appKey);
          return {
            apps: newApps,
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
          ...new Set([...(state.selectedApps || []), ...allApps.map(a => a.key)])
        ],
        apps: [
          ...allApps,
          ...state.apps.filter(app => !allApps.some(a => a.key === app.key))
        ],
      }),
    }
  )
); 