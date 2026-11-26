import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { MouseEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, matchPath, useLocation, useNavigationType } from 'react-router-dom'
import '@fontsource-variable/inter'
import '@fontsource-variable/manrope'
import { chapters, lesson, locale, pick, sources } from './content'
import type { Copy, Language } from './content'
import { Emphasis, Prose } from './editorial'
import { Scenario } from './interactions'
import { ChapterThree, ChapterFour } from './CustodyChapters'
import { HeroVisual } from './HeroVisual'
import { SignatureCTA } from './SignatureCTA'
import orangeLogo from '../assets/logo-bitcoin-orange.png'
import colophonLogo from '../assets/logo-colophon.png'
import './style.css'
import './editorial-layout.css'
import './chapter.css'
import { ChapterOne } from './ChapterOne'
import { ChapterFive } from './ChapterFive'
import { ChapterSix, ChapterSeven } from './FinalChapters'
import { ChapterTwo } from './ChapterTwo'
import { chapterEmphasis } from './chapter-history'

const chapterId = (index: number) => 'capitulo-' + (index + 1)
const chapterPath = (index: number) => '/chapter/' + (index + 1)
function clearTouchPress(event: ReactPointerEvent<HTMLAnchorElement>) {
  delete event.currentTarget.dataset.touchPressed
}
const touchFeedback = {
  onPointerDown(event: ReactPointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === 'touch') event.currentTarget.dataset.touchPressed = ''
  },
  onPointerUp: clearTouchPress,
  onPointerCancel: clearTouchPress,
  onPointerLeave: clearTouchPress,
}
const custodyPath = chapterPath(2) + '#autocustodia'
const faqPath = chapterPath(6) + '#faq'
const lessonLabels: Copy[] = [['Entender','Understand'],['Enxergar','Visualize'],['Conseguir fazer','Take action']]
const bitkitHelp = 'https://help.bitkit.to/'
const journeyArt = ['/hero-opening.webp','/journey-network.webp','/journey-wallet.webp']

