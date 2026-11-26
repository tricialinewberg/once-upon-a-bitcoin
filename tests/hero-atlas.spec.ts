import { test } from '@playwright/test'
import { writeFile } from 'node:fs/promises'

test('render the hero opening atlas from the approved scene',async ({page}) => {
  const dense = process.env.BUILD_HERO_ATLAS === '480'
  test.skip(process.env.BUILD_HERO_ATLAS !== '1' && !dense,'Run only when the hero motion asset needs regeneration')
  test.setTimeout(300000)
  await page.goto('/chapter/1',{waitUntil:'domcontentloaded'})
  const data = await page.evaluate(async ({width,height,quality}) => {
    const modulePath = '/src/hero-scene.ts'
    const {createHeroScene} = await import(modulePath)
    const canvas = document.createElement('canvas')
    const columns = 8, rows = 5
    const atlas = document.createElement('canvas')
    atlas.width = width*columns
    atlas.height = height*rows
    const context = atlas.getContext('2d')!
    const scene = createHeroScene(canvas,1)
    scene.resize(width,height)
    for (let frame=0;frame<columns*rows;frame++) {
      const time = (frame+1)*2.15/(columns*rows)
      scene.draw(time)
      context.drawImage(canvas,(frame%columns)*width,Math.floor(frame/columns)*height)
    }
    const data = atlas.toDataURL('image/webp',quality)
    scene.dispose()
    return data
  },dense ? {width:480,height:231,quality:.8} : {width:320,height:154,quality:.76})
  const path = dense ? 'public/hero-intro-atlas-480.webp' : 'public/hero-intro-atlas.webp'
  await writeFile(path,Buffer.from(data.split(',')[1],'base64'))
})
