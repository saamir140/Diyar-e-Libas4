
/* =========================================================
   DIYAR-E-LIBAS — LEGEND COTTON
   Product gallery, colour selection, product details and CTA
   ========================================================= */

document.addEventListener('DOMContentLoaded', async () => {
  const fallback = {
    name: 'Legend Cotton',
    price: null,
    fabricType: 'Unstitched fabric',
    stitchingIncluded: false,
    length: null,
    colors: [
      { id: 'colour-01', name: 'Colour 01', hex: '#e8dfce', image: 'assets/images/colour-01.jpg' },
      { id: 'colour-02', name: 'Colour 02', hex: '#292929', image: 'assets/images/colour-02.jpg' },
      { id: 'colour-03', name: 'Colour 03', hex: '#26364a', image: 'assets/images/colour-03.jpg' },
      { id: 'colour-04', name: 'Colour 04', hex: '#777a68', image: 'assets/images/colour-04.jpg' },
      { id: 'colour-05', name: 'Colour 05', hex: '#795d49', image: 'assets/images/colour-05.jpg' },
      { id: 'colour-06', name: 'Colour 06', hex: '#f0eee7', image: 'assets/images/colour-06.jpg' }
    ]
  };

  let product = fallback;

  /* Load product data */
  try {
    const response = await fetch('content/products.json', {
      cache: 'no-cache'
    });

    if (response.ok) {
      const data = await response.json();

      if (data && Array.isArray(data.colors) && data.colors.length) {
        product = data;
      }
    }
  } catch (error) {
    console.warn(
      'Product JSON could not be loaded. Using fallback data.',
      error
    );
  }

  const $ = (selector) => document.querySelector(selector);

  const swatches = $('#swatches');
  const mainImage = $('#mainImage');
  const selectedName = $('#selectedColour');
  const selectedProduct = $('#selectedProduct');
  const priceElement = $('#productPrice');
  const counter = $('.image-counter');

  const priceText = product.price
    ? String(product.price)
    : 'Price to be confirmed';

  const lengthText = product.length
    ? String(product.length)
    : 'To be confirmed';

  const fabricText = product.fabricType || 'Unstitched fabric';

  const stitchingText = product.stitchingIncluded
    ? 'Included'
    : 'Not included';

  /* Safely update elements that exist on the page */
  function setText(selector, value) {
    const element = $(selector);

    if (element) {
      element.textContent = value;
    }
  }

  setText('#productTitle', product.name || 'Legend Cotton');
  setText('#colourCount', `${product.colors.length} colour options`);
  setText('#productPrice', priceText);

  setText('#factFabric', fabricText);
  setText('#factStitching', stitchingText);
  setText('#factLength', lengthText);

  setText('#detailFabricType', fabricText);
  setText('#detailFabricLength', lengthText);

  setText('#specFabric', fabricText);
  setText('#specLength', lengthText);
  setText('#specPrice', priceText);

  /* Create a safe image placeholder */
  function createPlaceholder(title, note) {
    const wrapper = document.createElement('div');
    wrapper.className = 'image-placeholder';

    const heading = document.createElement('span');
    heading.textContent = title;

    const description = document.createElement('small');
    description.textContent = note;

    wrapper.append(heading, description);

    return wrapper;
  }

  /* Update the image counter */
  function setCounter(value) {
    if (counter) {
      counter.textContent = value;
    }
  }

  /* Render the selected colour's product image */
  function renderMainImage(color, index) {
    if (!mainImage) return;

    mainImage.replaceChildren();

    const img = document.createElement('img');

    img.src = color.image || '';
    img.alt = `${product.name || 'Legend Cotton'} — ${color.name}`;
    img.loading = 'eager';
    img.decoding = 'async';

    img.addEventListener('error', () => {
      if (!img.isConnected) return;

      mainImage.replaceChildren();

      mainImage.append(
        createPlaceholder(
          `${(product.name || 'LEGEND COTTON').toUpperCase()} / ${(
            color.name || ''
          ).toUpperCase()}`,
          'Add the real product image to legend-cotton/assets/images/'
        )
      );

      const badge = document.createElement('span');
      badge.className = 'image-counter';
      badge.textContent =
        `${String(index + 1).padStart(2, '0')} / ` +
        `${String(product.colors.length).padStart(2, '0')}`;

      mainImage.append(badge);
    }, { once: true });

    mainImage.append(img);

    setCounter(
      `${String(index + 1).padStart(2, '0')} / ` +
      `${String(product.colors.length).padStart(2, '0')}`
    );
  }

  /* Detail photography placeholders.
     Replace with real detail images when supplied by the client. */
  function updateDetailPhoto(target, color, label) {
    if (!target) return;

    target.replaceChildren(
      createPlaceholder(
        label,
        `Real ${color.name} detail photography to be added`
      )
    );
  }

  /* Handle colour selection */
  function selectColor(color, index) {
    if (selectedName) {
      selectedName.textContent = color.name;
    }

    if (selectedProduct) {
      selectedProduct.textContent = `Selected option: ${color.name}`;
    }

    setText('#specColour', color.name);

    renderMainImage(color, index);

    updateDetailPhoto(
      $('#detailPhotoMain'),
      color,
      'FABRIC DETAIL'
    );

    updateDetailPhoto(
      $('#detailPhotoSecondary'),
      color,
      'TEXTURE & FINISH'
    );

    /* Update selected swatch state */
    if (swatches) {
      const buttons = swatches.querySelectorAll('button');

      buttons.forEach((button, buttonIndex) => {
        const selected = buttonIndex === index;

        button.setAttribute('aria-pressed', String(selected));

        if (selected) {
          button.setAttribute('aria-current', 'true');
        } else {
          button.removeAttribute('aria-current');
        }
      });
    }
  }

  /* Build colour swatches */
  if (swatches) {
    swatches.replaceChildren();

    product.colors.forEach((color, index) => {
      const button = document.createElement('button');

      button.type = 'button';
      button.className = 'swatch';
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', `Select ${color.name}`);

      const circle = document.createElement('span');

      circle.className = 'swatch-colour';
      circle.style.backgroundColor = color.hex || '#e8dfce';
      circle.setAttribute('aria-hidden', 'true');

      const label = document.createElement('span');
      label.textContent = color.name;

      button.append(circle, label);

      button.addEventListener('click', () => {
        selectColor(color, index);
      });

      swatches.append(button);
    });
  }

  /* Select the first colour by default */
  if (product.colors.length) {
    selectColor(product.colors[0], 0);
  }

  /* Automatically update copyright year */
  document.querySelectorAll('.year').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  /* CTA points to the ordering information section.
     This does not submit an order or imply checkout is configured. */
  const orderButton = $('#orderButton');

  if (orderButton && orderButton.tagName === 'A') {
    orderButton.href = '#ordering-info';
  } else if (orderButton && orderButton.tagName === 'BUTTON') {
    orderButton.addEventListener('click', () => {
      const orderingInfo = $('#ordering-info');

      if (orderingInfo) {
        orderingInfo.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        alert('Ordering details will be available once the order process is configured.');
      }
    });
  }
});
