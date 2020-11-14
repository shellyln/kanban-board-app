FROM node:current-alpine

ARG PORT
ARG READY_BUILD

ENV PORT=4000

WORKDIR /usr/src/app

COPY ./${READY_BUILD} ./${READY_BUILD}

RUN npm install -g serve
RUN if [ -z "$READY_BUILD" ]; then npm install --silent; npm run build; fi

# start app
ENTRYPOINT  serve -s build -l ${PORT}
