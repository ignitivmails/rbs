# Deploying Real Bengal Sweets

The app runs locally on SQLite with files on disk. For production you need three things:
- a **Postgres** database
- **S3-compatible storage** for uploads, such as Cloudflare R2
- a host for the Next.js app

Each one switches on through environment variables, with no code changes.

> **Status:** the Postgres and S3/R2 paths are wired up and type-checked but **not yet run against a real database or bucket**. Docker and Postgres weren't available on the development machine. Do a staging deploy first.

---

## 1. Choose hosting

| | **A. Vercel + Neon + Cloudflare R2** (recommended to start) | **B. A VPS (DigitalOcean, Hetzner, AWS Lightsail) with Docker** |
|---|---|---|
| Setup effort | Lowest: connect a Git repo, add env vars | Medium: a server, Docker, Postgres, a reverse proxy with HTTPS |
| Cost at small scale | Free tiers, then roughly ₹1,500–3,000/month | About ₹500–1,500/month for one small VPS |
| Scaling / maintenance | Automatic, nothing to patch | You patch, back up and monitor |
| Fits this app | Yes (Payload 3 runs on Vercel) | Yes (the `Dockerfile` is included) |

Prices are rough; check current plans.

## 2. Production environment variables

| Variable | Example | Notes |
|---|---|---|
| `DATABASE_URI` | `postgres://user:pass@host/db?sslmode=require` | A `postgres://` URL switches the app to the Postgres adapter |
| `PAYLOAD_SECRET` | 64 random characters | **New** value; don't reuse the local one |
| `NEXT_PUBLIC_SERVER_URL` | `https://realbengalsweets.in` | Used for links, live preview, OAuth and webhooks |
| `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | R2: endpoint `https://<account>.r2.cloudflarestorage.com`, region `auto` | Media uploads go to the bucket |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | `rzp_live_…` | **Live** keys and a live-mode webhook to `/api/razorpay/webhook` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | | Add `https://<domain>/api/auth/google/callback` as a redirect URI |
| `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME` | | Verify your sending domain in Resend |
| `MSG91_*` (or Firebase / WhatsApp once built) | | SMS / OTP / order updates |
| `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD`, `SHIPROCKET_PICKUP` | | API user and pickup location name |

## 3. Database migrations (Postgres)

Locally, SQLite syncs its schema automatically ("push"). In production, schema changes are applied with **migrations**:

```bash
# Once, against an empty Postgres (e.g. a Neon branch or local Docker Postgres):
DATABASE_URI=postgres://… npm run migrate:create -- initial   # writes src/migrations/*
git add src/migrations && git commit -m "Initial migration"

# On every deploy, before starting the new version:
DATABASE_URI=postgres://… npm run migrate
```

After any change to collections or globals, run `npm run migrate:create -- <name>` against a dev Postgres and commit the generated file.

**Content:** the demo seed is for local use. On production, either enter real content in the admin, or point `npm run seed` at the production database **once** for demo data, then edit it.

## 4A. Vercel + Neon + R2

1. Push the project to GitHub (private repo).
2. **Neon:** create a project and copy the pooled connection string into `DATABASE_URI`.
3. **Cloudflare R2:** create a bucket and an API token (Object Read & Write), and set the `S3_*` variables.
4. **Vercel:** *New Project*, import the repo, add all env vars. The build command stays `npm run build`.
5. Run migrations against Neon (section 3) before the first visit, then open `/admin` to create the owner account.
6. Add your domain in Vercel and update `NEXT_PUBLIC_SERVER_URL`, the Razorpay webhook and the Google redirect URI.

## 4B. VPS with Docker

```bash
docker build -t real-bengal-sweets --build-arg NEXT_PUBLIC_SERVER_URL=https://realbengalsweets.in .
docker run -d --name rbs -p 3000:3000 --env-file .env.production --restart unless-stopped real-bengal-sweets
```

Put Caddy or Nginx in front for HTTPS. Run Postgres as a managed service or a second container with daily backups. Run `npm run migrate` (from a checkout with `DATABASE_URI` set) before starting each new version.

## 5. Go-live checklist

- [ ] New `PAYLOAD_SECRET`; strong admin password; remove the demo admin user
- [ ] Replace placeholder content: phone, address, FSSAI number, store addresses, press names, stats, policy pages
- [ ] Razorpay **live** keys and live webhook; place one real ₹1 test order and refund it
- [ ] Resend domain verified; send a test order email
- [ ] SMS/WhatsApp provider approved templates (DLT for SMS)
- [ ] Shiprocket pickup location and one test shipment
- [ ] Google OAuth redirect URI for the live domain; OAuth consent screen published
- [ ] GA4 / Meta Pixel IDs in **Site settings → Integrations**
- [ ] Submit `https://<domain>/sitemap.xml` in Google Search Console
- [ ] Daily database backups enabled
