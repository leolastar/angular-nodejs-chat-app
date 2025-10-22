# Real‑Time Chat App

> A full‑stack chat app built with **React + TypeScript**, **Node + Express + Socket.IO**, **Redis**, **Sequelize** and **PostgreSQL**.  
> Features: JWT auth, message throttling, fast in‑memory cache, logging, Docker, tests, GitHub Actions, and an optional deployment guide.

## Prerequisites

- Docker & Docker‑Compose
- Node 20
- PostgreSQL 17

## Getting Started

```bash
git clone https://github.com/yourorg/chat-app.git
cd chat-app

# copy .env.example to .env in both root folder and server
cp server/env.example server/.env
cp env.example .env

# set secrets in .env (see .env.example)

docker compose up --build
```
