import { expect, test } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { animatedWebp } from './animated-webp'

if (process.env.CHAPTER_REVIEW_URL) test.use({baseURL:process.env.CHAPTER_REVIEW_URL})

const sizes = [[360,640],[390,844],[430,932],[768,1024],[1280,720],[1440,900]]

for (const [width,height] of sizes) {
  test.describe(`${width} × ${height}`,() => {
    test.use({viewport:{width,height},hasTouch:width<900,isMobile:width<768,reducedMotion:'reduce'})
    test('renders and operates Chapter I',async ({page}) => {
      await page.goto('/chapter/1')
      const title = page.locator('.chapter-head h1')
      await expect(title).toHaveText('Uma nova forma de enxergar o dinheiro')
      await expect(title.locator('.chapter-accent')).toHaveText('nova forma')
      await expect(page.locator('.comparison tbody tr')).toHaveCount(5)
      expect(await page.locator('.site-scroll').evaluate(el=>el.scrollWidth)).toBeLessThanOrEqual(width)
      await expect(page.locator('.peer-stage img')).toBeVisible()
      await expect(page.locator('.peer-stage canvas')).toHaveCount(0)
      const mobile = width < 768
      const benefits = page.locator(mobile ? '.benefit-mobile' : '.benefit-desktop')
      await benefits.getByRole('button',{name:/Mais autonomia/}).click()
      await expect(benefits.getByText(/públicas e rastreáveis/)).toBeVisible()
      const event = page.locator('.history-event[aria-hidden="false"]')
      await page.getByRole('button',{name:'2010',exact:true}).click()
      await expect(event.getByRole('heading')).toHaveText('Duas pizzas entram para a história')
      await page.getByRole('button',{name:'2012',exact:true}).click()
      await expect(event.getByRole('heading')).toHaveText('O primeiro halving')
      await page.getByText('Ver todos os eventos',{exact:true}).click()
      await expect(page.locator('.history-all[open] ol li')).toHaveCount(9)
      await page.getByText('Ver todos os eventos',{exact:true}).click()

      if (width === 390 || width === 1440) {
        await mkdir('screenshots/correction-04',{recursive:true})
        const format = width === 390 ? 'mobile' : 'desktop'
        const capture = async (section: string, label: string) => {
          const locator = page.locator(section)
          const header = (await page.locator('.site-header').boundingBox())!.height
          const size = (await locator.boundingBox())!.height
          if (header + size > height) await page.setViewportSize({width,height:Math.ceil(header+size+28)})
          await locator.scrollIntoViewIfNeeded()
          await locator.screenshot({path:`screenshots/correction-04/${format}-${label}.png`,animations:'disabled'})
          await page.setViewportSize({width,height})
        }
        for (const [selector,label] of [
          ['.chapter-head','opening'],['.chapter-intro','network'],['.comparison','comparison'],
          ['.benefits','benefits'],['.chapter-note','responsibility'],['.chapter-summary','summary'],['.chapter-ending','ending'],['.chapter-nav','navigation'],
        ]) await capture(selector,label)
        for (const year of ['2008','2010','2017','2024']) {
          await page.getByRole('button',{name:year,exact:true}).click()
          await capture('.history-band',`timeline-${year}`)
        }
      }

      await page.locator('.language').getByRole('button',{name:'EN — English',exact:true}).click()
      await expect(title).toHaveText('A new way to look at money')
      await expect(page.getByRole('heading',{name:'How is Bitcoin different from Pix?'})).toBeVisible()
      await page.locator('.chapter-nav .next').click()
      await expect(page).toHaveURL(/chapter\/2$/)
      await expect(page.locator('.chapter-head h1')).toBeFocused()
      await expect(page.locator('.chapter-accent').first()).toHaveText('21 million')
      await expect(page.locator('.chapter-nav .prev')).toHaveCSS('color','rgb(248, 245, 239)')
      if (width === 390 || width === 1440) {
        const nav = page.locator('.chapter-nav')
        const format = width === 390 ? 'mobile' : 'desktop'
        await nav.scrollIntoViewIfNeeded()
        await nav.screenshot({path:'screenshots/correction-04/'+format+'-navigation-pair.png'})
      }
      await page.goBack()
      await expect(page).toHaveURL(/chapter\/1$/)
    })
  })
}

test('peer network runs on entry without controls',async ({page,context}) => {
  test.setTimeout(210000)
  await page.setViewportSize({width:1280,height:720})
  await page.goto('/chapter/1')
  await page.locator('.peer-figure').scrollIntoViewIfNeeded()
  await expect(page.locator('.peer-stage canvas')).toBeVisible({timeout:30000})
  await mkdir('screenshots/correction-04',{recursive:true})
  const session = await context.newCDPSession(page)
  const frames: {data:string; time:number}[] = []
  let output = frames
  session.on('Page.screencastFrame',event => {
    if (event.metadata.timestamp && output.length < 18) output.push({data:event.data,time:event.metadata.timestamp*1000})
    void session.send('Page.screencastFrameAck',{sessionId:event.sessionId}).catch(() => {})
  })
  await session.send('Page.startScreencast',{format:'jpeg',quality:77,maxWidth:800,maxHeight:640})
  await expect.poll(() => frames.length,{timeout:20000}).toBeGreaterThan(1)
  await session.send('Page.stopScreencast')
  await writeFile('screenshots/correction-04/network-live.jpg',Buffer.from(frames[0].data,'base64'))
  expect(new Set(frames.map(frame=>frame.data)).size).toBeGreaterThan(1)
  await expect(page.locator('.peer-figure button')).toHaveCount(0)

  async function recordShots(shots: typeof frames, path: string) {
    const encoded = await page.evaluate(async frames => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const shots = []
      for (const frame of frames) {
        const image = new Image()
        image.src = 'data:image/jpeg;base64,'+frame.data
        await image.decode()
        canvas.width = image.width
        canvas.height = image.height
        ctx.drawImage(image,0,0)
        shots.push({data:canvas.toDataURL('image/webp',.8).split(',')[1],time:frame.time})
      }
      return {shots,width:canvas.width,height:canvas.height}
    },shots)
    await writeFile(path,animatedWebp(encoded.shots,encoded.width,encoded.height))
  }
  await recordShots(frames,'screenshots/correction-04/network-motion.webp')

  const transition: typeof frames = []
  output = transition
  await page.locator('.chapter-nav .next').scrollIntoViewIfNeeded()
  await session.send('Page.startScreencast',{format:'jpeg',quality:82,maxWidth:960,maxHeight:720})
  await page.locator('.chapter-nav .next').click()
  await expect(page.locator('.chapter')).toHaveAttribute('data-route-direction','forward')
  await page.waitForTimeout(340)
  await session.send('Page.stopScreencast')
  if (transition.length > 1) await recordShots(transition,'screenshots/correction-04/chapter-transition.webp')
  await page.goBack()
  await expect(page.locator('.chapter')).toHaveAttribute('data-route-direction','backward')
})

test('the network starts automatically on a touch viewport',async ({browser,baseURL}) => {
  test.setTimeout(120000)
  const context = await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2})
  try {
    const page = await context.newPage()
    await page.goto(new URL('/chapter/1',baseURL).href)
    const figure = page.locator('.peer-figure')
    await figure.scrollIntoViewIfNeeded()
    await expect(figure.locator('.peer-stage')).toHaveAttribute('data-rendered','',{timeout:35000})
    await expect(figure.locator('button')).toHaveCount(0)
  } finally {
    await context.close()
  }
})
