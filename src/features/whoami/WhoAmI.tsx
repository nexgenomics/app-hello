import { useCallback, useEffect, useState } from 'react'
import { useFabApi } from '@nexgenomics/core/auth'
import type { components } from '@nexgenomics/core/api/schema'
import { Badge, Button, Card, Spinner } from '@nexgenomics/core/ui'

type Principal = components['schemas']['PrincipalAdmin']

type State =
  | { kind: 'loading' }
  | { kind: 'ok'; principal: Principal }
  | { kind: 'error'; message: string }

/*
  WhoAmI — the single example call in this template. It reads
  GET /v1/principals/me through the typed @nexgenomics/core client, proving the Auth0
  token reaches the gateway and the response is type-checked end to end. Replace
  this with your app's first real view; the auth + client wiring lives entirely
  in @nexgenomics/core, so you never reimplement it.
*/
export function WhoAmI() {
  const { client } = useFabApi()
  const [state, setState] = useState<State>({ kind: 'loading' })

  const load = useCallback(async (): Promise<State> => {
    try {
      const { data, error } = await client.GET('/v1/principals/me')
      if (error) {
        const code = (error as { code?: string }).code ?? ''
        const detail = (error as { detail?: string }).detail ?? ''
        return { kind: 'error', message: [code, detail].filter(Boolean).join(' — ') || 'Request failed' }
      }
      return { kind: 'ok', principal: data }
    } catch (e) {
      return { kind: 'error', message: e instanceof Error ? e.message : String(e) }
    }
  }, [client])

  useEffect(() => {
    let active = true
    void load().then((next) => {
      if (active) setState(next)
    })
    return () => {
      active = false
    }
  }, [load])

  function refresh() {
    setState({ kind: 'loading' })
    void load().then(setState)
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">Signed in as</h2>
        <Button variant="ghost" size="sm" onClick={refresh}>
          Refresh
        </Button>
      </div>

      {state.kind === 'loading' && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Spinner /> Resolving your principal…
        </div>
      )}

      {state.kind === 'ok' && (
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">{state.principal.email}</span>
            <Badge tone={state.principal.enabled ? 'ok' : 'danger'}>
              {state.principal.enabled ? 'enabled' : 'disabled'}
            </Badge>
          </div>
          {state.principal.display_name && (
            <div className="text-muted">{state.principal.display_name}</div>
          )}
          <div className="font-mono text-xs text-muted">{state.principal.id}</div>
        </div>
      )}

      {state.kind === 'error' && (
        <div className="space-y-2 text-sm">
          <div className="text-danger" role="alert">
            {state.message}
          </div>
          <p className="text-muted">
            Couldn’t resolve your principal. Confirm the gateway is reachable and
            its origin allowlist includes this app.
          </p>
        </div>
      )}
    </Card>
  )
}
