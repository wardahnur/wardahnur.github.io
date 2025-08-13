// UTILITIES
const $ = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));
const currency = n => new Intl.NumberFormat('id-ID',{style:'currency', currency:'IDR', maximumFractionDigits:0}).format(n);

// NAV
const navToggle = $('.nav-toggle');
const navMenu = $('#nav-menu');
if (navToggle){
  navToggle.addEventListener('click', ()=> navMenu.classList.toggle('open'));
}

// YEAR
$('#year').textContent = new Date().getFullYear();

// CALM MODE
const calmToggle = $('#calmToggle');
calmToggle?.addEventListener('click', ()=>{
  const on = document.body.classList.toggle('calm');
  calmToggle.setAttribute('aria-pressed', on ? 'true':'false');
});

// REVEAL ANIMATIONS
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('visible'); }
  })
},{threshold:.2});
$$('.reveal').forEach(el=> io.observe(el));

// SLIDER
const slider = $('.slider');
const slidesWrap = $('.slides', slider);
const slides = $$('.slide', slider);
const dotsWrap = $('.dots', slider);
let index = 0;
function go(i){
  index = (i + slides.length) % slides.length;
  slidesWrap.style.transform = `translateX(-${index*100}%)`;
  $$('.dots button', dotsWrap).forEach((d,di)=> d.setAttribute('aria-selected', di===index?'true':'false'));
}
slides.forEach((_,i)=>{
  const b = document.createElement('button');
  b.setAttribute('role','tab');
  b.setAttribute('aria-selected', i===0? 'true':'false');
  b.addEventListener('click', ()=> go(i));
  dotsWrap.appendChild(b);
});
$('.prev', slider).addEventListener('click', ()=> go(index-1));
$('.next', slider).addEventListener('click', ()=> go(index+1));
setInterval(()=> go(index+1), 5000);

