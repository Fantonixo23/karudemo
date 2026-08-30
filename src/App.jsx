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

export default function App() {
  useMediaQuery()

  return (
    <FullscreenProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app/inicio" element={<Inicio />} />
        <Route path="/app/mesas" element={<NuevaVenta />} />
        <Route path="/app/cocina" element={<Cocina />} />
        <Route path="/app/caja" element={<Caja />} />
        <Route path="/app/delivery" element={<Delivery />} />
        <Route path="/app/informes" element={<Informes />} />
        <Route path="/app/productos" element={<Productos />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </FullscreenProvider>
  )
}
