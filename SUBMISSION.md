# 22North — Submission Package

**Cloud Cost Intelligence Platform · Challenge 5 · Hackathon 2026**

---

## 1. Source Code

| Item | Link / Location |
|------|-----------------|
| **GitHub Repository** | https://github.com/JaymeenDevatka/22North |
| **ZIP Archive** | Run: `Compress-Archive -Path client,server,mysql,docs,package.json,package-lock.json,README.md,SUBMISSION.md,.env.example,.gitignore,docker-compose.yml,practice-cloud-costs.csv -DestinationPath ..\22North-submission.zip -Force` |

---

## 2. Presentation Deck (10 Slides)

| File | Description |
|------|-------------|
| [docs/presentation-deck.md](./docs/presentation-deck.md) | All 10 slides in ASCII/text format |
| [docs/presentation-deck.html](./docs/presentation-deck.html) | Print-ready HTML → open in Chrome → Ctrl+P → Save as PDF |
| [docs/speaker-script.md](./docs/speaker-script.md) | Presenter notes for each slide |
| [docs/presentation-outline.md](./docs/presentation-outline.md) | Quick outline |

**Slides:** Title → Problem → Solution → Features → Journey → Architecture → Tech Stack → Screenshots → Business Value → Thank You

---

## 3. Hackathon Deliverable Documents (Print-ready HTML → Save as PDF)

| File | Document Type | Contents |
|------|---------------|----------|
| [docs/architecture-and-solution-design.html](./docs/architecture-and-solution-design.html) | **Architecture &amp; Solution Design** | Executive summary, problem, solution, systems diagram (Mermaid), tech stack, trade-offs, business value. |
| [docs/api-documentation.html](./docs/api-documentation.html) | **API Documentation** | REST API endpoints, schemas, params, request/response models. |
| [docs/database-design.html](./docs/database-design.html) | **Database Design** | Entity-Relationship diagram (Mermaid), schemas, indexes, DDL. |
| [docs/solution.md](./docs/solution.md) | Markdown Reference | Original markdown draft of design. |


---

## 4. Demo Video (3–5 min)

| File | Purpose |
|------|---------|
| [docs/demo-video-guide.md](./docs/demo-video-guide.md) | Recording script with timestamps |
| [docs/demo-script.md](./docs/demo-script.md) | 5-minute walkthrough |
| [practice-cloud-costs.csv](./practice-cloud-costs.csv) | Sample CSV for demo |

```
Demo Video URL: [PASTE YOUR LINK HERE]
```

---

## 5. README

[README.md](./README.md) includes:

- [ ] Team Name — **fill before submit**
- [ ] Team Members — **fill before submit**
- [ ] College Name — **fill before submit**
- [x] Build & Run Instructions
- [x] Technology Stack

---

## Before Submitting

- [ ] Fill team name, members, college, and contact in README and Slide 1/10
- [ ] Export presentation PDF from `docs/presentation-deck.html`
- [ ] Export solution PDF from `docs/solution.md`
- [ ] Add app screenshots to Slide 8
- [ ] Record demo video (optional)
- [ ] Push to GitHub and test build instructions

---

## Quick Run for Judges

```bash
git clone https://github.com/JaymeenDevatka/22North.git
cd 22North
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:4000/api/health
