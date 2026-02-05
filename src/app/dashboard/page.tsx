import { createSupabaseServerClient } from '@/utils/supabase-server';
import Link from 'next/link';

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient();
  const { data: eras } = await supabase.from('eras').select('*').order('order_index');

  return (
    <div className="min-h-screen bg-gray-300 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Заголовок по центру */}
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">
          Эпохи
        </h1>

        {/* Вертикальный список эпох */}
        <div className="space-y-8">
          {eras?.map((era) => (
            <Link
              key={era.id}
              href={`/lesson/${era.id}`}
              className="block bg-white p-8 rounded-lg shadow hover:shadow-xl transition-shadow"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{era.title}</h2>
              <p className="text-lg text-gray-700">{era.description}</p>
            </Link>
          ))}
        </div>

        {/* Кнопка админки по центру */}
        <div className="mt-16 text-center">
          <Link
            href="/admin"
            className="inline-block bg-gray-700 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition"
          >
            Админка (только для тебя)
          </Link>
        </div>
      </div>
    </div>
  );
}