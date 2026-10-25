async function get(path) {
  const res = await fetch(`/api${path}`)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export const fetchBooks = () => get('/books')
export const fetchEvents = () => get('/events')

export async function placeOrder(items) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || 'Could not place your order. Please try again.')
  return body
}
