FROM node:current-alpine

ARG PORT

ENV PORT=4000

WORKDIR /usr/src/app

COPY . ./

RUN npm install -g serve
RUN npm install --silent
RUN npm run build

# start app
ENTRYPOINT  ["serve", "-s", "build", "-l", ${PORT}]
