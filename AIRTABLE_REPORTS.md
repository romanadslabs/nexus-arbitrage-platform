# Звіти Airtable - Детальна документація

## Огляд системи

Система звітів Airtable надає комплексну аналітику даних з чотирьох основних таблиць бази даних. Всі дані отримуються через Airtable API та обробляються в реальному часі.

## Джерела даних

### 1. Таблиця "Accounts" (Аккаунти)

**Опис:** Зберігає інформацію про аккаунти з різних рекламних платформ.

**Поля таблиці:**
- `Account ID` - Унікальний ідентифікатор аккаунта
- `Email` - Email адреса аккаунта
- `Phone` - Номер телефону
- `Platform` - Платформа (Facebook, Google, TikTok, Instagram, YouTube)
- `Account Status` - Статус аккаунта (active, pending, suspended, inactive)
- `Category` - Категорія аккаунта (general, premium, vip)
- `Farmer ID` - ID фармера, якому належить аккаунт
- `Created Time` - Дата створення запису

**Використання в звітах:**
- Статистика по статусах аккаунтів
- Розподіл по платформах
- Кількість активних/неактивних аккаунтів
- Аналітика по категоріях

### 2. Таблиця "Offers" (Оффери)

**Опис:** Містить інформацію про рекламні оффери та кампанії.

**Поля таблиці:**
- `Name` - Назва оффера/кампанії
- `Vertical` - Вертикаль (e-commerce, gaming, education, health, etc.)
- `Source` - Джерело трафіку (Facebook Ads, Google Ads, TikTok Ads, etc.)
- `Rate` - Ставка за конверсію
- `Revenue` - Загальний дохід
- `Expenses` - Загальні витрати
- `ROI` - Return on Investment (розрахункове поле)
- `Period` - Період кампанії (дата)
- `Status` - Статус оффера (active, paused, completed)
- `Created Time` - Дата створення

**Використання в звітах:**
- Загальна статистика доходів та витрат
- Топ оффери за ROI та доходом
- Аналітика по вертикалях
- Статистика за періодами
- Розрахунок середнього ROI

### 3. Таблиця "Expenses" (Витрати)

**Опис:** Детальний облік всіх витрат по категоріях.

**Поля таблиці:**
- `Name` - Назва витрати
- `Expense Type` - Тип витрати (ads, tools, services, cards, proxies)
- `Amount` - Сума витрати
- `Linked Offer` - Пов'язаний оффер (опціонально)
- `Linked Card` - Пов'язана карта (опціонально)
- `Linked Proxy` - Пов'язаний проксі (опціонально)
- `Date` - Дата витрати
- `Description` - Опис витрати

**Використання в звітах:**
- Загальні витрати по категоріях
- Аналітика витрат по офферах
- Середні витрати
- Розподіл витрат по типах

### 4. Таблиця "Team Members" (Члени команди)

**Опис:** Інформація про членів команди та їх ролі.

**Поля таблиці:**
- `Name` - Ім'я члена команди
- `Email` - Email адреса
- `Role` - Роль в команді (admin, manager, farmer, analyst)
- `Status` - Статус (active, inactive)
- `Join Date` - Дата приєднання до команди
- `Permissions` - Права доступу

**Використання в звітах:**
- Статистика команди
- Розподіл по ролях
- Активність членів команди

## Типи звітів

### 1. Загальний огляд (Overview)

**Джерела даних:** Offers, Accounts, Expenses

**Метрики:**
- Загальний дохід (сума Revenue з Offers)
- Активні оффери (кількість активних записів в Offers)
- Активні аккаунти (кількість активних записів в Accounts)
- Середній ROI (розрахункове значення)

**Розрахунки:**
```javascript
totalRevenue = sum(offers.revenue)
activeOffers = count(offers where status = 'active')
activeAccounts = count(accounts where status = 'active')
averageROI = sum(offers.roi) / count(offers)
```

### 2. Статистика по вертикалях (Platforms)

**Джерела даних:** Offers

**Метрики:**
- Кількість офферів по вертикалях
- Доходи по вертикалях
- Витрати по вертикалях
- ROI по вертикалях
- Середня ставка по вертикалях

