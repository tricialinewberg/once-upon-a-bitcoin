# Documento Mestre de Conteúdo — Bitcoin e autocustódia

**Versão 1.0 | 24/11/2026 | Projeto independente de Trícia Linewberg**

Nome comercial: a definir. Este projeto não é o Bitcoin Beauty School. Conteúdo em português aprovado na conversa, incluindo comparação com Pix e adoção da Bitkit. Tradução inglesa preparada para revisão. Esta referência orienta a implementação, não autoriza publicação automática.

## 0. Product brief e regras de implementação

- **Design challenge (PT):** O que uma pessoa precisa entender, enxergar e conseguir fazer para se sentir segura ao começar a cuidar dos próprios bitcoins?
- **Design challenge (EN):** What does someone need to understand, visualize, and be able to do to feel confident taking custody of their own bitcoin?
- Público: iniciantes, especialmente mulheres, sem pressupor conhecimento técnico. Dores e perfis são hipóteses de discovery, não resultados de pesquisa primária.
- Produto: página única educativa, pública, gratuita, sem login, cadastro, conexão de carteira ou movimentação de dinheiro. PT-BR e EN; arquitetura extensível para ES, sem publicar tradução incompleta.
- Pilares: Entender / Understand; Enxergar / Visualize; Conseguir fazer / Take action.
- Identidade inicial: laranja Bitcoin #F7931A, branco #FFFFFF, creme #F8F5EF, laranja suave #FFF1DF, grafite #202020. Laranja escuro para texto quando necessário para contraste. Tipografia ainda não aprovada: Manrope ou Plus Jakarta Sans para títulos, Inter para textos.
- Mobile-first, hierarquia clara, linguagem adulta e acolhedora, sem estereótipos ou promessas de rendimento. Ilustrações 3D autorais com finalidade didática; não inventar telas da Bitkit.
- Fluxo: ChatGPT para conteúdo e artes; Codex para implementação local no Windows; GitHub e Vercel após aprovação. Sem Figma ou Stitch neste projeto.
- Stack proposta, não obrigatória: React, TypeScript, Vite, CSS; Three.js somente se uma interação justificar o custo e houver alternativa acessível.
- Textos PT abaixo consolidam as 26 subseções aprovadas em 12 blocos; EN é adaptação natural. Notas de implementação e fontes não são copy principal. Ajustes de precisão explicitados ao final.
- Nunca solicitar, gerar, validar, transmitir ou guardar palavras de recuperação reais, chaves privadas ou endereços para pagamentos. Nenhuma conexão de carteira. Simulações locais, fictícias e claramente identificadas. Não incluir QR Code pagável.
- Navegação por âncoras, links oficiais funcionais, alternância de idioma preservando a seção atual, títulos semânticos, foco visível, teclado, contraste WCAG AA, reduced motion, textos alternativos e equivalentes textuais das interações. Não usar cor ou movimento como único meio de comunicar informação.

### Navegação / Navigation

| Âncora | PT | EN |
|---|---|---|
| #entender | Entender | Understand |
| #enxergar | Enxergar | Visualize |
| #praticar | Conseguir fazer | Take action |
| #faq | Dúvidas frequentes | FAQ |

Idioma: Português / English. Menu: Abrir menu / Open menu; Fechar menu / Close menu. Acesso rápido: Pular para o conteúdo / Skip to content.

## 1. Hero — apresentação

### PT-BR

**APRENDA BITCOIN DO ZERO**

# Seu Bitcoin. Suas chaves. Sua liberdade.

Aprenda o que é Bitcoin, como guardar seus primeiros satoshis e como proteger seu dinheiro sem depender de uma corretora para mantê-lo.

Você não precisa entender de tecnologia ou investimentos. Só precisa dar o primeiro passo.

CTA principal: **Começar a aprender**. CTA secundário: **Já tenho Bitcoin**.

Gratuito · Para iniciantes · Aprenda no seu ritmo

### EN

**LEARN BITCOIN FROM SCRATCH**

# Your bitcoin. Your keys. Your freedom.

Learn what Bitcoin is, how to store your first satoshis, and how to protect your money without relying on an exchange to hold it for you.

You don't need a background in technology or investing. Just take the first step.

Primary CTA: **Start learning**. Secondary CTA: **I already own bitcoin**.

Free · Beginner-friendly · Learn at your own pace

**Implementação:** primeiro CTA → #entender; segundo → #autocustodia. Composição 3D de carteira, chave e Bitcoin, fundo claro; evitar moeda com aparência de promessa de lucro. Não gerar link vazio.

## 2. Conheça sua jornada / Your learning journey

### PT-BR

## Aprender Bitcoin pode ser mais simples do que você imagina.

Vamos descobrir juntos como ele funciona e como você pode utilizá-lo com mais confiança.

- **01. Entender:** Descubra o que é Bitcoin e por que ele existe.
- **02. Enxergar:** Veja como funcionam as carteiras, as transações e a segurança.
- **03. Conseguir fazer:** Aprenda a cuidar dos seus próprios bitcoins.

### EN

## Learning about Bitcoin can be easier than you think.

Let's explore how it works and how you can use it with greater confidence.

- **01. Understand:** Discover what Bitcoin is and why it exists.
- **02. Visualize:** See how wallets, transactions, and security work.
- **03. Take action:** Learn how to take care of your own bitcoin.

**Implementação:** três cards clicáveis para os capítulos, ícones coerentes e rótulos visíveis.

## 3. Conheça o Bitcoin / Meet Bitcoin — #entender

### 3.1 O que é Bitcoin? — PT-BR

Bitcoin é uma forma de dinheiro digital que permite enviar, receber e guardar valor sem depender de um banco central. Ele funciona por meio de uma rede de computadores espalhados pelo mundo, seguindo regras compartilhadas, sem uma empresa responsável por controlar todo o sistema.

### Qual é a diferença entre Bitcoin e Pix?

O Pix é uma maneira de transferir reais entre contas. O Bitcoin é uma forma de dinheiro com sua própria rede de pagamentos.

| Pix: sistema de pagamentos | Bitcoin: dinheiro digital descentralizado |
|---|---|
| Transfere reais. | Possui sua própria unidade monetária. |
| Depende de uma instituição financeira ou de pagamento. | Não exige uma conta bancária. |
| Está vinculado a uma conta identificada. | A rede não exige CPF ou cadastro pessoal. |
| Funciona principalmente no sistema financeiro brasileiro. | Pode ser utilizado mundialmente. |
| Permite pagamentos em poucos segundos. | Permite que você controle suas próprias chaves. |

### O que muda para você?

- **Controle sobre seu dinheiro:** Com uma carteira de autocustódia, você pode guardar e movimentar seus bitcoins sem depender da autorização de um banco ou corretora.
- **Sem fronteiras:** Você pode enviar Bitcoin para pessoas em diferentes partes do mundo sem utilizar o sistema bancário internacional tradicional.
- **Mais autonomia e privacidade:** Você pode criar uma carteira própria sem informar seu CPF, nome ou endereço à rede Bitcoin. Serviços de compra podem exigir identificação. As transações na rede principal são públicas e rastreáveis. Bitcoin não é completamente anônimo.
- **Uma quantidade limitada:** O Bitcoin possui regras de emissão conhecidas, com limite de aproximadamente 21 milhões de unidades.
- **Uma rede que não fecha:** Funciona continuamente, inclusive em feriados. O Pix também funciona 24 horas por dia.

