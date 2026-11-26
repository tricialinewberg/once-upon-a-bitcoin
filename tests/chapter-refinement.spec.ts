import { expect, test } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { animatedWebp } from './animated-webp'

const sizes = [[360,640],[390,844],[430,932],[768,1024],[1280,720],[1440,900]]
const baseURL = process.env.CHAPTER_REVIEW_URL ?? 'http://127.0.0.1:5173'
const output = 'screenshots/correction-05'

for (const [width,height] of sizes) {
  test(`chapter refinement ${width} × ${height}`,async ({browser}) => {
    test.setTimeout(180000)
    const context = await browser.newContext({baseURL,viewport:{width,height},hasTouch:width<900,isMobile:width<768,reducedMotion:'reduce'})
    try {
      const page = await context.newPage()
      const profile = width===390 ? 'mobile' : width===1440 ? 'desktop' : ''
      if(profile) await mkdir(output,{recursive:true})
      async function capture(selector:string,name:string) {
        if(!profile) return
        const element=page.locator(selector)
        const [bounds,header]=await Promise.all([element.boundingBox(),page.locator('.site-header').boundingBox()])
        if(bounds!.height+header!.height>height) await page.setViewportSize({width,height:Math.ceil(bounds!.height+header!.height+28)})
        await element.scrollIntoViewIfNeeded()
        await Promise.all((await element.locator('img').all()).map(img=>img.evaluate(async (image:HTMLImageElement)=>{if(image.getClientRects().length && getComputedStyle(image).visibility!=='hidden'){image.loading='eager';await image.decode()}})))
        await element.screenshot({path:output+'/'+profile+'-'+name+'.png',animations:'disabled'})
        await page.setViewportSize({width,height})
      }
      async function noOverflow() {
        expect(await page.locator('.site-scroll').evaluate(el=>el.scrollWidth)).toBeLessThanOrEqual(width)
      }
      await page.goto('/chapter/1')
      await expect(page.locator('.chapter-number')).toHaveCount(0)
      await noOverflow()
      await expect(page.locator('.comparison table')).toHaveCSS('border-top-left-radius','16px')
      await expect(page.locator('.history-years button')).toHaveCount(9)
      const benefits = page.locator(width<768?'.benefit-mobile':'.benefit-desktop')
      await benefits.getByRole('button',{name:/Mais autonomia/}).click()
      await expect(benefits.getByText(/públicas e rastreáveis/)).toBeVisible()
      await capture('.chapter-head','i-opening')
      await capture('.chapter-intro','i-network')
      await capture('.comparison','i-comparison')
      await capture('.benefits','i-benefits')
      await capture('.chapter-summary','i-summary')
      for(const year of profile ? ['2008','2009','2010','2012','2017','2018','2021','2022','2024'] : ['2024']) {
        await page.getByRole('button',{name:year,exact:true}).click()
        await capture('.history-band','i-timeline-'+year)
      }
      const event=page.locator('.history-event[aria-hidden="false"]')
      await expect(event.getByRole('heading')).toHaveText('O quarto halving')
      await expect(event.getByText('3,125 BTC',{exact:true})).toBeVisible()
      await page.getByText('Ver todos os eventos',{exact:true}).click()
      await expect(page.locator('.history-all[open] ol')).not.toContainText('ETF')
      await capture('.chapter-ending','i-ending')

      await page.goto('/chapter/2')
      await expect(page.locator('.chapter-number')).toHaveCount(0)
      await expect(page.locator('.scene-coin img')).toBeVisible()
      await noOverflow()
      const input=page.getByRole('textbox',{name:'Satoshis (sats)'})
      await input.fill('2100000000000000')
      await expect(page.locator('.results dd')).toHaveText('21.000.000,00000000 BTC')
      await input.fill('2100000000000001')
      await expect(input).toHaveAttribute('aria-invalid','true')
      await page.getByRole('button',{name:'100.000',exact:true}).click()
      await expect(page.locator('.results dd')).toHaveText('0,00100000 BTC')
      await expect(page.locator('.learning-panel li')).toHaveCount(5)
      await capture('.chapter-head','ii-opening')
      await capture('.supply','ii-coin')
      await capture('[data-position="converter"]','ii-converter')
      await capture('[data-position="volatility"]','ii-volatility')
      await capture('.learning-panel','ii-learning')
      await page.locator('.language').getByRole('button',{name:'EN — English',exact:true}).click()
      await expect(page.locator('.results dd')).toHaveText('0.00100000 BTC')
      await expect(page.locator('.learning-panel li')).toHaveCount(5)
      if(width===390) for(let chapter=3;chapter<=7;chapter++) {
        await page.goto('/chapter/'+chapter)
        await expect(page.locator('.chapter-number')).toHaveCount(0)
        await expect(page.locator('.chapter-head .chapter-accent')).toBeVisible()
        await noOverflow()
      }
    } finally {await context.close()}
  })
}

