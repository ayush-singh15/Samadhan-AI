FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend
RUN npm install
RUN npm run build --workspace=@trisetu/shared
RUN npm run build --workspace=@trisetu/backend

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/node_modules ./node_modules
COPY --from=builder /app/apps/backend/package.json ./package.json

EXPOSE 5000
CMD ["node", "dist/server.js"]
