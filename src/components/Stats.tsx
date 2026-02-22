'use client';

import { motion } from 'framer-motion';
import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESS, GRAVEYARD_ABI } from '@/lib/config';

export function Stats() {
  const { data: burials } = useReadContract({
    address: CONTRACT_ADDRESS, abi: GRAVEYARD_ABI, functionName: 'totalBurials',
  });
  const { data: nextId } = useReadContract({
    address: CONTRACT_ADDRESS, abi: GRAVEYARD_ABI, functionName: 'nextTokenId',
  });
  const { data: fee } = useReadContract({
    address: CONTRACT_ADDRESS, abi: GRAVEYARD_ABI, functionName: 'burialFee',
  });

  const stats = [
    { label: 'Burials', value: burials?.toString() || '0' },
    { label: 'NFT Graves', value: nextId?.toString() || '0' },
    { label: 'Fee (ETH)', value: fee ? formatEther(fee) : '0' },
    { label: 'Network', value: 'Base' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden mb-16"
    >
      {stats.map((s, i) => (
        <div key={i} className="bg-surface p-6 md:p-8 text-center">
          <span className="block font-display text-3xl md:text-4xl font-bold text-t1">
            {s.value}
          </span>
          <span className="font-mono text-[11px] text-t3 uppercase tracking-[2px] mt-1">
            {s.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
