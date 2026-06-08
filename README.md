# 🎂 Tanya Bakes — Website Owner's Guide

This guide explains how to keep your website up to date without any coding knowledge.
Everything you need to edit lives in one file: **`products.json`**.

---

## Quick Reference

| Task | File to Edit | Time |
|---|---|---|
| Add a new cake | `products.json` | ~5 min |
| Update a price | `products.json` | ~2 min |
| Remove a cake | `products.json` | ~2 min |
| Add a cake photo | `images/` folder | ~3 min |
| Change featured cakes | `products.json` | ~2 min |
| Add a new category | `products.json` | ~3 min |
| Update WhatsApp / Instagram | `index.html` | ~5 min |

---

## How to Edit Files on GitHub.com

You never need to download anything. All edits happen in your browser.

1. Go to your repository at **github.com/your-username/tanya-bakes**
2. Click the file you want to edit (e.g. `products.json`)
3. Click the **pencil icon ✏️** (Edit this file) in the top right
4. Make your changes
5. Scroll down and click **"Commit changes"**
6. Leave the default option selected ("Commit directly to main") and click **"Commit changes"**

Your website will update automatically within **1–2 minutes**.

---

## Adding a New Cake

Open `products.json` and find the `"products"` array. Copy the template below
and paste it **before** the final `]` of the products list. Make sure there is a
comma `,` after the closing `}` of the previous product.

```json
{
  "id": "17",
  "name": "Your Cake Name Here",
  "category": "Birthday Cakes",
  "description": "A short, enticing description of this cake. Mention flavours, size options, or what makes it special.",
  "price": "00.000 BD",
  "featured": false,
  "badge": "",
  "image": "images/your-photo-filename.jpg"
}
```

### Field Reference

| Field | What it does | Example |
|---|---|---|
| `id` | Unique ID — just use the next number | `"17"` |
| `name` | The cake name shown on the card | `"Lemon Drizzle Cake"` |
| `category` | Must exactly match a category name (see list below) | `"Birthday Cakes"` |
| `description` | Short description shown on the card | `"A zesty, light..."` |
| `price` | Price displayed on the card | `"12.000 BD"` or `"From 20.000 BD"` |
| `featured` | `true` = shows on homepage (max 3). `false` = catalog only | `true` or `false` |
| `badge` | Optional label overlaid on the photo. Leave `""` for none | `"Popular"`, `"New"`, `"Seasonal"` |
| `image` | Path to the photo in your `images/` folder | `"images/my-cake.jpg"` |

### Valid Category Names

These must be typed **exactly** as shown (capital letters matter):

- `Birthday Cakes`
- `Wedding Cakes`
- `Custom Cakes`
- `Cupcakes`
- `Seasonal Specials`

---

## Updating a Price

Find the product in `products.json`, locate its `"price"` line, and change the value:

```json
"price": "25.000 BD"
```

For products with a variable price, use:

```json
"price": "From 20.000 BD"
```

---

## Removing a Cake

Find the entire `{ ... }` block for that product and delete it — from the opening `{`
to the closing `}`. If it was the last item in the list, also remove the trailing
comma from the product above it.

---

## Adding a New Category

1. Open `products.json`
2. Add the new category name to the `"categories"` array at the top of the file:

```json
"categories": [
  "Birthday Cakes",
  "Wedding Cakes",
  "Custom Cakes",
  "Cupcakes",
  "Seasonal Specials",
  "Your New Category"
],
```

3. Use that exact name in any product's `"category"` field

---

## Changing Featured Cakes (Homepage)

The homepage shows up to **3** products marked `"featured": true`.

- To **add** a cake to the featured section: change its `"featured"` value to `true`
- To **remove** a cake from the featured section: change its `"featured"` value to `false`
- Keep no more than 3 products set to `true` at any time

---

## Adding Cake Photos

**Recommended photo specs:**
- Size: **1200 × 900 px** (landscape, 4:3 ratio works best)
- Format: **JPEG** (.jpg) for photos — smaller file size, faster loading
- File size: Keep under **1 MB** per photo for fast page loads
- Tip: Use [Squoosh.app](https://squoosh.app) (free, in-browser) to resize and compress

**Steps to upload:**

1. Go to your repository on GitHub.com
2. Click the **`images`** folder
3. Click **"Add file"** → **"Upload files"**
4. Drag and drop your photos (you can upload multiple at once)
5. Click **"Commit changes"**

Then in `products.json`, update the `"image"` field for that product:

```json
"image": "images/your-photo-filename.jpg"
```

**Important:** The filename must exactly match — including lowercase letters.
`Birthday-Cake.jpg` and `birthday-cake.jpg` are treated as different files.

If a photo is missing or hasn't loaded, the card will automatically show a
"🎂 Photo Coming Soon" placeholder so nothing looks broken.

---

## Adding Your Hero & About Photos

- **Hero photo** (large image in the top section): save your photo as `images/hero-cake.jpg`
  - Recommended size: 720 × 880 px, portrait orientation
- **About / Our Story photo**: save as `images/about-tanya.jpg`
  - Recommended size: 960 × 720 px, landscape orientation

Both will appear automatically once the files are in the `images/` folder with those exact names.

---

## Updating Your Contact Details

If your **WhatsApp number** changes:

1. Open `index.html`
2. Press **Ctrl + F** (or Cmd + F on Mac) and search for `97336794271`
3. Replace every instance with your new number (digits only, no + sign, no spaces)

If your **Instagram handle** changes:

1. Open `index.html`
2. Search for `tanya.bake`
3. Replace every instance with your new handle

---

## If Something Looks Wrong

**Check your JSON formatting first.** The most common mistake is a missing comma
between products, or a comma after the very last product.

Paste the full contents of `products.json` into **[jsonlint.com](https://jsonlint.com)**
and click Validate. It will pinpoint any formatting error instantly.

**To undo a mistake:** On GitHub.com, go to your file's page, click the **History**
button (clock icon), find the last working version, and restore it.

---

## File Map

```
tanya-bakes/
├── index.html          Website structure and content
├── style.css           Visual design and colours
├── script.js           Catalog logic (filter, search, render)
├── products.json       ⭐ Your menu — edit this file to manage all products
├── images/             All cake photos go here
│   ├── hero-cake.jpg
│   ├── about-tanya.jpg
│   └── (your cake photos)
└── README.md           This guide
```

---

## Upgrade Path: Adding a Visual Admin Panel (Optional, Free)

If editing the JSON file ever feels tedious, you can deploy the exact same website
to **Netlify** (free) and add **Decap CMS** — a visual admin panel at `/admin` where
you can add and edit products through a form interface, no file editing needed.

When you're ready for this upgrade, ask for the Netlify + Decap CMS setup guide.

---

*Wishing Tanya Bakes every success — one beautiful cake at a time. 🎂*
