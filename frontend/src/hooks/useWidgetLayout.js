import { useCallback, useState } from 'react';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* localStorage unavailable */
  }
}

export function useWidgetLayout({ storageKey, defaultLayouts }) {
  const layoutKey = `${storageKey}-layout:v1`;
  const hiddenKey = `${storageKey}-hidden:v1`;

  const [layouts, setLayouts] = useState(() => readJSON(layoutKey, defaultLayouts));
  const [hiddenIds, setHiddenIds] = useState(() => readJSON(hiddenKey, []));

  const handleLayoutChange = useCallback((_current, allLayouts) => {
    setLayouts(allLayouts);
    writeJSON(layoutKey, allLayouts);
  }, [layoutKey]);

  const hideWidget = useCallback((id) => {
    setHiddenIds((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      writeJSON(hiddenKey, next);
      return next;
    });
  }, [hiddenKey]);

  const resetLayout = useCallback(() => {
    setLayouts(defaultLayouts);
    setHiddenIds([]);
    writeJSON(layoutKey, defaultLayouts);
    writeJSON(hiddenKey, []);
  }, [defaultLayouts, layoutKey, hiddenKey]);

  return { layouts, hiddenIds, handleLayoutChange, hideWidget, resetLayout };
}
