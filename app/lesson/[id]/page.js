'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import { LESSONS } from '../../../lib/lessons'

export default function LessonPage() {
  const router = useRouter()
  const params = useParams()
  const lesson = LESSONS.find((l) => l.id === params.id)

  const [profile, setProfile] = useState(null)
  const [step, setStep] = useState(-1)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [hearts, setHearts] = useState(5)

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
      .then(({ data }) => {
        setProfile(data)
        setHearts(data.hearts)
      })
  }, [router])

  if (!lesson) {
    return <main className="min-h-screen bg-[#0B1220] text-white p-6">Lesson not found.</main>
  }
  if (!profile) {
    return <main className="min-h-screen bg-[#0B1220] text-[#8A93AE] flex items-center justify-center">Loading...</main>
  }

  const q = step >= 0 ? lesson.questions[step] : null

  const pick = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === q.correct) {
      setXpEarned((x) => x + 10)
    } else {
      setHearts((h) => Math.max(0, h - 1))
    }
  }

  const next = async () => {
    setSelected(null)
    setAnswered(false)

    if (step + 1 >= lesson.questions.length) {
      const newCompleted = [...new Set([...(profile.completed_lessons || []), lesson.id])]
      const newUnlocked = lesson.unlocks
        ? [...new Set([...(profile.unlocked || []), lesson.unlocks])]
        : profile.unlocked

      await supabase
        .from('profiles')
        .update({
          completed_lessons: newCompleted,
          unlocked: newUnlocked,
          xp: profile.xp + xpEarned + 15,
          streak: profile.streak + 1,
          hearts: hearts,
        })
        .eq('id', profile.id)

      router.push('/learn')
    } else {
      setStep(step + 1)
    }
  }

  return (
    <main className="min-h-screen bg-[#0B1220] flex justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => router.push('/learn')} className="text-[#8A93AE] text-2xl">✕</button>
          <span className="text-red-400 font-bold">♥ {hearts}</span>
        </div>

        {step === -1 ? (
          <div className="text-center flex flex-col items-center gap-4 mt-10">
            <div className="w-16 h-16 rounded-2xl bg-[#1A2540] flex items-center justify-center text-3xl">📖</div>
            <h1 className="text-white text-2xl font-extrabold">{lesson.title}</h1>
            <p className="text-[#8A93AE] text-sm">{lesson.blurb}</p>
            {lesson.unlocks && (
              <div className="bg-[#1A2540] border border-[#263355] rounded-full px-4 py-2 text-xs text-[#8A93AE] font-bold">
                ✨ Unlocks {lesson.unlocks} orders in the simulator
              </div>
            )}
            <button
              onClick={() => setStep(0)}
              className="w-full bg-[#7B6CF6] text-white font-extrabold rounded-xl py-3 mt-4"
            >
              Start lesson
            </button>
          </div>
        ) : (
          <div>
            <div className="h-2 rounded-full bg-[#1A2540] overflow-hidden mb-5">
              <div
                className="h-full bg-[#7B6CF6]"
                style={{ width: `${(step / lesson.questions.length) * 100}%` }}
              />
            </div>
            <h2 className="text-white text-lg font-extrabold mb-4">{q.q}</h2>

            {q.options.map((opt, i) => {
              let cls = 'block w-full text-left p-4 mb-2.5 rounded-xl border-2 font-semibold text-sm '
              if (answered && i === q.correct) cls += 'border-[#2FD48A] bg-[#2FD48A]/10 text-white'
              else if (answered && i === selected) cls += 'border-[#FF6B6B] bg-[#FF6B6B]/10 text-white'
              else cls += 'border-[#263355] bg-[#1A2540] text-white'

              return (
                <button key={i} className={cls} onClick={() => pick(i)} disabled={answered}>
                  {opt}
                </button>
              )
            })}

            {answered && (
              <div className="bg-[#1A2540] border border-[#263355] rounded-xl p-4 text-[#8A93AE] text-sm mt-2">
                {selected === q.correct ? '✓ Correct — ' : 'Not quite — '}
                {q.explain}
              </div>
            )}

            <button
              onClick={next}
              disabled={!answered}
              className="w-full bg-[#7B6CF6] text-white font-extrabold rounded-xl py-3 mt-5 disabled:opacity-40"
            >
              {step + 1 >= lesson.questions.length ? 'Finish lesson' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}