import React from 'react';
import type { StructureResolver } from 'sanity/structure';

/**
 * Sidebar, in the order the team actually uses it:
 * Sundays / Collaborations / Partners / Team / Stats — then the
 * inquiry pipeline, content odds-and-ends, settings, and the guide.
 */

const INQUIRY_STATUSES = ['new', 'replied', 'in conversation', 'done', 'not a fit'];

const Guide = () => (
  <div style={{ padding: '2rem 3rem', maxWidth: 720, lineHeight: 1.7, fontSize: 14 }}>
    <h1 style={{ fontSize: 22 }}>How this studio works</h1>
    <p style={{ opacity: 0.8 }}>
      Changes appear on the site about <b>2 minutes after you press Publish</b>.
      Saving a draft changes nothing on the site — only Publish does.
      Every change is kept in history (⋮ menu → Review changes), so nothing you do is unfixable.
    </p>

    <h2 style={{ fontSize: 17, marginTop: 28 }}>How to log a Sunday — 5 steps</h2>
    <ol>
      <li>Open <b>Sundays</b> → the ＋ button.</li>
      <li>Fill in the date, city, where it was, and roughly how many came.</li>
      <li>Paste the week's <b>Google Drive folder link</b> into the Drive field. (Make sure the folder is shared with the sync account — see STUDIO_SETUP.md.)</li>
      <li>Press <b>Publish</b>. Photos appear after the next sync run — you never upload them by hand.</li>
      <li>After the sync, open the document again and add a one-line description to each photo.</li>
    </ol>

    <h2 style={{ fontSize: 17, marginTop: 28 }}>How to answer an inquiry</h2>
    <ol>
      <li>Open <b>Partner inquiries → New</b> — newest sit on top.</li>
      <li>Reply from your own email (the inquirer's address is on the document).</li>
      <li>Set the status to <b>replied</b> (and later: in conversation / done / not a fit).</li>
      <li>Anything worth remembering goes in <b>Internal notes</b> — it's never shown anywhere.</li>
    </ol>

    <h2 style={{ fontSize: 17, marginTop: 28 }}>What the Drive sync does</h2>
    <p>
      A small script checks every published Sunday that has a Drive folder link but no photos yet,
      downloads the images from that folder, stores them with the rest of the site's images,
      and attaches them to the Sunday. It runs when a developer runs <code>npm run sync-drive</code>.
      If it fails, it says why in plain words — usually the folder wasn't shared with the sync account.
    </p>

    <h2 style={{ fontSize: 17, marginTop: 28 }}>Saturday-evening publish ritual</h2>
    <p>
      Scheduled publishing isn't part of our (free) plan, so anything that must go live for the
      weekend is published by hand: write it as a draft any time, then on Saturday evening open the
      draft and press <b>Publish</b>. Two minutes later it's on the site.
    </p>
  </div>
);

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Pune Bookies')
    .items([
      S.listItem()
        .title('📌 Notice strip')
        .child(S.document().schemaType('noticeBar').documentId('noticeBar')),
      S.divider(),
      S.documentTypeListItem('sunday').title('Sundays'),
      S.documentTypeListItem('collaboration').title('Collaborations'),
      S.documentTypeListItem('brandPartner').title('Partners'),
      S.documentTypeListItem('teamMember').title('Team'),
      S.documentTypeListItem('siteStat').title('Stats'),
      S.divider(),
      S.listItem()
        .title('Partner inquiries')
        .child(
          S.list()
            .title('By status')
            .items([
              ...INQUIRY_STATUSES.map((status) =>
                S.listItem()
                  .title(status[0].toUpperCase() + status.slice(1))
                  .child(
                    S.documentList()
                      .title(status)
                      .filter('_type == "partnerInquiry" && status == $status')
                      .params({ status })
                      .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
                  )
              ),
              S.listItem().title('Everything').child(
                S.documentList()
                  .title('All inquiries')
                  .filter('_type == "partnerInquiry"')
                  .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
              ),
            ])
        ),
      S.divider(),
      S.documentTypeListItem('story').title('Stories'),
      S.documentTypeListItem('faqItem').title('FAQ'),
      S.documentTypeListItem('pressMention').title('Press'),
      S.documentTypeListItem('city').title('Cities'),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('📖 How this studio works')
        .child(S.component(Guide).title('Guide')),
    ]);
