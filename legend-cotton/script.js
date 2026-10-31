document.addEventListener('DOMContentLoaded', async () => {
  const fallback = { name:'Legend Winter Cotton', price:'Rs. 3,499', priceValue:3499, fabricType:'Cotton Khaddar Blend', stitchingIncluded:false, length:'4 Metres', colors:[] };
  let product = fallback;
  try { const response = await fetch('content/products.json', { cache:'no-cache' }); if (response.ok) { const data = await response.json(); if (data && Array.isArray(data.colors)) product = data; } }
  catch (error) { console.error('Could not load Legend Cotton product data:', error); }

  const $ = (selector) => document.querySelector(selector);
  const swatches=$('#swatches'), mainImage=$('#mainImage'), thumbnails=$('#galleryThumbnails'), selectedName=$('#selectedColour'), selectedProduct=$('#selectedProduct'), counter=$('.image-counter');
  const colors=product.colors||[]; let activeColorIndex=0, activeImageIndex=0;
  const PRICE=Number(product.priceValue)||3499, DELIVERY=200, STORAGE_KEY='diyarLegendCottonCartV1';
  const setText=(selector,value)=>{const node=$(selector);if(node)node.textContent=value;};
  const money=(amount)=>`Rs. ${Number(amount).toLocaleString('en-PK')}`;
  setText('#productTitle',product.name||'Legend Winter Cotton'); setText('#colourCount',`${colors.length} colours`); setText('#productPrice',money(PRICE));
  setText('#factFabric',product.fabricType||'Unstitched fabric'); setText('#factStitching',product.stitchingIncluded?'Included':'Not included'); setText('#factLength',product.length||'To be confirmed');
  setText('#detailFabricType',product.fabricType||'Unstitched fabric'); setText('#detailFabricLength',product.length||'To be confirmed'); setText('#specFabric',product.fabricType||'Unstitched fabric'); setText('#specLength',product.length||'To be confirmed'); setText('#specPrice',money(PRICE));
  document.querySelectorAll('.year').forEach(node=>node.textContent=String(new Date().getFullYear()));

  function imageLabel(index){return ['Front view','Back view','Fabric display','Fabric detail','Additional view'][index]||`Photo ${index+1}`;}
  function showImage(color,colorIndex,imageIndex){const paths=color.images||(color.image?[color.image]:[]),path=paths[imageIndex];if(!path||!mainImage)return;activeColorIndex=colorIndex;activeImageIndex=imageIndex;mainImage.replaceChildren();const img=document.createElement('img');img.src=path;img.alt=`${product.name} – ${color.name} – ${imageLabel(imageIndex)}`;img.loading=imageIndex===0?'eager':'lazy';img.decoding='async';img.addEventListener('error',()=>{if(!img.isConnected)return;const p=document.createElement('div');p.className='image-placeholder';p.innerHTML='<span>IMAGE NOT FOUND</span><small>Check the image file in assets/images</small>';mainImage.replaceChildren(p);},{once:true});mainImage.append(img);const badge=document.createElement('span');badge.className='image-counter';badge.textContent=`${String(imageIndex+1).padStart(2,'0')} / ${String(paths.length).padStart(2,'0')}`;mainImage.append(badge);if(counter)counter.textContent=badge.textContent;if(thumbnails)[...thumbnails.querySelectorAll('button')].forEach((b,i)=>b.setAttribute('aria-pressed',String(i===imageIndex)));}
  function renderThumbnails(color,colorIndex){if(!thumbnails)return;thumbnails.replaceChildren();(color.images||(color.image?[color.image]:[])).forEach((path,imageIndex)=>{const b=document.createElement('button');b.type='button';b.className='gallery-thumb';b.setAttribute('aria-label',`${color.name}: ${imageLabel(imageIndex)}`);b.setAttribute('aria-pressed',String(imageIndex===0));const img=document.createElement('img');img.src=path;img.alt='';img.loading='lazy';img.onerror=()=>b.classList.add('thumb-unavailable');const caption=document.createElement('span');caption.textContent=imageLabel(imageIndex);b.append(img,caption);b.addEventListener('click',()=>showImage(color,colorIndex,imageIndex));thumbnails.append(b);});}
  function selectColor(color,index){activeColorIndex=index;activeImageIndex=0;if(selectedName)selectedName.textContent=color.name;if(selectedProduct)selectedProduct.textContent=`${color.name} · ${(color.images||(color.image?[color.image]:[])).length} product photos`;setText('#specColour',color.name);if(swatches)swatches.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));renderThumbnails(color,index);showImage(color,index,0);
    const images=color.images||(color.image?[color.image]:[]);[ $('#detailPhotoMain'),$('#detailPhotoSecondary') ].forEach((target,i)=>{if(!target)return;const path=images[Math.min(i+2,images.length-1)];if(!path)return;target.replaceChildren();const img=document.createElement('img');img.src=path;img.alt=`${color.name} ${i===0?'fabric display':'fabric detail'}`;img.loading='lazy';img.onerror=()=>target.classList.add('photo-unavailable');target.append(img);});
    const front=$('#stylePhotoFront'),back=$('#stylePhotoBack');if(front&&images[0]){front.style.backgroundImage=`url("${images[0]}")`;front.setAttribute('aria-label',`${color.name} front view`);}if(back&&images[1]){back.style.backgroundImage=`url("${images[1]}")`;back.setAttribute('aria-label',`${color.name} back view`);}}
  if(swatches){swatches.replaceChildren();colors.forEach((color,index)=>{const b=document.createElement('button');b.type='button';b.className='swatch';b.setAttribute('aria-pressed','false');b.setAttribute('aria-label',`Select ${color.name}`);const circle=document.createElement('span');circle.className='swatch-colour';circle.style.backgroundColor=color.hex||'#ddd';circle.setAttribute('aria-hidden','true');const label=document.createElement('span');label.textContent=color.name;b.append(circle,label);b.addEventListener('click',()=>selectColor(color,index));swatches.append(b);});}
  if(colors.length)selectColor(colors[0],0);

  // Cart is keyed by colour id so each colour keeps its own quantity in one order.
  let cart=[];try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');if(Array.isArray(saved))cart=saved.filter(x=>colors.some(c=>c.id===x.colorId)&&Number.isInteger(x.quantity)&&x.quantity>0);}catch(_){cart=[];}
  const totalQty=()=>cart.reduce((sum,item)=>sum+item.quantity,0);const subtotal=()=>totalQty()*PRICE;const delivery=()=>totalQty()>=2?0:DELIVERY;const grand=()=>subtotal()+delivery();
  function saveCart(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(cart));}catch(_){}}
  function renderCart() {
    const count = totalQty();
    setText('#cartCount', count);
    setText('#mobileCartCount', count);
    setText('#cartTotalQuantity', count);
    setText('#cartSubtotal', money(subtotal()));
    setText('#cartDelivery', delivery() === 0 ? 'FREE' : money(DELIVERY));
    setText('#cartGrandTotal', money(grand()));
    setText('#checkoutGrandTotal', money(grand()));

    const hint = $('#freeDeliveryHint');
    if (hint) hint.textContent = count >= 2 ? 'You qualify for free delivery.' : count === 1 ? 'Add 1 more suit to get free delivery.' : 'Add 2 suits to get free delivery.';

    const list = $('#cartItems');
    if (list) {
      list.replaceChildren();
      if (!cart.length) {
        const empty = document.createElement('p');
        empty.className = 'cart-empty';
        empty.textContent = 'Your cart is empty. Choose a colour to get started.';
        list.append(empty);
      }
      cart.forEach((item) => {
        const color = colors.find((c) => c.id === item.colorId);
        if (!color) return;
        const row = document.createElement('article');
        row.className = 'cart-item';
        const img = document.createElement('img');
        img.src = (color.images || [])[0] || '';
        img.alt = color.name;
        const info = document.createElement('div');
        const title = document.createElement('p');
        title.className = 'cart-item-title';
        title.textContent = product.name;
        const meta = document.createElement('p');
        meta.className = 'cart-item-meta';
        meta.textContent = color.name;
        const controls = document.createElement('div');
        controls.className = 'cart-qty-controls';
        const minus = document.createElement('button');
        minus.type = 'button'; minus.textContent = '−';
        minus.setAttribute('aria-label', `Decrease ${color.name} quantity`);
        minus.addEventListener('click', () => changeQty(item.colorId, -1));
        const qty = document.createElement('span'); qty.textContent = item.quantity;
        const plus = document.createElement('button');
        plus.type = 'button'; plus.textContent = '+';
        plus.setAttribute('aria-label', `Increase ${color.name} quantity`);
        plus.addEventListener('click', () => changeQty(item.colorId, 1));
        controls.append(minus, qty, plus);
        info.append(title, meta, controls);
        const price = document.createElement('div');
        price.className = 'cart-item-price';
        price.textContent = money(item.quantity * PRICE);
        const remove = document.createElement('button');
        remove.type = 'button'; remove.className = 'cart-remove'; remove.textContent = 'Remove';
        remove.addEventListener('click', () => {
          cart = cart.filter((x) => x.colorId !== item.colorId);
          saveCart(); renderCart();
        });
        price.append(remove);
        row.append(img, info, price);
        list.append(row);
      });
    }
    const checkout = $('#checkoutButton');
    if (checkout) checkout.disabled = count === 0;
  }
  function changeQty(colorId,delta){const item=cart.find(x=>x.colorId===colorId);if(!item)return;item.quantity+=delta;if(item.quantity<=0)cart=cart.filter(x=>x.colorId!==colorId);saveCart();renderCart();}
  function addSelected(){const color=colors[activeColorIndex];if(!color){alert('Please select a colour first.');return;}const item=cart.find(x=>x.colorId===color.id);if(item)item.quantity+=1;else cart.push({colorId:color.id,quantity:1});saveCart();renderCart();openCart();}
  const drawer=$('#cartDrawer'),cartBackdrop=$('#cartBackdrop');function openCart(){if(!drawer)return;drawer.classList.add('is-open');drawer.setAttribute('aria-hidden','false');if(cartBackdrop)cartBackdrop.hidden=false;document.body.classList.add('cart-open');}function closeCart(){if(!drawer)return;drawer.classList.remove('is-open');drawer.setAttribute('aria-hidden','true');if(cartBackdrop)cartBackdrop.hidden=true;document.body.classList.remove('cart-open');}
  const modal=$('#checkoutModal');function openCheckout(){if(!cart.length)return;closeCart();const preview=$('#checkoutOrderPreview');if(preview){preview.textContent=cart.map(item=>{const c=colors.find(x=>x.id===item.colorId);return `${c?.name||item.colorId} × ${item.quantity}`;}).join('  ·  ')+` | ${money(subtotal())} subtotal | Delivery: ${delivery()===0?'FREE':money(DELIVERY)}`;}if(modal){modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');}}
  function closeCheckout(){if(modal){modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');}}
  $('#addToCartButton')?.addEventListener('click',addSelected);$('#openCartButton')?.addEventListener('click',openCart);$('#mobileCartButton')?.addEventListener('click',openCart);$('#closeCartButton')?.addEventListener('click',closeCart);cartBackdrop?.addEventListener('click',closeCart);$('#checkoutButton')?.addEventListener('click',openCheckout);$('#closeCheckoutButton')?.addEventListener('click',closeCheckout);$('#checkoutBackdrop')?.addEventListener('click',closeCheckout);
  $('#checkoutForm')?.addEventListener('submit',(event)=>{event.preventDefault();const form=event.currentTarget;const message=$('#checkoutMessage');if(!cart.length)return;const data=new FormData(form);const order={customer:{fullName:String(data.get('fullName')||'').trim(),phone:String(data.get('phone')||'').trim(),city:String(data.get('city')||'').trim(),address:String(data.get('address')||'').trim()},items:cart.map(item=>{const c=colors.find(x=>x.id===item.colorId);return {product:product.name,colour:c?.name||item.colorId,colourId:item.colorId,quantity:item.quantity,unitPrice:PRICE,lineTotal:item.quantity*PRICE};}),totalQuantity:totalQty(),subtotal:subtotal(),delivery:delivery(),grandTotal:grand(),currency:'PKR'};
    // Google Sheets endpoint is intentionally not guessed. Connect the deployed Apps Script URL here.
    const endpoint=window.DIYAR_ORDERS_ENDPOINT||'';
    if(!endpoint){if(message)message.textContent='Checkout details are ready, but the Google Sheets connection is not configured yet. Your cart has been kept; no order has been submitted.';return;}
    const button=$('#placeOrderButton');if(button){button.disabled=true;button.textContent='Submitting…';}
    fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(order)})
      .then(r=>r.json()).then(result=>{if(!result||result.success!==true)throw new Error(result?.message||'Order could not be confirmed.');if(message)message.textContent=`Order received. Your order ID is ${result.orderId}.`;cart=[];saveCart();renderCart();form.reset();})
      .catch(error=>{if(message)message.textContent=`Order was not confirmed: ${error.message}. Please try again.`;})
      .finally(()=>{if(button){button.disabled=false;button.innerHTML='Place order <span>→</span>';}});
  });
  renderCart();
});
