import { test } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

test('render the shared chapter objects',async ({page}) => {
  test.skip(process.env.RENDER_CHAPTER_OBJECTS !== '1')
  test.setTimeout(240000)
  await page.goto('/chapter/7',{waitUntil:'domcontentloaded'})
  const assets = await page.evaluate(async () => {
    const path = '/src/chapter-models.ts', threePath = '/node_modules/three/build/three.module.js'
    const model = await import(path)
    const T = await import(threePath)
    const renderer = new T.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true})
    renderer.setSize(360,300,false)
    renderer.toneMapping=T.ACESFilmicToneMapping
    renderer.toneMappingExposure=1.22
    const scene=new T.Scene()
    const camera=new T.OrthographicCamera(-1,1,.833,-.833,.1,30)
    camera.position.set(1.25,1.1,5)
    camera.lookAt(0,0,0)
    const key=new T.DirectionalLight(0xffecd5,2.7)
    key.position.set(-3,4,5)
    const fill=new T.DirectionalLight(0xffdfb9,1.4)
    fill.position.set(4,2,-2)
    scene.add(key,fill,new T.HemisphereLight(0xfff3dc,0xb69a80,2.15))
    const assets=[]
    for(const name of model.objects) {
      const object=model.chapterObject(name)
      scene.add(object)
      renderer.render(scene,camera)
      assets.push([name,renderer.domElement.toDataURL('image/webp',.88).split(',')[1]])
      scene.remove(object)
    }
    renderer.dispose()
    return assets
  })
  await mkdir('public/chapter-art',{recursive:true})
  await Promise.all(assets.map(([name,data])=>writeFile('public/chapter-art/'+name+'.webp',Buffer.from(data,'base64'))))
})

test('render the peer network resting frame',async ({page}) => {
  test.skip(process.env.RENDER_PEER_POSTER !== '1')
  test.setTimeout(120000)
  await page.goto('/chapter/7',{waitUntil:'domcontentloaded'})
  const data = await page.evaluate(async () => {
    const path='/src/scene.ts'
    const {mount}=await import(path)
    const host=document.createElement('div')
    Object.assign(host.style,{position:'fixed',inset:'0 auto auto 0',width:'650px',height:'351px'})
    document.body.append(host)
    const data=await new Promise<string>(resolve=>{
      const driver=mount(host,'peer-network',{x:0,y:0,action:0},()=>{},()=>{
        resolve(host.querySelector('canvas')!.toDataURL('image/webp',.9).split(',')[1])
        queueMicrotask(()=>driver.destroy())
      })
    })
    host.remove()
    return data
  })
  await writeFile('public/chapter-art/peer-network.webp',Buffer.from(data,'base64'))
})
