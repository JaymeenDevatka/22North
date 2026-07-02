# Solution Document

## Problem Statement

Growing SaaS teams need faster visibility into cloud waste, cost concentration, and the few actions that will unlock savings quickly.

## Product Approach

This MVP turns a sample cloud inventory into a clear optimisation plan. It answers three questions:

1. Where is the money going?
2. Which resources are the best savings candidates?
3. What should the customer do first?

## Key Assumptions

- The company already exports cloud billing and resource inventory data.
- No live AWS API integration is needed in this challenge.
- Savings recommendations can be derived from resource metadata and deterministic rules.
- A single account-level dashboard is enough for the first release.

## Trade-offs

- The prototype favours explainability over complex ML scoring.
- The MVP focuses on actionable recommendations instead of deep cost allocation workflows.
- The backend supports MySQL, but also includes bundled sample data so the demo is reliable in any environment.

## Future Enhancements

- CSV upload and scheduled ingestion jobs.
- Multi-account and team-level views.
- Slack or email nudges for high-priority savings opportunities.
- Approval workflows for production changes.
- Trend analysis and forecast drift detection.
