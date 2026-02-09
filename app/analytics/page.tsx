import { Suspense } from 'react'
import { getDashboardStats, getCategoryBreakdown } from '@/lib/actions/analytics'
import { getTransactions } from '@/lib/actions/transactions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react'
import CategoryChart from '@/components/CategoryChart'
import MonthlyTrend from '@/components/MonthlyTrend'

export default async function AnalyticsPage() {
  try {
    const [statsResult, expenseBreakdownResult, incomeBreakdownResult, transactionsResult] =
      await Promise.all([
        getDashboardStats(),
        getCategoryBreakdown('EXPENSE'),
        getCategoryBreakdown('INCOME'),
        getTransactions(),
      ])

    const stats = statsResult.data
    const expenseBreakdown = expenseBreakdownResult.data || []
    const incomeBreakdown = incomeBreakdownResult.data || []
    const transactions = transactionsResult.data || []

    if (!stats) {
      return (
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="text-red-800 font-semibold">Failed to load analytics data</h2>
              <p className="text-red-600 text-sm mt-2">Error: {statsResult.error || 'Unknown error'}</p>
            </div>
          </div>
        </div>
      )
    }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1976D2] text-white p-4 shadow-md">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-xl md:text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-blue-100">This Month</p>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-4xl space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-0 shadow bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Income</p>
                  <p className="text-lg font-bold text-green-600">₹{stats.monthlyIncome.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Expense</p>
                  <p className="text-lg font-bold text-red-600">₹{stats.monthlyExpenses.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="border-0 shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-800">Category Breakdown</CardTitle>
              <div className="flex gap-4 text-sm mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded"></div>
                  <span className="text-gray-700">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded"></div>
                  <span className="text-gray-700">Expense</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <Suspense fallback={<div>Loading chart...</div>}>
                <MonthlyTrend transactions={transactions} />
              </Suspense>
            </CardContent>
          </Card>

          <Card className="border-0 shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="text-gray-800">Category Breakdown</span>
                <span className="text-sm text-[#1976D2] font-normal">Income</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <CategoryChart data={incomeBreakdown} type="income" />
              </Suspense>
            </CardContent>
          </Card>

          <Card className="border-0 shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="text-gray-800">Category Breakdown</span>
                <span className="text-sm text-red-600 font-normal">Expense</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <CategoryChart data={expenseBreakdown} type="expense" />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Padding for Mobile Navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  ) 
  } catch (error) {
    console.error('Analytics page error:', error)
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error Loading Analytics</h2>
            <p className="text-red-600 text-sm mt-2">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
            <p className="text-gray-600 text-xs mt-2">Check server logs for more details</p>
          </div>
        </div>
      </div>
    )
  }
}
