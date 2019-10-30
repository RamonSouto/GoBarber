## APP GOBARBER

Aplicativo criado no desafio 2 do módulo NodeJs no bootcamp 7 da Rocketseat.

O aprendizado foi na base de rotas, como elas funcionam da maneira correta, além de criar padrões de projeto MVC, apredemos sobre o uso do nunjucks para renderizar as views.

Além disso foi criado passo a passo o processo de autenticação e criação de usuário, por meio do uso do Sequelize para BD, configurado em uma base de dados PostgresSQL, usando uma máquina virtual Docker para tal.

### **Ferramentas utilizadas no projeto**
**VS Code** - O Visual Studio Code é um editor de código-fonte leve, mas poderoso, que roda na sua área de trabalho e está disponível para Windows, macOS e Linux. Ele vem com suporte interno para JavaScript, TypeScript e Node.js e possui um rico ecossistema de extensões para outras linguagens (como C ++, C #, Java, Python, PHP, Go) e tempos de execução (como .NET e Unity).

**Insomnia REST Client** - O Insomnia é um aplicativo de desktop multiplataforma gratuito que elimina a necessidade de interagir com APIs baseadas em HTTP

**PostBird** - Postbird é um cliente GUI PostgreSQL multiplataforma, escrito em JavaScript, executado com o Electron


### **Instalar as dependências.**

> `npm install`

> `yarn add`

### **Rodar projeto - Principal**

>`yarn dev`

>`nodemon src/server.js`

### **Rodar projeto - Queue**

>`yarn queue`

>`nodemon src/queue.js`

### **Dependencias utilizadas**
1. **@sentry/node** - *5.7.1*
2. **bcryptjs** - *^2.4.3*
3. **bee-queue** - *^1.2.2*
4. **date-fns** - *^2.5.0*
5. **dotenv** - *^8.2.0*
6. **eslint-config-prettier** - *^6.3.0*
7. **eslint-plugin-prettier** - *^3.1.1*
8. **express** - *^4.17.1*
9. **express-async-errors** - *^3.1.1*
10. **express-handlebars** - *^3.1.0*
11. **jsonwebtoken** - *^8.5.1*
12. **mongoose** - *^5.7.7*
13. **multer** - *^1.4.2*
14. **nodemailer** - *^6.3.1*
15. **nodemailer-express-handlebars** - *^3.1.0*
16. **pg** - *^7.12.1*
17. **pg-hstore** - *^2.3.3*
18. **prettier** - *^1.18.2*
19. **sequelize** - *^5.19.2*
20. **youch** - *^2.0.10*
21. **yup** - *^0.27.0*

### **Dependencias de desenvolvimento**
1. **eslint1.** - *^6.5.1*
2. **eslint-config-airbnb-base** - *^14.0.0*
3. **eslint-plugin-import** - *^2.18.2*
4. **nodemon** - *^1.19.3*
5. **sequelize-cli** - *^5.5.1*
6. **sucrase** - *^3.10.1*

### **DOCKER - DOWN IMAGES**
**PostgresSQL**
```docker
docker run --name database -e POSTGRES_PASSWORD=****** -p 5432:5432 -d postgres
```
**MongoDB**
```docker
docker run --name mongobarber -p 27017:27017 -d -t mongo
```
**Redis**
```docker
docker run --name redisgobarber -p 6379:6379 -d -t redis:alpine
```

### **DOCKER - START**
**PostgresSQL**
```docker
docker start database
```
**MongoDB**
```docker
docker start mongobarber
```
**Redis**
```docker
docker start redisgobarber
```
### **DOCKER - STOP**
**PostgresSQL**
```docker
docker stop database
```
**MongoDB**
```docker
docker stop mongobarber
```
**Redis**
```docker
docker stop redisgobarber
```
