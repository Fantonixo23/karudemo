import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGuide, GUIDE_STEPS } from './guideState'
import { demoState } from './mockApi'

const ACCENT = '#4CAF50'
const RED = '#F44336'
const ORANGE = '#8B1A2B'

export default function GuideTour() {
  const location = useLocation()
  const navigate = useNavigate()
  const guide = useGuide()
  const [showWelcome, setShowWelcome] = useState(false)
  const wasAppRoute = useRef(false)

  const isAppRoute = location.pathname.startsWith('/app')

  // Al entrar a la app (desde la landing), mostrar siempre el modal de bienvenida.
  useEffect(() => {
    if (isAppRoute && !wasAppRoute.current) {
      setShowWelcome(true)
    }
    wasAppRoute.current = isAppRoute
  }, [isAppRoute])

  if (!isAppRoute && guide.active) {
    return null
  }

  const current = GUIDE_STEPS.find((g) => g.step === guide.current) || GUIDE_STEPS[0]

  const accept = () => {
    setShowWelcome(false)
    guide.start()
  }
  const cancel = () => {
    setShowWelcome(false)
    guide.cancel()
  }

  // ---------- Modal de bienvenida ----------
  if (showWelcome && isAppRoute) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99990, background: 'rgba(0,0,0,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        backdropFilter: 'blur(3px)',
      }}>
        <div style={{
          background: '#1e1e1e', borderRadius: '22px', padding: '32px 28px',
          maxWidth: '420px', width: '100%', color: 'white', textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)', border: '1px solid rgba(139,26,43,0.3)',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px', margin: '0 auto 16px',
            background: 'rgba(76,175,80,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-icons" style={{ fontSize: '34px', color: ACCENT }}>tour</span>
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: '800' }}>?Queres una guia para utilizar KaruAPP?</h2>
          <p style={{ color: '#bbb', fontSize: '14px', lineHeight: 1.5, margin: '0 0 24px' }}>
            Te mostramos paso a paso como completar una venta: ocupar mesa,
            tomar pedido, cocina, cobrar y cerrar caja.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={cancel} style={{
              flex: 1, padding: '13px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent', color: '#ccc', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
            }}>Cancelar</button>
            <button onClick={accept} style={{
              flex: 1, padding: '13px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #4CAF50, #388E3C)', color: 'white', fontWeight: '700',
              fontSize: '14px', cursor: 'pointer',
            }}>Aceptar guia</button>
          </div>
        </div>
      </div>
    )
  }

  // Guia activa: solo en rutas de la app
  if (!guide.active || !isAppRoute) return null

  return <Spotlight current={current} guide={guide} navigate={navigate} />
}

