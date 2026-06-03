# Deployment Guide for WriteSpace

This document outlines the deployment process, required environment variables, Vercel hosting configuration, and CI/CD notes for the WriteSpace project.

---

## 1. Environment Variables

All environment variables must be prefixed with `VITE_` for Vite to expose them to the client.

**Example (`.env`):**
```
VITE_API_URL=https://api.example.com
VITE_AUTH_TOKEN=your-token-here
```

- Place your `.env` file at the project root.
- Never commit `.env` files to version control.

---

## 2. Vercel Hosting Configuration

WriteSpace is a Vite + React project and can be deployed on Vercel as a static site.

### Steps:

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com/).
   - Import your GitHub/GitLab/Bitbucket repository.

2. **Configure Build Settings**
   - **Framework Preset:** `Vite`
   - **Build Command:** `vite build`
   - **Output Directory:** `dist`
   - **Install Command:** (leave as default or set to `npm install`)

3. **Set Environment Variables**
   - In the Vercel dashboard, go to **Project Settings > Environment Variables**.
   - Add all required `VITE_` variables.

4. **Automatic Deploys**
   - Vercel will automatically deploy on every push to the main branch.

---

## 3. Local Build & Preview

To test the production build locally:

```bash
npm run build
npm run preview
```

---

## 4. CI/CD Notes

- **Vercel** handles CI/CD automatically on every push.
- **Preview Deployments:** Every pull request gets a unique preview URL.
- **Production Deployments:** Merges to the main branch trigger production deploys.

---

## 5. Troubleshooting

- **Blank Page or 404:** Ensure all `VITE_` environment variables are set in Vercel.
- **Build Fails:** Check the Vercel build logs for missing dependencies or misconfigured scripts.
- **API Errors:** Make sure your API endpoint is accessible from the deployed site.

---

## 6. Additional Notes

- No server-side code is required for deployment.
- For custom domains, configure them in the Vercel dashboard.
- If you need redirects or rewrites, add a `vercel.json` file at the project root.

---

**For questions or issues, contact the project maintainer.**