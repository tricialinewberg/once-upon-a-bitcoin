import { makeMedallion } from './hero-scene'
import * as T from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

export type SceneKind = 'coin' | 'network' | 'custody' | 'backup' | 'peer-network'
export type SceneState = {x: number; y: number; action: number}
const matte = (color: number) => new T.MeshStandardMaterial({color, roughness:.77})
const metal = (color: number) => new T.MeshStandardMaterial({color, metalness:.47, roughness:.38})
const brass = () => metal(0xc48a44)
const gold = () => metal(0xedb96c)

function box(w: number,h: number,d: number, material: T.Material, radius = .045) {
  return new T.Mesh(new RoundedBoxGeometry(w,h,d,2,radius),material)
}
function disc(radius: number, depth: number, material: T.Material) {
  const mesh = new T.Mesh(new T.CylinderGeometry(radius,radius,depth,80),material)
  mesh.rotation.x = Math.PI / 2
  return mesh
}
function key() {
  const group = new T.Group(), material = brass()
  const ring = new T.Mesh(new T.TorusGeometry(.27,.086,12,48),material)
  ring.position.x = -.46
  const stem = box(.84,.13,.16,material)
  stem.position.x = .08
  group.add(ring,stem)
  for (const x of [.24,.43]) {
    const tooth = box(.13,.22,.15,material)
    tooth.position.set(x,-.14,0)
    group.add(tooth)
  }
  return group
}

