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

    // Get all transactions
    const allTransactions = await prisma.transaction.findMany({
      where: { userId: user.id },
    })

    // Get monthly transactions
    const monthlyTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    })

    const totalIncome = allTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalExpenses = allTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0)

    // Calculate top categories (expenses only)
    const expenseTransactions = allTransactions.filter(t => t.type === TransactionType.EXPENSE)
    
    const categoryTotals = expenseTransactions.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { category: t.category, amount: 0 }
      }
      acc[t.category].amount += Number(t.amount)
      return acc
    }, {} as Record<string, { category: string; amount: number }>)

    const topCategories = Object.values(categoryTotals)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map(cat => ({
        ...cat,
        percentage: totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0,
      }))

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
    console.error('Error fetching dashboard stats:', error)
    return { success: false, error: 'Failed to fetch stats' }
  }
}

export async function getCategoryBreakdown(type: TransactionType) {
  try {
    const user = await getCurrentUser()
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        type,
      },
    })

    const breakdown = transactions.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = 0
      }
      acc[t.category] += Number(t.amount)
      return acc
    }, {} as Record<string, number>)

    const data = Object.entries(breakdown).map(([name, value]) => ({
      name,
      value,
    }))

    return { success: true, data }
  } catch (error) {
    console.error('Error fetching category breakdown:', error)
    return { success: false, error: 'Failed to fetch breakdown', data: [] }
  }
}
