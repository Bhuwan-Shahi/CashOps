import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import WishlistForm from '@/components/WishlistForm'

export default function NewWishlistPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1976D2] text-white p-4 shadow-md">
        <div className="container mx-auto max-w-4xl flex items-center gap-4">
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">New Wishlist Item</h1>
          </div>
          <Link href="/wishlist">
            <Button variant="ghost" className="text-white hover:bg-blue-700">Cancel</Button>
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto p-4 max-w-4xl space-y-4">
        <Card className="border-0 shadow">
          <CardContent className="pt-6">
            <WishlistForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
