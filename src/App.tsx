import './App.css'
import { useState, useEffect } from 'react'
import Header from './components/header'
import Table from './components/table'
import SettingsModal from './components/settings/SettingsModal'
import CreateAppModal from './components/settings/CreateAppModal'
import { useAppSelectionStore } from './stores/appSelectionStore'
import { useOverrideStore } from './stores/overrideStore'
import type { AppData } from './constants/apps'

function App() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const addApp = useAppSelectionStore((state) => state.addApp);
  const ensureAppStorageExists = useAppSelectionStore((state) => state.ensureStorageExists);
  const ensureOverrideStorageExists = useOverrideStore((state) => state.ensureStorageExists);

  // Ensure storage exists on app mount
  useEffect(() => {
    ensureAppStorageExists();
    ensureOverrideStorageExists();
  }, [ensureAppStorageExists, ensureOverrideStorageExists]);

  const handleSaveNewApp = (newApp: Omit<AppData, 'id'>) => {
    addApp(newApp);
  };

  return (
    <div className="h-screen flex max-w:1200 flex-col gap-2 overflow-y-auto">
      <Header onSettingsClick={() => setIsSettingsModalOpen(true)} />
      <Table />
      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)}
        onCreateAppClick={() => setIsCreateModalOpen(true)}
      />
      <CreateAppModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveNewApp}
      />
    </div>
  )
}

export default App
