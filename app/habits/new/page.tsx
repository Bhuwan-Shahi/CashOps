import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import HabitForm from '@/components/HabitForm'

export default function NewHabitPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1976D2] text-white p-4 shadow-md">
        <div className="container mx-auto max-w-4xl flex items-center gap-4">
          <Link href="/habits">
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Create New Habit</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 lg:p-8 max-w-2xl">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <HabitForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
