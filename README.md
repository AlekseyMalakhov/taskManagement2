# Приложение для управления задачами

Fullstack-приложение для управления задачами. Приложение позволяет создавать, редактировать, фильтровать, сортировать, помечать тегами и удалять задачи. Приложение написано с использованием современных инструментов разработки - IDE Cursor, Claude Sonnet 4.6, ревью кода выполнялось с помощью Codex 5.3 и GPT 5.5. Использовался MPV сервер context7. Созданы отдельные агенты для запуска юнит тестов и e2e тестов. Описание проекта для AI агентов находится в файле CLAUDE.md.

## Технический стек

- **Frontend:** React, Vite, React Router, Redux Toolkit, RTK Query, React Hook Form, Zod, Tailwind CSS
- **Backend:** Express, TypeScript, Zod
- **Shared-пакет:** TypeScript-типы, DTO и схемы валидации
- **Инструменты:** Bun workspaces, Vitest, Playwright, Storybook

## Как запустить

### Предварительные требования

- Установленный [Bun](https://bun.sh/)

### Установка зависимостей

Из корня проекта выполните:

```sh
bun install
```

### Запуск приложения

Запустите backend API:

```sh
bun run dev:backend
```

В другом терминале запустите frontend dev-сервер:

```sh
bun run dev:frontend
```

По умолчанию:

- Frontend доступен по адресу `http://localhost:5173`
- Backend доступен по адресу `http://localhost:3000`

## Полезные скрипты

Запуск проверки TypeScript для frontend и backend:

```sh
bun run typecheck
```

Запуск frontend-тестов:

```sh
bun run --cwd frontend test
```

Запуск end-to-end тестов:

```sh
bun run test:e2e
```

Запуск Storybook:

```sh
bun run --cwd frontend storybook
```

Сборка frontend:

```sh
bun run --cwd frontend build
```

## Архитектура

Репозиторий организован как Bun workspace с тремя пакетами:

```text
taskManagement2/
├── shared/   # Общие типы, DTO и Zod-схемы валидации
├── backend/  # Express API с хранилищем данных в памяти
└── frontend/ # Клиентское приложение на React + Vite
```

### Shared

Пакет `shared` используется локально как `@task-app/shared`. В нем находятся переиспользуемые типы, DTO для запросов и Zod-схемы валидации. Frontend и backend импортируют эти сущности из одного пакета, чтобы правила валидации и API-контракты оставались согласованными.

### Backend

Backend представляет собой Express API. Данные хранятся в памяти, поэтому все задачи и теги сбрасываются при перезапуске сервера.

Основные API-маршруты:

- `GET /tasks` и `GET /tasks/:id`
- `POST /tasks`
- `PUT /tasks/:id`
- `PATCH /tasks/:id/status`
- `PATCH /tasks/:id/tags`
- `DELETE /tasks/:id`
- `GET /tags`
- `POST /tags`

Успешные ответы возвращаются в формате `{ data: ... }`, а ошибки - в формате `{ error: string }`.

### Frontend

Frontend - это React-приложение на Vite. Для работы с API используется RTK Query, для маршрутизации - React Router, а URL search params являются источником состояния для фильтров, сортировки и пагинации задач.

Основные части frontend:

- `src/pages/` - страницы приложения
- `src/components/` - переиспользуемые и feature-specific компоненты
- `src/hooks/` - пользовательские React-хуки
- `src/store/` - Redux store и RTK Query API slice
- `src/lib/` - общие frontend-утилиты и константы

## Примечания

- Фильтрация и пагинация выполняются на клиенте.
- Дедлайны задач хранятся в формате `YYYY-MM-DD` и отображаются как `DD/MM/YYYY`.
- После удаления задачи происходит повторный запрос на `GET /tasks/:id` который возвращает 404. Это связано с тем, что `deleteTask` инвалидирует RTK Query cache tag конкретной задачи, пока `TaskDetailsPage` еще смонтирован и подписан на `useGetTaskQuery(id)`. Переход на главную страницу выполняется только после успешного ответа сервера, чтобы при ошибке удаления можно было показать сообщение в модальном окне. Таким образом `useGetTaskQuery` в компоненте `TaskDetailsPage` успевает сделать повторный запрос на `GET /tasks/:id`. Я это намеренно не устранял, т. к. тут потребуется вводить ручную инвалидацию кэша, что усложняет код и может привести к трудно вылавливаемым багам.
