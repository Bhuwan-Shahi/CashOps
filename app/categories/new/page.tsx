import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CategoryForm from '@/components/CategoryForm'

export default function NewCategoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1976D2] text-white p-4 flex items-center gap-3">
        <Link href="/categories">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold">Add Category</h1>
      </div>

      {/* Form Card */}
      <div className="p-4">
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <CategoryForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
