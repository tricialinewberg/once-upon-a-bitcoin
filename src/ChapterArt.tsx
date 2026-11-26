import type { ChapterObject } from './chapter-models'

export function ChapterArt({kind,alt='',eager=false}: {kind:ChapterObject|'peer-network';alt?:string;eager?:boolean}) {
  return <img className="chapter-art" src={'/chapter-art/'+kind+'.webp'} width={kind === 'peer-network' ? 650 : 360} height={kind === 'peer-network' ? 351 : 300} loading={eager?'eager':'lazy'} alt={alt} />
}
