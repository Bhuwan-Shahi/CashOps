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
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

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
    await prisma.transaction.delete({
      where: { id },
    })

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

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
    })

    // Convert Decimal to number for client components
    const serializedTransactions = transactions.map(t => ({
      ...t,
      amount: Number(t.amount)
    }))

    return { success: true, data: serializedTransactions }
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return { success: false, error: 'Failed to fetch transactions', data: [] }
  }
}

export async function getTransaction(id: string) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    })

    return { success: true, data: transaction }
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return { success: false, error: 'Failed to fetch transaction' }
  }
}
