# Налаштування інтеграції з Airtable

## Огляд

Цей документ описує як налаштувати інтеграцію з Airtable для роботи з реальними даними в платформі Nexus.

## Крок 1: Створення бази даних в Airtable

### 1.1 Створення нової бази даних
1. Перейдіть на [airtable.com](https://airtable.com)
2. Увійдіть в свій акаунт або створіть новий
3. Натисніть "Add a base" → "Start from scratch"
4. Назвіть базу даних "Nexus Platform"

### 1.2 Створення таблиці Accounts
1. Перейменуйте першу таблицю на "Accounts"
2. Додайте наступні поля:

| Назва поля | Тип поля | Опис |
|------------|----------|------|
| Name | Single line text | Назва аккаунта |
| Email | Email | Email адреса |
| Phone | Phone number | Номер телефону |
| Platform | Single select | Платформа (Facebook, Google, TikTok, Instagram) |
| Status | Single select | Статус (active, banned, moderation, pending, suspended) |
| Category | Single select | Категорія (general, premium, vip) |
| FarmerID | Single line text | ID фармера |

### 1.3 Створення таблиці Campaigns
1. Натисніть "+" для створення нової таблиці
2. Назвіть її "Campaigns"
3. Додайте наступні поля:

| Назва поля | Тип поля | Опис |
|------------|----------|------|
| Name | Single line text | Назва кампанії |
| Platform | Single select | Платформа (Facebook, Google, TikTok, Instagram) |
| Status | Single select | Статус (active, paused, completed, failed) |
| Budget | Currency | Бюджет кампанії |
| Spent | Currency | Витрачено коштів |
| Revenue | Currency | Дохід від кампанії |
| Clicks | Number | Кількість кліків |
| Conversions | Number | Кількість конверсій |
| ROI | Percent | ROI кампанії |
| OfferID | Single line text | ID оффера |
| StartDate | Date | Дата початку кампанії |

## Крок 2: Отримання API Key

### 2.1 Доступ до налаштувань API
1. Перейдіть в [Airtable API Documentation](https://airtable.com/api)
2. Увійдіть в свій акаунт
3. Виберіть вашу базу даних "Nexus Platform"

### 2.2 Генерація API Key
1. Натисніть "Generate API key"
2. Скопіюйте згенерований ключ
3. Збережіть його в безпечному місці

## Крок 3: Отримання Base ID

### 3.1 Знаходження Base ID
1. Відкрийте вашу базу даних в Airtable
2. Подивіться на URL в браузері
3. Base ID знаходиться після "airtable.com/" і перед "/tbl"
4. Приклад: `https://airtable.com/appXXXXXXXXXXXXXX/tblYYYYYYYYYYYYYY`
5. Скопіюйте частину `appXXXXXXXXXXXXXX`

## Крок 4: Налаштування в додатку

### 4.1 Відкриття налаштувань
1. Запустіть додаток
2. Перейдіть в "Налаштування"
3. Знайдіть розділ "Налаштування Airtable"

### 4.2 Введення даних
1. В поле "API Key" вставте ваш API ключ
2. В поле "Base ID" вставте ID вашої бази даних
3. Натисніть "Зберегти налаштування"

### 4.3 Тестування підключення
1. Натисніть "Тестувати підключення"
2. Переконайтеся, що статус змінився на "Підключено до Airtable"

## Крок 5: Додавання тестових даних

### 5.1 Додавання аккаунтів
1. В таблиці Accounts додайте кілька тестових записів:

| Name | Email | Phone | Platform | Status | Category | FarmerID |
|------|-------|-------|----------|--------|----------|----------|
| Test Account 1 | test1@example.com | +1234567890 | Facebook | active | general | FARMER001 |
| Test Account 2 | test2@example.com | +1234567891 | Google | pending | premium | FARMER002 |
| Test Account 3 | test3@example.com | +1234567892 | TikTok | active | vip | FARMER003 |

### 5.2 Додавання кампаній
1. В таблиці Campaigns додайте кілька тестових записів:

| Name | Platform | Status | Budget | Spent | Revenue | Clicks | Conversions | ROI | OfferID | StartDate |
|------|----------|--------|--------|-------|---------|--------|-------------|-----|---------|-----------|
| Test Campaign 1 | Facebook | active | 1000 | 500 | 1500 | 1000 | 50 | 200 | OFFER001 | 2024-01-01 |
| Test Campaign 2 | Google | paused | 2000 | 1200 | 1800 | 800 | 40 | 50 | OFFER002 | 2024-01-15 |
| Test Campaign 3 | TikTok | completed | 500 | 300 | 800 | 600 | 30 | 167 | OFFER003 | 2024-02-01 |

## Крок 6: Перевірка роботи

### 6.1 Перевірка аккаунтів
1. Перейдіть в розділ "Аккаунти"
2. Переконайтеся, що дані завантажуються з Airtable
3. Спробуйте створити новий аккаунт
4. Перевірте, що він з'являється в Airtable

### 6.2 Перевірка кампаній
1. Перейдіть в розділ "Кампанії"
2. Переконайтеся, що дані завантажуються з Airtable
3. Спробуйте створити нову кампанію
4. Перевірте, що вона з'являється в Airtable

### 6.3 Перевірка звітів
1. Перейдіть в розділ "Звіти"
2. Переконайтеся, що графіки відображають дані з Airtable
3. Перевірте, що статистика розраховується правильно

## Розв'язання проблем

### Проблема: "Failed to connect to Airtable"
**Рішення:**
- Перевірте правильність API Key
- Перевірте правильність Base ID
- Переконайтеся, що база даних доступна
- Перевірте інтернет-з'єднання

### Проблема: "Failed to fetch accounts/campaigns"
**Рішення:**
- Перевірте назви таблиць (повинні бути "Accounts" та "Campaigns")
- Перевірте назви полів (повинні відповідати структурі вище)
- Переконайтеся, що в таблицях є дані

### Проблема: "Failed to create/update record"
**Рішення:**
- Перевірте права доступу до бази даних
- Переконайтеся, що всі обов'язкові поля заповнені
- Перевірте формат даних (особливо для дат та чисел)

## Безпека

### Рекомендації по безпеці:
1. Ніколи не додавайте API Key в код
2. Використовуйте змінні середовища для зберігання ключів
3. Регулярно оновлюйте API Key
4. Обмежуйте права доступу до бази даних
5. Використовуйте HTTPS для всіх з'єднань

### Змінні середовища:
Створіть файл `.env.local` з наступними змінними:
```
NEXT_PUBLIC_AIRTABLE_API_KEY=your_api_key_here
NEXT_PUBLIC_AIRTABLE_BASE_ID=your_base_id_here
```

## Підтримка

Якщо у вас виникли проблеми з налаштуванням:
1. Перевірте цей документ
2. Перегляньте логи в консолі браузера
3. Перевірте статус Airtable API
4. Зверніться до технічної підтримки

## Корисні посилання

- [Airtable API Documentation](https://airtable.com/api)
- [Airtable Support](https://support.airtable.com/)
- [Airtable Community](https://community.airtable.com/) 