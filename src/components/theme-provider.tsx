"use client"

import { ThemeProvider as NextThemeProvider } from "next-themes"
import type * as React from "react"

export function ThemeProvider({ children }: React.PropsWithChildren) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      {children}
    </NextThemeProvider>
  )
}
