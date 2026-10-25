import { useEffect, useState } from 'react'

// Tiny hash router: "#/profile" and "#/orders" are account pages, anything else is the landing page.
const routeFromHash = () => {
  const hash = window.location.hash
  if (hash === '#/profile') return 'profile'
  if (hash === '#/orders') return 'orders'
  return 'home'
}

export function useRoute() {
  const [route, setRoute] = useState(routeFromHash)

  useEffect(() => {
    const onChange = () => setRoute(routeFromHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}
