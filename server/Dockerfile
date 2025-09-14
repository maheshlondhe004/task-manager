# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist
COPY .env.example .env

# Create a directory for logs
RUN mkdir -p /app/logs

EXPOSE 3000

CMD ["node", "dist/index.js"]
