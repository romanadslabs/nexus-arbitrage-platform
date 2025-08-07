Write-Host "========================================" -ForegroundColor Green
Write-Host "    Nexus Platform - GitHub Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "1. Перейменування гілки на main..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "2. Додавання віддаленого репозиторію..." -ForegroundColor Yellow
Write-Host "ВАЖЛИВО: Замініть YOUR_USERNAME на ваше ім'я користувача GitHub" -ForegroundColor Red
git remote add origin https://github.com/YOUR_USERNAME/nexus-arbitrage-platform.git

Write-Host ""
Write-Host "3. Завантаження коду на GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "    Налаштування завершено!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Перевірте репозиторій на GitHub:" -ForegroundColor Cyan
Write-Host "https://github.com/YOUR_USERNAME/nexus-arbitrage-platform" -ForegroundColor Cyan
Write-Host ""
Read-Host "Натисніть Enter для завершення" 