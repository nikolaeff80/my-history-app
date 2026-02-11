'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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
  return (
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
        <Marker key={b.id} position={[b.latitude, b.longitude]}>
          <Popup>
            <h3 className="font-bold">
              {b.title} ({b.year})
            </h3>
            <p>{b.description}</p>

            {b.video_url && (
              <iframe
                width="250"
                height="150"
                src={b.video_url}
                allowFullScreen
              />
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
