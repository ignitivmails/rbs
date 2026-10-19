# Deploying Real Bengal Sweets

The app runs locally on SQLite with files on disk. For production you need three things:
- a **Postgres** database
- **S3-compatible storage** for uploads, such as Cloudflare R2
- a host for the Next.js app

Each one switches on through environment variables, with no code changes.

> **Status:** **Vercel + Neon + Vercel Blob** is the chosen setup. The initial Postgres migration (237 tables) is generated and committed. These paths have **not yet run against a live database or bucket**; the first Vercel deploy is that test.

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

## 4A. Vercel + Neon + Vercel Blob (chosen)

The repo is ready for this setup:
- The app reads Neon's `DATABASE_URL` / `POSTGRES_URL` automatically.
- Images go to **Vercel Blob** when `BLOB_READ_WRITE_TOKEN` is set.
- Vercel runs `npm run vercel-build`, which applies **database migrations, then builds**.
- The initial migration is committed in `src/migrations/`.

1. **Import the project:** go to vercel.com, sign in with GitHub, then *Add New → Project*, pick `ignitivmails/rbs` and click *Deploy*. The first deploy may fail; that's fine.
2. **Create the database:** in the project, open **Storage → Create Database → Neon (Serverless Postgres)**:
   - Pick the region closest to India (Mumbai if offered, otherwise Singapore).
   - Connect it to **all environments**. This adds `DATABASE_URL` and the other database variables automatically.
3. **Create image storage:** **Storage → Create → Blob**, then connect it to all environments. This adds `BLOB_READ_WRITE_TOKEN`.
4. **Settings → Environment Variables:** add
   - `PAYLOAD_SECRET`: a **new** random 64-character string
   - `NEXT_PUBLIC_SERVER_URL`: `https://<project>.vercel.app` (your domain later)
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`; also add `https://<project>.vercel.app/api/auth/google/callback` in Google Cloud
   - optional: `RESEND_API_KEY`, `MSG91_*`, `SHIPROCKET_*`
5. **Redeploy** (Deployments → ⋯ → Redeploy). The build runs the migrations, which create all the tables in Neon.
6. **Content:** open `/admin` and create the owner account. **Or** load the demo content from your PC once, into Neon and Blob:
   ```powershell
   npx vercel login; npx vercel link; npx vercel env pull .env.vercel   # .env.vercel is git-ignored
   # then copy DATABASE_URL, BLOB_READ_WRITE_TOKEN and PAYLOAD_SECRET from it:
   $env:DATABASE_URI="<DATABASE_URL>"; $env:BLOB_READ_WRITE_TOKEN="<token>"; $env:PAYLOAD_SECRET="<same as Vercel>"; $env:NEXT_PUBLIC_SERVER_URL="https://<project>.vercel.app"
   npm run seed
   ```
7. **Region:** set **Settings → Functions → Region** to match the Neon region (e.g. `bom1` Mumbai or `sin1` Singapore) for fast database access.
8. **Plan:** Vercel **Hobby is for non-commercial use**. Upgrade to **Pro** before taking real orders.

**After schema changes** (new fields or collections): run `npm run migrate:create -- <name>` locally (no database connection is needed), commit `src/migrations/`, and push. Vercel applies it on deploy.

**Rule for migrations:** generate them **locally** (no database or tokens needed):
```powershell
$env:DATABASE_URI='postgres://x:y@127.0.0.1:5999/x'; npm run migrate:create -- <name>; Remove-Item Env:DATABASE_URI
```
The Blob plugin always registers its media fields (`alwaysInsertFields`), so the schema is the same with or without a Blob token.

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
