import './globals.css'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/utils/supabase-server'

export const metadata = {
  title: 'History Learning App',
  description: 'Интерактивное изучение истории',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || '').toLowerCase().trim()
  const userEmail = (user?.email || (user as any)?.user_metadata?.email || '').toLowerCase().trim()
  const isAdmin = !!(user && adminEmail && userEmail === adminEmail)
  return (
    <html lang="ru">
      <body className="bg-gray-100 min-h-screen">
        
        {/* Navbar */}
        <header className="bg-white shadow-md">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            
            <Link href="/" className="text-xl font-bold text-gray-800">
              📚 History App
            </Link>

            <div className="flex gap-6 items-center">
              <Link
                href="/"
                className="text-gray-600 hover:text-black transition"
              >
                Главная
              </Link>

              <Link
                href="/map"
                className="text-gray-600 hover:text-black transition"
              >
                🗺 Карта событий
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-black transition"
              >
                🎓 Обучение
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="ml-4 inline-flex items-center bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                >
                  ⚙️ Админка
                </Link>
              )}
              {user && (
                <Link
                  href={`/profiles/${user.id}`}
                  className="ml-4 inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  👤 Мой профиль
                </Link>
              )}
            </div>

          </nav>
        </header>

        {/* Page Content */}
        <main className="max-w-6xl mx-auto p-6">
          {children}
        </main>

      </body>
    </html>
  )
}
