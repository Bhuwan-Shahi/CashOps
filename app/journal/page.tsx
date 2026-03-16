import { format } from 'date-fns'
import { BookText, Plus } from 'lucide-react'
import { getDailyJournalByDate, getRecentDailyJournals } from '@/lib/actions/daily-journal'
import DailyJournal from '@/components/DailyJournal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type JournalEntry = {
  id: string
  date: Date
  notes: string | null
  points: number
}

export default async function JournalPage() {
  const today = new Date()
  const todayKey = format(today, 'yyyy-MM-dd')

  const [todayEntryResult, recentResult] = await Promise.all([
    getDailyJournalByDate(todayKey),
    getRecentDailyJournals(14),
  ])

  const initialEntry: JournalEntry | null = todayEntryResult.success
    ? ((todayEntryResult.data as JournalEntry | null) ?? null)
    : null
  const recentEntries: JournalEntry[] = recentResult.success
    ? ((recentResult.data as JournalEntry[]) ?? [])
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1976D2] text-white p-4 shadow-md">
        <div className="container mx-auto max-w-7xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BookText className="h-6 w-6" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Daily Journal</h1>
              <p className="text-sm text-blue-100">Capture what happened each day with notes and points</p>
            </div>
          </div>
          <Link href="#journal-editor">
            <Button className="bg-blue-700 hover:bg-blue-800 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Journal
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto p-4 lg:p-8 max-w-7xl">
        <DailyJournal
          initialDate={todayKey}
          initialEntry={initialEntry}
          recentEntries={recentEntries}
        />
      </div>
    </div>
  )
}
