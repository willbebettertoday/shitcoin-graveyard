'use client';

import { motion } from 'framer-motion';

export function Hero({ onBury, onView }: { onBury: () => void; onView: () => void }) {
  return (
    <section className="min-h-[85vh] flex flex-col justify-center items-center text-center px-6 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border font-mono text-xs text-t2 mb-8"
      >
        <span className="text-green-500">&#9679;</span>
        Live on Base Mainnet
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight max-w-4xl mb-6"
      >
        Where dead tokens
        <br />
        find <em className="text-accent italic">eternal rest</em>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-lg text-t2 max-w-lg leading-relaxed mb-12"
      >
        Bury your worthless tokens. Get an on-chain NFT tombstone.
        The only honest exit strategy in crypto.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="flex gap-4 flex-wrap justify-center"
      >
        <button
          onClick={onBury}
          className="px-8 py-4 rounded-full bg-accent text-bg font-bold text-[15px] hover:bg-accent2 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,168,124,0.25)] active:translate-y-0"
        >
          Bury a Token
        </button>
        <button
          onClick={onView}
          className="px-8 py-4 rounded-full border border-border text-t2 font-medium text-[15px] hover:border-t3 hover:text-t1 transition-all"
        >
          View Graveyard
        </button>
      </motion.div>
    </section>
  );
}
