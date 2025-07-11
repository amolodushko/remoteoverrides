import TableHeader from "./components/tableHeader";
import NameColumn from "./components/nameColumn";
import OverrideColumn from "./components/overrideColumn";
import ActionsColumn from "./components/actionsColumn";
import { useAppSelectionStore } from "../../stores/appSelectionStore";
import { useOverrideStore } from "../../stores/overrideStore";

const Table = () => {
  const getAllApps = useAppSelectionStore((state) => state.getAllApps);
  const selectedApps = useAppSelectionStore((state) => state.selectedApps || []);
  const autorefresh = useOverrideStore((state) => state.autorefresh);
  const setOverride = useOverrideStore((state) => state.setOverride);
  const getOverride = useOverrideStore((state) => state.getOverride);
  
  // Get all apps (including created ones) and filter based on selected apps
  const allApps = getAllApps();
  const data = allApps.filter(app => selectedApps.includes(app.key));

  const handleRemoveAllOverrides = () => {
    // Remove all overrides from the current page's localStorage
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.sendMessage({
        type: "REMOVE_ALL_OVERRIDES",
      });
    }

    // Clear overrides in store for all apps
    data.forEach(app => {
      const currentOverride = getOverride(app.key);
      setOverride(app.key, {
        override: "",
        input_1: currentOverride?.input_1 || "",
        input_2: currentOverride?.input_2 || "",
        selection: currentOverride?.selection || 0,
      });
    });

    // Refresh page if autorefresh is enabled
    if (autorefresh && typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab && currentTab.id) {
          chrome.tabs.reload(currentTab.id);
        }
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader />
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <NameColumn id={row.id} app={row.app} label={row.label} />  
                    <OverrideColumn app={row.key} />
                    <ActionsColumn app={row.key} label={row.label} />
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-900 mb-2">No apps selected</p>
                      <p className="text-sm text-gray-500">Go to Settings to select which apps to display</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={handleRemoveAllOverrides}
                className="text-sm px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                title="Remove all overrides from localStorage"
              >
                Remove all overrides
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Table;
