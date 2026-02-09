'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      variant="outline"
      className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {loading ? 'Signing out...' : 'Sign Out'}
    </Button>
  )
}
