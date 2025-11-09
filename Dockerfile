# syntax=docker/dockerfile:1
####################################
# Base image (small, alpine)
####################################
FROM node:20-alpine AS base
ENV NODE_ENV=production
WORKDIR /app

# some native deps (sharp, etc.) may require this compatibility lib
RUN apk add --no-cache libc6-compat

####################################
# deps - install production deps (cached layer)
# This stage installs dependencies (pnpm is enabled here)
####################################
FROM base AS deps
# copy only manifests to leverage docker cache
COPY package.json pnpm-lock.yaml* ./

# enable corepack & install production deps
# if pnpm-lock.yaml is present this will use pnpm with frozen lockfile
RUN set -eux; \
    if [ -f pnpm-lock.yaml ]; then \
      corepack enable pnpm; \
      corepack prepare pnpm@latest --activate; \
      pnpm install --frozen-lockfile --prod; \
    elif [ -f package-lock.json ]; then \
      npm ci --only=production; \
    else \
      npm ci --only=production || npm install --only=production; \
    fi

####################################
# builder - copy source and build the app
####################################
FROM base AS builder
WORKDIR /app

# copy deps' node_modules (production deps). If you use pnpm with a strict workspace
# layout that doesn't populate node_modules in the deps stage, the builder may need to run pnpm install here.
COPY --from=deps /app/node_modules ./node_modules

# copy the rest of the app
COPY . .

# build Next.js (will create .next and standalone output when using experimental outputStandalone)
# Ensure you have "next build" script in package.json (pnpm build or npm run build)
RUN set -eux; \
    if [ -f pnpm-lock.yaml ]; then \
      corepack enable pnpm; corepack prepare pnpm@latest --activate; pnpm build; \
    else \
      npm run build; \
    fi

####################################
# runner - minimal runtime image using Next.js standalone output
####################################
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# create a non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs

# Copy minimal runtime artifacts
# - standalone folder contains server.js and a minimal package.json for runtime
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# copy production node_modules from deps stage for native modules and runtime dependencies
COPY --from=deps /app/node_modules ./node_modules

# Ensure proper ownership (so the non-root user can write to prerender cache etc.)
RUN mkdir -p /app/.next && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# If you used Next.js standalone output the entrypoint is server.js located in the current folder.
# Start the standalone server directly with node
CMD ["node", "server.js"]
