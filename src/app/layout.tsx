import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'

export const viewport: Viewport = {
  themeColor: '#090d16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Ricas Tecnologia - Dashboard',
  description: 'Painel de Monitoramento de Rede - Ricas Tecnologia',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ricas TI',
  },
  icons: {
    apple: '/api/favicon?v=3',
    icon: '/api/favicon?v=3',
    shortcut: '/api/favicon?v=3',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        {/* Favicons & App Icons */}
        <link rel="icon" href="/api/favicon?v=3" type="image/svg+xml" />
        <link rel="shortcut icon" href="/api/favicon?v=3" type="image/svg+xml" />
        {/* PWA: Apple/iOS */}
        <link rel="apple-touch-icon" href="/icon-192x192.png?v=2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ricas TI" />
        {/* PWA: Android/Chrome */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Ricas TI" />
        {/* Viewport seguro para mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="bg-zabbix-dark text-slate-200 antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

