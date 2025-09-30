# ByteBank Mobile - Aplicativo de Gestão Financeira

Um aplicativo mobile completo para gestão financeira pessoal, desenvolvido em React Native com Expo, integrado ao Firebase para autenticação, armazenamento de dados e upload de arquivos.

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
- **Redux Toolkit** - Gerenciamento de estado
- **Firebase** - Backend como serviço
  - Authentication
  - Firestore Database
  - Storage
- **React Navigation** - Navegação
- **React Native Gifted Charts** - Gráficos
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

## 📱 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── charts/         # Componentes de gráficos
│   ├── forms/          # Formulários
│   └── shared/         # Componentes compartilhados
├── screens/            # Telas da aplicação
├── services/           # Serviços de API
├── store/              # Redux store
│   └── slices/         # Redux slices
├── types/              # Definições de tipos
├── utils/              # Utilitários
└── hooks/              # Custom hooks
```

## 🎯 Funcionalidades Detalhadas

### Dashboard
- **Métricas Financeiras**: Saldo total, receitas, despesas, taxa de poupança
- **Gráficos Interativos**: Visualização de dados com animações
- **Períodos**: Visualização por semana, mês ou ano
- **Transações Recentes**: Lista das últimas transações

### Transações
- **CRUD Completo**: Criar, ler, atualizar e deletar transações
- **Filtros Avançados**: Por data, categoria, tipo, valor
- **Busca em Tempo Real**: Pesquisa por descrição
- **Upload de Arquivos**: Comprovantes e recibos
- **Validação Robusta**: Validação de todos os campos

### Autenticação
- **Login/Registro**: Com email e senha
- **Gerenciamento de Sessão**: Persistência de login
- **Proteção de Rotas**: Acesso controlado

## 🔒 Segurança

- Autenticação obrigatória para todas as operações
- Regras de segurança do Firestore
- Validação de dados no frontend e backend
- Upload seguro de arquivos
- Proteção contra injeção de dados

## 📊 Performance

- Scroll infinito para listas grandes
- Debounce na busca para otimizar queries
- Cache de dados com Redux
- Lazy loading de componentes
- Otimização de re-renders

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

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

