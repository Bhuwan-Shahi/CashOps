'use server'

import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/get-current-user'
import { startOfMonth, endOfMonth, eachDayOfInterval, subMonths, format, startOfDay, endOfDay } from 'date-fns'

export async function getHabitAnalytics() {
  try {
    const user = await getCurrentUser()
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)
    const lastMonthStart = startOfMonth(subMonths(now, 1))
    const lastMonthEnd = endOfMonth(subMonths(now, 1))

    // Get all habits with logs
    const habits = await prisma.habit.findMany({
      where: {
        userId: user.id,
        active: true,
      },
      include: {
        logs: {
          where: {
            date: {
              gte: subMonths(now, 3), // Last 3 months
            },
          },
        },
      },
    })

    // Calculate overall stats
    const thisMonthCompleted = await prisma.habitLog.count({
      where: {
        habit: {
          userId: user.id,
          active: true,
        },
        completed: true,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    })

    const lastMonthCompleted = await prisma.habitLog.count({
      where: {
        habit: {
          userId: user.id,
          active: true,
        },
        completed: true,
        date: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    })
    
    const daysInMonth = now.getDate()
    const totalPossible = habits.length * daysInMonth
    const completionRate = totalPossible > 0 ? (thisMonthCompleted / totalPossible) * 100 : 0

    // Calculate per-habit stats
    const habitStats = habits.map(habit => {
      const completed = habit.logs.filter(log => log.completed).length
      const total = habit.logs.length
      const rate = total > 0 ? (completed / total) * 100 : 0

      // Calculate current streak
      let currentStreak = 0
      const sortedLogs = [...habit.logs]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      for (const log of sortedLogs) {
        if (log.completed) {
          currentStreak++
        } else {
          break
        }
      }

      // Calculate best streak
      let bestStreak = 0
      let tempStreak = 0
      const allLogs = [...habit.logs].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      
      for (const log of allLogs) {
        if (log.completed) {
          tempStreak++
          bestStreak = Math.max(bestStreak, tempStreak)
        } else {
          tempStreak = 0
        }
      }

      return {
        id: habit.id,
        name: habit.name,
        icon: habit.icon,
        color: habit.color,
        completed,
        total,
        rate,
        currentStreak,
        bestStreak,
      }
    })

    // Sort by completion rate
    habitStats.sort((a, b) => b.rate - a.rate)

    // Daily completion trend (last 30 days)
    const last30Days = eachDayOfInterval({
      start: subMonths(now, 1),
      end: now,
    })

    const trendStart = startOfDay(last30Days[0])
    const trendEnd = endOfDay(last30Days[last30Days.length - 1])
    const trendLogs = await prisma.habitLog.findMany({
      where: {
        habit: {
          userId: user.id,
          active: true,
        },
        date: {
          gte: trendStart,
          lte: trendEnd,
        },
      },
      select: {
        date: true,
        completed: true,
      },
    })

    const completedByDay = new Map<string, number>()
    for (const log of trendLogs) {
      if (!log.completed) continue
      const key = format(new Date(log.date), 'yyyy-MM-dd')
      completedByDay.set(key, (completedByDay.get(key) ?? 0) + 1)
    }

    const dailyTrend = last30Days.map((day) => {
      const key = format(day, 'yyyy-MM-dd')
      const completed = completedByDay.get(key) ?? 0
      const total = habits.length

      return {
        date: format(day, 'MMM d'),
        completed,
        total,
        rate: total > 0 ? (completed / total) * 100 : 0,
      }
    })

    return {
      success: true,
      data: {
        totalHabits: habits.length,
        thisMonthCompleted,
        lastMonthCompleted,
        completionRate,
        habitStats,
        dailyTrend,
      },
    }
  } catch (error) {
    console.error('Error fetching habit analytics:', error)
    return { success: false, error: 'Failed to fetch analytics' }
  }
}
