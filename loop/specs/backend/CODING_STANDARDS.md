# backend — Coding Standards

## Core practices

- Layering: Controllers handle HTTP routing, request validation, and status codes. Services execute business logic, database queries, and transactional updates.
- Validation: Global `ValidationPipe` is enabled with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true`. All input must be validated via DTOs.
- No dead code: unused imports and orphan classes should be removed.

## Error handling

- Use built-in NestJS exceptions (`BadRequestException`, `NotFoundException`, `UnauthorizedException`, `InternalServerErrorException`).
- Ukrainian error messages for client-facing validation errors where applicable (e.g. `"Сума повинна бути додатною"`).
- Consistent HTTP status codes: 200 for OK, 201 for Created, 400 for Bad Request, 401 for Unauthorized, 404 for Not Found.

## Security

- Authentication & Authorization: All private endpoints must be guarded with `@UseGuards(JwtAuthGuard)`.
- Tenant / User isolation: Every query must explicitly filter by `userId: new Types.ObjectId(userId)`. Never trust a `userId` supplied in the request body or query parameter.
- Passwords & Tokens: Passwords hashed via `bcrypt`. Refresh tokens hashed via SHA-256 before storage in the database.

## Database and transactions

- Mongoose ODM connected to MongoDB.
- Any operation altering balances across accounts or creating transactions MUST be wrapped in a `ClientSession` transaction (`session.withTransaction(...)`).
- Proper schema reference types using `Schema.Types.ObjectId`.

## Requirements for the agent

- Always verify `userId` ownership when fetching, updating, or deleting any resource.
- When creating, updating, or deleting a transaction, always maintain accurate source balance via `sourcesService.changeBalance`.
- Verify compilation with `npm run build` before marking any module complete.