O preço pode variar, transferências podem ter taxas e você precisa proteger o acesso à carteira. Vamos aprender sobre cada ponto ao longo da jornada.

### 3.1 What is Bitcoin? — EN

Bitcoin is a form of digital money that lets you send, receive, and store value without relying on a central bank. A worldwide network of computers follows shared rules, without one company in charge of the whole system.

### How is Bitcoin different from Pix?

Pix moves Brazilian reais between accounts. Bitcoin is a form of money with its own payment network.

| Pix: payment system | Bitcoin: decentralized digital money |
|---|---|
| Transfers Brazilian reais. | Has its own monetary unit. |
| Relies on a financial or payment institution. | Does not require a bank account. |
| Is linked to an account with a verified identity. | The network does not require a Brazilian tax ID or personal registration. |
| Operates primarily within Brazil’s financial system. | Can be used worldwide. |
| Enables payments within seconds. | Lets you control your own keys. |

### What changes for you?

- **Control over your money:** With a self-custody wallet, you can hold and move your bitcoin without needing permission from a bank or exchange.
- **Across borders:** You can send bitcoin to people around the world without relying on traditional international banking networks.
- **More autonomy and privacy:** You can create your own wallet without giving the Bitcoin network your name, ID, or address. Services that sell bitcoin may require identification. Base-layer transactions are public and traceable. Bitcoin is not completely anonymous.
- **Limited supply:** Bitcoin follows known issuance rules, with a limit of approximately 21 million bitcoin.
- **An always-on network:** Bitcoin operates around the clock, including holidays. Pix also runs 24 hours a day.

The price can change, transfers may involve fees, and you need to protect access to your wallet. We’ll explore each of these topics along the way.

### 3.2 História e características — PT-BR

## A história do Bitcoin.

Em 2008, Satoshi Nakamoto apresentou uma proposta de dinheiro eletrônico sem depender de um intermediário financeiro. Em 2009, a rede começou a funcionar.

A proposta combinava criptografia, uma rede descentralizada de computadores e um mecanismo chamado prova de trabalho (Proof of Work). Juntos, esses elementos permitiram que transações fossem verificadas sem a necessidade de uma autoridade central.

As transações são agrupadas em blocos conectados entre si, formando um registro público conhecido como blockchain. Essa estrutura ajuda a impedir que os mesmos bitcoins sejam gastos duas vezes.

### Por que o Bitcoin é diferente?

Quantidade limitada · Descentralizado · Autonomia · Global.

Novos bitcoins são emitidos por meio da mineração. Aproximadamente a cada quatro anos, a emissão por bloco cai pela metade: é o halving. A escassez não garante valorização.

### 3.2 History and features — EN

## The history of Bitcoin.

In 2008, Satoshi Nakamoto proposed electronic money that could work without a financial intermediary. In 2009, the network began operating.

The proposal combined cryptography, a decentralized network of computers, and a mechanism called proof of work. Together, they made it possible to verify transactions without a central authority.

Transactions are grouped into linked blocks, forming a public record called the blockchain. This structure helps prevent the same bitcoin from being spent twice.

### What makes Bitcoin different?

Limited supply · Decentralized · Autonomy · Global.

New bitcoin is issued through mining. Approximately every four years, issuance per block is cut in half: this is called the halving. Scarcity does not guarantee price increases.

**Implementação:** Capítulo I usa comparação semântica, explorador de benefícios, rede entre pares 3D com pausa e linha do tempo de nove marcos. Os textos bilíngues e as referências de cada marco são mantidos em `src/chapter-history.ts`.

## 4. Valor do Bitcoin / Bitcoin's value

### PT-BR

## Você não precisa comprar um Bitcoin inteiro.

Assim como um real pode ser dividido em centavos, um bitcoin pode ser dividido em unidades menores, chamadas satoshis (sats).

**1 BTC = 100.000.000 satoshis.** Você pode adquirir pequenas frações. Os valores mínimos dependem do serviço e das taxas.

Conversor: **Explore pequenas quantidades de Bitcoin** | Satoshis (sats) | Equivalente em Bitcoin | Conversão de unidades, sem relação com a cotação atual.

### Bitcoin e outras criptomoedas são a mesma coisa?

Não exatamente. Bitcoin faz parte da categoria das criptomoedas, mas possui regras, história e rede próprias. Outros criptoativos têm diferentes objetivos, formas de emissão e mecanismos de segurança. Neste site estudamos exclusivamente Bitcoin.

### Volatilidade e funcionamento da rede

Atenção: quedas de preço fazem parte da volatilidade do Bitcoin. Oscilações de mercado não significam, por si só, que a rede deixou de funcionar ou que a tecnologia falhou.

**Uma queda de preço não significa, por si só, que a rede Bitcoin deixou de funcionar.**

A oferta, a procura, as condições econômicas e as expectativas do mercado influenciam o preço. Ele pode subir ou cair bastante em pouco tempo. Mesmo durante uma queda, a rede pode continuar registrando transações normalmente. O preço e o funcionamento da rede são coisas diferentes.

Entender o risco vem antes de qualquer decisão de compra. O pânico numa queda e a euforia numa alta podem levar a decisões precipitadas. Nem o tempo nem o histórico de preços garantem ganhos.

**O que é HODL?** Na cultura do Bitcoin, HODL é um termo popular para a ideia de manter bitcoins por um longo prazo. Algumas pessoas usam a expressão para falar de manter a calma durante a volatilidade, sem reagir a cada oscilação. A expressão descreve uma postura, sem recomendar uma estratégia ou prometer resultados.

Antes de comprar seus primeiros satoshis:
- Entenda o que está comprando.
- Não utilize dinheiro necessário para despesas essenciais.
- Conheça os riscos antes de decidir.
- Evite decisões motivadas por medo, pressão ou euforia.
- Nunca acredite em promessas de lucro garantido.

### EN

## You don't need to buy a whole bitcoin.

Just as a dollar can be divided into cents, one bitcoin can be divided into smaller units called satoshis (sats).

**1 BTC = 100,000,000 satoshis.** You can acquire small fractions. Minimum amounts depend on the service and fees.

Converter: **Explore small amounts of bitcoin** | Satoshis (sats) | Equivalent in bitcoin | Unit conversion, unrelated to the current market price.

### Are Bitcoin and other cryptocurrencies the same?

Not exactly. Bitcoin is a cryptocurrency, but it has its own rules, history, and network. Other cryptoassets have different purposes, issuance policies, and security mechanisms. This website focuses exclusively on Bitcoin.

### Volatility and network operation

Keep in mind: price drops are part of Bitcoin’s volatility. Market swings alone do not mean that the network has stopped operating or that the technology has failed.

