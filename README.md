# 🪦 Shitcoin Graveyard

**Bury your dead tokens on Base. Get an on-chain NFT tombstone.**

Built with Next.js, Tailwind CSS, RainbowKit, Wagmi, Framer Motion.

Contract: `0x5d22ddb1206f79556b7017150c6edf15105671d9` (Base Mainnet)

---

## 🚀 Deploy to Vercel (2 minutes)

### Step 1: Get WalletConnect Project ID
1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Sign up (free) → Create New Project
3. Copy the **Project ID**

### Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Shitcoin Graveyard v1"
git remote add origin https://github.com/YOUR_USERNAME/shitcoin-graveyard.git
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"Import Project"** → Select your repo
3. Add Environment Variable:
   - Key: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - Value: your project ID from Step 1
4. Click **Deploy**

Done! Your site will be live at `https://shitcoin-graveyard.vercel.app`

---

## 💻 Local Development

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your WalletConnect Project ID
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css      # Tailwind + custom styles
│   ├── layout.tsx       # Root layout with providers
│   └── page.tsx         # Main page
├── components/
│   ├── Navbar.tsx       # Nav with RainbowKit connect
│   ├── Hero.tsx         # Hero section
│   ├── Stats.tsx        # Live contract stats
│   ├── BuryForm.tsx     # Token burial form
│   ├── TombstoneCard.tsx # NFT tombstone card
│   └── Graveyard.tsx    # Grid of tombstones
└── lib/
    ├── config.ts        # Wagmi + contract config
    └── providers.tsx    # RainbowKit provider
```

## Tech Stack
- **Next.js 14** — React framework
- **Tailwind CSS** — Styling
- **RainbowKit** — Wallet connection (MetaMask, Coinbase, WalletConnect)
- **Wagmi v2** — Ethereum hooks
- **Framer Motion** — Animations
- **Viem** — Ethereum utilities
