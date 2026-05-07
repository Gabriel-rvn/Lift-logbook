## 🏆 Sistema de Ranks

Seu rank é calculado automaticamente pela **soma dos seus 3 melhores PRs** (um de cada exercício):

| Total (KG) |      Rank       | Ícone |
| :--------: | :-------------: | :---: |
|  0 – 199   |    **Iron**     |  ⚙️   |
| 200 – 299  |   **Bronze**    |  🥉   |
| 300 – 399  |   **Silver**    |  🥈   |
| 400 – 499  |    **Gold**     |  🥇   |
| 500 – 599  |  **Platinum**   |  💎   |
| 600 – 699  |   **Diamond**   |  💠   |
| 700 – 799  |   **Master**    |  👑   |
| 800 – 899  | **Grandmaster** |  🔱   |
|    900+    | **Challenger**  |  ⚡   |

### Inicie o servidor de desenvolvimento

```bash
npm run web
```

### Acesse no navegador

Abra o navegador e acesse:

```
http://localhost:8081
```

O app será carregado automaticamente. O Metro Bundler pode levar alguns segundos na primeira compilação.

### Outros comandos

| Comando           | Descrição                                    |
| ----------------- | -------------------------------------------- |
| `npm run start`   | Inicia o servidor Expo (QR code para mobile) |
| `npm run web`     | Inicia diretamente na versão web             |
| `npm run android` | Abre no emulador/dispositivo Android         |
| `npm run ios`     | Abre no simulador iOS (apenas macOS)         |

---

## 📱 Como Usar o App

### Primeiro Acesso

Ao abrir o app pela primeira vez, você verá o **estado vazio**: Rank **Iron**, pontuação **0 KG**, e a mensagem "Nenhum PR registrado ainda".

### Registrar um PR

1. Toque no botão **"+"** dourado no canto inferior direito da tela
2. Selecione o exercício desejado (**Agachamento**, **Supino** ou **Terra**)
3. Digite o peso em **KG** no campo numérico
4. Toque em **"Registrar"**
5. Aguarde a confirmação ✅ — o modal fechará automaticamente

### Acompanhar o Progresso

- O **Rank Badge** e a **Pontuação Total** no topo da tela atualizam automaticamente após cada registro
- A seção **🏆 Personal Records** mostra o **melhor PR** de cada exercício
- A seção **📊 Histórico de Progresso** mostra **todos os registros** ordenados do mais recente ao mais antigo

---

## Arquitetura do Projeto

```
src/
├── components/              # Componentes reutilizáveis
│   ├── AddPRModal/          # Modal de registro de PR
│   ├── PRCard/              # Card de Personal Record
│   ├── ProgressTable/       # Tabela de histórico
│   ├── RankBadge/           # Badge visual do tier/rank
│   └── index.ts             # Barrel exports
├── constants/
│   ├── theme.ts             # Design system (cores, fontes, espaçamento)
│   └── mockData.ts          # Dados simulados (fallback)
├── contexts/
│   └── AuthContext.tsx      # Provedor de contexto global para estado de Autenticação
├── lib/
│   └── supabase.ts          # Client do Supabase (agora persistindo com AsyncStorage)
├── screens/
│   ├── HomeScreen.tsx       # Tela principal (Dashboard)
│   ├── LoginScreen.tsx      # Tela de login
│   ├── SignUpScreen.tsx     # Tela de cadastro
│   └── index.ts
├── services/
│   ├── authService.ts       # Funções de login, cadastro, logout
│   └── prService.ts         # CRUD — comunicação com o Supabase (vinculado ao usuário)
└── types.ts                 # Tipagem global (TypeScript)
```

---

## Stack Tecnológica

| Tecnologia           | Uso                                               |
| -------------------- | ------------------------------------------------- |
| **React Native**     | Framework mobile cross-platform                   |
| **Expo SDK 54**      | Toolchain para desenvolvimento e build            |
| **TypeScript**       | Tipagem estática e segurança de código            |
| **Supabase Auth**    | Serviço completo de gerenciamento de sessão e RLS |
| **Supabase DB**      | Backend-as-a-Service (PostgreSQL + REST API)      |
| **AsyncStorage**     | Persistência local da sessão (Token JWT)          |
| **React Native Web** | Permite rodar o app no navegador                  |

---

## Sistema de Autenticação

- **O que acontece:** O aplicativo agora conta com um sistema completo de autenticação (Cadastro, Login e Logout) utilizando Email e Senha. Cada PR registrado no sistema pertence exclusivamente ao usuário que o criou. O fluxo garante que usuários deslogados sejam redirecionados para a tela de autenticação e que cada sessão seja individual.
- **Como acontece:** A autenticação é gerenciada pelo **Supabase Auth**. A sessão do usuário (Token JWT) é persistida localmente no dispositivo através do `@react-native-async-storage/async-storage` para que não seja necessário fazer login novamente ao reabrir o app. A segurança e privacidade dos dados são garantidas por meio do **Row Level Security (RLS)** configurado no banco de dados, que bloqueia o acesso e edições baseando-se na validação do `auth.uid()`.
- **Onde a informação é buscada:** Os dados de autenticação e sessão vêm da API do Supabase Auth e do AsyncStorage. Os dados dos levantamentos de peso são buscados na tabela `pr_records`, que agora obriga o preenchimento de uma coluna `user_id` vinculada a `auth.users`.
- **Quem está buscando:**
  - O **`authService.ts`** comunica-se diretamente com o Supabase Auth para realizar as operações de criar conta, fazer login, obter a sessão e sair.
  - O **`AuthContext.tsx`** é o guardião do estado global na aplicação: ele escuta ativamente as mudanças na sessão (eventos de login/logout) e espalha o `user` autenticado para todas as telas que necessitarem.
  - O **`prService.ts`** é o serviço de banco de dados responsável pelas queries. Ao realizar novas inserções, ele usa o ID de usuário do Contexto para vincular os PRs criados ao respectivo dono.

---

## Roadmap

- [x] 🔐 Autenticação de usuários (Supabase Auth)
- [ ] 📐 Cálculo de rank por **DOTS Score** (peso corporal)
- [ ] 📈 Gráfico de evolução dos PRs ao longo do tempo
- [ ] 🔔 Notificações quando subir de rank
- [ ] 🏋️ Suporte a exercícios adicionais
- [ ] 👥 Leaderboard — ranking entre amigos
- [ ] 🎯 Sistema de conquistas / achievements

---

## Licença

Este projeto é privado e de uso pessoal.
