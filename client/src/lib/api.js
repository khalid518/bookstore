async function get(path) {
  const res = await fetch(`/api${path}`)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export const fetchBooks = () => get('/books')
export const fetchEvents = () => get('/events')
