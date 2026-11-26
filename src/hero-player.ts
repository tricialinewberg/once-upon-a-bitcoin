import HeroWorker from './hero.worker?worker'
import type { HeroDriver, HeroFrame } from './hero-runtime'
import type { HeroWorkerRequest, HeroWorkerResponse } from './hero.worker'

let pendingWorker: Worker | undefined
let runtime: Promise<typeof import('./hero-runtime')> | undefined

function loadRuntime() {
  runtime ??= import('./hero-runtime').catch(error => {
    runtime = undefined
    throw error
  })
  return runtime
}
const canUseWorker = () => typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined'
  && typeof HTMLCanvasElement.prototype.transferControlToOffscreen === 'function'

export function preloadHero() {
  if (!canUseWorker()) {
    void loadRuntime().catch(() => {})
    return
  }
  try {
    if (pendingWorker) return
    const worker = new HeroWorker()
    pendingWorker = worker
    worker.addEventListener('error',() => {
      if (pendingWorker === worker) {
        worker.terminate()
        pendingWorker = undefined
      }
    },{once:true})
  } catch {
    // The visible hero can retry or use its main-thread renderer.
  }
}

export function startHero(host: HTMLDivElement, onFailure: () => void) {
  const touch = matchMedia('(pointer: coarse)').matches
  const pixelRatio = Math.min(devicePixelRatio,touch ? 1.5 : 2)
  let canvas: HTMLCanvasElement
  let driver: HeroDriver | undefined
  let active = true
  let introStartedAt: number | undefined

  function attachCanvas() {
    canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden','true')
    host.append(canvas)
    return canvas
  }

  function report({opening,reveal}: HeroFrame) {
    if (!active) return
    if (!host.dataset.phase) host.dataset.phase = 'opening'
    if (opening === 1 && host.dataset.phase !== 'end') host.dataset.phase = 'end'
    const progress = opening.toFixed(4)
    if (host.dataset.opening !== progress) host.dataset.opening = progress
    if (reveal > 0 && !host.hasAttribute('data-coin-rising')) host.dataset.coinRising = ''
  }

  function size() {
    driver?.resize(host.clientWidth,host.clientHeight)
  }

  function visibility() {
    driver?.setVisible(active && !document.hidden)
  }

  function sync() {
    size()
    visibility()
    if (introStartedAt !== undefined) driver?.syncIntro(introStartedAt)
  }

  async function useMainThread() {
    try {
      const {runHero} = await loadRuntime()
      if (!active) return
      const local = attachCanvas()
      local.addEventListener('webglcontextlost',onFailure,{once:true})
      driver = runHero(local,pixelRatio,touch,report,onFailure)
      sync()
    } catch {
      if (active) onFailure()
    }
  }

  function useWorker() {
    const worker = pendingWorker ?? new HeroWorker()
    pendingWorker = undefined
    const send = (message: HeroWorkerRequest, transfers: Transferable[] = []) => worker.postMessage(message,transfers)
    let recovering = false
    function recover() {
      if (!active || recovering) return
      recovering = true
      worker.terminate()
      driver = undefined
      canvas?.remove()
      clearFrame()
      void useMainThread()
    }

    worker.addEventListener('error',recover,{once:true})
    worker.addEventListener('message',(event: MessageEvent<HeroWorkerResponse>) => {
      if (recovering) return
      if (event.data.kind === 'frame') report(event.data.frame)
      else if (host.dataset.phase) onFailure()
      else recover()
    })
    try {
      const offscreen = attachCanvas().transferControlToOffscreen()
      send({kind:'start',canvas:offscreen,pixelRatio,touch},[offscreen])
      driver = {
        resize: (width,height) => send({kind:'resize',width,height}),
        setVisible: visible => send({kind:'visibility',visible}),
        syncIntro: time => send({kind:'intro',timestamp:performance.timeOrigin+time}),
        stop: () => worker.terminate(),
      }
      sync()
    } catch {
      recover()
    }
  }

  function clearFrame() {
    delete host.dataset.phase
    delete host.dataset.opening
    delete host.dataset.coinRising
  }

  const resize = new ResizeObserver(size)
  resize.observe(host)
  document.addEventListener('visibilitychange',visibility)
  try {
    if (canUseWorker()) useWorker()
    else void useMainThread()
  } catch {
    void useMainThread()
  }

  return {
    syncIntro(timestamp: number) {
      introStartedAt = timestamp
      driver?.syncIntro(timestamp)
    },
    stop() {
      active = false
      resize.disconnect()
      document.removeEventListener('visibilitychange',visibility)
      driver?.stop()
      canvas?.remove()
      clearFrame()
    },
  }
}
