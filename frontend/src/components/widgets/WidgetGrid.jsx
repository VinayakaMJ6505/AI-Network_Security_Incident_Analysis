import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Responsive } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import WidgetCard from './WidgetCard';
import { GRID_BREAKPOINTS, GRID_COLS } from '../../constants/gridConfig';
import { packLayout, layoutsEqual } from '../../utils/gridLayout';

const RESIZABLE_BREAKPOINTS = ['lg', 'md'];
// Used when a real measurement isn't available (e.g. jsdom in tests, which
// has no layout engine and no ResizeObserver) so content still renders.
const FALLBACK_WIDTH = 1200;

export default function WidgetGrid({ widgets, layouts, hiddenIds = [], onLayoutChange, onHide }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [breakpoint, setBreakpoint] = useState('lg');
  // Mirrors `breakpoint` state but updates synchronously, so a layout-change
  // callback firing in the same tick as a breakpoint change (react-grid-layout
  // fires both back to back on resize) always packs against the right column
  // count instead of a stale one from before the re-render lands.
  const breakpointRef = useRef('lg');
  const visible = widgets.filter((widget) => !hiddenIds.includes(widget.id));
  const visibleIds = useMemo(() => visible.map((w) => w.id).sort().join(','), [visible]);

  // react-grid-layout's own WidthProvider measures too early against this app's
  // nested-flex shell (sidebar + main), producing a wrong width on first paint.
  // Measuring synchronously (useLayoutEffect, before browser paint) with our own
  // ResizeObserver avoids that mount-time race.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    setWidth(el.clientWidth || FALLBACK_WIDTH);
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver((entries) => {
      const measured = entries[0]?.contentRect?.width;
      if (measured) setWidth(measured);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Self-heal: react-grid-layout only compacts along one axis (vertical by
  // default), so a widget narrower than its neighbor leaves a permanent side
  // gap instead of the grid auto-filling around it. Whenever the visible
  // widget set or breakpoint changes — including on first mount, so an
  // already-gappy saved layout fixes itself without a manual reset — re-pack
  // the current breakpoint's layout with the 2D bin-packer.
  useLayoutEffect(() => {
    const cols = GRID_COLS[breakpoint];
    const current = (layouts[breakpoint] || []).filter((l) => visible.some((w) => w.id === l.i));
    if (current.length === 0) return;
    const packed = packLayout(current, cols);
    if (!layoutsEqual(current, packed)) {
      onLayoutChange(packed, { ...layouts, [breakpoint]: packed });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakpoint, visibleIds]);

  // react-grid-layout calls `onLayoutChange` as the last step of every
  // settle (drag-stop, resize-stop, and its own breakpoint/mount re-sync),
  // always after any other callback for that same event — so packing here,
  // instead of in onDragStop/onResizeStop, is what actually wins instead of
  // being immediately overwritten by react-grid-layout's own un-packed result.
  const handleLayoutChange = (currentLayout, allLayouts) => {
    const cols = GRID_COLS[breakpointRef.current];
    const packed = packLayout(currentLayout, cols);
    onLayoutChange(packed, { ...allLayouts, [breakpointRef.current]: packed });
  };

  return (
    <div ref={containerRef}>
      {width > 0 && (
        <Responsive
          className="layout"
          width={width}
          layouts={layouts}
          breakpoints={GRID_BREAKPOINTS}
          cols={GRID_COLS}
          rowHeight={80}
          margin={[16, 16]}
          draggableHandle=".widget-drag-handle"
          isResizable={RESIZABLE_BREAKPOINTS.includes(breakpoint)}
          resizeHandles={['se']}
          onBreakpointChange={(bp) => {
            breakpointRef.current = bp;
            setBreakpoint(bp);
          }}
          onLayoutChange={handleLayoutChange}
        >
          {visible.map((widget) => (
            <div key={widget.id}>
              <WidgetCard title={widget.title} onHide={() => onHide(widget.id)}>
                {widget.render()}
              </WidgetCard>
            </div>
          ))}
        </Responsive>
      )}
    </div>
  );
}
