# Submission notes (for me only)

Personal checklist for handing this task in. This is **not** part of the project description: delete this file before pushing if you like.

## Oasis Infobyte submission checklist

- [ ] GitHub repository named exactly **`OIBSIP`** (one repo for all tasks, public profile)
- [ ] This project in **`OIBSIP/WebDev-L2-LoginAuth/`** with its `README.md` and screenshots
- [ ] Demo video: 2-second title card (Full Name, Track, Task Title), then the app working end to end (see `DEMO-SCRIPT.md`)
- [ ] LinkedIn post with the video, tagging Oasis Infobyte, with `#oasisinfobyte`
- [ ] Substantive comments on at least two other interns' videos
- [ ] Task Submission Form with your `OIBSIP` repository link

Level 2 needs **all four** tasks: Calculator, Tribute Page, To-Do App and this Login Authentication System.

---

## Upload to GitHub

Create an empty repository named exactly **`OIBSIP`** on github.com (no README, no .gitignore). In the folder that contains all your task folders:

```powershell
git init
git add .
git status            # .env, node_modules and server/data must NOT be listed
git commit -m "Oasis Web Dev: Level 2 projects"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/OIBSIP.git
git push -u origin main
```

If Git asks for a password, use a **Personal Access Token** (GitHub > Settings > Developer settings) or the browser sign-in prompt. Never commit `.env`, `node_modules` or virtual environments such as `venv`; they belong in `.gitignore`.

---

The demo video script is in `DEMO-SCRIPT.md`.
