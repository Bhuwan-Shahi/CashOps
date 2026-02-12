import { getDashboardStats } from '@/lib/actions/analytics'
import { getTransactions } from '@/lib/actions/transactions'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowDown, ArrowUp, Share2 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import PersonalizedGreeting from '@/components/PersonalizedGreeting'

export default async function DashboardPage() {
  const [statsResult, transactionsResult] = await Promise.all([
    getDashboardStats(),
    getTransactions(),
  ])

  const stats = statsResult.success && statsResult.data ? statsResult.data : {
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    topCategories: [],
  }

  const transactions = transactionsResult.success ? transactionsResult.data : []
  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1976D2] text-white p-4 shadow-md">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <PersonalizedGreeting />
            <h1 className="text-2xl font-bold">CashOps</h1>
            <p className="text-sm text-blue-100">{format(new Date(), 'dd MMM yyyy')}</p>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl p-4 lg:p-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
          {/* Income Card */}
          <Card className="border-0 shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                  <ArrowDown className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">Income</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.monthlyIncome)}
              </div>
              <p className="text-xs text-gray-500 mt-1">This Month</p>
            </CardContent>
          </Card>

          {/* Expense Card */}
          <Card className="border-0 shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                  <ArrowUp className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm text-gray-600">Expense</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.monthlyExpenses)}
              </div>
              <p className="text-xs text-gray-500 mt-1">This Month</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Balance Card */}
        <Card className="border-0 shadow bg-[#1976D2] lg:col-span-1">
          <CardContent className="p-5">
            <p className="text-sm text-blue-100 mb-1">Current Balance</p>
            <div className="text-4xl font-bold text-white">
              {formatCurrency(stats.netBalance)}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
          <Link href="/transactions">
            <Button variant="ghost" size="sm" className="text-[#1976D2] hover:bg-blue-50">
              See All
            </Button>
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <Card className="border-0 shadow">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No transactions yet.</p>
              <Link href="/transactions/new">
                <Button className="mt-4 bg-[#1976D2] hover:bg-blue-700">
                  Add Your First Transaction
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map((transaction) => (
              <Card key={transaction.id} className="border-0 shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'INCOME' ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        {transaction.type === 'INCOME' ? (
                          <ArrowUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{transaction.category}</p>
                        {transaction.description && (
                          <p className="text-sm text-gray-500">{transaction.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(Number(transaction.amount)).replace('Rs.', 'Rs.')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(transaction.date), 'dd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 pt-4 max-w-2xl mx-auto lg:ml-auto lg:mr-[20%]">
          <Link href="/transactions/new?type=INCOME" className="w-full">
            <Button className="w-full h-14 bg-green-600 hover:bg-green-700 text-white shadow-lg">
              <div className="flex items-center justify-center">
                <ArrowUp className="h-5 w-5 mr-2" />
                Income
              </div>
            </Button>
          </Link>
          <Link href="/transactions/new?type=EXPENSE" className="w-full">
            <Button className="w-full h-14 bg-red-600 hover:bg-red-700 text-white shadow-lg">
              <div className="flex items-center justify-center">
                <ArrowDown className="h-5 w-5 mr-2" />
                Expense
              </div>
            </Button>
          </Link>
        </div>

        
      </div>
    </div>
  )
}
