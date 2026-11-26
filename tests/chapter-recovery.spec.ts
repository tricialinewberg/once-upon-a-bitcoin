import { expect, test } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const baseURL = process.env.CHAPTER_REVIEW_URL ?? 'http://127.0.0.1:5173'
const output = 'screenshots/correction-06'

for(const [width,height] of [[390,844],[768,1024],[1280,720],[1440,900]]) {
  test(`shared layout at ${width} × ${height}`,async ({browser}) => {
    test.setTimeout(160000)
    const context = await browser.newContext({baseURL,viewport:{width,height},hasTouch:width<1000,isMobile:width<768,reducedMotion:'reduce'})
    try {
      const page=await context.newPage()
      const prefix=width===390?'mobile':width===1280?'desktop-1280':width===1440?'desktop':'tablet'
      if(prefix) await mkdir(output,{recursive:true})
      async function capture(selector:string,name:string) {
        if(!prefix) return
        const element=page.locator(selector)
        const bounds=(await element.boundingBox())!
        const header=(await page.locator('.site-header').boundingBox())!
        if(bounds.height+header.height>height) await page.setViewportSize({width,height:Math.ceil(bounds.height+header.height+30)})
        await element.scrollIntoViewIfNeeded()
        await element.locator('img').evaluateAll(async images=>{
          await Promise.all(images.filter(image=>image.getClientRects().length && getComputedStyle(image).visibility!=='hidden').map(async element=>{
            const image=element as HTMLImageElement
            image.loading='eager'
            await image.decode()
          }))
        })
        await element.screenshot({path:`${output}/${prefix}-${name}.png`,animations:'disabled'})
        await page.setViewportSize({width,height})
      }
      for(let number=1;number<=7;number++) {
        await page.goto('/chapter/'+number,{waitUntil:'domcontentloaded'})
        const heading=page.locator('.chapter-head h1')
        await expect(heading).toBeVisible()
        await expect(heading).toHaveCSS('animation-name','none')
        expect(await page.locator('.site-scroll').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true)
        if(prefix==='mobile'||prefix==='desktop') await capture('.chapter-head','opening-'+number)
        if(number===1) {
          const table=page.locator('.comparison table')
          await expect(table).toHaveCSS('border-top-left-radius','16px')
          await expect(page.locator('.comparison')).toHaveCSS('border-top-width','0px')
          await expect(page.locator('.comparison p').nth(1)).toHaveCSS('max-width','none')
          await expect(page.locator('.chapter-summary > p')).toHaveCSS('max-width','none')
          await expect(page.locator('.peer-stage img')).toBeVisible()
          await capture('.chapter-intro','intro')
          await capture('.comparison','comparison')
          const blockTops = await page.locator('.chapter-summary .block-art img').evaluateAll(images=>images.map(image=>image.getBoundingClientRect().top))
          expect(Math.max(...blockTops)-Math.min(...blockTops)).toBeLessThanOrEqual(1)
          await capture('.chapter-summary','summary')
          if(prefix==='mobile'||prefix==='desktop') {
            for(const year of ['2008','2009','2010','2012','2017','2018','2021','2022','2024']) {
              await page.getByRole('button',{name:year,exact:true}).click()
              await capture('.history-event[aria-hidden="false"]','timeline-'+year)
            }
          }
          await page.getByRole('button',{name:'2024',exact:true}).click()
          await expect(page.locator('.history-event[aria-hidden="false"]').getByRole('heading')).toHaveText('O quarto halving')
          await expect(page.locator('.history-event[aria-hidden="false"]').getByText('3,125 BTC',{exact:true})).toBeVisible()
        }
        if(number===2) {
          await expect(page.locator('[data-position="converter"]')).toHaveCSS('border-top-width','0px')
          await page.getByRole('button',{name:'100.000',exact:true}).click()
          await expect(page.locator('.results dd')).toHaveText('0,00100000 BTC')
          if(prefix==='mobile'||prefix==='desktop') await capture('[data-position="converter"]','converter')
        }
      }
    } finally {await context.close()}
  })
}

test('heading entrance and continuous network motion',async ({browser})=>{
  test.setTimeout(140000)
  const context=await browser.newContext({baseURL,viewport:{width:1280,height:720},reducedMotion:'no-preference'})
  try {
    const page=await context.newPage()
    await page.addInitScript(()=>{
      const clear = WebGL2RenderingContext.prototype.clear
      WebGL2RenderingContext.prototype.clear = function(mask) {
        const canvas = this.canvas
        if(canvas instanceof HTMLCanvasElement && canvas.closest('.peer-canvas')) {
          canvas.dataset.draws=String(Number(canvas.dataset.draws??0)+1)
        }
        clear.call(this,mask)
      }
      document.addEventListener('animationstart',event=>{
        if(event.animationName==='chapter-heading-enter' && event.target instanceof HTMLHeadingElement) {
          const root=document.documentElement
          root.dataset.headingStarts=String(Number(root.dataset.headingStarts??0)+1)
        }
      })
    })
    await page.goto('/chapter/1')
    const root=page.locator('html')
    await expect(root).toHaveAttribute('data-heading-starts','1')
    const stage=page.locator('.peer-stage')
    await stage.scrollIntoViewIfNeeded()
    await expect(stage.locator('canvas')).toBeVisible({timeout:35000})
    await expect(page.locator('.peer-figure button')).toHaveCount(0)
    await expect(page.getByRole('button',{name:/repetir propagação/i})).toHaveCount(0)
    const canvas=stage.locator('canvas')
    await page.waitForTimeout(5400)
    const sample=await canvas.screenshot()
    await expect.poll(async()=>sample.equals(await canvas.screenshot()),{timeout:15000}).toBe(false)
    const draws=async()=>Number(await canvas.getAttribute('data-draws'))
    await page.locator('.history-band').scrollIntoViewIfNeeded()
    await page.waitForTimeout(250)
    const offscreen=await draws()
    await page.waitForTimeout(500)
    expect(await draws()).toBe(offscreen)
    await stage.scrollIntoViewIfNeeded()
    await expect.poll(draws).toBeGreaterThan(offscreen)
    await mkdir(output,{recursive:true})
    await stage.screenshot({path:output+'/live-network.png'})
    await page.locator('.language').getByRole('button',{name:'English',exact:true}).click()
    await expect(root).toHaveAttribute('data-heading-starts','1')
    await page.goto('/chapter/2')
    await expect(root).toHaveAttribute('data-heading-starts','1')
  } finally {await context.close()}
})
