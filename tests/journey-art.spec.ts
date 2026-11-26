import { test } from '@playwright/test'
import { writeFile } from 'node:fs/promises'

test('export the journey artwork',async ({page}) => {
  test.skip(process.env.RENDER_JOURNEY_ART !== '1','Offline asset export')
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/')
  for (const asset of ['network','wallet'] as const) {
    const data = await page.evaluate(async kind => {
      const path = '/scripts/journey-art.ts'
      const {renderJourney} = await import(path)
      return renderJourney(kind) as string
    },asset)
    await writeFile(`public/journey-${asset}.webp`,Buffer.from(data.split(',')[1],'base64'))
  }
})
