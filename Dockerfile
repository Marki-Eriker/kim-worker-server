FROM node:12-alpine

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install

COPY . /app

EXPOSE 3011

CMD ["yarn", "start:dev"]
