'use client'

// Generate a unique device ID
export function generateDeviceId(): string {
  return `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

// Get or create device ID
export function getDeviceId(): string {
  if (typeof window === 'undefined') return ''
  
  let deviceId = localStorage.getItem('cashops_device_id')
  
  if (!deviceId) {
    deviceId = generateDeviceId()
    localStorage.setItem('cashops_device_id', deviceId)
  }
  
  return deviceId
}

// Get user name from localStorage
export function getUserName(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('cashops_user_name')
}

// Set user name
export function setUserName(name: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('cashops_user_name', name)
}

// Check if this is first visit
export function isFirstVisit(): boolean {
  if (typeof window === 'undefined') return false
  return !localStorage.getItem('cashops_visited')
}

// Mark as visited
export function markVisited(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('cashops_visited', 'true')
}

// Get greeting based on time
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()
  
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  if (hour < 21) return 'Good Evening'
  return 'Good Night'
}
