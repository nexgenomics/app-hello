import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Button, Card, Logo, Spinner, ThemeToggle, Wordmark } from '@nexgenomics/core/ui'

// The unauthenticated landing. Sign in and Create account both route to Auth0
// Universal Login; "Create account" lands on the signup screen via screen_hint.
// Customize the copy for your brand — the auth wiring stays in @nexgenomics/core.
export function SignInLanding() {
  const { loginWithRedirect, isLoading, error } = useAuth0()

  // A denied login leaves ?error&state in the URL (auth0-react does not invoke
  // onRedirectCallback on the error path). This page is where that lands, and it
  // mounts only after auth0-react has finished, so clearing here is safe and
  // prevents a refresh from re-processing the dead transaction ("Invalid state").
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.has('code') || p.has('state') || p.has('error')) {
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="flex items-center justify-between px-5 py-4">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="mx-auto flex max-w-md flex-col items-center px-5 pt-10 pb-16 sm:pt-20">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo showWordmark={false} markClass="h-16 w-16" className="mb-5" />
          <h1 className="text-3xl font-semibold tracking-tight">
            <Wordmark />
          </h1>
          <p className="mt-2 text-sm text-muted">Sign in to continue.</p>
        </div>

        <Card className="w-full p-6">
          <div className="flex flex-col gap-3">
            <Button onClick={() => void loginWithRedirect()} disabled={isLoading}>
              {isLoading ? <Spinner /> : 'Sign in'}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                void loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })
              }
              disabled={isLoading}
            >
              Create account
            </Button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-danger" role="alert">
              {error.message}
            </p>
          )}

          <p className="mt-5 text-center text-xs text-muted">
            Authentication is handled by Auth0. A verified email is required.
          </p>
        </Card>
      </main>
    </div>
  )
}
