'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import { INITIAL_STOCKS, STARTING_CASH } from '../../lib/stocks'
import NavBar from '../../components/NavBar'

const fmt = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Simulator() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [holdings, setHoldings] = useState([])
  const [stocks, setStocks] = useState(INITIAL_STOCKS)
  const [activeStock, setActiveStock] = useState(null)
  const [side, setSide] = useState('buy')
  const [orderType, setOrderType] = useState('market')
  const [qty, setQty] = useState('1')
  const [limitPrice, setLimitPrice] = useState('')
  const [message, setMessage] = useState('')

  const loadData = async (username) => {
    const { data: profileData } = await supabase.from('profiles').select('*').eq('username', username).single()
    setProfile(profileData)
    const { data: holdingsData } = await supabase.from('holdings').select('*').eq('profile_id', profileData.id)
    setHoldings(holdingsData || [])
  }

  useEffect(() => {
    const username = localStorage.getItem('bullish_username')
    if (!username) {
      router.push('/')
      return
    }
    loadData(username)
  }, [router])

  useEffect(() => {
    const id = setInterval(() => {
      setStocks((prev) =>
        prev.map((s) => {
          const vol = s.volatile ? 0.02 : 0.007
          const change = (Math.random() - 0.48) * vol
          return { ...s, prevPrice: s.price, price: Math.max(1, s.price * (1 + change)) }
        })
      )
    }, 2200)
    return () => clearInterval(id)
  }, [])

  if (!profile) {
    return <main className="min-h-screen bg-[#0B1220] text-[#8A93AE] flex items-center justify-center">Loading...</main>
  }

  const unlocked = profile.unlocked || ['market']
  const holdingsValue = holdings.reduce((sum, h) => {
    const s = stocks.find((x) => x.symbol === h.symbol)
    return sum + (s ? s.price * h.qty : 0)
  }, 0)
  const total = profile.cash + holdingsValue
  const pnl = total - STARTING_CASH
  const pnlPct = (pnl / STARTING_CASH) * 100

  const openTrade = (stock) => {
    setActiveStock(stock)
    setSide('buy')
    setOrderType('market')
    setQty('1')
    setLimitPrice(stock.price.toFixed(2))
    setMessage('')
  }

  const submitTrade = async () => {
    const qtyNum = parseInt(qty || '0', 10)
    const execPrice = orderType === 'limit' ? parseFloat(limitPrice || '0') : activeStock.price
    const cost = qtyNum * execPrice
    const existingHolding = holdings.find((h) => h.symbol === activeStock.symbol)

    if (qtyNum <= 0) return

    if (side === 'buy' && cost > profile.cash) {
      setMessage('Not enough cash for that order.')
      return
    }
    if (side === 'sell' && (!existingHolding || existingHolding.qty < qtyNum)) {
      setMessage("You don't own that many shares.")
      return
    }

    if (side === 'buy') {
      const newCash = profile.cash - cost
      await supabase.from('profiles').update({ cash: newCash }).eq('id', profile.id)

      if (existingHolding) {
        const newQty = existingHolding.qty + qtyNum
        const newAvg = (existingHolding.avg_price * existingHolding.qty + cost) / newQty
        await supabase.from('holdings').update({ qty: newQty, avg_price: newAvg }).eq('id', existingHolding.id)
      } else {
        await supabase.from('holdings').insert({
          profile_id: profile.id,
          symbol: activeStock.symbol,
          qty: qtyNum,
          avg_price: execPrice,
        })
      }
    } else {
      const newCash = profile.cash + cost
      await supabase.from('profiles').update({ cash: newCash, xp: profile.xp + 3 }).eq('id', profile.id)

      const newQty = existingHolding.qty - qtyNum
      if (newQty <= 0) {
        await supabase.from('holdings').delete().eq('id', existingHolding.id)
      } else {
        await supabase.from('holdings').update({ qty: newQty }).eq('id', existingHolding.id)
      }
    }

    setMessage(`${side === 'buy' ? 'Bought' : 'Sold'} ${qtyNum} ${activeStock.symbol} @ $${fmt(execPrice)}`)
    setTimeout(() => {
      setActiveStock(null)
      loadData(profile.username)
    }, 800)
  }

  return (
    <main className="min-h-screen bg-[#0B1220]">
      <NavBar />
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-white text-2xl font-extrabold mb-1">Your portfolio</h1>
        <p className="text-[#8A93AE] text-sm mb-5">Simulated trading. Fake money, real market behavior.</p>

        <div className="bg-[#1A2540] border border-[#263355] rounded-2xl p-5 mb-5">
          <p className="text-[#8A93AE] text-xs font-bold">TOTAL VALUE</p>
          <p className="text-white text-3xl font-extrabold my-1">${fmt(total)}</p>
          <p className={`text-sm font-bold ${pnl >= 0 ? 'text-[#2FD48A]' : 'text-[#FF6B6B]'}`}>
            {pnl >= 0 ? '▲' : '▼'} ${fmt(Math.abs(pnl))} ({pnlPct.toFixed(2)}%)
          </p>
          <div className="flex gap-5 mt-3 text-xs text-[#8A93AE]">
            <span>Cash: <span className="text-white font-bold">${fmt(profile.cash)}</span></span>
            <span>Invested: <span className="text-white font-bold">${fmt(holdingsValue)}</span></span>
          </div>
        </div>

        <p className="text-[#8A93AE] text-xs font-bold mb-1">MARKETS</p>
        {stocks.map((s) => {
          const held = holdings.find((h) => h.symbol === s.symbol)
          const changed = s.prevPrice ? s.price - s.prevPrice : 0
          const up = changed >= 0
          return (
            <button
              key={s.symbol}
              onClick={() => openTrade(s)}
              className="w-full flex justify-between items-center py-3 border-b border-[#263355]"
            >
              <div className="text-left">
                <p className="text-white font-extrabold text-sm">{s.symbol}</p>
                <p className="text-[#8A93AE] text-xs">{s.name}{held ? ` · ${held.qty} sh` : ''}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-sm">${fmt(s.price)}</p>
                <p className={`text-xs font-bold ${up ? 'text-[#2FD48A]' : 'text-[#FF6B6B]'}`}>
                  {changed ? `${Math.abs((changed / s.prevPrice) * 100).toFixed(2)}%` : '—'}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {activeStock && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-20">
          <div className="w-full max-w-md bg-[#131C30] border-t border-[#263355] rounded-t-3xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white font-extrabold text-lg">{activeStock.symbol}</p>
                <p className="text-[#8A93AE] text-xs">{activeStock.name}</p>
              </div>
              <button onClick={() => setActiveStock(null)} className="text-[#8A93AE] text-2xl">✕</button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSide('buy')}
                className={`flex-1 py-2.5 rounded-xl font-extrabold text-sm border-2 ${side === 'buy' ? 'border-[#2FD48A] bg-[#2FD48A]/10 text-[#2FD48A]' : 'border-[#263355] bg-[#1A2540] text-[#8A93AE]'}`}
              >
                Buy
              </button>
              <button
                onClick={() => setSide('sell')}
                className={`flex-1 py-2.5 rounded-xl font-extrabold text-sm border-2 ${side === 'sell' ? 'border-[#FF6B6B] bg-[#FF6B6B]/10 text-[#FF6B6B]' : 'border-[#263355] bg-[#1A2540] text-[#8A93AE]'}`}
              >
                Sell
              </button>
            </div>

            <p className="text-[#8A93AE] text-xs font-bold mb-1">ORDER TYPE</p>
            <div className="flex gap-2 mb-1">
              <button
                onClick={() => setOrderType('market')}
                className={`flex-1 py-2.5 rounded-xl font-extrabold text-sm border-2 ${orderType === 'market' ? 'border-[#7B6CF6] bg-[#7B6CF6]/10 text-[#7B6CF6]' : 'border-[#263355] bg-[#1A2540] text-[#8A93AE]'}`}
              >
                Market
              </button>
              <button
                onClick={() => unlocked.includes('limit') && setOrderType('limit')}
                disabled={!unlocked.includes('limit')}
                className={`flex-1 py-2.5 rounded-xl font-extrabold text-sm border-2 disabled:opacity-40 ${orderType === 'limit' ? 'border-[#7B6CF6] bg-[#7B6CF6]/10 text-[#7B6CF6]' : 'border-[#263355] bg-[#1A2540] text-[#8A93AE]'}`}
              >
                {!unlocked.includes('limit') ? '🔒 Limit' : 'Limit'}
              </button>
            </div>
            {!unlocked.includes('limit') && (
              <p className="text-[#8A93AE] text-xs mb-3">Complete "Limit orders" to unlock this.</p>
            )}

            {orderType === 'limit' && (
              <div className="mb-3">
                <p className="text-[#8A93AE] text-xs font-bold mb-1">LIMIT PRICE</p>
                <input
                  type="number"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="w-full bg-[#1A2540] border border-[#263355] rounded-xl px-4 py-3 text-white font-bold"
                />
              </div>
            )}

            <p className="text-[#8A93AE] text-xs font-bold mb-1">SHARES</p>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full bg-[#1A2540] border border-[#263355] rounded-xl px-4 py-3 text-white font-bold mb-4"
            />

            <button
              onClick={submitTrade}
              className={`w-full font-extrabold rounded-xl py-3 text-[#0B1220] ${side === 'buy' ? 'bg-[#2FD48A]' : 'bg-[#FF6B6B]'}`}
            >
              {side === 'buy' ? 'Buy' : 'Sell'} {activeStock.symbol}
            </button>

            {message && (
              <div className="bg-[#1A2540] border border-[#263355] rounded-xl p-3 text-center text-white text-sm mt-3">
                {message}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}