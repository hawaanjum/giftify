import './style.css';

const products = [
  {id:'magazine', name:'The Person Magazine', category:'Person Magazine', price:1499, oldPrice:1699, badge:'Bestseller', desc:'Their story, beautifully told.', image:'/images/magazine.jpg', tag:'Made just for them'},
  {id:'bouquet', name:'Forever Rose Bouquet', category:'Forever Blooms', price:1299, desc:'A little bouquet that lasts.', image:'/images/bouquet.jpg', tag:'Handmade with love'},
  {id:'keychain', name:'Personalised Clay Charm', category:'Little Keepsakes', price:499, desc:'Tiny keepsake, big feelings.', image:'/images/keychain.jpg', tag:'Customisable'},
  {id:'hamper', name:'The Thoughtful Box', category:'Gift Hampers', price:1299, desc:'A box full of their favourites.', image:'/images/hamper.jpg', tag:'Curated for you'},
  {id:'polaroids', name:'Polaroid Photo Set', category:'Moments in Print', price:599, desc:'Your favourite moments, printed.', image:'/images/polaroids.jpg', tag:'From ₹599'},
  {id:'crochet', name:'Crochet Shoulder Bag', category:'Made With Love', price:1199, desc:'Handmade, one stitch at a time.', image:'/images/crochet.jpg', tag:'Small-batch handmade'}
];

const categories = [
  {name:'Person Magazine', subtitle:'Stories, pictures, memories', icon:'✦', image:products[0].image},
  {name:'Forever Blooms', subtitle:'Bouquets for every mood', icon:'❀', image:products[1].image},
  {name:'Little Keepsakes', subtitle:'Clay charms & more', icon:'♡', image:products[2].image},
  {name:'Gift Hampers', subtitle:'A box of thoughtful things', icon:'🎁', image:products[3].image},
  {name:'Moments in Print', subtitle:'Polaroids, photo sets & more', icon:'▧', image:products[4].image},
  {name:'Made With Love', subtitle:'Crochet bags & sweaters', icon:'⌁', image:products[5].image}
];

const occasions = [
  {name:'Birthdays', icon:'🎂', hint:'Make their day feel extra special'},
  {name:'Anniversaries', icon:'♡', hint:'For your favourite love story'},
  {name:'Friendship', icon:'✿', hint:'For the ones who just get you'},
  {name:'Long Distance', icon:'✈', hint:'A little closer, even from far away'},
  {name:'Just Because', icon:'☼', hint:'No reason needed to show you care'},
  {name:'Festive Gifting', icon:'✧', hint:'Thoughtful gifts for every celebration'}
];

let cart = JSON.parse(localStorage.getItem('giftify-cart') || '[]');
let activeCategory = 'All';
let searchTerm = '';
let favorites = new Set(JSON.parse(localStorage.getItem('giftify-favs') || '[]'));

