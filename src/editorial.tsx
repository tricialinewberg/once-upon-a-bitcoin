import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { artwork, asset } from './content'
import type { Artwork } from './content'
import heroSmall from '../assets/hero-book-bitcoin-768.webp'
import heroLarge from '../assets/hero-book-bitcoin-1440.webp'

export function Art({name, alt = '', eager = false}: {name: Artwork; alt?: string; eager?: boolean}) {
  const [width,height] = artwork[name]
  const image = <img className={`art art-${name}`} src={asset(name)} alt={alt} width={width} height={height}
    loading={eager ? 'eager' : 'lazy'} fetchPriority={name === 'hero-book-bitcoin' ? 'high' : 'auto'} />
  if (name !== 'hero-book-bitcoin') return image
  return <picture>
    <source type="image/webp" srcSet={`${heroSmall} 768w, ${heroLarge} 1440w`}
      sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 1040px) 45vw, (max-width: 1440px) 50vw, 720px" />
    {image}
  </picture>
}

export function Emphasis({text,phrase='Bitcoin'}: {text:string;phrase?:string}) {
  const start = text.toLowerCase().indexOf(phrase.toLowerCase())
  return start < 0 ? text : <>{text.slice(0,start)}<span className="chapter-accent">{text.slice(start,start+phrase.length)}</span>{text.slice(start+phrase.length)}</>
}

export function inline(copy: string): ReactNode {
  return copy.split(/(\*\*.+?\*\*|`[^`]+`)/).map((part, i) =>
    part.startsWith('**') ? <strong key={i}>{part.slice(2,-2)}</strong> :
    part.startsWith('`') ? <code key={i}>{part.slice(1,-1)}</code> : part)
}

export function Prose({copy}: {copy: string}) {
  return <div className="prose">{copy.trim().split(/\n\n+/).filter(Boolean).map((paragraph, i) => {
    const lines = paragraph.split('\n')
    if (paragraph.startsWith('|')) {
      const cells = (line: string) => line.split('|').slice(1,-1).map(cell => cell.trim())
      return <table key={i}><thead><tr>{cells(lines[0]).map((cell,j) => <th scope="col" key={j}>{inline(cell)}</th>)}</tr></thead>
        <tbody>{lines.slice(2).map((line,j) => <tr key={j}>{cells(line).map((cell,k) => <td key={k}>{inline(cell)}</td>)}</tr>)}</tbody></table>
    }
    if (lines.some(line => /^(- |\d+\. )/.test(line))) {
      const firstItem = lines.findIndex(line => /^(- |\d+\. )/.test(line))
      const List = lines[firstItem].startsWith('- ') ? 'ul' : 'ol'
      return <Fragment key={i}>{firstItem > 0 && <p>{inline(lines.slice(0,firstItem).join(' '))}</p>}
        <List>{lines.slice(firstItem).map((line,j) => <li key={j}>{inline(line.replace(/^(- |\d+\. )/,''))}</li>)}</List></Fragment>
    }
    if (paragraph.startsWith('## ')) return <h3 key={i}><Emphasis text={paragraph.slice(3)} /></h3>
    if (paragraph.startsWith('### ')) return <h4 key={i}>{inline(paragraph.slice(4))}</h4>
    return <p key={i}>{inline(paragraph)}</p>
  })}</div>
}
