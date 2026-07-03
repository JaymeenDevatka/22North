# 22North — Cloud Cost Intelligence Platform

**Challenge 5 · Hackathon 2026**

Turning cloud costs into business insights. Upload → Analyze → Visualize → Save.

---

## Team Details

| Field | Value |
|-------|-------|
| **Team Name** | [Your Team Name] |
| **Team Members** | [Member 1, Member 2, Member 3] |
| **College Name** | [Your College Name] |
| **Contact** | [Email / Phone] |

---

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js, Vite, CSS |
| **Backend** | Node.js, Express, JavaScript Insight Engine |
| **Database** | MySQL 8 |
| **DevOps** | Docker Compose, GitHub |
| **Data** | CSV import, sample-data fallback |
| **AI Tools** | GitHub Copilot |

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

2. **Set up MySQL** (optional)

```bash
mysql -u root -p < mysql/init/01_schema.sql
copy .env.example .env
```

3. **Install dependencies**

```bash
npm install
```

4. **Start the application**

```bash
npm run dev
```

5. **Open the app**

- Frontend: http://localhost:5173
- API health: http://localhost:4000/api/health

### Docker MySQL (optional)

```bash
docker compose up -d
npm run dev
```

---

## Platform Capabilities

| Feature | Description |
|---------|-------------|
| **Cost Dashboard** | Real-time spend views, service breakup, budget coverage |
| **Waste Detection** | Low utilization, idle resources, spend concentration |
| **Smart Recommendations** | Rightsizing, reserved instances, cleanup actions |
| **Savings Projections** | Monthly savings, annual forecast, ROI indicators |
| **CSV Import** | Upload billing exports with preview and column mapping |
| **Import History** | Persisted upload runs when MySQL is connected |

---

## Customer Journey

```
Upload → Analyze → Visualize → Save
```

1. **Upload** — CSV file, sample dataset, or template download
2. **Process & Analyze** — cost analysis, priority ranking, waste detection
3. **Visualize** — dashboard charts, service breakdown, KPI cards
4. **Save** — actionable recommendations, savings estimates, import history

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Service status and data mode |
| GET | `/api/dashboard` | Spend summary and recommendations |
| GET | `/api/resources` | Raw resource inventory |
| GET | `/api/meta` | Customer journey, architecture, assumptions |
| GET | `/api/imports` | Recent import runs |
| POST | `/api/import` | Analyse uploaded CSV data |

---

## Documentation

| Document | Path |
|----------|------|
| Submission checklist | [SUBMISSION.md](SUBMISSION.md) |
| Solution document | [docs/solution.md](docs/solution.md) |
| Presentation deck (Markdown) | [docs/presentation-deck.md](docs/presentation-deck.md) |
| Presentation deck (HTML → PDF) | [docs/presentation-deck.html](docs/presentation-deck.html) |
| Speaker script | [docs/speaker-script.md](docs/speaker-script.md) |
| Demo video guide | [docs/demo-video-guide.md](docs/demo-video-guide.md) |

---

## Source Code

**GitHub:** https://github.com/JaymeenDevatka/22North

---

## Tagline

> "Turning Cloud Costs into Business Insights"
