'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-bg/80 border-b border-white/[0.03]"
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">&#9760;</span>
          <span className="font-display font-black text-lg tracking-tight">
            Shitcoin <span className="text-accent">Graveyard</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-mono text-[11px] font-medium text-blue-400">Base</span>
          </div>
          <ConnectButton
            chainStatus="none"
            accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
            showBalance={false}
          />
        </div>
      </div>
    </motion.nav>
  );
}
