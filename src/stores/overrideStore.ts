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
      })
    }
  )
); 