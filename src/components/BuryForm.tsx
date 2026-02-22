'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits, isAddress } from 'viem';
import { readContract } from '@wagmi/core';
import { CONTRACT_ADDRESS, GRAVEYARD_ABI, ERC20_ABI, config } from '@/lib/config';

const EPITAPHS = [
  "Here lies another dream of financial freedom. -99.98%.",
  "Bought the dip. Then the dip dipped again.",
  "The whitepaper promised revolution. The chart disagreed.",
  "HODL they said. It'll come back they said. It did not.",
  "Rug pulled so hard it left burns on my portfolio.",
  "Not even the devs believed in this one.",
  "From 'to the moon' to 'to the tomb'.",
  "The only thing this token 100x'd was my regret.",
  "Neither safe, nor moon. Just pain and lessons.",
  "Bought because of a tweet. Buried because of reality.",
  "This token had a great community. Now a great tombstone.",
  "I was told this was the next Bitcoin. It wasn't even the next BitConnect.",
];

export function BuryForm({ onSuccess }: { onSuccess?: () => void }) {
  const { address, isConnected } = useAccount();
  const [tokenAddr, setTokenAddr] = useState('');
  const [amount, setAmount] = useState('');
  const [epitaph, setEpitaph] = useState('');
  const [tokenInfo, setTokenInfo] = useState<{ name: string; symbol: string; decimals: number; balance: string } | null>(null);
  const [tokenError, setTokenError] = useState('');
  const [step, setStep] = useState<'idle' | 'approving' | 'burying' | 'done'>('idle');

  const { data: fee } = useReadContract({
    address: CONTRACT_ADDRESS, abi: GRAVEYARD_ABI, functionName: 'burialFee',
  });

  const { writeContractAsync } = useWriteContract();

  const lookupToken = useCallback(async (addr: string) => {
    setTokenInfo(null);
    setTokenError('');
    if (!addr || addr.length !== 42 || !isAddress(addr)) return;

    try {
      const [name, symbol, decimals] = await Promise.all([
        readContract(config, { address: addr as `0x${string}`, abi: ERC20_ABI, functionName: 'name' }).catch(() => 'Unknown'),
        readContract(config, { address: addr as `0x${string}`, abi: ERC20_ABI, functionName: 'symbol' }).catch(() => '???'),
        readContract(config, { address: addr as `0x${string}`, abi: ERC20_ABI, functionName: 'decimals' }).catch(() => 18),
      ]);

      let balance = '0';
      if (address) {
        const bal = await readContract(config, {
          address: addr as `0x${string}`, abi: ERC20_ABI, functionName: 'balanceOf', args: [address],
        }).catch(() => 0n);
        balance = formatUnits(bal as bigint, decimals as number);
      }

      setTokenInfo({ name: name as string, symbol: symbol as string, decimals: decimals as number, balance });
    } catch {
      setTokenError('Could not read token');
    }
  }, [address]);

  const handleBury = async () => {
    if (!isConnected || !address || !tokenInfo || !fee) return;
    if (!tokenAddr || !amount || !epitaph) return;

    try {
      const parsedAmount = parseUnits(amount, tokenInfo.decimals);

      // Step 1: Approve
      setStep('approving');
      const allowance = await readContract(config, {
        address: tokenAddr as `0x${string}`, abi: ERC20_ABI, functionName: 'allowance',
        args: [address, CONTRACT_ADDRESS],
      });

      if ((allowance as bigint) < parsedAmount) {
        const approveHash = await writeContractAsync({
          address: tokenAddr as `0x${string}`, abi: ERC20_ABI, functionName: 'approve',
          args: [CONTRACT_ADDRESS, parsedAmount],
        });
        // Wait a bit for approval
        await new Promise(r => setTimeout(r, 3000));
      }

      // Step 2: Bury
      setStep('burying');
      const buryHash = await writeContractAsync({
        address: CONTRACT_ADDRESS, abi: GRAVEYARD_ABI, functionName: 'buryToken',
        args: [tokenAddr as `0x${string}`, parsedAmount, epitaph],
        value: fee,
      });

      setStep('done');
      setTokenAddr(''); setAmount(''); setEpitaph(''); setTokenInfo(null);
      onSuccess?.();

      setTimeout(() => setStep('idle'), 3000);
    } catch (e: any) {
      setStep('idle');
      if (e?.message?.includes('User rejected')) return;
      console.error(e);
    }
  };

  const generateEpitaph = () => {
    setEpitaph(EPITAPHS[Math.floor(Math.random() * EPITAPHS.length)]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-surface border border-border rounded-2xl p-6 sm:p-8 md:p-10 max-w-xl"
    >
      {/* Token Address */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-t2 mb-2">Token contract address</label>
        <input
          type="text"
          value={tokenAddr}
          onChange={e => { setTokenAddr(e.target.value); lookupToken(e.target.value); }}
          placeholder="0x..."
          className="w-full px-4 py-3.5 bg-bg border border-border rounded-xl font-mono text-sm text-t1 outline-none focus:border-accent/40 transition-colors placeholder:text-t3"
        />
        {tokenInfo && (
          <p className="mt-2 text-xs font-mono text-green-500">
            {tokenInfo.name} (${tokenInfo.symbol}) — Balance: {parseFloat(tokenInfo.balance).toFixed(2)}
          </p>
        )}
        {tokenError && <p className="mt-2 text-xs font-mono text-red-400">{tokenError}</p>}
      </div>

      {/* Amount */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-t2 mb-2">Amount to bury</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="1000000"
          min="1"
          className="w-full px-4 py-3.5 bg-bg border border-border rounded-xl font-mono text-sm text-t1 outline-none focus:border-accent/40 transition-colors placeholder:text-t3"
        />
      </div>

      {/* Epitaph */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-t2 mb-2">Epitaph</label>
        <textarea
          value={epitaph}
          onChange={e => setEpitaph(e.target.value)}
          placeholder="Rest in peace, you magnificent disaster..."
          maxLength={140}
          rows={3}
          className="w-full px-4 py-3.5 bg-bg border border-border rounded-xl text-sm text-t1 outline-none focus:border-accent/40 transition-colors placeholder:text-t3 resize-none italic leading-relaxed"
        />
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={generateEpitaph}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs hover:bg-purple-500/20 transition-all"
          >
            &#10024; Generate epitaph
          </button>
          <span className={`text-xs font-mono ${epitaph.length > 140 ? 'text-red-400' : 'text-t3'}`}>
            {epitaph.length}/140
          </span>
        </div>
      </div>

      {/* Fee */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-accent/5 border border-accent/10 mb-6">
        <span className="text-sm text-t3">Burial fee</span>
        <span className="font-mono text-sm font-semibold text-accent">
          {fee ? formatUnits(fee, 18) : '0'} ETH
        </span>
      </div>

      {/* Button */}
      <button
        onClick={handleBury}
        disabled={!isConnected || step !== 'idle' || !tokenAddr || !amount || !epitaph}
        className="w-full py-4 rounded-xl bg-red-800/80 text-t1 font-bold text-[15px] hover:bg-red-700/80 transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(160,64,64,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {step === 'approving' && <><span className="spinner" /> Approving...</>}
        {step === 'burying' && <><span className="spinner" /> Burying token...</>}
        {step === 'done' && '&#9760; Token buried! NFT minted!'}
        {step === 'idle' && (isConnected ? 'Bury this token forever' : 'Connect wallet to bury')}
      </button>
    </motion.div>
  );
}
