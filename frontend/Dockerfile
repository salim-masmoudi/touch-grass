## Stage 0: build using Node.js
FROM node:20 AS build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
ARG VITE_API_URL=${VITE_API_URL}
RUN npm run build

## Stage 1: serve with Nginx
FROM nginx:1
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx-backend-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf
