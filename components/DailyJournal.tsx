'use client'

import { useMemo, useState, useTransition } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getDailyJournalByDate, upsertDailyJournal } from '@/lib/actions/daily-journal'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'

interface DailyJournalEntry {
  id: string
  date: Date
  notes: string | null
  points: number
}

interface DailyJournalProps {
  initialDate: string
  initialEntry: DailyJournalEntry | null
  recentEntries: DailyJournalEntry[]
}

function toDateKey(value: Date | string) {
  const date = new Date(value)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toReadableDate(value: Date | string) {
  const date = new Date(value)
  const year = date.getUTCFullYear()
  const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${day} ${month} ${year}`
}

export default function DailyJournal({ initialDate, initialEntry, recentEntries }: DailyJournalProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [points, setPoints] = useState(initialEntry?.points ?? 0)
  const [notes, setNotes] = useState(initialEntry?.notes ?? '')
  const [entries, setEntries] = useState<DailyJournalEntry[]>(recentEntries)
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(recentEntries[0]?.id ?? null)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const totalPoints = useMemo(
    () => entries.reduce((sum, entry) => sum + (entry.points || 0), 0),
    [entries]
  )

  const loadEntry = (date: string) => {
    setSelectedDate(date)
    setMessage(null)

    startTransition(async () => {
      const result = await getDailyJournalByDate(date)
      const entry = result.success ? result.data : null
      setPoints(entry?.points ?? 0)
      setNotes(entry?.notes ?? '')
    })
  }

  const handleNewJournal = () => {
    const todayKey = format(new Date(), 'yyyy-MM-dd')
    setSelectedDate(todayKey)
    setPoints(0)
    setNotes('')
    setMessage(null)
  }

  const handleSave = () => {
    setMessage(null)

    startTransition(async () => {
      const result = await upsertDailyJournal({
        date: selectedDate,
        points: Number.isNaN(points) ? 0 : points,
        notes: notes.trim(),
      })

      if (!result.success || !result.data) {
        setMessage('Failed to save entry')
        return
      }

      setEntries((prev) => {
        const withoutCurrent = prev.filter(
          (entry) => toDateKey(entry.date) !== selectedDate
        )
        const updated = [result.data as DailyJournalEntry, ...withoutCurrent]
        return updated
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 14)
      })
      setExpandedEntryId((result.data as DailyJournalEntry).id)
      setMessage('Saved successfully')
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-0 shadow lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-gray-900">Journal Entries</CardTitle>
              <Button
                onClick={handleNewJournal}
                className="bg-[#1976D2] hover:bg-blue-700 text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Journal
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {entries.length === 0 ? (
                <p className="text-sm text-gray-500">No entries yet. Create your first journal from the top-right button.</p>
              ) : (
                entries.map((entry) => {
                  const isExpanded = expandedEntryId === entry.id
                  return (
                    <div key={entry.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <div className="w-full p-3 flex items-center justify-between hover:bg-gray-50">
                        <button
                          type="button"
                          className="text-left flex-1"
                          onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                        >
                          <p className="text-sm font-semibold text-gray-900">{toReadableDate(entry.date)}</p>
                          <p className="text-xs text-gray-500">{entry.points} points</p>
                        </button>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(event) => {
                              event.stopPropagation()
                              loadEntry(toDateKey(entry.date))
                            }}
                          >
                            Edit
                          </Button>
                          <button
                            type="button"
                            onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                            className="p-1 rounded hover:bg-gray-100"
                            aria-label={isExpanded ? 'Collapse entry' : 'Expand entry'}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="px-3 pb-3 border-t border-gray-100">
                          <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">
                            {entry.notes?.trim() || 'No notes for this day.'}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card id="journal-editor" className="border-0 shadow">
          <CardHeader>
            <CardTitle className="text-gray-900">Write / Edit Journal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-xs text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-[#1976D2]">{totalPoints}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(event) => loadEntry(event.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Points (optional)</label>
              <Input
                type="number"
                min={0}
                step={1}
                value={points}
                onChange={(event) => setPoints(Number(event.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Daily Notes</label>
              <Textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Write your daily highlights, lessons, wins, or challenges..."
                className="mt-1 min-h-[220px]"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={isPending}
              className="w-full bg-[#1976D2] hover:bg-blue-700 text-white"
            >
              {isPending ? 'Saving...' : 'Save Journal'}
            </Button>

            {message && (
              <p className={`text-sm ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}

            <p className="text-xs text-gray-500">
              Tip: Select a date to view/edit that day’s entry. Saving updates the same day instead of creating duplicates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
