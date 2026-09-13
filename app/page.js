'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleContinue = async () => {
    const cleanName = username.trim().toLowerCase()
    if (!cleanName) {
      setError('Enter a username first.')
      return
    }
    setLoading(true)
    setError('')

    const { data: existing, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', cleanName)
      .maybeSingle()

    if (fetchError) {
      setError('Something went wrong. Try again.')
      setLoading(false)
      return
    }

    if (!existing) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ username: cleanName })

      if (insertError) {
        setError('Something went wrong creating your profile.')
        setLoading(false)
        return
      }
    }

    localStorage.setItem('bullish_username', cleanName)
    router.push('/learn')
  }

  return (
    <main className="min-h-screen bg-[#0B1220] flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-[#131C30] border border-[#263355] rounded-3xl p-8 text-center">
        <h1 className="text-3xl font-extrabold text-white mb-1">Bullish</h1>
        <p className="text-[#8A93AE] text-sm mb-6">
          Learn to trade. Practice with fake money. Track your progress.
        </p>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Pick a username"
          className="w-full bg-[#1A2540] border border-[#263355] rounded-xl px-4 py-3 text-white placeholder-[#8A93AE] mb-3 outline-none focus:border-[#7B6CF6]"
          onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
        />

        {error && <p className="text-[#FF6B6B] text-sm mb-3">{error}</p>}

        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full bg-[#7B6CF6] text-white font-bold rounded-xl py-3 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Start learning'}
        </button>

        <p className="text-[#8A93AE] text-xs mt-4">
          New here? This creates your profile. Used it before? Just type the same username to pick up where you left off.
        </p>
      </div>
    </main>
  )
}