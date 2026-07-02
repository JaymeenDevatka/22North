# Architecture Diagram

```mermaid
flowchart LR
  U[Finance / Platform Manager] --> R[React Dashboard]
  R --> A[Express API]
  A --> I[Insight Engine]
  A --> M[(MySQL)]
  M --> S[Sample Resource Inventory]
  I --> D[Ranked Recommendations]
  I --> B[Spend Summary]
  A --> X[API Metadata]
```

## Notes

- The frontend only needs two data calls for the MVP: dashboard and metadata.
- MySQL is the primary data store; sample data is bundled so the demo still works if the database is not running.
- The insight engine is intentionally deterministic to keep the prototype explainable in a short demo.
