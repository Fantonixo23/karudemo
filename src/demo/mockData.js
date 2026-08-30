// ============================================================
// karuAPP DEMO - Datos simulados (sin backend / sin DB)
// 19 productos, 20 mesas, pedidos, caja, informes, etc.
// ============================================================

export const EMPRESA = {
  nombre_empresa: 'KaruAPP Demo',
  ruc: '80000000-1',
  direccion: 'Av. Demo 1234, Asuncion',
  telefono: '0992 609 484',
  timbrado_numero: '12345678',
  establecimiento: '001',
}

export const METODOS_PAGO = [
  { nombre: 'efectivo', etiqueta: 'Efectivo', color: '#4CAF50', icono: 'payments', activo: true },
  { nombre: 'tarjeta', etiqueta: 'Tarjeta', color: '#9C27B0', icono: 'credit_card', activo: true },
  { nombre: 'transferencia', etiqueta: 'Transferencia', color: '#2196F3', icono: 'account_balance', activo: true },
]

// ---------------- CATEGORIAS ----------------
export const CATEGORIAS = [
  { id: 1, nombre: 'Hamburguesas' },
  { id: 2, nombre: 'Hot Dogs' },
  { id: 3, nombre: 'Lomitos' },
  { id: 4, nombre: 'Bebidas' },
  { id: 5, nombre: 'Platos' },
]

