'use client'

import { Transaction as PrismaTransaction } from '@/types'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { deleteTransaction } from '@/lib/actions/transactions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Transaction = Omit<PrismaTransaction, 'amount'> & {
  amount: number
}

interface TransactionListProps {
  transactions: Transaction[]
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return

    setDeletingId(id)
    const result = await deleteTransaction(id)
    if (result.success) {
      router.refresh()
    } else {
      alert('Failed to delete transaction')
    }
    setDeletingId(null)
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <div className="text-6xl mb-4">💸</div>
        <p className="text-xl font-semibold mb-2 text-gray-700">No transactions found</p>
        <p className="text-sm text-gray-600">Add your first transaction to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 bg-white"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  transaction.type === 'INCOME'
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                }`}
              >
                {transaction.type}
              </span>
              <span className="font-bold text-lg text-gray-800">{transaction.category}</span>
            </div>
            {transaction.description && (
              <p className="text-sm text-gray-600 ml-1">{transaction.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1 ml-1">
              {format(new Date(transaction.date), 'PPP')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`text-2xl font-bold ${
                transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {transaction.type === 'INCOME' ? '+' : '-'}₹{Number(transaction.amount).toFixed(2)}
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-blue-100 hover:text-blue-600"
                onClick={() => router.push(`/transactions/${transaction.id}/edit`)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-red-100 hover:text-red-600"
                onClick={() => handleDelete(transaction.id)}
                disabled={deletingId === transaction.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
