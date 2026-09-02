'use client';

import Script from 'next/script';
import { useConsent } from '../consent';

// Analytics IDs come from env (see .env.example). Each block only renders when
// its ID is configured — otherwise we'd fire tracking scripts with placeholder
// IDs, which spams the console (e.g. "[Meta Pixel] Invalid PixelID: null") and
// makes junk network requests on every page load.
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const APOLLO_APP_ID = '6882701177d61d001958874e';

/**
 * Every non-essential tracker on the site, gated on cookie consent.
 *
 * Nothing here renders until the visitor has clicked "Accept all" (or a stored
 * acceptance is found) and the browser is not sending Global Privacy Control.
 * The banner has promised this gate since it shipped; this is where it is
 * actually enforced. Adding a new tracker anywhere else in the tree bypasses
 * the gate — add it HERE, inside the `consent === 'accepted'` branch.
 */
export default function Analytics() {
  const consent = useConsent();
  if (consent !== 'accepted') return null;

  return (
    <>
      {/* Google Analytics */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `}
          </Script>
        </>
      )}

      {/* Microsoft Clarity */}
      {CLARITY_PROJECT_ID && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          `}
        </Script>
      )}

      {/* Facebook Pixel */}
      {FB_PIXEL_ID && (
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* Apollo website-visitor tracker — identifies companies from visits, so
          it is a "share" of personal data and sits behind the same gate. */}
      <Script id="apollo-tracker" strategy="afterInteractive">
        {`
          (function(){
            var n=Math.random().toString(36).substring(7),
              o=document.createElement("script");
            o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n;
            o.async=true;
            o.defer=true;
            o.onload=function(){
              window.trackingFunctions && window.trackingFunctions.onLoad && window.trackingFunctions.onLoad({appId:"${APOLLO_APP_ID}"})
            };
            document.head.appendChild(o);
          })();
        `}
      </Script>
    </>
  );
}
