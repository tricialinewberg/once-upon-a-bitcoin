import type { Copy } from './content'

export const chapterEmphasis: Copy[] = [['nova forma','new way'],['21 milhões','21 million'],['chaves','keys'],['12 palavras secretas','12 secret words'],['carteira','wallet'],['Bitcoin','bitcoin'],['seu','yours']]

export const milestones: {year: number; art: string; title: Copy; body: Copy; source: [string,string]}[] = [
  {year:2008,art:'document',title:['A ideia nasce','The idea takes shape'],body:[
    'Satoshi Nakamoto publica o whitepaper do Bitcoin, uma proposta de pagamentos eletrônicos diretamente entre pessoas. O documento descreve as regras que permitiriam verificar pagamentos sem depender de uma instituição financeira.',
    'Satoshi Nakamoto publishes the Bitcoin white paper, proposing electronic payments directly between people. It sets out rules for verifying payments without relying on a financial institution.',
  ],source:['Bitcoin white paper','https://bitcoin.org/bitcoin.pdf']},
  {year:2009,art:'block',title:['A rede começa a funcionar','The network goes live'],body:[
    'Em 3 de janeiro, é minerado o primeiro bloco, chamado bloco gênese. Ele se torna o ponto de partida do registro público que a rede de computadores passa a manter.',
    'On January 3, the first block is mined. Known as the genesis block, it becomes the starting point of the public record maintained by the network.',
  ],source:['Genesis block','https://mempool.space/block/0']},
  {year:2010,art:'pizza',title:['Duas pizzas entram para a história','Two pizzas make history'],body:[
    'Em 22 de maio, Laszlo Hanyecz confirma que trocou 10.000 bitcoins por duas pizzas. A compra mostrou que o bitcoin poderia servir como meio de troca por bens do dia a dia. Comunidades de vários países celebram o Bitcoin Pizza Day com encontros e pizzas.',
    'On May 22, Laszlo Hanyecz confirms that he traded 10,000 bitcoin for two pizzas. The purchase showed that bitcoin could be exchanged for everyday goods. Communities in different countries mark Bitcoin Pizza Day with gatherings and pizza.',
  ],source:['Laszlo Hanyecz · BitcoinTalk','https://bitcointalk.org/index.php?topic=137.0']},
  {year:2012,art:'halving',title:['O primeiro halving','The first halving'],body:[
    'Em 28 de novembro, no bloco 210.000, a emissão de novos bitcoins por bloco cai de 50 para 25 BTC. As regras da rede reduzem essa emissão pela metade a cada 210.000 blocos, aproximadamente a cada quatro anos.',
    'On November 28, at block 210,000, new issuance falls from 50 to 25 BTC per block. The network rules halve issuance every 210,000 blocks, roughly every four years.',
  ],source:['Block 210,000','https://mempool.space/block/210000']},
  {year:2017,art:'up',title:['Bitcoin ganha visibilidade','Bitcoin gains public attention'],body:[
    'O preço se aproxima de US$ 20 mil, atraindo a atenção de um público maior. O aumento da demanda por espaço nos blocos também põe em evidência debates sobre capacidade e taxas de transação.',
    'The price approaches US$20,000 and attracts wider public attention. Greater demand for block space also brings debates about capacity and transaction fees into focus.',
  ],source:['CoinGecko · Bitcoin price history','https://www.coingecko.com/research/publications/bitcoin-price-history']},
  {year:2018,art:'down',title:['Uma lição sobre volatilidade','A lesson in volatility'],body:[
    'Após a forte alta de 2017, o preço cai intensamente. Mesmo com uma oferta limitada, a demanda pode diminuir e o preço pode cair por períodos prolongados.',
    'After the steep rise of 2017, the price falls sharply. Even with a limited supply, demand can weaken and prices can fall for extended periods.',
  ],source:['CoinGecko · Bitcoin price history','https://www.coingecko.com/research/publications/bitcoin-price-history']},
  {year:2021,art:'globe',title:['Bitcoin ganha novos espaços','Bitcoin finds new ground'],body:[
    'Em 2021, El Salvador se torna o primeiro país a adotar o Bitcoin como moeda de curso legal. Esse marco descreve o regime aprovado naquele ano.',
    'In 2021, El Salvador becomes the first country to adopt Bitcoin as legal tender. This milestone describes the legal framework adopted that year.',
  ],source:['IMF · El Salvador, 2021 Article IV consultation','https://www.imf.org/en/News/Articles/2022/01/25/pr2213-el-salvador-imf-executive-board-concludes-2021-article-iv-consultation']},
  {year:2022,art:'safe',title:['A importância da autocustódia','Why self-custody matters'],body:[
    'A FTX e outras empresas entram em colapso, expondo o risco de depender de intermediários para guardar ativos. As perdas e bloqueios de saques ocorreram nas plataformas. A rede Bitcoin continuou operando.',
    'FTX and other companies collapse, exposing the risks of relying on intermediaries to hold assets. Customers faced losses and withdrawal freezes at those platforms. The Bitcoin network continued operating.',
  ],source:['U.S. Department of Justice · FTX case','https://www.justice.gov/opa/pr/samuel-bankman-fried-sentenced-25-years-his-orchestration-multiple-fraudulent-schemes']},
  {year:2024,art:'halving',title:['O quarto halving','The fourth halving'],body:[
    'Em abril de 2024, ocorreu o quarto halving do Bitcoin. A recompensa de novos bitcoins por bloco foi reduzida de 6,25 BTC para 3,125 BTC. Esse acontecimento reforça como as regras de emissão da rede são conhecidas antecipadamente e independem das decisões de uma autoridade central.',
    'In April 2024, Bitcoin underwent its fourth halving. The reward of newly issued bitcoin fell from 6.25 BTC to 3.125 BTC per block. The event illustrates how the network’s issuance rules are known in advance and operate independently of decisions by a central authority.',
  ],source:['Block 840,000','https://mempool.space/block/840000']},
]