**A price drop does not, by itself, mean the Bitcoin network has stopped working.**

Supply, demand, economic conditions, and market expectations all influence the price. It can rise or fall sharply in a short time. During a price drop, the network can still record transactions as usual. The price and the operation of the network are two different things.

Understand the risk before making any purchase decision. Panic during a drop and euphoria during a rally can both lead to rushed decisions. Time and past price movements offer no guarantee of gains.

**What is HODL?** In Bitcoin culture, HODL is a popular term for holding bitcoin over the long term. Some people use it to describe staying calm during volatility instead of reacting to every swing. The term describes a mindset and carries no recommendation or promise of results.

Before buying your first satoshis:
- Understand what you're buying.
- Don't use money needed for essential expenses.
- Understand the risks before deciding.
- Avoid decisions driven by fear, pressure, or excitement.
- Never trust promises of guaranteed returns.

**Implementação:** conversor local, inteiro não negativo em sats, BTC com 8 casas decimais; presets 1.000, 10.000, 100.000, 1.000.000 sats. Gráfico histórico BTC/USD somente com dados reais verificados do FRED/Coinbase [12], datas, moeda e fonte visíveis, altas e quedas; sem projeções. Se dados indisponíveis, não publicar gráfico fictício como histórico. Alternativa textual acessível. Fontes [4, 12, 13].

## 5. Como funciona / How it works — #enxergar

### PT-BR

## Uma rede de pessoas e computadores.

Imagine um livro de registros compartilhado entre computadores em diferentes partes do mundo. Quando alguém envia Bitcoin, a rede verifica se a transação respeita as regras.

- **Nós da rede:** computadores que verificam as regras e os registros.
- **Mineradores:** utilizam poder computacional e energia para propor novos blocos de transações.
- **Blockchain:** histórico compartilhado de transações confirmadas, organizado em blocos.

### Onde ficam os meus bitcoins?

Seus bitcoins não ficam dentro do celular. Eles são registrados na rede Bitcoin. Sua carteira gerencia as chaves que permitem movimentá-los.

Se o celular quebrar, um backup completo e uma carteira compatível podem permitir recuperar o acesso.

### EN

## A network of people and computers.

Imagine a shared record book across computers around the world. When someone sends bitcoin, the network checks that the transaction follows the rules.

- **Nodes:** computers that verify the rules and records.
- **Miners:** use computing power and energy to propose new blocks of transactions.
- **Blockchain:** the shared history of confirmed transactions, organized into blocks.

### Where is my bitcoin stored?

Your bitcoin isn't stored inside your phone. It is recorded on the Bitcoin network. Your wallet manages the keys that allow you to move it.

If your phone breaks, a complete backup and a compatible wallet may allow you to recover access.

**Implementação:** animação/diagrama de rede sem nó central controlador; reduzir movimento conforme preferência. Fontes [1, 3, 4].

## 6. Suas chaves, seus bitcoins / Your keys, your bitcoin — #autocustodia

### PT-BR

## Corretora ou autocustódia?

| Corretora custodial | Autocustódia |
|---|---|
| Outra empresa controla as chaves. Você depende da plataforma para saques e transferências. | Você controla as chaves e não depende de uma corretora para autorizar movimentações dos bitcoins sob seu controle. |
| Riscos: invasões, bloqueio de saques, falência, perda de acesso à conta. | Responsabilidades: proteger as chaves, guardar o backup, evitar golpes e conferir transações. |

Uma corretora pode ser útil para comprar ou vender Bitcoin. Mas deixar seus bitcoins sob a responsabilidade de outra empresa é diferente de controlá-los diretamente.

**Autocustódia significa assumir o controle e a responsabilidade do seu patrimônio.**

### O que posso compartilhar?

- **Endereço Bitcoin:** informação para receber bitcoins, em texto ou QR Code. Pode compartilhar para receber pagamentos, considerando sua privacidade.
- **Chave privada:** informação secreta usada para autorizar movimentações. Nunca compartilhe.
- **Palavras de recuperação:** palavras secretas que permitem recuperar o acesso a muitas carteiras. Nunca compartilhe.

Você não precisa conhecer os detalhes matemáticos, apenas o que pode compartilhar e o que deve proteger.

### EN

## Exchange or self-custody?

| Custodial exchange | Self-custody |
|---|---|
| Another company controls the keys. You rely on the platform for withdrawals and transfers. | You control the keys and don't need an exchange to authorize transactions with bitcoin under your control. |
| Risks: hacks, withdrawal freezes, company failure, loss of account access. | Responsibilities: protect your keys, keep your backup safe, avoid scams, and check transactions. |

An exchange can help you buy or sell bitcoin. But leaving it in someone else's custody is different from controlling it yourself.

**Self-custody means taking control of your assets and accepting responsibility for them.**

### What can I share?

- **Bitcoin address:** information used to receive bitcoin, as text or a QR code. You can share it to receive payments, while considering your privacy.
- **Private key:** secret information used to authorize transactions. Never share it.
- **Recovery words:** secret words that allow access to many wallets to be restored. Never share them.

You don't need to understand the mathematics, only what you can share and what you need to protect.

**Interação:** alternar Corretora / Exchange e Autocustódia / Self-custody; destacar quem controla as chaves. Cenários: bloqueio de saques → depende da plataforma; perda do celular → backup completo pode permitir recuperação. Usar cofre institucional e carteira pessoal em 3D; sem prometer imunidade a riscos. Fontes [4–7].

## 7. Suas palavras secretas / Your recovery words

### PT-BR

## O acesso aos seus bitcoins.

Muitas carteiras Bitcoin geram 12 ou 24 palavras secretas quando são criadas. Essas palavras fazem parte do backup que permite recuperar sua carteira.

**Quem tiver acesso às suas palavras poderá, em uma carteira comum, recuperar suas chaves e movimentar seus bitcoins.** Se você perder o backup e também perder o acesso à carteira, poderá perder seus bitcoins definitivamente.

**Nunca compartilhe suas palavras.** Nem com atendentes, amigos, supostos especialistas ou pessoas que prometem recuperar seus bitcoins.

### Como essas palavras são criadas?

As palavras não são escolhidas por você. Elas são geradas pela carteira utilizando um processo criptográfico.

Em carteiras que utilizam o padrão BIP39, esse processo começa com informações aleatórias geradas de forma segura. Essas informações recebem uma verificação e são convertidas em uma sequência de palavras.

A ordem dessas palavras é fundamental para recuperar o acesso à carteira.

Não escolha palavras por conta própria, não use combinações encontradas na internet e não peça a uma inteligência artificial que crie suas palavras.

**Não invente suas próprias palavras. Deixe uma carteira confiável gerá-las com segurança.**

Nem toda carteira usa BIP39. Para recuperar o acesso, também pode ser necessário usar uma carteira compatível e ter outras informações do backup.

### Como guardar suas palavras de recuperação?

**Seu backup deve estar seguro, mesmo sem internet.** Anote as palavras na ordem correta e guarde-as em local privado, protegido contra acesso indevido e danos físicos.

