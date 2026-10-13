# OIBSIP: Web Development & Designing Internship Projects

**Oasis Infobyte Student Internship Program (SIP) · Track: Web Development & Designing**
**Intern: Rida Zaib** · [GitHub](https://github.com/Rida-Zaib) · [LinkedIn](https://www.linkedin.com/in/rida-zaib)

This repository holds all my task submissions for the Web Development & Designing track. The track asks interns to finish **every task inside one chosen level**; I completed **Level 1 (3 of 3 tasks)** and **Level 2 (4 of 4 tasks)**.

---

## Live demos

Click a link to open the running project in your browser.

| Level | Task | Live demo | What it is |
|---|---|---|---|
| 1 | Task 1: Landing Page | [task1-landing-page-xi.vercel.app](https://task1-landing-page-xi.vercel.app/) | A responsive landing page with a navigation bar, hero section with a call-to-action, content sections and a footer |
| 1 | Task 2: Personal Portfolio | [rida-zaib-portfolio-site.vercel.app](https://rida-zaib-portfolio-site.vercel.app/) | My personal portfolio: about me, skills, projects and contact details |
| 1 | Task 3: Temperature Converter | [task-3-temperature-converter.vercel.app](https://task-3-temperature-converter.vercel.app) | Converts between Celsius, Fahrenheit and Kelvin with input validation |
| 2 | Task 1: Calculator | [task1-calculator-ruby.vercel.app](https://task1-calculator-ruby.vercel.app/) | A multi-tab calculator: Standard and Scientific, plus BMI, Age, CGPA, Height and Distance tools |
| 2 | Task 2: Tribute Page | [aljazari-tribute-page.vercel.app](https://aljazari-tribute-page.vercel.app/) | A tribute page dedicated to Al-Jazari, with biography, timeline of achievements and a quote |
| 2 | Task 3: To-Do Web App | [task3-todo-app.vercel.app](https://task3-todo-app.vercel.app/) | Add, complete, edit and delete tasks, with separate pending and completed lists |
| 2 | Task 4: Login Authentication System | *runs locally, see below* | Full-stack login system (Node.js + Express + SQLite + bcrypt) with a protected dashboard |

> **About Task 4:** it has a real back-end server and a database file, so it does not run on a static hosting site like the others. Its folder has its own README with screenshots and the exact steps to run it on a laptop.

---

## Repository structure

Every project lives in its own folder, named `WebDev-[Level]-[ProjectName]`:

```
OIBSIP/
├── README.md                          (this file)
├── WebDev-L1-LandingPage/
├── WebDev-L1-PersonalPortfolio/
├── WebDev-L1-TemperatureConverter/
├── WebDev-L2-Calculator/
├── WebDev-L2-TributePage/
├── WebDev-L2-TodoApp/
└── WebDev-L2-LoginAuth/
```

Each folder contains the source code, its own `README.md` and screenshots.

---

## Level 1

### Task 1: Landing Page · `WebDev-L1-LandingPage`
**Live:** https://task1-landing-page-xi.vercel.app/

A visually polished landing page for a product or brand, practising layout and styling.

What the task asked for, and what the page includes:
- A fixed or sticky navigation bar with at least 3 links
- A hero section with a headline, a subheadline and a call-to-action button
- At least two content sections, and a footer with contact/social links
- A consistent colour palette and clear typography
- A responsive layout that does not break on mobile (Flexbox / Grid)

### Task 2: Personal Portfolio · `WebDev-L1-PersonalPortfolio`
**Live:** https://rida-zaib-portfolio-site.vercel.app/

My digital résumé: who I am, what I can do, what I have built and how to reach me.

What the task asked for, and what the site includes:
- A profile/hero section with my name and role
- An About Me section and a Skills section
- A Projects section with project cards and GitHub links
- A Contact section
- Smooth scrolling between sections, consistent branding and a fully responsive layout

### Task 3: Temperature Converter · `WebDev-L1-TemperatureConverter`
**Live:** https://task-3-temperature-converter.vercel.app

An interactive tool that converts a temperature between Celsius, Fahrenheit and Kelvin.

What the task asked for, and what the page includes:
- A numeric input that rejects non-numeric values with an error message
- A unit selector and a Convert button
- Results shown with correct unit labels
- A friendly message for impossible values (below absolute zero)

---

## Level 2

### Task 1: Calculator · `WebDev-L2-Calculator`
**Live:** https://task1-calculator-ruby.vercel.app/

More than a basic calculator: it is a small toolbox with one tab per calculator, and each tab has a background colour matched to its topic.

- **Standard and Scientific** calculators (violet/pink theme)
- **BMI** calculator (teal)
- **Age** calculator (amber)
- **CGPA** calculator (indigo/gold): you edit the grading scale in a table, and can enter your previous CGPA and previous credit hours to get a **cumulative CGPA**
- **Height** converter (sky blue)
- **Distance** converter (cyan/blue)

The task's basics are covered: a display, number and operator buttons, equals, clear, backspace, division-by-zero protection and chained operations.

### Task 2: Tribute Page · `WebDev-L2-TributePage`
**Live:** https://aljazari-tribute-page.vercel.app/

A tribute page dedicated to **Al-Jazari**, the medieval engineer and inventor.

What the task asked for, and what the page includes:
- A title with the subject's name and a one-line tagline
- A prominent image and a written biography/tribute section
- A timeline of key achievements and a styled quote block
- Several background colours and font styles, in a responsive layout

### Task 3: To-Do Web App · `WebDev-L2-TodoApp`
**Live:** https://task3-todo-app.vercel.app/

A task manager for daily work.

What the task asked for, and what the app includes:
- Add a task and see it appear instantly in the **Pending** list
- Mark a task complete to move it to the **Completed** list
- Edit a task's text and delete a task
- Counters for pending and completed tasks, and friendly empty-state messages

### Task 4: Login Authentication System · `WebDev-L2-LoginAuth`
**Run it locally:** see the project's own README (steps, screenshots and code explanation)

A complete full-stack login system built with **Option B** of the task card: Node.js, Express and SQLite.

![AuraAuth sign-in page](WebDev-L2-LoginAuth/screenshots/login.png)

- Registration with username/email and password; **minimum 8 characters and at least 1 number**
- Duplicate username/email error
- Login with a single generic error that never says which part was wrong
- A **protected dashboard** that redirects to login without a session, and a **logout** button
- Passwords hashed with **bcrypt**, never stored as plain text; server-side sessions in an httpOnly cookie
- Extras: email verification with a 6-digit code, forgot password, a password strength meter and generator, breached-password blocking, strict email checks and account lockout

---

## How to run a project locally

1. Open the project's folder.
2. If it has a `package.json`, run:
   ```bash
   npm install
   npm run dev
   ```
   and open the address the terminal prints (usually `http://localhost:3000` or `http://localhost:5173`).
3. If it is plain HTML/CSS/JavaScript, open `index.html` in a browser.
4. **Login Authentication System** is different: it needs Node.js 22.13 or newer and two commands (`npm install`, then `npm run dev:all`). See `WebDev-L2-LoginAuth/README.md`.

---

## Task completion

| Level | Tasks | Status |
|---|---|---|
| Level 1 | Landing Page, Personal Portfolio, Temperature Converter | 3 of 3 completed |
| Level 2 | Calculator, Tribute Page, To-Do App, Login Authentication System | 4 of 4 completed |

---



*Built during the Oasis Infobyte Student Internship Program. #oasisinfobyte*
