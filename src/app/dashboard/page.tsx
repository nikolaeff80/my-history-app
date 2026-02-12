import { createSupabaseServerClient } from '@/utils/supabase-server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  const { data: eras } = await supabase.from('eras').select('*').order('order_index');

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

        {/* Прогресс бар теперь показывается в профиле пользователя */}

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

        {/* Контролы страницы (без кнопки профиля/админки — они теперь в navbar) */}
      </div>
    </div>
  );
}