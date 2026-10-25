import { useEffect, useRef, useState } from 'react'

// True once the element has scrolled into view (and stays true). Falls back to visible when
// IntersectionObserver is unavailable so content is never hidden.
export function useInView({ threshold = 0.15, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (inView || !el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(el)

    // Safety net: if a callback is missed (layout shifting under the observer, unusual embeds), anything
    // already inside the viewport still gets revealed rather than staying invisible.
    const timer = setTimeout(() => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) setInView(true)
    }, 1500)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [inView, threshold, rootMargin])

  return [ref, inView]
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Eases a number from 0 to `target` once `active` flips on; jumps straight there with reduced motion.
export function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    if (prefersReducedMotion()) return setValue(target)
    let frame = 0
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      setValue(target * (1 - Math.pow(1 - t, 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, active, duration])
  return value
}
