'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { readContract } from '@wagmi/core';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESS, GRAVEYARD_ABI, config } from '@/lib/config';
import { TombstoneCard } from './TombstoneCard';

interface Tombstone {
  id: number;
  symbol: string;
  amount: string;
  date: string;
  epitaph: string;
  gravedigger: string;
}

export function Graveyard({ mode, refreshKey }: { mode: 'all' | 'mine'; refreshKey?: number }) {
  const { address } = useAccount();
  const [tombs, setTombs] = useState<Tombstone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTombs();
  }, [mode, address, refreshKey]);

  async function loadTombs() {
    setLoading(true);
    try {
      if (mode === 'mine' && address) {
        const ids = await readContract(config, {
          address: CONTRACT_ADDRESS, abi: GRAVEYARD_ABI,
          functionName: 'getUserTombstones', args: [address],
        }) as bigint[];

        const arr: Tombstone[] = [];
        for (const id of ids) {
          const t = await readContract(config, {
            address: CONTRACT_ADDRESS, abi: GRAVEYARD_ABI,
            functionName: 'getTombstone', args: [id],
          }) as any;
          arr.push(parseTomb(Number(id), t));
        }
        setTombs(arr.reverse());
      } else {
        const nextId = await readContract(config, {
          address: CONTRACT_ADDRESS, abi: GRAVEYARD_ABI,
          functionName: 'nextTokenId',
        }) as bigint;

        const total = Number(nextId);
        const arr: Tombstone[] = [];
        for (let i = total - 1; i >= Math.max(0, total - 12); i--) {
          try {
            const t = await readContract(config, {
              address: CONTRACT_ADDRESS, abi: GRAVEYARD_ABI,
              functionName: 'getTombstone', args: [BigInt(i)],
            }) as any;
            arr.push(parseTomb(i, t));
          } catch { }
        }
        setTombs(arr);
      }
    } catch (e) {
      console.log('Load error:', e);
    }
    setLoading(false);
  }

  function parseTomb(id: number, t: any): Tombstone {
    return {
      id,
      symbol: t.tokenSymbol || t[1] || '???',
      amount: (t.amount || t[2] || BigInt(0)).toString(),
      date: new Date(Number(t.burialDate || t[3] || 0) * 1000).toLocaleDateString(),
      epitaph: t.epitaph || t[4] || '',
      gravedigger: (() => {
        const g = t.gravedigger || t[5] || '';
        return g ? `${g.slice(0, 6)}...${g.slice(-4)}` : '';
      })(),
    };
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <span className="spinner" />
        <span className="text-t3 text-sm ml-2">Loading graves...</span>
      </div>
    );
  }

  if (tombs.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl opacity-20 mb-4">&#9760;</div>
        <p className="text-t3">
          {mode === 'mine' ? 'You haven\'t buried any tokens yet' : 'No tokens buried yet. Be the first!'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {tombs.map((t, i) => (
        <TombstoneCard key={t.id} data={t} index={i} />
      ))}
    </div>
  );
}
