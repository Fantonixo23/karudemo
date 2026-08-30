import { create } from 'zustand'
import { demoState, resetOperativo } from './mockApi'

// ---------------------------------------------------------------
// Guia interactiva de la demo karuAPP
// Estado global: activo (aceptada/no), paso actual, pasos completados
// Se sincroniza con el estado mock + el DOM para marcar cada accion.
// ---------------------------------------------------------------

const $ = (sel) => (typeof document !== 'undefined' ? document.querySelector(sel) : null)

// `done(state, doc)`: devuelve true cuando el paso ya se realizo.
export const GUIDE_STEPS = [
  {
    step: 1,
    titulo: 'Ocupar una mesa',
    ruta: '/app/mesas',
    target: '[data-guide="mesa"][data-guide-ocupada="disponible"], [data-guide="mesa"][data-guide-ocupada="libre"]',
    label: 'Toca la mesa en verde',
    instructivo: 'Hace clic sobre una mesa que este en verde (disponible). Se abrira el cuadro para ocuparla.',
    done: () => !!$( '[data-guide="ocupar-confirmar"]' ),
  },
  {
    step: 2,
    titulo: 'Confirmar la ocupacion',
    ruta: '/app/mesas',
    target: '[data-guide="ocupar-confirmar"]',
    label: 'Toca "Ocupar Mesa"',
    instructivo:
      'Se abrio el cuadro de la mesa. Toca el boton "Ocupar Mesa" para confirmar y dejar la mesa ocupada.',
    done: (s) => !$( '[data-guide="ocupar-confirmar"]' ) && (s.mesas || []).some((m) => m.estado === 'ocupada'),
  },
  {
    step: 3,
    titulo: 'Nuevo pedido',
    ruta: '/app/mesas',
    target: '[data-guide="nuevo-pedido"]',
    label: 'Toca "Nuevo Pedido"',
    instructivo:
      'Con la mesa seleccionada, toca el boton "Nuevo Pedido" para empezar a cargar productos.',
    done: () => !!$( '[data-guide="tp-producto"]' ),
  },
  {
    step: 4,
    titulo: 'Elegir un producto',
    ruta: '/app/mesas',
    target: '[data-guide="tp-producto"]',
    label: 'Toca un producto',
    instructivo:
      'Toca cualquier producto de la grilla. Se abrira con su detalle para agregarlo al pedido.',
    done: () => !!$( '[data-guide="tp-agregar"]' ),
  },
  {
    step: 5,
    titulo: 'Agregar al carrito',
    ruta: '/app/mesas',
    target: '[data-guide="tp-agregar"]',
    label: 'Toca "Agregar al Carrito"',
    instructivo:
      'En el detalle del producto toca "Agregar al Carrito — (precio)" para sumarlo al pedido.',
    done: () => !!$( '[data-guide="tp-producto"]' ) && !$( '[data-guide="tp-agregar"]' ),
  },
  {
    step: 6,
    titulo: 'Abrir el carrito',
    ruta: '/app/mesas',
    target: '[data-guide="tp-carrito"]',
    label: 'Toca el boton 🛒',
    instructivo:
      'El producto ya esta en el carrito. Toca el boton naranja del carrito (🛒) para ver el total y el detalle.',
    done: () => !!$( '[data-guide="tp-producto"]' ) && !$( '[data-guide="tp-carrito"]' ),
  },
  {
    step: 7,
    titulo: 'Enviar a Cocina',
    ruta: '/app/mesas',
    target: '[data-guide="tp-enviar"]',
    label: 'Toca "Enviar a Cocina"',
    instructivo:
      'El carrito abierto muestra el total. Toca "📨 Enviar a Cocina" para mandar el pedido.',
    done: () => !!$( '[data-guide="tp-confirmar"]' ),
  },
  {
    step: 8,
    titulo: 'Confirmar el envio',
    ruta: '/app/mesas',
    target: '[data-guide="tp-confirmar"]',
    label: 'Toca "Confirmar"',
    instructivo:
      'Confirma que queres enviar el pedido a cocina tocando el boton verde "Confirmar".',
    done: () => !!$( '[data-guide="tp-exito"]' ),
  },
  {
    step: 9,
    titulo: 'Pedido enviado',
    ruta: '/app/mesas',
    target: '[data-guide="tp-exito"]',
    label: 'Toca "Aceptar"',
    instructivo:
      'El pedido se envio a cocina con exito. Toca el boton blanco "Aceptar" para continuar.',
    done: () => !$( '[data-guide="tp-exito"]' ),
  },
  {
    step: 10,
    titulo: 'Ir a Cocina',
    ruta: '/app/cocina',
    target: '[data-guide="cocina-pedido"]',
    label: 'Anda a la pantalla Cocina',
    instructivo:
      'El pedido se creo correctamente. Anda a la seccion Cocina para verlo y prepararlo.',
    done: () => !!$( '[data-guide="cocina-pedido"]' ),
  },
  {
    step: 11,
    titulo: 'Tocar el pedido',
    ruta: '/app/cocina',
    target: '[data-guide="cocina-pedido"]',
    label: 'Toca tu pedido',
    instructivo:
      'Toca la tarjeta de tu pedido para abrir el panel y cambiar su estado.',
    done: () => !!$( '[data-guide="cocina-preparando"]' ),
  },
  {
    step: 12,
    titulo: 'Pasar a Preparando',
    ruta: '/app/cocina',
    target: '[data-guide="cocina-preparando"]',
    label: 'Toca "Preparando"',
    instructivo:
      'Con el pedido abierto, toca "👨‍🍳 Preparando" para indicar que se esta cocinando.',
    done: (s) => (s.cocina || []).some((p) => p.estado === 'cocinando'),
  },
  {
    step: 13,
    titulo: 'Marcar como Listo',
    ruta: '/app/cocina',
    target: '[data-guide="cocina-listo"]',
    label: 'Toca "Listo!"',
    instructivo:
      'Cuando este listo, toca "✅ Listo!" y confirma para avisar que se puede entregar.',
    done: (s) => (s.cocina || []).some((p) => p.estado === 'listo'),
  },
  {
    step: 14,
    titulo: 'Entregar el pedido',
    ruta: '/app/mesas',
    target: '[data-guide="entregar"]',
    label: 'Toca "Entregar"',
    instructivo:
      'Volve a Mesas, abri la mesa ocupada y toca "Entregar" en el pedido que ya esta listo.',
    done: () =>
      Object.values(demoState.getState().pedidosMesa).some((l) =>
        (l || []).some((p) => ['entregado', 'pagado'].includes(p.estado))
      ),
  },
  {
    step: 15,
    titulo: 'Cobrar la venta',
    ruta: '/app/caja',
    target: '[data-guide="caja-mesa"][data-guide-cobrar="1"]',
    label: 'Toca la mesa ocupada',
    instructivo:
      'Anda a Caja, busca la mesa ocupada (roja) y toca para cobrar. Elegi metodo de pago, propina y confirma el cobro.',
    done: (s) => (s.pagados || []).some((p) => p.mesa && p.mesa !== 'Delivery'),
  },
  {
    step: 16,
    titulo: 'Cerrar caja',
    ruta: '/app/caja',
    target: '[data-guide="cerrar-caja"]',
    label: 'Toca "Cerrar Caja"',
    instructivo:
      'Para completar la venta, toca "Cerrar Caja" y confirma el arqueo. !Venta completada!',
    done: () => JSON.parse(localStorage.getItem('demo_cierre') || 'false') === true,
  },
]

