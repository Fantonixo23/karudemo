import { create } from 'zustand'
import {
  PRODUCTOS, CATEGORIAS, MESAS, EMPRESA, METODOS_PAGO,
  PEDIDOS_MESA_INICIAL, COCINA_PEDIDOS_INICIAL, DELIVERY_PEDIDOS_INICIAL,
  CAJA_SESSION, CAJA_MOVIMIENTOS, PEDIDOS_PAGADOS,
  RESUMEN_INFORME, VENTAS_POR_DIA, PRODUCTOS_ESTADISTICAS,
  METODOS_PAGO_INFORME, PEDIDOS_LISTA_INFORME,
  INVENTARIO_LISTA, INVENTARIO_RESUMEN, INVENTARIO_ALERTAS,
} from './mockData'

// --------------------------------------------------------------------
// Estado mutable de la demo (en memoria). Al recargar se resetea.
// --------------------------------------------------------------------
export const demoState = create(() => ({
  mesas: MESAS.map(m => ({ ...m })),
  pedidosMesa: Object.fromEntries(
    Object.entries(PEDIDOS_MESA_INICIAL).map(([k, v]) => [k, v.map(p => ({ ...p, items: p.items.map(i => ({ ...i })) }))])
  ),
  cocina: COCINA_PEDIDOS_INICIAL.map(p => ({ ...p, items: p.items.map(i => ({ ...i })) })),
  delivery: DELIVERY_PEDIDOS_INICIAL.map(p => ({ ...p, items: p.items.map(i => ({ ...i })) })),
  session: JSON.parse(JSON.stringify(CAJA_SESSION)),
  movimientos: CAJA_MOVIMIENTOS.map(m => ({ ...m })),
  pagados: PEDIDOS_PAGADOS.map(p => ({ ...p })),
  nextPedidoId: 500,
  nextOrden: 7100,
}))

export const demoActions = {
  setMesas: (mesas) => demoState.setState({ mesas }),
  setPedidosMesa: (pedidosMesa, mesaId, pedido) => {
    const current = demoState.getState().pedidosMesa
    const list = current[mesaId] || []
    const idx = list.findIndex(p => p.id === pedido.id)
    if (idx >= 0) list[idx] = pedido
    else list.push(pedido)
    demoState.setState({ pedidosMesa: { ...current, [mesaId]: list } })
  },
  setCocina: (cocina) => demoState.setState({ cocina }),
  setDelivery: (delivery) => demoState.setState({ delivery }),
  setSession: (session) => demoState.setState({ session }),
  pushMovimiento: (mov) => demoState.setState(s => ({ movimientos: [mov, ...s.movimientos] })),
  pushPagado: (p) => demoState.setState(s => ({ pagados: [p, ...s.pagados] })),
  markPagado: (mesaId, pedido) => {
    const s = demoState.getState()
    const list = (s.pedidosMesa[mesaId] || []).map(p => p.id === pedido.id ? { ...p, estado: 'pagado' } : p)
    demoState.setState({ pedidosMesa: { ...s.pedidosMesa, [mesaId]: list } })
    demoState.setState({ cocina: s.cocina.filter(p => p.id !== pedido.id) })
  },
}

// Resetea el estado operativo a una base limpia para arrancar la guia desde el paso 1.
export function resetOperativo() {
  demoState.setState({
    mesas: MESAS.map(m => ({ ...m, estado: 'disponible', tiempo_ocupado: '0min' })),
    pedidosMesa: {},
    cocina: [],
    delivery: [],
    movimientos: [],
    pagados: [],
    session: JSON.parse(JSON.stringify(CAJA_SESSION)),
    nextPedidoId: 500,
    nextOrden: 7100,
  })
}

// --------------------------------------------------------------------
// Helpers para construir respuestas `Response`-like
// --------------------------------------------------------------------
function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const notFound = () => jsonResponse({ success: false, error: 'No encontrado (demo)' }, 404)

