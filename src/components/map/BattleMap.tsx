'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Slider from 'rc-slider'
import Tooltip from 'rc-tooltip'
import 'rc-slider/assets/index.css'
// 'rc-tooltip/assets/bootstrap.css' — опционально, если нужны дополнительные стили тултипа

const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false })

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
  const [yearRange, setYearRange] = useState<[number, number]>([1000, 1900])

  useEffect(() => {
    const from = yearRange?.[0]
    const to = yearRange?.[1]
    if (typeof from !== 'number' || typeof to !== 'number') {
      console.warn('invalid yearRange, skipping fetch', yearRange)
      setBattles([])
      return
    }

    const controller = new AbortController()
    fetch(`/api/battles?from=${from}&to=${to}`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`API error ${res.status}`)
        return res.json()
      })
      .then(data => setBattles(Array.isArray(data) ? data : []))
      .catch(err => {
        if (err && (err.name === 'AbortError' || err.message === 'The user aborted a request.')) {
          // fetch was aborted by cleanup (common when slider changes quickly) — ignore
          return
        }
        console.error('failed to fetch battles', err)
        setBattles([])
      })

    return () => controller.abort()
  }, [yearRange])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold mb-2">Выберите период</h2>
        <Slider
          range
          min={1000}
          max={1900}
          value={yearRange}
          onChange={val => {
            if (Array.isArray(val)) setYearRange(val as [number, number])
            else setYearRange([Number(val), Number(val)])
          }}
          allowCross={false}
          handleRender={(node, props) => (
            <Tooltip
              prefixCls="rc-slider-tooltip" // используем префикс из стилей rc-slider для одинакового вида
              overlay={`${props.value}`}
              visible={props.dragging} // тултип видно только при перетаскивании (как в большинстве слайдеров)
              placement="top"
            >
              {node}
            </Tooltip>
          )}
        />
        <div className="flex justify-between mt-1 text-sm">
          <span>{yearRange[0]}</span>
          <span>{yearRange[1]}</span>
        </div>
      </div>

      <LeafletMap battles={battles} />
    </div>
  )
}