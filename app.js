// Datos de ejemplo (puedes agregar más)
const productos = [
  { id: 1, nombre: "Polo Boxy Fit - Oscuro", precio: 74900, img: "img1" , ultimo: true},
  { id: 2, nombre: "Polo Boxy Fit - Claro", precio: 74900, img: "img2", ultimo: true},
  { id: 3, nombre: "Buzo Oversize", precio: 129900, img: "img3"},
  { id: 4, nombre: "Campera Puffer", precio: 349900, img: "img4"}
];

let carrito = JSON.parse(localStorage.getItem("tn_carrito")) || [];

// Formateador moneda ARS
function fCurrency(n){
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

// Inserta año
document.getElementById('anio').innerText = new Date().getFullYear();

// Render productos
const cont = document.getElementById('productos');
function renderProductos(list = productos){
  cont.innerHTML = '';
  list.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4';

    col.innerHTML = `
      <div class="card h-100">
        <div class="product-image">
          ${placeholderSVG(p.nombre)}
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="mb-0">${p.nombre}</h5>
            ${p.ultimo ? '<span class="badge rounded-pill" style="background:#d6b64f;color:#111;">Última</span>' : ''}
          </div>
          <p class="small-muted mb-2">Stock limitado · envío 24-72hs</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="price">${fCurrency(p.precio)}</div>
            <button class="btn btn-dark btn-sm" onclick="agregarAlCarrito(${p.id})">Agregar</button>
          </div>
        </div>
      </div>
    `;
    cont.appendChild(col);
  });
}

// SVG placeholder (simple ilustración)
function placeholderSVG(name){
  return `
    <svg width="220" height="180" viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${name}">
      <rect width="220" height="180" rx="12" fill="#f6f6f6"/>
      <g transform="translate(30,20)" fill="none" stroke="#cfcfcf" stroke-width="2">
        <path d="M0 30 C20 0,80 0,100 30" stroke-linecap="round"/>
        <rect x="10" y="40" width="120" height="70" rx="6" fill="#eaeaea"/>
      </g>
    </svg>
  `;
}

// Carrito: add / remove / modify
function agregarAlCarrito(id){
  const producto = productos.find(p=>p.id===id);
  const existe = carrito.find(i=>i.id===id);
  if(existe){
    existe.cantidad++;
  } else {
    carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
  }
  guardarYRender();
  abrirCarrito();
}

function eliminarDelCarrito(id){
  carrito = carrito.filter(i => i.id !== id);
  guardarYRender();
}

function cambiarCantidad(id, val){
  const item = carrito.find(i=>i.id===id);
  if(!item) return;
  item.cantidad = Number(val);
  if(item.cantidad <= 0) eliminarDelCarrito(id);
  guardarYRender();
}

function vaciarCarrito(){
  carrito = [];
  guardarYRender();
}

// Mostrar carrito offcanvas
const offEl = document.getElementById('offcart');
const bsOff = new bootstrap.Offcanvas(offEl);

function abrirCarrito(){
  bsOff.show();
  renderCarrito();
}

document.getElementById('btnCart').addEventListener('click', abrirCarrito);
document.getElementById('vaciar').addEventListener('click', ()=>{
  vaciarCarrito();
  // keep offcanvas open and show updated
  renderCarrito();
});

document.getElementById('seguir').addEventListener('click', ()=> bsOff.hide());
document.getElementById('checkout').addEventListener('click', ()=> {
  alert('Simulación de pago\nTotal: ' + fCurrency(totalCarrito()));
});

// render carrito UI
function renderCarrito(){
  const ul = document.getElementById('carrito');
  ul.innerHTML = '';
  if(carrito.length === 0){
    ul.innerHTML = '<li class="list-group-item">Tu carrito está vacío.</li>';
  } else {
    carrito.forEach(item=>{
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex align-items-center justify-content-between gap-2';
      li.innerHTML = `
        <div>
          <div class="fw-bold">${item.nombre}</div>
          <div class="small-muted">${fCurrency(item.precio)} c/u</div>
        </div>
        <div class="text-end" style="min-width:130px;">
          <div class="d-flex gap-2 align-items-center justify-content-end">
            <input class="form-control form-control-sm qty-input" type="number" min="0" value="${item.cantidad}" onchange="cambiarCantidad(${item.id}, this.value)">
            <div class="text-nowrap">${fCurrency(item.precio * item.cantidad)}</div>
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
          </div>
        </div>
      `;
      ul.appendChild(li);
    });
  }

  document.getElementById('total').innerText = fCurrency(totalCarrito());
  document.getElementById('cartCount').innerText = carrito.reduce((s,i)=>s+i.cantidad,0);
}

// util
function totalCarrito(){
  return carrito.reduce((s,i)=> s + (i.precio * i.cantidad), 0);
}

// guardar
function guardarYRender(){
  localStorage.setItem('tn_carrito', JSON.stringify(carrito));
  renderCarrito();
  // update count even if offcanvas closed
  document.getElementById('cartCount').innerText = carrito.reduce((s,i)=>s+i.cantidad,0);
}

// Buscador simple
document.getElementById('btnBuscar').addEventListener('click', ()=>{
  const q = document.getElementById('buscador').value.trim().toLowerCase();
  if(!q){ renderProductos(); return; }
  const filt = productos.filter(p=> p.nombre.toLowerCase().includes(q));
  renderProductos(filt);
});

// iniciar
window.addEventListener('load', ()=>{
  renderProductos();
  renderCarrito();
});
