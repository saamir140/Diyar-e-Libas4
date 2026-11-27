document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const collections = Array.from(document.querySelectorAll('.collection-card'), (card) => ({
    url: card.href,
    name: card.querySelector('h3').textContent,
    swatches: card.querySelector('[data-collection-swatches]'),
    keywords: card.querySelector('p').textContent,
    shades: [],
  }));

  const dialog = document.querySelector('#fabric-search');
  const trigger = document.querySelector('.search-toggle');
  const input = dialog.querySelector('input');
  const status = dialog.querySelector('.search-status');
  const results = dialog.querySelector('.search-results');

  const tokenize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter((word) => word && word !== 'and');
  const matches = (terms, value) => {
    const words = tokenize(value);
    return terms.every((term) => words.some((word) => word.startsWith(term)));
  };

  function renderSearch() {
    const terms = tokenize(input.value);
    const items = [];

    for (const { url, name, keywords, shades } of collections) {
      const collectionText = `${name} ${keywords}`;
      const collectionMatches = matches(terms, collectionText);
      const shadeTerms = terms.filter((term) => !matches([term], collectionText));
      const matchedShades = shadeTerms.length
        ? shades.filter((shade) => matches(shadeTerms, shade.name))
        : [];
      if (!collectionMatches && !matchedShades.length) continue;

      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = url;
      link.textContent = name;

      if (matchedShades.length) {
        const shadesText = document.createElement('span');
        shadesText.textContent = matchedShades.map((shade) => shade.name).join(', ');
        link.append(shadesText);
      }

      item.append(link);
      items.push(item);
    }

    results.replaceChildren(...items);
    status.textContent = items.length
      ? `${items.length} ${items.length === 1 ? 'collection' : 'collections'}`
      : 'No matches. Try another fabric or shade.';
  }

  if (typeof dialog.showModal === 'function') {
    trigger.hidden = false;
    trigger.addEventListener('click', () => {
      input.value = '';
      renderSearch();
      dialog.showModal();
    });
    input.addEventListener('input', renderSearch);
    dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      dialog.close();
    });
  }

  collections.forEach(async (collection) => {
    const { url, swatches } = collection;
    try {
      const response = await fetch(new URL('content/products.json', url));
      if (!response.ok) return;

      const { colors, name, fabricType } = await response.json();
      collection.keywords += ` ${name || ''} ${fabricType || ''}`;
      if (!Array.isArray(colors)) return;

      collection.shades = colors.filter(({ name, hex }) => name && /^#[\da-f]{6}$/i.test(hex));
      if (!collection.shades.length) return;

      const dots = collection.shades.map(({ name, hex }) => {
        const dot = document.createElement('span');
        dot.className = 'collection-swatch';
        dot.style.backgroundColor = hex;
        dot.title = name;
        dot.setAttribute('aria-hidden', 'true');
        return dot;
      });

      swatches.setAttribute('role', 'img');
      swatches.setAttribute('aria-label', `Available shades: ${collection.shades.map(({ name }) => name).join(', ')}`);
      swatches.append(...dots);
      swatches.hidden = false;
      if (dialog.open && input.value) renderSearch();
    } catch {
      // Collection links and name search remain available if a catalog request fails.
    }
  });
});
