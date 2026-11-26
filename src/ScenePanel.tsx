import { useEffect, useRef, useState } from 'react'
import type { Copy, Language } from './content'
import { pick } from './content'
import { ChapterArt } from './ChapterArt'
import type { ChapterObject } from './chapter-models'
import { useActivityState } from './activity-state'
import type { mount, SceneKind, SceneState } from './scene'

type PanelKind = Exclude<SceneKind,'peer-network'>

const captions: Record<Exclude<PanelKind,'coin'>, Copy> = {
  network:['Uma rede de nós independentes','A network of independent nodes'],
  custody:['Quem controla a chave?','Who controls the key?'],
  backup:['Um cartão com 12 espaços mascarados','A card with 12 masked spaces'],
}
const illustrationAlt: Record<PanelKind, Copy> = {
  coin:['Moeda dourada com o símbolo do Bitcoin','Gold coin with the Bitcoin symbol'],
  network:['Três blocos ligados entre si','Three interconnected blocks'],
  custody:['Chave de bronze com o símbolo do Bitcoin','Brass key with the Bitcoin symbol'],
  backup:['Cartão ilustrativo com 12 espaços em branco','Illustrated card with 12 blank spaces'],
}

export function ScenePanel({kind,lang,fallback}: {kind: PanelKind; lang: Language; fallback: ChapterObject}) {
  const host = useRef<HTMLDivElement>(null)
  const controller = useRef<ReturnType<typeof mount> | null>(null)
  const [ready,setReady] = useState(false)
  const [failed,setFailed] = useState(false)
  const [state,setState] = useActivityState<SceneState>(`scene-${kind}-state`,{x:0,y:0,action:0})
  const stateRef = useRef(state)
  const t = (copy: Copy) => pick(lang,copy)
  function change(next: SceneState) {
    stateRef.current = next
    setState(next)
    controller.current?.change(next)
  }
  useEffect(() => {
    const element = host.current
    if (!element || failed) return
    let cancelled = false
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      if (kind === 'coin' && matchMedia('(prefers-reduced-motion: reduce)').matches) return
      void import('./scene').then(({mount}) => {
        if (cancelled) return
        controller.current = mount(element,kind,{...stateRef.current,action:0},() => setFailed(true),() => setReady(true))
        controller.current.change(stateRef.current)
      }).catch(() => {if (!cancelled) setFailed(true)})
    })
    observer.observe(element)
    return () => {
      cancelled = true
      observer.disconnect()
      controller.current?.destroy()
      controller.current = null
    }
  },[kind,failed])

  function activate(action = 1) {
    change({...stateRef.current,action})
  }

  const status = kind === 'custody' ? (state.action ?
    t(['Você controla as chaves e precisa proteger seu backup.','You control the keys and are responsible for protecting your backup.']) :
    t(['A corretora controla as chaves. Se os saques forem bloqueados, você depende da plataforma.','The exchange controls the keys. If withdrawals are frozen, you depend on the platform.'])) :
    kind === 'network' && state.action ?
      t(['Os nós compartilham dados e verificam as regras de forma independente. Mineradores podem propor novos blocos.','Peers share data and independently verify rules. Miners can propose new blocks.']) :
    kind === 'backup' ? (state.action ?
      t(['Backup guardado. Escolha um local físico privado e protegido.','Backup stored. Choose a private, protected physical location.']) :
      t(['Representação ilustrativa. Não contém palavras reais.','Illustration only. Contains no real recovery words.'])) : ''

  return <figure className={`scene scene-${kind}`} data-position={kind}>
    <div className="scene-image" data-coin-ready={kind === 'coin' && ready && !failed ? '' : undefined}>
      {(kind === 'coin' || !ready || failed) && <ChapterArt kind={fallback} alt={t(illustrationAlt[kind])} eager={kind === 'coin'} />}
      <div className={`scene-host ${ready && !failed ? 'visible' : ''}`} ref={host} data-scene={kind} />
    </div>
    {kind !== 'coin' && <figcaption>{t(captions[kind])}</figcaption>}
    {kind === 'custody' && <div className="controls">{[0,1].map(action => <button key={action} aria-pressed={state.action === action}
      onClick={() => activate(action)}>{action ? t(['Autocustódia','Self-custody']) : t(['Corretora','Exchange'])}</button>)}</div>}
    {kind === 'network' && <button onClick={() => activate(state.action ? 0 : 1)}>{state.action ?
      t(['Reiniciar demonstração','Reset demonstration']) : t(['Demonstrar propagação','Demonstrate propagation'])}</button>}
    {kind === 'backup' && <button onClick={() => activate(state.action ? 0 : 1)}>{state.action ?
      t(['Ver cartão','View card']) : t(['Guardar cartão','Store card'])}</button>}
    {kind === 'backup' && <details><summary>{t(['Ver os espaços mascarados','View masked spaces'])}</summary>
      <ol className="masks" aria-label={t(['Doze espaços mascarados','Twelve masked spaces'])}>{Array.from({length:12},(_,i) =>
        <li key={i}><span aria-hidden="true">••••••</span><span className="sr-only">{t(['Espaço mascarado','Masked space'])}</span></li>)}</ol></details>}
    {(kind !== 'coin' || failed) && <div className={kind === 'coin' ? 'sr-only' : 'scene-status'} role="status">{failed ? <p>{t(['A visualização 3D está indisponível neste navegador.','The 3D view is unavailable in this browser.'])}</p> : null}{status && <p>{status}</p>}</div>}
  </figure>
}
