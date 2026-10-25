import { useInView } from '../lib/useInView.js'

// Fades and lifts its children into place the first time they scroll into view.
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
      className={`transition duration-700 ease-out motion-reduce:transition-none ${inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