const money = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const icon = (name, size=20) => {
  const paths = {
    search:'<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
    heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"></path>',
    bag:'<path d="M5 8h14l1 13H4L5 8Z"></path><path d="M9 8V6a3 3 0 0 1 6 0v2"></path>',
    user:'<circle cx="12" cy="8" r="4"></circle><path d="M5 21v-2a7 7 0 0 1 14 0v2"></path>',
    arrow:'<path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path>',
    close:'<path d="m18 6-12 12M6 6l12 12"></path>',
    plus:'<path d="M12 5v14M5 12h14"></path>',
    minus:'<path d="M5 12h14"></path>',
    trash:'<path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6m4 4v7m6-7v7"></path>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||''}</svg>`;
};

function productCard(p) {
  return `<article class="product-card">
    <div class="product-photo">
      <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='/images/hamper.jpg'">
      ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      <button class="heart-btn ${favorites.has(p.id)?'is-fav':''}" data-fav="${p.id}" aria-label="${favorites.has(p.id)?'Remove from':'Add to'} favourites">${icon('heart',18)}</button>
      <button class="quick-add" data-add="${p.id}">Add to bag <span>＋</span></button>
    </div>
    <div class="product-info">
      <div class="product-meta">${p.category}</div>
      <h3>${p.name}</h3>
      <p class="product-desc">${p.desc}</p>
      <div class="price-row"><strong>${money(p.price)}</strong>${p.oldPrice?`<del>${money(p.oldPrice)}</del>`:''}</div>
    </div>
  </article>`;
}

function renderProducts() {
  const filtered = products.filter(p => (activeCategory==='All' || p.category===activeCategory) &&
    `${p.name} ${p.category} ${p.desc}`.toLowerCase().includes(searchTerm.toLowerCase()));
  document.querySelector('#product-grid').innerHTML = filtered.length ? filtered.map(productCard).join('') :
    `<div class="empty-state"><span>♡</span><h3>No gifts found just yet</h3><p>Try another search or browse all our thoughtful finds.</p><button class="btn btn-dark" data-reset>View all gifts</button></div>`;
  document.querySelector('#results-count').textContent = `${filtered.length} thoughtful ${filtered.length===1?'find':'finds'}`;
}

function renderCart() {
  const count = cart.reduce((n,item)=>n+item.qty,0);
  document.querySelectorAll('.cart-count').forEach(el=>{el.textContent=count;el.classList.toggle('hidden',count===0)});
  document.querySelector('#cart-items').innerHTML = cart.length ? cart.map(item=>{
    const p=products.find(p=>p.id===item.id);
    return `<div class="cart-item">
      <img src="${p.image}" alt="">
      <div class="cart-item-main"><h4>${p.name}</h4><strong>${money(p.price)}</strong>
        <div class="qty-control"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div>
      </div><button class="remove-item" data-remove="${p.id}" aria-label="Remove ${p.name}">${icon('trash',17)}</button>
    </div>`;
  }).join('') : `<div class="cart-empty"><span>♡</span><h3>Your bag is waiting</h3><p>Find something that says “I thought of you.”</p><button class="btn btn-dark" data-close-cart>Explore gifts</button></div>`;
  const total=cart.reduce((n,item)=>n+products.find(p=>p.id===item.id).price*item.qty,0);
  document.querySelector('#cart-subtotal').textContent=money(total);
  document.querySelector('#checkout-btn').disabled=!cart.length;
  localStorage.setItem('giftify-cart',JSON.stringify(cart));
}

function toast(message) {
  const t=document.querySelector('#toast'); t.textContent=message; t.classList.add('show');
  clearTimeout(window.giftifyToast); window.giftifyToast=setTimeout(()=>t.classList.remove('show'),2400);
}

function openCart() { document.querySelector('#cart-drawer').classList.add('open'); document.querySelector('#overlay').classList.add('visible'); document.body.classList.add('no-scroll'); }
function closePanels() { document.querySelector('#cart-drawer').classList.remove('open'); document.querySelector('#custom-modal').classList.remove('open'); document.querySelector('#overlay').classList.remove('visible'); document.body.classList.remove('no-scroll'); }

document.querySelector('#app').innerHTML = `
  <div class="announcement"><span>Thoughtful gifts, made personal</span><span class="announcement-dot">✦</span><span>Made with love in India</span></div>
  <header class="site-header">
    <button class="mobile-menu" id="mobile-menu" aria-label="Open menu">☰</button>
    <a class="brand" href="#" aria-label="Giftify home">giftify<span>♥</span><small>little things, lasting feelings</small></a>
    <nav class="main-nav" id="main-nav"><a class="active" href="#home">Home</a><a href="#shop">Shop all</a><a href="#customise">Custom gifts</a><a href="#occasions">Occasions</a><a href="#story">Our story</a></nav>
    <div class="header-actions">
      <form class="search-form" id="search-form"><input id="search-input" type="search" placeholder="Find a thoughtful gift…" aria-label="Search gifts">${icon('search',19)}</form>
      <button class="icon-btn desktop-only" id="favs-button" aria-label="Show favourites">${icon('heart')}</button>
      <button class="icon-btn cart-trigger" id="cart-trigger" aria-label="Open shopping bag">${icon('bag')}<span class="cart-count hidden">0</span></button>
    </div>
  </header>

  <main>
    <section class="hero" id="home">
      <div class="hero-copy">
        <div class="eyebrow"><span class="eyebrow-line"></span> A LITTLE SOMETHING, JUST FOR THEM</div>
        <h1>Not just gifts.<br><em>Little pieces</em> of<br>your story.</h1>
        <p>For the people who make ordinary days feel extraordinary. Thoughtfully made, beautifully personal.</p>
        <div class="hero-buttons"><a class="btn btn-dark" href="#shop">Find their kind of gift ${icon('arrow',17)}</a><a class="text-link" href="#customise">Make it personal <span>↗</span></a></div>
        <div class="hero-note"><span class="note-stars">✳ ✳ ✳</span><span>Made with love, wrapped with care.</span></div>
      </div>
      <div class="hero-visual">
        <img src="/images/hero.jpg" alt="Thoughtfully wrapped gifts and keepsakes" onerror="this.onerror=null;this.src='/images/hamper.jpg'">
        <div class="hero-sticker"><span>made</span><strong>for you</strong><span>with love ♡</span></div>
        <div class="hero-caption">Every gift tells a story.</div>
      </div>
      <div class="hero-side-note">THOUGHTFUL BY NATURE · PERSONAL BY DESIGN</div>
    </section>

    <section class="trust-strip" aria-label="Our promises"><div><span>✳</span> Made personal</div><i></i><div><span>♡</span> Made with care</div><i></i><div><span>✉</span> A note from you</div><i></i><div><span>♧</span> Beautifully wrapped</div></section>

    <section class="section categories-section" id="shop">
      <div class="section-heading"><div><div class="eyebrow">A LITTLE OF EVERYTHING</div><h2>Find their <em>kind</em> of gift.</h2><p>For every personality, every story, every little moment.</p></div><a href="#favourites" class="text-link">Explore favourites ${icon('arrow',16)}</a></div>
      <div class="category-grid">${categories.map((c,i)=>`<button class="category-card" data-category="${c.name}"><div class="category-image"><img src="${c.image}" alt="${c.name}" loading="lazy" onerror="this.onerror=null;this.src='/images/hamper.jpg'"><span class="category-symbol">${c.icon}</span><span class="category-arrow">↗</span></div><div class="category-title">${c.name}</div><div class="category-subtitle">${c.subtitle}</div></button>`).join('')}</div>
    </section>

    <section class="section favourites-section" id="favourites">
      <div class="section-heading"><div><div class="eyebrow">THE ONES PEOPLE LOVE</div><h2>Little things, <em>big feelings.</em></h2><p>Some of our most-loved ways to say “you matter”.</p></div><span class="results-count" id="results-count">6 thoughtful finds</span></div>
      <div class="filter-row"><div class="filter-pills" id="filter-pills"><button class="filter-pill selected" data-filter="All">All gifts</button>${categories.map(c=>`<button class="filter-pill" data-filter="${c.name}">${c.name}</button>`).join('')}</div><button class="clear-filter" id="clear-filter">Clear filters ↺</button></div>
      <div class="product-grid" id="product-grid"></div>
    </section>

    <section class="custom-banner section" id="customise">
      <div class="custom-image"><img src="/images/custom-note.jpg" alt="A handwritten note being made" onerror="this.onerror=null;this.src='/images/magazine.jpg'"><div class="custom-image-label">A little note goes a long way.</div></div>
      <div class="custom-copy"><div class="eyebrow">YOUR IDEA, OUR HANDS</div><h2>Make it <em>theirs.</em></h2><p>A name they love. A memory you share. A colour that feels like them. Tell us the little details — we'll help make them mean a lot.</p><ul class="custom-list"><li><span>01</span> Add names, dates & initials</li><li><span>02</span> Include your favourite photos</li><li><span>03</span> Pick colours and personal details</li><li><span>04</span> Finish with a note from you</li></ul><button class="btn btn-dark" id="custom-open">Create a custom gift ${icon('arrow',17)}</button><div class="handwritten">Made just for your person ♡</div></div>
    </section>

    <section class="section occasion-section" id="occasions"><div class="section-heading"><div><div class="eyebrow">WHAT ARE WE CELEBRATING?</div><h2>There's a gift for <em>that.</em></h2><p>Big milestones or a random Tuesday — every reason is a good one.</p></div></div><div class="occasion-grid">${occasions.map((o,i)=>`<button class="occasion-card" data-occasion="${o.name}"><span class="occasion-icon">${o.icon}</span><span class="occasion-name">${o.name}</span><span class="occasion-hint">${o.hint}</span><span class="occasion-arrow">↗</span></button>`).join('')}</div></section>

    <section class="newsletter-section" id="story"><div class="newsletter-flower">✳</div><div class="eyebrow">A NOTE FROM US TO YOU</div><h2>Good things are <em>worth sharing.</em></h2><p>Get thoughtful gift ideas, little surprises, and first dibs on new handmade finds.</p><form id="newsletter-form" class="newsletter-form"><input type="email" id="newsletter-email" required placeholder="Your email address" aria-label="Your email address"><button type="submit">Count me in ${icon('arrow',16)}</button></form><small>No spam, just the occasional lovely thing. ♡</small></section>
  </main>

  <footer class="site-footer"><div class="footer-main"><div class="footer-brand-col"><a class="brand brand-light" href="#home">giftify<span>♥</span><small>little things, lasting feelings</small></a><p>For the people who make life feel a little more like life.</p><div class="social-links"><a href="#story" aria-label="Instagram">ig</a><a href="#story" aria-label="Pinterest">p</a><a href="#story" aria-label="Contact">✉</a></div></div><div class="footer-col"><h4>Explore</h4><a href="#shop">Shop all gifts</a><a href="#favourites">Bestsellers</a><a href="#customise">Custom gifts</a><a href="#occasions">Shop by occasion</a></div><div class="footer-col"><h4>Here to help</h4><a href="mailto:hello@giftify.example">Contact us</a><a href="#story">Shipping & delivery</a><a href="#story">Customisation guide</a><a href="#story">FAQs</a></div><div class="footer-note"><span>✳</span><p>“The best gifts aren't things.<br>They're the feeling of being known.”</p><small>— The Giftify thought</small></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Giftify. Made with love.</span><span>Made for memories, not just moments. ♡</span><span>India · INR ₹</span></div></footer>

  <div class="overlay" id="overlay"></div>
  <aside class="cart-drawer" id="cart-drawer" aria-label="Shopping bag" aria-modal="true" role="dialog"><div class="drawer-head"><div><div class="eyebrow">YOUR LITTLE FINDS</div><h2>Your bag <span class="cart-count-text"></span></h2></div><button class="icon-btn" id="close-cart" aria-label="Close shopping bag">${icon('close')}</button></div><div class="cart-items" id="cart-items"></div><div class="drawer-bottom"><div class="subtotal-row"><span>Subtotal</span><strong id="cart-subtotal">₹0</strong></div><p>Shipping and any customisation charges are calculated at checkout.</p><button class="btn btn-dark checkout-btn" id="checkout-btn">Continue to checkout ${icon('arrow',17)}</button><button class="continue-shopping" data-close-cart>Keep looking for gifts</button><small>Secure checkout will be connected before launch.</small></div></aside>

  <div class="custom-modal" id="custom-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><div class="eyebrow">LET'S MAKE SOMETHING MEANINGFUL</div><h2 id="modal-title">Tell us about <em>your idea.</em></h2></div><button class="icon-btn" id="close-custom" aria-label="Close form">${icon('close')}</button></div><p class="modal-intro">A few little details help us understand the gift you're dreaming of.</p><form id="custom-form" class="custom-form">
    <label>Your name<input name="name" required placeholder="What should we call you?"></label>
    <label>Email address<input type="email" name="email" required placeholder="Where can we reach you?"></label>
    <div class="form-two"><label>Who is it for?<select name="recipient" required><option value="">Choose one</option><option>Partner</option><option>Best friend</option><option>Parent</option><option>Sibling</option><option>Someone else</option></select></label><label>Occasion<select name="occasion"><option>Just because</option><option>Birthday</option><option>Anniversary</option><option>Friendship</option><option>Long distance</option><option>Festive</option></select></label></div>
    <label>What are you imagining?<select name="product" required><option value="">Choose a gift</option>${products.map(p=>`<option>${p.name}</option>`).join('')}<option>A custom hamper</option><option>Something else</option></select></label>
    <label>Tell us the little details<textarea name="details" rows="4" placeholder="Colours, memories, names, budget, delivery date…"></textarea></label>
    <button class="btn btn-dark" type="submit">Send my idea ${icon('arrow',17)}</button><small>This demo stores your request on the local server when deployed with the backend.</small>
  </form></div>

  <div class="checkout-modal" id="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><div class="modal-head"><div><div class="eyebrow">ALMOST THERE</div><h2 id="checkout-title">Let's make it <em>official.</em></h2></div><button class="icon-btn" id="close-checkout" aria-label="Close checkout">${icon('close')}</button></div><p class="modal-intro">This is a frontend demo checkout. No payment will be collected.</p><form id="checkout-form" class="custom-form"><label>Full name<input name="name" required placeholder="Your full name"></label><label>Email address<input name="email" type="email" required placeholder="you@example.com"></label><label>Delivery address<textarea name="address" rows="3" required placeholder="House, street, city, PIN code"></textarea></label><label>Gift note (optional)<textarea name="note" rows="2" placeholder="Write a little message…"></textarea></label><div class="subtotal-row"><span>Order total</span><strong id="checkout-total">₹0</strong></div><button class="btn btn-dark" type="submit">Place demo order ${icon('arrow',17)}</button></form></div>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
`;

renderProducts(); renderCart();

document.addEventListener('click', async e => {
  const add=e.target.closest('[data-add]');
  if(add){const id=add.dataset.add;const found=cart.find(x=>x.id===id);found?found.qty++:cart.push({id,qty:1});renderCart();toast('Added to your bag — lovely choice! ♡');return;}
  const fav=e.target.closest('[data-fav]');
  if(fav){const id=fav.dataset.fav;favorites.has(id)?favorites.delete(id):favorites.add(id);localStorage.setItem('giftify-favs',JSON.stringify([...favorites]));fav.classList.toggle('is-fav',favorites.has(id));toast(favorites.has(id)?'Saved to your favourites ♡':'Removed from favourites');return;}
  const qty=e.target.closest('[data-qty]');
  if(qty){const item=cart.find(x=>x.id===qty.dataset.qty);if(item){item.qty+=Number(qty.dataset.delta);if(item.qty<=0)cart=cart.filter(x=>x.id!==item.id);}renderCart();return;}
  const rem=e.target.closest('[data-remove]');
  if(rem){cart=cart.filter(x=>x.id!==rem.dataset.remove);renderCart();toast('Gift removed from your bag');return;}
  const cat=e.target.closest('[data-category]');
  if(cat){activeCategory=cat.dataset.category;document.querySelector('#filter-pills').querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b.dataset.filter===activeCategory));renderProducts();document.querySelector('#favourites').scrollIntoView({behavior:'smooth'});return;}
  const filter=e.target.closest('[data-filter]');
  if(filter){activeCategory=filter.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('selected',b.dataset.filter===activeCategory));renderProducts();return;}
  if(e.target.closest('#clear-filter')||e.target.closest('[data-reset]')){activeCategory='All';searchTerm='';document.querySelector('#search-input').value='';document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('selected',b.dataset.filter==='All'));renderProducts();return;}
  if(e.target.closest('#cart-trigger')){openCart();return;}
  if(e.target.closest('#close-cart')||e.target.closest('[data-close-cart]')){closePanels();return;}
  if(e.target.id==='overlay'){closePanels();document.querySelector('#checkout-modal').classList.remove('open');return;}
  if(e.target.closest('#custom-open')){document.querySelector('#custom-modal').classList.add('open');document.querySelector('#overlay').classList.add('visible');document.body.classList.add('no-scroll');return;}
  if(e.target.closest('#close-custom')){closePanels();return;}
  if(e.target.closest('#checkout-btn')){if(!cart.length)return;document.querySelector('#checkout-total').textContent=document.querySelector('#cart-subtotal').textContent;document.querySelector('#checkout-modal').classList.add('open');document.querySelector('#overlay').classList.add('visible');document.body.classList.add('no-scroll');return;}
  if(e.target.closest('#close-checkout')){document.querySelector('#checkout-modal').classList.remove('open');document.querySelector('#overlay').classList.remove('visible');document.body.classList.remove('no-scroll');return;}
  const occasion=e.target.closest('[data-occasion]');
  if(occasion){toast(`${occasion.dataset.occasion}: let's find a gift for that occasion ♡`);activeCategory='All';document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('selected',b.dataset.filter==='All'));renderProducts();document.querySelector('#favourites').scrollIntoView({behavior:'smooth'});return;}
  if(e.target.closest('#favs-button')){searchTerm='';activeCategory='All';document.querySelector('#search-input').value='';renderProducts();document.querySelector('#favourites').scrollIntoView({behavior:'smooth'});toast(`${favorites.size} gift${favorites.size===1?'':'s'} saved in your favourites ♡`);return;}
  if(e.target.closest('#mobile-menu')){document.querySelector('#main-nav').classList.toggle('nav-open');return;}
});

