import { Suspense } from 'react'
import { getHabits } from '@/lib/actions/habits'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import HabitCard from '@/components/HabitCard'

export default async function HabitsPage() {
  const habitsResult = await getHabits()
  const habits = habitsResult.data || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1976D2] text-white p-4 shadow-md">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Habit Tracker</h1>
            <p className="text-sm text-blue-100">Build better habits, track your progress</p>
          </div>
          <Link href="/habits/new">
            <Button className="bg-blue-700 hover:bg-blue-800 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Habit
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto p-4 lg:p-8 max-w-7xl space-y-6">
        {habits.length === 0 ? (
          <Card className="border-0 shadow">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📌</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No habits yet</h2>
              <p className="text-gray-500 mb-6">
                Start building better habits today! Create your first habit to get started.
              </p>
              <Link href="/habits/new">
                <Button className="bg-[#1976D2] hover:bg-blue-700 h-12 px-8">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Habit
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <Suspense key={habit.id} fallback={<div>Loading...</div>}>
                <HabitCard habit={habit} />
              </Suspense>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
