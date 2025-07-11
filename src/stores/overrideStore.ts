import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

export const useOverrideStore = create<OverrideStore>()(
  persist(
    (set, get) => ({
      overrides: {},
      
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
    }),
    {
      name: 'override-storage',
    }
  )
); 