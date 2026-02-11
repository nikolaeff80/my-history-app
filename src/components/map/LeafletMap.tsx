'use client'

import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'

type Battle = {
  id: string
  title: string
  description: string
  year: number
  latitude: number
  longitude: number
  video_url?: string
}

type Props = {
  battles: Battle[]
}

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

export default function LeafletMap({ battles }: Props) {
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null)

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <MapContainer
          center={[55.7558, 37.6176]}
          zoom={6}
          style={{ height: '600px', width: '100%' }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {battles.map(b => (
            <Marker
              key={b.id}
              position={[b.latitude, b.longitude]}
              eventHandlers={{
                click: () => setSelectedBattle(b),
              }}
            />
          ))}
        </MapContainer>
      </div>

      <div className="w-80 bg-gray-900 p-4 shadow-md overflow-y-auto max-h-[600px]">
        {selectedBattle ? (
          <>
            <h3 className="font-bold text-lg">
              {selectedBattle.title} ({selectedBattle.year})
            </h3>
            <p className="mt-2">{selectedBattle.description}</p>
            {selectedBattle.video_url && (
              <iframe
                className="mt-2"
                width="100%"
                height="200"
                src={selectedBattle.video_url}
                allowFullScreen
              />
            )}
          </>
        ) : (
          <p>Выберите маркер на карте, чтобы увидеть детали</p>
        )}
      </div>
    </div>
  )
}
