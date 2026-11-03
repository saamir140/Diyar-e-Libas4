# DIYAR-E-LIBAS — Integrated static website

## Root structure
- `index.html` — homepage (must stay at repository root)
- `home/home.css` and `home/home.js` — homepage-only styling and behavior
- `legend-cotton/` — existing Legend Cotton product page
- `kadhar/` — existing Kadhar product page
- `wash-n-wear/` — existing Wash & Wear product page
- `shared/assets/` — shared assets

## GitHub upload
Upload the **contents of this folder** to the top level of the existing GitHub repository. Do not upload the enclosing `DIYAR-E-LIBAS-Integrated-Site` folder as a nested folder. The repository root should show `index.html`, `home`, `legend-cotton`, `kadhar`, `wash-n-wear`, `shared`, and `README.md` side by side.

## Vercel
Set Root Directory to `./` (repository root). This is a static HTML/CSS/JS site; no build command is required.

## Product photos
Add actual photos later inside each collection's own `assets/images/` folder and use the filenames already referenced by that collection's `script.js` / `content/products.json`. Do not rename the folders or move product files.

## Important
Product-page HTML, CSS, JavaScript, and JSON have been carried over without redesign. Homepage navigation uses relative links to all three product folders. Verify product images and checkout/order integrations separately before accepting live orders.
