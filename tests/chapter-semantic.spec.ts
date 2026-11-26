import { expect, test } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const output = 'screenshots/correction-10'
const sizes = [[360,640],[390,844],[430,932],[768,1024],[1280,720],[1440,900]]

test('chapter text and directional cards across the six requested viewports',async ({page})=>{
  test.setTimeout(180000)
  await page.emulateMedia({reducedMotion:'reduce'})
  await mkdir(output,{recursive:true})
  for (const [width,height] of sizes) {
    await page.setViewportSize({width,height})
    for (let chapter=1;chapter<=7;chapter++) {
      await page.goto('/chapter/'+chapter,{waitUntil:'domcontentloaded'})
      const nav = page.locator('.chapter-nav')
      await expect(nav).toBeVisible()
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true)
      const cards = await nav.locator('.chapter-destination').evaluateAll(links=>links.map(link=>{
        const rect = (selector:string) => {
          const bounds = link.querySelector(selector)?.getBoundingClientRect()
          return bounds ? {x:bounds.x,y:bounds.y+ bounds.height/2} : null
        }
        const {height,top} = link.getBoundingClientRect()
        return {prev:link.classList.contains('prev'),arrow:rect('.destination-arrow')!,number:rect('.destination-numeral'),copy:rect('.destination-copy')!,label:rect('.destination-label')!,height,top}
      }))
      for (const {prev,arrow,number,copy} of cards) {
        if (!number) continue
        expect(prev ? arrow.x<number.x && number.x<copy.x : copy.x<number.x && number.x<arrow.x).toBe(true)
        expect(Math.abs(arrow.y-number.y)).toBeLessThan(1)
      }
      if (cards.length===2 && Math.abs(cards[0].top-cards[1].top)<1) {
        expect(cards[0].height).toBeCloseTo(cards[1].height,0)
        expect(cards[0].label.y).toBeCloseTo(cards[1].label.y,0)
        expect(cards[0].arrow.y).toBeCloseTo(cards[1].arrow.y,0)
      }
      if (chapter===3) {
        const wallet=page.locator('.network-intro + .prose')
        const positions=await wallet.locator(':scope > *').evaluateAll(elements=>elements.map(el=>el.getBoundingClientRect().left))
        expect(new Set(positions).size).toBe(1)
        if (width>=1280) {
          const blocks=await page.locator('.comparison > p,.lesson-support').evaluateAll(elements=>elements.map(el=>{
            const range=document.createRange()
            range.selectNodeContents(el)
            const sample = el.cloneNode(true) as HTMLElement
            Object.assign(sample.style,{position:'absolute',width:'max-content',maxWidth:'none',visibility:'hidden'})
            el.after(sample)
            const natural = sample.getBoundingClientRect().width
            const lines = new Set([...range.getClientRects()].map(r=>r.top)).size
            sample.remove()
            return {width:el.clientWidth,frame:el.parentElement!.clientWidth,lines,natural}
          }))
          for (const block of blocks) expect(block.width).toBe(block.frame)
          for (const block of blocks.slice(1)) if (block.natural<=block.width) expect(block.lines).toBe(1)
          if (width===1440) expect(blocks[1].lines).toBe(1)
        }
      }
      if (chapter===4) {
        await expect(page.locator('.backup-figure figcaption')).toHaveText('Representação ilustrativa.')
        if(width>=1280) {
          const prose = await page.locator('[data-position=creation] > .prose,[data-position=copies] > p').evaluateAll(elements=>elements.map(el=>el.clientWidth-el.parentElement!.clientWidth))
          expect(prose).toEqual([0,0,0])
          const layout=await page.evaluate(()=>{
            const img=document.querySelector('.backup-card img')!.getBoundingClientRect()
            const title=document.querySelector('[data-position=backup] h3')!.getBoundingClientRect()
            const caption=document.querySelector('.backup-figure figcaption')!.getBoundingClientRect()
            return [img.top+img.height*56/300-title.top,caption.top-(img.top+img.height*245/300)]
          })
          expect(Math.abs(layout[0])).toBeLessThan(18)
          expect(layout[1]).toBeGreaterThan(0)
          expect(layout[1]).toBeLessThan(60)
        }
      }
    }
  }
})

for (const width of [390,1440]) {
  test(`semantic backup and scam feedback at ${width}px`,async ({page})=>{
    await page.setViewportSize({width,height:width===390?844:900})
    await page.emulateMedia({reducedMotion:'reduce'})
    await mkdir(output,{recursive:true})
    await page.goto('/chapter/4')
    await page.locator('[data-position=backup]').screenshot({path:`${output}/${width}-backup.png`})
    await page.locator('.materials + .lesson-grid').screenshot({path:`${output}/${width}-guidance.png`})
    for (const [kind,good,bad] of [['storage',1,0],['loss',0,1],['scam',1,0]] as const) {
      if(kind==='scam') await page.goto('/chapter/6')
      const quiz=page.locator(`.scenario[data-position=${kind}]`)
      const choices=quiz.getByRole('radio')
      const status=quiz.getByRole('status')
      await expect(status).toBeEmpty()
      await choices.nth(bad).focus()
      await page.keyboard.press('Space')
      await expect(status).toContainText('Resposta insegura')
      await expect(choices.nth(bad)).toBeFocused()
      await expect(quiz.locator('.choice[data-feedback=error]')).toHaveCount(1)
      await expect(status.locator('.feedback-title')).toHaveCSS('color','rgb(180, 35, 24)')
      if (kind==='storage') await quiz.screenshot({path:`${output}/${width}-unsafe.png`})
      await choices.nth(good).check()
      await expect(status).toContainText('Resposta correta')
      await expect(status.locator('.feedback-title')).toHaveCSS('color','rgb(35, 122, 69)')
      await expect(quiz.locator('.choice[data-feedback=success]')).toHaveCount(1)
      await expect(quiz.locator('[data-feedback=error]')).toHaveCount(0)
      if (kind==='storage') await quiz.screenshot({path:`${output}/${width}-correct.png`})
      await quiz.getByRole('button',{name:'Tentar novamente'}).click()
      await expect(choices.first()).toBeFocused()
      await expect(status).toBeEmpty()
      await expect(quiz.locator('[data-feedback]')).toHaveCount(0)
    }
    await page.goto('/chapter/3')
    await page.locator('.comparison').screenshot({path:`${output}/${width}-comparison.png`})
    await page.locator('.chapter-nav').screenshot({path:`${output}/${width}-navigation.png`})
    await page.locator('.language').getByRole('button',{name:'EN — English',exact:true}).click()
    await expect(page.locator('.lesson-statement')).toContainText('Self-custody means taking control')
  })
}