- **Papel:** opção simples e acessível. Proteja contra água, fogo, desgaste e perda.
- **Metal:** alternativa mais resistente a determinados danos físicos, como fogo e umidade.

**O que fazer:** anote todas as palavras na ordem correta; confira a escrita; guarde o backup separadamente do dispositivo; escolha local privado e protegido; verifique periodicamente suas condições.

**O que evitar:** fotos ou prints; Google Drive ou iCloud; WhatsApp ou e-mail; aplicativos de notas; sites ou ferramentas de IA; depender apenas da memória.

### Preciso ter mais de uma cópia?

Uma cópia adicional pode ajudar a proteger contra perda ou destruição. Cada nova cópia também representa outro local que precisa ser protegido contra acesso indevido.

### E se alguém descobrir minhas palavras?

**Considere sua carteira comprometida.**

1. Crie uma nova carteira em um dispositivo confiável.
2. Gere novas palavras de recuperação pela própria carteira.
3. Transfira os fundos restantes assim que puder fazê-lo com segurança.

Alterar apenas a senha ou o PIN não resolve o comprometimento das palavras.

### EN

## Access to your bitcoin.

Many Bitcoin wallets generate 12 or 24 secret words when they are created. These words are part of the backup that allows you to recover your wallet.

**Anyone who obtains your words may be able to recover your keys and move your bitcoin in a typical wallet.** If you lose both your backup and access to your wallet, you may permanently lose access to your bitcoin.

**Never share your recovery words.** Not with support agents, friends, supposed experts, or anyone promising to recover your bitcoin.

### How are these words created?

You do not choose the words. Your wallet generates them through a cryptographic process.

For wallets that use BIP39, the process starts with securely generated random information. A checksum is added before that information is converted into a sequence of words.

The order of the words is essential to recovering access to the wallet.

Do not choose your own words, use combinations found online, or ask AI to create them.

**Do not invent your own words. Let a trusted wallet generate them securely.**

Some wallets use other standards. Recovery can also require a compatible wallet and additional backup information.

### How should you store your recovery words?

**Keep your backup safe, even offline.** Write the words in the correct order and store them privately, protected against unauthorized access and physical damage.

- **Paper:** a simple, accessible option. Protect it against water, fire, wear, and loss.
- **Metal:** an alternative that can offer greater resistance to certain physical damage, including fire and moisture.

**Do:** write every word in the correct order; check spelling; keep the backup separate from your device; choose a private, protected location; periodically check its condition.

**Avoid:** photos or screenshots; Google Drive or iCloud; WhatsApp or email; notes apps; websites or AI tools; relying only on memory.

### Do I need more than one copy?

An additional copy can help protect against loss or destruction. Each new copy also creates another location you must protect against unauthorized access.

### What if someone discovers my words?

**Treat your wallet as compromised.**

1. Create a new wallet on a trusted device.
2. Let the new wallet generate new recovery words.
3. Transfer the remaining funds as soon as you can do so safely.

Changing only the password or PIN does not address compromised recovery words.

**Interação:** cartão 3D com 12 campos mascarados, sem entradas editáveis. Legenda PT: Representação ilustrativa. EN: Illustration only. Cenário: Seu celular quebrou. Você tem um backup seguro e completo? / Your phone broke. Do you have a secure, complete backup? Respostas: Sim, guardei meu backup / Yes, I saved my backup; Não, estava apenas no celular / No, it was only on my phone. Feedback positivo: Um backup correto e uma carteira compatível podem permitir recuperar o acesso. / A correct backup and a compatible wallet may allow you to recover access. Negativo: Sem outra forma de acessar suas chaves, seus bitcoins podem ficar permanentemente inacessíveis. / Without another way to access your keys, your bitcoin may become permanently inaccessible. Nunca coletar palavras reais. Fontes [5, 8, 10, 11].

## 8. Sua primeira carteira / Your first wallet — #praticar

Descrição PT-BR: Aprenda sobre recebimento, envio e taxas.

Description EN: Learn about receiving, sending, and transaction fees.

### PT-BR

## Qual carteira combina com suas necessidades?

- **Carteira mobile — Hot Wallet:** aplicativo instalado no celular, geralmente conectado à internet. Prática para aprender, pequenas transações e uso cotidiano. Exige atenção à segurança do dispositivo.
- **Carteira física — Hardware Wallet:** dispositivo dedicado a proteger as chaves privadas, mantendo-as isoladas do computador ou celular usado para acessar a internet. Pode ser alternativa para armazenamento de longo prazo, com configuração e backup corretos.

### O que verificar antes de escolher?

Controle das próprias chaves, documentação acessível, atualizações de segurança e mecanismos claros de backup e recuperação. Baixe sempre pelos canais oficiais.

## Sua jornada de autocustódia começa aqui!

Existem diferentes carteiras Bitcoin disponíveis, cada uma com suas próprias características e funcionalidades. Você tem liberdade para escolher aquela que melhor atende às suas necessidades.

### Minha recomendação pessoal

A Bitkit é a carteira que utilizo e recomendo pela minha experiência de uso. Gosto especialmente do seu design, da simplicidade da interface, da facilidade de encontrar as funcionalidades e da experiência de segurança e autonomia que ela me proporciona.

Você não precisa utilizar a mesma carteira que eu. O mais importante é escolher uma carteira confiável, compreender seu funcionamento e manter o controle das suas próprias chaves.

### Conheça a Bitkit.

A Bitkit é uma carteira Bitcoin de autocustódia para celulares, com uma interface intuitiva e recursos que você pode explorar conforme aprende. Com ela, você pode guardar, receber e enviar Bitcoin mantendo o controle das suas chaves.

- **Autocustódia:** você controla suas chaves.
- **Acessibilidade:** disponível para Android e iOS.
- **Código aberto:** seu código pode ser inspecionado.
- **Lightning Network:** possibilidade de realizar pagamentos rápidos utilizando Bitcoin.

CTA: **Conhecer a Bitkit** → https://bitkit.to/ . Baixe sempre pelos canais oficiais.

### Vamos criar sua primeira carteira?

1. **Baixe a Bitkit:** acesse o site oficial e escolha a versão compatível com seu celular.
2. **Crie sua carteira:** abra o aplicativo e siga as instruções para criar uma nova carteira.
3. **Proteja suas 12 palavras:** anote na ordem apresentada e em ambiente privado.
4. **Confira seu backup:** verifique se todas as palavras foram anotadas corretamente e siga as orientações de verificação disponíveis no aplicativo.
5. **Proteja seu acesso:** configure os recursos de segurança disponíveis no aplicativo e no celular.
6. **Explore sua carteira:** conheça os recursos de recebimento, envio e acompanhamento do saldo. Não tenha pressa.

**Você não precisa comprar Bitcoin para criar sua primeira carteira.** Conheça o aplicativo, aprenda como funciona e decida quando se sente preparada para começar.

### Aprenda no seu ritmo

