# Інтеграція фармінгу з GoLogin та Airtable

## Огляд системи

Система фармінгу в Nexus Platform забезпечує повну інтеграцію між:
- **GoLogin** - для управління браузерними профілями
- **Airtable** - для зберігання даних аккаунтів
- **Nexus Platform** - для управління процесом фармінгу

## Життєвий цикл аккаунта

### 1. Створення аккаунта
- Фармер створює профіль в GoLogin
- Система автоматично синхронізує профіль з Airtable
- Аккаунт з'являється в Nexus зі статусом "active"

### 2. Початок фармінгу
- Фармер натискає "Почати фармінг" для аккаунта
- Статус змінюється на "farming"
- Система записує початок фармінгу в Airtable

### 3. Процес фармінгу
- Фармер виконує щоденні завдання:
  - Логін в аккаунт
  - Перегляд контенту (5-10 хв)
  - Лайки та коментарі (3-5 дій)
  - Підписки на інші аккаунти (2-3)
  - Створення постів (1 раз на 2-3 дні)

### 4. Завершення фармінгу
- Після 1-2 днів фармер натискає "Завершити фармінг"
- Статус змінюється на "ready"
- Аккаунт готовий для продажу

### 5. Продаж аккаунта
- Баєр вибирає готовий аккаунт
- Система змінює статус на "sold"
- Аккаунт передається покупцю

## API Endpoints

### Синхронізація з GoLogin
```http
POST /api/farming/sync
```
Синхронізує профілі з GoLogin та оновлює дані в Airtable.

### Отримання статистики
```http
GET /api/farming/sync
```
Повертає статистику фармінгу:
- Загальна кількість аккаунтів
- Аккаунти в фармінгу
- Готові аккаунти
- Продані аккаунти
- Кількість активних фармерів

### Управління аккаунтами
```http
POST /api/farming/accounts
```
Виконує дії з аккаунтами:
- `start` - початок фармінгу
- `complete` - завершення фармінгу
- `sell` - продаж аккаунта

```http
GET /api/farming/accounts
```
Отримує список аккаунтів з фільтрацією по статусу.

## Компоненти

### FarmingManager
Основний компонент для управління фармінгом:
- Синхронізація з GoLogin
- Перегляд статистики
- Управління аккаунтами
- Фільтрація по статусах

### FarmingAutomationService
Сервіс для автоматизації:
- Синхронізація профілів
- Управління статусами
- Створення сесій фармінгу
- Статистика

## Налаштування

### GoLogin API
```typescript
// src/lib/goLogin.ts
const API_TOKEN = 'your-gologin-api-token'
const API_URL = 'https://api.gologin.com'
```

### Airtable
```typescript
// src/lib/airtable.ts
const AIRTABLE_API_KEY = 'your-airtable-api-key'
const AIRTABLE_BASE_ID = 'your-base-id'
```

## Використання

### 1. Синхронізація профілів
```typescript
// Автоматично при завантаженні сторінки
const response = await fetch('/api/farming/sync', {
  method: 'POST'
})
```

### 2. Початок фармінгу
```typescript
const response = await fetch('/api/farming/accounts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'start',
    accountId: 'account-id',
    farmerId: 'farmer-id'
  })
})
```

### 3. Завершення фармінгу
```typescript
const response = await fetch('/api/farming/accounts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'complete',
    accountId: 'account-id'
  })
})
```

### 4. Продаж аккаунта
```typescript
const response = await fetch('/api/farming/accounts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'sell',
    accountId: 'account-id',
    buyerId: 'buyer-id'
  })
})
```

## Статуси аккаунтів

- **active** - Активний аккаунт, готовий для фармінгу
- **farming** - Аккаунт в процесі фармінгу
- **ready** - Фармінг завершено, готовий для продажу
- **sold** - Аккаунт продано
- **banned** - Аккаунт заблоковано
- **pending** - Очікує активації

## Тестування

Для тестування інтеграції відкрийте:
```
http://localhost:3003/test-farming
```

Ця сторінка дозволяє:
- Тестувати синхронізацію з GoLogin
- Переглядати статистику
- Управляти аккаунтами
- Перевіряти статуси

## Моніторинг

Система веде лог всіх дій:
- Синхронізація профілів
- Зміна статусів аккаунтів
- Дії фармерів
- Помилки API

Логи доступні в консолі браузера та серверних логах.

## Безпека

- Всі API запити перевіряють авторизацію
- Дані зберігаються в Airtable з шифруванням
- GoLogin API токен захищений
- Логування всіх дій для аудиту

## Підтримка

При виникненні проблем:
1. Перевірте логи в консолі браузера
2. Перевірте статус API GoLogin
3. Перевірте підключення до Airtable
4. Зверніться до документації або створіть звіт про помилку 