'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2, NotebookPen, ShieldCheck, Target } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong')
        setLoading(false)
        return
      }

      // Auto login after registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Account created but login failed. Please try logging in.')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 p-4 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl items-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-2xl backdrop-blur lg:grid-cols-2">
          <div className="relative hidden overflow-hidden bg-[#1976D2] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.15),transparent_28%)]" />
            <div className="relative z-10">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl shadow-lg">
                💵
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">Create your space</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight">Start your personal finance journey with CashOps.</h1>
              <p className="mt-4 max-w-md text-base text-blue-100/95">
                Create an account to organize transactions, track habits, save for goals, and journal your daily progress.
              </p>
            </div>

            <div className="relative z-10 grid gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Reach your financial goals</p>
                    <p className="text-sm text-blue-100">Track wishlist items, debts, and savings progress.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <NotebookPen className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Reflect every day</p>
                    <p className="text-sm text-blue-100">Keep a daily journal and score your personal wins.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Private and secure</p>
                    <p className="text-sm text-blue-100">Your account keeps all your finance and habit data personal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <Card className="w-full max-w-md border-gray-200/80 bg-white/95 shadow-none">
              <CardHeader className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl shadow-sm lg:hidden">
                  💵
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-[#1976D2]">Join CashOps</CardTitle>
                  <p className="mt-2 text-gray-600">Create your account and start managing money with clarity.</p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-blue-900">
                  Quick setup, private data, and instant access to your dashboard.
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12 rounded-xl border-gray-300 focus-visible:ring-[#1976D2]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 rounded-xl border-gray-300 focus-visible:ring-[#1976D2]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="h-12 rounded-xl border-gray-300 pr-12 focus-visible:ring-[#1976D2]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 hover:text-[#1976D2]"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Use at least 6 characters for a secure password.</p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl bg-[#1976D2] font-semibold text-white shadow-lg hover:bg-blue-700"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </Button>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-[#1976D2] hover:underline">
                      Sign in
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
