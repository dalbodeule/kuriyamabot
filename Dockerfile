FROM node:latest

COPY . /src
WORKDIR /src
RUN npm install
RUN npm run build

CMD ["node", "./dist/index.js"]