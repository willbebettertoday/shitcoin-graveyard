'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Stats } from '@/components/Stats';
import { BuryForm } from '@/components/BuryForm';
import { Graveyard } from '@/components/Graveyard';
import { Leaderboard } from '@/components/Leaderboard';

type Tab = 'bury' | 'graveyard' | 'my' | 'leaderboard';

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
    { id: 'leaderboard', label: '🏆 Leaderboard' },
  ];

  return (
    <>
      <Navbar />
      <Hero onBury={() => scrollToApp('bury')} onView={() => scrollToApp('graveyard')} />
      <main className="max-w-[1200px] mx-auto px-6 pb-20" ref={appRef}>
        <Stats />
        <div className="flex overflow-x-auto no-scrollbar bg-surface border border-border rounded-full p-1 mb-8 w-fit mx-auto sm:mx-0">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`relative px-5 sm:px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shrink-0 ${tab === t.id ? 'text-t1' : 'text-t3 hover:text-t2'}`}>
              {tab === t.id && <motion.div layoutId="activeTab" className="absolute inset-0 bg-surface2 rounded-full shadow-lg" transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }} />}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'bury' && (<motion.div key="bury" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }}><BuryForm onSuccess={() => setRefreshKey(k => k + 1)} /></motion.div>)}
          {tab === 'graveyard' && (<motion.div key="graveyard" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }}><Graveyard mode="all" refreshKey={refreshKey} /></motion.div>)}
          {tab === 'my' && (<motion.div key="my" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }}><Graveyard mode="mine" refreshKey={refreshKey} /></motion.div>)}
          {tab === 'leaderboard' && (<motion.div key="leaderboard" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }}><Leaderboard /></motion.div>)}
        </AnimatePresence>
      </main>
    </>
  );
}