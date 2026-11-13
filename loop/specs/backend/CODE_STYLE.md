# backend — Code Style

## Formatting

- Prettier 3.8 + ESLint 9 with `@typescript-eslint`.
- Formatting command: `npm run format`.
- Lint command: `npm run lint`.
- Quotes: double quotes (`"..."`).
- Trailing commas: everywhere applicable.

## Naming

- Classes: PascalCase (`TransactionsService`, `CreateTransactionDto`).
- Methods / functions: camelCase (`changeBalance`, `getCalendar`).
- Files / folders: kebab-case (`saving-plans.module.ts`, `hash-token.util.ts`).
- Schema property names: camelCase (`userId`, `sourceId`, `destinationSourceId`).
- Constants / enums: PascalCase for enum name, UPPER_CASE for keys (`TransactionType.EXPENSE`).

## Framework style

Controllers are thin and delegate business logic to injectable services.

```typescript
@UseGuards(JwtAuthGuard)
@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto, @Req() req: RequestWithUser) {
    return this.transactionsService.create(dto, req.user.id);
  }
}
```

## Types and docstrings

- Explicit return types on service methods and controllers.
- Use explicit TypeScript interfaces for aggregation pipeline results (e.g. `CalendarDayResult`, `CategoryStatResult`).
- Avoid `any` — use typed DTOs and Mongoose Document types.

## Logging

- Use NestJS built-in `Logger` (`private readonly logger = new Logger(ServiceName.name)`).
- Never log passwords, tokens, or personal financial details.

## Comments and commits

- Comments in Ukrainian or English explaining _why_ a particular decision was made (e.g., why session transactions are required).
- Commit format: `feat(<domain>): description` or `fix(<domain>): description`.
