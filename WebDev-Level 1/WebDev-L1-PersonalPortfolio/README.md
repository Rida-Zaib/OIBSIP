# Rida Zaib Portfolio

React + Vite + Tailwind + Framer Motion.

## Run locally
```bash
npm install
cp .env.example .env.local   # then paste your Web3Forms key inside
npm run dev                  # http://localhost:3000
```

## Production build
```bash
npm run build && npm run preview
```

## Deploy on Vercel
1. Push this repo to GitHub.
2. vercel.com -> Add New -> Project -> import the repo (Vite is auto-detected).
3. Settings -> Environment Variables: add `VITE_WEB3FORMS_KEY` = your key, then redeploy.

## Contact form
Uses Web3Forms (free). Messages arrive in the inbox you registered with; hit Reply to answer the visitor.
