import { useEffect, useState } from 'react'

// Tiny hash router. "#/profile" and "#/orders" are account pages, "#/events/<id>" is an event page,
// and anything else (including plain section anchors like "#collection") is the landing page.
export function parseHash(hash) {
  if (hash === '#/profile') return { name: 'profile' }
  if (hash === '#/orders') return { name: 'orders' }
  const event = hash.match(/^#\/events\/([\w-]+)$/)
  if (event) return { name: 'event', id: event[1] }
  return { name: 'home' }
}

export function useRoute() {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return parseHash(hash)
}
