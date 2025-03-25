FROM node:18-alpine

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm install

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

# Открываем порт
EXPOSE 3000

# Запуск приложения
CMD ["npm", "run", "preview"] 