function App() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const previousChapter = useRef(-1)
  const pageScroll = useRef(new Map<string,number>())
  const current = chapters.findIndex((_,index) => matchPath(chapterPath(index),location.pathname))
  const [lang,setLang] = useState<Language>(() => {
    try {return localStorage.getItem('language') === 'en' ? 'en' : 'pt'}
    catch {return 'pt'}
  })
  const [menu,setMenu] = useState(false)
  const [progress,setProgress] = useState(0)
  const menuButton = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLElement>(null)
  const scrollArea = useRef<HTMLDivElement>(null)
  const header = useRef<HTMLElement>(null)
  const readingLine = () => (header.current?.getBoundingClientRect().bottom ?? 0) + 30
  const hasDisplayedPage = useRef(false)
  const reading = useRef<{element: HTMLElement; ratio: number} | null>(null)
  const t = (copy: Copy) => pick(lang,copy)
  const read = (n: number, group?: number) => lesson(n,lang,group)
  const chapterLabel = (index: number) => t(['Capítulo','Chapter']) + ' ' + chapters[index].numeral

  useLayoutEffect(() => {
    document.documentElement.lang = locale(lang)
    const tagline = t(['Conhecimento é a chave','Knowledge is the key'])
    const active = chapters[current]
    const description = active ? t(active.description) :
      t(['Aprenda Bitcoin e autocustódia em sete capítulos interativos.','Learn Bitcoin and self-custody in seven interactive chapters.'])
    document.title = active ? t(active.title) + ' · Once Upon a Bitcoin' : 'Once Upon a Bitcoin · ' + tagline
    document.querySelector('meta[property="og:title"]')?.setAttribute('content',document.title)
    document.querySelector('meta[name="description"]')?.setAttribute('content',description)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content',description)
    if (reading.current) {
      const {element,ratio} = reading.current
      const rect = element.getBoundingClientRect()
      window.scrollBy({top:rect.top+rect.height*ratio-readingLine(),behavior:'instant'})
      reading.current = null
    }
    try {localStorage.setItem('language',lang)} catch { /* Preference is optional. */ }
  },[lang,current])

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {window.history.scrollRestoration = previous}
  },[])

  useLayoutEffect(() => {
    const scroller = document.documentElement
    const restored = navigationType === 'POP' ? pageScroll.current.get(location.key) : undefined
    const target = document.getElementById(location.hash.slice(1))
    if (target && restored === undefined) {
      target.scrollIntoView({behavior:'instant'})
      const focusTarget = target.querySelector<HTMLElement>(':scope > h2[tabindex]') ?? target
      focusTarget.focus({preventScroll:true})
    } else {
      window.scrollTo({top:restored ?? 0,left:0,behavior:'instant'})
      if (current >= 0 || hasDisplayedPage.current) {
        document.querySelector<HTMLElement>('main h1')?.focus({preventScroll:true})
      }
    }
    const chapterElement = document.getElementById(chapterId(current))
    if (chapterElement && previousChapter.current >= 0 && previousChapter.current !== current) {
      chapterElement.dataset.routeDirection = current > previousChapter.current ? 'forward' : 'backward'
    }
    previousChapter.current = current
    hasDisplayedPage.current = true
    setMenu(false)
    const height = scroller.scrollHeight-scroller.clientHeight
    setProgress(height > 0 ? Math.round(scroller.scrollTop/height*100) : 0)
    function savePageScroll() {pageScroll.current.set(location.key,scroller.scrollTop)}
    window.addEventListener('scroll',savePageScroll,{passive:true})
    return () => window.removeEventListener('scroll',savePageScroll)
  },[location,current,navigationType])

  useEffect(() => {
    const scroller = document.documentElement
    let frame = 0
    function measure() {
      frame = 0
      const height = scroller.scrollHeight-scroller.clientHeight
      setProgress(height > 0 ? Math.round(scroller.scrollTop/height*100) : 0)
    }
    function schedule() {if (!frame) frame = requestAnimationFrame(measure)}
    window.addEventListener('scroll',schedule,{passive:true})
    window.addEventListener('resize',schedule)
    const layout = new ResizeObserver(schedule)
    if (scrollArea.current) layout.observe(scrollArea.current)
    schedule()
    return () => {
      window.removeEventListener('scroll',schedule)
      window.removeEventListener('resize',schedule)
      layout.disconnect()
      cancelAnimationFrame(frame)
    }
  },[])

  useEffect(() => {
    if (!menu) return
    function dismiss(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenu(false)
        menuButton.current?.focus()
      }
    }
    function outside(e: PointerEvent) {
      if (e.target instanceof Node && !panel.current?.contains(e.target) && !menuButton.current?.contains(e.target)) setMenu(false)
    }
    document.addEventListener('keydown',dismiss)
    document.addEventListener('pointerdown',outside)
    return () => {
      document.removeEventListener('keydown',dismiss)
      document.removeEventListener('pointerdown',outside)
    }
  },[menu])

  useEffect(() => {
    if (!window.IntersectionObserver || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.entered = ''
        observer.unobserve(entry.target)
      }
    })
    scrollArea.current?.querySelectorAll('[data-reveal]:not([data-entered])').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  },[location.pathname])

  function changeLanguage(next: Language) {
    if (next === lang) return
    const scroller = document.documentElement
    if (scroller.scrollTop > 0) {
      const line = readingLine()
      const blocks = [...scroller.querySelectorAll<HTMLElement>('main [data-position], .prose > *, main .chapter-head, main > section, .site-footer')]
      const candidates = blocks.filter(el => {
        const rect = el.getBoundingClientRect()
        return rect.top <= line && rect.bottom > line
      }).sort((a,b) => a.getBoundingClientRect().height - b.getBoundingClientRect().height)
      const element = candidates[0]
      if (element) {
        const rect = element.getBoundingClientRect()
        reading.current = {element,ratio:(line-rect.top)/rect.height}
      }
    }
    setLang(next)
  }

  function navigate(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
    setMenu(false)
  }

  function chapterLink(index: number, location: 'index' | 'prev' | 'next') {
    const chapter = chapters[index]
    if (location === 'index') return <Link key={index} className="chapter-link index" to={chapterPath(index)} onClick={navigate}
      aria-current={current === index ? 'page' : undefined}>
      <span className="index-numeral"><span className="sr-only">{t(['Capítulo','Chapter'])} </span>{chapter.numeral}</span>
      <span className="index-copy"><strong>{t(chapter.title)}</strong><span>{t(chapter.description)}</span></span>
      <span className="index-arrow" aria-hidden="true">→</span>
    </Link>
    return chapterDestination(index,location)
  }

  function chapterDestination(index: number, direction: 'prev' | 'next') {
    const destination = chapters[index]
    const home = !destination
    const label = home ? t(['Voltar ao início','Back to the beginning']) :
      direction === 'prev' ? t(['Capítulo anterior','Previous chapter']) : t(['Próximo capítulo','Next chapter'])
    const numeral = !home && <span className="destination-numeral">{destination.numeral}</span>
    const arrow = <span className="destination-arrow">{home ? '↑' : direction === 'prev' ? '←' : '→'}</span>
    const group = <span className="destination-direction" aria-hidden="true">
      {direction === 'prev' ? <>{arrow}{numeral}</> : <>{numeral}{arrow}</>}
    </span>
    return <Link key={index} className={'chapter-link chapter-destination '+direction} to={home ? '/' : chapterPath(index)} onClick={navigate} {...touchFeedback}>
      {direction === 'prev' && group}
      <span className="destination-copy"><span className="destination-label">{label}{!home && <span className="sr-only"> {destination.numeral}</span>}</span>
        <strong>{home ? t(['Prólogo','Prologue']) : t(destination.title)}</strong>
        <span>{home ? t(['Revisite o começo da jornada.','Revisit the beginning of the journey.']) : t(destination.description)}</span>
      </span>
      {direction === 'next' && group}
    </Link>
  }
  function chapter(index: number, children: ReactNode) {
    return <section key={index} className={`chapter chapter-${index+1}`} id={chapterId(index)} tabIndex={-1} aria-labelledby={`title-${index}`}>
      <div className="wrap">
        <header className="chapter-head">

          <h1 id={`title-${index}`} tabIndex={-1}><Emphasis text={t(chapters[index].title)} phrase={t(chapterEmphasis[index])} /></h1>
          <p className="intro">{t(chapters[index].description)}</p>
        </header>
        {children}
        <nav className="chapter-nav" aria-label={t(['Navegação do capítulo','Chapter navigation']) + ' ' + chapters[index].numeral}>
          {index > 0 && chapterLink(index-1,'prev')}
          {index < 6 ? chapterLink(index+1,'next') : chapterDestination(7,'next')}
        </nav>
      </div>
    </section>
  }

  const hero = read(1)
  const heroBlocks = hero.split('\n\n')
  const headline = heroBlocks[1].slice(2).replace(/\.$/,'!').split(/(?<=\.) /)
  const journey = read(2)
  const journeyItems = [...journey.matchAll(/^- \*\*\d+\. (.*?):\*\* (.*)$/gm)]
  const journeyPaths = [chapterPath(0),chapterPath(2)+'#enxergar',chapterPath(4)]

  return <>
    <Link to="#main" className="skip" onClick={navigate}>{t(['Pular para o conteúdo','Skip to content'])}</Link>
    <header ref={header} className="site-header">
      <div className="wrap bar">
        <Link to="/" onClick={navigate} className="logo" aria-label="Once Upon a Bitcoin">
          <img className="art art-logo" src={orangeLogo} width={255} height={126} alt="" />
        </Link>
        <nav aria-label={t(['Principal','Main'])} className="main-nav">
          <div className="chapter-menu">
            <button ref={menuButton} className="menu-toggle" aria-expanded={menu} aria-controls="chapter-index" onClick={() => setMenu(!menu)}>
              {t(['Capítulos','Chapters'])}
              {current >= 0 && <span className="current-numeral" aria-hidden="true">{chapters[current].numeral}</span>}
              <span className="menu-chevron" aria-hidden="true" />
            </button>
            <nav className="menu-panel" id="chapter-index" aria-label={t(['Índice dos capítulos','Chapter index'])} aria-hidden={!menu} inert={!menu} ref={panel}>
              <div className="index-panel-head">
                <p className="eyebrow">{t(['Índice dos capítulos','Chapter index'])}</p>
                <button type="button" className="menu-dismiss" onClick={() => {setMenu(false);menuButton.current?.focus()}}>{t(['Fechar','Close'])} <span aria-hidden="true">×</span></button>
              </div>
              <div className="index-rows">{chapters.map((_,i) => chapterLink(i,'index'))}</div>
              <div className="index-utilities">
                <Link className="text-link mobile-custody" to={custodyPath} onClick={navigate}>{t(['Autocustódia','Self-custody'])}</Link>
                <Link className="text-link" to={faqPath} onClick={navigate}>{t(['Perguntas frequentes','Frequently asked questions'])}</Link>
              </div>
            </nav>
          </div>
          <Link to={custodyPath} onClick={navigate} className="custody-shortcut">{t(['Autocustódia','Self-custody'])}</Link>
          <div className="language" data-active={lang} role="group" aria-label={t(['Idioma','Language'])}>
            <button lang="pt-BR" aria-label="Português" aria-pressed={lang === 'pt'} onClick={() => changeLanguage('pt')}>PT</button>
            <button lang="en" aria-label="English" aria-pressed={lang === 'en'} onClick={() => changeLanguage('en')}>EN</button>
          </div>
        </nav>
      </div>
      <div className="reading-bar">
        <span className="sr-only">{current < 0 ? t(['Prólogo','Prologue']) : chapterLabel(current)}</span>
        <progress value={progress} max={100} aria-label={t(['Progresso de leitura','Reading progress'])} />
      </div>
    </header>
    <div className="site-scroll" ref={scrollArea}>
    <main id="main" tabIndex={-1}>
      <Routes>
      <Route path="/" element={<>
      <section className="hero wrap" id="inicio" tabIndex={-1}>
        <h1 tabIndex={-1}>{headline.map((line,index) =>
          <span key={index} className={index === 2 ? 'hero-accent' : undefined}>{line}{index < 2 ? ' ' : ''}</span>)}</h1>
        <HeroVisual label={t(['Um livro se abre e uma moeda Bitcoin emerge das páginas','A book opens and a Bitcoin coin rises from its pages'])} />
        <div className="hero-copy" data-position="hero-copy">
          <p className="intro">{t([
            'Aprenda o que é Bitcoin, como guardar e proteger sem depender de uma corretora.',
            'Learn what Bitcoin is and how to store and protect it without relying on an exchange.',
          ])}</p><p className="hero-support">{heroBlocks[3]}</p>
          <div className="hero-actions">
            <SignatureCTA {...touchFeedback} to={chapterPath(0)} onClick={navigate}>{t(['Começar a aprender','Start learning'])}</SignatureCTA>
            <Link {...touchFeedback} className="text-link hero-secondary" to={custodyPath} onClick={navigate}>{t(['Já tenho Bitcoin','I already own bitcoin'])}</Link>
          </div>
          <p className="note hero-note">{heroBlocks.at(-1)}</p>
        </div>
      </section>
      <section className="journey" aria-labelledby="journey-title">
        <div className="wrap">
          <h2 id="journey-title">{journey.split('\n\n')[0].slice(3).split(/(\bBitcoin\b)/).map((part,index) =>
            part === 'Bitcoin' ? <span className="journey-bitcoin" key={index}>{part}</span> : part)}</h2>
          <ul className="pillars">
            {journeyItems.map(([,label,detail],i) => <li key={i} data-reveal><Link to={journeyPaths[i]} onClick={navigate}>
              <img className="pillar-art" src={journeyArt[i]} alt="" loading="lazy" decoding="async" width={768} height={460} />
              <h3>{label || t(lessonLabels[i])}</h3><span className="pillar-detail">{detail}</span>
            </Link></li>)}
          </ul>
          <details className="journey-contents editorial-disclosure"><summary>{t(['Explore os capítulos','Explore the chapters'])}<span className="disclosure-chevron" aria-hidden="true" /></summary>
            <div className="index-rows">{chapters.map((_,i) => chapterLink(i,'index'))}</div>
          </details>
        </div>
      </section>
      </>} />
      <Route path={chapterPath(0)} element={chapter(0,<ChapterOne lang={lang} />)} />
      <Route path={chapterPath(1)} element={chapter(1,<ChapterTwo lang={lang} />)} />
      <Route path={chapterPath(2)} element={chapter(2,<ChapterThree lang={lang} />)} />
      <Route path={chapterPath(3)} element={chapter(3,<>
        <ChapterFour lang={lang} />
        <div className="split scenarios"><Scenario lang={lang} kind="storage" /><Scenario lang={lang} kind="loss" /></div>
      </>)} />
      <Route path={chapterPath(4)} element={chapter(4,<ChapterFive lang={lang} />)} />
      <Route path={chapterPath(5)} element={chapter(5,<ChapterSix lang={lang} />)} />
      <Route path={chapterPath(6)} element={chapter(6,<ChapterSeven lang={lang} />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    <footer className="site-footer">
      <div className="wrap colophon">
        <div className="colophon-intro" data-reveal>
          <img className="colophon-logo" src={colophonLogo} alt="Once Upon a Bitcoin. Knowledge is the key." width={255} height={126} loading="lazy" />
          <p><strong>Designed &amp; Developed by Trícia Linewberg</strong></p>
          <p>{t(['Projeto independente de educação sobre Bitcoin e autocustódia. Criado para tornar esse conhecimento mais acessível.',
            'An independent educational project about Bitcoin and self-custody, created to make this knowledge more accessible.'])}</p>
        </div>
        <section className="colophon-disclaimer" aria-labelledby="disclaimer-title">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 3 4.5 6v5.5c0 4.3 3 7.6 7.5 9.5 4.5-1.9 7.5-5.2 7.5-9.5V6L12 3Z"/><path d="m8.8 12 2.1 2.1 4.5-4.5"/></svg>
          <div><h2 id="disclaimer-title">{t(['Aviso importante','Important notice'])}</h2>
            <p>{t(['Este website possui finalidade exclusivamente educacional. Não oferece aconselhamento financeiro personalizado, não realiza transações e nunca solicita chaves privadas ou palavras de recuperação.',
              'This website is for educational purposes only. It provides no personalized financial advice, conducts no transactions, and never asks for private keys or recovery words.'])}</p></div>
        </section>
        <div className="colophon-links">
          <nav aria-labelledby="project-links"><h2 id="project-links">{t(['Sobre o projeto','About the project'])}</h2>
            <a className="text-link" href={t(['https://tricia-linewberg-portfolio.vercel.app/pt-br/','https://tricia-linewberg-portfolio.vercel.app/'])}>{t(['Portfólio','Portfolio'])} ↗</a>
            <a className="text-link" href="https://linkedin.com/in/tricia-linewberg/">LinkedIn ↗</a>
          </nav>
          <nav aria-labelledby="information-links"><h2 id="information-links">{t(['Informações','Information'])}</h2>
            <Link className="text-link" to={faqPath} onClick={navigate}>{t(['Perguntas frequentes','Frequently asked questions'])}</Link>
            <details id="fontes" className="editorial-disclosure"><summary>{t(['Fontes e referências','Sources and references'])}<span className="disclosure-chevron" aria-hidden="true" /></summary>
              <ol>{sources.map(({title,url}) => <li key={title}><a href={url}>{title} ↗</a></li>)}
                <li><a href={bitkitHelp}>Bitkit Help Center ↗</a></li></ol>
            </details>
          </nav>
        </div>
        <div className="colophon-bar">
          <div className="controls footer-languages" role="group" aria-label={t(['Idioma','Language'])}>
            <button lang="pt-BR" aria-pressed={lang === 'pt'} onClick={() => changeLanguage('pt')}>Português</button>
            <button lang="en" aria-pressed={lang === 'en'} onClick={() => changeLanguage('en')}>English</button>
          </div>
          <Link className="text-link back-top" to={location.pathname} onClick={navigate}>{t(['Voltar ao início','Back to top'])} <span aria-hidden="true">↑</span></Link>
        </div>
      </div>
    </footer>
    </div>
  </>
}

createRoot(document.getElementById('root')!).render(<BrowserRouter><App /></BrowserRouter>)
