import { expect, test } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { animatedWebp } from './animated-webp'

const output = 'screenshots/correction-08'
const widths = [[360,640],[390,844],[430,932],[768,1024],[1280,720],[1440,900]]

for (const [width,height] of widths) {
  test(`chapter refinements at ${width} × ${height}`,async ({page}) => {
    await page.setViewportSize({width,height})
    await page.emulateMedia({reducedMotion:'reduce'})
    const capture = width===390 || width===1440
    if(capture) await mkdir(output,{recursive:true})
    async function screenshot(selector:string,label:string) {
      if(!capture) return
      const item=page.locator(selector)
      const bounds=(await item.boundingBox())!
      const header=(await page.locator('.site-header').boundingBox())!
      if(bounds.height+header.height>height) await page.setViewportSize({width,height:Math.ceil(bounds.height+header.height+32)})
      await item.scrollIntoViewIfNeeded()
      await item.screenshot({path:`${output}/${width}-${label}.png`})
      await page.setViewportSize({width,height})
    }
    const noOverflow=async()=>expect(await page.locator('.site-scroll').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true)
    await page.goto('/chapter/1')
    await page.evaluate(()=>document.fonts.ready)
    const title=page.locator('.chapter-ending h2')
    await expect(title).toHaveCSS('text-wrap','wrap')
    if(width>=1280) {
      const lineCount=await title.evaluate(node=>{
        const range=document.createRange()
        range.selectNodeContents(node)
        return new Set(Array.from(range.getClientRects(),rect=>Math.round(rect.y))).size
      })
      expect(lineCount).toBe(1)
    }
    const answer=page.locator('.chapter-answer')
    await expect(answer).toHaveText('Não!')
    expect(await answer.evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBeLessThanOrEqual(26)
    await noOverflow()
    await screenshot('.chapter-ending','chapter-i-conclusion')

    await page.goto('/chapter/2')
    const supply=page.locator('.supply')
    await expect(supply.locator('img')).toBeVisible()
    await expect(supply.locator('canvas,button')).toHaveCount(0)
    const converter=page.locator('[data-position="converter"]')
    const notice=converter.locator('.volatility-notice')
    await expect(notice).toContainText('Oscilações de mercado não significam, por si só')
    const warning=(await notice.boundingBox())!
    const controls=(await converter.locator('.lab').boundingBox())!
    expect(width>=768 ? warning.x<controls.x : warning.y+warning.height<=controls.y).toBe(true)
    const field=converter.locator('input')
    await field.fill('100000')
    await expect(converter.locator('.results dd')).toHaveText('0,00100000 BTC')
    await expect(page.getByRole('heading',{name:'O preço muda.',exact:true})).toHaveCount(0)
    await expect(page.locator('.volatility-visual')).toHaveCount(0)
    await expect(page.locator('.volatility-statement')).toHaveText('Uma queda de preço não significa, por si só, que a rede Bitcoin deixou de funcionar.')
    await expect(page.getByText('O que é HODL?',{exact:true})).toBeVisible()
    await expect(page.locator('.learning-panel li')).toHaveCount(5)
    await noOverflow()
    await screenshot('.supply','chapter-ii-coin')
    await screenshot('[data-position="converter"]','chapter-ii-converter')
    await screenshot('[data-position="volatility"]','chapter-ii-volatility')
    await page.locator('.language').getByRole('button',{name:'EN — English',exact:true}).click()
    await expect(notice).toContainText('Keep in mind:')
    await expect(page.getByText('What is HODL?',{exact:true})).toBeVisible()
    await expect(converter.locator('.results dd')).toHaveText('0.00100000 BTC')
  })
}

test('coin stays visible through the WebGL handoff and floats automatically',async ({page,context})=>{
  test.setTimeout(110000)
  await page.setViewportSize({width:1440,height:900})
  const session=await context.newCDPSession(page)
  const frames:{data:string;time:number}[]=[]
  session.on('Page.screencastFrame',event=>{
    if(event.metadata.timestamp && frames.length<45) frames.push({data:event.data,time:event.metadata.timestamp*1000})
    void session.send('Page.screencastFrameAck',{sessionId:event.sessionId}).catch(()=>{})
  })
  await session.send('Page.startScreencast',{format:'jpeg',quality:78,maxWidth:960,maxHeight:650})
  await page.goto('/chapter/2',{waitUntil:'domcontentloaded'})
  const scene=page.locator('.scene-coin')
  await scene.scrollIntoViewIfNeeded()
  await expect(scene.locator('[data-coin-ready] canvas')).toBeVisible({timeout:35000})
  await expect(scene.locator('img')).toHaveCSS('opacity','0')
  await expect(scene.locator('button')).toHaveCount(0)
  const canvas=scene.locator('canvas')
  expect((await canvas.boundingBox())!.width).toBeGreaterThan(300)
  const first=await canvas.screenshot()
  await expect.poll(async()=>first.equals(await canvas.screenshot()),{timeout:8000}).toBe(false)
  await page.waitForTimeout(2900)
  const resting=await canvas.screenshot()
  await page.waitForTimeout(300)
  expect(resting.equals(await canvas.screenshot())).toBe(true)
  await session.send('Page.stopScreencast')
  await mkdir(output,{recursive:true})
  await scene.screenshot({path:output+'/1440-live-coin.png'})
  const captured=await page.evaluate(async frames=>{
    const canvas=document.createElement('canvas')
    const ctx=canvas.getContext('2d')!
    const shots=[]
    for(const frame of frames) {
      const image=new Image()
      image.src='data:image/jpeg;base64,'+frame.data
      await image.decode()
      canvas.width=image.width; canvas.height=image.height
      ctx.drawImage(image,0,0)
      shots.push({data:canvas.toDataURL('image/webp',.8).split(',')[1],time:frame.time})
    }
    return {shots,width:canvas.width,height:canvas.height}
  },frames)
  if(captured.shots.length>1) await writeFile(output+'/coin-motion.webp',animatedWebp(captured.shots,captured.width,captured.height))
})
