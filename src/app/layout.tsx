import type { Metadata } from "next"
import { Geist_Mono, Noto_Sans } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { TRPCReactProvider } from "@/lib/api/client"
import { cn } from "@/lib/utils"

import "@/styles/globals.css"

const notoSans = Noto_Sans({
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  description: "The Recipe DB | by Lx2.dev",
  title: "The Recipe DB",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("antialiased", notoSans.variable, geistMono.variable)}
      >
        <TRPCReactProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
