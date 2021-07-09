FROM node AS base
ENV NODE_ENV=${NODE_ENV}

WORKDIR /base
RUN apt update && apt install -y gettext
COPY package.json ./
RUN yarn 
RUN yarn global add react-scripts typescript
COPY . .


FROM base AS build
ENV NODE_ENV=production

WORKDIR /build
COPY --from=base /base ./

RUN npm run build