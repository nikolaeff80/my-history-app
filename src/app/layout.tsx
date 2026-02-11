import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'History Learning App',
  description: 'Интерактивное изучение истории',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-100 min-h-screen">
        
        {/* Navbar */}
        <header className="bg-white shadow-md">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            
            <Link href="/" className="text-xl font-bold text-gray-800">
              📚 History App
            </Link>

            <div className="flex gap-6">
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
