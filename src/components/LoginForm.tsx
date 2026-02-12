'use client';

import { createClient } from '@/utils/supabase-client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Проверить, залогирован ли пользователь при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  const signUp = async () => {
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Пожалуйста, заполните email и пароль' });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        // Обработка специфичных ошибок
        if (error.message.includes('429') || error.status === 429) {
          setMessage({ type: 'error', text: 'Слишком много попыток. Подождите несколько минут.' });
        } else if (error.message.includes('already exists')) {
          setMessage({ type: 'error', text: 'Пользователь с этой почтой уже существует' });
        } else {
          setMessage({ type: 'error', text: error.message || 'Ошибка при регистрации' });
        }
      } else {
        setMessage({ type: 'success', text: 'Проверьте почту для подтверждения регистрации' });
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Неизвестная ошибка при регистрации' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Пожалуйста, заполните email и пароль' });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        setMessage({ type: 'error', text: error.message || 'Ошибка при входе' });
      } else if (data.user) {
        // Успешный вход - показать приветствие с именем
        const userName = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'пользователь';
        setUser(data.user);
        setIsAuthenticated(true);
        setMessage({ type: 'success', text: `Здравствуй, ${userName}!` });
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Неизвестная ошибка при входе' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      
      if (error) {
        setMessage({ type: 'error', text: error.message || 'Ошибка при входе через Google' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Неизвестная ошибка' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-96">
      <style>{`
        @keyframes buttonPress {
          0% { transform: translateY(0px); }
          50% { transform: translateY(2px); }
          100% { transform: translateY(0px); }
        }
        
        .btn-pressed:active {
          animation: buttonPress 0.2s ease-in-out;
        }
      `}</style>

      {/* Экран приветствия после входа */}
      {isAuthenticated && user ? (
        <div className="flex flex-col gap-4 items-center p-6 border rounded-lg bg-blue-50">
          <div className="text-2xl font-bold text-center text-blue-700">
            Здравствуй, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
          </div>
          <p className="text-gray-600 text-center">Добро пожаловать в приложение</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-pressed w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition-colors duration-200"
          >
            Перейти в дашбоард
          </button>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setUser(null);
              supabase.auth.signOut();
            }}
            className="btn-pressed w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded transition-colors duration-200"
          >
            Выход
          </button>
        </div>
      ) : (
        <>
          {/* Форма входа */}
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <input 
            type="password" 
            placeholder="Пароль" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          {message && (
            <div className={`p-3 rounded text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
              {message.text}
            </div>
          )}
          <button 
            onClick={signUp} 
            className="btn-pressed bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? '⏳ Загрузка...' : '✏️ Регистрация'}
          </button>
          <button 
            onClick={signIn} 
            className="btn-pressed bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? '⏳ Загрузка...' : '🔑 Вход'}
          </button>
          <button 
            onClick={signInGoogle} 
            className="btn-pressed bg-gray-600 hover:bg-gray-700 text-white py-3 rounded font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? '⏳ Загрузка...' : '🔐 Вход через Google'}
          </button>
        </>
      )}
    </div>
  );
}