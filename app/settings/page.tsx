import { auth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LogoutButton from '@/components/LogoutButton'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1976D2] text-white p-4 shadow-md">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-xl md:text-2xl font-bold">Settings</h1>
          <p className="text-sm text-blue-100">Manage your account</p>
        </div>
      </div>

      <div className="container mx-auto p-4 lg:p-8 max-w-3xl space-y-6">
        {/* Profile Card */}
        <Card className="border-0 shadow">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-gray-900 font-semibold">{session.user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900 font-semibold">{session.user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">User ID</label>
              <p className="text-gray-500 text-xs font-mono">{session.user.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="border-0 shadow">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <LogoutButton />
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="border-0 shadow">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p><strong>CashOps</strong> - Personal Finance Manager</p>
            <p>Version 1.0.0</p>
            <p className="pt-4 text-xs">
              Your financial data is securely stored and only accessible to you.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
