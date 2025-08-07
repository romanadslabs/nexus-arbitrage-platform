@echo off
echo ========================================
echo    Nexus Platform - GitHub Setup
echo ========================================
echo.

echo 1. Перейменування гілки на main...
git branch -M main

echo.
echo 2. Додавання віддаленого репозиторію...
echo ВАЖЛИВО: Замініть YOUR_USERNAME на ваше ім'я користувача GitHub
git remote add origin https://github.com/YOUR_USERNAME/nexus-arbitrage-platform.git

echo.
echo 3. Завантаження коду на GitHub...
git push -u origin main

echo.
echo ========================================
echo    Налаштування завершено!
echo ========================================
echo.
echo Перевірте репозиторій на GitHub:
echo https://github.com/YOUR_USERNAME/nexus-arbitrage-platform
echo.
pause 