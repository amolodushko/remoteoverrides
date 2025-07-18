// Shared app constants for background script
const defaultApps = [
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

// Make it available globally for background script (service worker context)
if (typeof self !== 'undefined') {
  self.defaultApps = defaultApps;
} 