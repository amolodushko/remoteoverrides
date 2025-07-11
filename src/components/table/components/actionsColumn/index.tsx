import { useRef, useState, useEffect } from "react";
import { useOverrideStore } from "../../../../stores/overrideStore";

const ActionsColumn = ({ app, label }: { app: string; label: string }) => {
  const setOverride = useOverrideStore((state) => state.setOverride);
  const getOverride = useOverrideStore((state) => state.getOverride);
  const autorefresh = useOverrideStore((state) => state.autorefresh);
  const [selected, setSelected] = useState(0);
  const [inputs, setInputs] = useState(["", ""]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const splitButtonRef = useRef<HTMLDivElement>(null);
  const chevronButtonRef = useRef<HTMLButtonElement>(null);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Load existing data from store on component mount
  useEffect(() => {
    const existingData = getOverride(app);
    setInputs([existingData?.input_1 ?? "", existingData?.input_2 ?? ""]);
    setSelected(existingData?.selection ?? 0);
  }, [app, getOverride]);

  const handleRadioChange = (idx: number) => {
    setSelected(idx);
    inputRefs[idx].current?.focus();
  };

  const handleInputFocus = (idx: number) => {
    setSelected(idx);
  };

  const handleInputChange = (idx: number, val: string) => {
    setInputs((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const handleInputBlur = () => {
    // Save current input values to store on blur
    const existingData = getOverride(app);
    const dataToSave = {
      override: existingData?.override || "",
      input_1: inputs[0],
      input_2: inputs[1],
      selection: selected,
    };
    setOverride(app, dataToSave);
  };

  const normalizeValue = (value: string) => {
    if (value.includes("remoteEntry.js")) {
      return value;
    }
    return value.replaceAll("/", "_");
  };

  const onApply = () => {
    const value = inputs[selected].trim();
    if (!value) {
      return onReset();
    }

    const dataToSave = {
      override: normalizeValue(value),
      input_1: inputs[0],
      input_2: inputs[1],
      selection: selected,
    };

    setOverride(app, dataToSave);

    // Send message to background script to update page localStorage
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.sendMessage({
        type: "UPDATE_PAGE_OVERRIDE",
        app: app,
        value: normalizeValue(value),
        action: "apply",
      });
    }

    if (autorefresh && typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab && currentTab.id) {
          chrome.tabs.reload(currentTab.id);
        }
      });
    }

    console.log("applied", dataToSave, app);
  };

  const onReset = () => {
    const dataToSave = {
      override: "",
      input_1: inputs[0],
      input_2: inputs[1],
      selection: selected,
    };

    setOverride(app, dataToSave);

    // Send message to background script to remove override from page localStorage
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.sendMessage({
        type: "UPDATE_PAGE_OVERRIDE",
        app: app,
        action: "reset",
      });
    }

    // Close dropdown after reset
    setIsDropdownOpen(false);
    // Remove focus from chevron button
    if (chevronButtonRef.current) {
      chevronButtonRef.current.blur();
    }
    if (autorefresh && typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab && currentTab.id) {
          chrome.tabs.reload(currentTab.id);
        }
      });
    }

    console.log("reset", app);
  };

  // Handle blur/focus for split button
  const handleSplitButtonBlur = () => {
    // Timeout allows click on Reset to register before closing
    setTimeout(() => {
      if (
        splitButtonRef.current &&
        !splitButtonRef.current.contains(document.activeElement)
      ) {
        setIsDropdownOpen(false);
      }
    }, 0);
  };

  return (
    <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
      <div className="flex items-center space-x-2">
        <div
          data-attr="radio-and-field-container"
          className="flex flex-col gap-1"
        >
          {[0, 1].map((idx) => (
            <label key={idx} className="flex items-center gap-2">
              <input
                type="radio"
                checked={selected === idx}
                onChange={() => handleRadioChange(idx)}
                className="accent-blue-600"
              />
              <input
                ref={inputRefs[idx]}
                type="text"
                value={inputs[idx]}
                onFocus={() => handleInputFocus(idx)}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onBlur={handleInputBlur}
                className="px-1 py-1 w-60 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Branch name to override ${label}`}
              />
            </label>
          ))}
        </div>
        <div
          data-attr="button-container"
          className="flex items-center gap-2 flex-col"
        >
          <div
            className="relative group"
            ref={splitButtonRef}
            tabIndex={-1}
            onBlur={handleSplitButtonBlur}
          >
            <div className="flex shadow-md rounded-[6px] overflow-hidden border border-blue-600 bg-blue-600 group-hover:shadow-lg transition-all duration-150">
              <button
                className="bg-blue-600 text-white px-5 py-1 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-150 hover:bg-blue-700 rounded-l-[6px]"
                onClick={onApply}
                tabIndex={0}
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              >
                Apply
              </button>
              <button
                ref={chevronButtonRef}
                className={`bg-blue-500 text-white w-8 h-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-150 hover:bg-blue-700 border-l border-blue-400 ${
                  isDropdownOpen ? "bg-blue-700" : ""
                } rounded-r-[6px]`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                tabIndex={0}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                aria-label="Show more actions"
                style={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  marginLeft: "-1px",
                }}
              >
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 w-28 z-20 bg-white rounded-lg shadow-lg border border-gray-200 animate-fade-in">
                <button
                  className="w-full text-left bg-red-500 text-white px-2 py-2 rounded-lg font-medium text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors duration-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(false);
                    onReset();
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </td>
  );
};

export default ActionsColumn;
