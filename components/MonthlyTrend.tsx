'use client'

import { Transaction as PrismaTransaction } from '@/types'
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns'

type Transaction = Omit<PrismaTransaction, 'amount'> & {
  amount: number
}

interface MonthlyTrendProps {
  transactions: Transaction[]
}

export default function MonthlyTrend({ transactions }: MonthlyTrendProps) {
  // Get last 6 months
  const now = new Date()
  const sixMonthsAgo = subMonths(now, 5)
  const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now })

  // Calculate monthly totals
  const monthlyData = months.map((month) => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)

    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date)
      return transactionDate >= monthStart && transactionDate <= monthEnd
    })

    const income = monthTransactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = monthTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      month: format(month, 'MMM'),
      income,
      expenses,
      net: income - expenses,
    }
  })

  // Calculate totals for pie chart
  const totalIncome = monthlyData.reduce((sum, d) => sum + d.income, 0)
  const totalExpenses = monthlyData.reduce((sum, d) => sum + d.expenses, 0)
  const balance = totalIncome - totalExpenses
  const total = totalIncome + totalExpenses // For calculating percentages

  if (transactions.length === 0 || total === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No transaction data available</p>
      </div>
    )
  }

  const incomePercentage = (totalIncome / total) * 100
  const expensePercentage = (totalExpenses / total) * 100

  // Calculate pie chart segments
  const incomeAngle = (incomePercentage / 100) * 360
  const expenseAngle = (expensePercentage / 100) * 360

  // Nepali number formatting function
  const formatNepali = (num: number) => {
    const absNum = Math.abs(num)
    const numStr = absNum.toString()
    const lastThree = numStr.substring(numStr.length - 3)
    const otherNumbers = numStr.substring(0, numStr.length - 3)
    const formatted = otherNumbers !== '' 
      ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
      : lastThree
    return num < 0 ? '-Rs.' + formatted : 'Rs.' + formatted
  }

  return (
    <div className="space-y-6">
      {/* Pie Chart */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {/* Expense segment (red) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#dc2626"
              strokeWidth="20"
              strokeDasharray={`${(expenseAngle / 360) * 251.2} 251.2`}
              strokeDashoffset="0"
            />
            {/* Income segment (green) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#16a34a"
              strokeWidth="20"
              strokeDasharray={`${(incomeAngle / 360) * 251.2} 251.2`}
              strokeDashoffset={`-${(expenseAngle / 360) * 251.2}`}
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-gray-600 font-medium">Balance</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatNepali(balance)}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded" />
            <div className="text-left">
              <p className="text-xs text-gray-600">Income</p>
              <p className="text-sm font-bold text-green-600">{formatNepali(totalIncome)}</p>
              <p className="text-xs text-gray-500">{incomePercentage.toFixed(1)}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded" />
            <div className="text-left">
              <p className="text-xs text-gray-600">Expenses</p>
              <p className="text-sm font-bold text-red-600">{formatNepali(totalExpenses)}</p>
              <p className="text-xs text-gray-500">{expensePercentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Details */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t">
        {monthlyData.map((data, index) => (
          <div key={index} className="space-y-1">
            <p className="text-xs font-medium text-gray-600">{data.month}</p>
            <p className="text-sm text-green-600">+{formatNepali(data.income)}</p>
            <p className="text-sm text-red-600">-{formatNepali(data.expenses)}</p>
            <p
              className={`text-sm font-bold ${
                data.net >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatNepali(data.net)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
