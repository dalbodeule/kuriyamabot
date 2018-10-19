FROM node:latest

COPY . /src
WORKDIR /src
RUN npm install && npm audit fix && npm run build

CMD ["node", "./dist/index.js"]