A Bitkit possui outros recursos que você poderá explorar conforme adquirir experiência, incluindo pagamentos pela Lightning Network. Não é necessário entender todas as funcionalidades agora.

- **Savings — Reserva:** saldo na rede principal do Bitcoin.
- **Spending — Pagamentos:** saldo disponível para pagamentos pela Lightning Network.

A recuperação do saldo Lightning envolve backups específicos da Bitkit. Não presuma que as 12 palavras sozinhas recuperam todos os saldos. Siga as instruções oficiais de backup da carteira.

**Precisa de ajuda?** Consulte os tutoriais e orientações oficiais da carteira. CTA: **Central de ajuda da Bitkit** → https://help.bitkit.to/

### EN

## Which wallet suits your needs?

- **Mobile wallet — Hot wallet:** an app on your phone, usually connected to the internet. Useful for learning, small transactions, and everyday use. Requires attention to device security.
- **Hardware wallet:** a dedicated device that protects private keys by isolating them from the computer or phone used to access the internet. It may be suitable for long-term storage when configured and backed up correctly.

### What should you look for?

Control of your own keys, accessible documentation, security updates, and clear backup and recovery mechanisms. Always download from official sources.

## Your self-custody journey starts here!

There are many Bitcoin wallets, each with its own features and capabilities. You’re free to choose the one that best meets your needs.

### My personal recommendation

Bitkit is the wallet I use and recommend based on my own experience. I especially like its design, the simplicity of the interface, how easy it is to find the features I need, and the sense of security and autonomy it gives me.

You don’t have to use the same wallet I do. What matters most is choosing a wallet you trust, understanding how it works, and keeping control of your own keys.

### Meet Bitkit.

Bitkit is a self-custodial Bitcoin wallet for mobile devices, with an intuitive interface and features you can explore as you learn. It allows you to hold, receive, and send bitcoin while keeping control of your keys.

- **Self-custody:** you control your keys.
- **Availability:** available for Android and iOS.
- **Open source:** its code can be inspected.
- **Lightning Network:** enables fast payments using bitcoin.

CTA: **Explore Bitkit** → https://bitkit.to/ . Always download from official sources.

### Ready to create your first wallet?

1. **Download Bitkit:** visit the official website and select the version for your phone.
2. **Create your wallet:** open the app and follow its instructions to create a new wallet.
3. **Protect your 12 words:** write them down in the order shown, in a private setting.
4. **Check your backup:** make sure every word was recorded correctly and follow the verification guidance available in the app.
5. **Secure access:** configure the available security features on the app and your phone.
6. **Explore your wallet:** get familiar with receiving, sending, and checking your balance. Take your time.

**You don't need to buy bitcoin to create your first wallet.** Explore the app, learn how it works, and decide when you feel ready to begin.

### Learn at your own pace

Bitkit offers other features you can explore as you gain experience, including Lightning Network payments. You don't need to understand every feature right now.

- **Savings:** bitcoin held on the main Bitcoin network.
- **Spending:** bitcoin available for Lightning Network payments.

Recovering a Lightning balance involves Bitkit-specific backups. Do not assume the 12 words alone can recover every balance. Follow the wallet's official backup instructions.

**Need help?** Explore the wallet's official tutorials and guidance. CTA: **Bitkit help center** → https://help.bitkit.to/

**Implementação:** Bitkit substitui BlueWallet em todo o site. Exemplo educacional escolhido pela autora, não endosso de segurança absoluta. Priorizar rede principal. Confirmar versão, nomes de telas, fluxo de backup e requisitos Lightning antes de publicar; usar screenshots reais aprovados, sem fundos, endereços ou palavras reais. Usar imagens de interface apenas com autorização de publicação confirmada e dados fictícios ou devidamente sanitizados. O kit oficial da Bitkit contém capturas, mas não foi localizada uma autorização explícita de republicação. Até receber uma captura autorizada, manter a introdução e o link oficial sem imagem. Tutorial em vídeo é melhoria futura, sem botão inativo. Fontes [6, 9, 18].

## 9. Suas primeiras transações / Your first transactions

### PT-BR

## Como receber seus primeiros satoshis?

1. Abra sua carteira Bitcoin.
2. Selecione a opção de receber na rede principal.
3. Copie seu endereço ou apresente o QR Code.
4. Confira se o endereço e a rede estão corretos.
5. Acompanhe a confirmação da transação na carteira.

**Para receber Bitcoin, você não precisa revelar suas palavras de recuperação.**

### De onde podem vir meus primeiros satoshis?

Você pode receber Bitcoin de outra pessoa, como pagamento por um serviço ou adquiri-lo por meio de um serviço de compra. Caso utilize uma corretora, verifique a possibilidade de retirar Bitcoin pela rede correta para uma carteira sob seu controle, assim como os custos. Faça uma pequena transferência de teste antes de movimentar valores maiores, considerando as taxas.

## Como enviar Bitcoin?

1. Abra sua carteira e selecione enviar.
2. Insira o endereço Bitcoin do destinatário.
3. Informe o valor.
4. Confira a taxa.
5. Revise endereço, rede e valor.
6. Autorize o envio somente se tudo estiver correto.

**Confira antes de confirmar.** Transações confirmadas não possuem mecanismo de estorno como alguns pagamentos bancários. Se enviar ao destinatário errado, poderá não recuperar o valor.

## Por que existe uma taxa para enviar Bitcoin?

Na rede principal, normalmente existe uma taxa para incentivar mineradores a incluir a transação em um bloco. A taxa depende do tamanho da transação em dados e da demanda pela rede, não apenas do valor enviado. Quando muitas pessoas utilizam a rede, as taxas podem aumentar.

### Preciso saber calcular a taxa?

Não. Muitas carteiras sugerem uma taxa automaticamente. Confira o valor antes de autorizar.

### Quanto tempo demora uma transferência?

A rede procura manter uma média de aproximadamente dez minutos entre blocos. Isso não significa que toda transação será confirmada em dez minutos. O tempo depende das condições da rede, da taxa escolhida e de outros fatores.

### EN

## How do I receive my first satoshis?

1. Open your Bitcoin wallet.
2. Select the option to receive on the main network.
3. Copy your address or show the QR code.
4. Check that the address and network are correct.
5. Follow the transaction confirmation in your wallet.

**You don't need to reveal your recovery words to receive bitcoin.**

### Where can my first satoshis come from?

You can receive bitcoin from another person, as payment for a service, or acquire it through a buying service. If you use an exchange, check whether you can withdraw bitcoin over the correct network to a wallet you control, and check the costs. Make a small test transfer before moving larger amounts, taking fees into account.

## How do I send bitcoin?

1. Open your wallet and select send.
2. Enter the recipient's Bitcoin address.
3. Enter the amount.
4. Check the fee.
5. Review the address, network, and amount.
6. Authorize the transfer only if everything is correct.

**Check before confirming.** Confirmed Bitcoin transactions do not have a chargeback mechanism like some bank payments. If you send to the wrong recipient, you may not recover the funds.

## Why is there a fee for sending bitcoin?

