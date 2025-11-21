
const productos = [
  { id: 1, nombre: "CAMPERA PUFFER", precio: 129900, img: "https://http2.mlstatic.com/D_NQ_NP_944508-MLA82126788149_012025-O.webp" , ultimo: true},
  { id: 2, nombre: " REMERA BOXY FIT", precio: 35990, img: "https://tse4.mm.bing.net/th/id/OIP.QvD52sf02_K9JZD9jSJjBwHaJ3?pid=Api&P=0&h=180", ultimo: true},
  { id: 3, nombre: "REMERA BOXY FIT", precio: 35990, img: "https://d22fxaf9t8d39k.cloudfront.net/a3c1db15aa4f8eb4d732b6c43f75509c0328b18530b4d4881dc8dae0ddc092145539.jpg"},
  { id: 4, nombre: "BUZO OVERZISE", precio: 70990, img: "https://http2.mlstatic.com/D_NQ_NP_740676-MLA83210430253_032025-O.webp"}
];

let carrito = JSON.parse(localStorage.getItem("tn_carrito")) || [];


function fCurrency(n){
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}


document.getElementById('anio').innerText = new Date().getFullYear();


const cont = document.getElementById('productos');
function renderProductos(list = productos){
  cont.innerHTML = '';
  list.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4';

    col.innerHTML = `
      <div class="card h-100">
        <div class="product-image">
          <img src="${p.img}" alt="${p.nombre}" class="w-100" style="height: 280px; object-fit: cover; border-radius: 12px 12px 0 0;">
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

// Mostrar carrito 
const offEl = document.getElementById('offcart');
const bsOff = new bootstrap.Offcanvas(offEl);

function abrirCarrito(){
  bsOff.show();
  renderCarrito();
}

document.getElementById('btnCart').addEventListener('click', abrirCarrito);
document.getElementById('vaciar').addEventListener('click', ()=>{
  vaciarCarrito();
 
  renderCarrito();
});

document.getElementById('seguir').addEventListener('click', ()=> bsOff.hide());
document.getElementById('checkout').addEventListener('click', ()=> {
  alert('Simulación de pago\nTotal: ' + fCurrency(totalCarrito()));
});


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


function totalCarrito(){
  return carrito.reduce((s,i)=> s + (i.precio * i.cantidad), 0);
}


function guardarYRender(){
  localStorage.setItem('tn_carrito', JSON.stringify(carrito));
  renderCarrito();
  
  document.getElementById('cartCount').innerText = carrito.reduce((s,i)=>s+i.cantidad,0);
}


document.getElementById('btnBuscar').addEventListener('click', ()=>{
  const q = document.getElementById('buscador').value.trim().toLowerCase();
  if(!q){ renderProductos(); return; }
  const filt = productos.filter(p=> p.nombre.toLowerCase().includes(q));
  renderProductos(filt);
});


window.addEventListener('load', ()=>{
  renderProductos();
  renderCarrito();
});