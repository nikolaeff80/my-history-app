import { createSupabaseServerClient } from '@/utils/supabase-server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient();
  const { data: eras } = await supabase.from('eras').select('*').order('order_index');

  /* Fetch data */
  const { data: { user } } = await supabase.auth.getUser();

  // We need the count of lessons. 'count' option in select is better but for now let's just fetch IDs to be safe with existing types if any.
  // Actually, let's just fetch all lessons.
  const { data: lessons } = await supabase.from('lessons').select('id');
  const totalLessons = lessons?.length || 0;

  let progressPercentage = 0;
  if (user && totalLessons > 0) {
    const { data: progress } = await supabase.from('user_progress').select('lesson_id').eq('user_id', user.id).eq('completed', true);
    const completedCount = progress?.length || 0;
    progressPercentage = Math.round((completedCount / totalLessons) * 100);
  }

  return (
    <div className="min-h-screen bg-gray-300 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Заголовок по центру */}
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
          Эпохи
        </h1>

        {/* Прогресс бар */}
        <div className="mb-12 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between mb-2">
            <span className="text-lg font-medium text-gray-700">Твой прогресс</span>
            <span className="text-lg font-bold text-blue-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

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