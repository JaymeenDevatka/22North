# Cloud Cost Intelligence

A full-stack prototype for the **22North Product Engineering Challenge**. The app helps a SaaS company understand cloud spend concentration, identify waste, and prioritise actionable savings.

---

## Team Details

| Field            | Value                 |
| ---------------- | --------------------- |
| **Team Name**    | [22North Team]        |
| **Team Members** | [Jaymeen Devatka]     |
| **College Name** | [Charusat University] |

---

## Technology Stack

| Layer        | Technologies                 |
| ------------ | ---------------------------- |
| **Frontend** | React, Vite, JavaScript, CSS |
| **Backend**  | Node.js, Express, JavaScript |
| **Database** | MySQL 8                      |
| **Runtime**  | npm workspaces, concurrently |
| **Optional** | Docker Compose for MySQL     |
| **AI Tools** | GitHub Copilot               |

---

## Build & Run Instructions

### Prerequisites

- Node.js 18+ and npm
- MySQL 8 (optional — app falls back to bundled sample data)

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/JaymeenDevatka/22North.git
cd 22North
```

2. **Set up MySQL** (optional but recommended)

```bash
mysql -u root -p < mysql/init/01_schema.sql
```

3. **Configure environment**

```bash
copy .env.example .env
```

Edit `.env` if your MySQL credentials differ from the defaults.

4. **Install dependencies**

```bash
npm install
```

5. **Start the application**

```bash
npm run dev
```

6. **Open the app**

- Frontend: http://localhost:5173
- API health: http://localhost:4000/api/health

### Alternative: Docker MySQL

```bash
docker compose up -d
```

Then run `npm run dev` as above.

---

## Repository Structure

```
22North/
├── client/                 # React dashboard (Vite)
├── server/                 # Express API + insight engine
├── mysql/init/             # MySQL schema and seed scripts
├── docs/                   # Architecture, API, presentation, demo materials
├── practice-cloud-costs.csv # Sample CSV for demo import
├── SUBMISSION.md           # Full submission checklist
└── README.md
```

---

## Features

- **Spend dashboard** — monthly spend, budget coverage, projected savings
- **Ranked recommendations** — sorted by savings impact with confidence and effort
- **Service breakdown** — spend concentration by cloud service
- **CSV import** — upload billing exports with preview and column mapping guide
- **Import history** — persisted upload runs when MySQL is available
- **Sample data fallback** — works without a database for reliable demos

---

## CSV Import Flow

1. Use the CSV import panel in the dashboard to upload a cost export.
2. Download the starter template from the app for the expected column layout.
3. Review the parsed preview, then click **Analyse CSV**.
4. The dashboard recalculates with imported data.
5. Recent uploads appear in the import history panel when MySQL is connected.

---

## API Endpoints

| Method | Endpoint         | Description                                 |
| ------ | ---------------- | ------------------------------------------- |
| GET    | `/api/health`    | Service status and data mode                |
| GET    | `/api/dashboard` | Spend summary and recommendations           |
| GET    | `/api/resources` | Raw resource inventory                      |
| GET    | `/api/meta`      | Customer journey, architecture, assumptions |
| GET    | `/api/imports`   | Recent import runs                          |
| POST   | `/api/import`    | Analyse uploaded CSV data                   |

See [docs/api.md](docs/api.md) for request/response details.

---

## Documentation

| Document                       | Path                                                       |
| ------------------------------ | ---------------------------------------------------------- |
| Submission checklist           | [SUBMISSION.md](SUBMISSION.md)                             |
| Solution document              | [docs/solution.md](docs/solution.md)                       |
| Architecture                   | [docs/architecture.md](docs/architecture.md)               |
| Presentation deck (Markdown)   | [docs/presentation-deck.md](docs/presentation-deck.md)     |
| Presentation deck (HTML → PDF) | [docs/presentation-deck.html](docs/presentation-deck.html) |
| Demo video guide               | [docs/demo-video-guide.md](docs/demo-video-guide.md)       |
| Demo script                    | [docs/demo-script.md](docs/demo-script.md)                 |

---

## Assumptions

- The company already exports resource and billing data as CSV.
- No live AWS integration is required for this challenge.
- Savings estimates are directional and should be reviewed before execution.
- A single account-level dashboard is sufficient for the MVP.

---

## Source Code

**GitHub:** https://github.com/JaymeenDevatka/22North

---

.## License

Built for the 22North Product Engineering Challenge
