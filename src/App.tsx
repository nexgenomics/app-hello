import { useAuth0 } from '@auth0/auth0-react'
import { config } from '@nexgenomics/core/config'
import { Button, Logo, Spinner, ThemeToggle } from '@nexgenomics/core/ui'
import { SignInLanding } from './features/landing/SignInLanding'
import { WhoAmI } from './features/whoami/WhoAmI'

export function App() {
  const { isLoading, isAuthenticated, user, logout, error } = useAuth0()

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg text-muted">
        <Spinner className="h-6 w-6" />
      </div>
    )
  }

  if (!isAuthenticated || error) return <SignInLanding />

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-10 border-b border-border bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Logo />
          <span className="ml-auto hidden max-w-[40vw] truncate text-sm text-muted sm:block">
            {user?.email}
          </span>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout({ logoutParams: { returnTo: config.redirectUri } })}
          >
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <WhoAmI />
      </main>
    </div>
  )
}
