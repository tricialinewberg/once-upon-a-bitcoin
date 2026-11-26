import type { ReactNode } from 'react'
import { useActivityState } from './activity-state'
import { lesson, pick, type Copy, type Language } from './content'
import { Emphasis, Prose, inline } from './editorial'
import { Calculator } from './interactions'

const site = 'https://bitkit.to/'
const help = 'https://help.bitkit.to/'
const recovery = help+'hc/help-center/articles/1702498810-how-can-i-restore-my-wallet'
const heading = (copy: string) => copy.replace(/^#+ /,'')
const blocks = (copy: string) => copy.trim().split('\n\n')
const lines = (copy: string) => copy.split('\n').map(line=>line.replace(/^(- |\d+\. )/,''))
const labels = (copy: string) => lines(copy).map(line=>line.slice(2).split(/:\*\* |\*\*: /))
const receiveTitles: Copy[] = [
  ['Abra a carteira','Open the wallet'],['Escolha a rede','Choose the network'],['Compartilhe o endereço','Share the address'],
  ['Confirme os dados','Verify the details'],['Acompanhe a confirmação','Track confirmation'],
]
const sendTitles: Copy[] = [
  ['Abra a opção de envio','Open the send flow'],['Identifique o destino','Set the destination'],['Defina o valor','Set the amount'],
  ['Confira a taxa','Check the fee'],['Revise a transferência','Review the transfer'],['Autorize após revisar','Authorize after review'],
]

function WalletVisual({mode,title,step}: {mode: 'receive'|'send'; title: string; step?: string}) {
  return <div className="wallet-visual" data-mode={mode} aria-hidden="true">
    <div className="wallet-visual-phone">
      <div className="wallet-visual-screen">
        <span className="wallet-visual-camera" />
        <span className="wallet-visual-symbol">{mode === 'receive' ? '↙' : '↗'}</span>
        <strong>{title}</strong>
        {step && <span className="wallet-visual-detail">{step}</span>}
        <span className="wallet-visual-bars"><i /><i /><i /></span>
      </div>
    </div>
  </div>
}

function StepList({items,setup=false}: {items:string[];setup?:boolean}) {
  return <ol className={setup?'wallet-steps setup-steps':'wallet-steps'} role="list">
    {items.map((step,i)=><li key={i}><span aria-hidden="true" className="wallet-step-number">{String(i+1).padStart(2,'0')}</span><span>{inline(step)}</span></li>)}
  </ol>
}

function TransferGuide({lang,receive,send}: {lang:Language;receive:string[];send:string[]}) {
  const [sending,setSending]=useActivityState('transfer-send',false)
  const [step,setStep]=useActivityState('transfer-step',0)
  const t=(copy:Copy)=>pick(lang,copy)
  const items=sending?send:receive
  const title=t((sending?sendTitles:receiveTitles)[step])
  const progress=t([`Passo ${step+1} de ${items.length}`,`Step ${step+1} of ${items.length}`])
  return <section className="lab wallet-demo" data-position="transfer">
    <h2>{t(['Pratique o envio e o recebimento','Practice sending and receiving'])}</h2>
    <p className="note">{t(['Demonstração com dados fictícios · Rede principal','Illustration with fictional data · Main network'])}</p>
    <div className="wallet-demo-modes" role="group" aria-label={t(['Modo de prática','Practice mode'])}>
      {[false,true].map(mode=><button key={String(mode)} type="button" aria-pressed={mode===sending}
        onClick={()=>{if(mode!==sending){setSending(mode);setStep(0)}}}>{mode?t(['Enviar','Send']):t(['Receber','Receive'])}</button>)}
    </div>
    <div className="wallet-demo-body">
      <div>
        <p className="wallet-demo-count">{progress}</p>
        <progress value={step+1} max={items.length} aria-label={progress} />
        <div className="transfer-step" role="status" aria-atomic="true">
          <h3>{title}</h3>
          <p>{items[step]}</p>
          {!sending&&step===2&&<code>{t(['ENDEREÇO–ILUSTRATIVO','ILLUSTRATIVE–ADDRESS'])}</code>}
        </div>
        <div className="controls">
          <button type="button" disabled={step===0} onClick={()=>setStep(step-1)}>{t(['Anterior','Back'])}</button>
          <button type="button" onClick={()=>setStep((step+1)%items.length)}>{step===items.length-1?t(['Reiniciar','Restart']):t(['Próximo passo','Next step'])}</button>
        </div>
      </div>
      <WalletVisual mode={sending?'send':'receive'} title={sending?t(['Enviar','Send']):t(['Receber','Receive'])} step={title} />
    </div>
  </section>
}

export function ChapterFive({lang}: {lang:Language}) {
  const t=(copy:Copy)=>pick(lang,copy)
  const [,types,bitkit]=lesson(8,lang).split(/^## /m)
  const [typesTitle,typeList,criteriaHeading,criteria]=blocks(types)
  const [bitkitTitle,choice,noteTitle,noteExperience,noteChoice,bitkitSub,intro,benefits,,setupTitle,setupList,setupNote,paceTitle,paceIntro,balances,backup,support]=blocks(bitkit)
  const [,receive,send,fees]=lesson(9,lang).split(/^## /m)
  const [receiveTitle,receiveList,receiveNote,sourceTitle,source]=blocks(receive)
  const [sendTitle,sendList,sendNote]=blocks(send)
  const [feeTitle,...feeDetails]=blocks(fees)
  const receiveSteps=lines(receiveList)
  const sendSteps=lines(sendList)
  const callout=(children:ReactNode, kind='')=><div className={'wallet-callout '+kind}>{children}</div>
  return <div id="praticar" tabIndex={-1} className="chapter-lesson wallet-chapter">
    <section data-position="wallet-types">
      <h2>{typesTitle}</h2>
      <div className="wallet-pairs">
        {labels(typeList).map(([label,detail])=><article key={label}><h3>{label}</h3><p>{detail[0].toUpperCase()+detail.slice(1)}</p></article>)}
      </div>
      <div className="wallet-criteria"><h3>{heading(criteriaHeading)}</h3><p>{criteria}</p></div>
    </section>
    <section className="wallet-bitkit" data-position="bitkit">
      <h2><Emphasis text={bitkitTitle} phrase={t(['autocustódia','self-custody'])} /></h2>
      <p>{choice}</p>
      <div className="wallet-personal-note">
        <h3>{heading(noteTitle)}</h3>
        <p>{noteExperience}</p>
        <p>{noteChoice}</p>
      </div>
      <div className="wallet-product">
        <h3 className="wallet-lead">{heading(bitkitSub)}</h3>
        <p>{intro}</p>
        <ul className="wallet-benefits">{lines(benefits).map(line=><li key={line}>{inline(line)}</li>)}</ul>
        <a className="text-link" href={site}>{t(['Conhecer a Bitkit','Explore Bitkit'])} ↗</a>
      </div>
    </section>
    <section data-position="wallet-setup">
      <h2><Emphasis text={heading(setupTitle)} phrase={t(['carteira','wallet'])} /></h2>
      <StepList items={lines(setupList)} setup />
      {callout(<p>{inline(setupNote)}</p>)}
    </section>
    <section data-position="wallet-pace">
      <h2>{heading(paceTitle)}</h2>
      <p>{paceIntro}</p>
      <div className="wallet-pairs balances">{labels(balances).map(([label,detail])=><article key={label}><h3>{label}</h3><p>{detail[0].toUpperCase()+detail.slice(1)}</p></article>)}</div>
      {callout(<p>{backup}</p>,'wallet-warning')}
      <div className="wallet-support">
        <p>{inline(support.split(' CTA: ')[0])}</p>
        <div className="controls">
          <a className="text-link" href={help} target="_blank" rel="noopener noreferrer">{t(['Central de ajuda da Bitkit','Bitkit help center'])} ↗</a>
          <a className="text-link" href={recovery} target="_blank" rel="noopener noreferrer">{t(['Guia oficial de recuperação','Official recovery guide'])} ↗</a>
        </div>
      </div>
    </section>
    <section data-position="wallet-receive">
      <h2>{receiveTitle}</h2>
      <div className="wallet-spread"><div><StepList items={receiveSteps} />{callout(<p>{inline(receiveNote)}</p>)}</div>
        <WalletVisual mode="receive" title={t(['Receber Bitcoin','Receive bitcoin'])} step={t(['Rede principal','Main network'])} />
      </div>
      <div className="wallet-criteria"><h3>{heading(sourceTitle)}</h3><p>{source}</p></div>
    </section>
    <section data-position="wallet-send">
      <h2><Emphasis text={sendTitle} phrase={t(['Bitcoin','bitcoin'])} /></h2>
      <div className="wallet-spread"><div><StepList items={sendSteps} />{callout(<p>{inline(sendNote)}</p>,'wallet-warning')}</div>
        <WalletVisual mode="send" title={t(['Enviar Bitcoin','Send bitcoin'])} step={t(['Rede principal','Main network'])} />
      </div>
    </section>
    <TransferGuide lang={lang} receive={receiveSteps} send={sendSteps} />
    <section className="wallet-spread wallet-fees" data-position="wallet-fees">
      <div><h2><Emphasis text={feeTitle} /></h2><Prose copy={feeDetails.join('\n\n')} /></div>
      <Calculator lang={lang} fee />
    </section>
  </div>
}
