'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'
import { WishlistStatus } from '@prisma/client'
import type { WishlistFormData } from '@/types'

const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || 'user_default_001'

export async function createWishlistItem(data: WishlistFormData) {
  try {
    const item = await prisma.wishlistItem.create({
      data: {
        userId: DEFAULT_USER_ID,
        ...data,
      },
    })

    revalidatePath('/wishlist')
    return { success: true, data: { ...item, amount: Number(item.amount), paid: Number(item.paid) } }
  } catch (error) {
    console.error('Error creating wishlist item:', error)
    return { success: false, error: 'Failed to create wishlist item' }
  }
}

export async function updateWishlistItem(id: string, data: Partial<WishlistFormData & { status?: WishlistStatus }>) {
  try {
    const item = await prisma.wishlistItem.update({
      where: { id },
      data,
    })

    revalidatePath('/wishlist')
    return { success: true, data: { ...item, amount: Number(item.amount), paid: Number(item.paid) } }
  } catch (error) {
    console.error('Error updating wishlist item:', error)
    return { success: false, error: 'Failed to update wishlist item' }
  }
}

export async function deleteWishlistItem(id: string) {
  try {
    await prisma.wishlistItem.delete({
      where: { id },
    })

    revalidatePath('/wishlist')
    return { success: true }
  } catch (error) {
    console.error('Error deleting wishlist item:', error)
    return { success: false, error: 'Failed to delete wishlist item' }
  }
}

export async function getWishlistItems() {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { createdAt: 'desc' },
    })

    // Convert Decimal to number for client components
    const serializedItems = items.map(item => ({
      ...item,
      amount: Number(item.amount),
      paid: Number(item.paid)
    }))

    return { success: true, data: serializedItems }
  } catch (error) {
    console.error('Error fetching wishlist items:', error)
    return { success: false, error: 'Failed to fetch wishlist items', data: [] }
  }
}

export async function addPayment(id: string, paymentAmount: number) {
  try {
    const item = await prisma.wishlistItem.findUnique({
      where: { id },
    })

    if (!item) {
      return { success: false, error: 'Item not found' }
    }

    const currentPaid = Number(item.paid)
    const totalAmount = Number(item.amount)
    const newPaid = currentPaid + paymentAmount

    // Check if fully paid
    const isFullyPaid = newPaid >= totalAmount
    
    // Use a transaction to update wishlist item and create expense transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the wishlist item
      const updatedItem = await tx.wishlistItem.update({
        where: { id },
        data: {
          paid: newPaid,
          status: isFullyPaid ? WishlistStatus.COMPLETED : item.status,
        },
      })

      // Get or create a category for wishlist payments
      let category = await tx.category.findFirst({
        where: {
          userId: DEFAULT_USER_ID,
          type: 'EXPENSE',
          name: 'Wishlist Payment',
        },
      })

      // Create the category if it doesn't exist
      if (!category) {
        category = await tx.category.create({
          data: {
            userId: DEFAULT_USER_ID,
            type: 'EXPENSE',
            name: 'Wishlist Payment',
            color: '#9333ea', // Purple color
          },
        })
      }

      // Create an expense transaction to deduct from balance
      await tx.transaction.create({
        data: {
          userId: DEFAULT_USER_ID,
          type: 'EXPENSE',
          amount: paymentAmount,
          category: category.name, // Use category name, not categoryId
          description: `Payment for ${item.type === 'GOAL' ? 'goal' : 'debt'}: ${item.title}${item.person ? ` (${item.person})` : ''}`,
          date: new Date(),
        },
      })

      return updatedItem
    })

    revalidatePath('/wishlist')
    revalidatePath('/')
    revalidatePath('/transactions')
    return { 
      success: true, 
      data: { 
        ...result, 
        amount: Number(result.amount),
        paid: Number(result.paid)
      } 
    }
  } catch (error) {
    console.error('Error adding payment:', error)
    return { success: false, error: 'Failed to add payment' }
  }
}