// ------------------------------------------------------------------
// Overlay con foco (spotlight): oscurece la pantalla y marca con un
// circulo el elemento sobre el que hay que hacer clic.
// ------------------------------------------------------------------
function Spotlight({ current, guide, navigate }) {
  const [targetRect, setTargetRect] = useState(null)
  const [viewport, setViewport] = useState({ w: 0, h: 0 })
  const refreshTimer = useRef(null)

  const measure = useCallback(() => {
    setViewport({ w: window.innerWidth, h: window.innerHeight })
    if (current.target) {
      const el = document.querySelector(current.target)
      if (el) {
        const r = el.getBoundingClientRect()
        setTargetRect(r)
        return
      }
    }
    setTargetRect(null)
  }, [current.target])

  // Medir al iniciar, al cambiar de paso y periodicamente (scroll/resize)
  useLayoutEffect(() => {
    measure()
    const onScrollResize = () => {
      setTargetRect(current.target ? (() => {
        const el = document.querySelector(current.target)
        return el ? el.getBoundingClientRect() : null
      })() : null)
      // Si el paso actual ya esta hecho, avanzar
      const step = GUIDE_STEPS.find((g) => g.step === guide.current)
      if (step && step.done(demoState.getState(), document) && !guide.completed.includes(step.step)) {
        guide.markComplete(step.step)
      }
    }
    const onTick = () => {
      measure()
      const step = GUIDE_STEPS.find((g) => g.step === guide.current)
      if (step) {
        const doneNow = (typeof window !== 'undefined') && (step.done(demoState.getState(), document))
        if (doneNow && !guide.completed.includes(step.step)) {
          guide.markComplete(step.step)
        }
      }
    }
    window.addEventListener('scroll', onScrollResize, true)
    window.addEventListener('resize', onScrollResize)
    refreshTimer.current = setInterval(onTick, 350)
    // Primer chequeo
    onTick()
    return () => {
      window.removeEventListener('scroll', onScrollResize, true)
      window.removeEventListener('resize', onScrollResize)
      clearInterval(refreshTimer.current)
    }
  }, [current.target, guide.current])

  // Posicion del centro del objetivo (o del centro de la pantalla si no hay target)
  const size = targetRect ? Math.max(targetRect.width, targetRect.height) + 24 : 140
  const cx = targetRect ? targetRect.left + targetRect.width / 2 : viewport.w / 2
  const cy = targetRect ? targetRect.top + targetRect.height / 2 : viewport.h * 0.4
  const r = size / 2

  const done = guide.completed.includes(current.step)
  const isLast = guide.current >= GUIDE_STEPS.length
  const ringColor = done ? ACCENT : ORANGE

  // Colocar el panel de instrucciones cerca del objetivo, sin salirse de la pantalla
  const panelH = 280
  const prefersBelow = cy + r + 16 + panelH <= viewport.h - 12
  const prefersAbove = cy - r - 16 - panelH >= 12
  let panelTop
  if (prefersBelow) panelTop = cy + r + 16
  else if (prefersAbove) panelTop = cy - r - 16 - panelH
  else panelTop = Math.max(12, Math.min(viewport.h - panelH - 12, cy - panelH / 2))

  return (
    <>
      {/* Capa oscura con agujero circular */}
      <svg
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 99960 }}
      >
        <defs>
          <mask id="karu-guide-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <circle cx={cx} cy={cy} r={r} fill="black" />
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.78)" mask="url(#karu-guide-mask)" />

        {/* Circulo animado (pulso) alrededor del objetivo */}
        <g>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={ringColor} strokeWidth="2" opacity="0.55">
            <animate attributeName="r" values={`${r - 6};${r + 14}`} dur="1.1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.85;0.2" dur="1.1s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx} cy={cy} r={r + 16} fill="none" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.9" />
          {/* Punto central */}
          <circle cx={cx} cy={cy} r={5} fill="#ffffff" opacity="0.9" />
        </g>
      </svg>

      {/* Panel de instrucciones */}
      <div
        style={{
          position: 'fixed', left: '16px', top: panelTop, zIndex: 99970,
          width: 'min(360px, calc(100vw - 32px))', background: '#1e1e1e', color: 'white',
          borderRadius: '16px', padding: '16px', boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
          border: `1px solid ${ringColor}55`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: ORANGE, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Guia · Paso {guide.current}/{GUIDE_STEPS.length}
          </span>
          <button onClick={() => guide.dismiss()} style={{
            background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '18px', lineHeight: 1,
          }}>&times;</button>
        </div>

        {/* Indicador de pasos */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', marginBottom: '12px' }}>
          {GUIDE_STEPS.map((g) => {
            const d = guide.completed.includes(g.step)
            const isCur = guide.current === g.step
            return (
              <div
                key={g.step}
                onClick={() => guide.goTo(g.step)}
                title={g.titulo}
                style={{
                  flex: 1, height: '20px', borderRadius: '10px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700',
                  background: d ? ACCENT : isCur ? 'rgba(139,26,43,0.9)' : '#3a3a3a',
                  color: 'white', transition: 'all 0.2s',
                }}
              >
                {d ? '✓' : g.step}
              </div>
            )
          })}
        </div>

        <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '6px', color: done ? '#81C784' : '#C62828' }}>
          {done ? '✅ ' : '1. '}{current.titulo}
        </div>
        <p style={{ color: '#ccc', fontSize: '13px', lineHeight: 1.45, margin: '0 0 12px', minHeight: '56px' }}>
          {current.instructivo}
        </p>

        {targetRect && current.label && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '10px',
            background: 'rgba(139,26,43,0.12)', border: '1px solid rgba(139,26,43,0.3)',
            fontSize: '13px', fontWeight: '700', color: '#C62828', marginBottom: '12px',
          }}>
            <span className="material-icons" style={{ fontSize: '18px' }}>touch_app</span>
            {current.label}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => { navigate(current.ruta); guide.goTo(current.step) }}
            style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: done ? '#3a3a3a' : 'linear-gradient(135deg, #4CAF50, #388E3C)',
              color: 'white', fontWeight: '700', fontSize: '13px',
            }}
          >
            Ir al paso
          </button>
          {isLast ? (
            <button
              onClick={() => guide.dismiss()}
              style={{
                padding: '10px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg,#8B1A2B,#B71C1C)', color: 'white', fontWeight: '700', fontSize: '13px',
              }}
            >
              Finalizar
            </button>
          ) : (
            <button
              onClick={() => guide.goTo(guide.current + 1)}
              style={{
                padding: '10px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: '#3a3a3a', color: '#ccc', fontWeight: '600', fontSize: '13px',
              }}
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </>
  )
}
