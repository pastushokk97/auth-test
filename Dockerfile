FROM node:18
LABEL authors="ipastu"

WORKDIR /usr/src/app

COPY . .

RUN npm ci

VOLUME /usr/src/app

RUN chmod -R 777 ./scripts/entrypoint.sh

CMD ["npm", "run", "start:dev"]