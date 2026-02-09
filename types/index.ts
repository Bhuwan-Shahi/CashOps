import { Transaction, Category, WishlistItem, TransactionType, WishlistType, WishlistStatus } from '@prisma/client'

export type { Transaction, Category, WishlistItem, TransactionType, WishlistType, WishlistStatus }

export interface TransactionFormData {
  type: TransactionType
  amount: number
  category: string
  description?: string
  date: Date
}

export interface CategoryFormData {
  name: string
  type: TransactionType
  color?: string
}

export interface WishlistFormData {
  title: string
  amount: number
  type: WishlistType
  person?: string
  dueDate?: Date
  notes?: string
}

export interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  topCategories: Array<{
    category: string
    amount: number
    percentage: number
  }>
}

export interface ChartData {
  name: string
  value: number
  date?: string
}

export interface FilterOptions {
  startDate?: Date
  endDate?: Date
  type?: TransactionType
  category?: string
}
