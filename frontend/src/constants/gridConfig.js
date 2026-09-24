// Thresholds are tuned against the widget grid's actual container width (viewport
// minus the sidebar and page padding), not the raw window width — a 1440px window
// leaves ~1100-1200px for the grid, so `lg` starts well below the 1440/1200 numbers
// react-grid-layout's own docs example uses.
export const GRID_BREAKPOINTS = { lg: 1000, md: 760, sm: 580, xs: 420, xxs: 0 };
export const GRID_COLS = { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 };
