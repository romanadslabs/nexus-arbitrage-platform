'use client'

import React from 'react'
import SimpleLayout from '@/components/ui/SimpleLayout'
import UserGuide from '@/components/ui/UserGuide'

export default function PresentationPage() {
  return (
    <SimpleLayout>
      <div className="max-w-7xl mx-auto">
        {/* Presentation Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-4">
                🎯 Презентація Nexus Platform
              </h1>
              <p className="text-xl text-purple-100 mb-6">
                Інтелектуальна арбітражна платформа нового покоління
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">AI-Driven</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">Автоматизація</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">Масштабування</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">Аналітика</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            🏗️ Архітектура платформи
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Робочі простори
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Організація роботи в командах та проектах з розподілом ролей та прав доступу.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Особистий простір</li>
                <li>• Командний простір</li>
                <li>• Проектний простір</li>
                <li>• Система ролей</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Управління аккаунтами
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Централізоване управління рекламними аккаунтами з безпечним зберіганням даних.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Google Ads</li>
                <li>• Facebook Ads</li>
                <li>• TikTok Ads</li>
                <li>• Безпечне зберігання</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Кампанії та оптимізація
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Створення та автоматична оптимізація рекламних кампаній з використанням AI.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• AI оптимізація</li>
                <li>• A/B тестування</li>
                <li>• Автоматичні правила</li>
                <li>• Предиктивна аналітика</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Features Demo */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            ✨ Ключові можливості
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">🤖</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    AI Автоматизація
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Штучний інтелект автоматично аналізує дані та оптимізує кампанії для максимізації ROI.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Автоматична оптимізація ставок</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Розумний таргетинг аудиторії</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Предиктивна аналітика</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">📊</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Розширена аналітика
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Детальні звіти та візуалізація даних для прийняття обґрунтованих рішень.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Реальний час моніторинг</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Інтерактивні дашборди</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Експорт звітів</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">🌐</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Масштабованість
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Легко масштабуйте ваш бізнес з підтримкою багатьох аккаунтів та кампаній.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Необмежена кількість аккаунтів</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Командна робота</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">API інтеграції</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">🔒</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Безпека та надійність
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Максимальний рівень безпеки для захисту ваших даних та аккаунтів.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Шифрування даних</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Двофакторна автентифікація</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Регулярні бекапи</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Guide */}
        <div className="mb-8">
          <UserGuide
            title="Як почати роботу з платформою"
            description="Покрокова інструкція для швидкого старту"
            steps={[
              {
                title: "Реєстрація та налаштування",
                description: "Створіть обліковий запис та налаштуйте базові параметри",
                icon: "👤"
              },
              {
                title: "Підключення рекламних аккаунтів",
                description: "Додайте ваші Google Ads, Facebook Ads та інші рекламні аккаунти",
                icon: "🔗"
              },
              {
                title: "Створення першої кампанії",
                description: "Налаштуйте рекламну кампанію з використанням AI-помічника",
                icon: "🚀"
              },
              {
                title: "Моніторинг та оптимізація",
                description: "Відстежуйте результати та дозвольте AI оптимізувати кампанію",
                icon: "📈"
              }
            ]}
            tips={[
              {
                title: "Почніть з малого",
                content: "Створіть тестову кампанію з невеликим бюджетом для ознайомлення з платформою",
                type: "info"
              },
              {
                title: "Використовуйте AI-поради",
                content: "AI аналізує ринок та надає рекомендації для покращення результатів",
                type: "success"
              },
              {
                title: "Регулярно перевіряйте звіти",
                content: "Аналізуйте звіти щодня для своєчасного виявлення проблем та можливостей",
                type: "warning"
              }
            ]}
          />
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-8 border border-green-200 dark:border-green-800 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 Готові почати?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Приєднуйтесь до тисяч успішних арбітражників, які вже використовують Nexus Platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/accounts"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔐 Підключити аккаунт
            </a>
            <a
              href="/workspaces"
              className="inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              🏢 Створити робочий простір
            </a>
          </div>
        </div>
      </div>
    </SimpleLayout>
  )
} 