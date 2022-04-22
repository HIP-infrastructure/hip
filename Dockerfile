FROM node:17 AS base

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /base

RUN apt update && apt install -y gettext

RUN npm install -g npm@8.3.0
RUN npm install -g react-scripts typescript --silent
COPY package.json ./
RUN npm install
COPY . .


# RUN chown -R node:node /base
# USER node

RUN mkdir node_modules/.cache
RUN chmod -R 777 node_modules/.cache


FROM base AS build
ENV NODE_ENV=production

WORKDIR /build
COPY --from=base /base ./
RUN npm run publish
