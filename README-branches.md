# 🌳 Estrutura de Branches - ByteBank Mobile

## 📋 Visão Geral
Este projeto está organizado em branches por funcionalidade para facilitar o desenvolvimento e colaboração.

## 🚀 Como Executar a Organização

### Opção 1: PowerShell (Recomendado)
```powershell
powershell -ExecutionPolicy Bypass -File organize-branches.ps1
```

### Opção 2: Batch (Windows)
```cmd
organize-branches.bat
```

## 🌳 Estrutura das Branches

### 🎨 `feature/ui-components`
**Componentes compartilhados e utilitários**
- `src/components/shared/` - Componentes reutilizáveis
- `src/components/forms/` - Componentes de formulário
- `src/utils/` - Funções utilitárias
- `src/constants/` - Constantes da aplicação
- `src/assets/` - Assets estáticos
- `src/hooks/useFormValidation.ts` - Hook de validação

### 🧭 `feature/navigation`
**Estrutura de navegação e configuração**
- `src/navigation/` - Configuração de navegação
- `src/screens/LoadingScreen/` - Tela de carregamento
- `src/config/` - Configurações da aplicação
- `src/services/firebaseInitService/` - Inicialização do Firebase

### 🔐 `feature/authentication`
**Sistema de autenticação**
- `src/screens/LoginScreen/` - Tela de login
- `src/screens/RegisterScreen/` - Tela de registro
- `src/screens/ProfileScreen/` - Tela de perfil
- `src/services/authService/` - Serviços de autenticação
- `src/services/firebaseAuthService/` - Autenticação Firebase
- `src/store/slices/authSlice/` - Estado de autenticação
- `src/types/auth.ts` - Tipos de autenticação
- `src/hooks/useAuthState.ts` - Hook de estado de auth

### 💰 `feature/transactions`
**Gestão de transações**
- `src/screens/AddTransactionScreen/` - Adicionar transação
- `src/screens/TransactionsScreen/` - Lista de transações
- `src/services/transactionService/` - Serviços de transação
- `src/services/firebaseTransactionService/` - Transações Firebase
- `src/store/slices/transactionsSlice/` - Estado de transações
- `src/types/transaction.ts` - Tipos de transação

### 📊 `feature/dashboard`
**Dashboard e gráficos**
- `src/screens/DashboardScreen/` - Tela principal
- `src/components/charts/` - Componentes de gráficos
- `src/services/dashboardService/` - Serviços do dashboard
- `src/services/firebaseDashboardService/` - Dashboard Firebase
- `src/store/slices/dashboardSlice/` - Estado do dashboard
- `src/types/dashboard.ts` - Tipos do dashboard

## 🔄 Ordem de Merge Recomendada

1. **🎨 UI Components** - Base para outros componentes
2. **🧭 Navigation** - Estrutura da aplicação
3. **🔐 Authentication** - Sistema de autenticação
4. **💰 Transactions** - Gestão de dados
5. **📊 Dashboard** - Visualização e analytics

## 💡 Comandos Úteis

```bash
# Ver todas as branches
git branch -a

# Ver status atual
git status

# Ver histórico de commits
git log --oneline

# Mudar para uma branch específica
git checkout feature/dashboard

# Ver diferenças entre branches
git diff main feature/dashboard

# Fazer merge de uma branch
git checkout main
git merge feature/ui-components
```

## 🎯 Próximos Passos

1. Execute o script de organização
2. Desenvolva em cada branch conforme necessário
3. Faça merge seguindo a ordem recomendada
4. Mantenha a main sempre estável

## 🚨 Importante

- Sempre faça pull antes de começar a trabalhar
- Teste cada funcionalidade antes do merge
- Mantenha commits pequenos e descritivos
- Use emojis nos commits para melhor organização
