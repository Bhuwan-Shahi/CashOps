'use client'

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isFuture } from 'date-fns'

interface HabitLog {
  id: string
  date: Date
  completed: boolean
  value?: number | null
}

interface HabitCalendarProps {
  logs: HabitLog[]
  color?: string
}

export default function HabitCalendar({ logs, color = '#3b82f6' }: HabitCalendarProps) {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getLogForDate = (date: Date) => {
    return logs.find(log => isSameDay(new Date(log.date), date))
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const log = getLogForDate(day)
          const isCompleted = log?.completed
          const isDayToday = isToday(day)
          const isDayFuture = isFuture(day) && !isDayToday

          return (
            <div
              key={day.toString()}
              className={`aspect-square rounded flex items-center justify-center text-xs font-medium transition-all ${
                isDayFuture
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isCompleted
                  ? 'text-white shadow-sm'
                  : isDayToday
                  ? 'bg-blue-50 text-blue-600 border-2 border-blue-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={
                isCompleted && !isDayFuture
                  ? { backgroundColor: color }
                  : {}
              }
              title={
                log
                  ? `${format(day, 'MMM d')}: ${isCompleted ? 'Completed' : 'Missed'}`
                  : format(day, 'MMM d')
              }
            >
              {format(day, 'd')}
            </div>
          )
        })}
      </div>
    </div>
  )
}
