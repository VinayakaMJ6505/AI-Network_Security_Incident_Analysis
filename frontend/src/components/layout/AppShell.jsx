import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';

const COLLAPSE_KEY = 'suite-strike:sidebar-collapsed';

function getInitialCollapsed() {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export default function AppShell({ activeTab, setActiveTab, backendOnline, onRefresh, isRefreshing, children }) {
  const [collapsed, setCollapsed] = useState(getInitialCollapsed);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, String(collapsed));
    } catch (e) {
      /* localStorage unavailable */
    }
  }, [collapsed]);

  const handleSelect = (id) => {
    setActiveTab(id);
    setMobileNavOpen(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleSelect}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        className="hidden lg:flex"
      />

      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar
                activeTab={activeTab}
                setActiveTab={handleSelect}
                collapsed={false}
                onToggleCollapsed={() => setMobileNavOpen(false)}
                className="h-full w-64"
                isMobileDrawer
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          backendOnline={backendOnline}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <main className="min-w-0 flex-1 overflow-y-auto px-3 py-5 sm:px-6 sm:py-7">
          <div className="mx-auto w-full min-w-0 max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
