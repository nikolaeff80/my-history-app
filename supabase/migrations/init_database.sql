-- SQL скрипт для инициализации базы данных my-history-app
-- Выполните этот скрипт в Supabase Dashboard → SQL Editor

-- 1. Таблица epochs (эпохи)
CREATE TABLE IF NOT EXISTS eras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- 2. Таблица lessons (уроки)
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  era_id UUID NOT NULL REFERENCES eras(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- 3. Таблица questions (вопросы к викторинам)
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options TEXT[] NOT NULL, -- массив вариантов ответа
  correct_answer INTEGER NOT NULL, -- индекс правильного ответа (0-3)
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- 4. Таблица user_profiles (профили пользователей)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 5. Таблица achievements (достижения)
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- emoji или URL
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- 6. Таблица user_achievements (достижения пользователя)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- 7. Таблица user_progress (прогресс пользователя)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  score INTEGER, -- количество правильных ответов
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- 8. Таблица historical_battles (исторические битвы для карты)
CREATE TABLE IF NOT EXISTS historical_battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  year INTEGER NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  video_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_lessons_era_id ON lessons(era_id);
CREATE INDEX IF NOT EXISTS idx_questions_lesson_id ON questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_historical_battles_year ON historical_battles(year);

-- Создание функции для автоматического обновления updated_at в профиче пользователя
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для обновления updated_at
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- SQL функция для добавления XP (если нужна)
CREATE OR REPLACE FUNCTION add_xp(p_user UUID, p_xp INTEGER, p_reason TEXT DEFAULT NULL)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET xp = xp + p_xp
  WHERE id = p_user;
END;
$$ LANGUAGE plpgsql;

-- Функция для автоматического создания профиля при регистрации пользователя
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, level, xp, streak)
  VALUES (new.id, 1, 0, 0);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Триггер: создавать профиль при регистрации пользователя
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMIT;
