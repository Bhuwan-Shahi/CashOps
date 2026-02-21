'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Trash2 } from 'lucide-react'
import { logHabit, deleteHabit } from '@/lib/actions/habits'
import { startOfDay, isSameDay } from 'date-fns'
import { useState } from 'react'
import HabitCalendar from './HabitCalendar'

interface HabitLog {
  id: string
  date: Date
  completed: boolean
  value?: number | null
}

interface Habit {
  id: string
  name: string
  description?: string | null
  frequency: string
  target: number
  color: string
  icon: string
  logs: HabitLog[]
}

interface HabitCardProps {
  habit: Habit
}

export default function HabitCard({ habit }: HabitCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

  const today = startOfDay(new Date())
  const todayLog = habit.logs.find(log => isSameDay(new Date(log.date), today))
  const isCompletedToday = todayLog?.completed || false

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0
    const sortedLogs = [...habit.logs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    for (const log of sortedLogs) {
      if (log.completed) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  const streak = calculateStreak()

  // Calculate completion rate this month
  const thisMonthLogs = habit.logs.filter(log => {
    const logDate = new Date(log.date)
    const now = new Date()
    return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear()
  })
  const completedThisMonth = thisMonthLogs.filter(log => log.completed).length
  const totalDaysThisMonth = new Date().getDate()
  const completionRate = totalDaysThisMonth > 0 ? (completedThisMonth / totalDaysThisMonth) * 100 : 0

  const handleToggle = async () => {
    setIsLoading(true)
    await logHabit({
      habitId: habit.id,
      date: today,
      completed: !isCompletedToday,
    })
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this habit?')) {
      await deleteHabit(habit.id)
    }
  }

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: habit.color + '20' }}
            >
              {habit.icon}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg text-gray-900">{habit.name}</CardTitle>
              {habit.description && (
                <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: habit.color }}>
              {streak}
            </p>
            <p className="text-xs text-gray-500">Day Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {completedThisMonth}
            </p>
            <p className="text-xs text-gray-500">This Month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {completionRate.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500">Success Rate</p>
          </div>
        </div>

        {/* Quick Action Button */}
        <Button
          onClick={handleToggle}
          disabled={isLoading}
          className="w-full h-12 text-white font-semibold transition-all"
          style={{
            backgroundColor: isCompletedToday ? '#10b981' : habit.color,
          }}
        >
          {isLoading ? (
            'Loading...'
          ) : isCompletedToday ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              Completed Today!
            </>
          ) : (
            `Mark as Done`
          )}
        </Button>

        {/* Toggle Calendar */}
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="text-sm text-gray-600 hover:text-gray-900 w-full text-center"
        >
          {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
        </button>

        {showCalendar && (
          <div className="pt-2 border-t">
            <HabitCalendar logs={habit.logs} color={habit.color} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
