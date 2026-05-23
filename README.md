# TAAL — Full-Stack Habit Tracking Platform

TAAL is a modern full-stack habit tracking platform focused on consistency, streak visualization, and clean user experience.

Built with a production-style architecture using:

- Spring Boot
- PostgreSQL
- React
- JWT Authentication
- Railway
- Vercel
- Neon PostgreSQL

TAAL combines cloud persistence, secure authentication, optimistic UI updates, and analytics-driven habit tracking into a fully deployed web application.

---

# Live Demo

Frontend:
https://taal-habit-tracker.vercel.app

Backend:
https://taal-habit-tracking-app-production.up.railway.app

---

# Core Features

## Authentication & Security

- JWT-based authentication
- Secure login & registration flow
- Protected backend routes
- Multi-user habit isolation
- Authorization checks for habit ownership
- Spring Security integration

---

## Habit Management

- Create habits
- Delete habits
- Mark habits as complete
- Undo completions
- Persistent cloud-backed storage
- Real-time UI updates using optimistic rendering
- Confirmation modal for destructive actions

---

## Analytics & Tracking

- Dynamic streak calculation
- Weekly contribution tracking
- GitHub-style contribution heatmaps
- Historical completion visualization
- Completion percentage tracking
- Habit activity insights

---

# Tech Stack

## Backend

- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Hibernate / JPA
- PostgreSQL
- Maven

## Frontend

- React
- Vite
- JavaScript
- Tailwind CSS

## Cloud & Deployment

- Neon PostgreSQL
- Railway
- Vercel

---

# Architecture

```text
React Frontend (Vercel)
        ↓
Spring Boot REST API (Railway)
        ↓
PostgreSQL Database (Neon)
```