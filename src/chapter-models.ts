import * as T from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { makeMedallion } from './hero-scene'

export const objects = ['coin','key','globe','lock','clock','document','block','pizza','safe','wallet','shield','recovery-card'] as const
export type ChapterObject = typeof objects[number]
const ivory = new T.MeshStandardMaterial({color:0xe7cfad,roughness:.78})
const copper = new T.MeshStandardMaterial({color:0xa96946,roughness:.62,metalness:.14})
const gold = new T.MeshStandardMaterial({color:0xeabe77,metalness:.58,roughness:.38})
const dark = new T.MeshStandardMaterial({color:0x704936,roughness:.8})
const mark = new T.MeshStandardMaterial({color:0xaf573c,roughness:.76})
const mesh = (geometry:T.BufferGeometry,material:T.Material) => new T.Mesh(geometry,material)
function box(w:number,h:number,d:number,material:T.Material,round=.045) {
  return mesh(new RoundedBoxGeometry(w,h,d,3,round),material)
}
function disc(radius:number,depth:number,material:T.Material) {
  const part = mesh(new T.CylinderGeometry(radius,radius,depth,64),material)
  part.rotation.x = Math.PI/2
  return part
}
function at<TObject extends T.Object3D>(object:TObject,x:number,y:number,z:number) {
  object.position.set(x,y,z)
  return object
}

export function chapterObject(kind:ChapterObject) {
  const object = new T.Group()
  if (kind === 'coin') return makeMedallion()
  if (kind === 'key') {
    object.add(at(mesh(new T.TorusGeometry(.27,.085,16,48),gold),-.48,0,0),
      at(box(.85,.14,.13,gold),.06,0,0),at(box(.15,.31,.13,gold),.36,-.08,0),at(box(.12,.25,.13,gold),.56,-.055,0))
    object.rotation.z = -.33
  } else if (kind === 'globe') {
    object.add(mesh(new T.SphereGeometry(.53,48,32),gold))
    for(const latitude of [-.28,0,.28]) {
      const ring=mesh(new T.TorusGeometry(Math.sqrt(.55**2-latitude**2),.012,10,64),copper)
      ring.rotation.x=Math.PI/2
      object.add(at(ring,0,latitude,0))
    }
    for(const angle of [0,Math.PI/3,2*Math.PI/3]) {
      const ring=mesh(new T.TorusGeometry(.55,.012,10,64),copper)
      ring.rotation.y=angle
      object.add(ring)
    }
    object.rotation.z=-.25
  } else if (kind === 'lock' || kind === 'shield') {
    if (kind === 'lock') object.add(at(mesh(new T.TorusGeometry(.25,.06,16,48),gold),0,.28,0))
    if (kind === 'shield') {
      const shape=new T.Shape()
      shape.moveTo(-.48,.44);shape.quadraticCurveTo(0,.64,.48,.44);shape.lineTo(.43,-.13);shape.quadraticCurveTo(.31,-.46,0,-.6);shape.quadraticCurveTo(-.31,-.46,-.43,-.13);shape.closePath()
      object.add(mesh(new T.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:true,bevelSegments:3,bevelSize:.04,bevelThickness:.04}),gold))
    } else object.add(at(box(.78,.57,.25,gold,.09),0,-.12,0))
    object.add(at(disc(.065,.03,dark),0,-.06,.16),at(box(.065,.13,.022,dark,.01),0,-.125,.16))
  } else if (kind === 'clock') {
    object.add(disc(.55,.18,gold),at(disc(.48,.03,ivory),0,0,.11),at(box(.035,.28,.025,dark,.01),0,.11,.15))
    const arm=at(box(.035,.22,.025,copper,.01),.07,-.05,.16)
    arm.rotation.z=.94
    object.add(arm)
    for(let i=0;i<12;i++){
      const angle=i*Math.PI/6
      const tick=at(box(.019,.05,.018,copper,.007),Math.sin(angle)*.4,Math.cos(angle)*.4,.139)
      tick.rotation.z=-angle
      object.add(tick)
    }
  } else if (kind === 'safe' || kind === 'wallet') {
    object.add(box(1.02,.86,.55,kind==='safe'?ivory:copper,.1),
      at(box(.88,.72,.1,kind==='safe'?copper:dark,.07),0,0,.28),
      at(disc(.12,.055,gold),.17,0,.35))
    if(kind==='safe') for(const y of [-.29,.29]) object.add(at(box(.12,.13,.1,gold),-.42,y,.32))
    else object.add(at(box(.44,.18,.04,copper),.28,0,.35))
  } else if (kind === 'block') {
    for(const [x,y,z] of [[-.43,-.18,.14],[.43,-.18,.14],[0,.28,-.19]]) {
      object.add(at(box(.43,.34,.36,ivory),x,y,z),at(box(.4,.08,.36,copper),x,y-.16,z),
        at(box(.2,.025,.022,gold,.008),x,y,z+.183))
    }
    object.add(at(box(.5,.025,.035,gold),0,-.18,.14))
  } else if (kind === 'pizza') {
    for(const [x,y,z] of [[-.36,.1,0],[.36,-.14,.2]]) {
      object.add(at(disc(.36,.12,copper),x,y,z),at(disc(.314,.035,gold),x,y,z+.073))
      for(const [dx,dy] of [[-.13,.07],[.09,.13],[.13,-.1],[-.1,-.13]]) object.add(at(disc(.055,.02,mark),x+dx,y+dy,z+.098))
    }
  } else {
    object.add(at(box(.77,1.01,.12,copper),.035,-.025,-.04),box(.77,1.01,.1,ivory))
    for(let i=0;i<(kind==='recovery-card'?6:5);i++) {
      const y=.25-i*.10
      if(kind==='recovery-card') for(const x of [-.17,.17]) object.add(at(box(.21,.025,.015,copper,.006),x,y,.06))
      else object.add(at(box(i===4?.3:.49,.025,.015,copper,.006),-.04,y,.06))
    }
    if(kind==='document') object.add(at(disc(.094,.03,mark),.19,-.31,.07))
  }
  return object
}
