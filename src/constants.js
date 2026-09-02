export const ALL_AREAS = [
  { path: '/app/mesas', icon: 'table_restaurant', label: 'Mesas', desc: 'Gestionar mesas', modulo: 'mesas' },
  { path: '/app/cocina', icon: 'restaurant', label: 'Cocina', desc: 'Pedidos en cocina', modulo: 'cocina' },
  { path: '/app/caja', icon: 'point_of_sale', label: 'Caja', desc: 'Cobros y facturas', modulo: 'caja' },
  { path: '/app/delivery', icon: 'delivery_dining', label: 'Delivery', desc: 'Pedidos a domicilio', modulo: 'delivery' },
  { path: '/app/informes', icon: 'analytics', label: 'Informes', desc: 'Reportes y ventas', modulo: 'informes' },
  { path: '/app/productos', icon: 'inventory_2', label: 'Productos', desc: 'Catalogo y stock', modulo: 'productos' },
  { path: '/app/menu', icon: 'restaurant_menu', label: 'Carta', desc: 'Menu digital', modulo: 'carta' },
  { path: '/app/reservas', icon: 'event', label: 'Reservas', desc: 'Gestionar reservas', modulo: 'reservas' },
  { path: '/app/inventario', icon: 'warehouse', label: 'Inventario', desc: 'Control de stock', modulo: 'inventario' },
]

export const ROL_INFO = {
  administrador: { label: 'Administrador', color: '#F44336' },
  cajero: { label: 'Cajero', color: '#1976D2' },
  mesero: { label: 'Mesero', color: '#4CAF50' },
  cocina: { label: 'Cocina', color: '#FF9800' },
}

export const MOBILE_HIDDEN_MODULES = ['caja', 'informes', 'configuracion']

export const PLAN_MODULES = {
  basico: {
    label: 'Basico',
    precio: 'desde 180.000 Gs/mes',
    allowed: ['inicio', 'mesas', 'cocina', 'caja', 'productos'],
  },
  estandar: {
    label: 'Estandar',
    precio: 'desde 280.000 Gs/mes',
    allowed: ['inicio', 'mesas', 'cocina', 'caja', 'delivery', 'productos', 'inventario', 'configuracion'],
  },
  enterprise: {
    label: 'Enterprise',
    precio: 'desde 420.000 Gs/mes',
    allowed: ['inicio', 'mesas', 'cocina', 'caja', 'delivery', 'productos', 'informes', 'configuracion', 'carta', 'reservas'],
  },
}

export const moduleAllowed = (plan, modulo) => {
  const def = PLAN_MODULES[plan]
  return !!def && def.allowed.includes(modulo)
}
