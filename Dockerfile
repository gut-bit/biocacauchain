# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
# Use npm install instead of npm ci to handle any lockfile inconsistencies
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy built artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/attached_assets ./attached_assets
COPY --from=builder /app/migrations ./migrations

EXPOSE 8080

CMD ["node", "dist/index.cjs"]
