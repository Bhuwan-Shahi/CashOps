'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createWishlistItem } from '@/lib/actions/wishlist'
import { WishlistType } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function WishlistForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    amount: 0,
    type: 'GOAL' as WishlistType,
    person: '',
    dueDate: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createWishlistItem({
        title: formData.title,
        amount: Number(formData.amount),
        type: formData.type,
        person: formData.person || undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        notes: formData.notes || undefined,
      })

      if (result.success) {
        router.push('/wishlist')
        router.refresh()
      } else {
        alert(result.error || 'Failed to create item')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to create item')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-gray-700">Title</Label>
        <Input
          id="title"
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Save for vacation, Pay credit card"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" className="text-gray-700">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value as WishlistType })}
        >
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GOAL">Goal</SelectItem>
            <SelectItem value="DEBT_OWED">Debt Owed (Someone owes me)</SelectItem>
            <SelectItem value="DEBT_OWING">Debt Owing (I owe someone)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount" className="text-gray-700">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          required
          value={formData.amount || ''}
          onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="person" className="text-gray-700">Person (Optional)</Label>
        <Input
          id="person"
          type="text"
          value={formData.person}
          onChange={(e) => setFormData({ ...formData, person: e.target.value })}
          placeholder="Name of person involved"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate" className="text-gray-700">Due Date (Optional)</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-gray-700">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any additional details..."
          rows={3}
        />
      </div>

      <Button 
        type="submit" 
        disabled={isLoading || !formData.title}
        className="w-full h-12 bg-[#1976D2] hover:bg-blue-700 text-white font-semibold"
      >
        {isLoading ? 'Creating...' : 'Create Item'}
      </Button>
    </form>
  )
}