// --------------------------------------------------------------------
// Resolucion de las rutas mock
// --------------------------------------------------------------------
export function handleMockRequest(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const u = new URL(url, window.location.origin)
  const path = u.pathname
  const S = () => demoState.getState()
  const A = demoActions

  // ==================== MESA ====================
  if (method === 'GET' && path === '/mesas') {
    return jsonResponse({ success: true, mesas: S().mesas })
  }
  if (method === 'POST' && /^\/mesas\/\d+\/estado$/.test(path)) {
    const id = parseInt(path.split('/')[2])
    const body = JSON.parse(options.body || '{}')
    A.setMesas(S().mesas.map(m => m.id === id ? { ...m, estado: body.estado || m.estado, tiempo_ocupado: body.estado === 'ocupada' ? '0min' : m.tiempo_ocupado } : m))
    return jsonResponse({ success: true })
  }

  // ==================== PRODUCTOS / CATEGORIAS ====================
  if (method === 'GET' && path === '/productos') return jsonResponse({ success: true, productos: PRODUCTOS })
  if (method === 'GET' && path === '/categorias') return jsonResponse({ success: true, categorias: CATEGORIAS })

  // ==================== PEDIDOS (crear / mesa / estado / delivery) ====================
  if (method === 'POST' && path === '/pedidos/crear') {
    const body = JSON.parse(options.body || '{}')
    const mesaId = body.mesa_id
    const total = body.total || (body.items || []).reduce((s, i) => s + i.precio * i.cantidad, 0)
    const now = demoState.getState()
    const pedido = {
      id: now.nextPedidoId, numero_orden: String(now.nextOrden), mesa: mesaId,
      estado: 'pendiente', tipo_pedido: body.delivery ? 'delivery' : body.tipo_pedido || 'venta',
      nombre_cliente: body.nombre_cliente, telefono_cliente: body.telefono_cliente,
      direccion: body.direccion, notas: body.notas,
      total, items: body.items || [], delivery: !!body.delivery,
      created_at: new Date().toISOString(),
    }
    demoState.setState(s => ({ nextPedidoId: s.nextPedidoId + 1, nextOrden: s.nextOrden + 1 }))
    if (body.delivery) A.setDelivery([...S().delivery, pedido])
    else if (mesaId) A.setPedidosMesa(S().pedidosMesa, mesaId, pedido)
    A.setCocina([...S().cocina, pedido])
    return jsonResponse({ success: true, pedido })
  }
  if (method === 'GET' && /^\/pedidos\/mesa\/\d+$/.test(path)) {
    const mesaId = parseInt(path.split('/')[3])
    return jsonResponse({ success: true, pedidos: S().pedidosMesa[mesaId] || [] })
  }
  if (method === 'GET' && path === '/pedidos' && u.searchParams.get('delivery') === 'true') {
    return jsonResponse({ success: true, pedidos: S().delivery })
  }
  if (method === 'POST' && /^\/pedidos\/\d+\/estado$/.test(path)) {
    const id = parseInt(path.split('/')[2])
    const body = JSON.parse(options.body || '{}')
    const nuevoEstado = body.estado
    A.setDelivery(S().delivery.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p))
    A.setCocina(S().cocina.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p))
    // tambien actualizar en mesas
    const byMesa = {}
    Object.keys(S().pedidosMesa).forEach(mk => {
      byMesa[mk] = (S().pedidosMesa[mk] || []).map(p => p.id === id ? { ...p, estado: nuevoEstado } : p)
    })
    demoState.setState({ pedidosMesa: byMesa })
    return jsonResponse({ success: true })
  }
  if (method === 'PUT' && /^\/pedidos\/\d+\/items\/reemplazar$/.test(path)) {
    const id = parseInt(path.split('/')[2])
    const body = JSON.parse(options.body || '{}')
    const nuevosItems = body.items || []
    const total = nuevosItems.reduce((s, i) => s + i.precio * i.cantidad, 0)
    const update = (list) => list.map(p => p.id === id ? { ...p, items: nuevosItems, total } : p)
    A.setDelivery(S().delivery.map(p => p.id === id ? { ...p, items: nuevosItems, total, nombre_cliente: body.nombre_cliente || p.nombre_cliente, telefono_cliente: body.telefono_cliente || p.telefono_cliente, direccion: body.direccion || p.direccion, notas: body.notas || p.notas } : p))
    A.setCocina(S().cocina.map(p => p.id === id ? { ...p, items: nuevosItems, total } : p))
    return jsonResponse({ success: true })
  }
  if (method === 'POST' && /^\/pedidos\/\d+\/cancelar$/.test(path)) {
    const id = parseInt(path.split('/')[2])
    const body = JSON.parse(options.body || '{}')
    A.setDelivery(S().delivery.map(p => p.id === id ? { ...p, estado: 'cancelado' } : p).filter(p => p.id !== id || true))
    A.setCocina(S().cocina.filter(p => p.id !== id))
    const byMesa = {}
    Object.keys(S().pedidosMesa).forEach(mk => {
      byMesa[mk] = (S().pedidosMesa[mk] || []).filter(p => p.id !== id)
    })
    demoState.setState({ pedidosMesa: byMesa })
    return jsonResponse({ success: true })
  }

  // ==================== COCINA ====================
  if (method === 'GET' && path === '/cocina/pedidos/') {
    return jsonResponse({ success: true, pedidos: S().cocina })
  }
  if (method === 'POST' && /^\/cocina\/pedidos\/\d+\/estado\/$/.test(path)) {
    const id = parseInt(path.split('/')[3])
    const body = JSON.parse(options.body || '{}')
    A.setCocina(S().cocina.map(p => p.id === id ? { ...p, estado: body.estado } : p))
    return jsonResponse({ success: true })
  }

  // ==================== DELIVERY ====================
  if (method === 'GET' && path === '/pedidos/delivery/dashboard') {
    const list = S().delivery
    return jsonResponse({
      success: true,
      data: {
        pendientes: list.filter(p => p.estado === 'pendiente').length,
        preparando: list.filter(p => ['cocinando', 'en_camino'].includes(p.estado)).length,
        listos: list.filter(p => p.estado === 'listo').length,
        en_camino: list.filter(p => p.estado === 'en_camino').length,
        entregados: list.filter(p => ['entregado', 'pagado'].includes(p.estado)).length,
        total_hoy: 480000,
      },
    })
  }

  // ==================== CAJA ====================
  if (method === 'GET' && path === '/caja/sesion-actual') {
    return jsonResponse({ success: true, session: S().session })
  }
  if (method === 'POST' && path === '/caja/apertura') {
    const body = JSON.parse(options.body || '{}')
    const session = {
      ...S().session,
      fondo_inicial: body.fondo_inicial || S().session.fondo_inicial,
      totales: { ...S().session.totales, fondo_inicial: body.fondo_inicial || S().session.fondo_inicial },
    }
    A.setSession(session)
    return jsonResponse({ success: true, session })
  }
  if (method === 'GET' && path === '/caja/movimientos') {
    return jsonResponse({ success: true, movimientos: S().movimientos })
  }
  if (method === 'POST' && path === '/caja/movimiento') {
    const body = JSON.parse(options.body || '{}')
    const totales = { ...S().session.totales }
    const monto = body.monto || 0
    if (body.tipo === 'ingreso_extra') {
      totales.total_general = (totales.total_general || 0) + monto
      totales.efectivo_esperado = (totales.efectivo_esperado || 0) + monto
    } else if (body.tipo === 'retiro') {
      totales.efectivo_esperado = Math.max(0, (totales.efectivo_esperado || 0) - monto)
    }
    A.setSession({ ...S().session, totales })
    A.pushMovimiento({ id: Date.now(), tipo: body.tipo, monto, motivo: body.motivo, created_at: new Date().toISOString() })
    return jsonResponse({ success: true })
  }
  if (method === 'POST' && /^\/pedidos\/mesa\/\d+\/cobrar$/.test(path)) {
    const mesaId = parseInt(path.split('/')[3])
    const body = JSON.parse(options.body || '{}')
    const pedidos = S().pedidosMesa[mesaId] || []
    const total = pedidos.reduce((s, p) => s + (p.total || 0), 0)
    const propina = body.propina || 0
    const totalConPropina = total + propina
    const totales = { ...S().session.totales }
    totales.total_pedidos = (totales.total_pedidos || 0) + 1
    totales.total_general = (totales.total_general || 0) + totalConPropina
    totales.propinas = (totales.propinas || 0) + propina
    if (body.metodo_pago === 'efectivo' || body.metodo_pago === 'mixto') totales.ventas_efectivo = (totales.ventas_efectivo || 0) + total
    if (body.metodo_pago === 'tarjeta') totales.ventas_tarjeta = (totales.ventas_tarjeta || 0) + total
    if (body.metodo_pago === 'transferencia') totales.ventas_transferencia = (totales.ventas_transferencia || 0) + total
    totales.efectivo_esperado = (totales.efectivo_esperado || 0) + (totalConPropina)
    A.setSession({ ...S().session, totales })

    const detalle_pagos = body.pagos && body.pagos.length
      ? body.pagos.map(x => ({ metodo: x.metodo, moneda: 'PYG', monto_pyg: x.monto }))
      : [{ metodo: body.metodo_pago, moneda: 'PYG', monto_pyg: totalConPropina }]

    // marcar pedidos como pagados y liberar mesa
    A.markPagado(mesaId, { id: -1 })
    const byMesa = {}
    Object.keys(S().pedidosMesa).forEach(mk => {
      byMesa[mk] = mk === String(mesaId) ? [] : S().pedidosMesa[mk]
    })
    demoState.setState({ pedidosMesa: byMesa })
    A.setMesas(S().mesas.map(m => m.id === mesaId ? { ...m, estado: 'disponible', tiempo_ocupado: null } : m))

    const cobro = {
      numero_factura: '100' + (S().pagados.length + 1),
      vuelto: body.monto_recibido > totalConPropina ? body.monto_recibido - totalConPropina : 0,
      monto_recibido: body.monto_recibido || 0,
      total_con_propina: totalConPropina,
      pedidos: pedidos.map(p => ({ ...p, items: p.items.map(i => ({ ...i })) })),
      cobrados: pedidos.map(p => p.id),
      detalle_pagos,
      factura: body.generar_factura ? { cdc: 'DEMO-00000123', kude: 'KUDE-DEMO-123', qr_base64: '', numero: '100' + (S().pagados.length + 1) } : null,
      sifen_error: body.generar_factura ? 'Modo demo: factura electronica simulada (SIFEN no conectado)' : null,
    }
    A.pushPagado({
      id: Date.now(), created_at: new Date().toISOString(), numero_orden: String(S().nextOrden),
      cliente_nombre: body.cliente_nombre || 'Consumidor Final', cliente_ruc: body.cliente_ruc || '44444444-7',
      total: totalConPropina, propina, metodo_pago: body.metodo_pago, mesa: mesaId,
      items: pedidos.flatMap(p => p.items || []),
      factura: { numero: cobro.numero_factura },
    })
    return jsonResponse({ success: true, ...cobro })
  }
  if (method === 'POST' && /^\/pedidos\/\d+\/pagar$/.test(path)) {
    const id = parseInt(path.split('/')[2])
    const body = JSON.parse(options.body || '{}')
    const pedido = S().delivery.find(p => p.id === id)
    const total = pedido?.total || 0
    const propina = body.propina || 0
    const totalConPropina = total + propina
    const totales = { ...S().session.totales }
    totales.total_pedidos = (totales.total_pedidos || 0) + 1
    totales.total_general = (totales.total_general || 0) + totalConPropina
    totales.propinas = (totales.propinas || 0) + propina
    if (body.metodo_pago === 'efectivo') totales.ventas_efectivo = (totales.ventas_efectivo || 0) + total
    if (body.metodo_pago === 'tarjeta') totales.ventas_tarjeta = (totales.ventas_tarjeta || 0) + total
    if (body.metodo_pago === 'transferencia') totales.ventas_transferencia = (totales.ventas_transferencia || 0) + total
    A.setSession({ ...S().session, totales })
    A.setDelivery(S().delivery.map(p => p.id === id ? { ...p, estado: 'pagado' } : p))
    return jsonResponse({
      success: true,
      vuelto: 0, monto_recibido: body.monto_recibido || 0, total_con_propina: totalConPropina,
      pedidos: [pedido], cobrados: [id],
      detalle_pagos: [{ metodo: body.metodo_pago, moneda: 'PYG', monto_pyg: totalConPropina }],
      factura: null, sifen_error: null, numero_factura: '9001',
    })
  }
  if (method === 'POST' && path === '/caja/cierre') {
    try { localStorage.setItem('demo_cierre', 'true') } catch (e) {}
    const t = S().session.totales
    return jsonResponse({
      success: true,
      corte: {
        created_at: new Date().toISOString(),
        fondo_inicial: t.fondo_inicial,
        total_ventas_efectivo: t.ventas_efectivo,
        total_ventas_tarjeta: t.ventas_tarjeta,
        total_ventas_transferencia: t.ventas_transferencia,
        total_ventas: t.total_general,
        total_ingresos_extra: 50000,
        total_retiros: 200000,
        total_propinas: t.propinas,
        total_esperado: t.efectivo_esperado,
        total_contado_efectivo: t.efectivo_esperado,
        tipo_diferencia: 'OK',
        diferencia: 0,
        observaciones: 'Cierre de caja modeo demo',
      },
    })
  }

  // ==================== FACTURACION ====================
  if (method === 'GET' && path === '/facturacion/config') return jsonResponse({ success: true, config: EMPRESA })
  if (method === 'GET' && path === '/facturacion/metodos-pago') return jsonResponse({ success: true, metodos: METODOS_PAGO })
  if (method === 'GET' && path === '/facturacion/buscar-ruc') {
    const q = u.searchParams.get('q') || ''
    const dummy = [
      { nombre: 'Supermercado El Sol S.A.', ruc: '80012345-6' },
      { nombre: 'Panaderia La Estrella', ruc: '80098765-4' },
      { nombre: 'Ferreteria Central', ruc: '80123456-1' },
    ].filter(r => r.ruc.includes(q) || r.nombre.toLowerCase().includes(q.toLowerCase()))
    return jsonResponse({ success: true, resultados: q.length >= 3 ? dummy : [] })
  }

  // ==================== SIFEN ====================
  if (method === 'GET' && path === '/sifen/status') {
    return jsonResponse({ success: true, sifen_habilitado: false, certificado_configurado: false, csc_configurado: false })
  }

  // ==================== INFORMES ====================
  if (method === 'GET' && path === '/informes/resumen-completo') {
    return jsonResponse({ success: true, data: { ...RESUMEN_INFORME } })
  }
  if (method === 'GET' && path === '/informes/ventas-por-dia') {
    return jsonResponse({ success: true, data: VENTAS_POR_DIA })
  }
  if (method === 'GET' && path === '/informes/productos-estadisticas') {
    return jsonResponse({ success: true, data: { productos: PRODUCTOS_ESTADISTICAS.productos.slice(0, 10) } })
  }
  if (method === 'GET' && path === '/informes/metodos-pago') {
    return jsonResponse({ success: true, data: METODOS_PAGO_INFORME })
  }
  if (method === 'GET' && path === '/informes/pedidos-lista') {
    return jsonResponse({ success: true, data: { pedidos: PEDIDOS_LISTA_INFORME } })
  }
  if (method === 'GET' && path === '/caja/pedidos-pagados') {
    return jsonResponse({ success: true, pedidos: S().pagados, total: S().pagados.length })
  }

  // ==================== INVENTARIO ====================
  if (method === 'GET' && path === '/inventario/') return jsonResponse({ success: true, data: INVENTARIO_LISTA })
  if (method === 'GET' && path === '/inventario/resumen') return jsonResponse({ success: true, data: INVENTARIO_RESUMEN })
  if (method === 'GET' && path === '/inventario/alertas') return jsonResponse({ success: true, data: INVENTARIO_ALERTAS })
  if (method === 'GET' && path === '/inventario') return jsonResponse({ success: true, data: INVENTARIO_LISTA })

  // licencia (demo: siempre activa)
  if (method === 'GET' && path === '/verificar-licencia') {
    return jsonResponse({ success: true, estado: 'activa', dias_restantes: 999, mensaje: '', nombre: 'Demo' })
  }

  // ==================== ACCESO DESDE CELULAR (QR) ====================
  // TODO: reemplazar DEMO_PUBLIC_URL con la URL real de Vercel cuando la tengas
  if (method === 'GET' && path === '/qr-conexion') {
    const demoUrl = 'https://tu-app.vercel.app'
    return jsonResponse({
      success: true,
      qr_base64: '',
      url_principal: demoUrl,
      hostname: 'demo',
      ips: [demoUrl],
    })
  }

  // ==================== INICIO: ventas de hoy ====================
  if (method === 'GET' && path === '/informes/ventas-hoy') {
    return jsonResponse({ success: true, data: { monto_total: 1315000, total_ordenes: 34 } })
  }

  // ==================== DEFAULT ====================
  // Si es una mutacion desconocida, devolver success neutral para no romper la demo
  if (method !== 'GET') {
    return jsonResponse({ success: true })
  }
  return notFound()
}
