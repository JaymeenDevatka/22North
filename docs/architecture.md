# Architecture — 22North Cloud Cost Intelligence Platform

```mermaid
flowchart TB
  subgraph Frontend["FRONTEND (React)"]
    U[Upload Module]
    D[Dashboard Page]
    R[Recommendations Page]
  end

  subgraph API["API LAYER (Node.js)"]
    E[REST API Endpoints - Express]
  end

  subgraph Logic["BUSINESS LOGIC (Insight Engine)"]
    CA[Cost Analyzer]
    WD[Waste Detector]
    RE[Recommendation Engine]
  end

  subgraph DB["DATABASE (MySQL)"]
    A[Accounts]
    C[Cost Data]
    I[Import Runs]
  end

  User[Finance / Platform Manager] --> Frontend
  Frontend --> API
  API --> Logic
  API --> DB
  Logic --> D2[Ranked Recommendations]
  Logic --> B[Spend Summary]
```

## Notes

- The frontend uses three logical modules: Upload, Dashboard, and Recommendations.
- MySQL is the primary data store; bundled sample data ensures demos work without a database.
- The insight engine is deterministic — cost analysis, waste detection, and recommendation ranking are all rule-based and explainable.
