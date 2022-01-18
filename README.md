<h1 align="center">Aluguel de Carros</h1>

## Algumas tecnologias

- [Node.js](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Express Framework Web](https://expressjs.com/pt-br/)
- [Docker engine](https://www.docker.com/)
- [aws-sdk S3](https://aws.amazon.com/pt/s3/)
- [aws-sdk SES](https://aws.amazon.com/pt/ses/)
- [Sentry's Node SDK](https://sentry.io/)
- [PostgresSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/#/)

## Projeto

REST api projetada para aluguel de carros, como consumidor e administrador.
Algumas possibilidades:
- Cadastro de usuário
- Cadastro de carro (como administrador)
- Listagem de carros
- Cadastro de especificação do carro (como administrador)
- Cadastro de imagem do carro (como administrador)
- Aluguel de carro (consumidor autenticado)
- Devolução de carro (consumidor autenticado)
- Recuperação de senha (localmente via ethereal ou AWS SES com as devidas credenciais configuradas via arquivo .env)

Uma documentação simplificada pode ser acessada, através da rota `/api-docs` (trabalho em progresso).

## Requerimentos

- NodeJS 14.x
- Docker engine
- Docker Compose
- Configuração do arquivo .env 
PS: A aplicação pode ser rodada utilizando o .env.example como base, com pequenas alterações. Não é obrigatório configurar credenciais AWS. Mas caso o faça, o valor para as variável `disk` seria "s3" e para `MAIL_PROVIDER`, "ses".

## Execução

- Rode `yarn` para instalar as dependências
- Rode `docker-compose up -d` para baixar imagem do postgres e redis e rodar o container
- Rode `yarn typeorm migration:run` para criar as tabelas no banco de dados.
- (Opcional) Rode `yarn seed:admim` para criar um registro de usuário com privilégio de administrador.

A autenticação é feita via [JSON Web Token](https://jwt.io/) preenchida no header da requisição.
Com a ajuda do [Swagger API](https://swagger.io/), no endpoint `/api-docs` é possível testar boa parte das rotas no browser, sem a necessidade de ferramentas como Insomnia ou Postman.

### Sentry para monitorar erros nas rotas

- Com um projeto criado no [Sentry](https://sentry.io/), copie o DSN para a variável no arquivo `.env`.