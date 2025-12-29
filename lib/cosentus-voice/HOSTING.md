# Hosting the Cosentus Voice Library

## Option 1: Vercel (Recommended - Free)

1. Create `public/voice/` folder in your Next.js project
2. Copy `cosentus-voice.js` to `public/voice/cosentus-voice.js`
3. Deploy to Vercel
4. Library will be available at: `https://yourdomain.com/voice/cosentus-voice.js`

## Option 2: Cloudflare Pages (Free)

1. Create a new GitHub repo with just the library file
2. Connect to Cloudflare Pages
3. Deploy
4. Get URL: `https://your-project.pages.dev/cosentus-voice.js`

## Option 3: AWS S3 + CloudFront

1. Upload to S3 bucket
2. Enable static website hosting
3. Add CloudFront distribution
4. Set CORS headers

## Option 4: jsDelivr (Free CDN for GitHub)

1. Push library to public GitHub repo
2. Access via: `https://cdn.jsdelivr.net/gh/username/repo@version/cosentus-voice.js`

## Recommended: Use Your Existing Next.js Deployment

Since you already have a Next.js app deployed:

1. Move `lib/cosentus-voice/cosentus-voice.js` to `public/cosentus-voice.js`
2. It will be available at: `https://yourdomain.com/cosentus-voice.js`
3. Third-party includes: `<script src="https://yourdomain.com/cosentus-voice.js"></script>`

**Done!**
