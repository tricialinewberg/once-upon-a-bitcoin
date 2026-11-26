import * as T from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

const clamp = (n: number) => T.MathUtils.clamp(n,0,1)
const smooth = (n: number) => {
  const t = clamp(n)
  return t*t*(3-2*t)
}

type PaintingContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

function texture(size: number, paint: (context: PaintingContext) => void) {
  const canvas = typeof document === 'undefined' ? new OffscreenCanvas(size,size) : document.createElement('canvas')
  canvas.width = canvas.height = size
  paint(canvas.getContext('2d')!)
  const map = new T.CanvasTexture(canvas)
  map.colorSpace = T.SRGBColorSpace
  map.anisotropy = 4
  return map
}

function grain(ctx: PaintingContext, size: number, base: string, count: number) {
  let seed = 18
  const rand = () => ((seed = (Math.imul(seed,1664525)+1013904223) >>> 0)/4294967296)
  ctx.fillStyle = base
  ctx.fillRect(0,0,size,size)
  for (let i=0;i<count;i++) {
    ctx.fillStyle = i%2 ? 'rgba(73,39,18,.12)' : 'rgba(255,247,222,.19)'
    ctx.fillRect(rand()*size,rand()*size,.7+rand()*2.4,.45+rand()*1.1)
  }
}

const width = 1.73
const depth = 2.16
const pageHeight = (u: number) => .18 + .22*Math.sin(Math.PI*u)*Math.exp(-u*.52) - .055*u
function leafSurface() {
  const geometry = new T.PlaneGeometry(width,depth,48,20)
  const position = geometry.attributes.position
  for (let i=0;i<position.count;i++) {
    const u = position.getX(i)/width+.5
    position.setXYZ(i,u*width,pageHeight(u),-position.getY(i))
  }
  geometry.computeVertexNormals()
  return geometry
}

function coverMesh(material: T.Material) {
  const cover = new T.Mesh(new RoundedBoxGeometry(1.84,.092,2.27,4,.043),material)
  cover.position.set(.92,.008,0)
  return cover
}

function makeBook() {
  const book = new T.Group()
  const hinge = new T.Group()
  const leaves: T.Group[] = []
  const leatherTexture = texture(512,ctx => grain(ctx,512,'#713b29',22000))
  const leather = new T.MeshStandardMaterial({map:leatherTexture,roughness:.69,metalness:.03})
  const edge = new T.MeshStandardMaterial({color:0xc5a382,roughness:.89,side:T.DoubleSide})
  const ridges = new T.LineBasicMaterial({color:0x8c6242,transparent:true,opacity:.27})
  const spine = new T.Mesh(new RoundedBoxGeometry(.16,.116,2.28,4,.048),leather)
  spine.position.y = -.002
  book.add(spine)
  const paperTexture = texture(1024,ctx => {
    grain(ctx,1024,'#f3e2c2',27000)
    ctx.strokeStyle = '#ab8155'
    ctx.lineWidth = 2
    ctx.strokeRect(92,89,840,846)
    ctx.strokeStyle = 'rgba(108,77,44,.23)'
    ctx.strokeRect(104,101,816,822)
    ctx.fillStyle = 'rgba(84,58,35,.61)'
    ctx.fillRect(443,162,138,4)
    for (let row=0;row<23;row++) {
      const y = 230+row*26 + (row>7 ? 16 : 0) + (row>16 ? 16 : 0)
      let x = 155 + (row%8===0 ? 38 : 0)
      const max = row%8===7 ? 655 : 875
      for (let word=0;x<max;word++) {
        const length = Math.min(max-x,18+((row*19+word*31)%73))
        ctx.fillRect(x,y,length,2.6+(word%3)*.5)
        x += length + 8 + word%4
      }
    }
  })
  const paper = new T.MeshStandardMaterial({map:paperTexture,roughness:.86,side:T.DoubleSide})
  const page = leafSurface()
  for (const side of [-1,1]) {
    const half = new T.Group()
    leaves.push(half)
    half.scale.x = side
    half.add(coverMesh(leather),new T.Mesh(page,paper))
    const rim = new T.PlaneGeometry(width,1,52,18)
    const vertices = rim.attributes.position
    const rimBack = rim.clone()
    for (const [mesh,z] of [[rim,depth/2],[rimBack,-depth/2]] as const) {
      const points = mesh.attributes.position
      for (let i=0;i<vertices.count;i++) {
        const u = points.getX(i)/width+.5
        const v = points.getY(i)+.5
        points.setXYZ(i,u*width,T.MathUtils.lerp(.057,pageHeight(u),v),z)
      }
      mesh.computeVertexNormals()
      half.add(new T.Mesh(mesh,edge))
    }
    const fore = new T.Mesh(new T.PlaneGeometry(depth,pageHeight(1)-.057),edge)
    fore.rotation.y = Math.PI/2
    fore.position.set(width,(pageHeight(1)+.057)/2,0)
    half.add(fore)
    const pageEdges: T.Vector3[] = []
    for (let layer=1;layer<=22;layer++) {
      const fraction = layer/23
      for (const z of [-depth/2-.001,depth/2+.001]) {
        const points = Array.from({length:32},(_,i) => {
          const u = i/31
          return new T.Vector3(u*width,.057+(pageHeight(u)-.057)*fraction+Math.sin(u*25+layer)*.002,z)
        })
        for (let i=1;i<points.length;i++) pageEdges.push(points[i-1],points[i])
      }
    }
    half.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(pageEdges),ridges))
    const foil = new T.LineBasicMaterial({color:0xd0a36d,transparent:true,opacity:.65})
    for (const inset of [.12,.165]) {
      const corners = [[inset,-1.12+inset],[1.84-inset,-1.12+inset],[1.84-inset,1.12-inset],[inset,1.12-inset],[inset,-1.12+inset]]
      half.add(new T.Line(new T.BufferGeometry().setFromPoints(corners.map(([x,z]) => new T.Vector3(x,-.04,z))),foil))
    }
    if (side < 0) hinge.add(half)
    else book.add(half)
  }
  book.add(hinge)
  return {book,hinge,leaves}
}

