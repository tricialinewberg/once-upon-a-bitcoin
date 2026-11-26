import { expect, test } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

function webpChunk(tag: string, data: Buffer) {
  const header = Buffer.alloc(8)
  header.write(tag)
  header.writeUInt32LE(data.length,4)
  return Buffer.concat([header,data,Buffer.alloc(data.length%2)])
}

function animatedWebp(frames: {data:string; time:number}[], width: number, height: number) {
  const canvas = Buffer.alloc(10)
  canvas[0] = 2
  canvas.writeUIntLE(width-1,4,3)
  canvas.writeUIntLE(height-1,7,3)
  const loop = Buffer.alloc(6)
  loop.writeUInt16LE(1,4)
  const chunks = [webpChunk('VP8X',canvas),webpChunk('ANIM',loop)]
  for (const [index,frame] of frames.entries()) {
    const header = Buffer.alloc(16)
    header.writeUIntLE(width-1,6,3)
    header.writeUIntLE(height-1,9,3)
    const delay = frames[index+1] ? frames[index+1].time-frame.time : 180
    header.writeUIntLE(Math.max(1,Math.round(delay)),12,3)
    header[15] = 2
    chunks.push(webpChunk('ANMF',Buffer.concat([header,Buffer.from(frame.data,'base64').subarray(12)])))
  }
  const body = Buffer.concat(chunks)
  const header = Buffer.from('RIFF    WEBP')
  header.writeUInt32LE(body.length+4,4)
  return Buffer.concat([header,body])
}


