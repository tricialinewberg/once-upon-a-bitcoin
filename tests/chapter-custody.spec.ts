import { expect, test } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import { animatedWebp } from './animated-webp'

const output = 'screenshots/correction-09'
for (const [width,height] of [[360,640],[390,844],[430,932],[768,1024],[1280,720],[1440,900]]) {
  test(`custody lessons and document scrolling at ${width} × ${height}`, async ({browser}) => {
    const context = await browser.newContext({ viewport:{width,height}, hasTouch:width<800, reducedMotion:'reduce' })
    const page = await context.newPage()
    for (const path of ['/',...Array.from({length:7},(_,i)=>'/chapter/'+(i+1))]) {
      await page.goto(path)
      await expect(page.locator('main h1')).toBeVisible()
      const dimensions = await page.evaluate(() => {
        const root = document.documentElement
        const shell = document.querySelector<HTMLElement>('.site-scroll')!
        const footer = document.querySelector('footer')!
        return {
          fits:root.scrollWidth <= root.clientWidth,
          documentScroller:document.scrollingElement === root,
          nested:shell.scrollHeight > shell.clientHeight+1 && /auto|scroll/.test(getComputedStyle(shell).overflowY),
          endGap:root.scrollHeight-Math.round(footer.getBoundingClientRect().bottom+scrollY),
        }
      })
      expect(dimensions, path).toEqual({fits:true,documentScroller:true,nested:false,endGap:0})
    }
    await page.goto('/chapter/3')
    await expect(page.getByRole('heading',{name:'Uma rede de pessoas e computadores.'})).toBeVisible()
    await expect(page.locator('.chapter-lesson .peer-stage img')).toBeVisible()
    await expect(page.locator('.comparison th')).toHaveCount(2)
    const model = page.locator('.custody-switch').getByRole('button',{name:'Autocustódia'})
    if (width<800) await model.tap()
    else { await model.focus(); await page.keyboard.press('Space') }
    await expect(model).toHaveAttribute('aria-pressed','true')
    await expect(page.locator('#custody-explanation')).toContainText('já estão sob sua autocustódia')
    if ([390,1440].includes(width)) {
      await mkdir(output,{recursive:true})
      await page.evaluate(()=>window.scrollTo(0,0))
      await page.screenshot({fullPage:true,path:`${output}/${width}-chapter-iii.png`})
    }
    await page.locator('.chapter-nav a[href="/chapter/4"]').click()
    await expect(page.locator('.backup-visual li')).toHaveCount(12)
    await expect(page.locator('.backup-visual .chapter-art')).toBeVisible()
    await expect(page.locator('.creation-process li')).toHaveCount(3)
    await expect(page.locator('.compromise li')).toHaveCount(3)
    const header = page.locator('.site-header')
    if (width === 390) {
      const input = await context.newCDPSession(page)
      await input.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:520}]})
      for (const y of [480,420,350,285]) {
        await input.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y}]})
      }
      await input.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
      await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(0)
      await input.detach()
      await page.evaluate(()=>window.scrollTo(0,0))
    }
    await page.mouse.move(width/2,height/2)
    await page.mouse.wheel(0,420)
    await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(0)
    expect((await header.boundingBox())!.y).toBe(0)
    await page.keyboard.press('End')
    await expect.poll(()=>page.evaluate(()=>Math.abs(document.documentElement.scrollHeight-innerHeight-scrollY))).toBeLessThanOrEqual(1)
    if ([390,1440].includes(width)) {
      await page.evaluate(()=>window.scrollTo(0,0))
      await page.screenshot({fullPage:true,path:`${output}/${width}-chapter-iv.png`})
    }
    await page.locator('.language').getByRole('button',{name:'English',exact:true}).click()
    await expect(page.getByRole('heading',{name:'Access to your bitcoin.'})).toBeVisible()
    await expect(page.getByText('Treat your wallet as compromised.',{exact:true})).toBeVisible()
    await page.locator('.chapter-nav a[href="/chapter/3"]').click()
    await expect(page.locator('#custody-explanation')).toContainText('You hold the key.')
    await context.close()
  })
}

test('live network and finite backup and custody motion',async ({page,context})=>{
  await page.setViewportSize({width:1280,height:720})
  await mkdir(output,{recursive:true})
  const session = await context.newCDPSession(page)
  const frames: {data:string;time:number}[] = []
  session.on('Page.screencastFrame',event=>{
    if(event.metadata.timestamp && frames.length<60) frames.push({data:event.data,time:event.metadata.timestamp*1000})
    void session.send('Page.screencastFrameAck',{sessionId:event.sessionId}).catch(()=>{})
  })
  async function record(name:string,action:()=>Promise<void>) {
    frames.length=0
    await session.send('Page.startScreencast',{format:'jpeg',quality:80,maxWidth:960,maxHeight:540})
    await action()
    await page.waitForTimeout(1250)
    await session.send('Page.stopScreencast')
    const capture = await page.evaluate(async values=>{
      const canvas = document.createElement('canvas')
      const drawing = canvas.getContext('2d')!
      const shots = []
      for (const frame of values) {
        const image = new Image()
        image.src = 'data:image/jpeg;base64,'+frame.data
        await image.decode()
        canvas.width=image.width; canvas.height=image.height
        drawing.drawImage(image,0,0)
        shots.push({data:canvas.toDataURL('image/webp',.8).split(',')[1],time:frame.time})
      }
      return {shots,width:canvas.width,height:canvas.height}
    },frames)
    expect(new Set(capture.shots.map(shot=>shot.data)).size).toBeGreaterThan(1)
    await writeFile(`${output}/${name}.webp`,animatedWebp(capture.shots,capture.width,capture.height))
  }
  await page.goto('/chapter/3')
  const network = page.locator('.peer-stage')
  await record('network',async()=>{
    await network.scrollIntoViewIfNeeded()
    await expect(network).toHaveAttribute('data-rendered','',{timeout:30000})
    await expect(network.locator('canvas')).toBeVisible()
  })
  const custody=page.locator('.custody-demo')
  await custody.scrollIntoViewIfNeeded()
  await record('custody',async()=>{
    await custody.getByRole('button',{name:'Autocustódia',exact:true}).click()
    await expect(custody.locator('.custody-scene')).toHaveAttribute('data-model','1')
  })
  await record('backup',async()=>{
    await page.goto('/chapter/4')
    await page.locator('.backup-figure').scrollIntoViewIfNeeded()
    await expect(page.locator('.backup-figure')).toHaveAttribute('data-entered','')
  })
})
