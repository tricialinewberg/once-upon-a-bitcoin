import { useEffect, useRef, useState } from 'react'
import { lesson, pick, type Copy, type Language } from './content'
import { milestones } from './chapter-history'
import { Emphasis, Prose } from './editorial'
import { Network } from './Network'
import { ChapterArt } from './ChapterArt'
import { TimelineArt } from './TimelineArt'
import type { ChapterObject } from './chapter-models'

function SymbolArt({kind,motion=false}: {kind:ChapterObject;motion?:boolean}) {
  const animate = motion ? ' data-motion' : ''
  if (kind === 'block') return <div className={'block-art'+animate}>{[0,1,2].map(i=><ChapterArt key={i} kind="block" />)}</div>
  return <div className={'chapter-object-motion'+animate} data-object={kind}><ChapterArt kind={kind} /></div>
}

const benefitArt: ChapterObject[] = ['key','globe','lock','coin','clock']
function Benefits({lang,copy}: {lang:Language;copy:string}) {
  const [selected,setSelected] = useState(0)
  const [expanded,setExpanded] = useState<number[]>([0])
  const entries = [...copy.matchAll(/^- \*\*(.*?):\*\* (.*)$/gm)]
  return <section className="chapter-band benefits" data-position="chapter-benefits" aria-labelledby="benefits-title">
    <h2 id="benefits-title">{copy.split('\n')[0]}</h2>
    <div className="benefits-layout">
      <div className="benefit-mobile">{entries.map(([,title,body],index) => <div className="benefit-row" key={index}>
        <button type="button" aria-expanded={expanded.includes(index)} aria-controls={`benefit-${index}`} onClick={() =>
          setExpanded(current => current.includes(index) ? current.filter(item => item !== index) : [...current,index])}>{title}<span aria-hidden="true">{expanded.includes(index) ? '−' : '+'}</span></button>
        <div className="benefit-detail" id={`benefit-${index}`} hidden={!expanded.includes(index)}><div className="chapter-object"><SymbolArt kind={benefitArt[index]} motion={expanded.includes(index)} /></div><p>{body}</p></div>
      </div>)}</div>
      <div className="benefit-desktop">
        <div className="benefit-selectors" aria-label={pick(lang,['Benefícios','Benefits'])}>{entries.map(([,title],index) =>
          <button key={index} type="button" aria-pressed={selected===index} onClick={() => setSelected(index)}>{title}</button>)}</div>
        <div className="benefit-feature" aria-live="polite"><div className="benefit-feature-inner" key={selected}>
          <div className="chapter-object"><SymbolArt kind={benefitArt[selected]} motion /></div>
          <div><h3>{entries[selected][1]}</h3><p>{entries[selected][2]}</p></div>
        </div></div>
      </div>
    </div>
  </section>
}

