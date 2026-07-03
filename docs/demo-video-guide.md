# Demo Video Guide (3–5 Minutes)

Use this script to record a screen-capture demo for submission. Recommended tools: OBS Studio, Loom, or Windows Game Bar (`Win + G`).

---

## Pre-recording Checklist

1. Start MySQL (optional — sample data fallback works without it).
2. Run `npm install` then `npm run dev`.
3. Open `http://localhost:5173` in a clean browser window.
4. Have `practice-cloud-costs.csv` ready in the project root.
5. Close unrelated tabs and notifications.

---

## Script (~4 minutes)

### 0:00 – 0:30 | Introduction

> "Hi, I'm [Name] from [Team Name]. We built **Cloud Cost Intelligence** for the 22North Product Engineering Challenge. Growing SaaS teams spend more on cloud every month, but they rarely have a clear, ranked list of what to fix first. Our product turns billing exports into an actionable savings plan."

**On screen:** Dashboard loaded with sample data.

---

### 0:30 – 1:30 | Dashboard Overview

> "Here's the main dashboard. At the top you see monthly spend against budget, projected savings, and how many high-priority items need attention."

**Actions:**
- Point to summary cards (spend, savings, high-priority count).
- Scroll to the top recommendation and read the title aloud.
- Mention the optimisation score / savings percentage.

---

### 1:30 – 2:30 | Recommendations & Filters

> "Recommendations are ranked by estimated monthly savings. Each item shows the service, owner team, confidence, effort, and a suggested action."

**Actions:**
- Click filter chips: **Rightsize**, then **Cleanup**, then **All**.
- Highlight one High-priority item and explain why it matters (cost + low utilisation).

---

### 2:30 – 3:30 | CSV Import Flow

> "Teams can upload their own billing export. Let me import a CSV file."

**Actions:**
- Open the CSV Import panel.
- Upload `practice-cloud-costs.csv`.
- Show the preview table and column mapping guide.
- Click **Analyse CSV**.
- Point out updated spend and savings numbers.

---

### 3:30 – 4:15 | Import History & Architecture

> "When MySQL is connected, import runs are saved and shown in history. The app is built with React, Express, a deterministic insight engine, and MySQL — with sample data fallback so demos always work."

**Actions:**
- Scroll to Import History (if visible).
- Briefly scroll to Customer Journey / Architecture sections in the UI.

---

### 4:15 – 4:45 | Closing

> "Cloud Cost Intelligence helps finance and platform teams answer three questions fast: where money is going, what's wasteful, and what to do first. Thank you."

**On screen:** Dashboard with imported data visible.

---

## Export Settings

- Resolution: 1920×1080
- Format: MP4
- Length target: 3–5 minutes
- Filename suggestion: `Cloud-Cost-Intelligence-Demo.mp4`

---

## Optional: Upload Destinations

- YouTube (Unlisted)
- Google Drive / OneDrive share link
- Include the link in your submission form or `SUBMISSION.md`
