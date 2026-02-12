"use client";

import React, { useEffect, useState } from 'react';

type Props = {
  messages: string[];
  interval?: number;
};

export default function EventTicker({ messages, interval = 6000 }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!messages || messages.length === 0) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, interval);
    return () => clearInterval(id);
  }, [messages, interval]);

  if (!messages || messages.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mb-4">
      <div className="bg-bottom p-3 rounded shadow-2xl ticker-container">
        <div
          className="text-sm text-gray-700 ticker-viewport"
          aria-live="polite"
        >
          <span
            key={index}
            className="ticker-item"
            style={{ ['--ticker-duration' as any]: `${interval}ms` }}
          >
            {messages[index]}
          </span>
        </div>
      </div>
    </div>
  );
}
