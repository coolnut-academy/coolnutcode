# COOLNUTCODE — AI Project Workflow Builder

> A static, zero-backend web app that turns a Thai project idea into a full Claude + Codex + Gemini workflow in seconds.  
> Deployable on GitHub Pages. No server, no build step, no secrets in the repo.

---

## What It Does

COOLNUTCODE analyzes your idea, picks the right complexity level and tech stack, then generates:

- A **Claude planning prompt** that produces your full `/project-docs/` folder
- A **Codex implementation prompt** scoped to Phase 1 only
- A **workflow timeline** from idea to deploy
- Mode-specific prompts for debugging, QA, feature patching, and existing-project rescue

The tool works entirely in the browser. Gemini API is optional — every mode has a local fallback that produces a structured prompt without calling any API.

---

## Features

| Feature | Description |
|---|---|
| **Build From Scratch** | Full workflow: auto-detect complexity, stack, Claude plan, Codex phases |
| **Legacy Step 0 Prompt** | Quick single-pass planning prompt for Claude or Gemini |
| **Mid-Dev Build** | Scoped feature-add prompt for Codex in VS Code |
| **Debug & Fix** | Structured debugging prompt with root-cause-first workflow |
| **Final QA** | Pre-deploy audit prompt for Claude review |
| **Extract Context** | Make Codex scan an existing codebase and write `architecture.md` |
| **Existing Project Patch** | Minimal-diff patch prompt with acceptance criteria |
| **Debug Rescue** | Two-round rule: Codex twice → Claude root cause escalation |
| **Gemini API mode** | Optional AI-enhanced output via `gemini-2.5-flash` |
| **PWA installable** | Add to home screen on mobile or desktop |

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI runtime | React 18 (CDN, no build step) |
| Styling | Tailwind CSS v3 (pre-compiled `styles.css`) |
| Icons | Lucide (CDN) |
| AI API | Google Gemini (`generativelanguage.googleapis.com`) — optional |
| Hosting | GitHub Pages (static, no backend) |
| PWA | `manifest.webmanifest` + PNG icons |

---

## File Structure

```
coolnutcode/
├── index.html                  # Main app shell (React mount point)
├── app.js                      # All React logic — components, prompts, analysis engine
├── styles.css                  # Pre-compiled Tailwind CSS
├── guide.html                  # Full usage guide page (Thai)
├── manifest.webmanifest        # PWA manifest
├── coolnutcode-logo-web.png    # Logo used in UI
├── coolnutcode-icon-192.png    # PWA icon (192×192)
├── coolnutcode-icon-512.png    # PWA icon (512×512)
└── coolnutcode-apple-touch-icon.png  # iOS home screen icon
```

---

## How to Use

### Option A — Open Directly (No Setup)

```
open index.html
```

Works offline. No Node, no npm, no server needed.

### Option B — Serve Locally

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .

# VS Code
# Install "Live Server" extension → Right-click index.html → Open with Live Server
```

Then open `http://localhost:8080`.

### Option C — Deploy to GitHub Pages

1. Push the repo to GitHub
2. Go to **Settings → Pages → Source → Deploy from branch**
3. Select `main` / `root`
4. Done — your URL will be `https://<username>.github.io/<repo>/`

> **Do not commit API keys.** GitHub Pages is public. Keys go in the browser settings panel only.

---

## Usage Walkthrough

### Starting a New Project

1. Open the app and select **New Project → Build From Scratch**
2. Type your idea in Thai — e.g. `เว็บคำนวณ BMI หน้าเดียว` or `ระบบ portfolio นักเรียน มี login และ admin`
3. Click **Generate Project Workflow**
4. Read the **Analysis** card — it shows your complexity level (0–4) and why
5. Copy the **Claude Planning Prompt** → paste into Claude Pro
6. Claude outputs 10 Markdown files — save them as `/project-docs/` in VS Code
7. Copy the **Codex Implementation Prompt** → paste into Codex in VS Code
8. Codex reads the docs and implements **Phase 1 only**
9. Run `npm run build` / `npm run lint` as instructed — fix before moving on

### Working on an Existing Project

| Situation | Mode to Use |
|---|---|
| First time touching the codebase | **Extract Context** — Codex scans local files, writes `architecture.md` |
| Adding a feature | **Existing Project Patch** — references the context docs |
| Something is broken | **Debug Rescue** — two-round rule + Firebase/Tailwind file guidance |

### Quick Tasks (no planning needed)

| Situation | Mode to Use |
|---|---|
| Add a feature to current project | **Mid-Dev Build** |
| Chase a bug | **Debug & Fix** |
| Review before deploy | **Final QA** |
| Need a fast planning prompt | **Legacy Step 0 Prompt** |

---

## Complexity Levels

The analyzer scores your idea automatically and assigns a level:

| Level | Label | AI | Stack |
|---|---|---|---|
| 0 | Tiny Task | Codex only | Existing stack |
| 1 | Simple Static App | Codex only | `index.html` + Tailwind CDN + GitHub Pages |
| 2 | Medium Interactive App | Claude mini-plan → Codex | Vite + React + TypeScript + Tailwind |
| 3 | Full-stack App | Claude full-plan → Codex phase-by-phase | Next.js + TypeScript + Tailwind CSS v4 + Firebase + Vercel |
| 4 | High-risk / Production | Claude architecture → Codex → Claude review each phase | Next.js + Firebase + Security Rules + Vercel + strong QA |

---

## Recommended Stacks

| Key | Stack | When to Use |
|---|---|---|
| **A** | `index.html` + Tailwind CDN + GitHub Pages | One-page apps, calculators, prompt helpers, landing pages — no login, no database |
| **B** | Vite + React + TypeScript + Tailwind | Multi-component UI, local state, filter/search/export — still no backend |
| **C** | Next.js App Router + TypeScript + Tailwind CSS v4 + Firebase + Vercel | Login, dashboard, roles, file upload, user data, production deployment |

---

## Gemini API Setup (Optional)

The tool works without an API key. To enable AI-enhanced output:

1. Click **API Settings** in the top bar
2. Paste your `AIza...` key from [Google AI Studio](https://aistudio.google.com)
3. Tick **Use API**
4. Optionally tick **Remember key on this browser** (stores in `localStorage`)

> The key is stored only in your browser session or `localStorage`. It is never sent to any server other than Google's API endpoint. Never commit a key to your repo.

Default model: `gemini-2.5-flash`. You can change it in the model field.

---

## Debug Escalation Rule

If Codex fails on the same bug **twice**, stop implementing and escalate:

1. Collect: exact command, full error log, relevant files, `package.json`
2. For **Tailwind issues**: add `globals.css` / `styles.css`
3. For **Firebase issues**: add Firestore rules, Storage rules, config shape
4. Paste everything into **Claude Pro** and ask for root cause analysis
5. Use Claude's diagnosis to write a new scoped Codex fix prompt

---

## Security Notes

- **Never put API keys in `index.html`, `app.js`, or any file committed to the repo**
- GitHub Pages serves files publicly — any secret in the repo is exposed
- Firebase projects must have Firestore and Storage security rules reviewed before deploy
- Stack A (static) must not add a backend, hidden proxy, or Next.js conversion

---

## Browser Support

Any modern browser (Chrome, Safari, Firefox, Edge). PWA install supported on Chrome and Safari iOS.

---

## Local Development

No build toolchain required. Edit `app.js` directly and refresh the browser. If you need to regenerate `styles.css` from Tailwind:

```bash
npx tailwindcss -i ./input.css -o ./styles.css --watch
```

---

## License

MIT
