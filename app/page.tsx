'use client'

import { useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState('')

  function handleClick() {
    setMessage('🔥 Today’s Drop: BASE / Free Mint / 0.002 ETH')
  }

  return (
    <main style={{ padding: 40, fontFamily: 'system-ui' }}>
      <h1>🚀 DropSignal</h1>
      <p>Daily onchain drops. Signal &gt; Noise.</p>

      <button
        onClick={handleClick}
        style={{
          padding: '12px 20px',
          borderRadius: 20,
          border: 'none',
          background: '#e5e7eb',
          fontSize: 16,
          cursor: 'pointer'
        }}
      >
        Mint Today
      </button>

      {message && (
        <div style={{ marginTop: 20 }}>
          <strong>{message}</strong>
        </div>
      )}
    </main>
  )
}