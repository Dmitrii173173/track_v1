# Bitcoin Price Tracker

Приложение для отслеживания цены Bitcoin в реальном времени с использованием Binance API.

## Архитектура

- Frontend: Nuxt.js 3
- Backend: Node.js + Express
- Collector: Node.js
- База данных: PostgreSQL

## Требования

- Docker и Docker Compose
- Node.js 18+ (для локальной разработки)

## Запуск

1. Клонируйте репозиторий:

```bash
git clone <repository-url>
cd track_v1
```

2. Создайте файл .env в корневой директории:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/trackdb
BACKEND_API=http://localhost:4000
```

3. Запустите приложение с помощью Docker Compose:

```bash
docker-compose up --build
```

Приложение будет доступно по следующим адресам:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Разработка

### Локальный запуск

1. Установите зависимости для каждого сервиса:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Collector
cd ../collector
npm install
```

2. Запустите базу данных:

```bash
docker-compose up db
```

3. Запустите миграции базы данных:

```bash
cd backend
npm run prisma:migrate
```

4. Запустите сервисы в отдельных терминалах:

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev

# Collector
cd collector
npm run dev
```

## API Endpoints

- GET /api/latest - получение последней цены
- GET /api/prices - получение исторических цен (параметры: period=day|week|month|year)
- POST /api/collect - эндпоинт для коллектора

## Функциональность

- Отображение графика цены Bitcoin в реальном времени
- Фильтрация данных по периодам (день, неделя, месяц, год)
- Автоматическое обновление данных каждые 5 секунд
- Адаптивный дизайн с поддержкой темной темы
