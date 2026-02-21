'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createHabit } from '@/lib/actions/habits'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Indigo', value: '#6366f1' },
]

const ICONS = ['📌', '💪', '🏃', '📚', '💧', '🧘', '🎯', '✅', '⭐', '🔥', '💯', '🎨', '🎵', '🍎', '💼', '🏠']

export default function HabitForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    target: 1,
    color: '#3b82f6',
    icon: '📌',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createHabit(formData)

      if (result.success) {
        router.push('/habits')
        router.refresh()
      } else {
        alert(result.error || 'Failed to create habit')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to create habit')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
          Habit Name *
        </Label>
        <Input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Drink 8 glasses of water"
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
          Description (Optional)
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Why this habit matters to you..."
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="frequency" className="text-sm font-semibold text-gray-700">
            Frequency
          </Label>
          <Select
            value={formData.frequency}
            onValueChange={(value) => setFormData({ ...formData, frequency: value })}
          >
            <SelectTrigger id="frequency" className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target" className="text-sm font-semibold text-gray-700">
            Target
          </Label>
          <Input
            id="target"
            type="number"
            min="1"
            value={formData.target}
            onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) })}
            className="h-12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Color</Label>
        <div className="grid grid-cols-8 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setFormData({ ...formData, color: color.value })}
              className={`w-10 h-10 rounded-lg transition-all ${
                formData.color === color.value
                  ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Icon</Label>
        <div className="grid grid-cols-8 gap-2">
          {ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setFormData({ ...formData, icon })}
              className={`w-10 h-10 rounded-lg text-2xl flex items-center justify-center transition-all ${
                formData.icon === icon
                  ? 'bg-gray-200 ring-2 ring-offset-2 ring-gray-900 scale-110'
                  : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t space-y-3">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-[#1976D2] hover:bg-blue-700 text-white font-semibold text-lg"
        >
          {isLoading ? 'Creating...' : 'Create Habit'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="w-full h-12"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
