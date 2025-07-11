import { useState } from "react";
import type { AppData } from "../../stores/appSelectionStore";
import { useAppSelectionStore } from "../../stores/appSelectionStore";

interface CreateAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (app: Omit<AppData, 'id'>) => void;
}

const CreateAppModal = ({ isOpen, onClose, onSave }: CreateAppModalProps) => {
  const getAllApps = useAppSelectionStore((state) => state.getAllApps);
  const [formData, setFormData] = useState({
    app: "",
    label: "",
    key: "",
    path: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.app && formData.label && formData.key && formData.path) {
      onSave(formData);
      setFormData({ app: "", label: "", key: "", path: "" });
      onClose();
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const allApps = getAllApps();
  
  // Validation functions
  const getValidationErrors = () => {
    const errors: string[] = [];
    
    // Check for duplicate app code
    if (allApps.some(app => app.app.toLowerCase() === formData.app.toLowerCase())) {
      errors.push("App Code already exists");
    }
    
    // Check for duplicate app key
    if (allApps.some(app => app.key.toLowerCase() === formData.key.toLowerCase())) {
      errors.push("App Key already exists");
    }
    
    // Check for duplicate app label
    if (allApps.some(app => app.label.toLowerCase() === formData.label.toLowerCase())) {
      errors.push("App Label already exists");
    }
    
    // Check for duplicate app path
    if (allApps.some(app => app.path.toLowerCase() === formData.path.toLowerCase())) {
      errors.push("App Path already exists");
    }
    
    return errors;
  };
  
  const validationErrors = getValidationErrors();
  const isFormValid = formData.app && formData.label && formData.key && formData.path && validationErrors.length === 0;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-gray-900">Create New App</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Please fix the following errors:</p>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              App Code *
            </label>
            <input
              type="text"
              value={formData.app}
              onChange={handleChange('app')}
              className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Rp, Neo, Fl"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              App Label *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={handleChange('label')}
              className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Ride Plan, Neo, Flexity"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              App Key (override key without @) *
            </label>
            <input
              type="text"
              value={formData.key}
              onChange={handleChange('key')}
             className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., ride-plan, via-hub-dev"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              App Path *
            </label>
            <input
              type="text"
              value={formData.path}
              onChange={handleChange('path')}
              className="w-full px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., /planning/ride-planner"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className="bg-blue-600 text-white px-2 py-1 rounded font-small text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {validationErrors.length > 0 ? 'Fix Errors' : 'Create App'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppModal; 