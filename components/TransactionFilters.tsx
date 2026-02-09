'use client'

import { Category } from '@/types'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface TransactionFiltersProps {
  categories: Category[]
  currentFilters: {
    type?: string
    category?: string
    startDate?: Date
    endDate?: Date
  }
}

export default function TransactionFilters({ categories, currentFilters }: TransactionFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [type, setType] = useState(currentFilters.type || 'ALL')
  const [category, setCategory] = useState(currentFilters.category || 'ALL')
  const [startDate, setStartDate] = useState(
    currentFilters.startDate ? currentFilters.startDate.toISOString().split('T')[0] : ''
  )
  const [endDate, setEndDate] = useState(
    currentFilters.endDate ? currentFilters.endDate.toISOString().split('T')[0] : ''
  )

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (type && type !== 'ALL') params.set('type', type)
    else params.delete('type')

    if (category && category !== 'ALL') params.set('category', category)
    else params.delete('category')

    if (startDate) params.set('startDate', startDate)
    else params.delete('startDate')

    if (endDate) params.set('endDate', endDate)
    else params.delete('endDate')

    router.push(`/transactions?${params.toString()}`)
  }

  const clearFilters = () => {
    setType('ALL')
    setCategory('ALL')
    setStartDate('')
    setEndDate('')
    router.push('/transactions')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label className="text-gray-700">Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All types</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700">Start Date</Label>
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700">End Date</Label>
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <div className="col-span-full flex gap-2 justify-end">
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
        <Button onClick={applyFilters} className="bg-[#1976D2] hover:bg-blue-700 text-white">
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
