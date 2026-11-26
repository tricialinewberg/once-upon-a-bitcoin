import { pick, type Language } from './content'

function Coin() {
  return <><ellipse cx="96" cy="72" rx="31" ry="34" fill="#bb782d"/><ellipse cx="91" cy="72" rx="27" ry="33" fill="#e6ab53" stroke="#f6d38a" strokeWidth="3"/><text x="91" y="84" fill="#74491f" textAnchor="middle" fontSize="34">₿</text></>
}

export function TimelineArt({kind,year,lang}: {kind:string;year:number;lang:Language}) {
  if (kind === 'block' || kind === 'safe') return <img src={kind === 'block' ? '/journey-network.webp' : '/journey-wallet.webp'} width="768" height="460" alt="" />
  if (kind === 'halving') return <div className="halving-art">
    <div><svg viewBox="59 37 70 70" aria-hidden="true"><Coin /></svg><span>{year===2024?pick(lang,['6,25','6.25']):'50'} BTC</span></div>
    <svg viewBox="0 0 40 24" aria-hidden="true"><path d="M2 12h34m-10-8 10 8-10 8" /></svg>
    <div><svg viewBox="59 37 70 70" aria-hidden="true"><Coin /></svg><span>{year===2024?pick(lang,['3,125','3.125']):'25'} BTC</span></div>
  </div>
  return <svg viewBox="0 0 180 144" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="90" cy="132" rx="60" ry="6" fill="#a87348" opacity=".18"/>
    {kind === 'document' && <g transform="rotate(-10 90 78)">
      <path d="M55 23h59l16 16v83H55z" fill="#ab7761"/><path d="M50 18h60l16 16v83H50z" fill="#f0dbb7"/>
      <path d="M110 18v17h16M64 54h47M64 65h42M64 76h47M64 87h34" stroke="#ad7950" strokeWidth="3"/>
      <circle cx="108" cy="101" r="9" fill="#ac542f"/>
    </g>}
    {kind === 'globe' && <><path d="M90 108v18m-20 1h40" stroke="#ab7137" strokeWidth="6"/><circle cx="90" cy="66" r="43" fill="#e1ae73" stroke="#f0c988" strokeWidth="4"/><ellipse cx="90" cy="66" rx="21" ry="43" stroke="#926344" strokeWidth="2"/><path d="M47 66h86M55 45h70M55 87h70" stroke="#926344" strokeWidth="2"/></>}
    {kind === 'pizza' && <>{[67,110].map((x,i) => <g key={x} transform={`translate(${x} ${62+i*14}) rotate(-20)`}><ellipse rx="36" ry="26" fill="#be743a"/><ellipse rx="32" ry="22" fill="#efba67"/>{[[-12,-6],[5,8],[14,-6],[-21,7]].map(([a,b])=><circle key={a} cx={a} cy={b} r="5" fill="#a84132"/>)}</g>)}<g transform="translate(50 68) scale(.44)"><Coin /></g></>}
    {(kind === 'up' || kind === 'down') && <><rect x="28" y="28" width="124" height="91" rx="9" fill="#523c30"/><path d="M44 46v57h91M45 63h88M45 83h88" stroke="#a37b60" strokeWidth="1"/><path d={kind === 'down' ? 'm47 51 23 20 22-7 22 23 17 10' : 'm47 92 23-19 22 6 22-22 17-10'} stroke="#ffc478" strokeWidth="4"/></>}
  </svg>
}