for (const [chapter,selector,name] of [[1,'.peer-stage','network'],[2,'.scene-coin .scene-image','coin']] as const) {
  test('live '+name+' auto-entry and controls',async ({browser}) => {
    test.setTimeout(160000)
    const context=await browser.newContext({baseURL,viewport:{width:1024,height:768},reducedMotion:'no-preference'})
    try {
      const page=await context.newPage()
      const session=await context.newCDPSession(page)
      const frames:{data:string;time:number}[]=[]
      session.on('Page.screencastFrame',event=>{
        if(event.metadata.timestamp && frames.length<35) frames.push({data:event.data,time:event.metadata.timestamp*1000})
        void session.send('Page.screencastFrameAck',{sessionId:event.sessionId}).catch(()=>{})
      })
      await session.send('Page.startScreencast',{format:'jpeg',quality:77,maxWidth:800,maxHeight:640})
      await page.goto('/chapter/'+chapter,{waitUntil:'domcontentloaded'})
      await page.locator(selector).scrollIntoViewIfNeeded()
      await expect(page.locator(selector+' canvas')).toBeVisible({timeout:35000})
      await expect(page.locator((chapter===1?'.peer-figure':'.scene-coin')+' button')).toHaveCount(0)
      await page.waitForTimeout(650)
      await session.send('Page.stopScreencast')
      await mkdir(output,{recursive:true})
      await page.screenshot({path:output+'/live-'+name+'.png'})
      const captured=await page.evaluate(async frames=>{
        const canvas=document.createElement('canvas')
        const painter=canvas.getContext('2d')!
        const result=[]
        for(const frame of frames) {
          const image=new Image()
          image.src='data:image/jpeg;base64,'+frame.data
          await image.decode()
          canvas.width=image.width;canvas.height=image.height
          painter.drawImage(image,0,0)
          result.push({data:canvas.toDataURL('image/webp',.8).split(',')[1],time:frame.time})
        }
        return {result,width:canvas.width,height:canvas.height}
      },frames)
      if(captured.result.length>1) await writeFile(output+'/'+name+'-motion.webp',animatedWebp(captured.result,captured.width,captured.height))
    } finally {await context.close()}
  })
}

test('chapter coin floats automatically on a touch viewport',async ({browser}) => {
  test.setTimeout(110000)
  const context = await browser.newContext({baseURL,viewport:{width:390,height:844},isMobile:true,hasTouch:true})
  try {
    const page = await context.newPage()
    await page.goto('/chapter/2')
    const stage=page.locator('.scene-coin .scene-host')
    await stage.scrollIntoViewIfNeeded()
    await expect(stage.locator('canvas')).toBeVisible({timeout:35000})
    await expect(page.locator('.scene-coin button')).toHaveCount(0)
    const before=await stage.screenshot()
    await expect.poll(async()=>before.equals(await stage.screenshot()),{timeout:15000}).toBe(false)
  } finally {await context.close()}
})
