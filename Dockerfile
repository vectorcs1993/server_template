# Use official Node.js 23 image as base
FROM node:24-slim

# Установка часового пояса
ENV TZ=Asia/Novosibirsk

# Установка tzdata и создание символической ссылки для часового пояса
RUN apt-get update && \
    apt-get install -y tzdata && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Создание директории приложения в контейнере
WORKDIR /usr/src/app

# Копирование package.json и package-lock.json, если они присутствуют
COPY package*.json ./

# Установка зависимостей приложения
RUN npm install

# Копирование остального исходного кода приложения
COPY . .

# Открытие порта 3306 для подключения к базе данных (стандартный порт MySQL)
EXPOSE 3306

# Команда по умолчанию для запуска приложения
CMD ["node", "server.js"]