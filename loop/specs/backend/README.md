# backend — service rules

> The agent reads this folder before touching the backend codebase.

## Stack (actual)

- **Runtime**: Node.js
- **Language**: TypeScript 5.9.3
- **Framework**: NestJS 11.2.10
- **Database**: MongoDB via Mongoose 9.12.1 (`@nestjs/mongoose` 11.0.4)
- **Authentication**: Passport.js (JWT access & refresh strategy, local strategy)
- **Validation**: `class-validator` 0.14.4, `class-transformer` 0.5.1
- **Build Tool**: Nest CLI 11.0.24 (`nest build`)
- **Testing**: Jest 30.5.2, `ts-jest` 29.4.15

## Documents

- `CODE_STYLE.md` — formatting, naming, comments, commits.
- `CODING_STANDARDS.md` — error handling, security, transactions, reliability.
- `PROJECT_STRUCTURE.md` — where things live and where new modules go.
- `TESTING_STANDARDS.md` — verification standards, green-gate.

## How to run

```bash
cd backend
npm install
npm run start:dev     # development watch mode on port 3000
npm run build         # compile to dist/
```

- **Environment**: requires `.env` with `MONGO_URI`, `PORT`, `JWT_SECRET`, `JWT_REFRESH_SECRET`.
- **API URL**: `http://localhost:3000`

## Public surface

REST API endpoints prefixed by domain modules:

- `/auth` (`/login`, `/register`, `/refresh`, `/logout`)
- `/sources` (CRUD for wallets and accounts)
- `/transactions` (CRUD for income, expense, transfer; `/stats`, `/calendar`, `/by-category`)
- `/categories` (CRUD for transaction categories)
- `/saving-plans` (CRUD for saving goals)
- `/currencies` (rates lookup)
- `/integrations` (Bybit sync and credentials)

## Requirements for the agent

- All mutating database actions affecting wallet balance MUST run within a MongoDB ClientSession (`session.withTransaction`).
- DTOs must use `class-validator` decorators (`@IsString()`, `@IsNumber()`, `@IsEnum()`, etc.).
- Always return appropriate HTTP exceptions (`NotFoundException`, `BadRequestException`, `UnauthorizedException`).
- Do not commit secrets or production database URIs.
