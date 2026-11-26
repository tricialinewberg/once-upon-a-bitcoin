import { expect, test } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

test('capture the opening sequence and verify the header in desktop and mobile', async ({browser}) => {
  test.setTimeout(360000)
  await mkdir('screenshots',{recursive:true})
  for (const [width,height] of [[360,640],[390,844],[430,932],[1440,900]]) {
    const mobile = width < 768
    const touch = width <= 768
    const context = await browser.newContext({
      viewport: {width,height},
      isMobile:mobile,hasTouch:touch,deviceScaleFactor:touch ? 2 : 1,reducedMotion:'no-preference',
    })
    const page = await context.newPage()
    page.on('console',message => {if (message.type() === 'warning' || message.type() === 'error') console.log(message.text())})
    page.on('pageerror',error => console.log(error.message))
    try {
      let releaseAnimation!: () => void
      const animationGate = new Promise<void>(resolve => { releaseAnimation = resolve })
      if (process.env.CAPTURE_HERO_STILL !== '1') {
        await page.route(/\/src\/hero-scene\.ts(?:\?|$)/,async route => {
          await animationGate
          await route.continue()
        })
      }
      await page.addInitScript(() => {
        Object.defineProperty(HTMLCanvasElement.prototype,'transferControlToOffscreen',{value:undefined})
        const clock = {threshold:0,paused:false}
        Object.assign(window,{heroCapture:clock})
        const original = window.requestAnimationFrame.bind(window)
        window.requestAnimationFrame = callback => {
          if (callback.name !== 'animate') return original(callback)
          function step(time: number) {
            if (clock.paused) {original(step);return}
            callback(time)
            const visual = document.querySelector<HTMLElement>('.hero-visual')
            if (visual?.dataset.opening && Number(visual.dataset.opening) >= clock.threshold) clock.paused = true
          }
          return original(step)
        }
      })
      await page.goto('http://127.0.0.1:5173/',{waitUntil:'domcontentloaded'})
      await page.evaluate(() => document.fonts.ready)
      const title = page.locator('.hero h1')
      await expect(title.locator('span')).toHaveCount(3)
      await expect(title).toHaveCSS('font-family',/"?Manrope Variable"?/)
      await expect(title.locator('span')).toHaveText(['Seu Bitcoin.','Suas chaves.','Sua liberdade!'])
      await expect(page.locator('.hero .intro')).toHaveText('Aprenda o que é Bitcoin, como guardar e proteger sem depender de uma corretora.')
      await expect(page.locator('.hero-support')).toHaveText('Você não precisa entender de tecnologia ou investimentos. Só precisa dar o primeiro passo.')
      const primary = page.locator('.hero-actions .cta-signature')
      expect(await page.locator('.site-header .logo img').evaluate(async (img:HTMLImageElement) => {
        await img.decode()
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const context = canvas.getContext('2d')!
        context.drawImage(img,0,0)
        const pixels = context.getImageData(0,0,canvas.width,canvas.height).data
        let orange = 0
        for (let i=0;i<pixels.length;i+=4) {
          if (pixels[i] === 247 && pixels[i+1] === 147 && pixels[i+2] === 26 && pixels[i+3] === 255) orange++
        }
        return orange
      })).toBeGreaterThan(1000)
      await expect(title.locator('.hero-accent')).toHaveCSS('color','rgb(198, 106, 0)')
      await expect(primary).toHaveCSS('background-color','rgb(247, 147, 26)')
      await expect(primary).toHaveCSS('color','rgb(32, 32, 32)')
      await expect(primary).toHaveCSS('min-height','54px')
      await expect(primary).toHaveCSS('border-radius','999px')
      await expect(primary).toHaveCSS('white-space','nowrap')
      expect(await page.locator('.site-scroll').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
      if (mobile) {
        await expect(primary).toBeInViewport()
      }
      const visual = page.locator('.hero-visual')
      if (process.env.CAPTURE_HERO_STILL !== '1') {
        const still = visual.locator('img')
        await expect(still).toHaveCSS('opacity','1')
        await expect.poll(() => still.evaluate((img:HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(100)
        await expect(visual.locator('canvas')).toHaveCount(0)
      }
      releaseAnimation()
      await expect(visual.locator('canvas')).toBeVisible({timeout:25000})
      for (const [name,threshold] of [['beginning',0],['end',1]] as const) {
        if (threshold > 0) await page.evaluate(value => {
          const clock = (window as Window & {heroCapture?:{threshold:number;paused:boolean}}).heroCapture!
          clock.threshold = value
          clock.paused = false
        },threshold)
        await expect.poll(() => page.evaluate(() => (window as Window & {heroCapture?:{paused:boolean}}).heroCapture!.paused),{timeout:30000}).toBe(true)
        if (process.env.CAPTURE_HERO_STILL === '1' && !mobile && name === 'beginning') {
          const png = await visual.locator('canvas').evaluate(el => (el as HTMLCanvasElement).toDataURL('image/webp',.94))
          await writeFile('public/hero-closed.webp',Buffer.from(png.split(',')[1],'base64'))
        }
        if (name === 'end') await page.screenshot({path:`screenshots/correction-02f-${width}x${height}.png`,scale:'css'})
      }
      for (const top of [0,140,490,1050]) {
        await page.evaluate(value => window.scrollTo(0,value),top)
        const header = (await page.locator('.site-header').boundingBox())!
        expect(header.y).toBe(0)
      }
      await page.evaluate(() => window.scrollTo(0,0))
      const menu = page.locator('#chapter-index')
      const trigger = page.getByRole('button',{name:'Capítulos',exact:true})
      if (touch) {
        await trigger.tap()
        await expect(menu).toBeVisible()
        await expect(menu.locator('.chapter-link')).toHaveCount(7)
        const bounds = (await menu.boundingBox())!
        expect(bounds.x).toBeGreaterThanOrEqual(0)
        expect(bounds.x+bounds.width).toBeLessThanOrEqual(width)
        expect(bounds.y+bounds.height).toBeLessThanOrEqual(height)
        await menu.locator('a[href="/chapter/2"]').tap()
        await expect(page).toHaveURL(/\/chapter\/2$/)
        await expect(menu).toBeHidden()
        await page.locator('.site-header .logo').tap()
        await expect(page).toHaveURL(/\/$/)
      }
      await page.locator('.language').getByRole('button',{name:'EN — English',exact:true}).click()
      await expect(title.locator('span')).toHaveText(['Your bitcoin.','Your keys.','Your freedom!'])
      await expect(page.locator('.hero .intro')).toHaveText('Learn what Bitcoin is and how to store and protect it without relying on an exchange.')
      if (touch) await primary.tap()
      else await primary.click()
      await expect(page).toHaveURL(/\/chapter\/1$/)
      await expect(page.locator('main h1')).toBeFocused()
      await expect(page.locator('.hero-visual')).toHaveCount(0)
    } finally {
      await context.close()
    }
  }
})

test('the complete desktop hero fits above the fold in both languages', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const scene = page.locator('.hero-visual img')
  await expect.poll(() => scene.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  for (const [width,height] of [[1280,720],[1366,768],[1440,900],[1024,768],[768,1024],[390,844],[320,568]]) {
    await page.setViewportSize({width,height})
    for (const language of ['PT — Português','EN — English']) {
      await page.locator('.language').getByRole('button',{name:language,exact:true}).click()
      const measurements = await page.locator('.site-scroll').evaluate((scroller, small) => {
        const viewport = {top:document.querySelector('.site-header')!.getBoundingClientRect().bottom,bottom:innerHeight}
        const targets = small ? ['.hero h1','.hero-visual','.hero .cta-signature'] :
          ['.hero h1','.hero-visual','.hero .intro','.hero-support','.hero-actions','.hero-note']
        return {
          scrollTop:window.scrollY,
          clipped:targets.filter(selector => {
            const bounds = scroller.querySelector(selector)!.getBoundingClientRect()
            return bounds.top < viewport.top || bounds.bottom > viewport.bottom + 1
          }),
        }
      },width === 320)
      expect(measurements,`${width} × ${height} · ${language}`).toEqual({scrollTop:0,clipped:[]})
    }
  }
})

test('reduced motion uses a still and unavailable WebGL plays the opening atlas', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/')
  const visual = page.locator('.hero-visual')
  await expect(visual.locator('canvas')).toHaveCount(0)
  await expect(visual.locator('.hero-intro-atlas')).toHaveCount(0)
  await expect.poll(() => visual.locator('img').evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(100)
  await page.emulateMedia({reducedMotion:'no-preference'})
  await page.addInitScript(() => {
    Object.defineProperty(HTMLCanvasElement.prototype,'transferControlToOffscreen',{value:undefined})
    const original = HTMLCanvasElement.prototype.getContext
    Object.defineProperty(HTMLCanvasElement.prototype,'getContext',{value:function(this: HTMLCanvasElement,type: string,...args:unknown[]) {
      return type.startsWith('webgl') ? null : Reflect.apply(original,this,[type,...args])
    }})
  })
  await page.reload()
  await expect(visual).toHaveAttribute('data-intro-finished','',{timeout:20000})
  await expect(visual.locator('canvas')).toHaveCount(0)
  await expect(visual.locator('.hero-intro-clip')).toBeVisible()
})

test('the hero CTA navigates while Three.js is still loading', async ({page}) => {
  let release!: () => void
  const pending = new Promise<void>(resolve => { release = resolve })
  await page.route(/hero\.worker|hero-runtime/,async route => {
    if (new URL(route.request().url()).searchParams.has('worker')) return route.continue()
    await pending
    await route.abort().catch(() => {})
  })
  try {
    await page.goto('/',{waitUntil:'domcontentloaded'})
    const visual = page.locator('.hero-visual')
    await expect(visual).not.toHaveAttribute('data-phase','opening')
    await expect(visual).toHaveAttribute('data-intro-frame','1',{timeout:15000})
    await page.locator('.hero-actions .cta-signature').click()
    await expect(page).toHaveURL(/\/chapter\/1$/)
    await expect(page.locator('main h1')).toBeFocused()
  } finally {
    release()
  }
})
