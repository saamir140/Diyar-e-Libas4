// COLLECTION-ONLY script. Edit this collection's content/products.json and assets only.
document.addEventListener('DOMContentLoaded', async () => {
  const fallback = {
  "name": "Kadhar",
  "price": null,
  "fabricType": "Unstitched fabric",
  "stitchingIncluded": false,
  "length": null,
  "colors": [
    {
      "id": "colour-01",
      "name": "Colour 01",
      "hex": "#e8dfce",
      "image": "assets/images/colour-01.jpg"
    },
    {
      "id": "colour-02",
      "name": "Colour 02",
      "hex": "#292929",
      "image": "assets/images/colour-02.jpg"
    },
    {
      "id": "colour-03",
      "name": "Colour 03",
      "hex": "#26364a",
      "image": "assets/images/colour-03.jpg"
    },
    {
      "id": "colour-04",
      "name": "Colour 04",
      "hex": "#777a68",
      "image": "assets/images/colour-04.jpg"
    },
    {
      "id": "colour-05",
      "name": "Colour 05",
      "hex": "#795d49",
      "image": "assets/images/colour-05.jpg"
    },
    {
      "id": "colour-06",
      "name": "Colour 06",
      "hex": "#f0eee7",
      "image": "assets/images/colour-06.jpg"
    }
  ]
};
  let product = fallback;
  try { const response = await fetch('content/products.json'); if (response.ok) product = await response.json(); } catch (_) {}
  const swatches = document.getElementById('swatches');
  const mainImage = document.getElementById('mainImage');
  const selectedName = document.getElementById('selectedColour');
  const selectedProduct = document.getElementById('selectedProduct');
  const counter = document.querySelector('.image-counter');
  document.getElementById('colourCount').textContent = `${product.colors.length} options`;
  if (product.price) document.getElementById('productPrice').textContent = product.price;
  function selectColor(color, index) {
    selectedName.textContent = color.name;
    selectedProduct.textContent = `Selected option: ${color.name}`;
    const countText = `${String(index+1).padStart(2,'0')} / ${String(product.colors.length).padStart(2,'0')}`;
    mainImage.replaceChildren();
    const img = document.createElement('img'); img.src = color.image; img.alt = `${product.name} — ${color.name}`;
    img.onerror = () => {
      mainImage.replaceChildren();
      const p = document.createElement('div'); p.className='image-placeholder';
      const t=document.createElement('span'); t.textContent=`${product.name.toUpperCase()} / ${color.name.toUpperCase()}`;
      const s=document.createElement('small'); s.textContent='Add the matching image file to this collection’s assets/images folder';
      p.append(t,s); mainImage.append(p);
      const b=document.createElement('span'); b.className='image-counter'; b.textContent=countText; mainImage.append(b);
    };
    mainImage.append(img);
    const badge=document.createElement('span'); badge.className='image-counter'; badge.textContent=countText; mainImage.append(badge);
    [...swatches.querySelectorAll('button')].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  }
  product.colors.forEach((color,index)=>{
    const b=document.createElement('button'); b.type='button'; b.className='swatch'; b.setAttribute('aria-pressed','false'); b.setAttribute('aria-label',`Select ${color.name}`);
    const circle=document.createElement('span'); circle.className='swatch-colour'; circle.style.backgroundColor=color.hex;
    const label=document.createElement('span'); label.textContent=color.name; b.append(circle,label);
    b.addEventListener('click',()=>selectColor(color,index)); swatches.append(b);
  });
  if(product.colors.length) selectColor(product.colors[0],0);
  document.querySelector('.year').textContent=new Date().getFullYear();
  document.getElementById('orderButton').addEventListener('click',()=>alert('Ordering will be enabled after the checkout and order process is configured.'));
});