const extraSources = [
  ['CME Group · 2024 halving','https://www.cmegroup.com/articles/2024/bitcoin-halving-2024-this-time-its-different.html'],
  ['Bitcoin Pizza Day · Community events','https://pizzadao.org/home'],
]
function History({lang,copy}: {lang:Language;copy:string}) {
  const [index,setIndex] = useState(0)
  const years = useRef<HTMLDivElement>(null)
  const t = (copy:Copy) => pick(lang,copy)
  useEffect(() => {
    const row = years.current
    const item = row?.children[index] as HTMLElement | undefined
    if (!item || !row) return
    row.scrollTo({left:item.getBoundingClientRect().left-row.getBoundingClientRect().left+row.scrollLeft-(row.clientWidth-item.offsetWidth)/2,
      behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'})
  },[index])
  const [title,...paragraphs] = copy.split('\n\n')
  return <section className="history-band" data-position="chapter-history" aria-labelledby="history-title">
    <div className="history-inner">
      <div className="history-intro">
        <h2 id="history-title"><Emphasis text={title.slice(3)} /></h2>
        <div>{paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
      </div>
      <div className="history-years" ref={years} role="group" aria-label={t(['Selecionar ano','Select a year'])}>
        {milestones.map((event,i) => <button key={event.year} type="button" aria-pressed={index === i} onClick={() => setIndex(i)}>{event.year}</button>)}
      </div>
      <div className="history-events" aria-live="polite">
        {milestones.map((event,i) => <article key={event.year} className="history-event" aria-hidden={index !== i} inert={index !== i}>
          <div><span className="history-year">{event.year}</span><h3><Emphasis text={t(event.title)} /></h3><p>{t(event.body)}</p></div>
          <figure className="chapter-object"><TimelineArt kind={event.art} year={event.year} lang={lang} /></figure>
        </article>)}
      </div>
      <details className="history-all"><summary>{t(['Ver todos os eventos','View all events'])}</summary>
        <ol>{milestones.map(event => <li key={event.year}><h3>{event.year} · {t(event.title)}</h3><p>{t(event.body)}</p></li>)}</ol>
      </details>
      <details className="history-all"><summary>{t(['Fontes históricas','Historical sources'])}</summary>
        <ul>{[...new Map([...milestones.map(event => event.source),...extraSources].map(source => [source[1],source])).values()].map(([label,url]) => <li key={url}><a href={url}>{label}</a></li>)}</ul>
      </details>
    </div>
  </section>
}

const summary: {art:ChapterObject;title:Copy;body:Copy}[] = [
  {art:'coin',title:['Quantidade limitada','Limited supply'],body:['Cerca de 21 milhões de unidades.','Around 21 million bitcoin.']},
  {art:'block',title:['Descentralizado','Decentralized'],body:['Nós independentes verificam as regras.','Independent nodes verify the rules.']},
  {art:'key',title:['Autonomia','Autonomy'],body:['Você pode controlar suas chaves.','You can control your own keys.']},
  {art:'globe',title:['Global','Global'],body:['Uma rede que atravessa fronteiras.','A network that crosses borders.']},
]
export function ChapterOne({lang}: {lang:Language}) {
  const t = (copy:Copy) => pick(lang,copy)
  const [intro,comparison,benefitsAndNote] = lesson(3,lang).split(/^### /m)
  const [question,...comparisonBody] = comparison.trim().split('\n\n')
  const cut = benefitsAndNote.lastIndexOf('\n\n')
  const [history,summaryCopy] = lesson(3,lang,1).split(/^### /m)
  const [summaryTitle,...summaryBody] = summaryCopy.split('\n\n')
  return <div id="entender" className="chapter-one" tabIndex={-1}>
    <section className="chapter-intro" data-position="chapter-intro"><p>{intro.trim()}</p><Network lang={lang} /></section>
    <section className="chapter-band comparison" data-position="chapter-comparison" aria-labelledby="comparison-title">
      <h2 id="comparison-title"><Emphasis text={question} /></h2>
      <Prose copy={comparisonBody.join('\n\n')} />
    </section>
    <Benefits lang={lang} copy={benefitsAndNote.slice(0,cut)} />
    <aside className="chapter-note" data-position="chapter-responsibility"><span aria-hidden="true">i</span><p>{benefitsAndNote.slice(cut).trim()}</p></aside>
    <History lang={lang} copy={history.trim()} />
    <section className="chapter-band chapter-summary" data-position="chapter-summary">
      <h2><Emphasis text={summaryTitle} /></h2>
      <ul>{summary.map(item => <li key={item.art} data-reveal>
        <div className="chapter-object"><SymbolArt kind={item.art} motion /></div><h3>{t(item.title)}</h3><p>{t(item.body)}</p>
      </li>)}</ul>
      <p>{summaryBody.at(-1)}</p>
    </section>
    <section className="chapter-band chapter-ending" data-position="chapter-conclusion">
      <h2><Emphasis text={t(['Bitcoin e outras criptomoedas são a mesma coisa?','Are Bitcoin and other cryptocurrencies the same?'])} /></h2>
      <p className="chapter-answer">{t(['Não!','No!'])}</p>
      <p>{t(['Bitcoin faz parte da categoria das criptomoedas, mas possui regras, história e rede próprias. Outros criptoativos têm diferentes objetivos, formas de emissão e mecanismos de segurança.',
        'Bitcoin is a cryptocurrency, and it has its own rules, history, and network. Other cryptoassets have different purposes, issuance policies, and security mechanisms.'])}</p>
      <p className="chapter-conclusion"><Emphasis text={t(['Neste site estudamos exclusivamente Bitcoin.','This site focuses exclusively on Bitcoin.'])} /></p>
    </section>
  </div>
}
