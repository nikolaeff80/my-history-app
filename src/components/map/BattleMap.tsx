'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
})

type Battle = {
  id: string
  title: string
  description: string
  year: number
  latitude: number
  longitude: number
  video_url?: string
}

export default function BattleMap() {
  const [battles, setBattles] = useState<Battle[]>([])
  const [from, setFrom] = useState(1000)
  const [to, setTo] = useState(1900)

  useEffect(() => {
    fetch(`/api/battles?from=${from}&to=${to}`)
      .then(res => res.json())
      .then(data => setBattles(data))
  }, [from, to])

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div>
          <label className="block text-sm">От</label>
          <input
            type="number"
            value={from}
            onChange={e => setFrom(Number(e.target.value))}
            className="border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block text-sm">До</label>
          <input
            type="number"
            value={to}
            onChange={e => setTo(Number(e.target.value))}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      <LeafletMap battles={battles} />
    </div>
  )
}
