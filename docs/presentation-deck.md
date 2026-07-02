# Cloud Cost Intelligence

## Slide 1: Title

- Cloud Cost Intelligence
- Turning cloud usage into a practical savings plan for a growing SaaS company

## Slide 2: Problem Statement

- Cloud spend is growing faster than operational visibility.
- Teams need a fast answer to three questions: where is money going, what is wasteful, and what should be done first?

## Slide 3: Product Goal

- Analyse usage.
- Prioritise savings.
- Make the next action obvious.

## Slide 4: Customer Journey

- Upload a billing export or use sample data.
- Review the CSV preview and header mapping help.
- Analyse the file and triage the highest-value recommendations.

## Slide 5: Live Demo Walkthrough

- Show monthly spend and projected savings.
- Walk through the ranked recommendations.
- Filter by optimisation type to show the decision path.

## Slide 6: CSV Import and History

- Demonstrate upload, template download, and preview.
- Show how import history is stored in MySQL and visible in the UI.

## Slide 7: Architecture

- React dashboard
- Express API
- Insight engine
- MySQL persistence for import runs and seed data

## Slide 8: API Design

- `GET /api/dashboard`
- `GET /api/meta`
- `GET /api/imports`
- `POST /api/import`

## Slide 9: Assumptions and Trade-offs

- Sample datasets are sufficient for the challenge.
- The first release prioritises clarity over automation.
- Savings estimates are directional, not authoritative.

## Slide 10: Future Enhancements

- CSV column auto-mapping
- Scheduled imports and alerts
- Approval workflow for production actions
- Multi-account and team-level reporting
