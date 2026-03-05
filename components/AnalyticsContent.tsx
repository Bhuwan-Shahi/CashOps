'use client'

import { useState, useEffect } from 'react'
import { getCategoryBreakdown } from '@/lib/actions/analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import CategoryChart from '@/components/CategoryChart'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay, subMonths } from 'date-fns'

type TimePeriod = 'today' | 'week' | 'month' | 'all'

interface CategoryData {
  name: string
  value: number
}

export default function AnalyticsContent() {
  const [period, setPeriod] = useState<TimePeriod>('month')
  const [expenseBreakdown, setExpenseBreakdown] = useState<CategoryData[]>([])
  const [incomeBreakdown, setIncomeBreakdown] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(false)

  const getDateRange = (period: TimePeriod) => {
    const now = new Date()
    switch (period) {
      case 'today':
        return { start: startOfDay(now), end: endOfDay(now) }
      case 'week':
        return { start: startOfWeek(now), end: endOfWeek(now) }
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) }
      case 'all':
        return { start: undefined, end: undefined }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { start, end } = getDateRange(period)
      
      const [expenseResult, incomeResult] = await Promise.all([
        getCategoryBreakdown('EXPENSE', start, end),
        getCategoryBreakdown('INCOME', start, end),
      ])

      setExpenseBreakdown(expenseResult.data || [])
      setIncomeBreakdown(incomeResult.data || [])
      setLoading(false)
    }

    fetchData()
  }, [period])

  const periodLabels = {
    today: 'Today',
    week: 'This Week',
    month: 'This Month',
    all: 'All Time'
  }

  return (
    <div className="space-y-6">
      {/* Time Period Filters */}
      <Card className="border-0 shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-gray-700">Time Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {(['today', 'week', 'month', 'all'] as TimePeriod[]).map((p) => (
              <Button
                key={p}
                variant={period === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod(p)}
                className={period === p ? 'bg-[#1976D2] hover:bg-blue-700' : ''}
              >
                {periodLabels[p]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="border-0 shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="text-gray-800">Category Breakdown</span>
              <span className="text-sm text-[#1976D2] font-normal">Income</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading...</div>
              </div>
            ) : (
              <CategoryChart data={incomeBreakdown} type="income" />
            )}
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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading...</div>
              </div>
            ) : (
              <CategoryChart data={expenseBreakdown} type="expense" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
