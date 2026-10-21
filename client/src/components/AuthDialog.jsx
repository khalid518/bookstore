import { useEffect, useRef, useState } from 'react'
import { signIn, signUp } from '../lib/auth.js'

const field = 'w-full rounded-md border-2 border-line bg-white px-3 py-2 text-primary focus:border-primary focus:outline-none'

export default function AuthDialog({ mode: initialMode, onClose }) {
  const [mode, setMode] = useState(initialMode)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const dialogRef = useRef(null)
  const isSignUp = mode === 'signup'

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    return () => dialog.close()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = form.get('email')
    const password = form.get('password')
    setError('')
    setPending(true)
    const { error: err } = isSignUp
      ? await signUp.email({ name: form.get('name'), email, password })
      : await signIn.email({ email, password })
    setPending(false)
    if (err) setError(err.message || 'Something went wrong. Please try again.')
    else onClose()
  }

  const switchMode = () => {
    setError('')
    setMode(isSignUp ? 'signin' : 'signup')
  }

  return (
    <dialog ref={dialogRef} onClose={onClose} onClick={(e) => e.target === e.currentTarget && onClose()} aria-labelledby="auth-title" className="m-auto w-[min(26rem,calc(100%-2rem))] rounded-md bg-surface p-0 text-ink backdrop:bg-black/50">
      <form onSubmit={submit} className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="auth-title" className="font-heading text-2xl text-primary">{isSignUp ? 'Create an account' : 'Sign in'}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl leading-none text-muted hover:text-primary">×</button>
        </div>

        {isSignUp && (
          <label className="flex flex-col gap-1 text-sm font-semibold text-primary">
            Name
            <input name="name" type="text" required autoComplete="name" className={field} />
          </label>
        )}
        <label className="flex flex-col gap-1 text-sm font-semibold text-primary">
          Email
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-primary">
          Password
          <input name="password" type="password" required minLength={8} autoComplete={isSignUp ? 'new-password' : 'current-password'} className={field} />
          {isSignUp && <span className="text-xs font-normal text-muted">At least 8 characters.</span>}
        </label>

        <p role="alert" className="min-h-5 text-sm text-red-700">{error}</p>

        <button type="submit" disabled={pending} className="rounded-md bg-primary px-5 py-3 font-semibold text-cream hover:bg-primary-dark disabled:opacity-60">
          {pending ? 'Please wait…' : isSignUp ? 'Sign up' : 'Sign in'}
        </button>
        <p className="text-center text-sm text-muted">
          {isSignUp ? 'Already have an account?' : 'New here?'}{' '}
          <button type="button" onClick={switchMode} className="font-semibold text-accent underline underline-offset-4 hover:text-primary">
            {isSignUp ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </form>
    </dialog>
  )
}
