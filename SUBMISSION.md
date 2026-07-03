# 22North Challenge — Submission Package

Complete checklist of deliverables for **Cloud Cost Intelligence**.

---

## 1. Source Code

| Item | Link / Location |
|------|-----------------|
| **GitHub Repository** | https://github.com/JaymeenDevatka/22North |
| **Local ZIP (create before upload)** | Run from project root: `Compress-Archive -Path * -DestinationPath ..\22North-submission.zip -Force` |

---

## 2. Presentation Deck (PPT / PDF)

| Format | Location | How to export |
|--------|----------|---------------|
| **Slide content (Markdown)** | [docs/presentation-deck.md](./docs/presentation-deck.md) | Copy into PowerPoint or Google Slides |
| **Print-ready HTML deck** | [docs/presentation-deck.html](./docs/presentation-deck.html) | Open in Chrome → Print → Save as PDF |
| **Speaker notes** | [docs/speaker-script.md](./docs/speaker-script.md) | Presenter script for each slide |
| **Outline** | [docs/presentation-outline.md](./docs/presentation-outline.md) | Quick reference |

**To create PDF:** Open `docs/presentation-deck.html` in a browser, press `Ctrl+P`, choose **Save as PDF**, enable **Background graphics**.

---

## 3. Solution Document (Architecture, Design & Assumptions)

| Document | Location |
|----------|----------|
| **Full solution document** | [docs/solution.md](./docs/solution.md) |
| **Architecture diagram** | [docs/architecture.md](./docs/architecture.md) |
| **API design** | [docs/api.md](./docs/api.md) |

Export `docs/solution.md` to PDF via VS Code, Pandoc, or paste into Google Docs → Download as PDF.

---

## 4. Demo Video (3–5 min, optional but recommended)

| Item | Location |
|------|----------|
| **Recording script & checklist** | [docs/demo-video-guide.md](./docs/demo-video-guide.md) |
| **5-minute walkthrough** | [docs/demo-script.md](./docs/demo-script.md) |
| **Sample CSV for demo** | [practice-cloud-costs.csv](./practice-cloud-costs.csv) |

**After recording:** Upload MP4 to YouTube (Unlisted) or cloud storage and paste the link here:

```
Demo Video URL: [PASTE YOUR LINK HERE]
```

---

## 5. README

| Item | Location |
|------|----------|
| **Project README** | [README.md](./README.md) |

The README includes:
- Team Name
- Team Members
- College Name
- Build & Run Instructions
- Technology Stack Used

> **Action required:** Fill in team details in `README.md` before final submission.

---

## Quick Build & Run (for judges)

```bash
# 1. Clone
git clone https://github.com/JaymeenDevatka/22North.git
cd 22North

# 2. Install
npm install

# 3. (Optional) MySQL setup
mysql -u root -p < mysql/init/01_schema.sql
copy .env.example .env

# 4. Run
npm run dev

# 5. Open
# Frontend: http://localhost:5173
# API:      http://localhost:4000/api/health
```

---

## Submission Checklist

- [ ] GitHub repository is public and up to date
- [ ] Team name, members, and college filled in README
- [ ] Presentation exported to PDF or PPT
- [ ] Solution document exported to PDF
- [ ] Demo video recorded and link added (optional)
- [ ] ZIP archive created (if required by portal)
- [ ] All links tested before submitting
