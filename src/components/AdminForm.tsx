'use client';

import { createClient } from '@/utils/supabase-client';
import { useEffect, useState } from 'react';

export default function AdminForm() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'eras' | 'lessons' | 'questions'>('eras');

  // Data
  const [eras, setEras] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);

  // Era Form
  const [eraTitle, setEraTitle] = useState('');

  // Lesson Form
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonEraId, setLessonEraId] = useState('');
  const [lessonOrder, setLessonOrder] = useState(1);

  // Question Form
  const [qText, setQText] = useState('');
  const [qLessonId, setQLessonId] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: e } = await supabase.from('eras').select('*').order('order_index');
    const { data: l } = await supabase.from('lessons').select('*').order('order_index');
    if (e) setEras(e);
    if (l) setLessons(l);
  };

  const addEra = async () => {
    if (!eraTitle) return alert('Введите название');
    const { error } = await supabase.from('eras').insert({
      title: eraTitle,
      description: 'Описание...',
      order_index: eras.length + 1
    });
    if (error) alert(error.message);
    else {
      setEraTitle('');
      fetchData();
      alert('Эпоха добавлена');
    }
  };

  const addLesson = async () => {
    if (!lessonTitle || !lessonEraId) return alert('Заполните поля');
    const { error } = await supabase.from('lessons').insert({
      title: lessonTitle,
      content: lessonContent,
      era_id: lessonEraId,
      order_index: lessonOrder
    });
    if (error) alert(error.message);
    else {
      setLessonTitle('');
      setLessonContent('');
      fetchData();
      alert('Урок добавлен');
    }
  };

  const addQuestion = async () => {
    if (!qText || !qLessonId) return alert('Заполните поля');
    const { error } = await supabase.from('questions').insert({
      lesson_id: qLessonId,
      question_text: qText,
      options: qOptions,
      correct_answer: qCorrect, // 0..3
      order_index: 99
    });
    if (error) alert(error.message);
    else {
      setQText('');
      setQOptions(['', '', '', '']);
      setQCorrect(0);
      alert('Вопрос добавлен');
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white p-6 rounded shadow">
      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6 pb-2">
        <button
          onClick={() => setActiveTab('eras')}
          className={`px-4 py-2 font-bold ${activeTab === 'eras' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Эпохи
        </button>
        <button
          onClick={() => setActiveTab('lessons')}
          className={`px-4 py-2 font-bold ${activeTab === 'lessons' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Уроки
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 font-bold ${activeTab === 'questions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Вопросы
        </button>
      </div>

      {/* Eras */}
      {activeTab === 'eras' && (
        <div className="space-y-4">
          <h2 className="text-xl text-gray-700 font-bold">Добавить Эпоху</h2>
          <input
            placeholder="Название эпохи"
            value={eraTitle}
            onChange={(e) => setEraTitle(e.target.value)}
            className="w-full p-2 color-gray-700 border rounded"
          />
          <button onClick={addEra} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Сохранить
          </button>

          <div className="mt-8">
            <h3 className="font-bold text-gray-700 mb-2">Существующие эпохи:</h3>
            <ul className="list-disc text-gray-500 pl-5">
              {eras.map(e => <li key={e.id}>{e.title}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Lessons */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Добавить Урок</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Эпоха</label>
            <select
              value={lessonEraId}
              onChange={(e) => setLessonEraId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Выберите эпоху...</option>
              {eras.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Название урока</label>
            <input
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Контент (Markup/Text)</label>
            <textarea
              value={lessonContent}
              onChange={(e) => setLessonContent(e.target.value)}
              className="w-full p-2 border rounded h-32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Порядковый номер</label>
            <input
              type="number"
              value={lessonOrder}
              onChange={(e) => setLessonOrder(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <button onClick={addLesson} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Добавить Урок
          </button>
        </div>
      )}

      {/* Questions */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Добавить Вопрос</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Урок</label>
            <select
              value={qLessonId}
              onChange={(e) => setQLessonId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Выберите урок...</option>
              {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Текст вопроса</label>
            <input
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Варианты ответов</label>
            {qOptions.map((opt, i) => (
              <input
                key={i}
                placeholder={`Вариант ${i + 1}`}
                value={opt}
                onChange={(e) => {
                  const newOpts = [...qOptions];
                  newOpts[i] = e.target.value;
                  setQOptions(newOpts);
                }}
                className="w-full p-2 border rounded mb-2"
              />
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Правильный ответ</label>
            <select
              value={qCorrect}
              onChange={(e) => setQCorrect(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {qOptions.map((_, i) => (
                <option key={i} value={i}>Вариант {i + 1}</option>
              ))}
            </select>
          </div>

          <button onClick={addQuestion} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Добавить Вопрос
          </button>
        </div>
      )}
    </div>
  );
}