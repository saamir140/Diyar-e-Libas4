
document.addEventListener('DOMContentLoaded', async () => {
  const fallback = {
    name: 'Legend Winter Cotton',
    price: 'Rs. 3,500',
    fabricType: 'Cotton Khaddar Blend',
    stitchingIncluded: false,
    length: '4 Metres',
    colors: []
  };

  let product = fallback;

  try {
    const response = await fetch('content/products.json', {
      cache: 'no-cache'
    });

    if (response.ok) {
      const data = await response.json();

      if (data && Array.isArray(data.colors)) {
        product = data;
      }
    }
  } catch (error) {
    console.error(
      'Could not load Legend Winter Cotton product data:',
      error
    );
  }

  const $ = (selector) => document.querySelector(selector);

  const swatches = $('#swatches');
  const mainImage = $('#mainImage');
  const thumbnails = $('#galleryThumbnails');
  const selectedName = $('#selectedColour');
  const selectedProduct = $('#selectedProduct');

  const colors = product.colors || [];

  const setText = (selector, value) => {
    const node = $(selector);

    if (node) {
      node.textContent = value;
    }
  };

  setText('#productTitle', product.name || 'Legend Winter Cotton');
  setText('#colourCount', `${colors.length} colours`);
  setText('#productPrice', product.price || 'Price to be confirmed');

  setText(
    '#factFabric',
    product.fabricType || 'Cotton Khaddar Blend'
  );

  setText(
    '#factStitching',
    product.stitchingIncluded ? 'Included' : 'Not included'
  );

  setText('#factLength', product.length || 'To be confirmed');

  setText(
    '#detailFabricType',
    product.fabricType || 'Cotton Khaddar Blend'
  );

  setText(
    '#detailFabricLength',
    product.length || 'To be confirmed'
  );

  setText(
    '#specFabric',
    product.fabricType || 'Cotton Khaddar Blend'
  );

  setText('#specLength', product.length || 'To be confirmed');
  setText('#specPrice', product.price || 'To be confirmed');

  function imageLabel(index) {
    return [
      'Front view',
      'Back view',
      'Fabric display',
      'Fabric detail',
      'Additional view'
    ][index] || `Photo ${index + 1}`;
  }

  function getImages(color) {
    return Array.isArray(color.images)
      ? color.images
      : (color.image ? [color.image] : []);
  }

  function showImage(color, colorIndex, imageIndex) {
    const imagePaths = getImages(color);
    const path = imagePaths[imageIndex];

    if (!path || !mainImage) return;

    mainImage.replaceChildren();

    const img = document.createElement('img');

    img.src = path;
    img.alt = `${product.name} – ${color.name} – ${imageLabel(imageIndex)}`;
    img.loading = imageIndex === 0 ? 'eager' : 'lazy';
    img.decoding = 'async';

    img.addEventListener('error', () => {
      if (!img.isConnected) return;

      const placeholder = document.createElement('div');
      placeholder.className = 'image-placeholder';

      const title = document.createElement('span');
      title.textContent = 'IMAGE NOT FOUND';

      const note = document.createElement('small');
      note.textContent =
        'Check this image filename in legend-cotton/assets/images';

      placeholder.append(title, note);
      mainImage.replaceChildren(placeholder);
    }, { once: true });

    mainImage.append(img);

    const badge = document.createElement('span');

    badge.className = 'image-counter';

    badge.textContent =
      `${String(imageIndex + 1).padStart(2, '0')} / ${String(imagePaths.length).padStart(2, '0')}`;

    mainImage.append(badge);

    if (thumbnails) {
      [...thumbnails.querySelectorAll('button')].forEach(
        (button, index) => {
          button.setAttribute(
            'aria-pressed',
            String(index === imageIndex)
          );
        }
      );
    }
  }

  function renderThumbnails(color, colorIndex) {
    if (!thumbnails) return;

    thumbnails.replaceChildren();

    getImages(color).forEach((path, imageIndex) => {
      const button = document.createElement('button');

      button.type = 'button';
      button.className = 'gallery-thumb';

      button.setAttribute(
        'aria-label',
        `${color.name}: ${imageLabel(imageIndex)}`
      );

      button.setAttribute(
        'aria-pressed',
        String(imageIndex === 0)
      );

      const img = document.createElement('img');

      img.src = path;
      img.alt = '';
      img.loading = 'lazy';

      img.onerror = () => {
        button.classList.add('thumb-unavailable');
      };

      const caption = document.createElement('span');

      caption.textContent = imageLabel(imageIndex);

      button.append(img, caption);

      button.addEventListener('click', () => {
        showImage(color, colorIndex, imageIndex);
      });

      thumbnails.append(button);
    });
  }

  function updateDetailPhoto(target, path, alt) {
    if (!target || !path) return;

    target.replaceChildren();

    const img = document.createElement('img');

    img.src = path;
    img.alt = alt;
    img.loading = 'lazy';

    img.onerror = () => {
      target.replaceChildren();
    };

    target.append(img);
  }

  function selectColor(color, index) {
    const images = getImages(color);

    if (!images.length) return;

    if (selectedName) {
      selectedName.textContent = color.name;
    }

    if (selectedProduct) {
      selectedProduct.textContent =
        `${color.name} · ${images.length} product photos`;
    }

    setText('#specColour', color.name);

    if (swatches) {
      swatches.querySelectorAll('button').forEach(
        (button, buttonIndex) => {
          button.setAttribute(
            'aria-pressed',
            String(buttonIndex === index)
          );
        }
      );
    }

    renderThumbnails(color, index);

    showImage(color, index, 0);

    updateDetailPhoto(
      $('#detailPhotoMain'),
      images[2] || images[0],
      `${color.name} fabric display`
    );

    updateDetailPhoto(
      $('#detailPhotoSecondary'),
      images[3] || images[2] || images[0],
      `${color.name} fabric detail`
    );
  }

  if (swatches) {
    swatches.replaceChildren();

    colors.forEach((color, index) => {
      const button = document.createElement('button');

      button.type = 'button';
      button.className = 'swatch';

      button.setAttribute('aria-pressed', 'false');

      button.setAttribute(
        'aria-label',
        `Select ${color.name}`
      );

      const circle = document.createElement('span');

      circle.className = 'swatch-colour';
      circle.style.backgroundColor = color.hex || '#ddd';
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

  if (colors.length) {
    selectColor(colors[0], 0);
  }

  document.querySelectorAll('.year').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
});
