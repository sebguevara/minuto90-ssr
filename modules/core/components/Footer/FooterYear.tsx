'use client'

import { Suspense } from 'react'

function YearContent() {
  const currentYear = new Date().getFullYear()
  return <>{currentYear}</>
}

export function FooterYear() {
  return (
    <Suspense fallback="2025">
      <YearContent />
    </Suspense>
  )
}