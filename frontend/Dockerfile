# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets (Vite outputs to 'build' thanks to your vite.config.js)
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom config to override default (for SPA routing fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]