import { FeedbackIcon } from './FeedbackIcon'
import { lesson, pick, type Copy, type Language } from './content'
import { ChapterArt } from './ChapterArt'
import { Emphasis, Prose, inline } from './editorial'
import { Network } from './Network'
import { useActivityState } from './activity-state'

type Props = { lang: Language }
const sentence = (text: string) => text.charAt(0).toUpperCase()+text.slice(1)
const heading = (line: string) => line.replace(/^#+ /,'')
const labeled = (line: string) => line.replace(/^(?:- )?\*\*/,'').split(/:\*\* |\*\*: /)
const sections = (copy: string) => copy.split(/\n\n(?=### )/)

function SecurityIcon({ secure = false }: { secure?: boolean }) {
  return <svg className="security-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {secure ? <path d="M12 2.8 20 6v5.7c0 4-2.9 7.4-8 9.5-5.1-2.1-8-5.5-8-9.5V6l8-3.2Z M9 12l2 2 4-4" /> : <path d="m5 12 4 4L19 6" />}
  </svg>
}

function Guidance({ title, secure, avoid, children }: { title: string; secure?: boolean; avoid?: boolean; children: React.ReactNode }) {
  return <div className={secure ? 'security-group protected' : 'security-group'} data-feedback={avoid ? 'error' : undefined}>
    <h4>{avoid ? <FeedbackIcon kind="shield-x" /> : <SecurityIcon secure={secure} />}{title}</h4>
    {children}
  </div>
}

const models: { title: Copy; details: Copy[] }[] = [
  {
    title: ['A chave está com a corretora.','The exchange holds the key.'],
    details: [
      ['**Quem autoriza?** A plataforma controla as chaves e processa as solicitações de saque.','**Who authorizes transactions?** The platform controls the keys and processes withdrawal requests.'],
      ['**E se os saques forem bloqueados?** Você depende da plataforma para recuperar o acesso aos fundos.','**What if withdrawals are frozen?** You depend on the platform to regain access to your funds.'],
      ['**Sua responsabilidade:** proteger a conta e compreender os riscos do intermediário.','**Your responsibility:** protect your account and understand the risks of relying on an intermediary.'],
    ],
  },
  {
    title: ['A chave está com você.','You hold the key.'],
    details: [
      ['**Quem autoriza?** Você, utilizando sua carteira.','**Who authorizes transactions?** You do, using your wallet.'],
      ['**E se a corretora bloquear os saques?** Isso não impede movimentações dos bitcoins que já estão sob sua autocustódia.','**What if the exchange freezes withdrawals?** You can still move bitcoin that is already in your self-custody.'],
      ['**Sua responsabilidade:** proteger as chaves e manter um backup seguro.','**Your responsibility:** protect your keys and keep a secure backup.'],
    ],
  },
]

function CustodyDemo({lang}: Props) {
  const [model,setModel] = useActivityState('custody-model',0)
  const t = (copy: Copy) => pick(lang,copy)
  const choices = [t(['Corretora','Exchange']),t(['Autocustódia','Self-custody'])]
  const active = models[model] ?? models[0]
  const title = t(['Quem controla a chave?','Who controls the key?'])
  return <section className="custody-demo lesson-panel" aria-labelledby="custody-demo-title" data-position="custody-demo">
    <h3 id="custody-demo-title">{title}</h3>
    <p>{t(['Experimente os dois modelos e descubra quem pode autorizar movimentações.','Try both models to see who can authorize transactions.'])}</p>
    <div className="custody-demo-layout">
      <div className="custody-experiment">
        <div className="custody-switch" role="group" aria-label={title}>
          {choices.map((choice,index) => <button type="button" key={index} aria-pressed={model === index}
            aria-controls="custody-explanation" onClick={() => setModel(index)}>{choice}</button>)}
        </div>
        <figure className="custody-scene" data-model={model}>
          <ChapterArt kind="key" eager />
          <div><ChapterArt kind="safe" /><span>{choices[0]}</span></div>
          <div><ChapterArt kind="wallet" /><span>{t(['Carteira pessoal','Personal wallet'])}</span></div>
        </figure>
      </div>
      <div className="custody-explanation" id="custody-explanation" aria-live="polite" aria-atomic="true">
        <h4>{t(active.title)}</h4>
        {active.details.map((copy,index) => <p key={index}>{inline(t(copy))}</p>)}
      </div>
    </div>
  </section>
}

export function ChapterThree({lang}: Props) {
  const t = (copy: Copy) => pick(lang,copy)
  const [network,wallet] = sections(lesson(5,lang))
  const [intro,...body] = network.split('\n\n')
  const [comparison,sharing] = sections(lesson(6,lang))
  const [comparisonTitle,table,context,conclusion] = comparison.split('\n\n')
  const [shareTitle,items,shareConclusion] = sharing.split('\n\n')
  const [address,...secrets] = items.split('\n').map(labeled)
  const information = ([label, description]: string[]) => <div key={label}>
    <dt>{label}</dt><dd>{sentence(description.replace(/ (Nunca compartilhe|Never share them|Never share it)\.$/,''))}</dd>
  </div>
  return <div className="chapter-lesson">
    <section id="enxergar" tabIndex={-1} className="lesson-section" data-position="network">
      <h3><Emphasis text={heading(intro)} phrase={t(['rede','network'])} /></h3>
      <div className="lesson-split network-intro">
        <Prose copy={body.join('\n\n')} />
        <Network lang={lang} />
      </div>
      <Prose copy={wallet} />
    </section>
    <section id="autocustodia" tabIndex={-1} className="lesson-section comparison" data-position="custody">
      <h3>{heading(comparisonTitle)}</h3>
      <Prose copy={table} />
      <p>{context}</p>
      <p className="lesson-statement">{conclusion.slice(2,-2)}</p>
    </section>
    <section className="lesson-section" data-position="sharing">
      <h3>{heading(shareTitle)}</h3>
      <div className="lesson-grid">
        <Guidance title={t(['Pode compartilhar','Safe to share'])}><dl>{information(address)}</dl></Guidance>
        <Guidance secure title={t(['Nunca compartilhe','Never share'])}><dl>{secrets.map(information)}</dl></Guidance>
      </div>
      <p className="lesson-support">{shareConclusion}</p>
    </section>
    <CustodyDemo lang={lang} />
  </div>
}

const creationSteps: Copy[] = [
  ['Aleatoriedade segura','Secure randomness'],
  ['Processamento criptográfico','Cryptographic processing'],
  ['Palavras de recuperação','Recovery words'],
]

export function ChapterFour({lang}: Props) {
  const t = (copy: Copy) => pick(lang,copy)
  const [intro,creation,storage,copies,compromise] = sections(lesson(7,lang))
  const [introTitle,...body] = intro.split('\n\n')
  const [creationTitle,...creationCopy] = creation.split('\n\n')
  const [storageTitle,storageCopy,materials,doList,avoidList] = storage.split('\n\n')
  const [copiesTitle,copiesCopy] = copies.split('\n\n')
  const [compromiseTitle,...response] = compromise.split('\n\n')
  return <div className="chapter-lesson">
    <section className="lesson-section" data-position="backup">
      <h3><Emphasis text={heading(introTitle)} phrase={t(['bitcoins','bitcoin'])} /></h3>
      <div className="lesson-split backup-intro">
        <Prose copy={body.join('\n\n')} />
        <figure className="backup-figure" data-reveal>
          <div className="backup-visual">
            <div className="backup-card">
            <ChapterArt kind="recovery-card" eager />
            <ol aria-label={t(['Doze espaços mascarados','Twelve masked spaces'])}>
              {Array.from({length:12},(_,i) => <li key={i}><span className="sr-only">{t(['Espaço mascarado','Masked space'])}</span></li>)}
            </ol>
            </div>
          </div>
          <figcaption>{t(['Representação ilustrativa.','Illustration only.'])}</figcaption>
        </figure>
      </div>
    </section>
    <section className="lesson-section" data-position="creation">
      <h3>{heading(creationTitle)}</h3>
      <Prose copy={creationCopy.slice(0,3).join('\n\n')} />
      <ol className="creation-process" data-reveal>
        {creationSteps.map((step,index) => <li key={index}>
          <div className="process-mark" data-stage={index} aria-hidden="true">{Array.from({length:6},(_,i) => <span key={i} />)}</div>
          <strong>{t(step)}</strong>
        </li>)}
      </ol>
      <Prose copy={creationCopy.slice(3).join('\n\n')} />
      <a className="text-link" href="https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki">{t(['Especificação BIP39','BIP39 specification'])}</a>
    </section>
    <section className="lesson-section" data-position="storage">
      <h3>{heading(storageTitle)}</h3>
      <Prose copy={storageCopy} />
      <div className="lesson-grid materials">
        {materials.split('\n').map((item,index) => {
          const [label,detail] = labeled(item)
          return <div key={label}><div className={index ? 'material-sample metal' : 'material-sample'} aria-hidden="true" />
            <h4>{label}</h4><p>{sentence(detail)}</p></div>
        })}
      </div>
      <div className="lesson-grid">
        {[doList,avoidList].map((group,index) => {
          const [label,points] = labeled(group.slice(0,-1))
          return <Guidance key={label} title={label} avoid={index === 1}>
            <ul>{points.split('; ').map(point => <li key={point}>{index === 1 && <FeedbackIcon kind="x" />}<span>{sentence(point)}.</span></li>)}</ul>
          </Guidance>
        })}
      </div>
    </section>
    <section className="lesson-section" data-position="copies">
      <h3>{heading(copiesTitle)}</h3>
      <p>{copiesCopy}</p>
    </section>
    <section className="lesson-section lesson-panel compromise" data-position="compromise">
      <h3><SecurityIcon secure />{heading(compromiseTitle)}</h3>
      <Prose copy={response.join('\n\n')} />
    </section>
  </div>
}
