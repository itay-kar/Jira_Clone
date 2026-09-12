# ----- Build stage -----
From node:22-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate 
RUN npm run build

# ---- Production stage ----
FROM node:22-slim AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/src/generated ./src/generated
COPY prisma ./prisma
COPY prisma.config.ts ./

EXPOSE 4000
CMD ["node", "dist/index.js"]