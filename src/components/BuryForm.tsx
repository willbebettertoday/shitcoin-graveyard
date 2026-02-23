'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
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

interface TokenData {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  fiatValue: number;
}

export function BuryForm({ onSuccess }: { onSuccess?: () => void }) {
  const { address, isConnected } = useAccount();
  const [tokenAddr, setTokenAddr] = useState('');
  const [amount, setAmount] = useState('');
  const [epitaph, setEpitaph] = useState('');
  const [tokenInfo, setTokenInfo] = useState<TokenData | null>(null);
  const [tokenError, setTokenError] = useState('');
  const [step, setStep] = useState<'idle' | 'approving' | 'burying' | 'done'>('idle');

  // Scanner & Custom UI State
  const [userTokens, setUserTokens] = useState<TokenData[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [useCustomMode, setUseCustomMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: fee } = useReadContract({
    address: CONTRACT_ADDRESS, abi: GRAVEYARD_ABI, functionName: 'burialFee',
  });

  const { writeContractAsync } = useWriteContract();

  // Scan wallet using Blockscout API
  useEffect(() => {
    if (!address) {
      setUserTokens([]);
      return;
    }

    const fetchTokens = async () => {
      setIsScanning(true);
      try {
        const res = await fetch(`https://base.blockscout.com/api/v2/addresses/${address}/token-balances`);
        const data = await res.json();

        const items = Array.isArray(data) ? data : (data.items || []);

        if (items && items.length > 0) {
          const erc20 = items
            .filter((t: any) => t.value !== '0' && t.token?.type === 'ERC-20')
            .map((t: any) => ({
              address: t.token.address,
              name: t.token.name || 'Unknown Shitcoin',
              symbol: t.token.symbol || '???',
              decimals: Number(t.token.decimals || 18),
              balance: formatUnits(BigInt(t.value), Number(t.token.decimals || 18)),
              fiatValue: t.fiat_value ? parseFloat(t.fiat_value) : 0
            }));
          setUserTokens(erc20);
        }
      } catch (e) {
        console.error('Failed to scan wallet tokens:', e);
      }
      setIsScanning(false);
    };

    fetchTokens();
  }, [address]);

  // Manual lookup
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
        }).catch(() => BigInt(0));
        balance = formatUnits(bal as bigint, decimals as number);
      }

      setTokenInfo({ address: addr, name: name as string, symbol: symbol as string, decimals: decimals as number, balance, fiatValue: 0 });
    } catch {
      setTokenError('Could not read token');
    }
  }, [address]);

  const handleSelectToken = (token: TokenData) => {
    setTokenAddr(token.address);
    setTokenInfo(token);
    setAmount(token.balance); // Auto-fill max
    setTokenError('');
    setIsDropdownOpen(false);
  };

  const playChurchBell = () => {
    try {
      const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3');
      audio.volume = 0.5;
      audio.play();
    } catch (e) { }
  };

  const handleBury = async () => {
    if (!isConnected || !address || !tokenInfo || !fee) return;
    if (!tokenAddr || !amount || !epitaph) return;

    try {
      const parsedAmount = parseUnits(amount, tokenInfo.decimals);
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
        await new Promise(r => setTimeout(r, 3000));
      }

      setStep('burying');
      const buryHash = await writeContractAsync({
        address: CONTRACT_ADDRESS, abi: GRAVEYARD_ABI, functionName: 'buryToken',
        args: [tokenAddr as `0x${string}`, parsedAmount, epitaph],
        value: fee,
      });

      setStep('done');
      playChurchBell();
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
      className="bg-surface border border-border rounded-2xl p-6 sm:p-8 md:p-10 max-w-xl relative"
    >
      {/* Invisible overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      {/* Token Selection */}
      <div className="mb-6 relative">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-t2">Select Token to Bury</label>
          <button
            onClick={() => { setUseCustomMode(!useCustomMode); setIsDropdownOpen(false); }}
            className="text-xs font-mono text-accent hover:text-accent2 transition-colors"
          >
            {useCustomMode ? '← Back to Wallet scan' : 'Paste custom address'}
          </button>
        </div>

        {!isConnected ? (
          <div className="w-full px-4 py-4 bg-bg border border-border rounded-xl text-sm text-t3 text-center">
            Connect wallet to scan your tokens
          </div>
        ) : !useCustomMode ? (
          <div className="relative z-40">
            {isScanning ? (
              <div className="w-full px-4 py-4 bg-bg border border-border rounded-xl text-sm text-t3 flex items-center justify-center">
                <span className="spinner" /> Scanning for dead tokens...
              </div>
            ) : userTokens.length === 0 ? (
              <div className="w-full px-4 py-4 bg-bg border border-border rounded-xl text-sm text-t3 text-center">
                No tokens found. <button onClick={() => setUseCustomMode(true)} className="text-accent underline">Paste address</button>
              </div>
            ) : (
              <>
                {/* Premium Custom Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full px-4 py-3.5 bg-bg border rounded-xl transition-all flex justify-between items-center text-left group ${isDropdownOpen ? 'border-accent/50 shadow-[0_0_15px_rgba(201,168,124,0.1)]' : 'border-border hover:border-border/80'}`}
                >
                  {tokenInfo ? (
                    <div className="flex flex-col min-w-0 flex-1 pr-4">
                      <span className="font-mono text-sm text-t1 font-bold truncate block w-full">
                        {parseFloat(tokenInfo.balance).toLocaleString('en-US', { maximumFractionDigits: 4 })} <span className="text-accent">${tokenInfo.symbol}</span>
                      </span>
                      <span className="text-[11px] text-t3 mt-0.5 truncate block w-full">
                        {tokenInfo.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-t3 text-sm">-- Select a token from your wallet --</span>
                  )}
                  <svg
                    className={`w-4 h-4 text-t3 transition-transform duration-300 shrink-0 ${isDropdownOpen ? 'rotate-180 text-accent' : 'group-hover:text-t2'}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Premium Custom Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-0 right-0 mt-2 bg-surface2/95 backdrop-blur-xl border border-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                      <div className="max-h-[280px] overflow-y-auto p-1">
                        {userTokens.map(t => (
                          <button
                            key={t.address}
                            type="button"
                            onClick={() => handleSelectToken(t)}
                            className="w-full text-left p-3 flex justify-between items-center rounded-lg hover:bg-accent/10 transition-colors group"
                          >
                            <div className="flex flex-col min-w-0 flex-1 pr-4">
                              <span className="font-mono text-sm font-bold text-t1 group-hover:text-accent transition-colors truncate block w-full">
                                ${t.symbol}
                              </span>
                              <span className="text-[11px] text-t3 truncate mt-0.5 block w-full">
                                {t.name}
                              </span>
                            </div>
                            <div className="flex flex-col items-end shrink-0 pl-2">
                              <span className="font-mono text-sm font-medium text-t1 text-right">
                                {parseFloat(t.balance).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                              </span>
                              <span className={`text-[10px] mt-0.5 font-mono ${t.fiatValue > 0 ? 'text-green-500/70' : 'text-t3'}`}>
                                ≈ ${t.fiatValue.toFixed(2)}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        ) : (
          <input
            type="text"
            value={tokenAddr}
            onChange={e => { setTokenAddr(e.target.value); lookupToken(e.target.value); }}
            placeholder="0x..."
            className="w-full px-4 py-3.5 bg-bg border border-border rounded-xl font-mono text-sm text-t1 outline-none focus:border-accent/40 transition-colors placeholder:text-t3"
          />
        )}

        {tokenInfo && useCustomMode && (
          <p className="mt-2 text-xs font-mono text-green-500 truncate w-full">
            {tokenInfo.name} (${tokenInfo.symbol}) — Balance: {parseFloat(tokenInfo.balance).toFixed(2)}
          </p>
        )}
        {tokenError && useCustomMode && <p className="mt-2 text-xs font-mono text-red-400">{tokenError}</p>}
      </div>

      {/* Amount */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-t2 mb-2">Amount to bury (Max auto-filled)</label>
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