import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
} 