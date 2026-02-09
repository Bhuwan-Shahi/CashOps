import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    // Try to query the database
    await prisma.$queryRaw`SELECT 1`
    
    // Check if default user exists
    const userCount = await prisma.user.count()
    const transactionCount = await prisma.transaction.count()
    const categoryCount = await prisma.category.count()
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      data: {
        users: userCount,
        transactions: transactionCount,
        categories: categoryCount,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
