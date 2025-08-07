'use client'

import React, { useState } from 'react'
import { Database, Table, Link, Info, ChevronDown, ChevronRight, FileText, Users, CreditCard, Globe, Zap, TestTube } from 'lucide-react'

interface TableInfo {
  name: string
  id: string
  description: string
  fields: Array<{
    name: string
    type: string
    description: string
  }>
  icon: React.ReactNode
  color: string
}

export default function DataSourcesInfo() {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set())

  const toggleTable = (tableId: string) => {
    const newExpanded = new Set(expandedTables)
    if (newExpanded.has(tableId)) {
      newExpanded.delete(tableId)
    } else {
      newExpanded.add(tableId)
    }
    setExpandedTables(newExpanded)
  }

  const tables: TableInfo[] = [
    {
      name: 'Accounts',
      id: 'tblvuxRc27lD4W76C',
      description: 'Аккаунти на різних платформах з їх статусами та зв\'язками',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      fields: [
        { name: 'Account ID', type: 'singleLineText', description: 'Унікальний ідентифікатор аккаунта' },
        { name: 'Platform', type: 'singleSelect', description: 'Платформа (Facebook, Google, Telegram)' },
        { name: 'Account Status', type: 'singleSelect', description: 'Статус аккаунта (active, farming, suspended)' },
        { name: 'Linked Farmer', type: 'multipleRecordLinks', description: 'Зв\'язок з учасником команди' },
        { name: 'AI Performance Evaluation', type: 'multilineText', description: 'AI оцінка продуктивності' },
        { name: 'Automations', type: 'multipleRecordLinks', description: 'Зв\'язок з автоматизаціями' }
      ]
    },
    {
      name: 'Offers',
      id: 'tbloxtOWgo0x7H1IA',
      description: 'Оффери з метриками продуктивності та фінансовими показниками',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      fields: [
        { name: 'Name', type: 'singleLineText', description: 'Назва оффера' },
        { name: 'Vertical', type: 'singleSelect', description: 'Вертикаль (e-commerce, gaming, education)' },
        { name: 'Source', type: 'singleSelect', description: 'Джерело оффера' },
        { name: 'Rate', type: 'currency', description: 'Ставка/комісія' },
        { name: 'Revenue', type: 'currency', description: 'Дохід' },
        { name: 'Expenses', type: 'currency', description: 'Витрати' },
        { name: 'ROI', type: 'number', description: 'Рентабельність інвестицій' },
        { name: 'Period', type: 'date', description: 'Період дії оффера' },
        { name: 'AI Analysis', type: 'multilineText', description: 'AI аналіз' },
        { name: 'Related Expenses', type: 'multipleRecordLinks', description: 'Зв\'язок з витратами' },
        { name: 'Tests', type: 'multipleRecordLinks', description: 'Зв\'язок з тестами' },
        { name: 'Proxies', type: 'multipleRecordLinks', description: 'Зв\'язок з проксі' },
        { name: 'Cards', type: 'multipleRecordLinks', description: 'Зв\'язок з картами' }
      ]
    },
    {
      name: 'Expenses',
      id: 'tblMM9lpJBPAZPz50',
      description: 'Витрати з деталізацією по типам та зв\'язками',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      fields: [
        { name: 'Name', type: 'singleLineText', description: 'Назва витрати' },
        { name: 'Expense Type', type: 'singleSelect', description: 'Тип витрати (creatives, card, proxy)' },
        { name: 'Amount', type: 'currency', description: 'Сума витрати' },
        { name: 'Linked Offer', type: 'multipleRecordLinks', description: 'Зв\'язок з оффером' },
        { name: 'Linked Card', type: 'multipleRecordLinks', description: 'Зв\'язок з картою' },
        { name: 'Linked Proxy', type: 'multipleRecordLinks', description: 'Зв\'язок з проксі' },
        { name: 'AI Evaluation', type: 'multilineText', description: 'AI оцінка витрати' }
      ]
    },
    {
      name: 'Team',
      id: 'tblcF5tG9LrqdLvF9',
      description: 'Учасники команди з їх ролями та продуктивністю',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      fields: [
        { name: 'Name', type: 'singleLineText', description: 'Ім\'я учасника команди' },
        { name: 'Role', type: 'singleSelect', description: 'Роль (farmer, manager, analyst)' },
        { name: 'Earnings', type: 'currency', description: 'Заробіток' },
        { name: 'Performance Evaluation', type: 'multilineText', description: 'Оцінка продуктивності' },
        { name: 'Linked Accounts', type: 'multipleRecordLinks', description: 'Зв\'язок з аккаунтами' }
      ]
    },
    {
      name: 'Cards',
      id: 'tblljO7exHTQhakeY',
      description: 'Карти з балансами та статусами',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      fields: [
        { name: 'Card Number', type: 'singleLineText', description: 'Номер карти' },
        { name: 'Balance', type: 'currency', description: 'Баланс' },
        { name: 'Status', type: 'singleSelect', description: 'Статус карти' },
        { name: 'Linked Offer', type: 'multipleRecordLinks', description: 'Зв\'язок з оффером' },
        { name: 'Linked Expense', type: 'multipleRecordLinks', description: 'Зв\'язок з витратами' },
        { name: 'AI Evaluation', type: 'multilineText', description: 'AI оцінка' },
        { name: 'Automations', type: 'multipleRecordLinks', description: 'Зв\'язок з автоматизаціями' }
      ]
    },
    {
      name: 'Proxies',
      id: 'tblPI3R8DzlKXBcli',
      description: 'Проксі сервери з їх типами та статусами',
      icon: <Globe className="w-5 h-5" />,
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
      fields: [
        { name: 'IP Address', type: 'singleLineText', description: 'IP адреса' },
        { name: 'Proxy Type', type: 'singleSelect', description: 'Тип проксі' },
        { name: 'Proxy Status', type: 'singleSelect', description: 'Статус проксі' },
        { name: 'Associated Offer', type: 'multipleRecordLinks', description: 'Зв\'язок з оффером' },
        { name: 'AI Performance Evaluation', type: 'multilineText', description: 'AI оцінка продуктивності' },
        { name: 'Expenses', type: 'multipleRecordLinks', description: 'Зв\'язок з витратами' }
      ]
    },
    {
      name: 'Tests',
      id: 'tblCi5ts5GLhBuF5H',
      description: 'Тести офферів з результатами та аналізом',
      icon: <TestTube className="w-5 h-5" />,
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400',
      fields: [
        { name: 'Test Name', type: 'singleLineText', description: 'Назва тесту' },
        { name: 'Linked Offer', type: 'multipleRecordLinks', description: 'Зв\'язок з оффером' },
        { name: 'Test Result', type: 'singleSelect', description: 'Результат тесту' },
        { name: 'AI Outcome Analysis', type: 'multilineText', description: 'AI аналіз результатів' }
      ]
    },
    {
      name: 'Automations',
      id: 'tblm4vN4SgrQBNGLt',
      description: 'Автоматизації з умовами та діями',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
      fields: [
        { name: 'Automation Name', type: 'singleLineText', description: 'Назва автоматизації' },
        { name: 'Condition', type: 'singleSelect', description: 'Умова спрацювання' },
        { name: 'Notification Medium', type: 'singleSelect', description: 'Спосіб сповіщення' },
        { name: 'Integration Source', type: 'singleSelect', description: 'Джерело інтеграції' },
        { name: 'Card', type: 'multipleRecordLinks', description: 'Зв\'язок з картою' },
        { name: 'Account', type: 'multipleRecordLinks', description: 'Зв\'язок з аккаунтом' },
        { name: 'Action Description', type: 'multilineText', description: 'Опис дії' }
      ]
    }
  ]

  const getFieldTypeColor = (type: string) => {
    const colors = {
      singleLineText: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      singleSelect: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      currency: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      number: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
      date: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      multilineText: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
      multipleRecordLinks: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
    }
    return colors[type as keyof typeof colors] || colors.singleLineText
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Джерела даних
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Детальна інформація про структуру таблиць та зв'язки між ними
          </p>
        </div>
      </div>

      {/* Database Overview */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Info className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Огляд бази даних
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tables.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Таблиць</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {tables.reduce((sum, table) => sum + table.fields.length, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Полів</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {tables.reduce((sum, table) => 
                sum + table.fields.filter(field => field.type === 'multipleRecordLinks').length, 0
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Зв'язків</div>
          </div>
        </div>
      </div>

      {/* Tables List */}
      <div className="space-y-4">
        {tables.map((table) => (
          <div key={table.id} className="card">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleTable(table.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${table.color}`}>
                  {table.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {table.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {table.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    ID: {table.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {table.fields.length} полів
                </span>
                {expandedTables.has(table.id) ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>

            {expandedTables.has(table.id) && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Поля таблиці:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {table.fields.map((field, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getFieldTypeColor(field.type)}`}>
                        {field.type}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                          {field.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {field.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Relationships */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Link className="w-5 h-5 text-green-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Зв'язки між таблицями
          </h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm"><strong>Offers</strong> ↔ <strong>Expenses</strong> - Оффери мають пов'язані витрати</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm"><strong>Offers</strong> ↔ <strong>Cards</strong> - Оффери використовують карти</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm"><strong>Offers</strong> ↔ <strong>Proxies</strong> - Оффери використовують проксі</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm"><strong>Offers</strong> ↔ <strong>Tests</strong> - Оффери проходять тестування</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm"><strong>Accounts</strong> ↔ <strong>Team</strong> - Аккаунти прив'язані до учасників команди</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span className="text-sm"><strong>Accounts</strong> ↔ <strong>Automations</strong> - Аккаунти мають автоматизації</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
            <span className="text-sm"><strong>Cards</strong> ↔ <strong>Automations</strong> - Карти мають автоматизації</span>
          </div>
        </div>
      </div>

      {/* Usage in Reports */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Table className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Використання в звітах
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Загальна статистика</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Використовує <strong>Offers</strong> (дохід, витрати, ROI), <strong>Accounts</strong> (активні аккаунти)
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Статистика по платформам</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Групує <strong>Offers</strong> по полю <strong>Vertical</strong>
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Топ оффери</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Сортує <strong>Offers</strong> по <strong>ROI</strong> та <strong>Revenue</strong>
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Статистика аккаунтів</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Аналізує <strong>Accounts</strong> по <strong>Platform</strong> та <strong>Account Status</strong>
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Звіти за період</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Фільтрує <strong>Offers</strong> по полю <strong>Period</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 