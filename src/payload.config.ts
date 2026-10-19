import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Categories } from './payload/collections/Categories'
import { Coupons } from './payload/collections/Coupons'
import { Customers } from './payload/collections/Customers'
import { GiftBoxes } from './payload/collections/GiftBoxes'
import { Posts } from './payload/collections/Posts'
import { QuantityDiscounts } from './payload/collections/QuantityDiscounts'
import { Stores } from './payload/collections/Stores'
import { resendAdapter } from '@payloadcms/email-resend'
import { Orders } from './payload/collections/Orders'
import { OtpCodes } from './payload/collections/OtpCodes'
import { Notifications } from './payload/globals/Notifications'
import { DeliveryZones } from './payload/collections/DeliveryZones'
import { Enquiries, Subscribers } from './payload/collections/Leads'
import { Media } from './payload/collections/Media'
import { Pages } from './payload/collections/Pages'
import { Products } from './payload/collections/Products'
import { Reviews } from './payload/collections/Reviews'
import { Users } from './payload/collections/Users'
import { AnnouncementBar } from './payload/globals/AnnouncementBar'
import { Footer } from './payload/globals/Footer'
import { Header } from './payload/globals/Header'
import { SiteSettings } from './payload/globals/SiteSettings'
import { Theme } from './payload/globals/Theme'
import { UiStringGlobals } from './payload/globals/UiStrings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
/**
 * DATABASE_URI (ours), or the Postgres URL Vercel's Neon integration sets — `DATABASE_URL` /
 * `POSTGRES_URL`, possibly with a custom prefix such as `STORAGE_DATABASE_URL`.
 * Pooled URLs are preferred (`*_UNPOOLED` / `*_NON_POOLING` are skipped).
 */
function resolveDatabaseUri(): string {
  const env = process.env
  // A local SQLite path copied into Vercel's settings must not shadow the Neon URL.
  if (env.DATABASE_URI && !(env.VERCEL && env.DATABASE_URI.startsWith('file:'))) return env.DATABASE_URI
  const exact = env.DATABASE_URL || env.POSTGRES_URL
  if (exact) return exact
  const prefixed = Object.keys(env)
    .filter((k) => /(^|_)(DATABASE_URL|POSTGRES_URL)$/.test(k) && env[k]?.startsWith('postgres'))
    .sort()[0]
  if (prefixed) return env[prefixed] as string
  if (env.VERCEL) {
    throw new Error(
      'No Postgres database configured for this Vercel deployment. In Vercel: Storage → connect the Neon database to ALL environments (incl. Production), then redeploy.',
    )
  }
  return 'file:./real-bengal-sweets.db'
}
const DATABASE_URI = resolveDatabaseUri()

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Real Bengal Sweets' },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Orders, Customers, Coupons, QuantityDiscounts, GiftBoxes, Posts, Stores, Pages, Products, Categories, Reviews, DeliveryZones, Media, Enquiries, Subscribers, Users, OtpCodes],
  globals: [Theme, Header, AnnouncementBar, Footer, SiteSettings, ...UiStringGlobals, Notifications],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'বাংলা (Bengali)', code: 'bn' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  // Real email via Resend when RESEND_API_KEY is set; otherwise emails are printed to the console.
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'orders@realbengalsweets.in',
        defaultFromName: process.env.EMAIL_FROM_NAME || 'Real Bengal Sweets',
      })
    : undefined,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  // SQLite locally (file:…); Postgres in production (postgres://…). Production uses migrations (npm run migrate).
  db: DATABASE_URI.startsWith('postgres')
    ? postgresAdapter({
        pool: { connectionString: DATABASE_URI },
        // Postgres = production: schema changes only through committed migrations, never auto-push.
        push: false,
        migrationDir: path.resolve(dirname, 'migrations'),
      })
    : sqliteAdapter({
        client: { url: DATABASE_URI },
        migrationDir: path.resolve(dirname, 'migrations-sqlite'),
      }),
  plugins: [
    // Media on Vercel Blob when BLOB_READ_WRITE_TOKEN is set; local ./media folder otherwise.
    // alwaysInsertFields keeps the database schema identical with or without a token
    // (migrations are generated locally without one).
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      alwaysInsertFields: true,
    }),
  ],
  sharp,
})