export function makeMedallion() {
  const group = new T.Group()
  const gold = new T.MeshStandardMaterial({color:0xc88634,metalness:.87,roughness:.3})
  const raised = new T.MeshStandardMaterial({color:0xf2c06e,metalness:.85,roughness:.24})
  const inlay = new T.MeshStandardMaterial({color:0x946127,metalness:.58,roughness:.4})
  const tooling = texture(1024,ctx => {
    grain(ctx,1024,'#c08b46',30000)
    ctx.translate(512,512)
    for (let i=0;i<144;i++) {
      ctx.save()
      ctx.rotate(i*Math.PI/72)
      ctx.strokeStyle = i%4 ? 'rgba(91,53,19,.24)' : 'rgba(108,64,25,.44)'
      ctx.beginPath(); ctx.moveTo(377,0);ctx.lineTo(457,0);ctx.stroke()
      ctx.restore()
    }
    for (const radius of [333,344,369,463,476]) {
      ctx.lineWidth = radius===369 ? 4 : 2
      ctx.strokeStyle = '#895f32'
      ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.stroke()
    }
  })
  const faceMaterial = new T.MeshStandardMaterial({map:tooling,metalness:.75,roughness:.33})
  const body = new T.Mesh(new T.CylinderGeometry(.63,.63,.124,128),gold)
  body.rotation.x = Math.PI/2
  group.add(body)
  const milling = new T.InstancedMesh(new T.BoxGeometry(.014,.019,.106),raised,120)
  const matrix = new T.Object3D()
  for (let i=0;i<milling.count;i++) {
    const angle = i*Math.PI*2/milling.count
    matrix.position.set(Math.cos(angle)*.625,Math.sin(angle)*.625,0)
    matrix.rotation.z = angle
    matrix.updateMatrix()
    milling.setMatrixAt(i,matrix.matrix)
  }
  group.add(milling)
  const glyph = new T.Shape()
  glyph.moveTo(-.255,.29);glyph.lineTo(.014,.29)
  glyph.bezierCurveTo(.28,.29,.30,.078,.166,.025)
  glyph.bezierCurveTo(.34,-.02,.30,-.29,.026,-.29)
  glyph.lineTo(-.255,-.29);glyph.lineTo(-.255,-.191);glyph.lineTo(-.17,-.191)
  glyph.lineTo(-.17,.191);glyph.lineTo(-.255,.191);glyph.closePath()
  for (const [bottom,top] of [[.073,.196],[-.192,-.013]]) {
    const cutout = new T.Path()
    cutout.moveTo(-.064,bottom);cutout.lineTo(.02,bottom)
    cutout.bezierCurveTo(.149,bottom,.149,top,.02,top)
    cutout.lineTo(-.064,top);cutout.closePath()
    glyph.holes.push(cutout)
  }
  const emboss = new T.ExtrudeGeometry(glyph,{depth:.028,bevelThickness:.012,bevelSize:.009,bevelSegments:3,curveSegments:18})
  for (const side of [-1,1]) {
    const face = new T.Group()
    face.rotation.y = side < 0 ? Math.PI : 0
    face.position.z = .064*side
    face.add(new T.Mesh(new T.CircleGeometry(.604,128),faceMaterial))
    for (const [radius,tube,material] of [[.595,.013,raised],[.533,.009,inlay],[.481,.005,raised]] as const) {
      const ring = new T.Mesh(new T.TorusGeometry(radius,tube,10,128),material)
      ring.position.z = .011
      face.add(ring)
    }
    const symbol = new T.Group()
    symbol.position.z = .012
    symbol.rotation.z = -.085
    symbol.add(new T.Mesh(emboss,raised))
    for (const x of [-.092,.045]) for (const y of [-.316,.316]) {
      const stem = new T.Mesh(new RoundedBoxGeometry(.049,.135,.032,3,.012),raised)
      stem.position.set(x,y,.016)
      symbol.add(stem)
    }
    face.add(symbol)
    group.add(face)
  }
  return group
}

