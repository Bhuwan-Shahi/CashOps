'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/get-current-user'
import { startOfDay, endOfDay } from 'date-fns'

export async function createHabit(data: {
  name: string
  description?: string
  frequency?: string
  target?: number
  color?: string
  icon?: string
}) {
  try {
    const user = await getCurrentUser()

    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        name: data.name,
        description: data.description,
        frequency: data.frequency || 'daily',
        target: data.target || 1,
        color: data.color || '#3b82f6',
        icon: data.icon || '📌',
      },
    })

    revalidatePath('/habits')
    return { success: true, data: habit }
  } catch (error) {
    console.error('Error creating habit:', error)
    return { success: false, error: 'Failed to create habit' }
  }
}

export async function getHabits() {
  try {
    const user = await getCurrentUser()

    const habits = await prisma.habit.findMany({
      where: {
        userId: user.id,
        active: true,
      },
      include: {
        logs: {
          orderBy: { date: 'desc' },
          take: 100, // Last 100 logs for stats
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, data: habits }
  } catch (error) {
    console.error('Error fetching habits:', error)
    return { success: false, error: 'Failed to fetch habits', data: [] }
  }
}

export async function getHabit(habitId: string) {
  try {
    const user = await getCurrentUser()

    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId: user.id,
      },
      include: {
        logs: {
          orderBy: { date: 'desc' },
        },
      },
    })

    if (!habit) {
      return { success: false, error: 'Habit not found' }
    }

    return { success: true, data: habit }
  } catch (error) {
    console.error('Error fetching habit:', error)
    return { success: false, error: 'Failed to fetch habit' }
  }
}

export async function logHabit(data: {
  habitId: string
  date: Date
  completed?: boolean
  value?: number
  notes?: string
}) {
  try {
    const user = await getCurrentUser()

    // Verify habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: {
        id: data.habitId,
        userId: user.id,
      },
    })

    if (!habit) {
      return { success: false, error: 'Habit not found' }
    }

    // Normalize date to start of day
    const normalizedDate = startOfDay(data.date)

    // Upsert habit log
    const log = await prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId: data.habitId,
          date: normalizedDate,
        },
      },
      update: {
        completed: data.completed ?? true,
        value: data.value,
        notes: data.notes,
      },
      create: {
        habitId: data.habitId,
        date: normalizedDate,
        completed: data.completed ?? true,
        value: data.value,
        notes: data.notes,
      },
    })

    revalidatePath('/habits')
    revalidatePath('/')
    return { success: true, data: log }
  } catch (error) {
    console.error('Error logging habit:', error)
    return { success: false, error: 'Failed to log habit' }
  }
}

export async function getTodayHabits() {
  try {
    const user = await getCurrentUser()
    const today = startOfDay(new Date())

    const habits = await prisma.habit.findMany({
      where: {
        userId: user.id,
        active: true,
      },
      include: {
        logs: {
          where: {
            date: today,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, data: habits }
  } catch (error) {
    console.error('Error fetching today habits:', error)
    return { success: false, error: 'Failed to fetch habits', data: [] }
  }
}

export async function updateHabit(
  habitId: string,
  data: {
    name?: string
    description?: string
    frequency?: string
    target?: number
    color?: string
    icon?: string
    active?: boolean
  }
) {
  try {
    const user = await getCurrentUser()

    const habit = await prisma.habit.updateMany({
      where: {
        id: habitId,
        userId: user.id,
      },
      data,
    })

    if (habit.count === 0) {
      return { success: false, error: 'Habit not found' }
    }

    revalidatePath('/habits')
    return { success: true }
  } catch (error) {
    console.error('Error updating habit:', error)
    return { success: false, error: 'Failed to update habit' }
  }
}

export async function deleteHabit(habitId: string) {
  try {
    const user = await getCurrentUser()

    // Soft delete by setting active to false
    const habit = await prisma.habit.updateMany({
      where: {
        id: habitId,
        userId: user.id,
      },
      data: {
        active: false,
      },
    })

    if (habit.count === 0) {
      return { success: false, error: 'Habit not found' }
    }

    revalidatePath('/habits')
    return { success: true }
  } catch (error) {
    console.error('Error deleting habit:', error)
    return { success: false, error: 'Failed to delete habit' }
  }
}
