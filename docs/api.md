# API Design

## Base URL

- Local development: `http://localhost:4000`

## Endpoints

### `GET /api/health`

Returns service status and the active data source mode.

Example response:

```json
{
  "ok": true,
  "mode": "mysql",
  "timestamp": "2026-07-02T12:00:00.000Z"
}
```

### `GET /api/dashboard`

Returns the dashboard payload used by the React application.

Response fields:

- `mode`
- `summary`
- `serviceBreakdown`
- `recommendations`

### `GET /api/resources`

Returns the raw resource inventory behind the insight engine.

### `GET /api/meta`

Returns customer journey, architecture, assumptions, and demo script content.

### `GET /api/imports`

Returns the most recent import runs so the UI can show upload history.

### `POST /api/import`

Analyses uploaded CSV data and returns a dashboard payload for the imported resources.

Request body:

```json
{
  "fileName": "cloud-costs.csv",
  "account": {
    "name": "Imported CSV",
    "monthlyBudget": 15000
  },
  "resources": [
    {
      "service": "EC2",
      "resource_name": "api-worker-3",
      "monthly_cost": 2480
    }
  ]
}
```

Response fields:

- `mode`
- `fileName`
- `dashboard`

## Design Rationale

- The contract is intentionally read-only for the MVP.
- The dashboard response is shaped for direct rendering in the UI, reducing frontend transformation logic.
- Metadata is separated so the architecture, assumptions, and demo script can evolve without touching analytics.
- CSV import is analysis-only for the MVP; uploaded rows are not persisted.
- Import runs are persisted separately so upload history can be reviewed without reprocessing the CSV.
