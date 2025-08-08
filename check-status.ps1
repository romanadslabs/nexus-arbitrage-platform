Write-Host "🔍 Перевірка статусу сервера..." -ForegroundColor Yellow

# Перевірка чи запущений сервер
$port3000 = netstat -an | findstr ":3000"
if ($port3000) {
    Write-Host "✅ Сервер запущений на порту 3000" -ForegroundColor Green
} else {
    Write-Host "❌ Сервер не запущений на порту 3000" -ForegroundColor Red
}

# Перевірка процесів Node.js
$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -eq "node"}
if ($nodeProcesses) {
    Write-Host "✅ Знайдено процеси Node.js:" -ForegroundColor Green
    $nodeProcesses | ForEach-Object {
        Write-Host "   - PID: $($_.Id), Memory: $([math]::Round($_.WorkingSet64/1MB, 2)) MB" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ Процеси Node.js не знайдено" -ForegroundColor Red
}

# Перевірка доступності сайту
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Сайт доступний на http://localhost:3000" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Сайт відповідає з кодом: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Помилка підключення до сайту: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🚀 Для запуску сервера використовуйте: npm run dev" -ForegroundColor Magenta
Write-Host "🌐 Відкрийте браузер: http://localhost:3000" -ForegroundColor Magenta 