# Cloud Cost Intelligence

A full-stack prototype for the 22North Product Engineering Challenge. The app helps a SaaS company understand cloud spend concentration, identify waste, and prioritise actionable savings.

## Team Details

- Team Name: [Fill before submission]
- Team Members: [Fill before submission]
- College Name: [Fill before submission]

## Stack

- Frontend: React, Vite, JavaScript
- Backend: Node.js, Express, JavaScript
- Database: MySQL
- Local runtime: MySQL server on your machine, sample-data fallback in the API

## Repository Structure

- `client` - React dashboard
- `server` - Express API and insight engine
- `mysql/init` - MySQL schema and seed scripts
- `docs` - architecture, API, assumptions, and demo material

## CSV Import Flow

- Use the CSV import panel in the dashboard to upload a cost export or sample inventory file.
- Download a starter template from the app if you want the expected column layout.
- After upload, the prototype previews the parsed rows and then recalculates the dashboard once you click `Analyse CSV`.
- Recent uploads are persisted to MySQL and shown in the import history panel when the database is available.

## Local Setup

1. Start your local MySQL server and make sure it is reachable on port `3306`.
2. Create the database and load the schema:

```bash
mysql -u root -p < mysql/init/01_schema.sql
```

3. Copy `.env.example` to `.env` and adjust values if needed.
4. Install dependencies:

```bash
npm install
```

5. Run the app:

```bash
npm run dev
```

6. Open the React app at `http://localhost:5173`.

## Optional MySQL Notes

- If you prefer Docker, `docker-compose.yml` is still available, but it is optional.
- If MySQL is unavailable, the backend falls back to bundled sample data so the prototype still launches.

## API

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/resources`
- `GET /api/meta`
- `POST /api/import`

See [docs/api.md](docs/api.md) for details.

## Architecture

See [docs/architecture.md](docs/architecture.md) for the architecture diagram.

## Demo

See [docs/demo-script.md](docs/demo-script.md) for the 5-minute walkthrough, [docs/presentation-outline.md](docs/presentation-outline.md) for the outline, [docs/presentation-deck.md](docs/presentation-deck.md) for slide-ready content, and [docs/speaker-script.md](docs/speaker-script.md) for presenter notes.

## Assumptions

- The company already exports resource and billing data.
- No live AWS integration is required.
- Savings estimates are directional and should be reviewed before execution.

## AI Tools Used

- GitHub Copilot
