# ---- deps ----
    FROM node:18-alpine AS deps
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    
    # ---- builder ----
    FROM node:18-alpine AS builder
    WORKDIR /app
    COPY . .
    COPY --from=deps /app/node_modules ./node_modules
    RUN npm run build
    
    # ---- runner ----
    FROM node:18-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    # copy only what's needed for runtime
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=deps /app/node_modules ./node_modules
    # If you use next start on port 3000
    EXPOSE 3000
    RUN addgroup -S app && adduser -S app -G app
    USER app
    CMD ["npm", "start"]
    