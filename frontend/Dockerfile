# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
RUN ls -la /app  # Add this: lists contents of /app (should show 'dist')
RUN ls -la /app/dist  # Add this: lists contents of dist (should show index.html, assets, etc.)

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]