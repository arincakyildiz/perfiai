# Perfiai Backend - Docker
# Build: docker build -t perfiai .
# Run:   docker run -p 3001:3001 perfiai

FROM node:20-alpine

WORKDIR /app

# Proje dosyalarını kopyala
COPY backend/package*.json ./backend/
COPY backend/server.js ./backend/
COPY data/ ./data/

WORKDIR /app/backend
RUN npm ci --omit=dev

WORKDIR /app
EXPOSE 3001

# data/ erişimi için backend'i üst dizinden çalıştır
CMD ["node", "backend/server.js"]
