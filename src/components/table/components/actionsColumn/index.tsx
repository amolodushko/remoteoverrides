import { useRef, useState, useEffect } from "react";
import { useOverrideStore } from "../../../../stores/overrideStore";

const ActionsColumn = ({ app, label }: { app: string; label: string }) => {
  const { setOverride, removeOverride, getOverride } = useOverrideStore();
  const [selected, setSelected] = useState(0);
  const [inputs, setInputs] = useState(["", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Load existing data from store on component mount
  useEffect(() => {
    const existingData = getOverride(app);
    if (existingData) {
      setInputs([existingData.input_1, existingData.input_2]);
      setSelected(existingData.selection);
    }
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

  const normalizeValue = (value: string) => {
    if(value.includes("remoteEntry.js")) {
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
      selection: selected
    };
    
    setOverride(app, dataToSave);
    console.log("applied", dataToSave, app);
  };

  const onReset = () => {
    removeOverride(app);
    console.log("reset", app);
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
                className="px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Branch name to override ${label}`}
              />
            </label>
          ))}
        </div>
        <div
          data-attr="button-container"
          className="flex items-center gap-2 flex-col"
        >
          <button
            className="bg-blue-600 text-white px-2 py-1 rounded font-small text-sm"
            onClick={onApply}
          >
            Apply
          </button>
          <button
            className="text-red-500 px-2 py-1 rounded font-small text-sm"
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      </div>
    </td>
  );
};

export default ActionsColumn;
