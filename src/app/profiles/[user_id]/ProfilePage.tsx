'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase-client'

interface UserProfile {
  id: string
  level: number
  xp: number
  streak: number
}

interface UserAchievement {
  achievements: {
    id: string
    icon: string
    title: string
  }
}

export default function ProfilePage() {
  const params = useParams<{ user_id: string }>()
  const userId = params?.user_id
  
  const supabase = createClient()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [achievements, setAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!userId) return

      try {
        console.log('Loading profile for userId:', userId)
        
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (profileError) {
          console.error('Profile error:', profileError)
          
          // PGRST116 = not found (this is expected if profile doesn't exist yet)
          if (profileError.code === 'PGRST116') {
            setError('Профиль не создан')
          } else {
            setError(`Ошибка загрузки: ${profileError.message}`)
          }
          setLoading(false)
          return
        }

        console.log('Profile loaded:', profileData)

        const { data: ach, error: achError } = await supabase
          .from('user_achievements')
          .select('achievements(*)')
          .eq('user_id', userId)

        if (achError) {
          console.error('Achievements error:', achError)
        }

        setProfile(profileData as UserProfile)
        setAchievements((ach || []) as unknown as UserAchievement[])
        setError(null)
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('Неизвестная ошибка при загрузке')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [userId, supabase])

  if (loading) return <div className="p-6 text-center">Загрузка профиля...</div>
  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
          <h2 className="text-xl font-bold text-yellow-800 mb-4">⚠️ {error}</h2>
          <p className="text-yellow-700 mb-4">
            Профиль не найден в базе данных. Для создания профиля выполните SQL запрос в Supabase Dashboard:
          </p>
          <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm mb-4 overflow-x-auto">
            <pre>{`INSERT INTO user_profiles (id, level, xp, streak, created_at)
VALUES (
  '${userId}',
  1,
  0,
  0,
  now()
);`}</pre>
          </div>
          <p className="text-yellow-700 text-sm">
            📍 Откройте <a href="https://supabase.com/dashboard" target="_blank" rel="noopener" className="underline">Supabase Dashboard</a> → 
            выберите проект → SQL Editor → вставьте запрос выше
          </p>
        </div>
      </div>
    )
  }
  if (!profile) return <div className="p-6 text-center">Профиль не найден</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Профиль</h1>

      <div className="bg-white p-4 rounded shadow">
        <p>Уровень: {profile.level}</p>
        <p>XP: {profile.xp}</p>
        <p>Серия: {profile.streak} дней</p>
      </div>

      <h2 className="mt-6 text-xl font-semibold">Достижения</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {achievements.map((a) => (
          <div
            key={a.achievements.id}
            className="bg-yellow-100 p-3 rounded shadow"
          >
            <div className="text-2xl">{a.achievements.icon}</div>
            <div>{a.achievements.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
