import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCategories } from '@/lib/actions/categories'
import { getTransaction } from '@/lib/actions/transactions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import TransactionForm from '@/components/TransactionForm'

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [transactionResult, categoriesResult] = await Promise.all([
    getTransaction(id),
    getCategories(),
  ])

  if (!transactionResult.success || !transactionResult.data) {
    notFound()
  }

  const transaction = transactionResult.data
  const categories = categoriesResult.data || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1976D2] text-white p-4 shadow-md">
        <div className="container mx-auto max-w-4xl flex items-center gap-4">
          <Link href="/transactions">
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">Edit Transaction</h1>
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
              <TransactionForm
                categories={categories}
                transaction={{
                  id: transaction.id,
                  type: transaction.type,
                  amount: Number(transaction.amount),
                  category: transaction.category,
                  description: transaction.description,
                  date: transaction.date,
                }}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
