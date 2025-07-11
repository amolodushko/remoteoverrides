import { useAppSelectionStore } from "../../stores/appSelectionStore";
import { useOverrideStore } from "../../stores/overrideStore";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAppClick: () => void;
}

const SettingsModal = ({
  isOpen,
  onClose,
  onCreateAppClick,
}: SettingsModalProps) => {
  const getAllApps = useAppSelectionStore((state) => state.getAllApps);
  const toggleApp = useAppSelectionStore((state) => state.toggleApp);
  const setSelectedApps = useAppSelectionStore((state) => state.setSelectedApps);
  const deleteApp = useAppSelectionStore((state) => state.deleteApp);
  const isCustomApp = useAppSelectionStore((state) => state.isCustomApp);
  const selectedApps = useAppSelectionStore((state) => state.selectedApps || []);
  const allApps = getAllApps();

  // Autorefresh state from store
  const autorefresh = useOverrideStore((state) => state.autorefresh);
  const setAutorefresh = useOverrideStore((state) => state.setAutorefresh);

  if (!isOpen) return null;

  const handleSelectAll = () => {
    setSelectedApps(allApps.map((app) => app.key));
  };

  const handleDeselectAll = () => {
    setSelectedApps([]);
  };

  const selectedCount = selectedApps.length;
  const totalCount = allApps.length;

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-2 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center mb-2 gap-2">
          <h2 className="text-xs font-semibold text-gray-900 flex-1">Settings</h2>
          <button
              onClick={onCreateAppClick}
              className="text-xs px-1 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              + Add New App MF config
            </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Autorefresh Section */}
        <div className="mb-4 flex items-center gap-2 p-2 bg-gray-50 rounded">
          <input
            id="autorefresh-checkbox"
            type="checkbox"
            checked={autorefresh}
            onChange={e => setAutorefresh(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="autorefresh-checkbox" className="text-sm text-gray-800 select-none cursor-pointer">
            Autorefresh (reload page after Apply/Reset)
          </label>
        </div>

        <div className="mb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600">
              Selected: {selectedCount} of {totalCount}
            </span>
            <div className="space-x-1">
              <button
                onClick={handleSelectAll}
                className="text-xs p-0.5 text-blue-600 hover:text-blue-800"
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAll}
                className="text-xs p-0.5 text-red-600 hover:text-red-800"
              >
                Deselect All
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {allApps.map((app) => (
            <div
              key={app.key}
              className="flex items-center space-x-3 p-1 hover:bg-gray-50 rounded"
            >
              <input
                type="checkbox"
                checked={selectedApps.includes(app.key)}
                onChange={() => toggleApp(app.key)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  {app.label}
                </span>
                <span className="text-xs text-gray-500">
                  {" "}
                  • {app.key}@ • {app.path}
                </span>
              </div>
              {isCustomApp(app.key) && (
                <button
                  onClick={() => deleteApp(app.key)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete app"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="text-black-500 px-2 py-1 rounded font-small text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
