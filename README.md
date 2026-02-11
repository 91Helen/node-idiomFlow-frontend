# 📚 IdiomFlow — Fullstack EdTech Platform

[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen)](https://learning-idioms-node.netlify.app/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/State-Redux_Toolkit-764ABC)](https://redux-toolkit.js.org/)
[![GSAP](https://img.shields.io/badge/Animation-GSAP-green)](https://greensock.com/gsap/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248)](https://www.mongodb.com/)
[![Auth0](https://img.shields.io/badge/Security-Auth0-EB5424)](https://auth0.com/)

---

## 🌍 Project Overview / Обзор проекта

**IdiomFlow** is a comprehensive ecosystem for learning foreign idioms. It combines a structured library, an interactive memorization system, and competitive elements to make the learning process engaging and effective.

**IdiomFlow** — это полноценная экосистема для изучения иностранных идиом. Проект объединяет в себе структурированную библиотеку, интерактивную систему запоминания и элементы геймификации, делая процесс обучения вовлекающим и эффективным.

🔗 **[Live Demo / Посмотреть проект](https://learning-idioms-node.netlify.app/)**

---

## Clone the repositories / Клонировать репозитории:
   ```bash
   # Frontend
   git clone [https://github.com/91Helen/node-idiomFlow-frontend.git](https://github.com/91Helen/node-idiomFlow-frontend.git)
   
   # Backend
   git clone [https://github.com/91Helen/node-idiomFlow-backend.git](https://github.com/91Helen/node-idiomFlow-backend.git)

``````
---

### 🇺🇸 English
* **Memorization Tool**: A dedicated flashcard-style trainer. Users view an idiom, recall its meaning, and use visual associations for better retention.
* **Interactive Training**: Active practice mode to test and solidify your knowledge.
* **Personal Dashboard**: A private area for users to track their progress and manage their profiles.
* **Leaderboard**: A global ranking system to track the most active learners and motivate consistent study.
* **Content Management**: Authorized users can contribute by adding/deleting new idioms or editing the library.

### 🇷🇺 Русский
* **Раздел «Запоминание»**: Тренажер в стиле флэш-карточек. Пользователь видит идиому, вспоминает её значение и использует визуальные ассоциации для глубокого закрепления в памяти.
* **Интерактивные тренировки**: Режим активной практики для проверки знаний и набора очков.
* **Личный кабинет**: Персональное пространство пользователя для отслеживания прогресса и управления аккаунтом.
* **Доска лидеров**: Глобальный рейтинг учеников, стимулирующий регулярные занятия через соревновательный элемент.
* **Управление базой**: Возможность для авторизованных пользователей добавлять/удалять новые идиомы и наполнять библиотеку.

---

## 🛠 Tech Stack / Стек технологий

* **Frontend**: React (Vite), **Redux Toolkit (RTK Query)**, **GSAP (GreenSock Animation Platform)**, React Router.
* **Backend**: Node.js, Express, Mongoose.
* **Database**: MongoDB Atlas.
* **Authentication**: Auth0 (Secure JWT-based sessions).
* **Styling**: CSS3 (Custom responsive layouts, Google Fonts: Montserrat & Inter).
* **Deployment**: Netlify (Frontend) & Render (Backend).

---

## 🧠 Technical Insights & Solutions / Технические решения

### 1. Advanced State Management (RTK Query)
Implemented a professional data-fetching layer. The app uses **automated caching** and **tags invalidation**, ensuring that when a user completes a training or adds an idiom, the UI, Leaderboard, and Dashboard update instantly without page reloads.

### 2. Complex Business Logic
Developed server-side logic for the **Leaderboard** and **User Progress**, involving complex MongoDB queries to aggregate and sort user data based on their training performance.

### 3. Cross-Platform Integration
Managed secure communication between **Netlify** (Static hosting) and **Render** (Web Service). Solved **CORS** challenges and optimized **SPA routing** for a seamless production environment.

### 4. Integrated the **GSAP** library to create a seamless UX. 
Implemented complex transition logic where a `gsap.timeline` coordinates the smooth disappearance of the custom loader and the staggered appearance of the main content, eliminating visual artifacts during API data loading.

---
## 🧠 Технические решения и ключевые задачи

### 1. Профессиональное управление состоянием (RTK Query)
В проекте реализован современный слой работы с данными с помощью **RTK Query**. Использование **автоматического кэширования** и **инвалидации тегов (tags invalidation)** гарантирует, что при добавлении идиомы или завершении тренировки данные в интерфейсе, Таблице лидеров и Личном кабинете обновляются мгновенно, без необходимости перезагружать страницу.

### 2. Сложная бизнес-логика и работа с БД
Разработана серверная логика для системы **Leaderboard** и **прогресса пользователей**. Были реализованы сложные запросы к MongoDB для агрегации, фильтрации и сортировки данных пользователей в реальном времени на основе их результативности в тренировках.

### 3. Безопасность и кросс-платформенная интеграция
Обеспечено стабильное взаимодействие фронтенда на **Netlify** и бэкенда на **Render**. Решены задачи кросс-доменных запросов (**CORS**) и настроена корректная маршрутизация для **SPA**, что исключает ошибки 404 при обновлении страниц и обеспечивает бесшовную работу приложения в облачной среде.

### 4. High-Performance Animations (GSAP)
Для создания бесшовного UX интегрирована библиотека **GSAP**. Реализована сложная логика перехода: плавное исчезновение кастомного лоадера и появление основного контента через `gsap.timeline`, что исключает визуальные скачки при загрузке данных из API.

---

## 📦 Installation / Локальный запуск

1. `git clone [your-repo-link]`
2. `npm install` (in both folders)
3. Setup `.env` (MongoDB URI, Auth0 Domain/ClientID).
4. `npm run dev`

---

## 🏗 Project Structure / Структура проекта
```text
idiom-flow/
├── backend/                # Server-side (Node.js & Express)
│   ├── config/
│   │   └── db.js           # Database connection
│   ├── controllers/        # Business logic
│   │   ├── idiomController.js
│   │   └── userController.js
│   ├── middleware/         # Security & Auth
│   │   └── auth.js
│   ├── models/             # Database schemas
│   │   ├── Idiom.js
│   │   └── User.js
│   ├── routes/             # API Endpoints
│   │   ├── idiomRoutes.js
│   │   └── userRoutes.js
│   ├── .env                # Environment variables
│   ├── index.js            # Server entry point
│   └── package.json
├── frontend/               # Client-side (React + Vite)
│   ├── public/             # Static assets (favicon.png)
│   ├── src/
│   │   ├── app/            # Redux Store
│   │   │   └── store.js
│   │   ├── components/     # UI Components
│   │   │   ├── AddIdiom.jsx
│   │   │   ├── IdiomCard.jsx
│   │   │   ├── IdiomsList.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── RandomIdiom.jsx
│   │   ├── features/       # Data fetching (RTK Query)
│   │   │   └── apiSlice.js
│   │   ├── pages/          # Application Pages
│   │   │   ├── Home.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Quiz.jsx
│   │   │   └── Training.jsx
│   │   ├── App.css
│   │   ├── App.jsx         # Routing
│   │   ├── index.css
│   │   └── main.jsx        # App entry point
│   ├── .env                # Client-side config
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html          # HTML Template
│   ├── package.json
│   └── vite.config.js      # Build configuration
└── package-lock.json       # Root dependencies
```
---

## 👤 Author / Автор
**[With love - Elena Filatova ❤️ / Филатова Елена]**
* LinkedIn: [www.linkedin.com/in/elena-filatova-15b879308]
