import { useState } from 'react'
import { useStore } from '../store/useStore'
import { PLAN_MODULES } from '../constants'

const PLANES = [
  {
    id: 'basico',
    icon: 'storefront',
    nombre: 'Basico',
    precio: 'desde 230.000 Gs/mes',
    desc: 'Para locales pequenos',
    incluye: ['Mesas', 'Cocina', 'Caja', 'Productos'],
  },
  {
    id: 'estandar',
    icon: 'store',
    nombre: 'Estandar',
    precio: 'desde 350.000 Gs/mes',
    desc: 'El mas vendido. Para locales medianos en crecimiento',
    incluye: ['Todo lo Basico', 'Delivery', 'Inventario', 'Configuracion', 'Impresion', 'SIFEN (facturacion electronica)'],
    destacado: true,
  },
  {
    id: 'enterprise',
    icon: 'apartment',
    nombre: 'Enterprise',
    precio: 'desde 460.000 Gs/mes',
    desc: 'Ideal para negocios profesionales y restaurantes complejos',
    incluye: ['Todo lo Estandar', 'Carta Digital', 'Reservas', 'Informes', 'SIFEN (facturacion electronica)'],
  },
]

export default function PlanModal({ onClose }) {
  const plan = useStore((state) => state.plan)
  const setPlan = useStore((state) => state.setPlan)
  const [selected, setSelected] = useState(plan)
  const darkMode = useStore((state) => state.darkMode)

  const handleConfirm = () => {
    setPlan(selected)
    if (onClose) onClose()
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.75)', zIndex: 5000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background: darkMode ? '#1e1e1e' : 'white',
        borderRadius: '24px', width: '92%', maxWidth: '640px',
        maxHeight: '90vh', overflow: 'auto', padding: '28px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        boxSizing: 'border-box',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 12px',
            background: 'rgba(139,26,43,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-icons" style={{ fontSize: '28px', color: '#8B1A2B' }}>workspace_premium</span>
          </div>
          <h2 style={{ margin: '0', fontSize: '22px', fontWeight: '800', color: darkMode ? '#fff' : '#1a1a1a' }}>
            Selecciona un plan
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: darkMode ? 'rgba(255,255,255,0.5)' : '#888' }}>
            Cada plan activa los modulos de la app segun el tamano de tu negocio
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
          {PLANES.map((p) => {
            const isSelected = selected === p.id
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                style={{
                  position: 'relative', textAlign: 'left', cursor: 'pointer',
                  borderRadius: '16px', padding: '18px',
                  border: `2px solid ${isSelected ? '#8B1A2B' : darkMode ? 'rgba(255,255,255,0.12)' : '#ddd'}`,
                  background: isSelected
                    ? 'rgba(139,26,43,0.10)'
                    : darkMode ? '#2a2a2a' : '#f8f8f8',
                  transition: 'all 0.15s',
                  display: 'flex', flexDirection: 'column', gap: '8px',
                }}
              >
                {p.destacado && (
                  <span style={{
                    position: 'absolute', top: '-10px', right: '12px',
                    background: 'linear-gradient(135deg, #8B1A2B, #B71C1C)',
                    color: 'white', fontSize: '9px', fontWeight: '800',
                    padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase',
                  }}>Popular</span>
                )}
                <span className="material-icons" style={{ fontSize: '24px', color: '#8B1A2B' }}>{p.icon}</span>
                <span style={{ fontSize: '17px', fontWeight: '800', color: darkMode ? '#fff' : '#1a1a1a' }}>{p.nombre}</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#8B1A2B' }}>{p.precio}</span>
                <span style={{ fontSize: '11px', color: darkMode ? 'rgba(255,255,255,0.4)' : '#999' }}>{p.desc}</span>
                <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {p.incluye.map((inc, i) => {
                    const esSifen = inc.toLowerCase().includes('sifen')
                    return (
                      <span key={i} style={{
                        fontSize: '11px',
                        color: esSifen ? '#F9A825' : (darkMode ? '#ccc' : '#555'),
                        fontWeight: esSifen ? '800' : '400',
                        display: 'flex', alignItems: 'center', gap: '5px',
                      }}>
                        <span className="material-icons" style={{ fontSize: '13px', color: esSifen ? '#F9A825' : '#4CAF50' }}>{esSifen ? 'verified' : 'check'}</span>
                        {inc}
                      </span>
                    )
                  })}
                </div>
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          {onClose ? (
            <button
              onClick={onClose}
              style={{
                padding: '13px 20px', borderRadius: '12px', border: 'none',
                background: darkMode ? '#444' : '#e0e0e0', color: darkMode ? '#fff' : '#333',
                cursor: 'pointer', fontWeight: '600',
              }}
            >Cancelar</button>
          ) : null}
          <button
            onClick={handleConfirm}
            style={{
              flex: 1, padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #8B1A2B, #B71C1C)', color: 'white',
              fontWeight: '800', fontSize: '15px',
            }}
          >Confirmar plan</button>
        </div>
      </div>
    </div>
  )
}
