#!/usr/bin/env node
/**
 * Drive → Sanity photo sync.
 *
 * Finds published `sunday` documents that have a `driveFolder` link and
 * no `syncedImages` yet, downloads every image in that Drive folder via
 * the official Google Drive API (service account, read-only), uploads
 * them to Sanity's asset CDN, and writes the references back.
 *
 * Idempotent: a Sunday with photos is never touched again; re-running
 * after a partial failure picks up only what's missing.
 *
 * Run:  npm run sync-drive   (from /studio, .env filled in)
 * Env:  SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET,
 *       SANITY_WRITE_TOKEN, GOOGLE_APPLICATION_CREDENTIALS
 */

import { createClient } from '@sanity/client';
import { google } from 'googleapis';
import { readFileSync, existsSync } from 'node:fs';
import 'dotenv/config';

const IMAGE_MIME = /^image\/(jpeg|png|webp|heic|heif)/;
const MAX_PER_SUNDAY = 40;   // sanity cap; a Sunday won't have more keepers

// ---------- config & loud, readable failures ----------
function die(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID;
const DATASET = process.env.SANITY_STUDIO_DATASET || 'production';
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!PROJECT_ID) die('SANITY_STUDIO_PROJECT_ID is not set. Copy .env.example to .env and fill it in.');
if (!TOKEN) die('SANITY_WRITE_TOKEN is not set. Create one at sanity.io/manage → API → Tokens (Editor).');
if (!KEY_FILE || !existsSync(KEY_FILE)) {
  die(`Google service-account key not found at "${KEY_FILE}".\n  Follow STUDIO_SETUP.md section 3, download the JSON key, and point GOOGLE_APPLICATION_CREDENTIALS at it.`);
}

const sanity = createClient({ projectId: PROJECT_ID, dataset: DATASET, token: TOKEN, apiVersion: '2026-01-01', useCdn: false });

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],   // least privilege: read-only
});
const drive = google.drive({ version: 'v3', auth });

const folderIdFrom = (url) => {
  const m = String(url).match(/folders\/([A-Za-z0-9_-]+)/) || String(url).match(/[?&]id=([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
};

// ---------- the sync ----------
const pending = await sanity.fetch(
  `*[_type == "sunday" && defined(driveFolder) && !(_id in path("drafts.**")) && count(syncedImages) == 0]{ _id, date, locationName, driveFolder }`
);

if (!pending.length) {
  console.log('✓ Nothing to sync — every Sunday with a Drive folder already has its photos.');
  process.exit(0);
}

console.log(`Syncing ${pending.length} Sunday(s)…\n`);
let failures = 0;

for (const sun of pending) {
  const label = `${sun.date ?? sun._id} (${sun.locationName ?? 'no location'})`;
  const folderId = folderIdFrom(sun.driveFolder);
  if (!folderId) {
    console.error(`✗ ${label}: "${sun.driveFolder}" doesn't look like a Drive FOLDER link. Open the folder in Drive and copy the URL from the address bar.`);
    failures++;
    continue;
  }

  let files;
  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, size)',
      pageSize: 100,
    });
    files = (res.data.files ?? []).filter((f) => IMAGE_MIME.test(f.mimeType ?? ''));
  } catch (err) {
    const why = err?.code === 404
      ? 'The folder was not found — most likely it is NOT SHARED with the sync account. Share the folder (Viewer) with the service-account email from STUDIO_SETUP.md step 3.'
      : `Google said: ${err.message}`;
    console.error(`✗ ${label}: ${why}`);
    failures++;
    continue;
  }

  if (!files.length) {
    console.error(`✗ ${label}: the folder has no images in it (or only non-image files).`);
    failures++;
    continue;
  }
  if (files.length > MAX_PER_SUNDAY) {
    console.log(`  ${label}: folder has ${files.length} images; taking the first ${MAX_PER_SUNDAY}.`);
    files = files.slice(0, MAX_PER_SUNDAY);
  }

  const refs = [];
  for (const f of files) {
    try {
      const dl = await drive.files.get({ fileId: f.id, alt: 'media' }, { responseType: 'arraybuffer' });
      const asset = await sanity.assets.upload('image', Buffer.from(dl.data), {
        filename: f.name,
        source: { id: f.id, name: 'google-drive' },   // provenance → re-runs can dedupe
      });
      refs.push({
        _type: 'image',
        _key: f.id,
        asset: { _type: 'reference', _ref: asset._id },
      });
      console.log(`  ↑ ${label}: ${f.name} → ${asset._id}`);
    } catch (err) {
      console.error(`  ✗ ${label}: failed on ${f.name}: ${err.message}`);
    }
  }

  if (!refs.length) {
    console.error(`✗ ${label}: nothing uploaded — leaving the document untouched so a re-run retries.`);
    failures++;
    continue;
  }

  await sanity.patch(sun._id).set({ syncedImages: refs }).commit();
  console.log(`✓ ${label}: ${refs.length} photo(s) attached.\n`);
}

if (failures) {
  console.error(`\nDone with ${failures} failure(s) — see messages above. Re-running is safe.`);
  process.exit(1);
}
console.log('\n✓ All synced.');
