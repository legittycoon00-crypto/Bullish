'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import NavBar from '../../components/NavBar'

export default function Leaderboard() {
  const router = useRouter()
  const [rows, setRows] = useState([])
  const [me, setMe] = useState('')

  useEffect(() => {
    const username = localStorage.getItem('bullish_username')
    if (!username) {
      router.push('/')
      return
    }
    setMe(username)

    supabase
      .from('profiles')
      .select('username, xp, streak')
      .order('xp', { ascending: false })
      .limit(50)
      .then(({ data }) => setRows(data || []))
  }, [router])

  return (
    <main className="min-h-screen bg-[#0B1220]">
      <NavBar />
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-white text-2xl font-extrabold mb-1">Leaderboard</h1>
        <p className="text-[#8A93AE] text-sm mb-5">Top XP earners across Bullish.</p>

        <div className="bg-[#1A2540] border border-[#263355] rounded-2xl overflow-hidden">
          {rows.map((r, i) => (
            <div
              key={r.username}
              className={`flex justify-between items-center px-4 py-3 border-b border-[#263355] last:border-0 ${
                r.username === me ? 'bg-[#7B6CF6]/10' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[#8A93AE] font-bold text-sm w-5">{i + 1}</span>
                <span className="text-white font-bold text-sm">
                  {r.username}
                  {r.username === me && <span className="text-[#7B6CF6]"> (you)</span>}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-orange-400 font-bold">🔥 {r.streak}</span>
                <span className="text-yellow-400 font-bold">⭐ {r.xp}</span>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="text-[#8A93AE] text-sm p-4 text-center">No learners yet — be the first!</p>
          )}
        </div>
      </div>
    </main>
  )
}