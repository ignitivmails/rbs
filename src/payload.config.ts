import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
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
const DATABASE_URI = process.env.DATABASE_URI || 'file:./real-bengal-sweets.db'

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
        migrationDir: path.resolve(dirname, 'migrations'),
      })
    : sqliteAdapter({
        client: { url: DATABASE_URI },
        migrationDir: path.resolve(dirname, 'migrations'),
      }),
  plugins: [
    // Media on S3-compatible storage (Cloudflare R2, AWS S3…) when configured; local disk otherwise.
    ...(process.env.S3_BUCKET
      ? [
          s3Storage({
            collections: { media: true },
            bucket: process.env.S3_BUCKET,
            config: {
              region: process.env.S3_REGION || 'auto',
              endpoint: process.env.S3_ENDPOINT || undefined,
              forcePathStyle: Boolean(process.env.S3_ENDPOINT),
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
              },
            },
          }),
        ]
      : []),
  ],
  sharp,
})
