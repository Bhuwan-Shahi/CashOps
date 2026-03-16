import { Suspense } from 'react'
import { getTransactions } from '@/lib/actions/transactions'
import { getCategories } from '@/lib/actions/categories'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Download } from 'lucide-react'
import TransactionList from '@/components/TransactionList'
import TransactionFilters from '@/components/TransactionFilters'

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ type?: string; category?: string; startDate?: string; endDate?: string; page?: string }>
}) {
  const params = await searchParams
  const currentPage = Math.max(1, Number(params?.page ?? '1') || 1)
  const filters = {
    type: params?.type as any,
    category: params?.category,
    startDate: params?.startDate ? new Date(params.startDate) : undefined,
    endDate: params?.endDate ? new Date(params.endDate) : undefined,
    page: currentPage,
    pageSize: 20,
  }

  const [transactionsResult, categoriesResult] = await Promise.all([
    getTransactions(filters),
    getCategories(),
  ])

  const exportParams = new URLSearchParams()
  if (params?.type) exportParams.set('type', params.type)
  if (params?.category) exportParams.set('category', params.category)
  if (params?.startDate) exportParams.set('startDate', params.startDate)
  if (params?.endDate) exportParams.set('endDate', params.endDate)
  const exportHref = `/api/transactions/export${exportParams.toString() ? `?${exportParams.toString()}` : ''}`

  const buildPageHref = (page: number) => {
    const query = new URLSearchParams()
    if (params?.type) query.set('type', params.type)
    if (params?.category) query.set('category', params.category)
    if (params?.startDate) query.set('startDate', params.startDate)
    if (params?.endDate) query.set('endDate', params.endDate)
    query.set('page', String(page))
    return `/transactions?${query.toString()}`
  }

  const transactions = transactionsResult.data || []
  const pagination = transactionsResult.pagination
  const categories = categoriesResult.data || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1976D2] text-white p-4 shadow-md">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-xl md:text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-blue-100">{transactions.length} Transactions</p>
        </div>
      </div>

      <div className="container mx-auto p-4 lg:p-8 max-w-7xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link href="/transactions/new" className="block">
            <Button className="w-full bg-[#1976D2] hover:bg-blue-700 text-white h-12 text-base font-semibold shadow-md">
              <Plus className="mr-2 h-5 w-5" />
              Add Transaction
            </Button>
          </Link>
          <Link href={exportHref} className="block">
            <Button className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
              <Download className="mr-2 h-5 w-5" />
              Export CSV
            </Button>
          </Link>
        </div>

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

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between gap-3">
            {pagination.hasPreviousPage ? (
              <Link href={buildPageHref(pagination.page - 1)}>
                <Button variant="outline">Previous</Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>
                Previous
              </Button>
            )}

            <p className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </p>

            {pagination.hasNextPage ? (
              <Link href={buildPageHref(pagination.page + 1)}>
                <Button variant="outline">Next</Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>
                Next
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
