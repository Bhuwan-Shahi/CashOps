import { Suspense } from 'react'
import { getHabitAnalytics } from '@/lib/actions/habit-analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Award, Target } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function HabitAnalyticsPage() {
  const analyticsResult = await getHabitAnalytics()

  if (!analyticsResult.success || !analyticsResult.data) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Failed to load analytics</h2>
            <p className="text-red-600 text-sm mt-2">{analyticsResult.error}</p>
          </div>
        </div>
      </div>
    )
  }

  const { totalHabits, thisMonthCompleted, lastMonthCompleted, completionRate, habitStats, dailyTrend } = analyticsResult.data

  const monthChange = lastMonthCompleted > 0 
    ? ((thisMonthCompleted - lastMonthCompleted) / lastMonthCompleted) * 100 
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1976D2] text-white p-4 shadow-md">
        <div className="container mx-auto max-w-7xl flex items-center gap-4">
          <Link href="/habits">
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Habit Analytics</h1>
            <p className="text-sm text-blue-100">Track your progress and insights</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 lg:p-8 max-w-7xl space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Habits</p>
                  <p className="text-2xl font-bold text-gray-900">{totalHabits}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-green-600">{thisMonthCompleted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${monthChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {monthChange >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-600">vs Last Month</p>
                  <p className={`text-2xl font-bold ${monthChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {monthChange >= 0 ? '+' : ''}{monthChange.toFixed(0)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{completionRate.toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Completion Trend Chart */}
        <Card className="border-0 shadow">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">30-Day Completion Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 px-2">
                <span>Last 30 Days</span>
                <span>Completion Rate</span>
              </div>
              <div className="h-64 flex items-end gap-1">
                {dailyTrend.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-gray-200 rounded-t flex-1 flex flex-col justify-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 transition-all"
                        style={{ height: `${day.rate}%` }}
                        title={`${day.date}: ${day.completed}/${day.total} (${day.rate.toFixed(0)}%)`}
                      />
                    </div>
                    {index % 5 === 0 && (
                      <span className="text-xs text-gray-500 whitespace-nowrap transform -rotate-45 origin-top-left">
                        {day.date}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Habit Performance Leaderboard */}
        <Card className="border-0 shadow">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Habit Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {habitStats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No habit data available yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {habitStats.map((habit, index) => (
                  <div key={habit.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-400 w-8">
                      #{index + 1}
                    </div>
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: habit.color + '20' }}
                    >
                      {habit.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <span>Completed: {habit.completed}/{habit.total}</span>
                        <span>Success: {habit.rate.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Current</p>
                          <p className="text-lg font-bold" style={{ color: habit.color }}>
                            {habit.currentStreak}🔥
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Best</p>
                          <p className="text-lg font-bold text-gray-700">
                            {habit.bestStreak}⭐
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="border-0 shadow bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">💡 Insights & Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-700">
              {completionRate >= 80 && (
                <p className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span><strong>Excellent!</strong> You're maintaining an outstanding {completionRate.toFixed(0)}% success rate. Keep up the momentum!</span>
                </p>
              )}
              {completionRate < 50 && totalHabits > 0 && (
                <p className="flex items-start gap-2">
                  <span className="text-yellow-600">⚠</span>
                  <span><strong>Tip:</strong> Your success rate is {completionRate.toFixed(0)}%. Try focusing on fewer habits or adjust your targets.</span>
                </p>
              )}
              {habitStats.length > 0 && habitStats[0].rate === 100 && (
                <p className="flex items-start gap-2">
                  <span className="text-yellow-600">🏆</span>
                  <span><strong>Perfect!</strong> {habitStats[0].name} has a 100% completion rate. Amazing dedication!</span>
                </p>
              )}
              {monthChange > 20 && (
                <p className="flex items-start gap-2">
                  <span className="text-green-600">📈</span>
                  <span><strong>Growth:</strong> You've improved by {monthChange.toFixed(0)}% compared to last month!</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
