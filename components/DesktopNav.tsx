'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, BarChart3, Settings, FolderOpen, Target } from 'lucide-react'

export default function DesktopNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/transactions', icon: BookOpen, label: 'Transactions' },
    { href: '/categories', icon: FolderOpen, label: 'Categories' },
    { href: '/wishlist', icon: Target, label: 'Wishlist' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm z-40">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#1976D2] flex items-center justify-center">
            <span className="text-white font-bold text-sm">Rs.</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CashOps</h1>
            <p className="text-xs text-gray-500">Finance Manager</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#1976D2] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
