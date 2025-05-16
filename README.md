# EJG Cestas Básicas

Sistema de gerenciamento de vendas de cestas básicas da EJG.

## 🚀 Tecnologias

- Next.js 14
- TypeScript
- Prisma (MySQL)
- NextAuth.js
- Tailwind CSS
- Framer Motion

## 📋 Pré-requisitos

- Node.js 18 ou superior
- MySQL 8.0 ou superior
- NPM ou Yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd ejg-site
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
# Banco de dados
DATABASE_URL="mysql://seu_usuario:sua_senha@localhost:3306/ejg_site"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua_chave_secreta" # Gere uma chave com: openssl rand -base64 32

# Upload (opcional)
UPLOAD_API_KEY="sua_chave_api"
```

4. Configure o banco de dados:
```bash
# Crie o banco de dados MySQL
mysql -u root -p
CREATE DATABASE ejg_site;
exit;

# Gere o cliente Prisma
npm run prisma:generate

# Execute as migrações
npm run prisma:migrate

# (Opcional) Popule o banco com dados iniciais
npm run prisma:seed
```

## 🛠️ Desenvolvimento

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

2. Acesse `http://localhost:3000`

## 📦 Build e Produção

1. Crie uma build de produção:
```bash
npm run build
# ou
yarn build
```

2. Inicie o servidor de produção:
```bash
npm run start
# ou
yarn start
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Crie uma conta na [Vercel](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente na Vercel
4. Deploy automático a cada push na branch main

### Outros Serviços

#### Railway
1. Crie uma conta no [Railway](https://railway.app)
2. Conecte seu repositório
3. Configure as variáveis de ambiente
4. Deploy automático

#### DigitalOcean
1. Crie uma conta no [DigitalOcean](https://digitalocean.com)
2. Crie um App Platform
3. Conecte seu repositório
4. Configure as variáveis de ambiente
5. Deploy

## 📝 Estrutura do Projeto

```
ejg-site/
├── prisma/           # Configuração do banco de dados
├── public/           # Arquivos estáticos
├── src/
│   ├── app/         # Rotas e páginas
│   ├── components/  # Componentes React
│   ├── contexts/    # Contextos React
│   └── lib/         # Utilitários e configurações
└── ...
```

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| DATABASE_URL | URL de conexão com o MySQL | Sim |
| NEXTAUTH_URL | URL base da aplicação | Sim |
| NEXTAUTH_SECRET | Chave secreta para o NextAuth | Sim |
| UPLOAD_API_KEY | Chave da API de upload | Não |

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para [seu-email@dominio.com] ou abra uma issue no GitHub. 