# AIO PRODUCT — Production Deployment & Domain Setup Guide

## 1. Instant Live App URL (Active Right Now)
Your application is currently live and running at:
- **Live Preview URL**: [https://ais-pre-aszhdxvbhc3gi6eifhlaqi-658556082995.asia-southeast1.run.app](https://ais-pre-aszhdxvbhc3gi6eifhlaqi-658556082995.asia-southeast1.run.app)

---

## 2. 100% Free Live Hosting on Cloudflare Pages (Recommended for `aioproduct.pk`)
Cloudflare Pages provides unlimited free bandwidth, global CDN caching, automatic HTTPS, and direct custom domain binding for `aioproduct.pk`.

### Method A: Deploy via GitHub (Automatic Updates)
1. Push this project repository to **GitHub**.
2. Go to **[Cloudflare Dashboard](https://dash.cloudflare.com/)** -> **Workers & Pages**.
3. Click **Create Application** -> Select **Pages** -> **Connect to Git**.
4. Select your `AIO-PRODUCT` repository.
5. Configure the Build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
   - **Node.js Version**: `18` or `20`
6. Add your Environment Variables (under **Environment variables**):
   - `VITE_SUPABASE_URL`: Your Supabase Project URL (`https://your-id.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key
7. Click **Save and Deploy**. Your site will be live instantly on `<project>.pages.dev`.

### Method B: Direct Upload (No Git Required — 1 Minute)
1. In your project, run:
   ```bash
   npm run build
   ```
2. Go to **[Cloudflare Dashboard](https://dash.cloudflare.com/)** -> **Workers & Pages** -> **Create application** -> **Pages** -> **Direct Upload**.
3. Drag and drop the generated `dist` folder into Cloudflare.
4. Click **Deploy site**.

---

## 3. Connect Your Domain `aioproduct.pk`

1. In your Cloudflare Pages dashboard, open your deployed project.
2. Click on the **Custom domains** tab.
3. Click **Set up a custom domain**.
4. Enter `aioproduct.pk` (and repeat for `www.aioproduct.pk`).
5. If your domain DNS is managed on Cloudflare, it will automatically configure the records.
   If your domain is with PKNIC or a local Pakistani registrar (e.g., Nayatel, Webx, HosterPK):
   - Add a **CNAME** record:
     - **Name / Host**: `@` (or `www`)
     - **Target / Value**: `<your-project-name>.pages.dev`
     - **TTL**: Automatic
6. Cloudflare will automatically issue a free **SSL / HTTPS Certificate** for `aioproduct.pk`.

---

## 4. Alternative Free Hosting Options

### Option 2: Netlify Drop (Instant 10-Second Deploy)
1. Run `npm run build`.
2. Visit [https://app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `dist/` folder.
4. In **Domain Management**, add `aioproduct.pk`.

### Option 3: Vercel
1. Import repository on [vercel.com](https://vercel.com).
2. Framework: Vite. Build: `npm run build`. Output: `dist`.
3. In **Settings -> Domains**, add `aioproduct.pk`.