for (const mobile of [false,true]) {
  test(`hero startup · ${mobile ? 'mobile throttled' : 'desktop'}`,async ({browser}) => {
    const url = process.env.HERO_TIMING_URL
    test.skip(!url,'Run against an explicit production preview')
    test.setTimeout(240000)
    const capture = process.env.HERO_CAPTURE === '1'
    const profile = mobile ? 'mobile' : 'desktop'
    const context = await browser.newContext({
      viewport:mobile ? {width:390,height:844} : {width:1280,height:720},
      hasTouch:mobile,isMobile:mobile,deviceScaleFactor:mobile ? 2 : 1,reducedMotion:'no-preference',
    })
    try {
      const page = await context.newPage()
      const session = await context.newCDPSession(page)
      await session.send('Network.enable')
      await session.send('Network.clearBrowserCache')
      if (mobile) {
        await session.send('Emulation.setCPUThrottlingRate',{rate:4})
        await session.send('Network.emulateNetworkConditions',{
          offline:false,latency:150,downloadThroughput:187500,uploadThroughput:93750,connectionType:'cellular3g',
        })
      }
      await page.addInitScript(() => {
        const mark = (name: string) => {
          if (!performance.getEntriesByName(name).length) performance.mark(name)
        }
        document.addEventListener('animationstart',event => {
          if (event.animationName === 'hero-line-reveal') mark('headline-start')
        })
        document.addEventListener('animationend',event => {
          if (event.animationName === 'hero-line-reveal' && !(event.target as Element).nextElementSibling) mark('headline-end')
        })
        const observer = new MutationObserver(entries => {
          for (const entry of entries) {
            const host = entry.target as HTMLElement
            if (!host.classList.contains('hero-visual')) continue
            if (host.dataset.introFrame !== undefined) mark('first-scene-frame')
            if (!host.dataset.introFrame && host.dataset.phase) mark('first-scene-frame')
            if (host.dataset.introFrame === '1' || (!host.dataset.introFrame && Number(host.dataset.opening) >= .002)) mark('first-book-movement')
            if (host.dataset.introFinished !== undefined) mark('atlas-ended')
            if (host.dataset.phase) mark('live-rendered')
            if (host.hasAttribute('data-live')) mark('live-visible')
          }
        })
        observer.observe(document,{subtree:true,attributes:true,attributeFilter:['data-intro-frame','data-live','data-phase','data-opening']})
      })
      if (capture) await mkdir('screenshots',{recursive:true})
      const frames: {data:string; time:number}[] = []
      session.on('Page.screencastFrame',message => {
        if (message.metadata.timestamp) frames.push({data:message.data,time:message.metadata.timestamp*1000})
        void session.send('Page.screencastFrameAck',{sessionId:message.sessionId}).catch(() => {})
      })

      for (const cache of ['cold','warm']) {
        if (cache === 'warm') await page.goto('about:blank')
        const record = capture && cache === 'cold'
        if (record) await session.send('Page.startScreencast',{format:'jpeg',quality:78,maxWidth:960,maxHeight:850})
        await page.goto(url!,{waitUntil:'domcontentloaded'})
        await expect.poll(() => page.evaluate(() => performance.getEntriesByName('first-book-movement').length),{timeout:30000}).toBe(1)
        await expect.poll(() => page.evaluate(() => performance.getEntriesByName('headline-end').length)).toBe(1)
        await expect(page.locator('.hero-actions .cta-signature')).toBeVisible()
        // Verify the full opening and the handoff once per browser profile.
        if (cache === 'cold') {
          await expect.poll(() => page.evaluate(() => performance.getEntriesByName('live-visible').length),{timeout:70000}).toBe(1)
        }
        if (record) await session.send('Page.stopScreencast')
        const result = await page.evaluate(() => {
          const at = (name:string) => Math.round(performance.getEntriesByName(name)[0]?.startTime ?? -1)
          const firstFrame = at('first-scene-frame'), movement = at('first-book-movement')
          return {
            origin:performance.timeOrigin,headline:at('headline-start'),headlineEnd:at('headline-end'),
            firstFrame,movement,frameToMovement:movement-firstFrame,
            atlasDownload:Math.round((performance.getEntriesByName(new URL('/hero-intro-atlas.webp',location.href).href)[0] as PerformanceResourceTiming | undefined)?.responseEnd ?? -1),
            atlasEnded:at('atlas-ended'),liveRendered:at('live-rendered'),liveVisible:at('live-visible'),
          }
        })
        console.log(JSON.stringify({viewport:profile,cache,...result}))
        if (record) {
          await page.screenshot({path:`screenshots/correction-03d-${profile}-live.jpg`,quality:82,type:'jpeg',scale:'css'})
          const bounds = (await page.locator('.hero-visual').boundingBox())!
          const viewport = page.viewportSize()!
          const sequence = frames.filter(item => item.time >= result.origin && item.time <= result.origin+result.firstFrame+4400)
          const encoder = await browser.newPage()
          try {
            const captured = await encoder.evaluate(async ({sequence,bounds,viewport}) => {
              const bitmap = document.createElement('canvas')
              const painter = bitmap.getContext('2d')!
              const crop = document.createElement('canvas')
              crop.width = 160
              crop.height = 77
              const sample = crop.getContext('2d',{willReadFrequently:true})!
              let first = -1, movement = -1
              let baseline: Uint8Array | undefined
              let firstPixels = 0
              const frames: {data:string; time:number}[] = []
              for (const [index,frame] of sequence.entries()) {
                const image = new Image()
                image.src = 'data:image/jpeg;base64,'+frame.data
                await image.decode()
                if (!bitmap.width || !frames.length) {
                  bitmap.width = image.width
                  bitmap.height = image.height
                }
                painter.drawImage(image,0,0,bitmap.width,bitmap.height)
                const scaleX = image.width/viewport.width, scaleY = image.height/viewport.height
                sample.drawImage(image,bounds.x*scaleX,bounds.y*scaleY,bounds.width*scaleX,bounds.height*scaleY,0,0,crop.width,crop.height)
                const pixels = sample.getImageData(0,0,crop.width,crop.height).data
                if (movement < 0) {
                  const silhouette = new Uint8Array(pixels.length/4)
                  let warm = 0, changed = 0
                  for (let offset=0;offset<pixels.length;offset+=4) {
                    const red = pixels[offset], green = pixels[offset+1], blue = pixels[offset+2]
                    const colored = red-green > 27 && red-blue > 43 && green-blue > 9 ? 1 : 0
                    silhouette[offset/4] = colored
                    warm += colored
                    if (baseline && baseline[offset/4] !== colored) changed++
                  }
                  if (first < 0 && warm > 100) {
                    first = index
                    firstPixels = warm
                    baseline = silhouette
                  } else if (first >= 0 && changed >= Math.max(12,firstPixels*.025)) movement = index
                }
                frames.push({data:bitmap.toDataURL('image/webp',.77).split(',')[1],time:frame.time})
              }
              return {width:bitmap.width,height:bitmap.height,frames,first,movement}
            },{sequence,bounds,viewport})
            if (captured.frames.length) {
              await writeFile(`screenshots/correction-03d-${profile}.webp`,animatedWebp(captured.frames,captured.width,captured.height))
            }
            if (captured.first >= 0 && captured.movement >= 0) {
              const first = sequence[captured.first], movement = sequence[captured.movement]
              const afterNavigation = Math.round(movement.time-result.origin)
              const afterFirstFrame = Math.round(movement.time-first.time)
              console.log(JSON.stringify({viewport:profile,capture:true,afterNavigation,afterFirstFrame}))
              const coin = sequence.find(item => item.time >= first.time+1350)
              for (const [stage,frame] of Object.entries({first,movement,coin})) {
                if (frame) await writeFile(`screenshots/correction-03d-${profile}-${stage}.jpg`,Buffer.from(frame.data,'base64'))
              }
            }
          } finally {
            await encoder.close()
          }
          frames.length = 0
        }
      }
    } finally {
      await context.close()
    }
  })
}
