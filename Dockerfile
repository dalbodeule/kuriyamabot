FROM node:latest

COPY package.json /src/package.json
COPY package-lock.json /src/package-lock.json
RUN cd /src; npm install
COPY . /src
WORKDIR /src

CMD ["node", "main.js"]