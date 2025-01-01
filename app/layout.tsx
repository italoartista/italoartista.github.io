import './globals.css'
import { Montserrat } from 'next/font/google'
import Script from 'next/script'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata = {
  title: 'Italo Adler - Generative Artist',
  description: 'Generative art by Italo Adler',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {children}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/TextPlugin.min.js" />
      </body>
    </html>
  )
}

