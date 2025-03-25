FROM node:18-alpine

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm install

# Копирование исходного кода
COPY . .

# Генерация Prisma клиента
RUN npx prisma generate

# Сборка приложения
RUN npm run build

# Открываем порт
EXPOSE 8080

# Запуск приложения
CMD ["node", "dist/index.js"] 