**Розрахунки:**
```javascript
verticalStats = group(offers by vertical)
for each vertical:
  offers = count(offers in vertical)
  revenue = sum(revenue in vertical)
  expenses = sum(expenses in vertical)
  roi = (revenue - expenses) / expenses * 100
  averageRate = sum(rate in vertical) / count(offers in vertical)
```

### 3. Топ кампанії (Campaigns)

**Джерела даних:** Offers

**Метрики:**
- Топ оффери за ROI
- Топ оффери за доходом
- Детальна інформація по кожному офферу

**Розрахунки:**
```javascript
topROI = sort(offers by roi desc, limit: 10)
topRevenue = sort(offers by revenue desc, limit: 10)
```

### 4. Статистика аккаунтів (Accounts)

**Джерела даних:** Accounts

**Метрики:**
- Розподіл аккаунтів по статусах
- Розподіл по платформах
- Загальна кількість аккаунтів

**Розрахунки:**
```javascript
statusStats = group(accounts by status)
platformStats = group(accounts by platform)
totalAccounts = count(accounts)
```

### 5. Звіти за періодами (Period Reports)

**Джерела даних:** Offers, Expenses

**Метрики:**
- Статистика за вибраний період
- Доходи за період
- Витрати за період
- ROI за період
- Кількість офферів за період

**Розрахунки:**
```javascript
periodOffers = filter(offers where period >= startDate and period <= endDate)
periodRevenue = sum(periodOffers.revenue)
periodExpenses = sum(periodOffers.expenses)
periodROI = (periodRevenue - periodExpenses) / periodExpenses * 100
```

## API Endpoints

### GET /api/airtable/reports

**Параметри:**
- `type` - Тип звіту (overall, platforms, top-roi, top-revenue, accounts, campaigns, expenses, period)
- `startDate` - Початкова дата (для period звітів)
- `endDate` - Кінцева дата (для period звітів)
- `limit` - Ліміт записів (для top звітів)

**Приклади:**
```bash
# Загальна статистика
GET /api/airtable/reports?type=overall

# Статистика по вертикалях
GET /api/airtable/reports?type=platforms

# Топ оффери за ROI
GET /api/airtable/reports?type=top-roi&limit=5

# Звіт за період
GET /api/airtable/reports?type=period&startDate=2024-01-01&endDate=2024-01-31
```

## Структура відповіді API

```json
{
  "success": true,
  "data": {
    // Дані звіту залежно від типу
  },
  "generatedAt": "2024-01-15T10:30:00.000Z"
}
```

## Обробка помилок

**Типові помилки:**
- `CampaignsService is not defined` - Помилка в коді (виправлена)
- `Failed to fetch report` - Проблеми з підключенням до Airtable
- `Invalid report type` - Невірний тип звіту

**Логування:**
Всі помилки логуються в консоль з детальною інформацією для діагностики.

## Оновлення даних

**Частота оновлення:**
- Автоматичне оновлення при зміні періоду
- Ручне оновлення через кнопку "Оновити"
- Реальний час при зміні фільтрів

**Кешування:**
Дані кешуються на клієнті для зменшення навантаження на API.

## Експорт даних

**Підтримувані формати:**
- JSON - Повна структура даних
- CSV - Табличний формат (в розробці)

**Структура експорту:**
```json
{
  "overall": { /* загальна статистика */ },
  "platforms": { /* статистика по вертикалях */ },
  "topROI": [ /* топ оффери за ROI */ ],
  "topRevenue": [ /* топ оффери за доходом */ ],
  "accounts": { /* статистика аккаунтів */ },
  "periodData": { /* дані за період */ },
  "dataSources": { /* інформація про джерела */ },
  "generatedAt": "2024-01-15T10:30:00.000Z"
}
```

## Безпека

**Обмеження доступу:**
- Перевірка авторизації користувача
- Валідація параметрів запитів
- Обмеження частоти запитів

**Захист даних:**
- Шифрування API ключів
- Безпечне зберігання конфігурації
- Логування доступу до даних

## Розширення функціональності

**Планувані покращення:**
- Додавання нових типів звітів
- Інтерактивні графіки
- Автоматичні звіти по email
- Інтеграція з іншими сервісами
- Мобільна версія звітів

**Кастомні звіти:**
Можливість створення користувацьких звітів з власними фільтрами та метриками. 