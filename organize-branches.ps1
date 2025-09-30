# Script PowerShell para organizar branches do ByteBank Mobile
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 ORGANIZANDO BRANCHES DO BYTEBANK-MOBILE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n📋 1. Verificando status atual..." -ForegroundColor Yellow
git status

Write-Host "`n🎨 2. Criando branch para componentes UI..." -ForegroundColor Green
git checkout -b feature/ui-components

# Componentes UI
$uiFiles = @(
    "src/components/shared/",
    "src/components/forms/", 
    "src/utils/",
    "src/constants/",
    "src/assets/",
    "src/hooks/useFormValidation.ts"
)

foreach ($file in $uiFiles) {
    if (Test-Path $file) {
        git add $file
        Write-Host "✅ Adicionado: $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Não encontrado: $file" -ForegroundColor Yellow
    }
}

git commit -m "🎨 feat: implement shared UI components and utilities"
git push origin feature/ui-components

Write-Host "`n🧭 3. Criando branch para navegação..." -ForegroundColor Green
git checkout main
git checkout -b feature/navigation

$navFiles = @(
    "src/navigation/",
    "src/screens/LoadingScreen/",
    "src/config/",
    "src/services/firebaseInitService/"
)

foreach ($file in $navFiles) {
    if (Test-Path $file) {
        git add $file
        Write-Host "✅ Adicionado: $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Não encontrado: $file" -ForegroundColor Yellow
    }
}

git commit -m "🧭 feat: implement app navigation structure and Firebase config"
git push origin feature/navigation

Write-Host "`n🔐 4. Criando branch para autenticação..." -ForegroundColor Green
git checkout main
git checkout -b feature/authentication

$authFiles = @(
    "src/screens/LoginScreen/",
    "src/screens/RegisterScreen/",
    "src/screens/ProfileScreen/",
    "src/services/authService/",
    "src/services/firebaseAuthService/",
    "src/store/slices/authSlice/",
    "src/types/auth.ts",
    "src/hooks/useAuthState.ts"
)

foreach ($file in $authFiles) {
    if (Test-Path $file) {
        git add $file
        Write-Host "✅ Adicionado: $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Não encontrado: $file" -ForegroundColor Yellow
    }
}

git commit -m "🔐 feat: implement authentication system with login, register and profile screens"
git push origin feature/authentication

Write-Host "`n💰 5. Criando branch para transações..." -ForegroundColor Green
git checkout main
git checkout -b feature/transactions

$transactionFiles = @(
    "src/screens/AddTransactionScreen/",
    "src/screens/TransactionsScreen/",
    "src/services/transactionService/",
    "src/services/firebaseTransactionService/",
    "src/store/slices/transactionsSlice/",
    "src/types/transaction.ts"
)

foreach ($file in $transactionFiles) {
    if (Test-Path $file) {
        git add $file
        Write-Host "✅ Adicionado: $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Não encontrado: $file" -ForegroundColor Yellow
    }
}

git commit -m "💰 feat: implement transaction management system"
git push origin feature/transactions

Write-Host "`n📊 6. Criando branch para dashboard..." -ForegroundColor Green
git checkout main
git checkout -b feature/dashboard

$dashboardFiles = @(
    "src/screens/DashboardScreen/",
    "src/components/charts/",
    "src/services/dashboardService/",
    "src/services/firebaseDashboardService/",
    "src/store/slices/dashboardSlice/",
    "src/types/dashboard.ts"
)

foreach ($file in $dashboardFiles) {
    if (Test-Path $file) {
        git add $file
        Write-Host "✅ Adicionado: $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Não encontrado: $file" -ForegroundColor Yellow
    }
}

git commit -m "📊 feat: implement dashboard with charts and analytics"
git push origin feature/dashboard

Write-Host "`n🏠 7. Voltando para main..." -ForegroundColor Green
git checkout main

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🎉 ORGANIZAÇÃO CONCLUÍDA!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n📋 Branches criadas:" -ForegroundColor White
Write-Host "🎨 - feature/ui-components" -ForegroundColor Green
Write-Host "🧭 - feature/navigation" -ForegroundColor Green
Write-Host "🔐 - feature/authentication" -ForegroundColor Green
Write-Host "💰 - feature/transactions" -ForegroundColor Green
Write-Host "📊 - feature/dashboard" -ForegroundColor Green
Write-Host "`n💡 Comandos úteis:" -ForegroundColor Yellow
Write-Host "git branch -a          # Ver todas as branches" -ForegroundColor Gray
Write-Host "git status             # Ver status atual" -ForegroundColor Gray
Write-Host "git log --oneline      # Ver commits" -ForegroundColor Gray
Write-Host "`n🚀 Pronto para desenvolvimento!" -ForegroundColor Cyan
