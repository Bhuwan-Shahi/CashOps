import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { auth } from '@/lib/auth'
import { TransactionType } from '@prisma/client'

function escapeCsvValue(value: string | number | null | undefined) {
  if (value === null || value === undefined) return ''
  const stringValue = String(value)
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: {
      userId: string
      type?: TransactionType
      category?: string
      date?: {
        gte?: Date
        lte?: Date
      }
    } = {
      userId: session.user.id,
    }

    if (type === 'INCOME' || type === 'EXPENSE') {
      where.type = type
    }

    if (category) {
      where.category = category
    }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
    })

    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description']
    const rows = transactions.map((transaction) => {
      const date = new Date(transaction.date).toISOString().split('T')[0]
      return [
        escapeCsvValue(date),
        escapeCsvValue(transaction.type),
        escapeCsvValue(transaction.category),
        escapeCsvValue(Number(transaction.amount).toFixed(2)),
        escapeCsvValue(transaction.description ?? ''),
      ].join(',')
    })

    const csv = [headers.join(','), ...rows].join('\n')
    const fileName = `transactions-${new Date().toISOString().split('T')[0]}.csv`

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting transactions:', error)
    return NextResponse.json({ error: 'Failed to export transactions' }, { status: 500 })
  }
}
