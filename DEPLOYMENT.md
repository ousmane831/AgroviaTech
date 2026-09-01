# Deployment Guide - AgroviaTech

## Overview
This guide covers deploying AgroviaTech to production using Vercel or Netlify.

## Prerequisites
- Node.js 18+ installed
- Git repository initialized
- Vercel or Netlify account

## Local Build Test

Before deploying, test the production build locally:

```bash
# Install dependencies
npm install

# Run type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## Vercel Deployment

### Option 1: Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Deploy to production:
```bash
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will automatically detect Vite configuration
5. Click "Deploy"

### Environment Variables (if needed)

Add these in Vercel Project Settings:
- `VITE_APP_TITLE=AgroviaTech`
- `VITE_APP_URL=https://your-domain.vercel.app`

## Netlify Deployment

### Option 1: Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login:
```bash
netlify login
```

3. Initialize:
```bash
netlify init
```

4. Deploy:
```bash
netlify deploy --prod
```

### Option 2: Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click "Deploy site"

### Netlify Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

## Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS records

## Performance Optimization

The project is already optimized with:
- Code splitting via Vite
- Tree shaking
- Asset optimization
- Gzip compression (handled by hosting platform)

## Monitoring

### Vercel Analytics
- Automatically enabled for Vercel deployments
- Monitor performance, errors, and user behavior

### Netlify Analytics
- Enable in Netlify Dashboard
- Track site performance and user interactions

## Troubleshooting

### Build Failures
- Check Node.js version (requires 18+)
- Clear cache: `rm -rf node_modules && npm install`
- Verify environment variables

### Runtime Errors
- Check browser console for errors
- Verify API endpoints are accessible
- Check environment variables are properly set

### Performance Issues
- Enable caching headers
- Optimize images
- Consider CDN for static assets

## Post-Deployment Checklist

- [ ] Test all user flows
- [ ] Verify responsive design on mobile
- [ ] Check authentication flows
- [ ] Test API connections
- [ ] Verify analytics tracking
- [ ] Check error monitoring
- [ ] Test custom domain (if configured)
- [ ] Verify SSL certificate

## Support

For deployment issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Vite: [vitejs.dev](https://vitejs.dev)

## Continuous Deployment

Both platforms support automatic deployments on git push:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployments
