import { createHeroScene } from './hero-scene'

export type HeroFrame = {opening: number; reveal: number}
export type HeroDriver = {
  resize(width: number, height: number): void
  setVisible(visible: boolean): void
  syncIntro(timestamp: number): void
  stop(): void
}

export function runHero(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  pixelRatio: number,
  touch: boolean,
  onFrame: (frame: HeroFrame) => void,
  onFailure: () => void,
): HeroDriver {
  const scene = createHeroScene(canvas,pixelRatio)
  let frame = 0, previous = 0, elapsed = 1/60, visible = false, sized = false
  let introStartedAt: number | undefined
  let lastDraw = -Infinity, rendered = false, settled = false, width = 0, height = 0

  function start() {
    if (!frame && visible && sized) frame = requestAnimationFrame(animate)
  }

  function animate(now: number) {
    frame = 0
    if (!visible) return
    if (introStartedAt !== undefined) elapsed = Math.max(elapsed,(now-introStartedAt)/1000)
    else if (previous) elapsed += Math.max(0,now-previous)/1000
    previous = now
    try {
      if (!touch || elapsed < 2.30 || now-lastDraw >= 1000/30-1) {
        const progress = scene.draw(elapsed)
        if (!settled) onFrame(progress)
        settled = elapsed >= 2.30
        lastDraw = now
        if (!rendered) {
          previous = performance.now()
          rendered = true
        }
      }
      start()
    } catch {
      onFailure()
    }
  }

  return {
    resize(nextWidth,nextHeight) {
      if (width === nextWidth && height === nextHeight) return
      width = nextWidth
      height = nextHeight
      sized = width > 0 && height > 0
      if (sized) scene.resize(width,height)
      start()
    },
    setVisible(next) {
      visible = next
      if (!visible) previous = 0
      start()
    },
    syncIntro(timestamp) {
      introStartedAt = timestamp
    },
    stop() {
      visible = false
      cancelAnimationFrame(frame)
      scene.dispose()
    },
  }
}
