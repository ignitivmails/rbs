import Script from 'next/script'

import { getSite } from '@/lib/data'

const SAFE_ID = /^[A-Za-z0-9-]+$/

/** GA4 + Meta Pixel, loaded only when their IDs are set in Site settings → Integrations. */
export async function Analytics() {
  const { settings } = await getSite()
  const ga = settings.ga4Id && SAFE_ID.test(settings.ga4Id) ? settings.ga4Id : null
  const pixel = settings.metaPixelId && SAFE_ID.test(settings.metaPixelId) ? settings.metaPixelId : null
  if (!ga && !pixel) return null
  return (
    <>
      {ga && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      )}
      {pixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  )
}
