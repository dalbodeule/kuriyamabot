FROM node:latest

COPY package.json /src/package.json
COPY package-lock.json /src/package-lock.json
RUN cd /src; npm install
COPY . /src
WORKDIR /src

ENV apiKey null
ENV dev true
ENV database null
ENV dbuser null
ENV dbpw null
ENV dbhost null
ENV dbtype mysql
ENV whatanime null

CMD ["node", "main.js"]