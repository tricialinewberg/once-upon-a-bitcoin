import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

async function captureSection(page: Page, section: Locator, path: string) {
  const viewport = page.viewportSize()!
  await section.scrollIntoViewIfNeeded()
  const height = (await section.boundingBox())!.height
  const header = (await page.locator('.site-header').boundingBox())!.height
  if (height + header > viewport.height) await page.setViewportSize({width:viewport.width,height:Math.ceil(height+header+30)})
  await section.scrollIntoViewIfNeeded()
  await Promise.all((await section.locator('img').all()).map(image => image.evaluate((el: HTMLImageElement) => el.decode())))
  await page.mouse.move(0,0)
  await section.screenshot({path,animations:'disabled'})
  await page.setViewportSize(viewport)
}

for (const [name,width,height] of [['mobile',390,844],['desktop',1440,900]] as const) {
  test(`review the ${name} editorial sections`,async ({browser,baseURL}) => {
    await mkdir('screenshots',{recursive:true})
    const context = await browser.newContext({viewport:{width,height},hasTouch:name==='mobile',isMobile:name==='mobile',reducedMotion:'reduce'})
    const page = await context.newPage()
    try {
      await page.goto(baseURL!)
      await page.evaluate(() => document.fonts.ready)
      const menu = page.locator('#chapter-index')
      const trigger = page.locator('.menu-toggle')
      if (name==='mobile') await trigger.tap()
      else await trigger.click()
      await expect(menu).toBeVisible()
      await expect(menu.locator('.chapter-link')).toHaveCount(7)
      const bounds = (await menu.boundingBox())!
      expect(bounds.x).toBeGreaterThanOrEqual(0)
      expect(bounds.x+bounds.width).toBeLessThanOrEqual(width)
      expect(bounds.y+bounds.height).toBeLessThanOrEqual(height+1)
      await page.screenshot({path:`screenshots/correction-03b-${name}-menu.png`})
      await menu.getByRole('button',{name:'Fechar'}).click()
      await expect(trigger).toBeFocused()
      await expect(menu).toBeHidden()

      const journey = page.locator('.journey')
      await expect(journey.getByRole('heading',{level:2})).toHaveText('Aprender Bitcoin pode ser mais simples do que você imagina.')
      await expect(journey.locator('.pillars li')).toHaveCount(3)
      await expect(journey.locator('.journey-bitcoin')).toHaveText('Bitcoin')
      await expect(journey.locator('.journey-bitcoin')).toHaveCSS('color','rgb(198, 106, 0)')
      await expect(journey.locator('.intro,.pillar-number')).toHaveCount(0)
      await captureSection(page,journey,`screenshots/correction-03b-${name}-journey.png`)
      const index = journey.locator('.journey-contents')
      await index.locator('summary').click()
      await expect(index.locator('.chapter-link')).toHaveCount(7)
      await expect(index.locator('.chapter-link').last()).toBeVisible()
      await captureSection(page,index,`screenshots/correction-03b-${name}-index.png`)

      const footer = page.locator('.site-footer')
      await expect(footer.getByRole('heading',{name:'Aviso importante'})).toBeVisible()
      await expect(footer.getByText('O progresso fica salvo', {exact:false})).toHaveCount(0)
      await footer.locator('#fontes summary').click()
      await expect(footer.locator('#fontes li').first()).toBeVisible()
      await footer.locator('#fontes summary').click()
      await footer.getByRole('button',{name:'English',exact:true}).click()
      await expect(footer.getByRole('heading',{name:'Important notice'})).toBeVisible()
      await footer.getByRole('link',{name:'Back to top'}).click()
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
      expect(await page.locator('.site-scroll').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
    } finally {
      await context.close()
    }
  })
}

test('Manrope headings across all routes and checklist persistence in its tab',async ({page,context}) => {
  await page.emulateMedia({reducedMotion:'reduce'})
  for (const route of ['/',...Array.from({length:7},(_,index) => `/chapter/${index+1}`)]) {
    await page.goto(route)
    const headings = await page.locator('h1,h2,h3,h4,.index-copy strong,.chapter-link strong').evaluateAll(nodes =>
      nodes.map(node => getComputedStyle(node).fontFamily))
    expect(headings.every(font => font.includes('Manrope Variable')),route).toBeTruthy()
    expect(await page.locator('body').evaluate(el => getComputedStyle(el).fontFamily)).toContain('Inter Variable')
  }
  const checklist = page.locator('.checklist')
  await expect(checklist.locator('.note')).toContainText('nesta aba')
  await checklist.getByRole('checkbox').first().check()
  await page.reload()
  await expect(checklist.getByRole('checkbox').first()).toBeChecked()
  const independentTab = await context.newPage()
  await independentTab.goto(page.url())
  await expect(independentTab.locator('.checklist').getByRole('checkbox').first()).not.toBeChecked()
})

test('editorial motion reveals content and closes the menu accessibly',async ({page}) => {
  await page.setViewportSize({width:360,height:640})
  await page.emulateMedia({reducedMotion:'no-preference'})
  await page.route(/\/src\/hero-scene\.ts(?:\?|$)/,route => route.abort())
  await page.goto('/')
  const trigger = page.locator('.menu-toggle')
  const menu = page.locator('#chapter-index')
  await trigger.click()
  await expect(menu).toHaveCSS('transition-duration','0.22s, 0.22s, 0s')
  await expect(menu).toHaveCSS('opacity','1')
  await menu.locator('.chapter-link').last().scrollIntoViewIfNeeded()
  await expect(menu.getByRole('button',{name:'Fechar'})).toBeInViewport()
  await expect(menu.locator('.chapter-link').last()).toBeInViewport()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  await expect(menu).toHaveAttribute('inert','')
  await expect(menu).toBeHidden()

  const firstStage = page.locator('.pillars li').first()
  await firstStage.scrollIntoViewIfNeeded()
  await expect(firstStage).toHaveAttribute('data-entered','')
  await expect(firstStage).toHaveCSS('animation-duration','0.4s')
  const logo = page.locator('.colophon-logo')
  await logo.scrollIntoViewIfNeeded()
  await expect(logo).toHaveCSS('animation-name','editorial-reveal')
  await page.emulateMedia({reducedMotion:'reduce'})
  await expect(logo).toHaveCSS('animation-name','none')
})
