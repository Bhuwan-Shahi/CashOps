'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/get-current-user'

function toUtcDateOnly(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(Date.UTC(year, (month || 1) - 1, day || 1, 0, 0, 0, 0))
}

export async function getDailyJournalByDate(date: string) {
  try {
    const user = await getCurrentUser()
    const normalizedDate = toUtcDateOnly(date)

    const entry = await prisma.dailyJournal.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: normalizedDate,
        },
      },
    })

    return { success: true, data: entry }
  } catch (error) {
    console.error('Error fetching daily journal by date:', error)
    return { success: false, error: 'Failed to fetch journal entry' }
  }
}

export async function upsertDailyJournal(data: {
  date: string
  notes?: string
  points?: number
}) {
  try {
    const user = await getCurrentUser()
    const normalizedDate = toUtcDateOnly(data.date)

    const entry = await prisma.dailyJournal.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: normalizedDate,
        },
      },
      update: {
        notes: data.notes || null,
        points: data.points ?? 0,
      },
      create: {
        userId: user.id,
        date: normalizedDate,
        notes: data.notes || null,
        points: data.points ?? 0,
      },
    })

    revalidatePath('/journal')
    revalidatePath('/')
    return { success: true, data: entry }
  } catch (error) {
    console.error('Error saving daily journal:', error)
    return { success: false, error: 'Failed to save journal entry' }
  }
}

export async function getRecentDailyJournals(limit = 14) {
  try {
    const user = await getCurrentUser()

    const entries = await prisma.dailyJournal.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: limit,
    })

    return { success: true, data: entries }
  } catch (error) {
    console.error('Error fetching recent daily journals:', error)
    return { success: false, error: 'Failed to fetch recent entries', data: [] }
  }
}
