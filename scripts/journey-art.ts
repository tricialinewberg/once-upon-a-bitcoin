import * as T from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

// Offline browser renderer for the journey's transparent stills.
export function renderJourney(kind: 'network' | 'wallet') {
  const renderer = new T.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true})
  renderer.setSize(768,460)
  renderer.setClearColor(0x000000,0)
  renderer.toneMapping = T.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.19
  const scene = new T.Scene()
  const room = new RoomEnvironment()
  const generator = new T.PMREMGenerator(renderer)
  const environment = generator.fromScene(room,.04,.1,100,{size:128})
  scene.environment = environment.texture
  scene.environmentIntensity = .79
  const camera = new T.OrthographicCamera(-2.45,2.45,1.468,-1.468,.1,30)
  camera.position.set(3.35,4.5,8)
  camera.lookAt(0,.49,0)
  const light = new T.DirectionalLight(0xffe1bd,2.2)
  light.position.set(-3,7,4)
  scene.add(light,new T.HemisphereLight(0xfff6e5,0x83634d,.72))
  const material = (color:number,roughness:number,metalness=0) => new T.MeshStandardMaterial({color,roughness,metalness})
  const brass = material(0xcb8d49,.28,.8), gold = material(0xf2bf75,.3,.72), edge = material(0x6d4030,.61)
  function box(w:number,h:number,d:number,r:number,m:T.Material,parent:T.Object3D,x=0,y=0,z=0) {
    const object = new T.Mesh(new RoundedBoxGeometry(w,h,d,4,r),m)
    object.position.set(x,y,z); parent.add(object); return object
  }
  function tube(radius:number,thickness:number,m:T.Material,parent:T.Object3D,x=0,y=0,z=0) {
    const object = new T.Mesh(new T.TorusGeometry(radius,thickness,16,64),m)
    object.position.set(x,y,z); parent.add(object); return object
  }
  const shade = document.createElement('canvas')
  shade.width=shade.height=128
  const ctx=shade.getContext('2d')!
  const gradient=ctx.createRadialGradient(64,64,6,64,64,62)
  gradient.addColorStop(0,'rgba(70,40,20,.27)')
  gradient.addColorStop(.5,'rgba(70,40,20,.13)')
  gradient.addColorStop(1,'rgba(70,40,20,0)')
  ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128)
  const map=new T.CanvasTexture(shade)
  const shadow=new T.Mesh(new T.PlaneGeometry(4.4,3),new T.MeshBasicMaterial({map,transparent:true,depthWrite:false}))
  shadow.rotation.x=-Math.PI/2;scene.add(shadow)

  if (kind === 'network') {
    const nodes = [[-.85,.38,-.03],[.64,.32,.0],[-.13,.9,-.79]]
    const stone = material(0xe2c7a2,.6), dark = material(0x87684a,.55)
    for (const [x,y,z] of nodes) {
      box(.67,.64,.67,.085,stone,scene,x,y,z)
      box(.39,.015,.39,.07,gold,scene,x,y+.324,z)
      for (let dot=0;dot<3;dot++) box(.03,.035,.016,.009,dark,scene,x-.09+dot*.09,y+.08,z+.336)
      box(.32,.035,.015,.007,dark,scene,x,y-.06,z+.336)
    }
    for (const [i,j] of [[0,1],[0,2],[1,2]]) {
      const a=new T.Vector3(...nodes[i]), b=new T.Vector3(...nodes[j]), d=b.clone().sub(a)
      const rod=new T.Mesh(new T.CylinderGeometry(.029,.029,d.length(),12),brass)
      rod.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.clone().normalize())
      rod.position.copy(a).lerp(b,.5);scene.add(rod)
    }
    const glass=new T.Group()
    glass.position.set(.33,.99,.69);glass.rotation.set(-.29,.35,-.52);scene.add(glass)
    tube(.64,.064,brass,glass)
    tube(.58,.026,gold,glass,0,0,.045)
    tube(.658,.024,gold,glass,0,0,-.022)
    const lens=new T.Mesh(new T.CircleGeometry(.58,64),new T.MeshPhysicalMaterial({color:0xd3dce0,transparent:true,opacity:.16,roughness:.14,metalness:.16,side:T.DoubleSide,depthWrite:false}))
    glass.add(lens)
    const shine=new T.Mesh(new T.TorusGeometry(.48,.009,6,32,Math.PI*.62),new T.MeshBasicMaterial({color:0xfff0c9,transparent:true,opacity:.55}))
    shine.position.z=.025;shine.rotation.z=.48;glass.add(shine)
    box(.215,1.02,.21,.075,edge,glass,0,-1.09,0)
    box(.245,.2,.234,.038,gold,glass,0,-.737,0)
    box(.224,.08,.216,.034,brass,glass,0,-1.575,0)
  } else {
    const leatherCanvas=document.createElement('canvas')
    leatherCanvas.width=leatherCanvas.height=256
    const c=leatherCanvas.getContext('2d')!
    c.fillStyle='#995e46';c.fillRect(0,0,256,256)
    let seed=19
    const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296)
    for(let i=0;i<16000;i++){c.fillStyle=i%2?'#e4ac8730':'#41221930';c.fillRect(random()*256,random()*256,random()*2+1,1)}
    const leatherMap=new T.CanvasTexture(leatherCanvas)
    leatherMap.colorSpace=T.SRGBColorSpace
    const leather=new T.MeshStandardMaterial({map:leatherMap,roughness:.64})
    const wallet=new T.Group();wallet.rotation.set(-.18,-.17,-.17);wallet.position.set(-.22,.84,0);scene.add(wallet)
    box(2.1,1.42,.47,.15,edge,wallet)
    box(2.13,1.43,.15,.13,leather,wallet,0,0,.22)
    box(2.08,1.37,.16,.12,leather,wallet,0,0,-.225)
    box(1.86,.27,.07,.07,edge,wallet,0,.43,.303)
    const thread=material(0xf0c299,.92)
    for(let i=0;i<18;i++) for(const y of [-.553,.565]) box(.047,.012,.014,.005,thread,wallet,-.855+i*.10,y,.305)
    for(let i=0;i<9;i++) for(const x of [-.924,.916]) box(.013,.047,.014,.006,thread,wallet,x,-.43+i*.107,.306)
    box(.58,.39,.088,.102,leather,wallet,.83,-.18,.326)
    const snap=new T.Mesh(new T.CylinderGeometry(.085,.085,.046,32),gold)
    snap.rotation.x=Math.PI/2;snap.position.set(.8,-.18,.39);wallet.add(snap)
    const key=new T.Group();key.position.set(.73,.25,.92);key.rotation.set(-.92,.08,-.72);scene.add(key)
    tube(.26,.065,brass,key,-.51)
    tube(.255,.026,gold,key,-.51,0,.043)
    box(.97,.123,.111,.029,brass,key,.16)
    box(.10,.29,.118,.018,brass,key,.49,-.10)
    box(.11,.20,.117,.016,gold,key,.63,-.059)
    box(.54,.023,.012,.005,gold,key,.06,.034,.057)
  }
  renderer.render(scene,camera)
  const image=renderer.domElement.toDataURL('image/webp',.90)
  generator.dispose();environment.dispose();room.dispose();renderer.dispose();renderer.forceContextLoss()
  return image
}
