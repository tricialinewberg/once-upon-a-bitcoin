import { ChapterArt } from './ChapterArt'
import { finalCopy, lesson, pick, type Language } from './content'
import { Emphasis, Prose, inline } from './editorial'
import { Checklist, Scenario } from './interactions'

const habitIcons = [
  'M20 7v5h-5M4 17v-5h5M6 8a7 7 0 0 1 11-2l3 3M4 15l3 3a7 7 0 0 0 11-2',
  'M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm1 9 2 2 4-4m-4 8h2',
  'M3 3l18 18M10 10a3 3 0 0 0 4 4M9 5.5A9 9 0 0 1 12 5c5 0 8 4 10 7a15 15 0 0 1-3 3.5M6.5 7C4.5 8.4 3 10.3 2 12c2 3 5 7 10 7a9 9 0 0 0 4-.9',
  'M8 3H4v4m12-4h4v4M4 17v4h4m12-4v4h-4m-8-9 2.5 2.5 5-5',
  'M3 8h17m-4-4 4 4-4 4m5 4H4m4-4-4 4 4 4',
  'M12 3l7 3v5.5c0 4-2.7 7-7 9.5-4.3-2.5-7-5.5-7-9.5V6l7-3Zm-3 9 2 2 4-4',
  'M3 3h6v6H3Zm12 0h6v6h-6ZM3 15h6v6H3Zm12 0h3v3h3v3h-6Zm6-3v3m-9-3h3m-3 7v2',
]

export function ChapterSix({lang}: {lang: Language}) {
  const [,opening,,habits] = lesson(10,lang).split(/^## |^### /m)
  const [introTitle,...intro] = opening.trim().split('\n\n')
  const [habitsTitle,table] = habits.trim().split('\n\n')
  const [columns,,...rows] = table.split('\n').map(row=>row.split('|').slice(1,-1).map(cell=>cell.trim()))
  return <div className="chapter-lesson">
    <section className="security-opening" data-position="scam-intro">
      <div>
        <h2><Emphasis text={introTitle} phrase={pick(lang,['dinheiro fácil','easy money'])} /></h2>
        <Prose copy={intro.join('\n\n')} />
      </div>
      <ChapterArt kind="shield" />
    </section>
    <Scenario lang={lang} kind="scam" />
    <section className="security-habits" data-position="habits">
      <h2 id="security-habits-title"><Emphasis text={habitsTitle} phrase={pick(lang,['grande','big'])} /></h2>
      <table className="habit-table" role="table" aria-labelledby="security-habits-title" data-reveal>
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">{columns[0]}</th>
            <th id="habit-reason" scope="col" role="columnheader">{columns[1]}</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map(([habit,reason],index)=><tr role="row" key={habit}>
            <th id={`habit-${index}`} scope="row" role="rowheader">
              <span className="habit-label">
                <span className="habit-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65"
                    strokeLinecap="round" strokeLinejoin="round" focusable="false">
                    <path d={habitIcons[index]} />
                  </svg>
                </span>
                {habit}
              </span>
            </th>
            <td role="cell" headers={`habit-${index} habit-reason`}>
              <span aria-hidden="true" className="habit-context">{pick(lang,['Por que isso importa?','Why does it matter?'])}</span>
              {reason}
            </td>
          </tr>)}
        </tbody>
      </table>
    </section>
  </div>
}

export function ChapterSeven({lang}: {lang: Language}) {
  const faqPairs = [...finalCopy(lang,'FAQ').matchAll(/^\*\*(.*?)\*\* (.*)$/gm)]
  const [title,body,statement] = finalCopy(lang,'closing').split('\n\n')
  return <>
    <Checklist lang={lang} />
    <section id="faq" tabIndex={-1} className="faq">
      <h2 tabIndex={-1}>{pick(lang,['Perguntas frequentes','Frequently asked questions'])}</h2>
      {faqPairs.map(([,question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
    </section>
    <section className="chapter-finale" data-position="closing">
      <div>
        <h2><Emphasis text={title.slice(3)} phrase={pick(lang,['conhecimento','knowledge'])} /></h2>
        <p>{body}</p>
        <p className="finale-statement">{inline(statement)}</p>
      </div>
      <img src="/hero-opening.webp" width={1344} height={646} loading="lazy" decoding="async" alt="" />
    </section>
  </>
}