export function createHeroScene(canvas: HTMLCanvasElement | OffscreenCanvas, pixelRatio: number) {
  const renderer = new T.WebGLRenderer({canvas,alpha:true,antialias:true,preserveDrawingBuffer:true})
  renderer.setClearColor(0x000000,0)
  renderer.setPixelRatio(pixelRatio)
  renderer.localClippingEnabled = true
  renderer.toneMapping = T.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.28

  const scene = new T.Scene()
  const room = new RoomEnvironment()
  const generator = new T.PMREMGenerator(renderer)
  const environment = generator.fromScene(room,.04,.1,100,{size:128})
  scene.environment = environment.texture
  generator.dispose()
  room.dispose()
  scene.environmentIntensity = .78
  const camera = new T.OrthographicCamera(-3.22,3.22,1.55,-1.55,.1,35)
  camera.position.set(2.8,4.35,8.5)
  camera.lookAt(0,.52,0)
  const key = new T.DirectionalLight(0xffe2c1,2)
  key.position.set(-3,6,4)
  const fill = new T.DirectionalLight(0xfff4e4,.77)
  fill.position.set(4,2,-5)
  scene.add(key,fill,new T.HemisphereLight(0xfff6e5,0x83634d,.72))

  const {book,hinge,leaves} = makeBook()
  const coin = makeMedallion()
  const paperLine = new T.Plane(new T.Vector3(0,1,0),-.255)
  coin.traverse(object => {
    if (object instanceof T.Mesh) (object.material as T.Material).clippingPlanes = [paperLine]
  })
  const shadowMap = texture(256,ctx => {
    const gradient = ctx.createRadialGradient(128,128,14,128,128,124)
    gradient.addColorStop(0,'rgba(66,39,22,.29)')
    gradient.addColorStop(.47,'rgba(79,50,30,.18)')
    gradient.addColorStop(1,'rgba(79,50,30,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0,0,256,256)
  })
  const shadow = new T.Mesh(new T.PlaneGeometry(5.28,3.45),new T.MeshBasicMaterial({
    map:shadowMap,transparent:true,depthWrite:false,toneMapped:false,
  }))
  shadow.rotation.x = -Math.PI/2
  shadow.position.set(0,-.059,.075)
  scene.add(book,shadow,coin)

  function draw(time: number) {
    const opening = smooth(time/2.15)
    const reveal = smooth((time-.50)/1.27)
    const ambient = smooth((time-2.30)/.6)
    const turning = Math.sin(Math.PI*opening)
    camera.zoom = 1-.13*turning
    camera.lookAt(0,.52+.18*turning,0)
    camera.updateProjectionMatrix()
    hinge.rotation.z = -Math.PI*(1-opening)
    hinge.position.y = .39*(1-opening)
    for (const leaf of leaves) leaf.scale.y = .61+.39*opening
    book.position.x = -.52*(1-opening)
    coin.visible = reveal > 0
    coin.position.set(0,-.12+1.31*reveal+ambient*.032*Math.sin(time*1.45),-.15)
    coin.rotation.set(.07,-.94+.94*reveal+ambient*.072*Math.sin(time*1.08),-.15+.09*reveal)
    coin.scale.setScalar(.6+.4*reveal)
    shadow.scale.x = .64+.36*opening
    shadow.position.x = .32*(1-opening)
    renderer.render(scene,camera)
    return {opening,reveal}
  }

  function resize(width: number, height: number) {
    const halfHeight = 3.22*height/width
    camera.top = halfHeight
    camera.bottom = -halfHeight
    camera.updateProjectionMatrix()
    renderer.setSize(width,height,false)
  }

  function dispose() {
    const textures = new Set<T.Texture>()
    const materials = new Set<T.Material>()
    scene.traverse(object => {
      if (object instanceof T.Mesh || object instanceof T.Line) {
        object.geometry.dispose()
        materials.add(object.material as T.Material)
      }
    })
    for (const material of materials) {
      const map = (material as T.MeshStandardMaterial).map
      if (map) textures.add(map)
      material.dispose()
    }
    textures.forEach(map => map.dispose())
    environment.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
  }
  return {draw,resize,dispose}
}
