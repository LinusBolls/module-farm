# module farm

## about
in the hit building-focused videogame [minecraft](https://www.minecraft.net), users are able to save structures to their file system using the structure block (added in minecraft v1.9).
while there are already some online solutions to share minecraft buildings, this project aims to provide an improved user experience.

![structure block](https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/05/Structure_Block_JE2_BE1.png/revision/latest?cb=20200317230650)

### features
- uploading minecraft structures as .nbt files
- viewing uploaded structures as posts, downloading them, providing step-by-step manuals for building them
- reacting to other people's buildings

## setup

### tested with
- MacBook Air (M2, 2022), running macOS Ventura (v13.3.1)
- Docker v20.10.24

### prerequisites
- Docker ([https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/))

### development setup
1. clone the repo: `$ git clone https://github.com/LinusBolls/module-farm`.

2. run `$ npm i` to enable intellisense in your code editor.

3. run `$ npm run start-dev` to start the development docker container with hot reload at [http://localhost:3000](http://localhost:3000).

4. **EXCEPTION TO HOT RELOAD:** if you make changes to `/prisma/schema.prisma`, you will need to run `$ npm run build-prisma`. keep in mind that changing between commits or branches may also affect `/prisma/schema.prisma`!

5. after you're done developing, simply run `$ npm run stop-dev` to stop the development docker container.