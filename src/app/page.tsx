'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Stats } from '@/components/Stats';
import { BuryForm } from '@/components/BuryForm';
import { Graveyard } from '@/components/Graveyard';

type Tab = 'bury' | 'graveyard' | 'my';

export default function Home() {
  const [tab, setTab] = useState<Tab>('bury');
  const [refreshKey, setRefreshKey] = useState(0);
  const appRef = useRef<HTMLDivElement>(null);

  const scrollToApp = (t?: Tab) => {
    if (t) setTab(t);
    appRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'bury', label: 'Bury Token' },
    { id: 'graveyard', label: 'Graveyard' },
    { id: 'my', label: 'My Graves' },
  ];

  return (
    <>
      <Navbar />
      <Hero onBury={() => scrollToApp('bury')} onView={() => scrollToApp('graveyard')} />

      <main className="max-w-[1200px] mx-auto px-6 pb-20" ref={appRef}>
        <Stats />

        {/* Tabs */}
        <div className="inline-flex bg-surface border border-border rounded-full p-1 mb-8">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                tab === t.id
                  ? 'text-t1'
                  : 'text-t3 hover:text-t2'
              }`}
            >
              {tab === t.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-surface2 rounded-full shadow-lg"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {tab === 'bury' && (
            <motion.div
              key="bury"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <BuryForm onSuccess={() => setRefreshKey(k => k + 1)} />
            </motion.div>
          )}

          {tab === 'graveyard' && (
            <motion.div
              key="graveyard"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="font-display text-3xl font-bold">The Graveyard</h2>
                <p className="text-t3 text-sm mt-1">All tokens laid to rest</p>
              </div>
              <Graveyard mode="all" refreshKey={refreshKey} />
            </motion.div>
          )}

          {tab === 'my' && (
            <motion.div
              key="my"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="font-display text-3xl font-bold">My Tombstones</h2>
                <p className="text-t3 text-sm mt-1">Your collection of buried tokens</p>
              </div>
              <Graveyard mode="mine" refreshKey={refreshKey} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border text-center py-12 px-6">
        <p className="text-t3 text-sm leading-relaxed">
          Shitcoin Graveyard &mdash; tokens are locked <strong className="text-t2">forever</strong>
          <br />
          <a
            href="https://basescan.org/address/0x5d22ddb1206f79556b7017150c6edf15105671d9"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent2 transition-colors"
          >
            View Contract on BaseScan
          </a>
        </p>
      </footer>
    </>
  );
}
