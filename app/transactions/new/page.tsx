import { Suspense } from 'react'
import { getCategories } from '@/lib/actions/categories'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TransactionForm from '@/components/TransactionForm'

export default async function NewTransactionPage({
  searchParams,
}: {
  searchParams?: Promise<{ type?: string }>
}) {
  const params = await searchParams
  const initialType = params?.type === 'INCOME' ? 'INCOME' : params?.type === 'EXPENSE' ? 'EXPENSE' : undefined
  
  const categoriesResult = await getCategories()
  const categories = categoriesResult.data || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1976D2] text-white p-4 shadow-md">
        <div className="container mx-auto max-w-4xl flex items-center gap-4">
          <Link href="/transactions">
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Add Transaction</h1>
          </div>
          <Link href="/transactions">
            <Button variant="ghost" className="text-white hover:bg-blue-700">Cancel</Button>
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto p-4 max-w-4xl space-y-4">
        <Card className="border-0 shadow">
          <CardContent>
            <Suspense fallback={<div>Loading form...</div>}>
              <TransactionForm categories={categories} initialType={initialType} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
