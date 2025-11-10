# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies based on package-lock.json
COPY package*.json ./
RUN npm ci

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app

# Copy everything and install node_modules from deps stage
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build the Next.js app
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only necessary files for runtime
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=deps /app/node_modules ./node_modules

# Next.js default port
EXPOSE 3000

# Create a non-root user
RUN addgroup -S app && adduser -S app -G app
USER app

# Start Next.js f
CMD ["npm", "start"]
 