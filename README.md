# cascade ai

## about
*cascade ai* makes powerful ai workflows available to the common man, pioneering the next generation of automation tools.
cascade offers a visual drag-and-drop editor for combining integrations with 3rd-party services like notion, slack or jira with the flexibility of chat-gpt.

![structure block](https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/05/Structure_Block_JE2_BE1.png/revision/latest?cb=20200317230650)

### features
- create workflows in our simple visual editor
- COMING SOON: execute workflows to automate complex multi-step tasks
- COMING SOON: collaborate on workflows in real time

## setup

### tested with
- MacBook Air (M2, 2022), running macOS Ventura (v13.3.1)
- Docker v20.10.24

### prerequisites
- Docker ([https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/))

### development setup

1. clone the repo: `$ git clone https://github.com/LinusBolls/module-farm`.

2. run `$ npm i --force` to enable intellisense in your code editor.

3. run `$ (export ENVIRONMENT=dev; npm run start-dev)` to start he development docker container with hot reload at [http://localhost:3000](http://localhost:3000).

4. **EXCEPTION TO HOT RELOAD:** if you make changes to `/prisma/schema.prisma`, you will need to run `$ npm run build-prisma`. keep in mind that changing between commits or branches may also affect `/prisma/schema.prisma`!

5. **EXCEPTION TO HOT RELOAD:** after installing new dependencies, you will need to run `$ npm run restart-dev`. keep in mind that changing between commits or branches may also affect your dependencies!

6. go into the terminal of the `web-client` container (either through the Docker desktop app or using `$ docker compose run`) and run `$ npx prisma db seed`.

### production setup

1. clone the repo: `$ git clone https://github.com/LinusBolls/module-farm`.

2. run `$ (export ENVIRONMENT=production; npm run start-dev)` to start the production docker container at [http://localhost:3000](http://localhost:3000).

3. go into the terminal of the `web-client` container (either through the Docker desktop app or using `$ docker compose run`) and run `$ npx prisma db seed`.