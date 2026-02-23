'use client';

import { useState, useEffect } from 'react';
import { readContract } from '@wagmi/core';
import { CONTRACT_ADDRESS, GRAVEYARD_ABI, config } from '@/lib/config';

interface Digger {
    address: string;
    count: number;
}

export function Leaderboard() {
    const [leaders, setLeaders] = useState<Digger[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaders() {
            try {
                const diggers = await readContract(config, {
                    address: CONTRACT_ADDRESS, abi: GRAVEYARD_ABI, functionName: 'getGravediggers'
                }) as string[];

                const counts = await Promise.all(diggers.map(async (d) => {
                    const tombs = await readContract(config, {
                        address: CONTRACT_ADDRESS, abi: GRAVEYARD_ABI, functionName: 'getUserTombstones', args: [d as `0x${string}`]
                    }) as any[];
                    return { address: d, count: tombs.length };
                }));

                setLeaders(counts.sort((a, b) => b.count - a.count).slice(0, 10)); // Top 10
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        }
        fetchLeaders();
    }, []);

    if (loading) return <div className="text-center py-20" > <span className="spinner" /> Loading legends...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-surface border border-border rounded-2xl overflow-hidden" >
            <div className="p-6 border-b border-border bg-surface2/50" >
                <h3 className="font-display text-2xl font-bold" > Top Gravediggers </h3>
                < p className="text-t3 text-sm" > Those who buried the most trash(10 + gets Gold NFT) </p>
            </div>
            < div className="divide-y divide-border" >
                {
                    leaders.map((l, i) => (
                        <div key={l.address} className="flex items-center justify-between p-4 px-6 hover:bg-white/[0.02] transition-colors" >
                            <div className="flex items-center gap-4" >
                                <span className={`font-mono font-bold text-lg ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-t3'}`} >
                                    #{i + 1}
                                </span>
                                < span className="font-mono text-t1" > {l.address.slice(0, 6)}...{l.address.slice(-4)} </span>
                            </div>
                            < span className="font-mono text-accent bg-accent/10 px-3 py-1 rounded-full text-sm" >
                                {l.count} buried
                            </span>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}