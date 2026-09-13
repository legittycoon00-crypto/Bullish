'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import { LESSONS } from '../../lib/lessons'
import NavBar from '../../components/NavBar'

export default function Learn() {
  const [profile, setProfile] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const username = localStorage.getItem('bullish_username')
    if (!username) {
      router.push('/')
      return
    }
    supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()
      .then(({ data }) => setProfile(data))
  }, [router])

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#0B1220] flex items-center justify-center text-[#8A93AE]">
        Loading...
      </main>
    )
  }

  const completed = profile.completed_lessons || []

  return (
    <main className="min-h-screen bg-[#0B1220]">
      <NavBar />
      <div className="max-w-md mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-white text-2xl font-extrabold">Foundations</h1>
            <p className="text-[#8A93AE] text-sm">Hi, {profile.username}</p>
          </div>
          <div className="flex gap-3 text-sm font-bold">
            <span className="text-orange-400">🔥 {profile.streak}</span>
            <span className="text-red-400">♥ {profile.hearts}</span>
            <span className="text-yellow-400">⭐ {profile.xp}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          {LESSONS.map((lesson, i) => {
            const isDone = completed.includes(lesson.id)
            const isUnlocked = i === 0 || completed.includes(LESSONS[i - 1].id)
            const bg = isDone ? 'bg-[#2FD48A]' : isUnlocked ? 'bg-[#7B6CF6]' : 'bg-[#1A2540]'

            return (
              <div key={lesson.id} className="flex flex-col items-center">
                {i > 0 && <div className="w-1 h-6 bg-[#263355]" />}
                <button
                  disabled={!isUnlocked}
                  onClick={() => router.push(`/lesson/${lesson.id}`)}
                  className={`w-16 h-16 rounded-full ${bg} flex items-center justify-center text-2xl border-b-4 border-black/20 disabled:opacity-50`}
                >
                  {isDone ? '✓' : isUnlocked ? '📖' : '🔒'}
                </button>
                <p className="text-white text-xs font-bold mt-2 text-center max-w-[120px]">{lesson.title}</p>
                <p className="text-[#8A93AE] text-[11px] text-center max-w-[140px] mb-2">{lesson.blurb}</p>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}