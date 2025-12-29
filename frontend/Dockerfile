# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Debug: List root and check common output dirs
RUN ls -la /app
RUN echo "Checking for build folder:" && ls -la /app/build || echo "No build folder"
RUN echo "Checking for dist folder:" && ls -la /app/dist || echo "No dist folder"

# Production stage
FROM nginx:alpine

# Try build first (most likely for CRA)
COPY --from=build /app/build /usr/share/nginx/html

# If it's actually Vite and dist exists, this fallback would work (but multi-COPY isn't allowed; see alternative below)

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]