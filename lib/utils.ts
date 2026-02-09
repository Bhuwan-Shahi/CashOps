import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  
  // Format with Nepali number system (X,XX,XXX)
  const formatted = num.toFixed(2)
  const [integer, decimal] = formatted.split('.')
  
  // Nepali formatting: last 3 digits, then groups of 2
  let result = ''
  const len = integer.length
  
  if (len <= 3) {
    result = integer
  } else {
    const lastThree = integer.slice(-3)
    const remaining = integer.slice(0, -3)
    result = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
  }
  
  return `Rs.${result}.${decimal}`
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function exportToCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0] || {})
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header]
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value
    }).join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}
