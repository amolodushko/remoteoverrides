export interface AppData {
  id: number;
  app: string;
  label: string;
  key: string;
  path: string;
}

export const defaultApps: AppData[] = [
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