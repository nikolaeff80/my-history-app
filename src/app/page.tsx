import { createSupabaseServerClient } from '@/utils/supabase-server';
import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Интерактивное изучение истории</h1>
      {user ? (
        <Link href="/dashboard" className="text-xl bg-blue-600 text-white px-6 py-3 rounded">
          Перейти в дашборд
        </Link>
      ) : (
        <>
          <p className="text-lg mb-6">Зарегистрируйся или войди, чтобы начать</p>
          <LoginForm />
        </>
      )}
    </main>
  );
}