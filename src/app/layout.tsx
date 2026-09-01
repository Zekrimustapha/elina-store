import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://elina-store.dz"),

  title: "ELINA COLLECTIONS | Ensemble Elegance - Collection 2026",

  description:
    "أناقة لا تُنسى لكل مناسبة. احصلي على فستان Ensemble Elegance - Collection 2026 بسعر 3,400 دج فقط مع توصيل لـ 58 ولاية والدفع عند الاستلام.",

  openGraph: {
    title: "ELINA COLLECTIONS | Ensemble Elegance - Collection 2026",

    description:
      "أناقة لا تُنسى لكل مناسبة. احصلي على فستان Ensemble Elegance حصرياً من متجرنا مع توصيل سريع لجميع الولايات والدفع عند الاستلام.",

    url: "https://elina-store.dz",

    siteName: "ELINA COLLECTIONS",

    images: [
      {
        url: "/images/hero.png",
        width: 1200,
        height: 630,
        alt: "Ensemble Elegance - Collection 2026",
      },
    ],

    locale: "ar_DZ",
    type: "website",
  },

  icons: {
    icon: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#171717",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <head>
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)
              }(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');

              fbq('init', '1784250336053443');
              fbq('track', 'PageView');
            `,
          }}
        />

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1784250336053443&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>

      <body className="antialiased min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}