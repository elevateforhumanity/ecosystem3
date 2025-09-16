# Multi-stage build: build frontend then run server
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev=false
COPY . .
# Build frontend (if Vite assets referenced)
RUN npm run build || echo "Build step failed or no build needed"

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY --from=build /app /app
EXPOSE 5000
ENV PORT=5000
CMD ["node", "simple-server.cjs"]
