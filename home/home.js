document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll('[data-collection-swatches]').forEach(async (swatches) => {
    const collection = swatches.closest('.collection-card');
    const url = new URL('content/products.json', collection.href);

    try {
      const response = await fetch(url);
      if (!response.ok) return;

      const { colors } = await response.json();
      if (!Array.isArray(colors)) return;

      const shades = colors.filter(({ name, hex }) => name && /^#[\da-f]{6}$/i.test(hex));
      if (!shades.length) return;

      const dots = shades.map(({ name, hex }) => {
        const dot = document.createElement('span');
        dot.className = 'collection-swatch';
        dot.style.backgroundColor = hex;
        dot.title = name;
        dot.setAttribute('aria-hidden', 'true');
        return dot;
      });

      swatches.setAttribute('role', 'img');
      swatches.setAttribute('aria-label', `Available shades: ${shades.map(({ name }) => name).join(', ')}`);
      swatches.append(...dots);
      swatches.hidden = false;
    } catch {
      // The product link remains usable when the catalog request fails.
    }
  });
});
