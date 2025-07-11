import { useOverrideStore } from "../../../stores/overrideStore";

export function useOverrideValue(app: string): string | null {
  const overrideData = useOverrideStore((state) => state.overrides[app]);
  
  return overrideData?.override || null;
} 