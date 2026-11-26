import { FeedbackIcon } from './FeedbackIcon'
import { useState } from 'react'
import { useActivityState } from './activity-state'
import type { Copy, Language } from './content'
import { locale, pick, lesson } from './content'
import { Prose } from './editorial'

type Props = {lang: Language}
export function Timeline({lang}: Props) {
  const [active,setActive] = useActivityState('timeline',0)
  const copy = lesson(3,lang,1)
  const events = [...copy.matchAll(/^- \*\*(\d+) — (.*?):\*\* (.*)$/gm)]
  return <div className="timeline" data-position="timeline">
    <Prose copy={copy.split(/^- \*\*2008/m)[0]} />
    <div className="timeline-years" role="group" aria-label={pick(lang,['Eventos históricos','Historical events'])}>
      {events.map(([,year], i) => <button key={year} aria-pressed={i === active} onClick={() => setActive(i)}>{year}</button>)}
    </div>
    <div className="timeline-detail" aria-live="polite"><h4>{events[active][1]} · {events[active][2]}</h4><p>{events[active][3]}</p></div>
    <details><summary>{pick(lang,['Ver todos os eventos','View all events'])}</summary><ul>{events.map(([,year,title,detail]) => <li key={year}><strong>{year} · {title}</strong> {detail}</li>)}</ul></details>
    <Prose copy={copy.slice(copy.indexOf('\n###'),copy.lastIndexOf('\n\n'))} />
  </div>
}

const valid = (value: string) => /^\d{1,16}$/.test(value) && BigInt(value) <= 2100000000000000n
export function Calculator({lang, fee = false}: Props & {fee?: boolean}) {
  const [value,setValue] = useActivityState(fee ? 'fee-amount' : 'satoshis',fee ? '10000' : '1000')
  const [rate,setRate] = useActivityState('fee-rate',5)
  const t = (copy: Copy) => pick(lang,copy)
  const number = new Intl.NumberFormat(locale(lang))
  const accepted = valid(value) && (!fee || BigInt(value) > 0n)
  const sats = accepted ? BigInt(value) : 0n
  const btc = number.format(sats / 100000000n) + t([',','.']) + (sats % 100000000n).toString().padStart(8,'0')
  const charge = BigInt(rate * 140)
  const id = fee ? 'amount' : 'satoshis'
  return <div className="lab" data-position={id}>
    <h3>{fee ? t(['Simule uma transferência','Simulate a transfer']) : t(['Explore pequenas quantidades de Bitcoin','Explore small amounts of bitcoin'])}</h3>
    <label htmlFor={id}>{fee ? t(['Quanto deseja enviar? (satoshis)','How much would you like to send? (satoshis)']) : 'Satoshis (sats)'}</label>
    <input id={id} value={value} inputMode="numeric" maxLength={16} onChange={e => setValue(e.target.value)}
      aria-invalid={!accepted} aria-describedby={accepted ? undefined : id + '-error'} />
    {!accepted && <p id={id + '-error'} role="status">{fee ? t(['Use um inteiro positivo em sats.','Enter a positive whole number of sats.']) : t(['Use um número inteiro entre 0 e 2.100.000.000.000.000 sats.','Enter a whole number from 0 to 2,100,000,000,000,000 sats.'])}</p>}
    {fee ? <div className="fee-rate"><label htmlFor="fee-rate">{t(['Taxa por vB','Fee per vB'])} · {rate} sat/vB</label>
      <input type="range" min="1" max="50" id="fee-rate" value={rate} aria-valuetext={rate + ' sat/vB'} onChange={e => setRate(Number(e.target.value))} />
      <div className="controls">{[1,5,20].map((n,i) => <button key={n} aria-pressed={n === rate} onClick={() => setRate(n)}>{t(([
        ['Menor','Lower'],['Intermediária','Medium'],['Maior','Higher'],
      ] as Copy[])[i])} · {n}</button>)}</div></div> :
      <div className="controls">{[1000,10000,100000,1000000].map(n => <button key={n} aria-pressed={String(n) === value} onClick={() => setValue(String(n))}>{number.format(n)}</button>)}</div>}
    <dl className="results" aria-live="polite">{(fee ?
      [[t(['Valor enviado','Amount sent']), number.format(sats) + ' sats'],[t(['Taxa estimada','Estimated fee']),number.format(charge) + ' sats'],[t(['Total gasto','Total spent']),number.format(sats+charge) + ' sats']] :
      [[t(['Equivalente em Bitcoin','Equivalent in bitcoin']),btc + ' BTC']]
    ).map(([label,result]) => <div key={label}><dt>{label}</dt><dd key={fee ? label : result}>{accepted ? result : '—'}</dd></div>)}</dl>
    <p className="note">{fee ? t(['Valores hipotéticos. Transação ilustrativa de 140 vB. Não representa taxas atuais nem recomendação de taxa.','Hypothetical values. Illustrative 140 vB transaction. Not current network fees or a fee recommendation.']) :
      t(['Conversão de unidades, sem relação com a cotação atual.','Unit conversion, unrelated to the current market price.'])}</p>
  </div>
}

