@echo off
echo.
echo ========================================
echo    Nexus Arbitrage Platform
echo    Швидке тестування всіх сторінок
echo ========================================
echo.

echo 🚀 Відкриваю браузер для тестування...
echo.

echo 📋 Послідовність тестування:
echo.
echo 1. Головна сторінка: http://localhost:3000
echo 2. Авторизація: http://localhost:3000/login
echo 3. Оффери: http://localhost:3000/offers
echo 4. Кампанії: http://localhost:3000/campaigns
echo 5. Карти та проксі: http://localhost:3000/cards-proxies
echo 6. Аккаунти: http://localhost:3000/accounts
echo 7. Чат: http://localhost:3000/workspace/chat
echo 8. Аналітика: http://localhost:3000/reports
echo 9. Налаштування: http://localhost:3000/settings
echo.

echo 🔧 Тестові акаунти:
echo   Адміністратор: admin@nexus.com / admin123
echo   Лідер: leader@nexus.com / leader123
echo   Фармер: farmer@nexus.com / farmer123
echo   Байер: launcher@nexus.com / launcher123
echo.

echo 📊 Очікуваний результат: 85%% функціональності готово
echo.

start http://localhost:3000
timeout /t 2 /nobreak >nul
start http://localhost:3000/login
timeout /t 2 /nobreak >nul
start http://localhost:3000/offers
timeout /t 2 /nobreak >nul
start http://localhost:3000/campaigns
timeout /t 2 /nobreak >nul
start http://localhost:3000/cards-proxies

echo.
echo ✅ Всі сторінки відкриті в браузері!
echo.
echo 💡 Поради для тестування:
echo   1. Почніть з авторизації
echo   2. Перевірте створення офферів
echo   3. Протестуйте кампанії
echo   4. Перевірте карти та проксі
echo   5. Протестуйте чат
echo.
echo 🎯 Готово до тестування!
pause 