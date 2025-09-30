@echo off
echo ========================================
echo 🚀 ORGANIZANDO BRANCHES DO BYTEBANK-MOBILE
echo ========================================

echo.
echo 📋 1. Verificando status atual...
git status

echo.
echo 🎨 2. Criando branch para componentes UI...
git checkout -b feature/ui-components
git add src/components/shared/
git add src/components/forms/
git add src/utils/
git add src/constants/
git add src/assets/
git add src/hooks/useFormValidation.ts
git commit -m "🎨 feat: implement shared UI components and utilities"
git push origin feature/ui-components

echo.
echo 🧭 3. Criando branch para navegação...
git checkout main
git checkout -b feature/navigation
git add src/navigation/
git add src/screens/LoadingScreen/
git add src/config/
git add src/services/firebaseInitService/
git commit -m "🧭 feat: implement app navigation structure and Firebase config"
git push origin feature/navigation

echo.
echo 🔐 4. Criando branch para autenticação...
git checkout main
git checkout -b feature/authentication
git add src/screens/LoginScreen/
git add src/screens/RegisterScreen/
git add src/screens/ProfileScreen/
git add src/services/authService/
git add src/services/firebaseAuthService/
git add src/store/slices/authSlice/
git add src/types/auth.ts
git add src/hooks/useAuthState.ts
git commit -m "🔐 feat: implement authentication system with login, register and profile screens"
git push origin feature/authentication

echo.
echo 💰 5. Criando branch para transações...
git checkout main
git checkout -b feature/transactions
git add src/screens/AddTransactionScreen/
git add src/screens/TransactionsScreen/
git add src/services/transactionService/
git add src/services/firebaseTransactionService/
git add src/store/slices/transactionsSlice/
git add src/types/transaction.ts
git commit -m "💰 feat: implement transaction management system"
git push origin feature/transactions

echo.
echo 📊 6. Criando branch para dashboard...
git checkout main
git checkout -b feature/dashboard
git add src/screens/DashboardScreen/
git add src/components/charts/
git add src/services/dashboardService/
git add src/services/firebaseDashboardService/
git add src/store/slices/dashboardSlice/
git add src/types/dashboard.ts
git commit -m "📊 feat: implement dashboard with charts and analytics"
git push origin feature/dashboard

echo.
echo 🏠 7. Voltando para main...
git checkout main

echo.
echo ========================================
echo 🎉 ORGANIZAÇÃO CONCLUÍDA!
echo ========================================
echo.
echo 📋 Branches criadas:
echo 🎨 - feature/ui-components
echo 🧭 - feature/navigation  
echo 🔐 - feature/authentication
echo 💰 - feature/transactions
echo 📊 - feature/dashboard
echo.
echo 💡 Comandos úteis:
echo git branch -a          # Ver todas as branches
echo git status             # Ver status atual
echo git log --oneline      # Ver commits
echo.
echo 🚀 Pronto para desenvolvimento!
echo.
pause
