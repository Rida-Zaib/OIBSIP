# Demo video script (about 2 to 3 minutes)

**First 2 seconds: a static title card (a slide or text on a plain background):**

> Rida Zaib
> Web Development & Designing
> Task 4: Login Authentication System (Level 2)

Then record your screen, with the app running at `http://localhost:3000` (or your live link).

1. **Intro (10 s).** "This is AuraAuth, a full-stack login system: React front-end, Node.js and Express back-end, bcrypt hashing and SQLite."
2. **Empty form.** Press Create Account with empty fields to show the validation messages.
3. **Weak password.** Type `abc` / `abcdefgh`: show the strength meter and that the "8 characters + 1 number" rule blocks it.
4. **Password generator.** Open "Generate a strong password", show the meter go to Excellent. Mention it also blocks passwords found in known data breaches (try `Password123`).
5. **Register successfully.** (If email verification is on, enter the code from the Dev Inbox.)
6. **Duplicate.** Register the same username/email again: show the "already exists" error.
7. **Login with wrong password.** Show the generic message "Invalid username/email or password" (it never says which part is wrong). Try a non-existent user to show it is identical.
8. **Direct dashboard access.** In a fresh private window open `/#/dashboard`: it redirects to login.
9. **Login correctly.** Show the dashboard, then **Change password** (optional).
10. **Logout.** Click Log Out and show you land on the login page; press Back or open `/#/dashboard` again: still redirected.
11. **Where the password lives.** Optional: open `server/data` is not needed; just say "passwords are stored as bcrypt hashes, never as plain text, and the session is an httpOnly cookie."
12. **Bonus (20 s).** Show "Forgot password?" and the favicon in the browser tab.

Do not show your `.env` file on screen.
