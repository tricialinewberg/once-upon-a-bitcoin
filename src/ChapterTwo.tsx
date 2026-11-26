import { ChapterArt } from './ChapterArt'
import { lesson, pick, type Copy, type Language } from './content'
import { Emphasis, Prose } from './editorial'
import { Calculator } from './interactions'
import { ScenePanel } from './ScenePanel'

export function ChapterTwo({lang}:{lang:Language}) {
  const t = (copy:Copy) => pick(lang,copy)
  const [opening,,volatility] = lesson(4,lang).split(/^### /m)
  const [converterTitle,...converterCopy] = opening.split(/^Converter: |^Conversor: /m)[0].trim().split('\n\n')
  const [,warning,statement,...lessonBlocks] = volatility.trim().split('\n\n')
  const [safetyTitle,...tips] = (lessonBlocks.pop() ?? '').split('\n')
  return <>
    <section className="split supply" data-position="supply">
      <div><p className="supply-number">{t(['21.000.000','21,000,000'])}</p>
        <p className="eyebrow">{t(['Limite aproximado de emissão · BTC','Approximate supply limit · BTC'])}</p>
        <Prose copy={lesson(3,lang,1).split('\n\n').at(-1) ?? ''} />
      </div>
      <ScenePanel kind="coin" lang={lang} fallback="coin" />
    </section>
    <section className="chapter-two-band chapter-two-split" data-position="converter">
      <div><h2><Emphasis text={converterTitle.slice(3)} /></h2><Prose copy={converterCopy.join('\n\n')} />
        <aside className="volatility-notice"><p><strong>{warning.slice(0,warning.indexOf(':')+1)}</strong>{warning.slice(warning.indexOf(':')+1)}</p></aside>
      </div>
      <Calculator lang={lang} />
    </section>
    <section className="chapter-two-band volatility-explanation" data-position="volatility" aria-label={t(['Volatilidade e funcionamento da rede','Volatility and network operation'])}>
      <p className="volatility-statement"><Emphasis text={statement.replaceAll('**','')} /></p>
      <Prose copy={lessonBlocks.join('\n\n')} />
    </section>
    <aside className="learning-panel" data-position="responsible-learning" data-reveal>
      <ChapterArt kind="shield" />
      <div><h2>{safetyTitle.replace(/:$/,'')}</h2><ul>{tips.map(tip=><li key={tip}>{tip.replace(/^- /,'')}</li>)}</ul></div>
    </aside>
  </>
}