On the main network, a fee usually incentivizes miners to include a transaction in a block. The fee depends on the transaction's data size and network demand, not just the amount sent. When many people use the network, fees may rise.

### Do I need to calculate the fee myself?

No. Many wallets suggest a fee automatically. Check it before authorizing a transfer.

### How long does a transfer take?

The network aims for an average of about ten minutes between blocks. That does not mean every transaction will confirm in ten minutes. Timing depends on network conditions, the selected fee, and other factors.

**Interação:** simulação sem transferência real, sem QR válido. Calculadora: quantidade inteira positiva em sats; tamanho hipotético 140 vB; opções 1, 5, 20 sat/vB; taxa = 140 × opção; total = valor + taxa. Exibir campos e resultados com separadores locais. PT: Simule uma transferência / Quanto deseja enviar? (satoshis) / Taxa menor, intermediária, maior / Valor enviado / Taxa estimada / Total gasto. EN: Simulate a transfer / How much would you like to send? (satoshis) / Lower, medium, higher fee / Amount sent / Estimated fee / Total spent. Aviso PT: Valores hipotéticos. Transação ilustrativa de 140 vB. Não representa taxas atuais nem recomendação de taxa. EN: Hypothetical values. Illustrative 140 vB transaction. Not current network fees or a fee recommendation. Fontes [3, 4, 19].

## 10. Proteja seu Bitcoin / Protect your bitcoin

### PT-BR

## Desconfie de quem promete dinheiro fácil.

Bitcoin é uma tecnologia. Pessoas mal-intencionadas podem utilizar seu nome para aplicar golpes.

- **Lucro garantido:** ninguém pode garantir quanto Bitcoin valerá amanhã.
- **Falsos atendentes:** suporte legítimo não precisa das suas palavras de recuperação.
- **Aplicativos falsos:** baixe pelos canais oficiais; não confie apenas no primeiro resultado da pesquisa.
- **Bitcoin em dobro:** desconfie de quem pede que você envie bitcoins para receber uma quantidade maior.
- **Pressão para agir rapidamente:** não envie dinheiro nem compartilhe segredos sob pressão.

### Você cairia nesse golpe?

Suposto suporte da carteira: contato desconhecido

“Olá! Identificamos um problema de segurança na sua carteira. Precisamos das suas 12 palavras para proteger seu saldo.”

O que você faria?
- Compartilharia as palavras.
- Encerraria a conversa e procuraria o suporte oficial. [correta]
- Enviaria apenas algumas palavras.

Feedback correto: **Essa é a atitude correta!** Feedback incorreto: **Cuidado! Isso é uma tentativa de golpe.** Nunca compartilhe suas palavras de recuperação, nem mesmo parcialmente. Procure ajuda diretamente pelos canais oficiais. CTA: Tentar novamente.

## Pequenos cuidados fazem uma grande diferença.

| Hábitos de segurança | Por que isso importa? |
|---|---|
| Mantenha aplicativos atualizados. | Atualizações corrigem falhas que podem comprometer a segurança da sua carteira. |
| Proteja o celular com senha. | Cria uma barreira adicional contra acessos indevidos. |
| Não divulgue quanto Bitcoin possui. | Preserva sua privacidade e reduz a exposição a golpes. |
| Confira endereços antes de enviar. | Ajuda a evitar transferências para destinos incorretos. |
| Faça pequenas transferências de teste. | Permite verificar o destino e o processo antes de enviar quantidades maiores. |
| Proteja o backup físico. | Ajuda a preservar o acesso aos seus bitcoins mesmo se você perder o dispositivo. |
| Utilize novos endereços de recebimento quando possível. | Dificulta a associação pública entre diferentes recebimentos. |

### EN

## Be cautious of anyone promising easy money.

Bitcoin is a technology. Scammers may use its name to commit fraud.

- **Guaranteed returns:** no one can guarantee what bitcoin will be worth tomorrow.
- **Fake support agents:** legitimate support does not need your recovery words.
- **Fake apps:** download from official sources; don't trust the first search result alone.
- **Double your bitcoin:** distrust anyone asking you to send bitcoin in return for more.
- **Pressure to act quickly:** don't send money or share secrets under pressure.

### Would you spot this scam?

Supposed wallet support: unknown contact

“Hello! We've detected a security problem with your wallet. We need your 12 words to protect your balance.”

What would you do?
- Share the words.
- End the conversation and contact official support. [correct]
- Send only a few words.

Correct feedback: **That's the right approach!** Incorrect feedback: **Be careful! This is a scam attempt.** Never share your recovery words, even partially. Seek help directly through official channels. CTA: Try again.

## Small habits make a big difference.

| Security habits | Why does this matter? |
|---|---|
| Keep apps updated. | Updates fix vulnerabilities that could compromise your wallet. |
| Protect your phone with a passcode. | Adds a layer of protection against unauthorized access. |
| Don't disclose how much bitcoin you hold. | Protects your privacy and lowers your exposure to scams. |
| Check addresses before sending. | Helps prevent sending bitcoin to the wrong destination. |
| Make small test transfers. | Lets you verify the destination and the process before sending larger amounts. |
| Protect your physical backup. | Helps you retain access to your bitcoin if you lose your device. |
| Use new receiving addresses when possible. | Makes it harder to publicly link separate payments you receive. |

**Implementação:** conversa simulada, feedback por texto e ícone, teclado e leitor de tela; sem contatos ou formulários reais. Fontes [5, 7, 13, 14].

## 11. Revise o aprendizado / Review what you've learned

### PT-BR

## Tudo pronto para a autocustódia?

Seu checklist de aprendizagem. Marque os conceitos que você já compreendeu.

- Entendo o que é Bitcoin.
- Sei a diferença entre uma corretora e uma carteira de autocustódia.
- Entendo o que são satoshis.
- Sei quais informações posso compartilhar.
- Entendo a importância das minhas palavras de recuperação.
- Sei como proteger meu backup.
- Sei como receber e enviar Bitcoin.
- Entendo como funcionam as taxas.
- Sei identificar os principais sinais de golpe.
- Entendo que o preço do Bitcoin pode cair.

Progresso: {n} de 10 conceitos. Aprenda no seu ritmo. Você pode voltar às explicações sempre que precisar.

Ao completar: **Você concluiu sua revisão!** Continue aprendendo e praticando com responsabilidade. Conhecimento é o primeiro passo para a autonomia.

### EN

## Are you ready for self-custody?

Your learning checklist. Check the concepts you already understand.

- I understand what Bitcoin is.
- I know the difference between an exchange and a self-custody wallet.
- I understand what satoshis are.
- I know what information I can share.
- I understand the importance of my recovery words.
- I know how to protect my backup.
- I know how to receive and send bitcoin.
- I understand how fees work.
- I can recognize common warning signs of scams.
- I understand that bitcoin's price can fall.

Progress: {n} of 10 concepts. Learn at your own pace. You can revisit the explanations whenever you need to.

On completion: **You've completed your review!** Keep learning and practicing responsibly. Knowledge is the first step toward autonomy.