export function mount(host: HTMLDivElement, kind: SceneKind, initial: SceneState, onLost: () => void, onFirstFrame?: () => void) {
  const peer = kind === 'peer-network'
  const coinCycle = 2.8
  const renderer = new T.WebGLRenderer({antialias:true,alpha:true})
  renderer.setPixelRatio(Math.min(devicePixelRatio,peer && matchMedia('(pointer: coarse)').matches ? 1.25 : 1.6))
  renderer.outputColorSpace = T.SRGBColorSpace
  renderer.toneMapping = T.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.28
  host.append(renderer.domElement)
  renderer.domElement.setAttribute('aria-hidden','true')
  renderer.domElement.addEventListener('webglcontextlost',onLost)
  const scene = new T.Scene()
  const camera = new T.PerspectiveCamera(34,1,.1,40)
  camera.position.set(0,peer ? 5.4 : .8,kind === 'coin' ? 5.7 : peer ? 7.8 : 7.5)
  camera.lookAt(0,0,0)
  scene.add(new T.HemisphereLight(0xfff4dc,0xb99e84,2.4))
  const light = new T.DirectionalLight(0xffead3,2.4)
  light.position.set(-3,5,6)
  const fill = new T.DirectionalLight(0xfff0dc,1.7)
  fill.position.set(4,2,-3)
  scene.add(light,fill)
  const model = new T.Group()
  scene.add(model)
  const shadow = contactShadow(peer ? 4.8 : 3.4)
  if (shadow) {
    shadow.position.y = peer ? -.06 : -1.06
    scene.add(shadow)
  }
  let flow: ((time: number) => void) | undefined
  let update: (state: SceneState, eased: number, previous: number) => void
  if (kind === 'coin') {
    const object = makeMedallion()
    object.scale.setScalar(1.58)
    model.add(object)
    update = () => object.rotation.set(-.10,.32,-.08)
    flow = time => {
      const visibleHeight = 2 * camera.position.length() * Math.tan(T.MathUtils.degToRad(camera.fov / 2))
      const progress = Math.min(time / coinCycle,1)
      object.position.y = (8 * visibleHeight / host.clientHeight) * Math.sin(Math.PI * progress) ** 2
    }
  } else if (kind === 'custody') {
    const safe = box(1.26,1.25,.75,matte(0xe7cfad),.10)
    const door = box(1.04,1.05,.11,metal(0xba9066))
    const dial = disc(.19,.15,brass())
    safe.position.set(-1.18,-.37,0); door.position.set(-1.18,-.37,.4); dial.position.set(-1.18,-.35,.5)
    const wallet = box(1.43,.93,.4,matte(0x874828),.12)
    const strap = box(.49,.28,.13,matte(0xa96838),.065)
    const clasp = disc(.075,.04,gold())
    wallet.position.set(1.18,-.48,0); strap.position.set(1.59,-.49,.25); clasp.position.set(1.54,-.49,.33)
    const object = key()
    model.add(safe,door,dial,wallet,strap,clasp,object)
    update = ({action},eased,previous) => {
      object.position.set(T.MathUtils.lerp(previous,action,eased)*2.36-1.18,.78+Math.sin(Math.PI*eased)*.16,.32)
      object.rotation.z = -.24+eased*.18
    }
  } else if (kind === 'backup') {
    const card = new T.Group(), ink = matte(0x997655)
    card.add(box(2.5,1.65,.11,matte(0xf5dbac),.12))
    for (let i=0;i<12;i++) {
      const mask = box(.57,.025,.02,ink,.008)
      mask.position.set(i<6 ? -.63 : .63,.54-i%6*.215,.065)
      card.add(mask)
    }
    const shell = new T.Group()
    shell.add(box(2.65,1.8,.12,matte(0xa96f51),.1))
    const front = box(2.49,1.63,.045,matte(0xbd8864),.08)
    front.position.z = .07
    shell.add(front)
    const closure = disc(.105,.045,brass())
    closure.position.set(0,-.48,.106)
    shell.add(closure)
    shell.position.set(.14,-.17,-.19)
    model.add(shell,card)
    update = ({action},eased,previous) => {
      const stored = T.MathUtils.lerp(previous,action,eased)
      card.position.set(stored*.14,-stored*.17,0)
      card.rotation.y = -.33*(1-stored)
      shell.position.z = -.55+stored*.75
    }
  } else if (peer) {
    const positions = [[-1.99,.07,.15],[-1.04,.12,-1.45],[1.25,.11,-1.40],[2.08,.10,.24],[.8,.13,1.45],[-1.12,.10,1.52]]
      .map(([x,y,z]) => new T.Vector3(x,y,z))
    const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,4],[0,3],[2,5]]
    const base = matte(0xb68867), ceramic = matte(0xe5ceb0), dark = matte(0x9c7760)
    const face = metal(0xc79a69), indicator = new T.MeshBasicMaterial({color:0xffc77d})
    positions.forEach((position,index) => {
      const unit = new T.Group()
      unit.position.copy(position)
      unit.rotation.y = -.25+index*.11
      const platform = box(.73,.09,.52,base,.045)
      const casing = box(.68,.24,.47,ceramic,.05)
      casing.position.y = .15
      const panel = box(.53,.12,.025,face,.012)
      panel.position.set(0,.15,.238)
      const port = box(.18,.026,.012,dark,.006)
      port.position.set(-.11,.15,.254)
      const lamp = box(.057,.025,.014,indicator,.008)
      lamp.position.set(.15,.15,.255)
      for(let i=0;i<3;i++) {
        const ridge = box(.20,.012,.014,base,.005)
        ridge.position.set(.10,.275,-.074+i*.05)
        unit.add(ridge)
      }
      unit.add(platform,casing,panel,port,lamp)
      model.add(unit)
    })
    const wire = matte(0x9c7757), data = new T.MeshBasicMaterial({color:0xbf641c})
    const axis = new T.Vector3(0,1,0)
    const packets = edges.map(([a,b]) => {
      const start = positions[a], end = positions[b], direction = end.clone().sub(start)
      const link = new T.Mesh(new T.CylinderGeometry(.017,.017,direction.length(),10),wire)
      link.position.copy(start).lerp(end,.5)
      link.quaternion.setFromUnitVectors(axis,direction.normalize())
      model.add(link)
      return {start,end}
    })

    // Bake the stationary parts into one mesh per material.
    model.updateMatrixWorld(true)
    const batches = new Map<T.Material,T.BufferGeometry[]>()
    model.traverse(object => {
      if (!(object instanceof T.Mesh) || !(object.material instanceof T.Material)) return
      const geometry = object.geometry.index ? object.geometry.toNonIndexed() : object.geometry.clone()
      geometry.applyMatrix4(object.matrixWorld)
      const batch = batches.get(object.material) ?? []
      batch.push(geometry)
      batches.set(object.material,batch)
      object.geometry.dispose()
    })
    model.clear()
    batches.forEach((geometries,material) => {
      const combined = mergeGeometries(geometries)
      if (combined) model.add(new T.Mesh(combined,material))
      geometries.forEach(geometry => geometry.dispose())
    })

    const moving = new T.InstancedMesh(new T.SphereGeometry(.055,16,12),data,packets.length)
    moving.frustumCulled = false
    moving.visible = false
    moving.instanceMatrix.setUsage(T.DynamicDrawUsage)
    model.add(moving)
    const transform = new T.Object3D()
    flow = time => {
      moving.visible = true
      packets.forEach(({start,end},index) => {
        const phase = (time*(.28+index%3*.04)+index*.237)%1
        transform.scale.setScalar(T.MathUtils.smoothstep(Math.min(phase,1-phase),.07,.15))
        transform.position.copy(index%2 ? end : start).lerp(index%2 ? start : end,phase)
        transform.updateMatrix()
        moving.setMatrixAt(index,transform.matrix)
      })
      moving.instanceMatrix.needsUpdate = true
    }
    update = () => {}
  } else {
    const positions = [[-1.6,.45,.15],[-.5,1.06,-.55],[1.48,.48,.11],[.65,-.95,.35],[-1.03,-.86,.64],[.58,.24,-.8]]
      .map(([x,y,z]) => new T.Vector3(x,y,z))
    const nodes = positions.map(position => {
      const node = box(.40,.40,.40,matte(0xe0c3a0),.055)
      node.position.copy(position)
      node.rotation.set(.26,.42,.17)
      model.add(node)
      return node
    })
    const edges = [[0,1],[0,4],[1,2],[1,5],[2,3],[2,5],[3,4],[3,5],[4,5]]
    const links = edges.map(([a,b]) => {
      const start = positions[a], end = positions[b], vector = end.clone().sub(start)
      const mesh = new T.Mesh(new T.CylinderGeometry(.018,.018,vector.length(),8),matte(0xa78770))
      mesh.position.copy(start).lerp(end,.5)
      mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),vector.normalize())
      model.add(mesh)
      return mesh
    })
    update = ({action},eased) => {
      links.forEach((link,i) => link.material.color.setHex(action && eased >= i*.095 ? 0xb76826 : 0xa78770))
      nodes.forEach((node,i) => (node.material as T.MeshStandardMaterial).color.setHex(action && eased >= i*.14 ? 0xd49b58 : 0xe0c3a0))
    }
  }

  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  let state = initial, previous = initial.action, started = -Infinity, frame = 0, visible = false
  let elapsed = 0, lastFrame = 0, drawn = false
  let entered = 0
  function draw(now: number) {
    frame = 0
    if (!visible || document.hidden) {lastFrame = 0; return}
    const animating = Boolean(flow && (kind === 'coin' ? elapsed < coinCycle : state.action) && !motion.matches)
    if (kind === 'coin' && motion.matches) flow?.(coinCycle)
    if (animating && lastFrame && now-lastFrame < 32) {
      requestDraw()
      return
    }
    if (!drawn) entered = now
    const duration = kind === 'network' ? 1200 : 600
    const progress = peer || motion.matches ? 1 : Math.min(1,(now-started)/duration)
    const entrance = peer || motion.matches ? 1 : Math.min(1,(now-entered)/1050)
    model.position.y = (entrance-1)*.09
    if (kind === 'network' && !state.action && entrance < 1) update({...state,action:1},entrance,0)
    else update(state,1-Math.pow(1-progress,2),previous)
    if (flow && animating) {
      elapsed += lastFrame ? Math.max(0,(now-lastFrame)/1000) : 0
      flow(elapsed)
      lastFrame = now
    } else lastFrame = 0
    renderer.render(scene,camera)
    if (!drawn) {
      drawn = true
      entered = performance.now()
      if (flow && lastFrame) lastFrame = entered
      onFirstFrame?.()
    }
    if (progress < 1 || entrance < 1 || animating) requestDraw()
  }
  function requestDraw() {
    if (!frame && visible && !document.hidden && host.clientWidth && host.clientHeight) frame = requestAnimationFrame(draw)
  }
  const size = new ResizeObserver(() => {
    if (!host.clientWidth || !host.clientHeight) return
    camera.aspect = host.clientWidth / host.clientHeight
    camera.fov = peer ? 23 : Math.max(34, 30/camera.aspect)
    camera.updateProjectionMatrix()
    renderer.setSize(host.clientWidth,host.clientHeight)
    requestDraw()
  })
  const view = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (!visible) lastFrame = 0
    if (visible) requestDraw()
  })
  size.observe(host)
  view.observe(host)
  function handleVisibility() {
    lastFrame = 0
    requestDraw()
  }
  document.addEventListener('visibilitychange',handleVisibility)
  motion.addEventListener('change',requestDraw)
  return {
    change(next: SceneState) {
      if (next.action !== state.action) {
        previous = state.action
        started = performance.now()
      }
      state = next
      requestDraw()
    },
    destroy() {
      size.disconnect()
      view.disconnect()
      document.removeEventListener('visibilitychange',handleVisibility)
      motion.removeEventListener('change',requestDraw)
      cancelAnimationFrame(frame)
      scene.traverse(object => {
        if (object instanceof T.Mesh) {
          object.geometry.dispose()
          if (object.material instanceof T.Material) {
            if (object.material instanceof T.MeshStandardMaterial) object.material.map?.dispose()
            object.material.dispose()
          }
        }
      })
      renderer.dispose()
      shadow?.material.map?.dispose()
      renderer.domElement.removeEventListener('webglcontextlost',onLost)
      renderer.domElement.remove()
      renderer.forceContextLoss()
    },
  }
}

function contactShadow(width: number) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const context = canvas.getContext('2d')!
  const falloff = context.createRadialGradient(32,32,3,32,32,31)
  falloff.addColorStop(0,'rgba(85,49,26,.20)')
  falloff.addColorStop(.55,'rgba(85,49,26,.10)')
  falloff.addColorStop(1,'rgba(85,49,26,0)')
  context.fillStyle = falloff
  context.fillRect(0,0,64,64)
  const shadow = new T.Mesh(new T.PlaneGeometry(width,2.75),new T.MeshBasicMaterial({
    map:new T.CanvasTexture(canvas), transparent:true, depthWrite:false, toneMapped:false,
  }))
  shadow.rotation.x = -Math.PI/2
  return shadow
}
