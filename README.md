# Movie Reservation Service

A production-ready REST API for browsing movies, reserving seats, and managing bookings.

Built with **Node.js + TypeScript**, **Express**, **PostgreSQL**, **Redis**and **Prisma**.

---

## Features

- **JWT Authentication** - Access + refresh token flow with `httpOnly` cookie storage and token rotation
- **Role-Based Access Control** - `USER` and `ADMIN` roles enforced at the middleware level
- **Movie & Showtime Management** - Full CRUD with genre tagging, poster uploads via Cloudinary, and automatic seat generation
- **Overbooking Prevention** - PostgreSQL row-level locking (`SELECT FOR UPDATE`) guarantees no double-bookings
- **Seat Locking** - 10-minute checkout window with a cron job to release stale locks automatically
- **Admin Reporting** - Revenue, capacity utilization, and popular movies reports
- **Stripe Payments** - Secure payment processing on reservation confirmation
- **Input Validation** - Zod schemas on every endpoint
- **Rate Limiting** - Via `express-rate-limit` & `rate-limit-redis`
- **Cache** - Add caching layer with `ioredis`

---

## Tech Stack

| Layer | Choice |
|---|---|
| Language | Node.js (TypeScript) |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (Access + Refresh Tokens) |
| Hashing | bcrypt |
| Validation | Zod |
| File Upload | Multer + Cloudinary |
| Payments | Stripe |
| Cache | Redis |
| Queue | BullMQ + Redis |
| Email | BullMQ worker (signup confirmation) |

---

## Getting Started

### Prerequisites

- Node.js v20+
- PostgreSQL 14+
- Redis 7+
- A [Cloudinary](https://cloudinary.com) account (for poster images)
- A [Stripe](https://stripe.com) account (for payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/Ashen1919/Movie_reservation_system.git
cd Movie_reservation_system

# Install dependencies
npm install

# Copy environment config and fill in your values
cp .env.example .env
```

### Database Setup

```bash
# Run migrations
npx prisma migrate dev --name <migration_name>

# Seed the database (creates admin user)
npx prisma db seed
```

### Run the Server

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

---

## Docker

```bash
# Start the app and a PostgreSQL instance
docker compose up --build
```

The API will be available at `http://localhost:3000`.

---

Full API documentation (Swagger/OpenAPI) is available at `/api/docs` when the server is running.

---

## Project Structure

```
src/
├── config/            # DB, env, JWT config, redis, swagger, cloudinary
├── helpers/           # generate seats
├── jobs/              # email queue, email worker etc.
├── middleware/        # Auth, upload, rate limiter
├── modules/
│   ├── auth/          # Signup, login, refresh, logout
│   ├── users/         # Profile, block, unblock
│   ├── movies/        # CRUD, poster upload
│   ├── genres/        # CRUD
│   ├── showtimes/     # CRUD, seat generation
│   ├── reservations/  # Lock, confirm, cancel
│   └── reports/       # Revenue, capacity, popular movies
├── utils/             # validators
├── app.ts             # Express setup
└── server.ts          # Entry point
prisma/
├── migrations/
├── schema.prisma
└── seed.ts
```

---

## License

MIT