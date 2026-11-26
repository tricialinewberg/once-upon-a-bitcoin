import { expect, test } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

test.beforeEach(async ({page}) => {
  test.setTimeout(180000)
  // Stop the ambient WebGL loop after opening so software rendering does not compete with input checks.
  await page.addInitScript(() => {
    const request = window.requestAnimationFrame.bind(window)
    window.requestAnimationFrame = callback => request(callback.name === 'animate' ? time => {
      if (document.querySelector('.hero-visual')?.getAttribute('data-phase') !== 'end') callback(time)
    } : callback)
  })
})

test('desktop motion and browser recording', async ({page,context},testInfo) => {
  await mkdir('screenshots',{recursive:true})
  await page.setViewportSize({width:1280,height:720})
  await page.emulateMedia({reducedMotion:'no-preference'})
  const session = await context.newCDPSession(page)
  const frames: {data:string; time:number}[] = []
  session.on('Page.screencastFrame',({data,metadata,sessionId}) => {
    void session.send('Page.screencastFrameAck',{sessionId}).catch(() => {})
    if (metadata.timestamp !== undefined) frames.push({data,time:metadata.timestamp})
  })
  await page.addInitScript(() => {
    const observer = new MutationObserver(() => {
      if (!document.querySelector('.hero h1')) return
      performance.mark('hero-mounted')
      observer.disconnect()
    })
    observer.observe(document,{subtree:true,childList:true})
  })
  const record = process.env.CAPTURE_HERO_MOTION === '1'
  if (record) await session.send('Page.startScreencast',{format:'jpeg',quality:82,maxWidth:960,maxHeight:540})
  await page.goto('/')
  const title = page.locator('.hero h1')
  const primary = page.locator('.cta-signature')
  await expect(title.locator('span').nth(0)).toHaveCSS('animation-duration','0.4s')
  await expect(title.locator('span').nth(1)).toHaveCSS('animation-delay','0.06s')
  await expect(title.locator('span').nth(2)).toHaveCSS('animation-delay','0.12s')
  await expect(primary).toBeInViewport()
  await expect(page.locator('.hero-visual')).toHaveAttribute('data-phase','end',{timeout:30000})
  await page.mouse.move(0,0)
  await page.screenshot({path:'screenshots/correction-02g-desktop.png'})
  if (record) {
    const mounted = await page.evaluate(() => (performance.timeOrigin+performance.getEntriesByName('hero-mounted')[0].startTime)/1000)
    await session.send('Page.stopScreencast')
    const opening = frames.filter(frame => frame.time >= mounted-.04)
    expect(opening.length).toBeGreaterThan(3)
    await writeFile(testInfo.outputPath('motion-frames.json'),JSON.stringify(opening))
  }
  await session.detach()

  await primary.hover()
  await expect(primary).toHaveCSS('transform','matrix(1, 0, 0, 1, 0, -2)')
  await expect.poll(() => primary.evaluate(el => getComputedStyle(el,'::before').top)).toBe('6px')
  await expect(primary).toHaveCSS('background-color','color(srgb 0.970824 0.606118 0.164824)')
  await page.mouse.down()
  await expect(primary).toHaveCSS('transform','matrix(0.98, 0, 0, 0.98, 0, 0)')
  await page.mouse.move(0,0)
  await page.mouse.up()

  const secondary = page.locator('.hero-secondary')
  const before = await secondary.boundingBox()
  await secondary.hover()
  await expect(secondary).toHaveCSS('text-decoration-thickness','2px')
  await expect(secondary).toHaveCSS('text-decoration-color','rgb(168, 78, 8)')
  await expect(secondary).toHaveCSS('color','rgb(32, 32, 32)')
  expect(await secondary.boundingBox()).toEqual(before)

  const trigger = page.locator('.menu-toggle')
  const menu = page.locator('#chapter-index')
  await trigger.click()
  await expect(menu).toHaveCSS('transition-duration','0.22s, 0.22s, 0s')
  await expect(menu).toHaveCSS('opacity','1')
  await expect(trigger.locator('.menu-chevron')).toHaveCSS('transform',/matrix\(-0\.707107, -0\.707107, 0\.707107, -0\.707107/)
  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
  await expect(trigger).toBeFocused()

  const originalTitle = await title.elementHandle()
  const originalCanvas = await page.locator('.hero-visual canvas').elementHandle()
  const language = page.locator('.language')
  await language.getByRole('button',{name:'English',exact:true}).click()
  await expect.poll(() => language.evaluate(el => getComputedStyle(el,'::after').transform)).toBe('matrix(1, 0, 0, 1, 44, 0)')
  expect(await title.evaluate((el,original) => el === original,originalTitle)).toBe(true)
  expect(await page.locator('.hero-visual canvas').evaluate((el,original) => el === original,originalCanvas)).toBe(true)
  expect(await title.locator('span').evaluateAll(lines => lines.every(line => line.getAnimations().length === 0))).toBe(true)
  await expect(page.locator('.hero .intro')).toHaveText('Learn what Bitcoin is and how to store and protect it without relying on an exchange.')
})

test.describe('mobile motion',() => {
  test.use({viewport:{width:390,height:844},isMobile:true,hasTouch:true})

  test('touch feedback, menu and reduced motion', async ({page,context}) => {
    await page.route(/\/src\/hero-scene\.ts(?:\?|$)/,route => route.abort())
    await page.emulateMedia({reducedMotion:'no-preference'})
    await page.goto('/')
    await expect(page.locator('.hero-visual')).toHaveAttribute('data-fallback','')
    const primary = page.locator('.cta-signature')
    const box = (await primary.boundingBox())!
    const session = await context.newCDPSession(page)
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2}]})
    await expect(primary).toHaveCSS('transform','matrix(0.98, 0, 0, 0.98, 0, 0)')
    await expect(primary).toHaveCSS('transition-duration','0s')
    await session.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]})
    await expect(primary).toHaveCSS('transform','none')
    await page.locator('.menu-toggle').tap()
    await expect(page.locator('#chapter-index')).toBeVisible()
    await page.locator('.menu-toggle').tap()
    await expect(page.locator('#chapter-index')).toBeHidden()
    await page.emulateMedia({reducedMotion:'reduce'})
    await expect(page.locator('.hero h1 span').first()).toHaveCSS('animation-name','none')
    await expect(page.locator('.hero-visual canvas')).toHaveCount(0)
    await expect(page.locator('.hero-visual img')).toHaveCSS('opacity','1')
    await primary.tap()
    await expect(page).toHaveURL(/\/chapter\/1$/)
  })
})
