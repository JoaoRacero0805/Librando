# Librando

Aplicativo web para aprender **Libras** (Língua Brasileira de Sinais) de forma gamificada. O aluno segue uma trilha de lições guiada pela mascote **Lili**, assiste a vídeos dos sinais, resolve exercícios e quizzes, e acompanha o próprio progresso e a ofensiva (dias seguidos de estudo).

Acesse: **[librandotcc.com.br](https://www.librandotcc.com.br/)**

Projeto de TCC. Instagram: [@librando.tcc](https://www.instagram.com/librando.tcc)

## Funcionalidades

- Cadastro e login de usuários
- Trilha de lições com marcação das lições concluídas, salva no banco
- Ofensiva diária (atual e melhor)
- Vídeos e imagens dos sinais: alfabeto manual e frases do dia a dia (oi, tchau, meu nome, obrigado, por favor, me ajuda, família, sentimentos e outras)
- Exercícios de ordenar, escolher a resposta certa e quizzes
- Guia de estudo da unidade
- Tradução de textos do site para Libras com o plugin [VLibras](https://vlibras.gov.br/)

## Tecnologias

| Parte | Tecnologias |
| --- | --- |
| Frontend | HTML, CSS e JavaScript puro (sem framework), VLibras |
| Backend | Node.js, Express 5, Mongoose, CORS, dotenv |
| Banco de dados | MongoDB Atlas |
| Hospedagem | Frontend na Vercel, API no Railway |

## Estrutura do repositório

```
.
├── frontend/                 # Site estático
│   ├── index.html            # Página inicial (entrar / cadastrar)
│   ├── login.html            # Login
│   ├── cadastro.html         # Cadastro
│   ├── caminho.html          # Trilha de lições e ofensiva
│   ├── guia.html             # Guia da unidade
│   ├── atividades.html       # Lição 1 (segue para ordem, escolha e acertou)
│   ├── licao2.html ...       # Lições 2 a 6 e suas etapas (licaoN-2, licaoN-3...)
│   ├── ordem*.html           # Exercícios de ordenar
│   ├── escolha.html          # Exercício de escolher a resposta
│   ├── quiz*.html            # Quizzes
│   ├── acertou.html          # Tela de acerto, atualiza a ofensiva
│   ├── css/                  # Estilos
│   ├── js/
│   │   ├── config.js         # URL da API usada pelo site
│   │   ├── caminho.js        # Carrega e salva o progresso da trilha
│   │   ├── acertou.js        # Atualiza a ofensiva
│   │   └── JsAtividadeR.js
│   ├── img/                  # Imagens da Lili, letras do alfabeto e ícones
│   └── gestos/               # Vídeos e fotos dos sinais
└── backend/                  # API REST
    ├── app.js                # Ponto de entrada (porta 3000)
    ├── db/index.js           # Conexão com o MongoDB
    ├── models/userModel.js   # Modelo de usuário (quests e ofensiva)
    ├── controllers/index.js  # Regras de cada rota
    ├── routes/index.js       # Definição das rotas
    └── .env.example          # Variáveis de ambiente necessárias
```

## Como rodar

### Backend

Requisitos: Node.js 18 ou superior e acesso a um cluster do MongoDB Atlas.

```bash
cd backend
npm install
cp .env.example .env   # preencha DB_USER e DB_PASS
npm start              # inicia com nodemon em http://localhost:3000
```

O endereço do cluster fica em `backend/db/index.js`. Se usar outro cluster, troque a `mongoURI` lá.

### Frontend

O frontend é estático, então basta servir a pasta `frontend/`:

```bash
cd frontend
npx serve .            # ou: python3 -m http.server 8080
```

Depois abra o endereço mostrado no terminal. Por padrão o site usa a API de produção. Para usar a API local, troque a URL em `frontend/js/config.js`:

```js
const CONFIG = {
  URL: "http://localhost:3000"
};
```

## Rotas da API

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/` | Mensagem de boas-vindas |
| POST | `/register` | Cadastra usuário (`name`, `email`, `password`) |
| POST | `/login` | Faz login (`email`, `password`) e devolve o `id` do usuário |
| GET | `/user/:id` | Dados do usuário (sem a senha) |
| GET | `/user/:id/quests` | Lições concluídas e ofensiva |
| POST | `/user/:id/quest` | Marca uma lição (`key`, `value`) e atualiza a ofensiva |
| POST | `/update-streak/:id` | Atualiza a ofensiva |

Depois do login, o site guarda o `id` do usuário no `localStorage` e usa esse valor nas chamadas seguintes.
