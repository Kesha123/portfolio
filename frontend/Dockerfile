FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm install
COPY . ./
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine3.20-perl
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8080
