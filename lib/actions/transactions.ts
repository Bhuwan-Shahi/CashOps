'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'
import { TransactionType } from '@prisma/client'
import type { TransactionFormData } from '@/types'
import { getCurrentUser } from '@/lib/get-current-user'

export async function createTransaction(data: TransactionFormData) {
  try {
    const user = await getCurrentUser()
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: data.type,
        amount: data.amount,
        category: data.category,
        description: data.description,
        date: data.date,
      },
    })

    revalidatePath('/')
    revalidatePath('/transactions')
    return { success: true, data: { ...transaction, amount: Number(transaction.amount) } }
  } catch (error) {
    console.error('Error creating transaction:', error)
    return { success: false, error: 'Failed to create transaction' }
  }
}

export async function updateTransaction(id: string, data: Partial<TransactionFormData>) {
  try {
    const user = await getCurrentUser()

    const updateResult = await prisma.transaction.updateMany({
      where: {
        id,
        userId: user.id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

    if (updateResult.count === 0) {
      return { success: false, error: 'Transaction not found' }
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!transaction) {
      return { success: false, error: 'Transaction not found' }
    }

    revalidatePath('/')
    revalidatePath('/transactions')
    return { success: true, data: { ...transaction, amount: Number(transaction.amount) } }
  } catch (error) {
    console.error('Error updating transaction:', error)
    return { success: false, error: 'Failed to update transaction' }
  }
}

export async function deleteTransaction(id: string) {
  try {
    const user = await getCurrentUser()

    const deleteResult = await prisma.transaction.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    })

    if (deleteResult.count === 0) {
      return { success: false, error: 'Transaction not found' }
    }

    revalidatePath('/')
    revalidatePath('/transactions')
    return { success: true }
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return { success: false, error: 'Failed to delete transaction' }
  }
}

export async function getTransactions(filters?: {
  startDate?: Date
  endDate?: Date
  type?: TransactionType
  category?: string
  page?: number
  pageSize?: number
}) {
  try {
    const user = await getCurrentUser()
    const where: any = { userId: user.id }

    if (filters?.startDate || filters?.endDate) {
      where.date = {}
      if (filters.startDate) where.date.gte = filters.startDate
      if (filters.endDate) where.date.lte = filters.endDate
    }

    if (filters?.type) where.type = filters.type
    if (filters?.category) where.category = filters.category

    const shouldPaginate =
      typeof filters?.page === 'number' && typeof filters?.pageSize === 'number'
    const page = Math.max(1, filters?.page ?? 1)
    const pageSize = Math.min(100, Math.max(1, filters?.pageSize ?? 20))

    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        ...(shouldPaginate
          ? {
              skip: (page - 1) * pageSize,
              take: pageSize,
            }
          : {}),
      }),
      shouldPaginate
        ? prisma.transaction.count({ where })
        : Promise.resolve(0),
    ])

    // Convert Decimal to number for client components
    const serializedTransactions = transactions.map(t => ({
      ...t,
      amount: Number(t.amount)
    }))

    const totalPages = shouldPaginate ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1

    return {
      success: true,
      data: serializedTransactions,
      pagination: shouldPaginate
        ? {
            page,
            pageSize,
            totalCount,
            totalPages,
            hasPreviousPage: page > 1,
            hasNextPage: page < totalPages,
          }
        : undefined,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.warn(`Transactions unavailable: ${message}`)
    return { success: false, error: 'Failed to fetch transactions', data: [] }
  }
}

export async function getTransaction(id: string) {
  try {
    const user = await getCurrentUser()

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!transaction) {
      return { success: false, error: 'Transaction not found' }
    }

    return { success: true, data: transaction }
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return { success: false, error: 'Failed to fetch transaction' }
  }
}
