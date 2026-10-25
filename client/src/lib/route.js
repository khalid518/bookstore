import { useEffect, useReducer } from 'react'

// Tiny hash router. "#/profile" and "#/orders" are account pages, "#/events/<id>" is an event page,
// "#/books?..." is the filterable catalogue, and anything else (including plain section anchors
// like "#collection") is the landing page.
export function parseHash(hash) {
  if (hash === '#/profile') return { name: 'profile' }
  if (hash === '#/orders') return { name: 'orders' }
  if (hash === '#/books' || hash.startsWith('#/books?')) return { name: 'books', query: hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : '' }
  const event = hash.match(/^#\/events\/([\w-]+)$/)
  if (event) return { name: 'event', id: event[1] }
  return { name: 'home' }
}

// `nav` counts every hash change, so pages can tell "the user navigated here again" apart from
// "nothing changed", even when the destination looks identical (e.g. clicking All Books while on it).
export function useRoute() {
  const [nav, bump] = useReducer((n) => n + 1, 0)

  useEffect(() => {
    window.addEventListener('hashchange', bump)
    return () => window.removeEventListener('hashchange', bump)
  }, [])

  const hash = window.location.hash
  return { ...parseHash(hash), hash, nav }
}
