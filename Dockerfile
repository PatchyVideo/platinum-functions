# syntax=docker/dockerfile:1
FROM node:14-buster-slim as BUILD_IMAGE
WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn --immutable

COPY . .

RUN yarn build

RUN yarn cache clean
RUN npm prune --production

FROM node:14-buster-slim
WORKDIR /app
ENV NODE_ENV=production

COPY --from=BUILD_IMAGE /app/dist ./dist
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "."]
