-- Создайте профиль для СУЩЕСТВУЮЩЕГО пользователя
-- Замените 'YOUR_USER_ID' на реальный ID пользователя

INSERT INTO user_profiles (id, level, xp, streak, created_at)
VALUES (
  '721f041b-68c6-427f-818f-be835b342ef2',  -- ID пользователя
  1,      -- Начальный уровень
  0,      -- Начальный XP
  0,      -- Начальная серия дней
  now()
);

-- Если нужно создать для нескольких пользователей одновременно:
-- INSERT INTO user_profiles (id, level, xp, streak, created_at)
-- SELECT id, 1, 0, 0, now()
-- FROM auth.users
-- WHERE id NOT IN (SELECT id FROM user_profiles);  -- Только для пользователей без профиля
