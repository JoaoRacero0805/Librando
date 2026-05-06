# API

Uma API simples de autenticação desenvolvida com **Node.js**, **Express** e **MongoDB**.

---

## 🔧 Personalização

Este projeto é totalmente aberto para modificações. O usuário tem liberdade para alterar, adaptar ou expandir a API conforme suas necessidades específicas.

---

## 🔐 Funcionalidades

- Registro de usuários
- Autenticação (Login)
- Consulta de informações do usuário (com exclusão da senha)

---

## 📁 Estrutura do Projeto

```
raiz/
├── controllers/
├── db/
├── models/
├── routes/
├── .env
├── app.js
├── package.json
```

---

## 🛠️ Tecnologias Utilizadas

- Node.js
- Express
- MongoDB / Mongoose
- Dotenv

---

## 📦 Instalação

1. Acesse o diretório do projeto:

```bash
cd api
```

2. Crie um arquivo `.env` na raiz do projeto com as variáveis abaixo:

```env
DB_USER= # Usuário do banco de dados
DB_PASS= # Senha do banco de dados
```

3. Instale as dependências:

```bash
npm install
```

---

## ▶️ Execução

Inicie a aplicação com o comando:

```bash
npm start
```

A API estará disponível em:

```
http://localhost:3000
```

---

## 📌 Endpoints

### `GET /`

- Retorna uma mensagem de boas-vindas.

---

### `POST /register`

- Registra um novo usuário.
- **Body (JSON):**

```json
{
  "name": "João",
  "email": "joao@email.com",
  "password": "123456"
}
```

---

### `POST /login`

- Realiza a autenticação de um usuário.
- **Body (JSON):**

```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

---

### `GET /user/:id`

- Retorna os dados do usuário (exceto a senha).

---

## ⚠️ Aviso Importante

Esta API tem finalidade **exclusivamente educacional e de demonstração**.
Não deve ser utilizada em ambientes de produção, pois não implementa medidas de segurança adequadas.

---

## 🧪 Testes

Recomenda-se utilizar o [Postman](https://www.postman.com/) para testar as rotas da API.
