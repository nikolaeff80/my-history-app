'use client';

import { createClient } from '@/utils/supabase-client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Quiz() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = params.lessonId;

  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchQuestions() {
      if (!lessonId) return;
      const { data } = await supabase.from('questions').select('*').eq('lesson_id', lessonId).order('order_index');
      setQuestions(data || []);
    }
    fetchQuestions();
  }, [lessonId]);

  const handleAnswer = (index: number) => {
    if (index === questions[current].correct_answer) {
      setScore(score + 1);
    }
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  if (!lessonId) return <p>Загрузка...</p>;
  if (questions.length === 0) return <p>Нет вопросов для этой викторины. Добавьте их в Supabase.</p>;

  if (finished) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-200">Викторина завершена!</h2>
        <p className="text-2xl mb-8 text-gray-500">Ваш результат: {score} из {questions.length}</p>
        <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded inline-block hover:bg-blue-700">
          ← Вернуться к эпохам
        </Link>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-200">{q.question_text}</h2>
      <div className="grid grid-cols-1 gap-4">
        {q.options.map((opt: string, i: number) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className="bg-white text-gray-900 p-6 rounded shadow hover:shadow-lg hover:bg-gray-50 transition text-left text-lg"
          >
            {opt}
          </button>
        ))}
      </div>
      <p className="mt-8 text-gray-600">Вопрос {current + 1} из {questions.length}</p>
    </div>
  );
}