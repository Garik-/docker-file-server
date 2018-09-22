# ---- Базовый Node ----
FROM node:carbon AS base
# Создать директорию app
WORKDIR /app

# ---- Зависимости ----
FROM base AS dependencies  
# Используется символ подстановки для копирования как package.json, так и package-lock.json
COPY src/package*.json ./
# Установить зависимости приложения, включая предназначенные для разработки ('devDependencies')
RUN npm install

# ---- Скопировать файлы/билд ----
FROM dependencies AS build  
WORKDIR /app
COPY src /app
# Собрать статические файлы react/vue/angular
# RUN npm run build

# --- Выпуск, используя Alpine ----
FROM node:8.9-alpine AS release  
# Создать директорию app
WORKDIR /app
# Необязательно
# RUN npm -g install serve
COPY --from=dependencies /app/package.json ./
# Установить зависимости приложения
RUN npm install --only=production
COPY --from=build /app ./

EXPOSE 5000
CMD ["node", "/app/server.js"]