// ---------------- PRODUCTOS (19) ----------------
export const PRODUCTOS = [
  { id: 1, nombre: 'Hamburguesa Clasica', descripcion: 'Deliciosa hamburguesa con queso', precio: 25000, categoria_id: 1, disponible: true, imagen: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300', variantes: [
    { nombre: 'Simple', precio_extra: 0 }, { nombre: 'Doble', precio_extra: 10000 }, { nombre: 'Especial', precio_extra: 20000 },
  ] },
  { id: 2, nombre: 'Hamburguesa BBQ', descripcion: 'Hamburguesa con salsa BBQ', precio: 22000, categoria_id: 1, disponible: true, imagen: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300', variantes: [
    { nombre: 'Simple', precio: 15000 }, { nombre: 'Doble', precio: 22000 },
  ] },
  { id: 3, nombre: 'Hamburguesa Vegetariana', descripcion: 'Opcion veggie con vegetales frescos', precio: 20000, categoria_id: 1, disponible: true, imagen: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300', variantes: [
    { nombre: 'Simple', precio_extra: 0 }, { nombre: 'Doble', precio_extra: 10000 },
  ] },
  { id: 4, nombre: 'Hot Dog Clasico', descripcion: 'Salchicha premium con pan suave', precio: 15000, categoria_id: 2, disponible: true, imagen: '/images/hotdog.webp', variantes: [
    { nombre: 'Simple', precio_extra: 0 }, { nombre: 'Completo', precio_extra: 10000 },
  ] },
  { id: 6, nombre: 'Lomito Simple', descripcion: 'Lomo de cerdo, lechuga y tomate', precio: 30000, categoria_id: 3, disponible: true, imagen: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300', variantes: [
    { nombre: 'Simple', precio_extra: 0 }, { nombre: 'Completo', precio_extra: 10000 }, { nombre: 'Especial', precio_extra: 18000 },
  ] },
  { id: 7, nombre: 'Lomito de Pollo', descripcion: 'Pollo a la plancha, queso y verduras', precio: 22000, categoria_id: 3, disponible: true, imagen: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300', variantes: [
    { nombre: 'Normal', precio: 22000 }, { nombre: 'Con queso', precio: 27000 },
  ] },
  { id: 8, nombre: 'Lomito de Res', descripcion: 'Res jugosa con guarnicion especial', precio: 28000, categoria_id: 3, disponible: true, imagen: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300', variantes: [
    { nombre: 'Normal', precio: 28000 }, { nombre: 'Con queso', precio: 33000 },
  ] },
  { id: 9, nombre: 'Coca Cola 500ml', descripcion: 'Bebida gaseosa 500ml', precio: 8000, categoria_id: 4, disponible: true, imagen: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300', variantes: [
    { nombre: '500ml', precio_extra: 0 }, { nombre: '1.5L', precio_extra: 7000 },
  ] },
  { id: 10, nombre: 'Pepsi 500ml', descripcion: 'Bebida gaseosa 500ml', precio: 7000, categoria_id: 4, disponible: true, imagen: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300', variantes: null },
  { id: 11, nombre: 'Agua Mineral', descripcion: 'Agua mineral 500ml', precio: 5000, categoria_id: 4, disponible: true, imagen: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300', variantes: null },
  { id: 12, nombre: 'Jugo de Naranja', descripcion: 'Jugo natural exprimido', precio: 10000, categoria_id: 4, disponible: true, imagen: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300', variantes: null },
  { id: 13, nombre: 'Plato del Dia', descripcion: 'Comida del dia con guarnicion', precio: 35000, categoria_id: 5, disponible: true, imagen: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300', variantes: [
    { nombre: 'Normal', precio: 35000 }, { nombre: 'Grande', precio: 42000 },
  ] },
  { id: 14, nombre: 'Pizza Individual', descripcion: 'Pizza mediana con variedad de sabores', precio: 32000, categoria_id: 5, disponible: true, imagen: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300', variantes: [
    { nombre: 'Mediana', precio: 32000 }, { nombre: 'Familiar', precio: 48000 },
  ] },
  { id: 15, nombre: 'Milanesa con Papas', descripcion: 'Milanesa de carne con papas fritas', precio: 26000, categoria_id: 5, disponible: true, imagen: '/images/Milanesa%20con%20papas.webp', variantes: null },
  { id: 16, nombre: 'Ensalada Cesar', descripcion: 'Ensalada con pollo y aderezo Cesar', precio: 21000, categoria_id: 5, disponible: true, imagen: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300', variantes: null },
  { id: 17, nombre: 'Fideos con Queso', descripcion: 'Pasta cremosa con queso', precio: 18000, categoria_id: 5, disponible: true, imagen: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300', variantes: null },
  { id: 18, nombre: 'Vori Vori de Gallina', descripcion: 'Guiso tradicional paraguayo', precio: 24000, categoria_id: 5, disponible: true, imagen: '/images/vori-vori.webp', variantes: null },
  { id: 19, nombre: 'Sopa Paraguaya', descripcion: 'Torta salada de choclo y queso', precio: 12000, categoria_id: 5, disponible: true, imagen: '/images/sopa%20paraguaya.webp', variantes: null },
]

// ---------------- MESAS (20) ----------------
export const MESAS = Array.from({ length: 20 }, (_, i) => {
  const numero = i + 1
  let estado = 'disponible'
  if ([1, 2, 5, 6, 8].includes(numero)) estado = 'ocupada'
  if ([3, 7].includes(numero)) estado = 'limpieza'
  return {
    id: numero,
    numero,
    nombre: `Mesa ${numero}`,
    area: i % 3 === 0 ? 'Patio' : i % 3 === 1 ? 'Terraza' : 'Principal',
    capacidad: 4,
    estado,
    tiempo_ocupado: estado === 'ocupada' ? `${15 + (numero * 3)}min` : null,
  }
})

let nextPedidoId = 100
let nextOrden = 5001

const item = (producto_id, cantidad, variante = null, nota = '') => {
  const p = PRODUCTOS.find(x => x.id === producto_id)
  const base = p.variantes && Array.isArray(p.variantes)
    ? p.precio
    : p.precio
  return {
    producto_id,
    producto: p.nombre,
    producto_nombre: p.nombre,
    cantidad,
    precio: base,
    variante,
    nota,
  }
}

const mkPedido = (mesa, itemsArr, estado = 'pendiente') => {
  nextPedidoId += 1
  nextOrden += 1
  const total = itemsArr.reduce((s, it) => s + it.precio * it.cantidad, 0)
  return {
    id: nextPedidoId,
    numero_orden: String(nextOrden),
    mesa,
    estado,
    tipo_pedido: 'venta',
    total,
    items: itemsArr,
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  }
}

// ---------------- PEDIDOS DE EJEMPLO (mesas ocupadas) ----------------
// Pedido por mesa: [mesaNumero, items]
const pedidosIniciales = [
  [1, [ item(1, 2, 'Doble'), item(9, 3, '500ml') ]],
  [2, [ item(4, 1, 'Completo') ]],
  [5, [ item(6, 1, 'Especial'), item(13, 1, 'Grande'), item(11, 2) ]],
  [6, [ item(14, 1, 'Familiar'), item(12, 2) ]],
  [8, [ item(3, 1, 'Doble'), item(10, 1) ]],
]

export const PEDIDOS_MESA_INICIAL = Object.fromEntries(
  pedidosIniciales.map(([mesa, items]) => [mesa, [mkPedido(mesa, items)]])
)

// ---------------- COCINA (pedidos iniciales) ----------------
export const COCINA_PEDIDOS_INICIAL = [
  mkPedido(1, [ item(1, 2, 'Doble'), item(9, 3, '500ml') ], 'cocinando'),
  mkPedido(2, [ item(4, 1, 'Completo') ], 'pendiente'),
]

// ---------------- DELIVERY (pedidos iniciales) ----------------
let deliveryId = 900
export const DELIVERY_PEDIDOS_INICIAL = [
  {
    id: deliveryId, numero_orden: '7001', estado: 'listo', tipo_pedido: 'delivery',
    nombre_cliente: 'Juan Perez', telefono_cliente: '0981 123 456', direccion: 'Calle Los Geranios 123',
    notas: 'Tocar el timbre', total: 72000,
    items: [ item(6, 1, 'Completo'), item(14, 1, 'Mediana'), item(11, 2) ],
    created_at: new Date(Date.now() - 1000 * 45 * 60).toISOString(),
  },
  {
    id: deliveryId + 1, numero_orden: '7002', estado: 'en_camino', tipo_pedido: 'delivery',
    nombre_cliente: 'Maria Lopez', telefono_cliente: '0961 555 789', direccion: 'Av. Fernando de la Mora 456',
    notas: '', total: 48000,
    items: [ item(1, 1, 'Especial'), item(15, 1) ],
    created_at: new Date(Date.now() - 1000 * 30 * 60).toISOString(),
  },
]

// ---------------- CAJA / SESION ----------------
export const CAJA_SESSION = {
  id: 1,
  usuario_id: 1,
  usuario: 'Admin Demo',
  fondo_inicial: 200000,
  totales: {
    fondo_inicial: 200000,
    ventas_efectivo: 845000,
    ventas_tarjeta: 320000,
    ventas_transferencia: 150000,
    total_general: 1315000,
    total_pedidos: 34,
    propinas: 125000,
    efectivo_esperado: 1045000,
  },
  created_at: new Date().toISOString(),
}

export const CAJA_MOVIMIENTOS = [
  { id: 1, tipo: 'ingreso_extra', monto: 50000, motivo: 'Fiado cobrado', created_at: new Date().toISOString() },
  { id: 2, tipo: 'retiro', monto: 200000, motivo: 'Compra de insumos', created_at: new Date().toISOString() },
]

export const PEDIDOS_PAGADOS = [
  {
    id: 1, created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(), numero_orden: '5000',
    cliente_nombre: 'Consumidor Final', cliente_ruc: '44444444-7', total: 32000, propina: 3000,
    metodo_pago: 'efectivo', mesa: 11, items: [ item(1, 1, 'Doble'), item(9, 1, '500ml') ],
    factura: { numero: '001-001-0000100' },
  },
  {
    id: 2, created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), numero_orden: '4999',
    cliente_nombre: 'Roberto Insfran', cliente_ruc: '12345678-9', total: 48000, propina: 0,
    metodo_pago: 'tarjeta', mesa: 4, items: [ item(6, 1, 'Especial') ],
    factura: { numero: '001-001-0000099' },
  },
]

// ---------------- INFORMES ----------------
export const RESUMEN_INFORME = {
  ventas_totales: 1315000,
  total_pedidos: 34,
  ticket_promedio: 38676,
  tasa_cancelacion: 4.2,
  cancelados_en_cocina: 3,
  pedidos_por_estado: { pagado: 28, pendiente: 2, listo: 2, cancelado: 2 },
  motivos_cancelacion: [
    { motivo_cancelacion: 'Cliente ya no quiso', cantidad: 2 },
    { motivo_cancelacion: 'Error del mozo', cantidad: 1 },
  ],
}

export const VENTAS_POR_DIA = [
  { fecha: '2026-08-23', ventas: 980000 },
  { fecha: '2026-08-24', ventas: 1140000 },
  { fecha: '2026-08-25', ventas: 870000 },
  { fecha: '2026-08-26', ventas: 1320000 },
  { fecha: '2026-08-27', ventas: 1090000 },
  { fecha: '2026-08-28', ventas: 1250000 },
  { fecha: '2026-08-29', ventas: 1315000 },
]

export const PRODUCTOS_ESTADISTICAS = {
  productos: [
    { nombre: 'Hamburguesa Clasica', ventas: 52 },
    { nombre: 'Hamburguesa BBQ', ventas: 41 },
    { nombre: 'Lomito Simple', ventas: 38 },
    { nombre: 'Hot Dog Clasico', ventas: 35 },
    { nombre: 'Lomito de Res', ventas: 29 },
    { nombre: 'Coca Cola 500ml', ventas: 61 },
    { nombre: 'Lomito de Pollo', ventas: 22 },
    { nombre: 'Milanesa con Papas', ventas: 15 },
  ],
}

export const METODOS_PAGO_INFORME = { efectivo: 845000, transferencia: 150000, tarjeta: 320000 }

export const PEDIDOS_LISTA_INFORME = PEDIDOS_PAGADOS.map(p => ({
  id: p.id,
  numero_orden: p.numero_orden,
  created_at: p.created_at,
  delivery: false,
  mesa: p.mesa,
  estado: 'pagado',
  metodo_pago: p.metodo_pago,
  total: p.total,
}))

// ---------------- INVENTARIO ----------------
export const INVENTARIO_LISTA = PRODUCTOS.slice(0, 20).map((p, i) => ({
  id: i + 1,
  producto_id: p.id,
  producto_nombre: p.nombre,
  categoria: CATEGORIAS.find(c => c.id === p.categoria_id)?.nombre || '-',
  stock_actual: i % 4 === 0 ? 3 : i % 5 === 0 ? 30 : 45 - i,
  unidad_medida: 'und',
  stock_minimo: 5,
  precio_costo: Math.round(p.precio * 0.6),
  estado_stock: i % 4 === 0 ? 'bajo' : 'normal',
}))

export const INVENTARIO_RESUMEN = {
  total_productos: 18,
  normal: 14,
  bajo: 4,
  agotado: 0,
}

export const INVENTARIO_ALERTAS = INVENTARIO_LISTA.filter(x => x.estado_stock === 'bajo')
