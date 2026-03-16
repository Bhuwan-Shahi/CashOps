'use client'

import { usePathname } from 'next/navigation'

const AUTH_ROUTES = ['/login', '/register']

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = AUTH_ROUTES.includes(pathname)

  if (isAuthPage) {
    return <>{children}</>
  }

  return <div className="md:pl-64">{children}</div>
}
