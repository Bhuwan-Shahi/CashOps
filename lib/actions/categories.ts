'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'
import type { CategoryFormData } from '@/types'

const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || 'user_default_001'

export async function createCategory(data: CategoryFormData) {
  try {
    const category = await prisma.category.create({
      data: {
        userId: DEFAULT_USER_ID,
        ...data,
      },
    })

    revalidatePath('/')
    return { success: true, data: category }
  } catch (error) {
    console.error('Error creating category:', error)
    return { success: false, error: 'Failed to create category' }
  }
}

export async function getCategories(type?: string) {
  try {
    const where: any = { userId: DEFAULT_USER_ID }
    if (type) where.type = type

    const categories = await prisma.category.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return { success: true, data: categories }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { success: false, error: 'Failed to fetch categories', data: [] }
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { success: false, error: 'Failed to delete category' }
  }
}
