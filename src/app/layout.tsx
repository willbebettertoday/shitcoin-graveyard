import type { Metadata } from 'next';
import { Providers } from '@/lib/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shitcoin Graveyard — Bury Dead Tokens on Base',
  description: 'Send your worthless tokens to their eternal resting place. Get an on-chain NFT tombstone. Built on Base.',
  openGraph: {
    title: 'Shitcoin Graveyard',
    description: 'Where dead tokens find eternal rest. Built on Base.',
    type: 'website',
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://shitcoin-graveyard.vercel.app/og-image.jpg',
    'fc:frame:button:1': '🪦 Bury a Token',
    'fc:frame:post_url': 'https://shitcoin-graveyard.vercel.app',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg min-h-screen">
        <div className="noise" />
        <div className="orb w-[600px] h-[600px] bg-accent/10 -top-48 -right-48 opacity-[0.06]" />
        <div className="orb w-[500px] h-[500px] bg-purple-900/20 -bottom-48 -left-48 opacity-[0.05]" />
        <Providers>
          <div className="relative z-10">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}