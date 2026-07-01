import { useEffect } from "react";

export function useKeyboard(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: { enabled?: boolean } = {}
): void {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === key) callback(event);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback, enabled]);
}
