FROM node:18-alpine AS base

# Установка OpenSSL
RUN apk add --no-cache openssl

WORKDIR /app

# Backend build
FROM base AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend ./
RUN npm run prisma:generate
RUN npm run build --verbose

# Frontend build
FROM base AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
RUN npm install vue-chartjs chart.js
COPY frontend ./
RUN npm run postinstall
RUN npm run build

# Final image
FROM base
WORKDIR /app

# Copy backend build
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/package.json ./backend/
COPY --from=backend-build /app/backend/prisma ./backend/prisma

# Copy frontend build
COPY --from=frontend-build /app/frontend/.output ./frontend/.output

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expose port
EXPOSE 4000

# Healthcheck для Railway
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

# Start the application
CMD ["sh", "-c", "cd backend && npx prisma migrate deploy && node dist/index.js & cd ../frontend && node .output/server/index.mjs"]