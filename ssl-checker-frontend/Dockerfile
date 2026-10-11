# ========================================================
# SSLGuard Frontend - Multi-Stage Production Dockerfile
# ========================================================

# Stage 1: Build stage with Node 20 Alpine
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests and install dependencies cleanly
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Run production TypeScript verification and Vite compilation
RUN npm run build

# Stage 2: Minimal Nginx Alpine web server
FROM nginx:1.25-alpine AS runner

# Copy compiled static distribution from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy optimized Nginx reverse proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
