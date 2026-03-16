import { Suspense } from 'react'
import { getDashboardStats } from '@/lib/actions/analytics'
import { getTransactions } from '@/lib/actions/transactions'
import { getCategoryBreakdown } from '@/lib/actions/analytics'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import MonthlyTrend from '@/components/MonthlyTrend'
import AnalyticsContent from '@/components/AnalyticsContent'
import { endOfMonth, startOfMonth } from 'date-fns'

export default async function AnalyticsPage() {
  try {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    const [statsResult, transactionsResult, initialExpenseBreakdownResult, initialIncomeBreakdownResult] = await Promise.all([
      getDashboardStats(),
      getTransactions(),
      getCategoryBreakdown('EXPENSE', monthStart, monthEnd),
      getCategoryBreakdown('INCOME', monthStart, monthEnd),
    ])

    const stats = statsResult.data
    const transactions = transactionsResult.data || []
    const initialExpenseBreakdown = initialExpenseBreakdownResult.data || []
    const initialIncomeBreakdown = initialIncomeBreakdownResult.data || []

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
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-xl md:text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-blue-100">This Month</p>
        </div>
      </div>

      <div className="container mx-auto p-4 lg:p-8 max-w-7xl space-y-6">
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
                  <p className="text-lg font-bold text-green-600">{formatCurrency(stats.monthlyIncome)}</p>
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
                  <p className="text-lg font-bold text-red-600">{formatCurrency(stats.monthlyExpenses)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="border-0 shadow">
            <CardContent className="p-4">
              <Suspense fallback={<div>Loading chart...</div>}>
                <MonthlyTrend transactions={transactions} />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown with Time Filters */}
        <AnalyticsContent
          initialPeriod="month"
          initialExpenseBreakdown={initialExpenseBreakdown}
          initialIncomeBreakdown={initialIncomeBreakdown}
        />

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
