import { create } from 'zustand'

// karuAPP DEMO: sockets desactivados (no hay backend).
// Las paginas usan su polling periodico como respaldo.

export const useSocketStore = create(() => ({
  connected: false,
  lastUpdate: null,
  mesaUpdates: [],
  pedidoUpdates: [],
  cocinaNotifications: [],

  initSocket: () => {},
  reconnect: () => {},
  handleMessage: () => {},
  disconnectSocket: () => {},
  clearNotifications: () => {},
}))

export const useRealTime = () => {
  const store = useSocketStore()
  return {
    initSocket: store.initSocket,
    disconnectSocket: store.disconnectSocket,
    lastUpdate: store.lastUpdate,
    cocinaNotifications: store.cocinaNotifications,
    mesaUpdates: store.mesaUpdates,
    connected: store.connected,
    clearNotifications: store.clearNotifications,
  }
}
