# DIYAR-E-LIBAS — Website starter

A static HTML/CSS/JavaScript foundation for the DIYAR-E-LIBAS premium unstitched fabric store.

## Pages
- `/` — homepage
- `/legend-cotton/` — 6 colour options
- `/kadhar/` — 6 colour options
- `/wash-n-wear/` — 8 colour options

## Structure
Each page has its own HTML, CSS, JavaScript, content JSON, and image directory. Shared brand styling is intentionally kept local to each page for now, so page-specific changes are isolated.

## Add product photos
Place each collection's real photos in its own `assets/images/` folder. Update that collection's `content/products.json` so each colour's `image` value points to the exact filename. Example:
`"image": "assets/images/black.jpg"`

The first colour is selected by default. Clicking a swatch changes the main image to the matching image path. Use descriptive colour names and correct image filenames once the product photos are supplied.

## Before launch
- Replace homepage image placeholders with supplied brand/product photography.
- Update all colour names and swatch hex values from actual products.
- Add verified prices, fabric length and product details.
- Confirm COD, shipping and returns wording.
- Connect the chosen checkout/order flow; the current order button is intentionally a non-ordering placeholder.
- Test mobile and desktop layouts and verify every image path.
- Enable HTTPS and configure the hosting platform's root directory as this repository.

## Local preview
Because the collection pages load JSON with `fetch`, preview with a local static server rather than opening the HTML file directly. GitHub Pages and Vercel static hosting work for these files.
