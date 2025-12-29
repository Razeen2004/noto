# Build stage (unchanged, remove debug ls lines for production)
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app (from 'build' dir thanks to vite.config.js)
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config to override default (handles SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]