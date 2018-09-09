FROM node:latest

COPY . /src
WORKDIR /src
RUN cd /src; npm install && npm run build

CMD ["node", "./dist/main.js"]