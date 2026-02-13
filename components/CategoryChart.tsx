'use client'

import { ChartData } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface CategoryChartProps {
  data: ChartData[]
  type: 'expense' | 'income'
}

export default function CategoryChart({ data, type }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No {type} data available</p>
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-orange-500',
  ]

  return (
    <div className="space-y-4">
      {/* Legend and Amounts */}
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1)
          return (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                <span className="font-medium text-gray-700">{item.name}</span>
              </div>
              <span className="text-gray-600">
                {formatCurrency(item.value)} ({percentage}%)
              </span>
            </div>
          )
        })}
      </div>

      {/* Simple Bar Chart */}
      <div className="space-y-2 mt-4">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100
          return (
            <div key={item.name} className="space-y-1">
              <div className="h-8 bg-gray-200 rounded-lg overflow-hidden">
                <div
                  className={`h-full ${colors[index % colors.length]} transition-all duration-500 flex items-center px-3`}
                  style={{ width: `${Math.max(percentage, 5)}%` }}
                >
                  {percentage > 15 && (
                    <span className="text-white text-xs font-medium">{item.name}</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-600">
          Total {type === 'expense' ? 'Expenses' : 'Income'}:{' '}
          <span className="font-bold text-gray-800">{formatCurrency(total)}</span>
        </p>
      </div>
    </div>
  )
}
