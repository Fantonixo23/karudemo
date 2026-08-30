import { useNavigate } from 'react-router-dom'

const FEATURES = [
  { icon: 'table_restaurant', titulo: 'Mesas', desc: 'Mesas disponibles, ocupadas y en limpieza en tiempo real.' },
  { icon: 'restaurant', titulo: 'Cocina', desc: 'Pedidos en cola, en preparacion y listos para servir.' },
  { icon: 'point_of_sale', titulo: 'Caja', desc: 'Cobro por mesa, metodos de pago y cierre de caja.' },
  { icon: 'delivery_dining', titulo: 'Delivery', desc: 'Pedidos a domicilio con seguimiento de estado.' },
  { icon: 'inventory_2', titulo: 'Productos', desc: 'Catalogo con 20 productos cargados de ejemplo.' },
  { icon: 'analytics', titulo: 'Informes', desc: 'Ventas, productos mas vendidos y reportes.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{
      position: 'relative', minHeight: '100vh', overflow: 'hidden',
      background: 'linear-gradient(160deg, #121212 0%, #1a1a1a 60%, #241404 100%)',
      color: 'white', fontFamily: "'Roboto', sans-serif",
    }}>
      {/* Fondo de video (muy oscuro, apenas visible) */}
      <video
        autoPlay muted loop playsInline
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      >
        <source src="/video/background.mp4" type="video/mp4" />
      </video>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
      {/* NAV */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, background: 'rgba(18,18,18,0.85)', backdropFilter: 'blur(6px)', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="karuAPP" width="34" height="34" style={{ borderRadius: '8px' }} />
          <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '0.5px' }}>karuAPP</span>
        </div>
        <button
          onClick={() => navigate('/app/inicio')}
          style={{
            padding: '10px 22px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #8B1A2B, #B71C1C)', color: 'white',
            fontWeight: '700', fontSize: '14px',
          }}
        >
          Probar demo
        </button>
      </header>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '70px 24px 40px', maxWidth: '760px', margin: '0 auto' }}>
        <img src="/logo.png" alt="karuAPP" width="88" height="88" style={{ borderRadius: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }} />
        <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '24px 0 12px', letterSpacing: '0.5px' }}>
          Gestion de restaurant <span style={{ color: '#FF0000' }}>simple y completa</span>
        </h1>
        <p style={{ fontSize: '17px', color: '#bbb', lineHeight: 1.6, margin: '0 auto 32px', maxWidth: '560px' }}>
          Controla las mesas, la cocina, los cobros y el delivery con una sola aplicacion,
          desde la PC o el celular.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/app/inicio')}
            style={{
              padding: '15px 34px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #8B1A2B, #B71C1C)', color: 'white',
              fontWeight: '800', fontSize: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
            }}
          >
            ▶ Probar la demo gratis
          </button>
          <a
            href="https://wa.me/595992609484?text=Hola!%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20karuAPP"
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: '15px 34px', borderRadius: '12px', cursor: 'pointer',
              background: '#25D366', color: 'white', fontWeight: '800', fontSize: '16px',
              textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
            }}
          >
            💬 Contactar al WhatsApp
          </a>
        </div>
        <p style={{ color: '#777', fontSize: '13px', marginTop: '16px' }}>
          Demostracion con datos de ejemplo · sin necesidad de instalar nada
        </p>
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px 24px 60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '26px', fontWeight: '800', margin: '0 0 30px' }}>
          Todo lo que necesitas para tu negocio
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px', padding: '22px', display: 'flex', gap: '14px', alignItems: 'flex-start',
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                background: 'rgba(139,26,43,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-icons" style={{ color: '#8B1A2B' }}>{f.icon}</span>
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{f.titulo}</div>
                <div style={{ color: '#aaa', fontSize: '13px', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '28px', borderTop: '1px solid rgba(255,255,255,0.06)', color: '#666', fontSize: '13px' }}>
        <p style={{ margin: '0 0 6px' }}>
          © {new Date().getFullYear()} karuAPP · Demo interactiva
        </p>
        <p style={{ margin: 0 }}>?Consultas? <a href="https://wa.me/595992609484" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366' }}>Contactar al WhatsApp</a></p>
      </footer>
      </div>
    </div>
  )
}
