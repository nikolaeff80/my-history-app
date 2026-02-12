import { createSupabaseServerClient } from '@/utils/supabase-server';
import LoginForm from '@/components/LoginForm';
import EventTicker from '@/components/EventTicker';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Leaderboard: top 3 by xp (fallback to level if xp missing)
  const { data: leaders } = await supabase
    .from('user_profiles')
    .select('id, level, xp')
    .order('xp', { ascending: false })
    .limit(3);

  // Site news (single latest row expected)
  const { data: newsRows } = await supabase.from('site_news').select('*').order('created_at', { ascending: false }).limit(1);
  const news = newsRows && newsRows[0];

  // Hardcoded rotating messages (examples provided)
  const messages: string[] = [
    'user-12345 достиг второго уровня',
    'user-54321 получил звание Картограф',
    'user-56789 победил Квиз-босса',
    'user-98765 достиг ранга Магистр',
  ];

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">Интерактивное изучение истории</h1>

      {/* Leaderboard */}
      <section className="w-full max-w-3xl bg-bottom p-4 rounded shadow-2xl mb-6">
        <h2 className="text-xl font-semibold mb-4">Лидерборд — топ 3</h2>
        <ol className="space-y-3">
          {(leaders || []).map((l: any, idx: number) => (
            <li key={l.id} className="flex items-center gap-4">
              <div className="w-6">{idx + 1}.</div>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">👤</div>
              <div className="flex-1">
                <div className="font-medium">{`User ${String(l.id).slice(0,6)}`}</div>
                <div className="text-sm text-gray-500">@{`user_${String(l.id).slice(0,6)}`}</div>
              </div>
              <div className="text-sm text-gray-700">Lvl {l.level ?? 1}</div>
            </li>
          ))}
          {(!leaders || leaders.length === 0) && <li className="text-gray-500">Пока нет данных</li>}
        </ol>
      </section>

      {/* Event ticker */}
      <EventTicker messages={messages} />

      {/* News */}
      <section className="w-full max-w-3xl bg-bottom p-4 rounded shadow-2xl mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Новости</h2>
        </div>
        <div className="text-gray-700">
          {news ? (
            <div dangerouslySetInnerHTML={{ __html: news.content }} />
          ) : (
            <div className="text-gray-500">Нет новостей. Добавьте новость в Админке.</div>
          )}
        </div>
      </section>

      {!user && (
        <div className="w-full max-w-3xl">
          <p className="text-lg mb-4">Зарегистрируйся или войди, чтобы начать</p>
          <LoginForm />
        </div>
      )}
    </main>
  );
}