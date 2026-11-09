# Library Management System - Backend Data Layer

A robust backend data schema and migration layer built for a library catalog using NestJS, Prisma, and PostgreSQL.

## Getting Started

1. Navigate to the `api` folder: `cd api`
2. Copy `.env.example` to `.env` and fill in your hosted PostgreSQL connection string.
3. Install dependencies: `npm install`
4. Run the database migration: `npx prisma migrate dev --name init`
5. Seed the database with initial books and genres: `npx prisma db seed`

---

## Schema Decisions

### Why Book References Genre Rather Than Embedding It
In our data design, `Book` references a separate `Genre` table via a foreign key (`genreId`) rather than embedding the genre name directly as a string property inside the book record. 

* **Normalization & Data Integrity:** Embedding strings leads to duplicate data and risks data anomalies (e.g., typos like `"Science-Fiction"` vs `"Sci-Fi"`). Normalizing `Genre` into its own table ensures a single source of truth.
* **Flexibility & Scalability:** If a genre needs to be renamed or assigned metadata (such as a description or age rating), it only requires an update in one place (`Genre` table) rather than updating thousands of individual book entries.
* **Relational Querying:** Prisma makes cross-table querying seamless using relations (`include: { genre: true }`), allowing efficient groupings and relational filters.

---

## Technical Note: Prisma vs. Document Databases (Stretch Goal)

* **Prisma (Relational / PostgreSQL):** Modeling in Prisma felt very structural, explicit, and strict. Enforcing types, explicit enums (`Role`), and rigid foreign-key constraints up-front forces you to think deeply about data integrity and edge cases (such as what happens via `onDelete: Cascade` when a genre is removed). 
* **Document Databases (e.g., MongoDB):** In contrast, document databases allow you to dump data fluidly as nested JSON objects without upfront schema definitions. While document stores offer high initial speed for rapid prototyping, Prisma's approach provides much stronger long-term safety, predictability, and safety against corrupt states through its strict relational type system.