const choices: Record<string, {title: Copy; options: Copy[]; feedback: Copy[]}> = {
  storage: {title:['Onde você guardaria seu backup?','Where would you store your backup?'],
    options:[['Em uma foto no celular','In a photo on my phone'],['Em um local físico protegido','In a protected physical location'],['Na nuvem','In the cloud']],
    feedback:[['Uma foto pode ser acessada ou sincronizada com a nuvem. Prefira um backup físico protegido.','A photo can be accessed or synced to the cloud. Choose a protected physical backup.'],
      ['Um backup físico em local privado e protegido reduz a exposição online.','A physical backup in a private, protected location reduces online exposure.'],
      ['Outra pessoa pode obter acesso à sua conta. Prefira um backup físico protegido.','Someone else could gain access to your account. Choose a protected physical backup.']]},
  loss: {title:['Seu celular quebrou. Você tem um backup seguro e completo?','Your phone broke. Do you have a secure, complete backup?'],
    options:[['Sim, guardei meu backup','Yes, I saved my backup'],['Não, estava apenas no celular','No, it was only on my phone']],
    feedback:[['Um backup correto e uma carteira compatível podem permitir recuperar o acesso.','A correct backup and a compatible wallet may allow you to recover access.'],
      ['Sem outra forma de acessar suas chaves, seus bitcoins podem ficar permanentemente inacessíveis.','Without another way to access your keys, your bitcoin may become permanently inaccessible.']]},
  scam: {title:['Você cairia nesse golpe?','Would you spot this scam?'],
    options:[['Compartilharia as palavras.','Share the words.'],['Encerraria a conversa e procuraria o suporte oficial.','End the conversation and contact official support.'],['Enviaria apenas algumas palavras.','Send only a few words.']],
    feedback:[['Cuidado! Isso é uma tentativa de golpe.','Be careful! This is a scam attempt.'],['Essa é a atitude correta!','That’s the right approach!'],['Cuidado! Isso é uma tentativa de golpe.','Be careful! This is a scam attempt.']]},
}
export function Scenario({lang, kind}: Props & {kind: 'storage' | 'loss' | 'scam'}) {
  const [answer,setAnswer] = useActivityState<number | null>(kind,null)
  const {title,options,feedback} = choices[kind]
  const outcome = answer === null ? undefined : answer === (kind === 'loss' ? 0 : 1) ? 'success' : 'error'
  const t = (copy: Copy) => pick(lang,copy)
  return <section className={kind === 'scam' ? 'lab scenario scenario-scam' : 'lab scenario'} data-position={kind}>
    <h3>{t(title)}</h3>
    {kind === 'scam' && <blockquote><p><strong>{t(['Suposto suporte da carteira: contato desconhecido','Supposed wallet support: unknown contact'])}</strong></p><p>{t(['“Olá! Identificamos um problema de segurança na sua carteira. Precisamos das suas 12 palavras para proteger seu saldo.”','“Hello! We’ve detected a security problem with your wallet. We need your 12 words to protect your balance.”'])}</p></blockquote>}
    <fieldset><legend className={kind === 'scam' ? undefined : 'sr-only'}>{t(['O que você faria?','What would you do?'])}</legend>
      {options.map((copy,i) => <label key={i} className="choice" data-feedback={answer === i ? outcome : undefined}><input name={kind} type="radio" checked={answer === i} onChange={() => setAnswer(i)} />{t(copy)}</label>)}
    </fieldset>
    <div role="status" aria-atomic="true">{answer !== null && outcome && <div className="feedback" data-feedback={outcome}>
      <p className="feedback-title"><FeedbackIcon kind={outcome} />
        <strong>{outcome === 'success' ? t(['Resposta correta','Correct answer']) : t(['Resposta insegura','Unsafe answer'])}</strong>
      </p>
      <p>{t(feedback[answer])}
        {kind === 'scam' && ' ' + t(['Nunca compartilhe suas palavras de recuperação, nem mesmo parcialmente. Procure ajuda diretamente pelos canais oficiais.','Never share your recovery words, even partially. Seek help directly through official channels.'])}</p>
    </div>}</div>
    {answer !== null && <button onClick={e => {
      e.currentTarget.closest('section')?.querySelector('input')?.focus()
      setAnswer(null)
    }}>{t(['Tentar novamente','Try again'])}</button>}
  </section>
}

export function Checklist({lang}: Props) {
  const [checked,setChecked] = useState<boolean[]>(() => {
    try {
      const values: unknown = JSON.parse(sessionStorage.getItem('learning-checklist') || 'null')
      if (Array.isArray(values) && values.length === 10 && values.every(value => typeof value === 'boolean')) return values
    } catch { /* Storage can be unavailable. */ }
    return Array(10).fill(false)
  })
  const t = (copy: Copy) => pick(lang,copy)
  const copy = lesson(11,lang)
  const items = [...copy.matchAll(/^- (.*)$/gm)].map(([,item]) => item)
  const n = checked.filter(Boolean).length
  function update(next: boolean[]) {
    setChecked(next)
    try {sessionStorage.setItem('learning-checklist',JSON.stringify(next))} catch { /* In-memory state remains available. */ }
  }
  return <section className="checklist" data-position="checklist">
    <Prose copy={copy.split('\n- ')[0]} />
    <label htmlFor="learn-progress">{t([`${n} de 10 conceitos`,`${n} of 10 concepts`])}</label>
    <progress id="learn-progress" value={n} max={10} />
    <div>{items.map((item,i) => <label key={i} className="choice"><input type="checkbox" checked={checked[i]} onChange={() => update(checked.map((v,j) => j === i ? !v : v))} />{item}</label>)}</div>
    <p aria-live="polite">{n === 10 ? copy.split(/(?:Ao completar|On completion): /)[1].replaceAll('**','') : t(['Aprenda no seu ritmo. Você pode voltar às explicações sempre que precisar.','Learn at your own pace. You can revisit the explanations whenever you need to.'])}</p>
    <p className="note">{t(['O progresso fica salvo nesta aba durante a sessão de navegação, inclusive ao recarregar a página.','Progress is saved in this tab during the browser session, including after a reload.'])}</p>
    <button disabled={!n} onClick={() => update(Array(10).fill(false))}>{t(['Reiniciar checklist','Reset checklist'])}</button>
  </section>
}
