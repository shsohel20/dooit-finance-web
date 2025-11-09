# ---- Base image ----
FROM node:20-alpine AS base
ENV NODE_ENV=production
WORKDIR /app
# small deps useful for some native packages (sharp, etc.)
RUN apk add --no-cache libc6-compat

# ---- deps: install dependencies (respects pnpm/yarn/npm lockfiles) ----
FROM base AS deps
# copy manifest files only to leverage layer caching
COPY package.json package-lock.json pnpm-lock.yaml yarn.lock* ./

# Use a shell script style decision to pick package manager based on lockfile
# - pnpm if pnpm-lock.yaml present
# - npm if package-lock.json present
# - yarn if yarn.lock present
# - fall back to npm install if none
RUN set -eux; \
    if [ -f pnpm-lock.yaml ]; then \
      corepack enable pnpm && corepack prepare pnpm@latest --activate && pnpm i --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
      npm ci --only=production; \
    elif [ -f yarn.lock ]; then \
      corepack enable yarn && yarn install --frozen-lockfile --production; \
    else \
      npm ci || npm install; \
    fi

# ---- builder: copy source, install dev deps, build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
# copy dependencies from deps stage (node_modules). If pnpm was used, pnpm stores files differently,
# but copying node_modules should still work for most cases when pnpm has created a node_modules folder.
COPY --from=deps /app/node_modules ./node_modules
# If you use pnpm with a workspace layout and no node_modules is present, you may need to run install here as well.
# Build the Next.js app
RUN npm run build

# ---- runner: runtime image (production) ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# create non-root user
RUN addgroup -S app && adduser -S app -G app

# copy only runtime artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
# copy node_modules from deps (production dependencies)
COPY --from=deps /app/node_modules ./node_modules

# expose port Next.js listens on (default 3000)
EXPOSE 3000

USER app

# Start using "next start" if you have it in package.json scripts:
# "start": "next start -p 3000"
CMD ["npm", "start"]
