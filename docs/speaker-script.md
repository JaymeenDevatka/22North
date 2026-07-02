# 5-Minute Speaker Script

## Slide 1

Open with the core message: this product helps a SaaS team understand cloud spend quickly and turn it into an action plan instead of a static report.

## Slide 2

Frame the problem in business terms. Cloud costs are increasing, but the team lacks visibility into which resources are wasteful and which changes will actually save money.

## Slide 3

State the product goal clearly: analyse usage, prioritise the biggest savings opportunities, and make the next step obvious for the customer.

## Slide 4

Walk through the customer journey: upload a CSV export, review the preview and header mapping guidance, then analyse the file to surface the highest-value recommendations.

## Slide 5

Live-demo the main dashboard. Call out monthly spend, projected savings, and the top recommendation first, then show how the filter chips help the user focus on one optimisation type at a time.

## Slide 6

Show the CSV import panel, download the template, and explain that import runs are persisted in MySQL when available. This demonstrates that the prototype is not just visual; it keeps a history of uploads.

## Slide 7

Explain the architecture simply: React for the experience, Express for the API, a deterministic insight engine for explainable recommendations, and MySQL for sample data plus import history.

## Slide 8

Highlight the API surface. Keep it short: the dashboard and metadata endpoints support the UI, while the import and history endpoints make the CSV workflow work end to end.

## Slide 9

Be explicit about assumptions and trade-offs. The solution assumes exported billing data, no live AWS integration, and a focus on clarity over complex automation or machine learning.

## Slide 10

Close with future improvements: smarter column mapping, scheduled imports, alerts, approval workflows, and multi-account reporting. End by tying it back to the business value: faster decisions and cleaner cloud spend.
