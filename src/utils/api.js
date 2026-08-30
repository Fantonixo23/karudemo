import { handleMockRequest } from '../demo/mockApi'

const getBaseUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:5173'
  const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:'
  const hostname = window.location.hostname
  const defaultPort = protocol === 'https:' ? '443' : '80'
  const port = window.location.port || defaultPort
  const isStandard = (protocol === 'https:' && port === '443') || (protocol === 'http:' && port === '80')
  return isStandard ? `${protocol}//${hostname}` : `${protocol}//${hostname}:${port}`
}

export const getApiUrl = () => `${getBaseUrl()}/api`

export const getSocketUrl = () => getBaseUrl()

export const getMediaUrl = () => getBaseUrl()

export async function apiFetch(url, options = {}) {
  const res = await fetch(url, options)
  return res
}

// ---------------------------------------------------------------
// karuAPP DEMO: interceptar todos los fetch hacia /api y servirlos
// con datos simulados en el navegador (sin backend ni base datos).
// ---------------------------------------------------------------
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch.bind(window)

  window.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : (input && input.url) || ''
    const isApi = url.includes('/api') || (typeof input === 'string' && input.startsWith('/api'))

    if (isApi) {
      let path = url
      let query = ''
      try {
        const parsed = new URL(url)
        path = parsed.pathname
        query = parsed.search
      } catch (e) {
        const qi = path.indexOf('?')
        if (qi >= 0) {
          query = path.slice(qi)
          path = path.slice(0, qi)
        }
      }
      path = path.replace(/^\/api/, '') || '/'
      const mockUrl = `http://demo.local${path}${query}`
      const opts = init ? { ...init } : {}
      return Promise.resolve(handleMockRequest(mockUrl, opts))
    }

    return originalFetch(input, init)
  }
}