**Implementação:** autoavaliação, não certificado nem garantia de competência. Progresso = n/10; manter estado na sessão e durante troca de idioma; opção de reiniciar. Nenhum dado pessoal.

## 12. Continue aprendendo / Keep learning — #faq

### FAQ — PT-BR

**Preciso ter muito dinheiro para comprar Bitcoin?** Não. Bitcoin pode ser dividido em satoshis. Os valores mínimos dependem do serviço e das taxas.

**Bitcoin é um golpe?** Bitcoin é uma rede monetária digital. Criminosos podem utilizar Bitcoin ou seu nome para aplicar golpes.

**Preciso pagar para criar uma carteira?** Existem aplicativos gratuitos de autocustódia. Carteiras físicas normalmente precisam ser compradas. Transações podem envolver taxas.

**Se meu celular quebrar, perco meus bitcoins?** Você pode recuperar o acesso em outro dispositivo se tiver o backup necessário, como as 12 palavras de recuperação da sua carteira, e usar uma carteira compatível.

**Posso guardar minhas 12 palavras no celular?** Recomendamos um backup físico protegido. Evite fotos, prints, mensagens e armazenamento em nuvem.

**Posso compartilhar meu endereço Bitcoin?** Sim, para receber pagamentos. Considere sua privacidade e utilize novos endereços quando possível.

**Posso compartilhar minhas palavras com o suporte da carteira?** Não. Nenhum atendimento legítimo precisa das suas palavras de recuperação.

**Bitcoin pode perder valor?** Sim. O preço pode cair e oscilar no curto prazo, e não há garantia de recuperação. Para muitas pessoas, o valor do Bitcoin também está na escassez e na autonomia que a autocustódia permite. Evite tomar decisões apenas com base em movimentos momentâneos do mercado.

**Posso cancelar uma transferência?** Uma transação confirmada não pode ser cancelada. Confira todos os dados antes de enviar.

**Preciso de uma corretora para ter Bitcoin?** Não. Você pode receber Bitcoin diretamente em uma carteira própria. Corretoras são uma das formas possíveis de compra e venda.

**O site terá acesso aos meus bitcoins?** Não. Este site é exclusivamente educativo. Não solicita palavras de recuperação, não conecta carteiras e não movimenta dinheiro.

### FAQ — EN

**Do I need a lot of money to buy bitcoin?** No. Bitcoin can be divided into satoshis. Minimum amounts depend on the service and fees.

**Is Bitcoin a scam?** Bitcoin is a digital monetary network. Criminals may use bitcoin or its name to commit fraud.

**Do I need to pay to create a wallet?** Free self-custody apps exist. Hardware wallets typically need to be purchased. Transactions may involve fees.

**If my phone breaks, will I lose my bitcoin?** You can recover access on another device if you have the required backup, such as your wallet’s 12 recovery words, and use a compatible wallet.

**Can I store my 12 words on my phone?** We recommend a protected physical backup. Avoid photos, screenshots, messages, and cloud storage.

**Can I share my Bitcoin address?** Yes, to receive payments. Consider your privacy and use new addresses when possible.

**Can I share my words with wallet support?** No. Legitimate support does not need your recovery words.

**Can bitcoin lose value?** Yes. Its price can fall and fluctuate in the short term, and a recovery is not guaranteed. For many people, Bitcoin’s value also lies in its scarcity and the autonomy self-custody offers. Avoid making decisions based solely on short-term market moves.

**Can I cancel a transfer?** A confirmed transaction cannot be canceled. Check all details before sending.

**Do I need an exchange to own bitcoin?** No. You can receive bitcoin directly in your own wallet. Exchanges are one possible way to buy and sell it.

**Will this website have access to my bitcoin?** No. This website is educational only. It does not request recovery words, connect wallets, or move money.

### Encerramento — PT-BR

## Sua autonomia começa com conhecimento.

Você não precisa entender tudo sobre Bitcoin de uma só vez. Cada novo conceito aprendido ajuda você a tomar decisões mais conscientes sobre seu dinheiro.

**Aprenda. Pratique. Proteja. Continue evoluindo.**

### Closing — EN

## Your autonomy starts with knowledge.

You don't need to understand everything about Bitcoin at once. Every new concept you learn helps you make more informed decisions about your money.

**Learn. Practice. Protect. Keep growing.**

### Rodapé / Footer

**Designed & Developed by Trícia Linewberg**

PT: Projeto independente de educação sobre Bitcoin e autocustódia. Criado para tornar o conhecimento sobre Bitcoin mais acessível, especialmente para mulheres que desejam compreender a tecnologia e desenvolver autonomia sobre seu dinheiro.

**Aviso:** este website possui finalidade exclusivamente educacional. Não oferece aconselhamento financeiro personalizado, não realiza transações e nunca solicita chaves privadas ou palavras de recuperação.

EN: Independent educational project about Bitcoin and self-custody. Created to make Bitcoin knowledge more accessible, especially for women who want to understand the technology and develop autonomy over their money.

**Disclaimer:** this website is for educational purposes only. It does not provide personalized financial advice, perform transactions, or request private keys or recovery words.

Links PT/EN: Fontes e referências / Sources and references; Portfólio / Portfolio → https://tricia-linewberg-portfolio.vercel.app/pt-br/ (EN use verified English route); LinkedIn → https://linkedin.com/in/tricia-linewberg/; GitHub do projeto / Project GitHub (somente após criação do repositório); Português / English.

**Implementação:** FAQ com accordion acessível, botões semânticos, aria-expanded e estados claros. Fechamento com arte 3D. Não criar links vazios.

---

## 13. Biblioteca de fontes e referências

Fontes de referência da pesquisa anterior e links adicionais para validação. A presença nesta lista não significa que todas as páginas foram reabertas nesta etapa de consolidação. Codex não deve inventar citações nem dados.

