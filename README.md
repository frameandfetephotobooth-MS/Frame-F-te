# Frame & Fête website

Responsive static website for Frame & Fête Photo Booth Experiences + Keepsakes.

## Inquiry form

The event inquiry builder is connected to Formspree endpoint `https://formspree.io/f/maeojppl`. Customers complete the form, review their selections, then submit directly to Formspree. Form notifications should be configured in the Formspree dashboard for `frameandfetephotobooth@gmail.com`.

The form submission includes the event details, chosen experience, selected enhancements, notes, customer email, and a readable request summary. The form does not take payment or confirm/hold event dates.

## Test before launch

1. Open the site using a local web server or after deployment (some browsers restrict form requests from `file://`).
2. Submit a clearly labeled test inquiry using an email address you can access.
3. Confirm the submission appears in the Formspree dashboard and the notification arrives at `frameandfetephotobooth@gmail.com`.
4. Check spam/junk if the notification is not in the inbox.
5. Delete or label the test submission after confirming delivery.

## Publish

Upload the contents of this folder to your GitHub repository. Keep the `assets` folder alongside `index.html`, `styles.css`, and `script.js`.
