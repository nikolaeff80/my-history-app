import { createSupabaseServerClient } from '@/utils/supabase-server';
import AdminForm from '@/components/AdminForm';

export default async function Admin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Защита: только владелец (замени на свой email)
  if (!user || user.email !== 'твой_email@example.com') {
    return <p>Доступ запрещён</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Админка</h1>
      <AdminForm />
      <p className="mt-8">Также используй Supabase Dashboard для полного управления таблицами.</p>
    </div>
  );
}