1. Satoshi Nakamoto, Bitcoin whitepaper — https://bitcoin.org/bitcoin.pdf — origem e proposta.
2. Me Aprende um Bitcoin — https://meaprendeumbitcoin.com.br/pt-br/ — referência didática PT.
3. Learn Me a Bitcoin — https://learnmeabitcoin.com/beginners/how-does-bitcoin-work/ — referência didática EN; acesso anterior retornou 403.
4. Bitcoin.org FAQ — https://bitcoin.org/en/faq — fundamentos, emissão e funcionamento.
5. Bitcoin.org Secure your wallet — https://bitcoin.org/en/secure-your-wallet — segurança e custódia.
6. Bitcoin.org Choose your wallet — https://bitcoin.org/en/choose-your-wallet — escolha de carteiras.
7. Bitcoin.org Protect your privacy — https://bitcoin.org/en/protect-your-privacy — privacidade.
8. BIP39 — https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki — padrão de frases mnemônicas; nem todas as carteiras o utilizam.
9. Bitkit — https://bitkit.to/ e https://help.bitkit.to/ — aplicativo, backups e documentação oficial.
10. Trezor — https://trezor.io/guides/backups-recovery/general-standards/keeping-your-wallet-backup-safe — segurança física do backup.
11. My First Bitcoin — https://curriculum.myfirstbitcoin.org/programs/bitcoin-diploma/pt-BR/student-guide/module/3/ — educação e segurança.
12. FRED/Coinbase BTC/USD — https://fred.stlouisfed.org/series/CBBTCUSD/ — série histórica; verificar licença/atribuição, período e valores antes de usar.
13. CVM — https://www.gov.br/investidor/pt-br/investir/cuidados-ao-investir/evitando-problemas/principais-fraudes-e-esquemas-irregulares/criptoativos-e-icos — riscos e fraudes.
14. FTC — https://consumer.ftc.gov/articles/what-know-about-cryptocurrency-scams — golpes.
15. Banco Central do Brasil — https://www.bcb.gov.br/estabilidadefinanceira/pix — funcionamento do Pix.
16. SEC — https://www.sec.gov/ — localizar comunicado e decisão de 10/01/2024 sobre ETPs spot de bitcoin antes de publicar timeline.
17. Bitcoin Core — https://github.com/bitcoin/bitcoin — regras do protocolo e emissão; fonte técnica complementar.
18. Bitkit código-fonte — https://github.com/synonymdev/bitkit — confirmar repositório e versão aplicável.
19. Bitcoin developer guide — https://developer.bitcoin.org/devguide/transactions.html — transações e taxas.
20. Nielsen Norman Group — https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/ — linguagem concisa, objetiva e escaneável.

## 14. Checklist de entrega para Codex

- [ ] Nome e identidade final aprovados pela autora; não inventar marca.
- [ ] Todas as 12 seções, PT e EN completas, sem misturar idiomas.
- [ ] Artes 3D aprovadas; sem imagens genéricas de terceiros ou telas inventadas.
- [ ] Conversor, comparação, cenário de backup, simulador de taxas, quiz de golpe, checklist e FAQ funcionam.
- [ ] Conteúdo técnico revisado e referências verificadas; tutorial Bitkit confirmado na versão atual; dados históricos reais, fonte e período explícitos.
- [ ] Nenhum segredo real solicitado; nenhum QR pagável, login ou integração financeira.
- [ ] Layout desktop e mobile, contraste, teclado, reduced motion e leitor de tela revisados; sem cortes nem sobreposições.
- [ ] Build e verificações funcionais executados; relatório dos arquivos e limitações.
- [ ] Preview local aprovado visualmente antes de commit/push.
- [ ] GitHub criado pela autora e código enviado após autorização; Vercel publicado e produção conferida.

## 15. Registro editorial e pendências

- Consolidação dos 26 tópicos nos 12 blocos aprovados, incluindo Pix e Bitkit. Tradução EN adapta Pix para transferências bancárias internacionais; não implica equivalência de todas as instituições.
- Pequenos ajustes de precisão para revisão: rede sem identificação não equivale a anonimato; backup completo é necessário e Lightning pode exigir dados adicionais; a etapa de conferência da Bitkit não pressupõe botão específico não verificado; produtos spot de 2024 descritos como produtos negociados em bolsa; QR meramente ilustrativo; diagrama de rede sem centro controlador. Alguns parágrafos e cards repetidos foram condensados para leitura rápida.
- Não foi realizada nova auditoria integral de fontes durante a criação deste arquivo. Ainda pendem verificação de links, versão atual da Bitkit e backup Lightning, dados históricos do gráfico e revisão técnica final. Não alegar que esses itens estão validados.
- Pesquisa primária e testes com usuárias reais não realizados. Revisão heurística não substitui testes de usabilidade.
- Nome, tipografia final, imagens, wireframes em código e detalhes de animação permanecem pendentes de aprovação. Nenhuma ação em GitHub/Vercel autorizada por este documento.

### Adendo editorial do Capítulo I

As duas versões comparam Pix e Bitcoin. A composição não usa disponibilidade contínua como vantagem exclusiva do Bitcoin. As ressalvas sobre identificação e rastreabilidade fazem parte do benefício de autonomia e privacidade.

A linha do tempo cobre nove marcos: o whitepaper em 2008, o bloco gênese em 2009, Bitcoin Pizza Day em 2010, o primeiro halving em 2012, o interesse público e a capacidade da rede em 2017, volatilidade em 2018, o marco legal histórico em El Salvador em 2021, a falência da FTX e os riscos de custódia em 2022, e o quarto halving em 2024. Os textos bilíngues completos e as referências por evento estão em [chapter-history.ts](src/chapter-history.ts).

Conclusão PT-BR: **Bitcoin e outras criptomoedas são a mesma coisa?** Não! Bitcoin faz parte da categoria das criptomoedas, mas possui regras, história e rede próprias. Outros criptoativos têm diferentes objetivos, formas de emissão e mecanismos de segurança. **Neste site estudamos exclusivamente Bitcoin.**

Conclusion EN: **Are Bitcoin and other cryptocurrencies the same?** No. Bitcoin is a cryptocurrency, and it has its own rules, history, and network. Other cryptoassets have different purposes, issuance policies, and security mechanisms. **This site focuses exclusively on Bitcoin.**

#### Refinamento 05 · Capítulos I e II

O marco de 2024 apresenta somente o quarto halving. Em abril, a recompensa de novos bitcoins por bloco caiu de 6,25 para 3,125 BTC, conforme as regras de emissão da rede. Os textos completos em português e inglês estão em [chapter-history.ts](src/chapter-history.ts). [Registro do bloco 840.000](https://mempool.space/block/840000).

O conversor de satoshis é exclusivamente uma conversão de unidades. O cenário de volatilidade distingue uma queda de preço da continuidade de operação da rede no exemplo, sem representar dados históricos ou prometer continuidade em todos os cenários. A série histórica verificável continua disponível no FRED. As cinco recomendações de aprendizado responsável continuam visíveis em uma lista informativa.

#### Refinamento 08

O aviso de volatilidade aparece após a explicação de satoshis e antes do conversor na ordem de leitura. A frase principal, a explicação de volatilidade, HODL e a lista de aprendizado responsável permanecem no Capítulo II. A interface não inclui o título nem o gráfico ilustrativo de preço da versão anterior.


## Refinamento 09 — Experiências de rede e backup / Network and backup experiences

- PT-BR. A rede descentralizada mostra a propagação automaticamente. Em “Quem controla a chave?”, a escolha Corretora / Autocustódia muda a posição da chave e explica quem autoriza, os efeitos de um bloqueio de saques e a responsabilidade do usuário. Bitcoins já em autocustódia permanecem distintos dos fundos na corretora.
- EN. The decentralized network shows propagation automatically. In “Who controls the key?”, choosing Exchange or Self-custody moves the key and explains authorization, withdrawal freezes, and the user's responsibility. Bitcoin already in self-custody is distinct from funds held by an exchange.
- PT-BR / EN. Aleatoriedade segura → processamento criptográfico → palavras de recuperação / Secure randomness → cryptographic processing → recovery words. Ilustrações abstratas e espaços mascarados, sem entradas / Abstract illustrations and masked spaces, with no inputs. [Especificação / Specification BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).
