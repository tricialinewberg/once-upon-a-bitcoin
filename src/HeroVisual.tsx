import { useEffect, useRef, useState } from 'react'
import { startHero } from './hero-player'

const motionQuery = '(prefers-reduced-motion: reduce)'
const settledStill = '/hero-opening.webp'
const atlas = '/hero-intro-atlas.webp'
const columns = 8, rows = 5
const frameCount = columns*rows
const duration = 2150
const keyframes = Array.from({length:frameCount+1},(_,step) => {
  const index = Math.min(step,frameCount-1)
  return {
    transform: `translate(${-(index%columns)*100/columns}%,${-Math.floor(index/columns)*100/rows}%)`,
    easing: 'steps(1, end)',
  }
})

export function HeroVisual({label}: {label:string}) {
  const host = useRef<HTMLDivElement>(null)
  const sprite = useRef<HTMLImageElement>(null)
  const [reduced,setReduced] = useState(() => matchMedia(motionQuery).matches)
  const [atlasFailed,setAtlasFailed] = useState(false)
  const [webglFailed,setWebglFailed] = useState(false)

  useEffect(() => {
    const preference = matchMedia(motionQuery)
    function update() {setReduced(preference.matches)}
    preference.addEventListener('change',update)
    return () => preference.removeEventListener('change',update)
  },[])

  useEffect(() => {
    if (reduced) return
    const element = host.current!
    const image = sprite.current
    let active = true
    let motion: Animation | undefined
    let sample = 0
    let live: ReturnType<typeof startHero> | undefined

    setAtlasFailed(false)
    setWebglFailed(false)
    live = startHero(element,() => {
      live?.stop()
      live = undefined
      setWebglFailed(true)
    })

    if (image) {
      void image.decode().then(() => {
        if (!active || element.hasAttribute('data-phase')) return
        motion = image.animate(keyframes,{duration,fill:'forwards'})
        element.dataset.introFrame = '0'
        live?.syncIntro(performance.now())
        function markMovement() {
          if (Number(motion?.currentTime) >= duration/frameCount) element.dataset.introFrame = '1'
          else sample = requestAnimationFrame(markMovement)
        }
        sample = requestAnimationFrame(markMovement)
        motion.onfinish = () => {element.dataset.introFinished = ''}
      }).catch(() => {
        if (active) setAtlasFailed(true)
      })
    }

    return () => {
      active = false
      cancelAnimationFrame(sample)
      motion?.cancel()
      live?.stop()
      delete element.dataset.introFrame
      delete element.dataset.introFinished
    }
  },[reduced])

  const staticFallback = reduced || (atlasFailed && webglFailed)
  return <div className="hero-visual" ref={host} role="img" aria-label={label} data-fallback={staticFallback ? '' : undefined}>
    {staticFallback && <img src={settledStill} fetchPriority="high" width="1344" height="646" alt="" />}
    {!reduced && !atlasFailed && <div className="hero-intro-clip" aria-hidden="true">
      <img className="hero-intro-atlas" ref={sprite} src={atlas} fetchPriority="high" width="2560" height="770" alt="" />
    </div>}
  </div>
}
