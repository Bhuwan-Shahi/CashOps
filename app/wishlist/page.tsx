import { Suspense } from 'react'
import { getWishlistItems } from '@/lib/actions/wishlist'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Target, CreditCard } from 'lucide-react'
import WishlistList from '@/components/WishlistList'

export default async function WishlistPage() {
  const wishlistResult = await getWishlistItems()
  const items = wishlistResult.data || []

  const goals = items.filter((item) => item.type === 'GOAL')
  const debts = items.filter((item) => item.type === 'DEBT_OWED' || item.type === 'DEBT_OWING')

  // Calculate totals
  const goalsTotalAmount = goals.reduce((sum, item) => sum + item.amount, 0)
  const goalsTotalPaid = goals.reduce((sum, item) => sum + item.paid, 0)
  const debtsTotal = debts.reduce((sum, item) => sum + item.amount - item.paid, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1976D2] text-white p-4 shadow-md">
        <div className="container mx-auto max-w-4xl flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Wishlist</h1>
            <p className="text-sm text-blue-100">{items.length} items</p>
          </div>
          <Link href="/wishlist/new">
            <Button className="bg-blue-700 hover:bg-blue-800 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-4xl space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="border-0 shadow bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Goals Progress</p>
                  <p className="text-xl font-bold text-green-600">₹{goalsTotalPaid.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">of ₹{goalsTotalAmount.toFixed(2)}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Remaining Debts</p>
                  <p className="text-xl font-bold text-red-600">₹{debtsTotal.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{debts.length} debts</p>
                </div>
                <CreditCard className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Total Items</p>
                  <p className="text-xl font-bold text-[#1976D2]">{items.length}</p>
                  <p className="text-xs text-gray-500">{goals.length} goals</p>
                </div>
                <Plus className="h-8 w-8 text-[#1976D2]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card className="border-0 shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
                🎯 Goals <span className="text-sm text-gray-500">({goals.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <WishlistList items={goals} />
              </Suspense>
            </CardContent>
          </Card>

          <Card className="border-0 shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
                💳 Debts <span className="text-sm text-gray-500">({debts.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <WishlistList items={debts} />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Padding for Mobile Navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  )
}
