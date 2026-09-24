import { GRID_COLS } from '../constants/gridConfig';

// Builds a react-grid-layout `layouts` map for every configured breakpoint.
// `lg` uses the authored (x, y, w, h) positions; smaller breakpoints stack
// each widget full-width in the same order, since a hand-placed grid doesn't
// reflow sensibly below a few columns.
export function buildResponsiveLayouts(widgetDefs) {
  const layouts = {};
  Object.entries(GRID_COLS).forEach(([bp, colCount]) => {
    if (bp === 'lg') {
      layouts[bp] = widgetDefs.map((w) => ({
        i: w.id, x: w.x, y: w.y, w: w.w, h: w.h, minW: 2, minH: 2,
      }));
      return;
    }
    let y = 0;
    layouts[bp] = widgetDefs.map((w) => {
      const item = { i: w.id, x: 0, y, w: colCount, h: w.h, minW: 2, minH: 2 };
      y += w.h;
      return item;
    });
  });
  return layouts;
}

// Skyline bin-packing: walks items in reading order (top-to-bottom,
// left-to-right) and drops each one into the topmost-then-leftmost open slot
// it fits in. Unlike react-grid-layout's own compaction (which only slides
// items up OR left, preserving the other axis — so a narrower widget next to
// a wider one leaves a permanent side gap), this closes gaps on both axes,
// the way a mobile home-screen grid reflows icons to fill a spot you emptied.
export function packLayout(layout, cols) {
  const ordered = [...layout].sort((a, b) => a.y - b.y || a.x - b.x);
  const skyline = new Array(cols).fill(0);

  return ordered.map((item) => {
    const w = Math.min(item.w, cols);
    let bestX = 0;
    let bestY = Infinity;
    for (let x = 0; x <= cols - w; x++) {
      let y = 0;
      for (let c = x; c < x + w; c++) y = Math.max(y, skyline[c]);
      if (y < bestY) {
        bestY = y;
        bestX = x;
      }
    }
    for (let c = bestX; c < bestX + w; c++) skyline[c] = bestY + item.h;
    return { ...item, x: bestX, y: bestY };
  });
}

function layoutKey(l) {
  return `${l.i}:${l.x}:${l.y}:${l.w}:${l.h}`;
}

export function layoutsEqual(a, b) {
  if (a.length !== b.length) return false;
  const as = new Set(a.map(layoutKey));
  return b.every((l) => as.has(layoutKey(l)));
}
