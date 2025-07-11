import { useState } from "react";
import type { AppData } from "../../stores/appSelectionStore";

interface CreateAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (app: Omit<AppData, 'id'>) => void;
}

const CreateAppModal = ({ isOpen, onClose, onSave }: CreateAppModalProps) => {
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

  const isFormValid = formData.app && formData.label && formData.key && formData.path;

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
              Create App
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppModal; 