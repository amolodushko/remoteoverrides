import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chromeStorage } from './chromeStorage';

interface OverrideData {
  override: string;
  input_1: string;
  input_2: string;
  selection: number;
}

interface OverrideStore {
  overrides: Record<string, OverrideData>;
  setOverride: (app: string, data: OverrideData) => void;
  removeOverride: (app: string) => void;
  getOverride: (app: string) => OverrideData | null;
  autorefresh: boolean;
  setAutorefresh: (value: boolean) => void;
  ensureStorageExists: () => Promise<void>;
}

export const useOverrideStore = create<OverrideStore>()(
  persist(
    (set, get) => ({
      overrides: {},
      autorefresh: true,
      setOverride: (app: string, data: OverrideData) => {
        set((state) => ({
          overrides: {
            ...state.overrides,
            [app]: data,
          },
        }));
      },
      removeOverride: (app: string) => {
        set((state) => {
          const newOverrides = { ...state.overrides };
          delete newOverrides[app];
          return { overrides: newOverrides };
        });
      },
      getOverride: (app: string) => {
        return get().overrides[app] || null;
      },
      setAutorefresh: (value: boolean) => set({ autorefresh: value }),
      ensureStorageExists: async () => {
        // Check if storage exists by trying to read it
        if (typeof chrome !== 'undefined' && chrome.storage) {
          try {
            chrome.storage.local.get(['override-storage'], (result) => {
              // If storage doesn't exist, create it with default values
              if (!result['override-storage']) {
                const defaultState = {
                  overrides: {},
                  autorefresh: true,
                };
                
                // Force persist the default state
                set(defaultState);
                
                console.log('Created override-storage with default values');
              }
            });
          } catch (error) {
            console.error('Error checking/creating override storage:', error);
          }
        }
      },
    }),
    {
      name: 'override-storage',
      storage: chromeStorage,
      partialize: (state) => ({
        overrides: Object.fromEntries(
          Object.entries(state.overrides).map(([app, data]) => [
            app,
            {
              input_1: data.input_1,
              input_2: data.input_2,
              selection: data.selection,
              // override field is completely excluded from persistence
            }
          ])
        ),
        autorefresh: state.autorefresh,
      }),
      onRehydrateStorage: () => (state) => {
        // This callback is called when the store is rehydrated
        // If state is null, it means no storage existed, so we force persist the default state
        if (!state) {
          // Force persist the default state to ensure storage is created
          const defaultState = {
            overrides: {},
            autorefresh: true,
          };
          // Trigger a set to force persistence
          useOverrideStore.setState(defaultState);
        }
      },
    }
  )
); 