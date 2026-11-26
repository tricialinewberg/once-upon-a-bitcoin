import master from '../Documento-Mestre-Bitcoin-Autocustodia-PT-EN.md?raw'

export type Language = 'pt' | 'en'
export type Copy = [string, string]
export const locale = (lang: Language) => lang === 'pt' ? 'pt-BR' : 'en'
export const pick = (lang: Language, copy: Copy) => copy[lang === 'pt' ? 0 : 1]

export const chapters: { numeral: string; title: Copy; description: Copy }[] = [
  { numeral:'I', title:['Uma nova forma de enxergar o dinheiro','A new way to look at money'], description:['Descubra o que é Bitcoin, sua história e suas diferenças em relação ao dinheiro tradicional.','Discover what Bitcoin is, its history, and how it differs from traditional money.'] },
  { numeral:'II', title:['O segredo dos 21 milhões','The secret of 21 million'], description:['Descubra por que o Bitcoin é limitado, conheça os satoshis e entenda por que seu preço muda.','Discover Bitcoin’s limited supply, meet satoshis, and understand why its price changes.'] },
  { numeral:'III', title:['O poder das suas próprias chaves','The power of your own keys'], description:['Aprenda quem controla seus bitcoins e descubra a importância da autocustódia.','Learn who controls your bitcoin and why self-custody matters.'] },
  { numeral:'IV', title:['As 12 palavras secretas','The 12 secret words'], description:['Entenda as palavras de recuperação e aprenda a proteger seu backup.','Understand recovery words and learn how to protect your backup.'] },
  { numeral:'V', title:['Sua primeira carteira','Your first wallet'], description:['Aprenda sobre recebimento, envio e taxas.','Learn about receiving, sending, and transaction fees.'] },
  { numeral:'VI', title:['Protegendo seu Bitcoin','Protecting your bitcoin'], description:['Aprenda a reconhecer golpes e adotar hábitos de segurança.','Learn to spot scams and build safer habits.'] },
  { numeral:'VII', title:['O próximo capítulo é seu','The next chapter is yours'], description:['Revise seu aprendizado, esclareça dúvidas e continue explorando.','Review what you’ve learned, find answers, and keep exploring.'] },
]

const sections = master.replaceAll('\r','').split(/^## \d+\. /m).slice(1)
export function lesson(number: number, lang: Language, group = 0) {
  return sections[number].split(/^### (?:PT-BR|EN|3\.[12] .* (?:PT-BR|EN)).*$/m)[1 + (lang === 'en' ? 1 : 0) + group * 2]
    .split(/^\*\*(?:Implementação|Interação):/m)[0].trim()
}

const finalSection = sections[12]
export function finalCopy(lang: Language, type: 'FAQ' | 'closing' | 'footer') {
  const index = lang === 'pt' ? 0 : 1
  if (type === 'footer') {
    return finalSection.split(/^### Rodapé.*$/m)[1].split(/^(?:PT|EN): /m)[index + 1].split(/^Links PT/m)[0].trim()
  }
  return finalSection.split(/^### .*$/m)[(type === 'FAQ' ? 1 : 3) + index].trim()
}

export const sources = [...sections[13].matchAll(/^\d+\. (.*?) — (https?:\/\/[^\s]+)/gm)]
  .map(([, title, url]) => ({title, url: title.startsWith('SEC') ? 'https://www.sec.gov/files/rules/sro/nysearca/2024/34-99306.pdf' : url}))
export const artwork = {
  'hero-book-bitcoin': [1672, 941], logo: [255,126], blockchain: [368,509], key: [509,508],
  'recovery-card': [503,508], safe: [380,509], shield: [383,509], wallet: [508,508],
} as const
export type Artwork = keyof typeof artwork
export const asset = (name: Artwork) => new URL(`../assets/${name}.png`, import.meta.url).href
