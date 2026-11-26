function chunk(tag: string, data: Buffer) {
  const header = Buffer.alloc(8)
  header.write(tag)
  header.writeUInt32LE(data.length,4)
  return Buffer.concat([header,data,Buffer.alloc(data.length%2)])
}

export function animatedWebp(frames: {data:string;time:number}[],width:number,height:number) {
  const dimensions = Buffer.alloc(10)
  dimensions[0] = 2
  dimensions.writeUIntLE(width-1,4,3)
  dimensions.writeUIntLE(height-1,7,3)
  const loop = Buffer.alloc(6)
  loop.writeUInt16LE(1,4)
  const chunks = [chunk('VP8X',dimensions),chunk('ANIM',loop)]
  for (const [index,frame] of frames.entries()) {
    const header = Buffer.alloc(16)
    header.writeUIntLE(width-1,6,3)
    header.writeUIntLE(height-1,9,3)
    header.writeUIntLE(Math.max(1,Math.round(frames[index+1] ? frames[index+1].time-frame.time : 220)),12,3)
    header[15] = 2
    const image = Buffer.from(frame.data,'base64')
    chunks.push(chunk('ANMF',Buffer.concat([header,image.subarray(12)])))
  }
  const body = Buffer.concat(chunks)
  const riff = Buffer.from('RIFF    WEBP')
  riff.writeUInt32LE(body.length+4,4)
  return Buffer.concat([riff,body])
}
