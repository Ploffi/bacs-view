# Frontend part of BACS
[Backend](https://github.com/istu-cs/bacs/)

## Getting Started
### Необходимо установить
1. [Node.js](https://nodejs.org/en/) (последнюю стабильную версию)
2. [Yarn](https://yarnpkg.com/en/docs/install) (либо глобально через npm: в консоли `npm install -g yarn` )

### Установка
1. Выкачать репозиторий
2. В директории проекта выполнить `yarn`

### Сборка
Проект собирается с помощью webpack

dev сборка + webpack-dev-server на localhost:8080
```
yarn start
```
prod сборка в ./dist
```
yarn prod
```

### Стэк

Typescript
React + React Router + material-ui

## TODO list
### Инфраструктура
1. Перевести на mobx, mobx-router
2. Написать unit тесты
### Фичи
1. Добавить монитор контеста
2. Сделать админку
3. Добавить кнопку в админку 'Cкопировать контест'

