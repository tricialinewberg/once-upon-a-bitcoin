import { expect, test } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

for (const [width,height] of [[390,844],[768,1024],[1280,720],[1440,900]]) {
  test(`chapter cleanup ${width} × ${height}`, async ({page}) => {
    test.setTimeout(90000)
    await page.setViewportSize({width,height})
    await page.emulateMedia({reducedMotion:'reduce'})
    const folder='screenshots/correction-07'
    await mkdir(folder,{recursive:true})
    async function capture(selector:string,name:string) {
      const element=page.locator(selector)
      const bounds=(await element.boundingBox())!
      const header=(await page.locator('.site-header').boundingBox())!
      if (bounds.height+header.height>height) await page.setViewportSize({width,height:Math.ceil(bounds.height+header.height+30)})
      await element.scrollIntoViewIfNeeded()
      await element.screenshot({path:`${folder}/${width}-${name}.png`})
      await page.setViewportSize({width,height})
    }
    await page.goto('/chapter/1')
    await expect(page.locator('.peer-figure button')).toHaveCount(0)
    await expect(page.locator('.peer-stage img')).toBeVisible()
    await expect(page.locator('.comparison')).not.toContainText('A diferença vai muito além')
    await expect(page.locator('.chapter-answer')).toHaveText('Não!')
    await capture('.chapter-ending','conclusion')
    if(width===390||width===1440) await capture('.chapter-intro','network')
    expect(await page.locator('.site-scroll').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true)
    await page.goto('/chapter/2')
    await expect(page.locator('.scene-coin button,.scene-coin figcaption')).toHaveCount(0)
    await expect(page.locator('.scene-coin img')).toBeVisible()
    await expect(page.locator('.chapter-2 a[href*="fred.stlouisfed.org"]')).toHaveCount(0)
    const section=page.locator('[data-position="volatility"]')
    await expect(section.getByRole('heading',{name:'O preço muda.'})).toHaveCount(0)
    await expect(page.locator('[data-position="converter"] .volatility-notice')).toContainText('Atenção:')
    await expect(section.locator('.volatility-statement')).toHaveText('Uma queda de preço não significa, por si só, que a rede Bitcoin deixou de funcionar.')
    await expect(section.getByText('O que é HODL?',{exact:true})).toBeVisible()
    await expect(page.locator('.learning-panel li')).toHaveCount(5)
    await capture('[data-position="volatility"]','volatility')
    const arrows=await page.locator('.chapter-nav .chapter-destination').evaluateAll(cards=>cards.map(card=>{
      const arrow=card.querySelector('.destination-arrow')!.getBoundingClientRect()
      const text=card.querySelector('.destination-copy')!.getBoundingClientRect()
      return arrow.left<text.left
    }))
    expect(arrows).toEqual([true,false])
    await capture('.chapter-nav','navigation')
    expect(await page.locator('.site-scroll').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true)
    await page.locator('.language').getByRole('button',{name:'EN — English',exact:true}).click()
    await expect(page.locator('[data-position="converter"] .volatility-notice')).toContainText('Keep in mind:')
    await expect(section.getByText('What is HODL?',{exact:true})).toBeVisible()
  })
}
