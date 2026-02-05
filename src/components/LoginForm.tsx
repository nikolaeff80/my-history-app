'use client';

import { createClient } from '@/utils/supabase-client';
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const supabase = createClient();

  const signUp = async () => {
    await supabase.auth.signUp({ email, password });
  };

  const signIn = async () => {
    await supabase.auth.signInWithPassword({ email, password });
  };

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div className="flex flex-col gap-4 w-80">
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 border rounded" />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} className="p-3 border rounded" />
      <button onClick={signUp} className="bg-green-600 text-white py-3 rounded">Регистрация</button>
      <button onClick={signIn} className="bg-blue-600 text-white py-3 rounded">Вход</button>
      <button onClick={signInGoogle} className="bg-gray-600 text-white py-3 rounded">Вход через Google</button>
    </div>
  );
}