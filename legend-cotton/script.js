document.addEventListener('DOMContentLoaded', async () => {
  const fallback = {
    name: 'Legend Cotton',
    price: null,
    fabricType: 'Unstitched fabric',
    stitchingIncluded: false,
    length: null,
    colors: []
  };

  let product = fallback;
  try {
    const response = await fetch('content/products.json', { cache: 'no-cache' });
    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.colors)) product = data;
    }
  } catch (error) {
    console.error('Could not load Legend Cotton product data:', error);
  }

  const $ = (selector) => document.querySelector(selector);
  const swatches = $('#swatches');
  const mainImage = $('#mainImage');
  const thumbnails = $('#galleryThumbnails');
  const selectedName = $('#selectedColour');
  const selectedProduct = $('#selectedProduct');
  const counter = $('.image-counter');
  const colors = product.colors || [];
  let activeColorIndex = 0;
  let activeImageIndex = 0;

  const setText = (selector, value) => {
    const node = $(selector);
    if (node) node.textContent = value;
  };

  setText('#productTitle', product.name || 'Legend Cotton');
  setText('#colourCount', `${colors.length} colours`);
  setText('#productPrice', product.price || 'Price to be confirmed');
  setText('#factFabric', product.fabricType || 'Unstitched fabric');
  setText('#factStitching', product.stitchingIncluded ? 'Included' : 'Not included');
  setText('#factLength', product.length || 'To be confirmed');
  setText('#detailFabricType', product.fabricType || 'Unstitched fabric');
  setText('#detailFabricLength', product.length || 'To be confirmed');
  setText('#specFabric', product.fabricType || 'Unstitched fabric');
  setText('#specLength', product.length || 'To be confirmed');
  setText('#specPrice', product.price || 'To be confirmed');

  function imageLabel(index) {
    return ['Front view', 'Back view', 'Fabric display', 'Fabric detail', 'Additional view'][index] || `Photo ${index + 1}`;
  }

  function showImage(color, colorIndex, imageIndex) {
    const imagePaths = color.images || (color.image ? [color.image] : []);
    const path = imagePaths[imageIndex];
    if (!path || !mainImage) return;

    activeColorIndex = colorIndex;
    activeImageIndex = imageIndex;
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
      placeholder.innerHTML = '<span>IMAGE NOT FOUND</span><small>Check the image file in assets/images</small>';
      mainImage.replaceChildren(placeholder);
    }, { once: true });
    mainImage.append(img);

    const badge = document.createElement('span');
    badge.className = 'image-counter';
    badge.textContent = `${String(imageIndex + 1).padStart(2, '0')} / ${String(imagePaths.length).padStart(2, '0')}`;
    mainImage.append(badge);
    if (counter) counter.textContent = badge.textContent;

    if (thumbnails) {
      [...thumbnails.querySelectorAll('button')].forEach((button, index) => {
        button.setAttribute('aria-pressed', String(index === imageIndex));
      });
    }
  }

  function renderThumbnails(color, colorIndex) {
    if (!thumbnails) return;
    thumbnails.replaceChildren();
    (color.images || (color.image ? [color.image] : [])).forEach((path, imageIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-thumb';
      button.setAttribute('aria-label', `${color.name}: ${imageLabel(imageIndex)}`);
      button.setAttribute('aria-pressed', String(imageIndex === 0));

      const img = document.createElement('img');
      img.src = path;
      img.alt = '';
      img.loading = 'lazy';
      img.onerror = () => button.classList.add('thumb-unavailable');

      const caption = document.createElement('span');
      caption.textContent = imageLabel(imageIndex);
      button.append(img, caption);
      button.addEventListener('click', () => showImage(color, colorIndex, imageIndex));
      thumbnails.append(button);
    });
  }

  function selectColor(color, index) {
    activeColorIndex = index;
    activeImageIndex = 0;
    if (selectedName) selectedName.textContent = color.name;
    if (selectedProduct) selectedProduct.textContent = `${color.name} · ${color.images.length} product photos`;
    setText('#specColour', color.name);

    swatches.querySelectorAll('button').forEach((button, buttonIndex) => {
      button.setAttribute('aria-pressed', String(buttonIndex === index));
    });

    renderThumbnails(color, index);
    showImage(color, index, 0);

    const detailMain = $('#detailPhotoMain');
    const detailSecondary = $('#detailPhotoSecondary');
    [detailMain, detailSecondary].forEach((target, i) => {
      if (!target) return;
      const path = color.images[Math.min(i + 2, color.images.length - 1)];
      target.replaceChildren();
      const img = document.createElement('img');
      img.src = path;
      img.alt = `${color.name} ${i === 0 ? 'fabric display' : 'fabric detail'}`;
      img.loading = 'lazy';
      target.append(img);
    });
  }

  if (swatches) {
    swatches.replaceChildren();
    colors.forEach((color, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'swatch';
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', `Select ${color.name}`);

      const circle = document.createElement('span');
      circle.className = 'swatch-colour';
      circle.style.backgroundColor = color.hex || '#ddd';
      circle.setAttribute('aria-hidden', 'true');

      const label = document.createElement('span');
      label.textContent = color.name;
      button.append(circle, label);
      button.addEventListener('click', () => selectColor(color, index));
      swatches.append(button);
    });
  }

  if (colors.length) selectColor(colors[0], 0);

  document.querySelectorAll('.year').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
});
