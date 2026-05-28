# ──────────────────────────────────────────────
# Stage 1: Dependencies
# ──────────────────────────────────────────────
FROM node:20.18-alpine3.20 AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps --ignore-scripts

# ──────────────────────────────────────────────
# Stage 2: Builder
# ──────────────────────────────────────────────
FROM node:20.18-alpine3.20 AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Prisma braucht DATABASE_URL beim generate, aber keinen echten Server
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder

RUN npx prisma generate
RUN npm run build

# ──────────────────────────────────────────────
# Stage 3: Runner (Production)
# ──────────────────────────────────────────────
FROM node:20.18-alpine3.20 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Standalone output (aktiviert in next.config.mjs)
COPY --from=builder --chown=nextjs:nodejs /app/public                  ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone        ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static            ./.next/static

# Prisma-Binaries: standalone-Tracing erfasst sie nicht zuverlässig
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma    ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma    ./node_modules/@prisma
COPY --from=builder /app/prisma                                        ./prisma

# prisma CLI für migrate deploy beim Start
COPY --from=builder /app/node_modules/prisma                           ./node_modules/prisma
RUN mkdir -p node_modules/.bin && \
    ln -sf /app/node_modules/prisma/build/index.js node_modules/.bin/prisma

# Graceful-shutdown wrapper
COPY --from=builder --chown=nextjs:nodejs /app/startup.mjs            ./startup.mjs

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "startup.mjs"]
