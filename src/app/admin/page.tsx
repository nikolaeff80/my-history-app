import { createSupabaseServerClient } from '@/utils/supabase-server';
import AdminForm from '@/components/AdminForm';

export default async function Admin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL;

  // Admin check (ProtectedRoute layout уже проверил базовую авторизацию)
  if (!user || !user.email || user.email !== adminEmail) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-bold mb-2">Доступ запрещён</p>
        <p className="text-sm text-gray-500">Требуется администратор.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Админка</h1>
      <AdminForm />
      <p className="mt-8">Также используй Supabase Dashboard для полного управления таблицами.</p>
    </div>
  );
}