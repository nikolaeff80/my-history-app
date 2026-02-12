import { createSupabaseServerClient } from '@/utils/supabase-server';
import AdminForm from '@/components/AdminForm';

export default async function Admin() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const rawUserEmail = user.email || (user as any)?.user_metadata?.email;
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    const userEmail = (rawUserEmail || '').toLowerCase().trim();
    
    console.log('=== ADMIN PAGE DEBUG ===');
    console.log('Raw user.email:', user.email);
    console.log('Raw user_metadata.email:', (user as any)?.user_metadata?.email);
    console.log('Final userEmail:', userEmail);
    console.log('Final adminEmail:', adminEmail);
    console.log('Are they equal?', userEmail === adminEmail);
    console.log('!user:', !user);
    console.log('!userEmail:', !userEmail);
    console.log('userEmail !== adminEmail:', userEmail !== adminEmail);

    // Admin check (ProtectedRoute layout уже проверил базовую авторизацию)
    if (!user || !userEmail || userEmail !== adminEmail) {
      console.log('BLOCKED! Reason: !user =', !user, '| !userEmail =', !userEmail, '| userEmail !== adminEmail =', userEmail !== adminEmail);
      return (
        <div className="p-8 text-center">
          <p className="text-red-600 font-bold mb-2">Доступ запрещён</p>
          <p className="text-sm text-gray-500">Требуется администратор.</p>
        </div>
      );
    }

    console.log('✅ ADMIN CHECK PASSED! Rendering AdminForm...');

    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Админка</h1>
        <AdminForm />
        <p className="mt-8">Также используй Supabase Dashboard для полного управления таблицами.</p>
      </div>
    );
  } catch (error) {
    console.error('❌ ERROR in Admin page:', error);
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 font-bold mb-2">Ошибка</p>
        <p className="text-sm text-gray-500">{String(error)}</p>
      </div>
    );
  }
}