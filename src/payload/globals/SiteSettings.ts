import type { GlobalConfig } from 'payload'

import { anyone, ownersOnly } from '../access'
import { options } from '../fields'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: ownersOnly },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'siteName', type: 'text', required: true, defaultValue: 'Real Bengal Sweets', admin: { width: '50%' } },
                { name: 'tagline', type: 'text', localized: true, admin: { width: '50%' } },
              ],
            },
            { name: 'favicon', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'titleTemplate',
              type: 'text',
              defaultValue: '%s | Real Bengal Sweets',
              admin: { description: '%s is replaced with the page title' },
            },
            { name: 'metaDescription', label: 'Default description', type: 'textarea', localized: true },
            { name: 'ogImage', label: 'Default share image', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', admin: { width: '33%' } },
                { name: 'whatsapp', label: 'WhatsApp number', type: 'text', admin: { width: '33%', description: 'With country code, e.g. 919876543210' } },
                { name: 'email', type: 'email', admin: { width: '33%' } },
              ],
            },
            { name: 'address', type: 'textarea', localized: true },
            {
              name: 'socials',
              label: 'Social links',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      options: options(['instagram', 'Instagram'], ['facebook', 'Facebook'], ['x', 'X / Twitter'], ['youtube', 'YouTube'], ['linkedin', 'LinkedIn']),
                      admin: { width: '40%' },
                    },
                    { name: 'url', type: 'text', required: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'whatsappFloat', label: 'Floating WhatsApp button', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
                { name: 'whatsappMessage', label: 'Pre-filled message', type: 'text', defaultValue: 'Hi! I have a question about an order.', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Commerce',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'currency', type: 'select', defaultValue: 'INR', options: options(['INR', '₹ Indian Rupee']), admin: { width: '33%' } },
                { name: 'pricesIncludeTax', label: 'Prices include GST', type: 'checkbox', defaultValue: true, admin: { width: '33%' } },
                { name: 'minOrderValue', label: 'Minimum order ₹', type: 'number', defaultValue: 0, admin: { width: '33%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'razorpayEnabled', label: 'Online payment (Razorpay)', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
                { name: 'codEnabled', label: 'Cash on Delivery', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
              ],
            },
            {
              name: 'upiFirst',
              label: 'Show UPI first in the payment window',
              type: 'checkbox',
              defaultValue: true,
              admin: { description: 'Adds a “Pay using UPI” section at the top of Razorpay checkout. UPI must also be enabled in your Razorpay dashboard.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'codRequiresOtp',
                  label: 'Verify phone by OTP for COD',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '50%' },
                },
                { name: 'giftOptions', label: 'Offer gift message & hidden prices', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'orderPrefix', label: 'Order number prefix', type: 'text', defaultValue: 'RBS', admin: { width: '50%' } },
                {
                  name: 'paymentWindowMinutes',
                  label: 'Unpaid online orders cancel after (minutes)',
                  type: 'number',
                  defaultValue: 30,
                  min: 5,
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Shipping',
          fields: [
            {
              name: 'autoCreateShipment',
              label: 'Create a Shiprocket shipment when a pan-India order is marked “Packed”',
              type: 'checkbox',
              defaultValue: true,
              admin: { description: 'Needs SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD in .env — otherwise a test AWB is generated locally.' },
            },
            {
              type: 'row',
              fields: [
                { name: 'packageLength', label: 'Box length (cm)', type: 'number', defaultValue: 20, admin: { width: '25%' } },
                { name: 'packageBreadth', label: 'Box breadth (cm)', type: 'number', defaultValue: 15, admin: { width: '25%' } },
                { name: 'packageHeight', label: 'Box height (cm)', type: 'number', defaultValue: 10, admin: { width: '25%' } },
                { name: 'packagingWeight', label: 'Packaging weight (g)', type: 'number', defaultValue: 150, admin: { width: '25%' } },
              ],
            },
          ],
        },
        {
          label: 'Language',
          fields: [
            {
              name: 'enableBengali',
              label: 'Enable Bengali (বাংলা)',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Shows a language switcher. Translate content by switching the locale at the top of any edit screen; untranslated fields fall back to English.' },
            },
          ],
        },
        {
          label: 'Integrations',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'ga4Id', label: 'Google Analytics 4 ID', type: 'text', admin: { width: '50%' } },
                { name: 'metaPixelId', label: 'Meta Pixel ID', type: 'text', admin: { width: '50%' } },
              ],
            },
          ],
        },
      ],
    },
  ],
}
