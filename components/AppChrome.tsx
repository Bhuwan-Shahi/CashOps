'use client'

import AuthProvider from '@/components/AuthProvider'
import DesktopNav from '@/components/DesktopNav'
import WelcomeDialog from '@/components/WelcomeDialog'

export default function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WelcomeDialog />
      <DesktopNav />
      <div className="md:pl-64">{children}</div>
    </AuthProvider>
  )
}
