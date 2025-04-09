// components/ThemeToggle.tsx
'use client';

import { useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'} flex flex-col items-center justify-center transition-all duration-300`} 
         style={{ minHeight: '100vh' }}>
      <h1 className="text-3xl font-bold mb-6">
        {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </h1>
      <button
        onClick={() => setIsDark(!isDark)}
        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 
          ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
      >
        Switch to {isDark ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
}
