# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy only package.json (not lockfile) so npm resolves fresh on Linux
COPY package.json ./

RUN npm config set strict-ssl false
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:1.25-alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script for runtime env injection
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
