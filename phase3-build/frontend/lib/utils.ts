import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return formatDate(date)
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  if (score >= 40) return 'text-orange-600'
  return 'text-red-600'
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-100'
  if (score >= 60) return 'bg-yellow-100'
  if (score >= 40) return 'bg-orange-100'
  return 'bg-red-100'
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent':
    case 'critical':
      return 'text-red-600 bg-red-100'
    case 'high':
      return 'text-orange-600 bg-orange-100'
    case 'medium':
      return 'text-yellow-600 bg-yellow-100'
    case 'low':
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'converted':
      return 'text-green-600 bg-green-100'
    case 'qualified':
      return 'text-blue-600 bg-blue-100'
    case 'contacted':
      return 'text-yellow-600 bg-yellow-100'
    case 'new':
      return 'text-purple-600 bg-purple-100'
    case 'lost':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function calculateResponseTime(createdAt: Date, firstContact?: Date): number {
  if (!firstContact) return -1
  return Math.floor((firstContact.getTime() - createdAt.getTime()) / (1000 * 60))
}

export function isHighValueLead(estimatedValue: number): boolean {
  return estimatedValue >= 1000
}

export function generateLeadScore(lead: {
  estimatedValue: number;
  source: string;
  responseTime?: number;
  serviceType: string;
}): number {
  let score = 0

  // Value scoring (40 points max)
  if (lead.estimatedValue >= 5000) score += 40
  else if (lead.estimatedValue >= 2000) score += 30
  else if (lead.estimatedValue >= 1000) score += 20
  else if (lead.estimatedValue >= 500) score += 10

  // Source scoring (20 points max)
  switch (lead.source) {
    case 'referral':
      score += 20
      break
    case 'website':
      score += 15
      break
    case 'social_media':
      score += 10
      break
    case 'cold_outreach':
      score += 5
      break
  }

  // Response time scoring (20 points max)
  if (lead.responseTime !== undefined) {
    if (lead.responseTime <= 5) score += 20
    else if (lead.responseTime <= 15) score += 15
    else if (lead.responseTime <= 60) score += 10
    else if (lead.responseTime <= 240) score += 5
  }

  // Service type scoring (20 points max)
  switch (lead.serviceType) {
    case 'corporate':
      score += 20
      break
    case 'wedding':
      score += 15
      break
    case 'special_event':
      score += 10
      break
    case 'airport':
      score += 5
      break
  }

  return Math.min(100, score)
}