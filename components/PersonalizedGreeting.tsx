'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getTimeBasedGreeting } from '@/lib/user-device'

export default function PersonalizedGreeting() {
  const { data: session } = useSession()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    setGreeting(getTimeBasedGreeting())
  }, [])

  const userName = session?.user?.name

  if (!userName) {
    return null
  }

  return (
    <div className="mb-1">
      <p className="text-sm text-blue-100">{greeting},</p>
      <h2 className="text-lg font-semibold">{userName}</h2>
    </div>
  )
}