document.querySelector('#search-form').addEventListener('submit',e=>{e.preventDefault();searchTerm=document.querySelector('#search-input').value.trim();activeCategory='All';document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('selected',b.dataset.filter==='All'));renderProducts();document.querySelector('#favourites').scrollIntoView({behavior:'smooth'});});
document.querySelector('#search-input').addEventListener('input',e=>{searchTerm=e.target.value.trim();renderProducts();});
document.querySelector('#custom-form').addEventListener('submit',async e=>{
  e.preventDefault();const form=e.currentTarget;const data=Object.fromEntries(new FormData(form).entries());
  try { const r=await fetch('/api/custom-requests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); if(r.ok){form.reset();closePanels();toast('Your idea is in! We can’t wait to hear more ♡');} else throw new Error(); }
  catch { toast('Backend unavailable in preview. Run npm run dev and npm start as described in README.'); }
});
document.querySelector('#checkout-form').addEventListener('submit',async e=>{
  e.preventDefault();const form=e.currentTarget;const customer=Object.fromEntries(new FormData(form).entries());
  const order={customer,items:cart.map(item=>({...item,product:products.find(p=>p.id===item.id)?.name})),total:cart.reduce((n,item)=>n+products.find(p=>p.id===item.id).price*item.qty,0)};
  try {const r=await fetch('/api/orders/demo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(order)});if(!r.ok)throw new Error();const result=await r.json();cart=[];renderCart();form.reset();document.querySelector('#checkout-modal').classList.remove('open');document.querySelector('#cart-drawer').classList.remove('open');document.querySelector('#overlay').classList.remove('visible');document.body.classList.remove('no-scroll');toast(`Demo order ${result.orderId} created! No payment taken.`);}
  catch {toast('Backend unavailable. Start the server to place a demo order.');}
});
document.querySelector('#newsletter-form').addEventListener('submit',async e=>{
  e.preventDefault();const email=document.querySelector('#newsletter-email').value;
  try {const r=await fetch('/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});if(!r.ok)throw new Error();document.querySelector('#newsletter-email').value='';toast('You’re on the list. Lovely things coming your way! ♡');}
  catch {toast('Newsletter signup needs the backend server running.');}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closePanels();document.querySelector('#checkout-modal').classList.remove('open');}});
