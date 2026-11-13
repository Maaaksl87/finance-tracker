# backend — Project Structure

## Main principle

Domain-driven feature modules following official NestJS architecture conventions. Each feature is self-contained in `src/<feature>/` with its own module, controller, service, DTOs, and schemas.

## Layout

```
backend/
├── src/
│   ├── app.module.ts              # Root module importing feature modules and global config
│   ├── main.ts                    # Bootstrap: CORS, Global ValidationPipe, port listen
│   ├── auth/                      # Authentication (JWT access + refresh, Passport strategies)
│   ├── categories/                # Category management (CRUD, schemas, DTOs)
│   ├── common/                    # Shared interfaces, decorators, utilities (token hashing)
│   ├── currencies/                # Currency rates provider and caching
│   ├── integrations/              # External sync providers (Bybit API, crypto encryption)
│   ├── saving-plans/              # Saving goals and progress tracking
│   ├── sources/                   # Wallets and account sources, atomic balance modifier
│   ├── transactions/              # Transaction management and statistical aggregations
│   └── users/                     # User entity and database schema
├── test/                          # e2e tests configuration
├── package.json
└── tsconfig.json
```

## Where new things go

| I am adding               | It goes in                                                           |
| ------------------------- | -------------------------------------------------------------------- |
| A new feature             | `src/<feature>/<feature>.module.ts`, `.controller.ts`, `.service.ts` |
| A data transfer object    | `src/<feature>/dto/create-<entity>.dto.ts`                           |
| A Mongoose schema         | `src/<feature>/schemas/<entity>.schema.ts`                           |
| A shared utility / helper | `src/common/utils/<name>.util.ts`                                    |

## Conventions

- File naming: kebab-case with type suffix (`create-category.dto.ts`, `transaction.schema.ts`).
- Schema IDs: Use `Types.ObjectId` for reference fields, typed with `@Prop({ type: Schema.Types.ObjectId, ref: 'User' })`.
- Dependency injection: Services injected via constructors; Mongoose models injected with `@InjectModel(Entity.name)`.

## Configuration and secrets

Managed via `@nestjs/config` (`ConfigService`) reading from root `backend/.env`. Never read `process.env` directly inside services; inject `ConfigService`.
