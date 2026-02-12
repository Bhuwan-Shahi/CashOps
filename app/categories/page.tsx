import { Suspense } from 'react'
import { getCategories } from '@/lib/actions/categories'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'
import CategoryList from '@/components/CategoryList'

export default async function CategoriesPage() {
  const categoriesResult = await getCategories()
  const categories = categoriesResult.data || []

  const incomeCategories = categories.filter((c) => c.type === 'INCOME')
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1976D2] text-white p-4 shadow-md">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Categories</h1>
            <p className="text-sm text-blue-100">{categories.length} categories</p>
          </div>
          <Link href="/categories/new">
            <Button className="bg-blue-700 hover:bg-blue-800 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto p-4 lg:p-8 max-w-7xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-0 shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-green-600">Income Categories</span>
                <span className="text-sm text-gray-500">({incomeCategories.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
              <CategoryList categories={incomeCategories} type="INCOME" />
            </Suspense>
          </CardContent>
        </Card>

          <Card className="border-0 shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-red-600">Expense Categories</span>
                <span className="text-sm text-gray-500">({expenseCategories.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <CategoryList categories={expenseCategories} type="EXPENSE" />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
