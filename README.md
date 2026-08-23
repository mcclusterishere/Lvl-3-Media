# LEVEL 3 MEDIA — Website

Modern, mobile-first landing + booking site for **Level 3 Media LLC**.

Built for ad traffic → high-converting onboarding form that emails you the lead details (name, phone, budget, project type, dates, notes).

## Live Preview

After you enable GitHub Pages (or deploy the files to your hosting):

- **GitHub Pages**: `https://mcclusterishere.github.io/Lvl-3-Media/`
- Or just open `index.html` in a browser for local preview.

## Quick Setup (5 minutes)

### 1. Connect the booking form (so you get emails)

1. Go to [https://web3forms.com](https://web3forms.com) → “Create Access Key” (free, no credit card)
2. Use the email address where you want booking inquiries to land
3. Copy the Access Key
4. Open `index.html`
5. Find this line and replace the placeholder:

```html
<input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
```

6. Save & push. Done. Every form submit emails you instantly.

(Alternative: Formspree, Netlify Forms, etc. — same idea.)

### 2. Deploy

**Option A — GitHub Pages (easiest free preview)**
1. Repo Settings → Pages
2. Source: Deploy from a branch → `main` → `/ (root)`
3. Save. Site goes live at `https://mcclusterishere.github.io/Lvl-3-Media/`

**Option B — Their existing hosting**
Just upload `index.html` (and this README if you want) to the root of the domain / whatever folder their host uses. It’s a single static file — zero build step.

**Option C — Netlify / Vercel / Cloudflare Pages**
Drag & drop the folder or connect the repo. Instant HTTPS + custom domain.

## What’s included

- Dark cinematic design matching the IG aesthetic
- Mobile-first (large touch targets, sticky “Book a Shoot” bar on mobile)
- Hero → Work grid → Services → **Booking form** → About → Footer
- Form fields optimized for music video / photo / production leads:
  - Name, Phone, Email
  - Project Type + Budget Range
  - Preferred date / timeline
  - Free-text project details
  - “How did you find us?” (so you can track ad performance)
- Smooth scroll, subtle animations, sticky header
- Direct links to Instagram + YouTube
- Logo mark matching the current circular 3-bar icon

## Customization notes

- Colors, copy, and portfolio cards are easy to edit in the single `index.html`
- Portfolio cards currently link to Instagram — swap in real video embeds or project pages later if wanted
- Stats (200+ videos, 15+ years, 4.7k followers) pulled from public bio / IG — update anytime

## Repo

`mcclusterishere/Lvl-3-Media` (private)

---

Built clean so ads can land on `/#book` or just the homepage and convert.
