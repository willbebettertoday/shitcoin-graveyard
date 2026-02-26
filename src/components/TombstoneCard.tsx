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
  // Split epitaph into max 2 lines of ~28 chars
  const words = epitaph.slice(0, 60).split(' ');
  let line1 = '';
  let line2 = '';
  for (const w of words) {
    if (line1.length + w.length + 1 <= 28) {
      line1 += (line1 ? ' ' : '') + w;
    } else {
      line2 += (line2 ? ' ' : '') + w;
    }
  }
  if (epitaph.length > 60 && line2) line2 = line2.slice(0, 25) + '...';

  return (
    <svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id={`stone${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: `hsl(${hue},10%,28%)` }} />
          <stop offset="100%" style={{ stopColor: `hsl(${hue},8%,13%)` }} />
        </linearGradient>
        <filter id={`glow${id}`}>
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`ripglow${id}`}>
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id={`flame${id}`} cx="50%" cy="70%" r="50%">
          <stop offset="0%" stopColor="#ffcc44" />
          <stop offset="60%" stopColor="#ff8800" />
          <stop offset="100%" stopColor="#ff440088" />
        </radialGradient>
        <radialGradient id={`flame2${id}`} cx="50%" cy="70%" r="50%">
          <stop offset="0%" stopColor="#ffdd66" />
          <stop offset="60%" stopColor="#ffaa22" />
          <stop offset="100%" stopColor="#ff550088" />
        </radialGradient>
        <linearGradient id={`fog${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="520" fill="#080808" />

      {/* Stars */}
      <circle cx="45" cy="35" r="1.2" fill="#fff" opacity="0.3">
        <animate attributeName="opacity" values="0.1;0.6;0.1" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="120" cy="18" r="0.8" fill="#fff" opacity="0.5">
        <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="42" r="1" fill="#fff" opacity="0.2">
        <animate attributeName="opacity" values="0.1;0.5;0.1" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="290" cy="25" r="1.3" fill="#fff" opacity="0.4">
        <animate attributeName="opacity" values="0.15;0.7;0.15" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="350" cy="55" r="0.9" fill="#fff" opacity="0.3">
        <animate attributeName="opacity" values="0.1;0.6;0.1" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="75" cy="68" r="0.7" fill="#fff" opacity="0.2">
        <animate attributeName="opacity" values="0.05;0.4;0.05" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* Moon glow */}
      <circle cx="320" cy="60" r="40" fill="#c9a87c" opacity="0.03" />
      <circle cx="320" cy="60" r="20" fill="#c9a87c" opacity="0.05" />
      <circle cx="320" cy="60" r="12" fill="#ddc89a" opacity="0.08" />

      {/* Ground */}
      <rect x="0" y="400" width="400" height="120" fill="#111" />
      <ellipse cx="200" cy="405" rx="180" ry="15" fill="#1a1815" />

      {/* Ground fog */}
      <rect x="0" y="370" width="400" height="50" fill={`url(#fog${id})`}>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="6s" repeatCount="indefinite" />
      </rect>

      {/* Tombstone shadow */}
      <ellipse cx="200" cy="402" rx="90" ry="8" fill="#000" opacity="0.4" />

      {/* Tombstone body */}
      <path d="M130 400 L130 170 Q130 95 200 95 Q270 95 270 170 L270 400 Z"
        fill={`url(#stone${id})`} stroke="#444" strokeWidth="1" />
      <path d="M135 395 L135 173 Q135 102 200 102 Q265 102 265 173 L265 395"
        fill="none" stroke="#555" strokeWidth="0.5" opacity="0.3" />

      {/* Cross */}
      <line x1="200" y1="115" x2="200" y2="180" stroke="#666" strokeWidth="1.5" opacity="0.6" />
      <line x1="180" y1="140" x2="220" y2="140" stroke="#666" strokeWidth="1.5" opacity="0.6" />

      {/* R.I.P. with glow */}
      <text x="200" y="225" textAnchor="middle" fill="#c9a87c" fontFamily="serif"
        fontSize="30" fontWeight="bold" letterSpacing="6" filter={`url(#ripglow${id})`}>
        R.I.P.
        <animate attributeName="opacity" values="0.7;1;0.7" dur="4s" repeatCount="indefinite" />
      </text>

      {/* Token symbol */}
      <text x="200" y="268" textAnchor="middle" fill="#ddd" fontFamily="monospace"
        fontSize="24" fontWeight="bold">${symbol}</text>

      {/* Decorative line */}
      <line x1="160" y1="282" x2="240" y2="282" stroke="#444" strokeWidth="0.5" />

      {/* Epitaph */}
      <text x="200" y="302" textAnchor="middle" fill="#777" fontFamily="serif"
        fontSize="10" fontStyle="italic">
        <tspan x="200" dy="0">{line1}</tspan>
        {line2 && <tspan x="200" dy="14">{line2}</tspan>}
      </text>

      {/* Grave number */}
      <text x="200" y="355" textAnchor="middle" fill="#333" fontFamily="monospace"
        fontSize="8">GRAVE #{id}</text>

      {/* Left candle */}
      <rect x="98" y="375" width="6" height="25" rx="1" fill="#ddc89a" opacity="0.8" />
      <ellipse cx="101" cy="372" rx="5" ry="9" fill={`url(#flame${id})`} filter={`url(#glow${id})`}>
        <animate attributeName="ry" values="8;10;7;9;8" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="rx" values="4;5;4.5;3.5;4" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="cy" values="372;370;373;371;372" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="101" cy="374" rx="2" ry="4" fill="#fff8" opacity="0.6">
        <animate attributeName="ry" values="3;5;3.5;4;3" dur="1.3s" repeatCount="indefinite" />
      </ellipse>

      {/* Right candle */}
      <rect x="296" y="375" width="6" height="25" rx="1" fill="#ddc89a" opacity="0.8" />
      <ellipse cx="299" cy="372" rx="5" ry="9" fill={`url(#flame2${id})`} filter={`url(#glow${id})`}>
        <animate attributeName="ry" values="9;7;10;8;9" dur="1.7s" repeatCount="indefinite" />
        <animate attributeName="rx" values="4.5;4;5;3.5;4.5" dur="2s" repeatCount="indefinite" />
        <animate attributeName="cy" values="371;373;370;372;371" dur="1.6s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="299" cy="374" rx="2" ry="4" fill="#fff8" opacity="0.6">
        <animate attributeName="ry" values="4;3;5;3.5;4" dur="1.5s" repeatCount="indefinite" />
      </ellipse>

      {/* Floating particles */}
      <circle cx="150" cy="300" r="1.5" fill="#c9a87c" opacity="0">
        <animate attributeName="cy" values="350;100" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.4;0" dur="8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="150;140;155;145" dur="8s" repeatCount="indefinite" />
      </circle>
      <circle cx="250" cy="320" r="1" fill="#c9a87c" opacity="0">
        <animate attributeName="cy" values="380;80" dur="10s" repeatCount="indefinite" begin="2s" />
        <animate attributeName="opacity" values="0;0.3;0" dur="10s" repeatCount="indefinite" begin="2s" />
        <animate attributeName="cx" values="250;260;245;255" dur="10s" repeatCount="indefinite" begin="2s" />
      </circle>
      <circle cx="180" cy="340" r="1.2" fill="#ddc89a" opacity="0">
        <animate attributeName="cy" values="370;120" dur="9s" repeatCount="indefinite" begin="4s" />
        <animate attributeName="opacity" values="0;0.35;0" dur="9s" repeatCount="indefinite" begin="4s" />
      </circle>
      <circle cx="220" cy="310" r="0.8" fill="#fff" opacity="0">
        <animate attributeName="cy" values="360;90" dur="11s" repeatCount="indefinite" begin="1s" />
        <animate attributeName="opacity" values="0;0.2;0" dur="11s" repeatCount="indefinite" begin="1s" />
      </circle>

      {/* Candle light on ground */}
      <ellipse cx="101" cy="400" rx="25" ry="5" fill="#ffaa33" opacity="0.04">
        <animate attributeName="opacity" values="0.02;0.06;0.02" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="299" cy="400" rx="25" ry="5" fill="#ffaa33" opacity="0.04">
        <animate attributeName="opacity" values="0.03;0.06;0.03" dur="1.8s" repeatCount="indefinite" />
      </ellipse>

      {/* Bottom bar */}
      <rect x="0" y="490" width="400" height="30" fill="#0a0a0a" />
      <text x="200" y="510" textAnchor="middle" fill="#333" fontFamily="monospace" fontSize="9">
        shitcoingraveyard · Base
      </text>
    </svg>
  );
}

