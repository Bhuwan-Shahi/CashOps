'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

const AUTH_ROUTES = ['/login', '/register']
const AppChrome = dynamic(() => import('./AppChrome'))

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = AUTH_ROUTES.includes(pathname)

  if (isAuthPage) {
    return <>{children}</>
  }

  return <AppChrome>{children}</AppChrome>
}
