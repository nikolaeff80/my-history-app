import BattleMap from '@/components/map/BattleMap'

export default function MapPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Историческая карта битв и событий (1000–1900)
      </h1>

      <BattleMap />
    </div>
  )
}
