'use server'

import prisma from '@/lib/db'
import { TransactionType } from '@prisma/client'
import { startOfMonth, endOfMonth } from 'date-fns'
import { getCurrentUser } from '@/lib/get-current-user'

export async function getDashboardStats() {
  try {
    const user = await getCurrentUser()
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    const [
      totalIncomeAgg,
      totalExpensesAgg,
      monthlyIncomeAgg,
      monthlyExpensesAgg,
      topCategoryGroups,
    ] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId: user.id,
          type: TransactionType.INCOME,
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: user.id,
          type: TransactionType.EXPENSE,
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: user.id,
          type: TransactionType.INCOME,
          date: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: user.id,
          type: TransactionType.EXPENSE,
          date: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.groupBy({
        by: ['category'],
        where: {
          userId: user.id,
          type: TransactionType.EXPENSE,
        },
        _sum: { amount: true },
        orderBy: {
          _sum: {
            amount: 'desc',
          },
        },
        take: 5,
      }),
    ])

    const totalIncome = Number(totalIncomeAgg._sum.amount ?? 0)
    const totalExpenses = Number(totalExpensesAgg._sum.amount ?? 0)
    const monthlyIncome = Number(monthlyIncomeAgg._sum.amount ?? 0)
    const monthlyExpenses = Number(monthlyExpensesAgg._sum.amount ?? 0)

    const topCategories = topCategoryGroups.map((group) => {
      const amount = Number(group._sum.amount ?? 0)
      return {
        category: group.category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }
    })

    return {
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        monthlyIncome,
        monthlyExpenses,
        topCategories,
      },
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.warn(`Dashboard stats unavailable: ${message}`)
    return { success: false, error: 'Failed to fetch stats' }
  }
}

export async function getCategoryBreakdown(
  type: TransactionType,
  startDate?: Date,
  endDate?: Date
) {
  try {
    const user = await getCurrentUser()
    const grouped = await prisma.transaction.groupBy({
      by: ['category'],
      where: {
        userId: user.id,
        type,
        ...(startDate && endDate ? {
          date: {
            gte: startDate,
            lte: endDate,
          },
        } : {}),
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
    })

    const data = grouped.map((item) => ({
      name: item.category,
      value: Number(item._sum.amount ?? 0),
    }))

    return { success: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.warn(`Category breakdown unavailable: ${message}`)
    return { success: false, error: 'Failed to fetch breakdown', data: [] }
  }
}
