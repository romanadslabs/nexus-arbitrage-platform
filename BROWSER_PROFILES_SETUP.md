# 🖥️ Система браузерних профілів Nexus

## 📋 Огляд

Система браузерних профілів дозволяє керувати 200+ антидетект браузерними профілями з інтеграцією KasmWeb для автоматизації та керування сесіями.

## 🏗️ Архітектура

### Основні компоненти:

1. **Типи даних** (`src/types/browserProfiles.ts`)
   - Повна структура для браузерних профілів
   - Підтримка різних типів браузерів (Desktop, Mobile, VM, Emulator)
   - Інтеграція з проксі та автоматизацією

2. **Провайдер** (`src/components/providers/BrowserProfilesProvider.tsx`)
   - Керування станом профілів
   - API інтеграція
   - Синхронізація з Airtable

3. **UI компоненти:**
   - `ProfileCreator.tsx` - Створення профілів
   - `DataCleaner.tsx` - Очищення старих даних
   - Головна сторінка (`/browser-profiles`)

4. **API роути:**
   - `/api/browser-profiles` - CRUD операції
   - `/api/browser-profiles/search` - Пошук та фільтрація

## 🚀 Швидкий старт

### 1. Налаштування KasmWeb

```bash
# Оновити конфігурацію в src/lib/kasmConfig.ts
export const KASM_CONFIG = {
  API_KEY: 'your-api-key',
  API_SECRET: 'your-api-secret',
  SERVER_URL: 'https://your-kasm-server.com',
  // ...
}
```

### 2. Створення першого профілю

1. Перейдіть на `/browser-profiles`
2. Натисніть "Створити профіль"
3. Заповніть основну інформацію:
   - Назва профілю
   - Платформа (Facebook, Google, Telegram)
   - Тип браузера (Desktop, Mobile, VM, Emulator)
   - Операційна система
   - Браузерний двигун

### 3. Налаштування браузерних відбитків

- **User Agent** - унікальний ідентифікатор браузера
- **Розширення екрану** - 1920x1080, 2560x1440, тощо
- **Часовий пояс** - Europe/Kiev, America/New_York, тощо
- **Мова** - uk-UA, en-US, ru-RU
- **Геолокація** - координати для імітації місцезнаходження

### 4. Додавання проксі

```typescript
const proxyConfig = {
  type: 'http' | 'https' | 'socks5',
  host: 'proxy.example.com',
  port: 8080,
  username: 'user',
  password: 'pass',
  rotationUrl: 'https://proxy.example.com/rotate'
}
```

## 📊 Типи профілів

### Desktop профілі
- **Chrome** - для Facebook, Google
- **Firefox** - для Telegram, спеціальні задачі
- **Edge** - для Microsoft сервісів

### Mobile профілі
- **iOS Safari** - для мобільних тестів
- **Android Chrome** - для Android емуляції

### Віртуальні машини
- **Windows VM** - для ізольованих сесій
- **Linux VM** - для серверних задач

### Емулятори
- **Android Emulator** - для мобільних додатків
- **iOS Simulator** - для iOS тестування

## 🔧 Автоматизація

### Нагул кук (Cookie Farming)

```typescript
const automationConfig = {
  enabled: true,
  type: 'cookie_farming',
  settings: {
    searchKeywords: ['test', 'example', 'demo'],
    maxSitesPerKeyword: 3,
    scrollDepth: 50, // 0-100%
    timeOnSite: { min: 30, max: 120 }, // секунди
    searchEngines: ['google', 'bing'],
    excludeDomains: ['example.com'],
    includeDomains: []
  }
}
```

### Макроси

```typescript
const macroConfig = {
  enabled: true,
  type: 'macro',
  settings: {
    actions: [
      { type: 'navigate', value: 'https://google.com' },
      { type: 'type', selector: 'input[name="q"]', value: 'test' },
      { type: 'click', selector: 'input[type="submit"]' },
      { type: 'wait', delay: 2000 }
    ],
    repeatCount: 5,
    delayBetweenActions: 1000
  }
}
```

## 🔄 Airtable інтеграція

### Структура таблиці

```typescript
interface AirtableProfile {
  id: string
  name: string
  platform: string
  browserType: string
  status: string
  assignedTo?: string
  tags: string[]
  category: string
  kasmSessionId?: string
  proxy?: string
  automation?: string
  createdAt: string
  lastUsed?: string
  usageCount: number
}
```