// PRODUCTS
const PRODUCTS = [
  {id:'pkt-konsul', name:'Konsultasi Spesialis Anak', price:150000, img:'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop'},
  {id:'pkt-imunisasi', name:'Paket Imunisasi Nyaman', price:350000, img:'https://images.unsplash.com/photo-1580281657527-47e05d89cc85?q=80&w=1200&auto=format&fit=crop'},
  {id:'pkt-homecare', name:'Home Care 3x Kunjungan', price:900000, img:'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop'},
  {id:'pkt-tumbuh', name:'Asesmen Tumbuh Kembang', price:275000, img:'https://images.unsplash.com/photo-1542736667-069246bdbc74?q=80&w=1200&auto=format&fit=crop'},
  {id:'pkt-tele', name:'Telekonsultasi 30 Menit', price:120000, img:'https://images.unsplash.com/photo-1600959907703-125ba1374a12?q=80&w=1200&auto=format&fit=crop'},
  {id:'pkt-edukasi', name:'Kelas Edukasi Orang Tua', price:80000, img:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop'},
];
const productsEl = $('#products');
PRODUCTS.forEach(p=>{
  const el = document.createElement('article');
  el.className = 'product';
  el.innerHTML = `
    <div class="media"><img src="${p.img}" alt="${p.name}"/></div>
    <div class="body">
      <h3>${p.name}</h3>
      <p class="muted">Pelayanan profesional, ramah anak, dan terstandar.</p>
      <div class="price">${currency(p.price)}</div>
    </div>
    <div class="add">
      <div class="qty" data-id="${p.id}">
        <button aria-label="Kurangi">−</button>
        <span>1</span>
        <button aria-label="Tambah">+</button>
      </div>
      <button class="btn" data-add="${p.id}">Tambah</button>
    </div>
  `;
  productsEl.appendChild(el);
});

// QTY controls
$$('.qty').forEach(q=>{
  const span = $('span', q);
  q.addEventListener('click', (e)=>{
    if(e.target.tagName!=='BUTTON') return;
    let n = +span.textContent;
    if(e.target.textContent.trim()==='−' && n>1) n--;
    if(e.target.textContent.trim()==='+') n++;
    span.textContent = n;
  });
});

// CART
const cart = JSON.parse(localStorage.getItem('cart.zahirah')||'[]');
const cartPanel = $('#cartPanel');
const cartItems = $('#cartItems');
const cartTotal = $('#cartTotal');
const cartCount = $('#cartCount');
const openCartBtn = $('#openCart');
const closeCartBtn = $('#closeCart');

function saveCart(){ localStorage.setItem('cart.zahirah', JSON.stringify(cart)); }
function calcTotal(){ return cart.reduce((s,i)=> s + i.price * i.qty, 0); }
function renderCart(){
  cartItems.innerHTML = '';
  cart.forEach(item=>{
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${item.img}" alt="${item.name}"/>
      <div>
        <strong>${item.name}</strong>
        <div class="muted">${currency(item.price)}</div>
        <div class="qty" data-id="${item.id}">
          <button aria-label="Kurangi">−</button>
          <span>${item.qty}</span>
          <button aria-label="Tambah">+</button>
        </div>
      </div>
      <button class="icon-btn" data-remove="${item.id}">🗑</button>
    `;
    cartItems.appendChild(el);
  });
  cartTotal.textContent = currency(calcTotal());
  cartCount.textContent = cart.reduce((s,i)=> s + i.qty, 0);
}
function openCart(){ cartPanel.classList.add('open'); cartPanel.setAttribute('aria-hidden','false'); }
function closeCart(){ cartPanel.classList.remove('open'); cartPanel.setAttribute('aria-hidden','true'); }
openCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
productsEl.addEventListener('click', (e)=>{
  const addId = e.target.dataset.add;
  if(!addId) return;
  const prod = PRODUCTS.find(p=> p.id===addId);
  const qty = +$('span', e.target.parentElement.querySelector('.qty')).textContent;
  const existing = cart.find(i=> i.id===prod.id);
  if(existing) existing.qty += qty;
  else cart.push({...prod, qty});
  saveCart(); renderCart(); openCart(); pop();
});
cartItems.addEventListener('click', (e)=>{
  if(e.target.dataset.remove){
    const id = e.target.dataset.remove;
    const idx = cart.findIndex(i=> i.id===id);
    if(idx>-1) cart.splice(idx,1);
    saveCart(); renderCart();
  }
  if(e.target.closest('.qty')){
    const wrap = e.target.closest('.qty');
    if(e.target.tagName!=='BUTTON') return;
    const id = wrap.dataset.id;
    const it = cart.find(i=> i.id===id);
    if(!it) return;
    if(e.target.textContent.trim()==='−' && it.qty>1) it.qty--;
    if(e.target.textContent.trim()==='+') it.qty++;
    saveCart(); renderCart();
  }
});
renderCart();

// CHECKOUT
const checkoutBtn = $('#checkoutBtn');
const checkoutModal = $('#checkoutModal');
const orderSummary = $('#orderSummary');
const closeCheckout = $('#closeCheckout');
const checkoutForm = $('#checkoutForm');

checkoutBtn.addEventListener('click', ()=>{
  if(!cart.length){ alert('Keranjang kosong'); return; }
  orderSummary.innerHTML = cart.map(i=> `• ${i.name} × ${i.qty} = <b>${currency(i.price*i.qty)}</b>`).join('<br>');
  openModal();
});
closeCheckout.addEventListener('click', closeModal);
function openModal(){ checkoutModal.classList.add('open'); checkoutModal.setAttribute('aria-hidden','false'); }
function closeModal(){ checkoutModal.classList.remove('open'); checkoutModal.setAttribute('aria-hidden','true'); }

checkoutForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(checkoutForm).entries());
  const payload = { contact:data, items:cart, total: calcTotal(), time: new Date().toISOString() };
  console.log('ORDER', payload);
  confetti();
  closeModal();
  cart.length = 0; saveCart(); renderCart();
  alert('Terima kasih! Pesanan Anda diterima. Kami akan menghubungi via WhatsApp.');
});

// Appointment form
const apptForm = $('#apptForm');
const apptToast = $('#apptToast');
apptForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(apptForm).entries());
  console.log('APPT', data);
  apptToast.classList.add('show');
  setTimeout(()=> apptToast.classList.remove('show'), 2500);
  apptForm.reset();
});

// Tiny pop animation when add to cart
function pop(){
  openCartBtn.animate([
    {transform:'scale(1)'}, {transform:'scale(1.1)'}, {transform:'scale(1)'}], {duration:300});
}

// Confetti (CSS-free, minimal)
function confetti(){
  const n = 60;
  const box = document.createDocumentFragment();
  for(let i=0;i<n;i++){
    const s=document.createElement('div');
    s.style.position='fixed';
    s.style.left= Math.random()*100+'vw';
    s.style.top= '-10px';
    s.style.width = s.style.height = (6+Math.random()*6)+'px';
    s.style.background = Math.random()>.5?'#ff7eb6':'#63b3ff';
    s.style.transform='rotate('+Math.random()*360+'deg)';
    s.style.borderRadius='2px';
    s.style.zIndex=9999;
    document.body.appendChild(s);
    const endY = (60+Math.random()*30)+'vh';
    s.animate([{transform:`translateY(0) rotate(0)`},{transform:`translateY(${endY}) rotate(${360+Math.random()*360}deg)`}], {duration:1500+Math.random()*1000, easing:'cubic-bezier(.22,1,.36,1)'}).onfinish = ()=> s.remove();
  }
}

// Accessibility minor
document.addEventListener('keydown', (e)=>{
  if(e.key==='Escape'){ closeModal(); closeCart(); }
});

// TOAST style via JS injection (keep CSS minimal)
const toastStyle = document.createElement('style');
toastStyle.textContent = `.toast{position:fixed; left:50%; transform:translateX(-50%); bottom:80px; background:#0f172a; color:#fff; padding:.7rem 1rem; border-radius:999px; opacity:0; visibility:hidden; transition:.3s; z-index:70}
.toast.show{opacity:1; visibility:visible}`;
document.head.appendChild(toastStyle);
