'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTransaction } from '@/lib/actions/transactions'
import { Category, TransactionType } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TransactionFormProps {
  categories: Category[]
  initialType?: TransactionType
  transaction?: {
    id: string
    type: TransactionType
    amount: number
    category: string
    description?: string | null
    date: Date
  }
}

export default function TransactionForm({ categories, initialType, transaction }: TransactionFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    type: transaction?.type || initialType || ('EXPENSE' as TransactionType),
    amount: transaction?.amount || 0,
    category: transaction?.category || '',
    description: transaction?.description || '',
    date: transaction?.date
      ? new Date(transaction.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  })

  const filteredCategories = categories.filter((cat) => cat.type === formData.type)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createTransaction({
        type: formData.type,
        amount: Number(formData.amount),
        category: formData.category,
        description: formData.description || undefined,
        date: new Date(formData.date),
      })

      if (result.success) {
        router.push('/transactions')
        router.refresh()
      } else {
        alert(result.error || 'Failed to create transaction')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to create transaction')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4">
      {/* Type Selector Pills */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, type: 'INCOME', category: '' })}
          className={`p-4 rounded-lg font-semibold text-white transition-all ${
            formData.type === 'INCOME'
              ? 'bg-green-600 shadow-lg scale-105'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          <span className="text-lg">↓</span> Income
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, type: 'EXPENSE', category: '' })}
          className={`p-4 rounded-lg font-semibold text-white transition-all ${
            formData.type === 'EXPENSE'
              ? 'bg-red-600 shadow-lg scale-105'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          <span className="text-lg">↑</span> Expense
        </button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-semibold text-gray-700">Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">₹</span>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            required
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            placeholder="0.00"
            className="pl-8 h-14 text-xl font-semibold border-2 border-[#1976D2] focus:border-[#1976D2] rounded-lg"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" className="text-sm font-semibold text-gray-700">Date</Label>
        <Input
          id="date"
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-semibold text-gray-700">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
          required
        >
          <SelectTrigger id="category" className="h-12">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 text-center">
                No categories available for {formData.type.toLowerCase()}
              </div>
            ) : (
              filteredCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add a note about this transaction..."
          rows={3}
          className="resize-none"
        />
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full h-12 bg-[#1976D2] hover:bg-blue-700 text-white font-semibold text-lg rounded-lg shadow-md"
      >
        {isLoading ? 'Saving...' : 'Save Transaction'}
      </Button>
    </form>
  )
}
