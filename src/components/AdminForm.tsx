'use client';

import { createClient } from '@/utils/supabase-client';
import { useState } from 'react';

export default function AdminForm() {
  const [title, setTitle] = useState('');
  const supabase = createClient();

  const addEra = async () => {
    await supabase.from('eras').insert({ title, description: 'Описание', order_index: 999 });
    setTitle('');
  };

  return (
    <div className="flex flex-col gap-4 w-96">
      <input placeholder="Название эпохи" value={title} onChange={(e) => setTitle(e.target.value)} className="p-3 border rounded" />
      <button onClick={addEra} className="bg-green-600 text-white py-3 rounded">Добавить эпоху</button>
    </div>
  );
}