'use client'

import React from 'react'

export default function TestDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Тестовий дашборд</h1>
      <p className="text-gray-600">Якщо ви бачите цю сторінку, то сервер працює правильно.</p>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Тестування API</h2>
        <button 
          onClick={async () => {
            try {
              const response = await fetch('/api/analytics/dashboard-stats');
              const data = await response.json();
              console.log('Dashboard stats:', data);
              alert('API працює! Перевірте консоль для деталей.');
            } catch (error) {
              console.error('API error:', error);
              alert('Помилка API: ' + error);
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Тестувати API статистики
        </button>
      </div>
    </div>
  )
} 