# SQL — Project Conventions

> Universal principles in `../../core/staff-dna.md` and `../../core/data-access.md`.
> This file: data layer and SQL-specific decisions only.

<ruleset name="SqlConventions">

## Error Handling

- Errors handled in the application, not in the query
- SQL returns error → application decides next action
- Never: hide errors with SQL logic; use SQL for complex business rules

## Query Design

- Explicit, readable queries; vertical style: break at each keyword
- CTEs over subqueries for clarity; temp tables in procs when needed
- Avoid unnecessary nesting

```sql
WITH regional_sales AS (
    SELECT region, SUM(amount) AS total_sales
    FROM orders GROUP BY region
), top_regions AS (
    SELECT region FROM regional_sales
    WHERE total_sales > (SELECT SUM(total_sales)/10 FROM regional_sales)
)
SELECT * FROM top_regions;
```

## Naming

- Tables: `snake_case`, plural (`users`, `order_items`)
- Columns: `snake_case`; PK: `id`; FK: `<entity>_id`
- SPs: `sp_<action>`; Functions: `fn_<action>`; Views: `vw_<name>`; Indexes: `idx_<table>_<cols>`

## Migrations

- Versioned with timestamp (`20240301_add_users_index.sql`); forward-only
- Idempotent when possible (`IF NOT EXISTS`, `CREATE INDEX CONCURRENTLY`)
- Expand-contract for zero-downtime

## Performance

- Indexes based on actual usage, not anticipation
- No `SELECT *`; analyze execution plan before optimizing
- Mandatory pagination for large lists (keyset/cursor, not OFFSET for high volume)

## Data Integrity

- `NOT NULL` required fields; `FOREIGN KEY` referential; `UNIQUE` uniqueness
- Don't rely solely on application for integrity

## Transactions

- Only when necessary; minimum scope — open late, close early

## Security

- Always parameterized queries (bind variables); never string concatenation
- Least privilege for DB users

</ruleset>
