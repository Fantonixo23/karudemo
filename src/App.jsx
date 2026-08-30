import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Inicio from './pages/Inicio'
import NuevaVenta from './pages/NuevaVenta'
import Cocina from './pages/Cocina'
import Caja from './pages/Caja'
import Delivery from './pages/Delivery'
import Informes from './pages/Informes'
import Productos from './pages/Productos'
import { FullscreenProvider } from './hooks/useFullscreen.jsx'
import { useMediaQuery } from './hooks/useMediaQuery'
import { useStore } from './store/useStore'
import { moduleAllowed } from './constants'
import PlanGate from './components/PlanGate'

function RutaProtegida({ modulo, children }) {
  const plan = useStore((state) => state.plan)
  if (moduleAllowed(plan, modulo)) return children
  return <Navigate to="/app/inicio" replace />
}

export default function App() {
  useMediaQuery()

  return (
    <FullscreenProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app/inicio" element={<Inicio />} />
        <Route path="/app/mesas" element={<RutaProtegida modulo="mesas"><NuevaVenta /></RutaProtegida>} />
        <Route path="/app/cocina" element={<RutaProtegida modulo="cocina"><Cocina /></RutaProtegida>} />
        <Route path="/app/caja" element={<RutaProtegida modulo="caja"><Caja /></RutaProtegida>} />
        <Route path="/app/delivery" element={<RutaProtegida modulo="delivery"><Delivery /></RutaProtegida>} />
        <Route path="/app/informes" element={<RutaProtegida modulo="informes"><Informes /></RutaProtegida>} />
        <Route path="/app/productos" element={<RutaProtegida modulo="productos"><Productos /></RutaProtegida>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <PlanGate />
    </FullscreenProvider>
  )
}
