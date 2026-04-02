# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN sed -i "s/'assets',e.forEach/['assets'].forEach/g" dist/public/assets/remoteEntry.js

# Production stage
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/public .
COPY nginx-default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
