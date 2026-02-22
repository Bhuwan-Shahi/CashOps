'use server'

import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/get-current-user'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, subMonths, format } from 'date-fns'

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
    const thisMonthLogs = await prisma.habitLog.findMany({
      where: {
        habit: {
          userId: user.id,
          active: true,
        },
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    })

    const lastMonthLogs = await prisma.habitLog.findMany({
      where: {
        habit: {
          userId: user.id,
          active: true,
        },
        date: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    })

    const thisMonthCompleted = thisMonthLogs.filter(log => log.completed).length
    const lastMonthCompleted = lastMonthLogs.filter(log => log.completed).length
    
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

    const dailyTrend = await Promise.all(
      last30Days.map(async day => {
        const dayLogs = await prisma.habitLog.findMany({
          where: {
            habit: {
              userId: user.id,
              active: true,
            },
            date: day,
          },
        })

        const completed = dayLogs.filter(log => log.completed).length
        const total = habits.length

        return {
          date: format(day, 'MMM d'),
          completed,
          total,
          rate: total > 0 ? (completed / total) * 100 : 0,
        }
      })
    )

    return {
      success: true,
      data: {
        totalHabits: habits.length,
        thisMonthCompleted,
        lastMonthCompleted,
        completionRate,
        habitStats,
        dailyTrend: await Promise.all(dailyTrend.map(async d => d)),
      },
    }
  } catch (error) {
    console.error('Error fetching habit analytics:', error)
    return { success: false, error: 'Failed to fetch analytics' }
  }
}
