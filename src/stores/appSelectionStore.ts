import { create } from "zustand";
import { persist } from "zustand/middleware";

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
      selectedApps: allApps.map((app) => app.key), // Default to all selected
      apps: [...allApps],
      appOrder: allApps.map((app) => app.key), // Initialize with default order
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
        return !allApps.some((app) => app.key === appKey);
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
    }),
    {
      name: "app-selection-storage",
      partialize: (state) => ({
        selectedApps: [
          ...new Set([
            ...(state.selectedApps || []),
            ...allApps.map((a) => a.key),
          ]),
        ],
        apps: [
          ...allApps,
          ...state.apps.filter(
            (app) => !allApps.some((a) => a.key === app.key)
          ),
        ],
        appOrder: state.appOrder || allApps.map((app) => app.key),
      }),
    }
  )
);
