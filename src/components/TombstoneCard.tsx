'use client';

import { motion } from 'framer-motion';

interface TombstoneData {
  id: number;
  symbol: string;
  amount: string;
  date: string;
  epitaph: string;
  gravedigger: string;
}

function TombstoneSVG({ id, symbol, epitaph }: { id: number; symbol: string; epitaph: string }) {
  const hue = (id * 137) % 360;
  return (
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="400" height="500" fill="#080808" />
      <rect x="0" y="380" width="400" height="120" fill="#111" />
      <ellipse cx="200" cy="385" rx="110" ry="12" fill="#1a1a1a" />
      <defs>
        <linearGradient id={`g${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: `hsl(${hue},12%,30%)` }} />
          <stop offset="100%" style={{ stopColor: `hsl(${hue},8%,14%)` }} />
        </linearGradient>
      </defs>
      <path d="M125 385 L125 155 Q125 85 200 85 Q275 85 275 155 L275 385 Z" fill={`url(#g${id})`} stroke="#333" strokeWidth="1.5" />
      <line x1="200" y1="105" x2="200" y2="170" stroke="#444" strokeWidth="1" />
      <line x1="178" y1="133" x2="222" y2="133" stroke="#444" strokeWidth="1" />
      <text x="200" y="212" textAnchor="middle" fill="#555" fontFamily="serif" fontSize="24" fontWeight="bold" letterSpacing="3">R.I.P.</text>
      <text x="200" y="250" textAnchor="middle" fill="#aaa" fontFamily="monospace" fontSize="20" fontWeight="bold">${symbol}</text>
      <text x="200" y="285" textAnchor="middle" fill="#444" fontFamily="sans-serif" fontSize="10" fontStyle="italic">{epitaph.slice(0, 44)}{epitaph.length > 44 ? '...' : ''}</text>
      <text x="200" y="325" textAnchor="middle" fill="#2a2a2a" fontFamily="monospace" fontSize="9">#{id}</text>
    </svg>
  );
}

export function TombstoneCard({ data, index }: { data: TombstoneData; index: number }) {
  const shareText = encodeURIComponent(`I just buried ${Number(data.amount).toLocaleString('en-US', { maximumFractionDigits: 0 })} $${data.symbol}. Rest in piss. 🪦\n\n@base #BuildOnBase\nhttps://shitcoin-graveyard.vercel.app`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group bg-surface border border-border rounded-2xl overflow-hidden transition-shadow duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] hover:border-border/60 flex flex-col"
    >
      <div className="aspect-[4/5] bg-[#080808]">
        <TombstoneSVG id={data.id} symbol={data.symbol} epitaph={data.epitaph} />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="font-mono text-base font-semibold text-t1">${data.symbol}</div>
        <div className="text-sm italic text-t2 mt-2 leading-relaxed line-clamp-2 flex-1">
          &ldquo;{data.epitaph}&rdquo;
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
          <a href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-mono transition-colors text-t2 hover:text-white">Share to X</a>
          <a href={`https://warpcast.com/~/compose?text=${shareText}`} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg text-xs font-mono transition-colors text-purple-300 hover:text-purple-200">Warpcast</a>
        </div>
      </div>
    </motion.div>
  );
}