# Deploy SmartShopAI

This project is ready for GitHub + Vercel deployment.

## 1) Local pre-check

```bash
nvm use 20
npm install
npm run lint
npm run build
```

## 2) Push to GitHub

```bash
cd /Users/taylanmacbook/Desktop/vibeproje
git init
git add .
git commit -m "Initial SmartShopAI frontend release"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## 3) Deploy on Vercel

Option A (Dashboard):
1. Go to Vercel dashboard.
2. Import your GitHub repository.
3. Framework preset: Next.js.
4. Deploy.

Option B (CLI):

```bash
npm i -g vercel
vercel
vercel --prod
```

## 4) Vercel build settings

- Build command: `npm run build`
- Install command: `npm install`
- Output: `.next` (Next.js default)
- Node version: `20.x`

## 5) After deploy checks

- Home page loads without hydration errors
- `/login`, `/profile/settings`, `/deals/new`, `/watchlist`, `/local`, `/ai-lab` work
- Campaign link from home ad opens `/campaigns/flash-weekend`
- Theme presets (Default/Ocean/Emerald) and TR/EN switch persist after refresh
