import { test } from '@playwright/test'
import { writeFile } from 'node:fs/promises'

test('render the hero opening atlas from the approved scene',async ({page}) => {
  test.skip(process.env.BUILD_HERO_ATLAS !== '1','Run only when the hero motion asset needs regeneration')
  test.setTimeout(300000)
  await page.goto('/chapter/1',{waitUntil:'domcontentloaded'})
  const data = await page.evaluate(async () => {
    const modulePath = '/src/hero-scene.ts'
    const {createHeroScene} = await import(modulePath)
    const canvas = document.createElement('canvas')
    const width = 320, height = 154, columns = 8, rows = 5
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
    const data = atlas.toDataURL('image/webp',.76)
    scene.dispose()
    return data
  })
  await writeFile('public/hero-intro-atlas.webp',Buffer.from(data.split(',')[1],'base64'))
})
