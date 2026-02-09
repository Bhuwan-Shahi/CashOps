import { Suspense } from 'react'
import { getTransactions } from '@/lib/actions/transactions'
import { getCategories } from '@/lib/actions/categories'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Filter } from 'lucide-react'
import TransactionList from '@/components/TransactionList'
import TransactionFilters from '@/components/TransactionFilters'

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ type?: string; category?: string; startDate?: string; endDate?: string }>
}) {
  const params = await searchParams
  const filters = {
    type: params?.type as any,
    category: params?.category,
    startDate: params?.startDate ? new Date(params.startDate) : undefined,
    endDate: params?.endDate ? new Date(params.endDate) : undefined,
  }

  const [transactionsResult, categoriesResult] = await Promise.all([
    getTransactions(filters),
    getCategories(),
  ])

  const transactions = transactionsResult.data || []
  const categories = categoriesResult.data || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1976D2] text-white p-4 shadow-md">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-xl md:text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-blue-100">{transactions.length} Transactions</p>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-4xl space-y-4">
        {/* Add Transaction Button */}
        <Link href="/transactions/new" className="block">
          <Button className="w-full bg-[#1976D2] hover:bg-blue-700 text-white h-12 text-base font-semibold shadow-md">
            <Plus className="mr-2 h-5 w-5" />
            Add Transaction
          </Button>
        </Link>

        {/* Filters */}
        <Card className="border-0 shadow">
          <CardContent className="p-4">
            <Suspense fallback={<div>Loading filters...</div>}>
              <TransactionFilters categories={categories} currentFilters={filters} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="border-0 shadow">
          <CardContent className="p-0">
            <Suspense fallback={<div className="p-4">Loading transactions...</div>}>
              <TransactionList transactions={transactions} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
