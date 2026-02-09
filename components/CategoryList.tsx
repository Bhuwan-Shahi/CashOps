'use client'

import { Category, TransactionType } from '@/types'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteCategory } from '@/lib/actions/categories'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface CategoryListProps {
  categories: Category[]
  type: TransactionType
}

export default function CategoryList({ categories, type }: CategoryListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    setDeletingId(id)
    const result = await deleteCategory(id)
    if (result.success) {
      router.refresh()
    } else {
      alert('Failed to delete category')
    }
    setDeletingId(null)
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No {type.toLowerCase()} categories yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            {category.color && (
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
            )}
            <span className="font-medium text-gray-800">{category.name}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(category.id)}
            disabled={deletingId === category.id}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
