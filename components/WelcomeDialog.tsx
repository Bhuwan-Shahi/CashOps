'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isFirstVisit, markVisited, setUserName, getTimeBasedGreeting } from '@/lib/user-device'

export default function WelcomeDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [greeting] = useState(getTimeBasedGreeting())

  useEffect(() => {
    // Check if this is the first visit
    if (isFirstVisit()) {
      setOpen(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      setUserName(name.trim())
      markVisited()
      setOpen(false)
    }
  }

  const handleSkip = () => {
    markVisited()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-[#1976D2]">
            {greeting}! 👋
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Welcome to CashOps - Your Personal Finance Manager
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">What should we call you?</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center text-lg"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-[#1976D2] hover:bg-blue-700 text-white"
            >
              Get Started
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              className="w-full text-gray-600"
            >
              Skip for now
            </Button>
          </div>
        </form>

        <p className="text-xs text-center text-gray-500 pt-2">
          Your data stays on your device only 🔒
        </p>
      </DialogContent>
    </Dialog>
  )
}
