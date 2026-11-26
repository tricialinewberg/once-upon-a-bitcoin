import { runHero, type HeroDriver, type HeroFrame } from './hero-runtime'

export type HeroWorkerRequest =
  | {kind: 'start'; canvas: OffscreenCanvas; pixelRatio: number; touch: boolean}
  | {kind: 'resize'; width: number; height: number}
  | {kind: 'visibility'; visible: boolean}
  | {kind: 'intro'; timestamp: number}
export type HeroWorkerResponse = {kind: 'frame'; frame: HeroFrame} | {kind: 'failure'}

const send = (message: HeroWorkerResponse) => self.postMessage(message)

let driver: HeroDriver | undefined
self.addEventListener('message',(event: MessageEvent<HeroWorkerRequest>) => {
  const message = event.data
  try {
    switch (message.kind) {
      case 'start':
        message.canvas.addEventListener('webglcontextlost',() => send({kind:'failure'}))
        driver = runHero(message.canvas,message.pixelRatio,message.touch,
          frame => send({kind:'frame',frame}),() => send({kind:'failure'}))
        break
      case 'resize':
        driver?.resize(message.width,message.height)
        break
      case 'intro':
        driver?.syncIntro(message.timestamp-performance.timeOrigin)
        break
      case 'visibility':
        driver?.setVisible(message.visible)
        break
    }
  } catch {
    send({kind:'failure'})
  }
})
