# Setting up the Pune Bookies studio
*Written for a person, not a developer. Follow top to bottom; nothing here assumes you know what any of these tools are. Time: about an hour, once, ever.*

The studio is the website's notebook: Sundays, photos, partner inquiries, the team list, every editable line. It is free for our size (verified June 2026: Sanity's free plan covers 20 people, 10,000 documents, 100GB of images — we are nowhere near any of these).

---

## 1. Create the Sanity project (10 min)

1. Go to **sanity.io** → "Get started" → sign up with the team Google account.
2. When it asks, create a new project named **Pune Bookies**.
3. Choose the **Free** plan and a dataset named **production** (their default).
4. Open **sanity.io/manage**, click the project, and copy the **Project ID** (a short code like `ab12cd3e`). You'll paste it in step 4.

## 2. Put the studio on your computer (10 min)

1. Install **Node.js** from nodejs.org (the "LTS" button) if it isn't installed.
2. Open the **Terminal** app, then type these two lines, pressing Enter after each:
   ```
   cd <wherever-the-repo-is>/pune-bookies/studio
   npm install
   ```
3. Copy the example settings file:
   ```
   cp .env.example .env
   ```
4. Open the new `.env` file in any text editor and fill in the Project ID from step 1.

## 3. The Google Drive sync account (15 min)

This lets the studio pull each Sunday's photos straight from a Drive folder. It's a "service account" — a robot Google user that can only **read** folders you explicitly share with it.

1. Go to **console.cloud.google.com** → sign in → "Create project" → name it `pune-bookies-sync`.
2. In the search bar at the top, search **"Google Drive API"** → click it → **Enable**.
3. Search **"Service accounts"** → **Create service account** → name it `drive-sync` → Create → skip the optional permission screens → Done.
4. Click the account you just made → **Keys** tab → **Add key → Create new key → JSON** → a file downloads. Move that file into the `studio/` folder and rename it `google-service-account.json`. **Never** email this file or put it in git (the repo is already set up to ignore it).
5. On the same page, copy the service account's **email address** (looks like `drive-sync@pune-bookies-sync.iam.gserviceaccount.com`).
6. In **Google Drive**, right-click the photos folder (or its parent folder, once, to cover all weeks) → Share → paste that email → role **Viewer** → Share. This is the entire permission the robot has: it can look at that folder. Nothing else.

## 4. Tokens and the rest of `.env` (5 min)

1. At **sanity.io/manage** → your project → **API → Tokens → Add API token**: name `scripts`, permissions **Editor**. Copy it into `.env` as `SANITY_WRITE_TOKEN`.
   *This token can write content — treat it like a key to the studio. It lives only in `.env` files and in Vercel's server settings, never in the website's public code.*
2. Your `.env` should now have all four lines filled.

## 5. First run (5 min)

```
npm run seed     # fills the studio with the site's current content
npm run dev      # opens the studio at localhost:3333
```
Sign in with the same Google account. You should see Sundays / Collaborations / Partners / Team / Stats in the sidebar, and "📖 How this studio works" at the bottom — that page is the team's manual.

## 6. Put the studio online (10 min)

So the team can edit from anywhere, not just this computer:

```
npm run deploy
```
Pick a name like `pune-bookies` → the studio appears at `pune-bookies.sanity.studio`. (Alternative: deploy the `studio/` folder as its own Vercel project — either works; `sanity deploy` is the simpler button.)

## 7. Invite the team (2 min)

**sanity.io/manage** → project → **Members** → invite by email.

**Access list — keep this section true:**
| Person | Role | Why |
|---|---|---|
| Tanvi | Administrator | owner |
| Shrey | Administrator | runs partnerships + this setup |
| Samruddhi | Editor* | content |

*\*The free plan only has Administrator and Viewer roles for management purposes — every invited member can edit content. Don't invite anyone who shouldn't edit.*

## 8. Make edits go live automatically (5 min)

1. In **Vercel** → the website project → Settings → Git → **Deploy Hooks** → create one named `sanity-publish` (branch `main`) → copy the URL.
2. At **sanity.io/manage** → project → **API → Webhooks → Create webhook**: name `deploy site`, URL = the one you copied, trigger on **create/update/delete**, dataset `production`.
3. From then on: press Publish in the studio → the site rebuilds → live in ~2 minutes.

## 9. Photos: the weekly rhythm

1. After a Sunday, someone drops the photos in a Drive folder (inside the folder you shared in step 3.6).
2. In the studio: open that Sunday → paste the folder link → Publish.
3. A developer (or a scheduled job, later) runs `npm run sync-drive` from `studio/`. Photos attach themselves. Add one-line descriptions to each photo when convenient — the site won't show a photo without one.

## 10. Backups

A GitHub Action exports the whole dataset every night and keeps it as a downloadable file on the repo's **Actions** tab (kept 90 days). To make it work, a developer adds two **repository secrets** on GitHub (Settings → Secrets → Actions): `SANITY_PROJECT_ID` and `SANITY_AUTH_TOKEN` (a **Viewer** token is enough for exports — least privilege).

To restore from a backup: download the export file from the Actions run → `npx sanity dataset import <file> production` from `studio/`.

## Security notes (the short version)

- The **write token** lives in `.env` (this folder, gitignored) and in Vercel's server-side environment settings only. It never appears in the website's public code or in any `PUBLIC_` variable.
- The **Google service account** can only *read* the one shared folder. It cannot see the rest of Drive, and it cannot write anywhere.
- The **backup token** is read-only.
- The studio sign-in is the team's Google accounts; removing someone from Members removes their access everywhere.
- Sanity keeps full **revision history** on every document — any mistake can be rolled back from the ⋮ menu → "Review changes".
