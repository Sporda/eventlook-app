# 🎫 Baby Eventlook

**Next gen platforma na prodej vstupenek** - Full-stack aplikace pro správu a prodej vstupenek na události.

## 🚀 Rychlý start

```bash
# Spuštění celé aplikace
docker-compose up

# Aplikace bude dostupná na:
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
# Database: localhost:5432
```

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Material-UI + SCSS
- **Backend**: NestJS + TypeScript + TypeORM + PostgreSQL
- **Database**: PostgreSQL 17
- **Containerization**: Docker + Docker Compose

## 📁 Struktura projektu

```
├── frontend/          # React aplikace
├── backend/           # NestJS API
├── docker-compose.yml # Orchestrace služeb
└── README.md         # Tato dokumentace
```

## 🎯 Funkce

- ✅ **Seznam událostí** - Zobrazení všech dostupných událostí
- ✅ **Nákup lístků** - Modal pro nákup s validací množství
- ✅ **Správa lístků** - Zobrazení zakoupených lístků s paginací
- ✅ **Real-time data** - Aktualizace dostupnosti lístků
- ✅ **Responsive design** - Optimalizováno pro všechny zařízení
- ✅ **Česká lokalizace** - Všechny texty v češtině

## 🔧 Vývoj

```bash
# Backend development
cd backend
npm install
npm run start:dev

# Frontend development
cd frontend
npm install
npm start
```

## 🧪 Testování

```bash
# Backend testy
cd backend && npm test

# Frontend testy
cd frontend && npm test
```

## 📊 API Endpoints

- `GET /events` - Seznam všech událostí
- `POST /tickets/purchase` - Nákup lístků

## 🎨 Design

Aplikace je inspirována [Eventlook.cz](https://www.eventlook.cz/) s moderním dark theme a oranžovými akcenty.

---

**Vytvořeno s ❤️ pro demonstraci full-stack development skills**