### Синхронізація

```typescript
// Синхронізація з Airtable
await syncToAirtable(profileId)

// Синхронізація з Nexus
await syncFromAirtable()
```

## 🎯 Керування профілями

### Призначення фармерам/баєрам

```typescript
// Призначити профіль користувачу
await assignProfile(profileId, userId)

// Зняти призначення
await unassignProfile(profileId)
```

### Запуск/зупинка сесій

```typescript
// Запустити браузерну сесію
await launchProfile(profileId)

// Зупинити сесію
await stopProfile(profileId)

// Отримати URL сесії
const sessionUrl = await getSessionUrl(profileId)
```

## 🔍 Пошук та фільтрація

### Фільтри

```typescript
const filters = {
  platform: 'facebook' | 'google' | 'telegram',
  browserType: 'desktop' | 'mobile' | 'vm' | 'emulator',
  status: 'active' | 'running' | 'inactive' | 'error',
  ownerId: string,
  tags: string[],
  category: string,
  isAvailable: boolean,
  hasProxy: boolean,
  automationEnabled: boolean
}
```

### Сортування

```typescript
const sorting = {
  field: 'name' | 'createdAt' | 'lastUsed' | 'usageCount' | 'status',
  direction: 'asc' | 'desc'
}
```

## 🛠️ API Endpoints

### GET /api/browser-profiles
Отримати всі профілі

### POST /api/browser-profiles
Створити новий профіль

### POST /api/browser-profiles/search
Пошук профілів з фільтрами

### PATCH /api/browser-profiles/[id]
Оновити профіль

### DELETE /api/browser-profiles/[id]
Видалити профіль

### POST /api/browser-profiles/[id]/sync
Синхронізувати з Airtable

## 📈 Статистика

### Метрики профілю

```typescript
interface ProfileStats {
  totalUsageTime: number // хвилини
  sessionsCount: number
  lastSessionDuration?: number
  automationRuns: number
  successfulAutomations: number
  errors: number
  cookiesCollected: number
}
```

### Загальна статистика

- Всього профілів: 200+
- Активних сесій: до 5 одночасно
- Успішних автоматизацій: %
- Середній час використання: хвилини

## 🔒 Безпека

### Права доступу

```typescript
interface UserPermissions {
  canCreateProfiles: boolean
  canEditProfiles: boolean
  canDeleteProfiles: boolean
  canAssignProfiles: boolean
  canRunAutomation: boolean
  canViewStats: boolean
  canManageUsers: boolean
}
```

### Ролі користувачів

- **Admin** - повний доступ
- **Farmer** - керування призначеними профілями
- **Buyer** - перегляд та використання профілів

## 🚨 Troubleshooting

### Поширені проблеми

1. **Профіль не запускається**
   - Перевірте KasmWeb сервер
   - Перевірте доступність образів
   - Перевірте мережеві налаштування

2. **Проксі не працює**
   - Тестуйте проксі окремо
   - Перевірте формат конфігурації
   - Перевірте доступність проксі сервера

3. **Автоматизація не виконується**
   - Перевірте налаштування Selenium/Puppeteer
   - Перевірте доступність сайтів
   - Перевірте логи помилок

### Логування

```typescript
// Включити детальне логування
const loggingConfig = {
  level: 'debug',
  saveToFile: true,
  maxFileSize: '10MB',
  retention: '30 days'
}
```

## 🔮 Майбутні покращення

### Планується:

1. **Масове створення профілів**
   - Імпорт з CSV/Excel
   - Шаблони профілів
   - Автоматична генерація відбитків

2. **Розширена автоматизація**
   - Запис макросів
   - Розпізнавання капчі
   - Інтелектуальне нагулювання

3. **Аналітика**
   - Детальна статистика використання
   - Прогнозування потреб
   - Оптимізація ресурсів

4. **Інтеграції**
   - Додаткові проксі провайдери
   - Нові платформи
   - API для зовнішніх систем

## 📞 Підтримка

Для технічної підтримки звертайтеся до:
- Email: support@nexus.com
- Telegram: @nexus_support
- Документація: /docs/browser-profiles

---

**Версія:** 1.0.0  
**Останнє оновлення:** 2025-01-30  
**Автор:** Nexus Team 