'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { logHabit } from '@/lib/actions/habits'
import { startOfDay, isSameDay } from 'date-fns'
import { useState } from 'react'

interface HabitLog {
  id: string
  date: Date
  completed: boolean
}

interface Habit {
  id: string
  name: string
  icon: string
  color: string
  logs: HabitLog[]
}

interface TodayHabitsProps {
  habits: Habit[]
}

export default function TodayHabits({ habits }: TodayHabitsProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const today = startOfDay(new Date())

  const handleToggle = async (habitId: string, isCompleted: boolean) => {
    setLoadingStates(prev => ({ ...prev, [habitId]: true }))
    await logHabit({
      habitId,
      date: today,
      completed: !isCompleted,
    })
    setLoadingStates(prev => ({ ...prev, [habitId]: false }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {habits.map((habit) => {
        const todayLog = habit.logs.find(log => isSameDay(new Date(log.date), today))
        const isCompleted = todayLog?.completed || false
        const isLoading = loadingStates[habit.id]

        return (
          <Card key={habit.id} className="border-0 shadow hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: habit.color + '20' }}
                  >
                    {habit.icon}
                  </div>
                  <span className="font-semibold text-gray-900">{habit.name}</span>
                </div>
                <Button
                  size="icon"
                  onClick={() => handleToggle(habit.id, isCompleted)}
                  disabled={isLoading}
                  className={`h-10 w-10 rounded-full transition-all ${
                    isCompleted
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  style={
                    !isCompleted
                      ? {
                          backgroundColor: habit.color + '20',
                          color: habit.color,
                        }
                      : {}
                  }
                >
                  {isCompleted && <Check className="h-5 w-5 text-white" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
