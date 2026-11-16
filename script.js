
/* ===== KONFIGURASI TOKO: ubah nomor WhatsApp di sini ===== */
const WHATSAPP_NUMBER="6281234567890"; // format 62, tanpa tanda + atau spasi
const STORE_NAME="RasaRuang";
const products=[
{id:"m1",name:"Nasi Ayam Rempah",price:22000,category:"Makanan",desc:"Ayam berbumbu khas, nasi hangat, dan sambal pilihan.",img:"https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80"},
{id:"m2",name:"Rice Bowl Teriyaki",price:24000,category:"Makanan",desc:"Ayam teriyaki gurih dengan nasi pulen.",img:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80"},
{id:"m3",name:"Burger Signature",price:27000,category:"Makanan",desc:"Roti lembut, patty juicy, dan saus spesial.",img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80"},
{id:"m4",name:"Pasta Creamy",price:25000,category:"Makanan",desc:"Pasta saus creamy dengan rasa gurih yang pas.",img:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80"},
{id:"m5",name:"Es Kopi Susu",price:15000,category:"Minuman",desc:"Kopi dan susu dengan rasa seimbang.",img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80"},
{id:"m6",name:"Lemon Tea",price:12000,category:"Minuman",desc:"Teh segar dengan sentuhan lemon.",img:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80"},
{id:"m7",name:"Kentang Crispy",price:14000,category:"Snack",desc:"Kentang goreng renyah dengan bumbu pilihan.",img:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80"},
{id:"m8",name:"Chicken Bites",price:18000,category:"Snack",desc:"Potongan ayam crispy untuk teman santai.",img:"https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=80"}
];
const poProducts=[
{id:"p1",name:"Dessert Box Cokelat",price:35000,category:"PO",desc:"Dessert box cokelat, dibuat berdasarkan jumlah pesanan.",img:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",deadline:"Tutup PO: Jumat",schedule:"Pengambilan: Minggu"},
{id:"p2",name:"Lasagna Homemade",price:45000,category:"PO",desc:"Lasagna homemade dengan saus gurih dan keju.",img:"https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=900&q=80",deadline:"Tutup PO: Sabtu",schedule:"Pengambilan: Senin"},
{id:"p3",name:"Paket Snack Box",price:28000,category:"PO",desc:"Paket snack box untuk acara dan kumpul keluarga.",img:"https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",deadline:"Tutup PO: Kamis",schedule:"Pengambilan: Sabtu"}
];
const all=[...products,...poProducts],cart={regular:{},po:{}},chosenQty={};
const CART_KEY="rasaruang-cart-v2";
try{const saved=JSON.parse(localStorage.getItem(CART_KEY)||"{}");if(saved&&saved.regular&&saved.po){Object.assign(cart.regular,saved.regular);Object.assign(cart.po,saved.po)}}catch(e){}
function saveCart(){try{localStorage.setItem(CART_KEY,JSON.stringify(cart))}catch(e){}}
const money=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const $=s=>document.querySelector(s);
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2100)}
function card(item,isPO=false){const q=chosenQty[item.id]||1;return `<article class="product"><div class="productpic"><img src="${item.img}" alt="${item.name}" loading="lazy"><span class="badge">${isPO?"PRE-ORDER":item.category.toUpperCase()}</span></div><div class="productbody"><div class="productline"><h3>${item.name}</h3><span class="price">${money(item.price)}</span></div><p>${item.desc}${isPO?`<br><b>${item.deadline}</b> · ${item.schedule}`:""}</p><div class="productfoot"><div class="qty"><button type="button" data-q="minus" data-id="${item.id}" aria-label="Kurangi">−</button><span>${q}</span><button type="button" data-q="plus" data-id="${item.id}" aria-label="Tambah">+</button></div><button class="add" type="button" data-add="${item.id}">+ ${isPO?"Tambah ke PO":"Tambah"}</button></div></div></article>`}
function renderProducts(category="Semua"){
 let list=products.filter(p=>(category==="Semua"||p.category===category));
 const term=( $("#menuSearch")?.value||"").trim().toLocaleLowerCase("id-ID");
 if(term)list=list.filter(p=>(p.name+" "+p.desc+" "+p.category).toLocaleLowerCase("id-ID").includes(term));
 const sort=$("#menuSort")?.value||"default";
 if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);if(sort==="az")list.sort((a,b)=>a.name.localeCompare(b.name,"id"));
 $("#products").innerHTML=list.length?list.map(p=>card(p)).join(""):`<div class="empty" style="grid-column:1/-1">Menu tidak ditemukan. Coba kata kunci lain.</div>`;
}
function renderPO(){$("#poGrid").innerHTML=poProducts.map(p=>card(p,true)).join("");const items=poProducts.filter(p=>cart.po[p.id]);$("#poPreview").innerHTML=items.length?items.map(p=>`<div class="po-item"><img src="${p.img}" alt=""><div><b>${p.name}</b><small>${cart.po[p.id]} item · ${p.deadline}</small></div><strong>${money(p.price*cart.po[p.id])}</strong></div>`).join(""):`<div class="po-empty">Daftar PO kamu masih kosong.<br>Pilih menu PO di bawah untuk mulai menambahkan.</div>`}
function total(type){return Object.entries(cart[type]).reduce((sum,[id,q])=>sum+all.find(p=>p.id===id).price*q,0)}
function count(){return Object.values(cart).reduce((s,obj)=>s+Object.values(obj).reduce((a,b)=>a+b,0),0)}
function updateCount(){$("#cartCount").textContent=count()}
function addItem(id){const p=all.find(x=>x.id===id),type=p.category==="PO"?"po":"regular";cart[type][id]=Math.min(99,(cart[type][id]||0)+(chosenQty[id]||1));saveCart();chosenQty[id]=1;renderProducts(activeCategory);renderPO();updateCount();if($("#drawerBack").classList.contains("open"))renderCart();toast(`${p.name} ditambahkan ke ${type==="po"?"daftar PO":"keranjang"}`)}
let activeCategory="Semua",activeCart="regular";
function renderCart(){const data=cart[activeCart],entries=Object.entries(data);$("#cartRows").innerHTML=entries.length?entries.map(([id,q])=>{const p=all.find(x=>x.id===id);return `<div class="cartrow"><img src="${p.img}" alt=""><div><b>${p.name}</b><small>${money(p.price)} × ${q}</small><button class="remove" data-remove="${id}" type="button">Hapus</button></div><div class="qty"><button type="button" data-cartq="minus" data-id="${id}">−</button><span>${q}</span><button type="button" data-cartq="plus" data-id="${id}">+</button></div></div>`}).join(""):`<div class="empty">Belum ada item di ${activeCart==="po"?"daftar PO":"keranjang"} ini.<br>Yuk pilih menu dulu!</div>`;$("#cartTotal").textContent=money(total(activeCart));$("#checkoutBtn").disabled=!entries.length;$("#checkoutBtn").style.opacity=entries.length?1:.5;$("#checkoutBtn").textContent=activeCart==="po"?"Checkout daftar PO →":"Lanjut checkout →"}
function openDrawer(){renderCart();$("#drawerBack").classList.add("open");$("#drawerBack").setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeDrawer(){$("#drawerBack").classList.remove("open");$("#drawerBack").setAttribute("aria-hidden","true");document.body.style.overflow=""}
function openModal(){if(!Object.keys(cart[activeCart]).length)return;$("#modalBack").classList.add("open");$("#customerName").focus()}
function closeModal(){$("#modalBack").classList.remove("open")}
function checkoutMessage(form){const isPO=activeCart==="po",data=cart[activeCart];let lines=Object.entries(data).map(([id,q])=>{const p=all.find(x=>x.id===id);return `• ${p.name} (${q}x) — ${money(p.price*q)}`}).join("\n");const date=form.get("date")||"Belum ditentukan";return `Halo ${STORE_NAME}! Saya ingin ${isPO?"melakukan PRE-ORDER":"memesan"} dengan detail berikut:\n\n${lines}\n\nTotal sementara: ${money(total(activeCart))}\n\nNama: ${form.get("name")}\nNomor WA: ${form.get("phone")||"-"}\nTanggal: ${date}\nCatatan: ${form.get("note")||"-"}\n\nMohon konfirmasi ketersediaan dan detail pembayarannya. Terima kasih!`}
$("#menuSearch").addEventListener("input",()=>renderProducts(activeCategory));
$("#menuSort").addEventListener("change",()=>renderProducts(activeCategory));
$("#backTop").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
window.addEventListener("scroll",()=>$("#backTop").classList.toggle("show",window.scrollY>550),{passive:true});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeDrawer();closeModal()}});
$("#categoryTabs").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll("#categoryTabs .tab").forEach(x=>x.classList.toggle("active",x===b));renderProducts(activeCategory)});
document.addEventListener("click",e=>{const q=e.target.closest("[data-q]");if(q){const id=q.dataset.id;chosenQty[id]=Math.max(1,Math.min(99,(chosenQty[id]||1)+(q.dataset.q==="plus"?1:-1)));renderProducts(activeCategory);renderPO();return}const add=e.target.closest("[data-add]");if(add){addItem(add.dataset.add);return}const rm=e.target.closest("[data-remove]");if(rm){delete cart[activeCart][rm.dataset.remove];saveCart();renderCart();renderPO();updateCount();return}const cq=e.target.closest("[data-cartq]");if(cq){const id=cq.dataset.id;cart[activeCart][id]=Math.max(0,Math.min(99,cart[activeCart][id]+(cq.dataset.cartq==="plus"?1:-1)));if(!cart[activeCart][id])delete cart[activeCart][id];saveCart();renderCart();renderPO();updateCount()}});
$("#openCart").addEventListener("click",openDrawer);$("#ctaCart").addEventListener("click",openDrawer);$("#closeCart").addEventListener("click",closeDrawer);$("#drawerBack").addEventListener("click",e=>{if(e.target===$("#drawerBack"))closeDrawer()});
$("#regularTab").addEventListener("click",()=>{activeCart="regular";$("#regularTab").classList.add("active");$("#poTab").classList.remove("active");renderCart()});$("#poTab").addEventListener("click",()=>{activeCart="po";$("#poTab").classList.add("active");$("#regularTab").classList.remove("active");renderCart()});
$("#checkoutBtn").addEventListener("click",()=>{closeDrawer();openModal()});$("#closeModal").addEventListener("click",closeModal);$("#modalBack").addEventListener("click",e=>{if(e.target===$("#modalBack"))closeModal()});
$("#checkoutForm").addEventListener("submit",e=>{e.preventDefault();const number=WHATSAPP_NUMBER.replace(/\D/g,"");if(number.length<10||number==="6281234567890"){toast("Atur nomor WhatsApp toko terlebih dahulu di kode website.");return}const f=new FormData(e.currentTarget);const msg=checkoutMessage({name:f.get("name").trim(),phone:f.get("phone").trim(),date:f.get("date"),note:f.get("note").trim()});window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`,"_blank");cart[activeCart]={};saveCart();renderCart();renderPO();updateCount();closeModal();e.currentTarget.reset();toast("Rangkuman pesanan dibuka di WhatsApp")});
$("#year").textContent=new Date().getFullYear();$("#pickupDate").min=new Date().toISOString().slice(0,10);renderProducts();renderPO();updateCount();
const revealObserver=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add("visible");revealObserver.unobserve(en.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));
