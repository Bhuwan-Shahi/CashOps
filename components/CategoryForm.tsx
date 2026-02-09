'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory } from '@/lib/actions/categories'
import { TransactionType } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CategoryForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    type: 'EXPENSE' as TransactionType,
    color: '#3b82f6',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createCategory({
        name: formData.name,
        type: formData.type,
        color: formData.color,
      })

      if (result.success) {
        router.push('/categories')
        router.refresh()
      } else {
        alert(result.error || 'Failed to create category')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to create category')
    } finally {
      setIsLoading(false)
    }
  }

  const colorOptions = [
    { value: '#3b82f6', label: 'Blue' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Orange' },
    { value: '#ef4444', label: 'Red' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#ec4899', label: 'Pink' },
    { value: '#06b6d4', label: 'Cyan' },
    { value: '#84cc16', label: 'Lime' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-700">Category Name</Label>
        <Input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Groceries, Salary, Rent"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" className="text-gray-700">Category Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value as TransactionType })}
        >
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="color" className="text-gray-700">Color</Label>
        <div className="flex gap-3">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, color: option.value })}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                formData.color === option.value
                  ? 'border-gray-900 dark:border-white scale-110'
                  : 'border-gray-300 hover:scale-105'
              }`}
              style={{ backgroundColor: option.value }}
              title={option.label}
            />
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isLoading || !formData.name} className="w-full h-12 bg-[#1976D2] hover:bg-blue-700 text-white font-semibold">
        {isLoading ? 'Creating...' : 'Create Category'}
      </Button>
    </form>
  )
}
