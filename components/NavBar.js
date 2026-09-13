'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const pathname = usePathname()
  const tabs = [
    { href: '/learn', label: 'Learn' },
    { href: '/simulator', label: 'Simulator' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ]

  return (
    <nav className="flex justify-center gap-2 bg-[#131C30] border-b border-[#263355] p-3">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`px-4 py-2 rounded-lg text-sm font-bold ${
            pathname === tab.href
              ? 'bg-[#7B6CF6] text-white'
              : 'text-[#8A93AE]'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}