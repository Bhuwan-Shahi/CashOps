'use client'

import { WishlistItem as PrismaWishlistItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Check, Plus } from 'lucide-react'
import { deleteWishlistItem, updateWishlistItem, addPayment } from '@/lib/actions/wishlist'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { format } from 'date-fns'

type WishlistItem = Omit<PrismaWishlistItem, 'amount' | 'paid'> & {
  amount: number
  paid: number
}

interface WishlistListProps {
  items: WishlistItem[]
}

export default function WishlistList({ items }: WishlistListProps) {
  const router = useRouter()
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [paymentAmounts, setPaymentAmounts] = useState<Record<string, string>>({})

  const handleAddPayment = async (id: string) => {
    const amount = parseFloat(paymentAmounts[id] || '0')
    if (amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setProcessingId(id)
    const result = await addPayment(id, amount)
    if (result.success) {
      setPaymentAmounts({ ...paymentAmounts, [id]: '' })
      router.refresh()
    } else {
      alert('Failed to add payment')
    }
    setProcessingId(null)
  }

  const handleComplete = async (id: string) => {
    setProcessingId(id)
    const result = await updateWishlistItem(id, { status: 'COMPLETED' })
    if (result.success) {
      router.refresh()
    } else {
      alert('Failed to update item')
    }
    setProcessingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    setProcessingId(id)
    const result = await deleteWishlistItem(id)
    if (result.success) {
      router.refresh()
    } else {
      alert('Failed to delete item')
    }
    setProcessingId(null)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No items yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const remaining = Number(item.amount) - Number(item.paid || 0)
        const progress = Number(item.paid || 0) / Number(item.amount) * 100
        
        return (
          <div
            key={item.id}
            className={`p-4 border rounded-lg ${
              item.status === 'COMPLETED' ? 'bg-gray-100 opacity-60' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      item.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total: ₹{Number(item.amount).toFixed(2)}</span>
                    <span className="text-gray-600">Paid: ₹{Number(item.paid || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-800">Remaining:</span>
                    <span className={remaining > 0 ? 'text-red-600' : 'text-green-600'}>
                      ₹{remaining.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 text-right">{progress.toFixed(1)}% complete</p>
                </div>

                {item.person && (
                  <p className="text-sm text-gray-600 mt-2">Person: {item.person}</p>
                )}
                {item.dueDate && (
                  <p className="text-sm text-gray-600">
                    Due: {format(new Date(item.dueDate), 'PPP')}
                  </p>
                )}
                {item.notes && <p className="text-sm text-gray-600 mt-1">{item.notes}</p>}
                
                {/* Add Payment Section */}
                {item.status !== 'COMPLETED' && remaining > 0 && (
                  <div className="mt-3 flex gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max={remaining}
                      placeholder="Enter amount"
                      value={paymentAmounts[item.id] || ''}
                      onChange={(e) =>
                        setPaymentAmounts({ ...paymentAmounts, [item.id]: e.target.value })
                      }
                      className="h-8 text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddPayment(item.id)}
                      disabled={processingId === item.id}
                      className="bg-[#1976D2] hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Payment
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                {item.status !== 'COMPLETED' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleComplete(item.id)}
                    disabled={processingId === item.id}
                    title="Mark as completed"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  disabled={processingId === item.id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
