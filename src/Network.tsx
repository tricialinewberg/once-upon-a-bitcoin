import { useEffect, useRef, useState } from 'react'
import { pick, type Copy, type Language } from './content'
import type { mount } from './scene'
import { ChapterArt } from './ChapterArt'

export function Network({lang}: {lang:Language}) {
  const host = useRef<HTMLDivElement>(null)
  const scene = useRef<ReturnType<typeof mount> | null>(null)
  const [ready,setReady] = useState(false)
  useEffect(() => {
    const element = host.current!
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let active = true, loading = false, generation = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || motion.matches || loading) return
      loading = true
      const turn = generation
      void import('./scene').then(({mount}) => {
        if (!active || motion.matches || turn !== generation) return
        scene.current = mount(element,'peer-network',{x:0,y:0,action:1},() => setReady(false),() => setReady(true))
      }).catch(() => {})
    })
    function observe() {
      if (motion.matches) {
        generation++
        scene.current?.destroy()
        scene.current = null
        setReady(false)
        loading = false
        observer.unobserve(element)
      } else observer.observe(element)
    }
    observe()
    motion.addEventListener('change',observe)
    return () => {
      active = false
      observer.disconnect()
      motion.removeEventListener('change',observe)
      scene.current?.destroy()
      scene.current = null
    }
  },[])
  const t = (copy:Copy) => pick(lang,copy)
  return <figure className="peer-figure">
    <div className="peer-stage" data-rendered={ready ? '' : undefined}>
      {!ready && <ChapterArt kind="peer-network" eager />}
      <div ref={host} className="peer-canvas" aria-hidden="true" />
    </div>
    <figcaption>
      <span>{t(['Cada nó recebe e compartilha informações com outros nós.','Each node receives and shares information with its peers.'])}</span>
    </figcaption>
  </figure>
}

