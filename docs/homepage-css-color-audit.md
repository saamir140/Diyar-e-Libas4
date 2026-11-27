# Diyar-e-Libas homepage CSS and color audit

27 November 2026 · Pakistan storefronts · Chromium at 1440px and 390px

This shortlist comes from the earlier ten-storefront study. SHA LIBAS and Dynasty Fabrics are direct fabric benchmarks. J., Gul Ahmed Ideas and Sapphire are established regional fashion storefronts with useful CSS and merchandising references. Selection is based on category relevance and visual execution. The order is editorial.

The audit used rendered screenshots, scroll samples and computed CSS. Hex values are from sampled elements. Photography and campaign artwork contain additional colors. J. displayed country and consent overlays, and Dynasty displayed a newsletter overlay in the desktop sample.

## Competitor findings

| Storefront | Palette and contrast | Type, spacing and imagery | Takeaway for Diyar-e-Libas |
|---|---|---|---|
| [J.](https://www.junaidjamshed.com/) | Sampled page chrome is white with black copy. The campaign uses saturated garments and a natural backdrop. | The header declares Maison Neue Book at 14px. Full-bleed imagery creates scale and square image edges keep tiles orderly. A sampled desktop locator heading is 48px. | Keep the header visually quiet, and let campaign photography carry the richest color. |
| [Gul Ahmed Ideas](https://www.gulahmedshop.com/) | White background and `#141414` category headings. The sampled campaign uses strong green accents and the catalog photography sits on light surfaces. | Inter at 14px in the header, with 20px desktop category headings. The 1440px campaign is full-width and nearby category tiles use equal 207px squares at that viewport. | Use one accent family and consistent crops. Keep shopping labels compact and legible. |
| [Sapphire](https://pk.sapphireonline.pk/) | White identity and campaign type over darkened photography. The light footer uses `#212529` copy on white. | Full-bleed photography and a centered overlay headline anchor the sampled hero. The computed body stack starts with Montserrat, and footer type reduces from 18px in the desktop sample to 14px on mobile. | Treat the hero as one canvas, and control contrast through the placement and strength of its gradient. |
| [Dynasty Fabrics](https://dynastyfabrics.com/) | Warm stone and earthy fabric tones in the campaign contrast with a neutral white footer and near-black headings. | The transparent header spans 1,325px at a 1,440px viewport and uses 16px utility type. The mobile header uses 15px type. Desktop footer sections use 20px headings, while a sampled mobile footer group uses 14px. | Let garment and location colors set the mood. Use distinct spacing and weight for utility information and editorial imagery. |
| [SHA LIBAS](https://shalibas.com/) | Black and white shopping surfaces sit beside warm field photography. The footer uses warm gray `#bdb6aa` text on `#0a0a0a`. | The Gloock hero heading scales from about 66px desktop to 38px mobile. The desktop hero pairs a clear text column and a wide image. The mobile heading sits within 16px side margins. | Keep a strong serif display face and measured mobile gutters. Repeat a dark tone at the footer to close the page. |

## Final homepage specification

| Role | Applied design |
|---|---|
| Brand frame | **Deep olive `#20261d`** for announcement, hero fallback and footer. It picks up the campaign garment's olive tone. |
| Main surface | **Ivory `#f8f7f2`** supports the header, catalog and FAQ. **Soft sage `#eeeee5`** groups delivery and payment. **`#d3d6ca`** gives hairline dividers a cooler undertone. |
| Text and accent | **`#20241d`** primary text, **`#545c50`** secondary text, **`#343d2c`** collection actions. **Champagne `#e3cfac`** is reserved for hero emphasis, CTA hover and footer headings. |
| Type hierarchy | Playfair Display for the hero, section titles and collection names. DM Sans for navigation, pricing, actions and service copy. Prices use tabular numerals. |
| Layout and alignment | One fluid gutter aligns the header, hero copy, collections, FAQ and footer. The collection row uses equal image crops, simpler card edges and a synchronized price baseline. Desktop navigation is centered. Mobile retains a second navigation row and all three collection cards stay on one line. |
| Interaction | Square primary CTA, underline and visible keyboard outline. The image hover transition is restricted to hover-capable devices with reduced motion disabled. A 44px minimum applies to the mobile hero CTA, header links and footer links. |

Solid color contrast ratios are **14.70:1** for ink on ivory, **6.47:1** for secondary copy on ivory, **5.95:1** for secondary copy on sage, **14.88:1** for ivory hero text on deep olive and **10.16:1** for champagne on deep olive. Hero contrast also depends on the photograph and crop. The gradient keeps the left copy area dark.

The implementation lives in the homepage stylesheet, with the stylesheet version updated in the homepage HTML. Conversion impact requires storefront analytics.
