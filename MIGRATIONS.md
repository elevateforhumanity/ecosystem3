## Database & Migrations

Phase 1 uses Prisma with a SQLite dev fallback (`file:./dev.db`).

### Switch to Postgres
1. Set `DATABASE_URL` to your Postgres connection string.
2. Update `prisma/schema.prisma` datasource provider to `postgresql`.
3. Run:
   - npx prisma migrate dev --name init
   - npx prisma generate

### Development Flow
1. Edit schema.prisma
2. Run `npx prisma migrate dev --name <change>`
3. Commit generated migration folder + updated schema

### Deployment
Use `npx prisma migrate deploy` in CI/CD after build.

### Seeding (future)
Add a `prisma/seed.js` and configure in package.json: "prisma": { "seed": "node prisma/seed.js" }

### Models (excerpt)
- LmsCourse, LmsLesson, LmsEnrollment
- (Simplified: string enums instead of native enums for SQLite compatibility)

### Next Steps
- Add user progress materialization table
- Add compliance evidence tables
- Introduce indexing strategy for reporting
