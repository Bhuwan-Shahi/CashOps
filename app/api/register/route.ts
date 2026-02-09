import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      }
    })

    // Create default categories for the new user
    const defaultCategories = [
      { name: 'Salary', type: 'INCOME' as const, color: '#10b981' },
      { name: 'Freelance', type: 'INCOME' as const, color: '#3b82f6' },
      { name: 'Food', type: 'EXPENSE' as const, color: '#ef4444' },
      { name: 'Transport', type: 'EXPENSE' as const, color: '#f59e0b' },
      { name: 'Shopping', type: 'EXPENSE' as const, color: '#8b5cf6' },
      { name: 'Bills', type: 'EXPENSE' as const, color: '#ec4899' },
    ]

    await prisma.category.createMany({
      data: defaultCategories.map(cat => ({
        ...cat,
        userId: user.id,
      }))
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