export function TombstoneCard({ data, index }: { data: TombstoneData; index: number }) {
  const shareText = encodeURIComponent(
    `I just buried ${Number(data.amount).toLocaleString('en-US', { maximumFractionDigits: 0 })} $${data.symbol}. Rest in piss. 🪦\n\n@base #BuildOnBase\nhttps://shitcoin-graveyard.vercel.app`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group bg-surface border border-border rounded-2xl overflow-hidden transition-shadow duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] hover:border-border/60 flex flex-col"
    >
      <div className="aspect-[4/5.2] bg-[#080808]">
        <TombstoneSVG id={data.id} symbol={data.symbol} epitaph={data.epitaph} />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="font-mono text-base font-semibold text-t1">${data.symbol}</div>
        <div className="text-sm italic text-t2 mt-2 leading-relaxed line-clamp-2 flex-1">
          &ldquo;{data.epitaph}&rdquo;
        </div>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
          <a href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noreferrer"
            className="flex-1 text-center py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-mono transition-colors text-t2 hover:text-white">
            Share to X
          </a>
          <a href={`https://warpcast.com/~/compose?text=${shareText}`} target="_blank" rel="noreferrer"
            className="flex-1 text-center py-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg text-xs font-mono transition-colors text-purple-300 hover:text-purple-200">
            Warpcast
          </a>
        </div>
      </div>
    </motion.div>
  );
}