const initial = {
  active: false,
  acceptedOnce: false,
  current: 1,
  completed: [],
  dismissed: false,
}

export const useGuide = create((set, get) => ({
  ...initial,

  start: () => {
    resetOperativo()
    return set({ active: true, acceptedOnce: true, current: 1, completed: [], dismissed: false })
  },
  cancel: () => set({ active: false, dismissed: false }),
  dismiss: () => set({ active: false, dismissed: true, acceptedOnce: true }),

  goTo: (step) => set({ current: Math.min(GUIDE_STEPS.length, Math.max(1, step)) }),

  markComplete: (step) =>
    set((s) => ({
      completed: s.completed.includes(step) ? s.completed : [...s.completed, step],
      current: Math.min(GUIDE_STEPS.length, Math.max(s.current, step + 1)),
    })),

  // Recalcular pasos completados segun estado de la demo + DOM
  refresh: () => {
    const state = demoState.getState()
    const doc = typeof document !== 'undefined' ? document : null
    const completed = GUIDE_STEPS.filter((g) => g.done(state, doc)).map((g) => g.step)
    set({ completed })
  },

  reset: () => set({ ...initial }),
}))

demoState.subscribe((state) => {
  if (useGuide.getState().active) {
    useGuide.getState().refresh()
  }
})
