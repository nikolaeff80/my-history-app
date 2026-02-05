import { createSupabaseServerClient } from '@/utils/supabase-server';
import Link from 'next/link';

export default async function Lesson({ params }: { params: Promise<{ eraId: string }> }) {
  const { eraId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: lessons } = await supabase.from('lessons').select('*').eq('era_id', eraId);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Уроки</h1>
      {lessons?.length === 0 ? (
        <p>Нет уроков в этой эпохе. Добавьте их в админке или Supabase.</p>
      ) : (
        lessons?.map((lesson) => (
          <div key={lesson.id} className="bg-white p-6 mb-6 rounded shadow">
            <h2 className="text-2xl font-semibold text-gray-900">{lesson.title}</h2>
            <p className="my-4 whitespace-pre-wrap text-gray-700">{lesson.content}</p>
            <Link href={`/quiz/${lesson.id}`} className="bg-blue-600 text-white px-4 py-2 rounded inline-block hover:bg-blue-700">
              Пройти викторину
            </Link>
          </div>
        ))
      )}
      <Link href="/dashboard" className="mt-8 inline-block text-blue-600 hover:underline">
        ← Назад к эпохам
      </Link>
    </div>
  );
}