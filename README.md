# ByteBank Mobile - Aplicativo de Gestão Financeira

Um aplicativo mobile completo para gestão financeira pessoal, desenvolvido em React Native com Expo, seguindo Clean Architecture e integrado ao Firebase para autenticação, armazenamento de dados e upload de arquivos.

## 🚀 Funcionalidades

### ✅ Implementadas

- **Dashboard Interativo**
  - Gráficos de receitas vs despesas (linha)
  - Gráfico de categorias de despesas (pizza)
  - Gráfico de tendência mensal (barras)
  - Animações suaves nas transições
  - Métricas financeiras em tempo real

- **Gestão de Transações**
  - Adicionar/editar transações
  - Validação avançada de campos
  - Upload de recibos e comprovantes
  - Categorização automática
  - Filtros avançados (data, categoria, valor, tipo)
  - Busca em tempo real

- **Autenticação Segura**
  - Login e registro com Firebase Auth
  - Gerenciamento de sessão
  - Proteção de rotas

- **Interface Moderna**
  - Design responsivo
  - Animações fluidas
  - Tema consistente
  - Componentes reutilizáveis

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **Redux Toolkit** - Gerenciamento de estado avançado
- **Reselect** - Selectors memoizados para performance
- **RxJS** - Programação reativa
- **Firebase** - Backend como serviço
  - Authentication
  - Firestore Database
  - Storage
- **React Navigation** - Navegação
- **React Native Gifted Charts** - Gráficos
- **Expo Secure Store** - Armazenamento seguro de dados sensíveis
- **Expo Document Picker** - Upload de arquivos

## 🔧 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/DionataBergmann/bytebank-mobile.git
   cd bytebank-mobile
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure o Firebase**
   - Configure as variáveis de ambiente no arquivo `.env`

4. **Execute o projeto**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

## 📱 Arquitetura do Projeto

O projeto segue **Clean Architecture** com separação clara de responsabilidades:

### Estrutura de Pastas

```
src/
├── domain/             # Camada de Domínio (regras de negócio)
│   ├── entities/       # Entidades do domínio
│   ├── repositories/   # Interfaces dos repositórios
│   └── usecases/      # Casos de uso (lógica de negócio)
├── infrastructure/     # Camada de Infraestrutura
│   ├── data/          # Implementação dos repositórios
│   ├── cache/         # Sistema de cache
│   ├── security/      # Segurança e criptografia
│   ├── reactive/      # Programação reativa (RxJS)
│   └── di/            # Injeção de dependências
├── presentation/       # Camada de Apresentação
│   ├── screens/       # Telas da aplicação
│   ├── components/    # Componentes reutilizáveis
│   └── navigation/    # Navegação
├── store/             # Redux store
│   ├── slices/        # Redux slices
│   ├── selectors/     # Selectors memoizados
│   └── middleware/    # Middlewares customizados
├── hooks/             # Custom hooks
├── utils/             # Utilitários
└── constants/         # Constantes e configurações
```

### Princípios da Arquitetura

- **Separação de Camadas**: Domain, Infrastructure e Presentation
- **Inversão de Dependências**: Domain não depende de Infrastructure
- **Reutilização**: Componentes e hooks reutilizáveis
- **Testabilidade**: Código organizado e fácil de testar

## 🎯 Funcionalidades Detalhadas

### Dashboard
- **Métricas Financeiras**: Saldo total, receitas, despesas, taxa de poupança
- **Gráficos Interativos**: Visualização de dados com animações
- **Períodos**: Visualização por semana, mês ou ano
- **Transações Recentes**: Lista das últimas transações

### Transações
- **CRUD Completo**: Criar, ler, atualizar e deletar transações
- **Filtros Avançados**: Por data, categoria, tipo, valor
- **Busca em Tempo Real**: Pesquisa reativa com debounce
- **Upload de Arquivos**: Comprovantes e recibos
- **Validação Avançada**: 
  - Validação de valor (mínimo > 0, máximo R$ 1.000.000,00)
  - Validação de categoria (obrigatória, lista válida)
  - Mensagens de erro claras e específicas

### Autenticação
- **Login/Registro**: Com email e senha (inputs sanitizados)
- **Gerenciamento de Sessão**: 
  - Persistência segura com criptografia
  - Refresh automático de tokens
  - Validação de sessão antes de operações sensíveis
- **Proteção de Rotas**: Acesso controlado por autenticação

## 🔒 Segurança

- **Armazenamento Seguro**: Tokens e dados sensíveis criptografados com expo-secure-store (Keychain/Keystore)
- **Gerenciamento de Sessão**: Validação automática, refresh de tokens e persistência segura
- **Sanitização de Inputs**: Proteção contra XSS e SQL Injection
- **Autenticação**: Firebase Auth com validação de sessão
- **Validação Avançada**: Validação robusta de campos (valor, categoria, etc.)
- **Regras de Segurança**: Firestore com regras de acesso

## 📊 Performance

- **Lazy Loading**: Carregamento sob demanda de screens e componentes
- **Pre-loading**: Pré-carregamento de dados críticos após login
- **Cache Inteligente**: Sistema de cache com TTL para otimizar requisições
- **Selectors Memoizados**: Reselect para evitar recálculos desnecessários
- **Programação Reativa**: RxJS para atualizações em tempo real eficientes
- **Otimização de Re-renders**: React.memo em componentes pesados
- **Debounce**: Otimização de buscas e inputs

## 📦 Build

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

## 🚀 Deploy

### Expo
```bash
expo publish
```

## 🏗️ Arquitetura Implementada

### Clean Architecture

O projeto implementa Clean Architecture com três camadas principais:

1. **Domain Layer**: Contém as regras de negócio puras
   - Entities: Entidades do domínio (Transaction, User, Dashboard)
   - Repositories Interfaces: Contratos para acesso a dados
   - Use Cases: Lógica de negócio e validações

2. **Infrastructure Layer**: Implementações concretas
   - Repositories: Implementação dos contratos usando Firebase
   - Cache: Sistema de cache com AsyncStorage
   - Security: Armazenamento seguro e gerenciamento de sessão
   - Reactive: Observables RxJS para dados em tempo real
   - DI Container: Injeção de dependências centralizada

3. **Presentation Layer**: Interface do usuário
   - Screens: Telas da aplicação
   - Components: Componentes reutilizáveis
   - Navigation: Configuração de navegação

### State Management

- **Redux Toolkit**: Gerenciamento de estado global
- **Reselect**: Selectors memoizados para performance
- **Custom Middlewares**: Logger e tratamento de erros
- **TypeScript**: Tipagem forte para type-safety

### Programação Reativa

- **RxJS**: Observables para dados em tempo real
- **Firestore onSnapshot**: Atualizações automáticas
- **Custom Hooks**: useReactiveData, useReactiveSearch
- **Debounce**: Otimização de buscas

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

