# Once Upon a Bitcoin — Documento Mestre de Design

**Versão 1.0 · 24/11/2026 · Projeto independente de Trícia Linewberg**  
**Status:** direção criativa e requisitos de experiência consolidados; implementação, validação visual e publicação pendentes.

## 1. Como utilizar este documento

Este arquivo é a referência de identidade visual, arquitetura de interface, navegação, interação, movimento e critérios de aceitação para o Codex. Deve ser usado junto com:

- `Documento-Mestre-Bitcoin-Autocustodia-PT-EN.md` — textos, fontes, conteúdo técnico e microcopy.
- `once-upon-a-bitcoin-assets.zip` — oito imagens PNG aprovadas, na pasta `assets/`.

As decisões mais recentes deste documento prevalecem sobre as propostas antigas de nome, tipografia, hero, navegação e organização visual presentes no Documento Mestre de Conteúdo. **O conteúdo educativo aprovado continua sendo a fonte oficial; não omitir, resumir arbitrariamente ou inventar informações.** A tradução inglesa está preparada, mas ainda requer revisão final. Os detalhes técnicos e dimensões abaixo são parâmetros iniciais de implementação, não prova de que um layout final já foi aprovado.

Não iniciar o projeto Bitcoin Beauty School: este é um novo produto independente. Não modificar o portfólio existente nem outros repositórios. Não publicar, fazer push ou criar integrações externas sem aprovação da versão local.

## 2. Produto e posicionamento

- **Nome:** Once Upon a Bitcoin.
- **Tradução conceitual:** Era uma vez um Bitcoin. Manter o nome da marca em inglês nas duas versões.
- **Slogan:** Knowledge is the key. / Conhecimento é a chave.
- **Design challenge:** O que uma pessoa precisa entender, enxergar e conseguir fazer para se sentir segura ao começar a cuidar dos próprios bitcoins?
- **EN:** What does someone need to understand, visualize, and be able to do to feel confident taking custody of their own bitcoin?
- **Público:** iniciantes, especialmente mulheres, sem pressupor formação técnica ou financeira; acessível a todas as pessoas.
- **Proposta:** educação prática, visual, confiável e acessível sobre Bitcoin e autocustódia.
- **Formato:** site público de página única, sete capítulos navegáveis, PT-BR e EN. Estrutura extensível a ES, mas não publicar um terceiro idioma incompleto.
- **Pilares:** Entender / Understand; Enxergar / Visualize; Conseguir fazer / Take action.
- **Fora do escopo:** login, cadastro, transações reais, conexão com carteira, captura de dados financeiros, recomendação personalizada de investimento, geração de seed, promessas de retorno.
- **Personalidade:** adulta, curiosa, sofisticada, acolhedora, confiável. Storytelling literário e fantasia apenas sutil; não transformar em jogo infantil ou site de especulação.
- **Objetivo de portfólio:** demonstrar Product Design, arquitetura, UX Writing, acessibilidade, interação educativa, direção de arte e implementação funcional, sem inventar pesquisas ou resultados.

## 3. Identidade de marca

### 3.1 Logotipo

Usar a composição aprovada de `assets/logo.png` como referência visual obrigatória:

1. `once upon a` — menor, grafite, centralizado.
2. `bitcoin.` — maior, laranja, centralizado, com ponto final.
3. `Knowledge is the key.` — menor, cinza, centralizado.

A marca usa o arquivo aprovado, com proporções preservadas e acesso à homepage pelo cabeçalho. O nome acessível é Once Upon a Bitcoin. No colofão, a composição e o slogan foram preservados, com a palavra Bitcoin em laranja e os demais elementos claros sobre grafite.

### 3.2 Paleta

| Token | Hex | Aplicação |
|---|---|---|
| brand | #F7931A | Laranja Bitcoin, ilustrações, destaques |
| brand-deep | #D97706 | Marca, detalhes gráficos, progresso |
| action | #A84E08 | CTA, links e texto em fundo claro quando contraste adequado |
| canvas | #F8F5EF | Creme, fundo principal |
| tint | #FFF1DF | Fundo de destaque |
| surface | #FFFFFF | Superfícies |
| ink | #202020 | Texto principal, seção de contraste pontual |
| muted | #555555 | Texto secundário |
| border | #E5DED3 | Divisórias e contornos |

Tons dourados, bronze, marrom acinzentado e sombras quentes apenas como complemento dos assets. Cores semânticas de sucesso/erro devem ser acompanhadas de texto e ícones. Não usar laranja claro como texto pequeno sobre branco sem teste de contraste. Testar cada combinação real segundo WCAG 2.2 AA (4,5:1 para texto normal; 3:1 para texto grande e indicadores relevantes). Fundo claro é dominante; grafite pode destacar o capítulo II, sem tornar o produto dark mode.

### 3.3 Tipografia

| Papel | Fonte | Peso | Desktop inicial | Mobile inicial |
|---|---|---:|---:|---:|
| H1 da homepage | Manrope | 620 | Até 68px | Até 54px |
| Título de capítulo e H2 | Manrope | 600 | 56px | 36px |
| Subtítulos | Manrope | 500–600 | 30px | 26px |
| Números | Manrope | 700 | 72px | 44px |
| Introdução | Inter | 400 | 20px | 18px |
| Corpo | Inter | 400 | 18px | 16px |
| Botões/menu | Inter | 600 | 16px | 16px |
| Legendas | Inter | 400 | 14px | 14px |
| Marca | Inter / PNG aprovado | conforme referência | fluido | fluido |

Usar `clamp()` para escala responsiva. Corpo com entrelinha aproximada 1,6; títulos com entrelinha 1,05–1,2, sem corte de ascendentes/descendentes. Garantir acentos e caracteres de ambos os idiomas. Preferir fontes locais WOFF2 com licença preservada, `font-display: swap` e fallbacks adequados. Não distribuir fontes fora da licença. Evitar texto em caixa alta longo.

### 3.4 Layout e componentes

- Grid 12 colunas desktop, 8 tablet, 4 mobile. Container máximo 1280px; coluna de leitura 600–680px.
- Escala base de 8px (4px para pequenos detalhes); margem mobile inicial 20px; distância entre capítulos 96–128px desktop, reduzida conforme tela.
- Bordas de componentes 8–16px; botões e alvos de toque preferencialmente 44×44px ou maiores.
- Alternar composições editoriais, texto e imagem, grandes números, linhas divisórias e espaços abertos. Não colocar todo conteúdo em cards idênticos. Cards apenas quando a organização realmente beneficia a compreensão.
- Ícones coerentes, rótulos claros, alinhamento óptico, contraste e estados de foco, hover, ativo, desabilitado e erro quando aplicáveis. Links externos sinalizados com texto acessível; sem botões sem função.
- Mobile-first: não reduzir a versão desktop mecanicamente. Reordenar elementos para leitura, manter CTA visível, evitar overflow horizontal, garantir que menus, tabelas, gráficos e simuladores funcionem por toque e teclado.

## 4. Assets aprovados e linguagem 3D

### 4.1 Direção de arte

Fotografia de produto e render editorial premium: materiais foscos ou acetinados, papel texturizado, metal escovado, couro discreto, iluminação suave de estúdio, sombras naturais, paleta quente, poucos elementos por composição. Fantasia na metáfora narrativa, não em partículas, brilhos ou aparência de brinquedo. Proibido repetir o conceito infantil das primeiras tentativas do hero.

### 4.2 Manifesto dos arquivos

Extrair o ZIP, preservando nomes e conteúdo. Os caminhos abaixo são relativos à pasta `public/` proposta para Vite.

| Caminho | Uso | Estado |
|---|---|---|
| assets/hero-book-bitcoin.png | Hero: livro aberto e Bitcoin | Aprovado; fallback visual oficial |
| assets/logo.png | Referência do wordmark | Aprovado |
| assets/key.png | Controle das chaves, capítulo III | Aprovado |
| assets/recovery-card.png | Backup, capítulo IV | Aprovado |
| assets/wallet.png | Carteira pessoal, capítulos III/V | Aprovado |
| assets/safe.png | Custódia e proteção, capítulos III/VI | Aprovado |
| assets/blockchain.png | Rede Bitcoin, capítulo III | Aprovado |
| assets/shield.png | Segurança e golpes, capítulo VI | Aprovado |
| assets/bitkit.png (eventual) | Aplicativo real, capítulo V | Não incluído no ZIP; uso condicionado |

Bitkit: site oficial https://bitkit.to/ e ajuda https://help.bitkit.to/. A referência anteriormente selecionada é https://bitkit.to/_next/static/media/product-bitkit.1fd323d7.png; verificar se ainda existe, se mostra a interface real atual e se as condições permitem reprodução antes de baixar ou publicar. Creditar a imagem à Bitkit se usada com autorização adequada. Se não houver imagem utilizável, utilizar apresentação textual com link oficial e asset genérico de carteira, sem inventar uma tela da Bitkit. Não bloquear o restante da implementação por isso.

Preservar os PNGs originais; derivados WebP/AVIF são permitidos para performance após comparação visual. Definir dimensões, `aspect-ratio`, `srcset` quando útil, carregamento tardio abaixo da dobra; não cortar objetos, textos ou detalhes relevantes. Não transformar uma imagem estática em alegação de modelo 3D manipulável. Revisar cartão de backup: jamais exibir uma frase válida nem QR pagável. Usar representação com palavras mascaradas na interface funcional.

## 5. Arquitetura e mapeamento do conteúdo

O site é apresentado como um livro com prólogo e sete capítulos, em oito rotas independentes. A organização em capítulos não elimina os 12 blocos do documento de conteúdo. As descrições inglesas abaixo são propostas de microcopy de navegação para revisão.

| Destino estável | Título PT-BR | Título EN | Blocos do Documento de Conteúdo |
|---|---|---|---|
| #inicio | Prólogo | Prologue | 1 Hero; 2 Conheça sua jornada |
| #capitulo-1 | Uma nova forma de enxergar o dinheiro | A new way to look at money | 3 Conheça o Bitcoin; parte de 4 sobre Bitcoin vs. outros criptoativos |
| #capitulo-2 | O segredo dos 21 milhões | The secret of 21 million | 4 Valor do Bitcoin: escassez, halving, satoshis, volatilidade e histórico; preservar conteúdo relacionado do bloco 3 |
| #capitulo-3 | O poder das suas próprias chaves | The power of your own keys | 5 Como funciona; 6 Suas chaves, seus bitcoins |
| #capitulo-4 | As 12 palavras secretas | The 12 secret words | 7 Suas palavras secretas |
| #capitulo-5 | Sua primeira carteira | Your first wallet | 8 Sua primeira carteira; 9 Suas primeiras transações |
| #capitulo-6 | Protegendo seu Bitcoin | Protecting your bitcoin | 10 Proteja seu Bitcoin |
| #capitulo-7 | O próximo capítulo é seu | The next chapter is yours | 11 Revise o aprendizado; 12 Continue aprendendo |
| #faq | Perguntas frequentes | Frequently asked questions | FAQ do bloco 12 |

Preservar também os destinos semânticos do conteúdo (`#entender`, `#enxergar`, `#autocustodia`, `#praticar`) como âncoras compatíveis, sem IDs duplicados. `#autocustodia` aponta para a comparação de custódia no capítulo III. O mapa de conteúdo é uma decisão de organização visual: verificar cada tópico original e não duplicar nem perder texto na redistribuição.

### 5.1 Resumos de navegação

| Capítulo | PT-BR | EN |
|---|---|---|
| I | Descubra o que é Bitcoin, sua história e suas diferenças em relação ao dinheiro tradicional. | Discover what Bitcoin is, its history, and how it differs from traditional money. |
| II | Descubra por que o Bitcoin é limitado, conheça os satoshis e entenda por que seu preço muda. | Discover Bitcoin's limited supply, meet satoshis, and understand why its price changes. |
| III | Aprenda quem controla seus bitcoins e descubra a importância da autocustódia. | Learn who controls your bitcoin and why self-custody matters. |
| IV | Entenda as palavras de recuperação e aprenda a proteger seu backup. | Understand recovery words and learn how to protect your backup. |
| V | Conheça a Bitkit e aprenda sobre recebimento, envio e taxas. | Meet Bitkit and learn about receiving, sending, and fees. |
| VI | Aprenda a reconhecer golpes e adotar hábitos de segurança. | Learn to spot scams and build safer habits. |
| VII | Revise seu aprendizado, esclareça dúvidas e continue explorando. | Review what you've learned, find answers, and keep exploring. |

## 6. Navegação e descoberta de conteúdo — requisito obrigatório

- CTA principal `Começar a aprender` / `Start learning` leva diretamente a `/chapter/1`.
- CTA secundário `Já tenho Bitcoin` / `I already own bitcoin` leva à autocustódia no capítulo III.
- Cabeçalho fixo ou sticky, compacto: logo, índice `Capítulos / Chapters`, acesso direto `Autocustódia / Self-custody`, idioma `PT / EN`. No mobile, menu acessível com os sete capítulos e seus resumos. Não ocultar navegação essencial sob gestos ou hover.
- Índice disponível durante toda a leitura: cada item mostra numeral romano, título e resumo. Capítulo ativo destacado com texto/estado semântico (`aria-current`), não apenas cor. Permitir abrir qualquer capítulo a qualquer momento, sem bloqueios.
- Ao final do I: apenas próximo capítulo II, com seta à direita, número, título e resumo. Ao final de II a VI: capítulo anterior à esquerda e próximo à direita, cada qual com seta, número, título e breve descrição. No VII: capítulo anterior VI e ação explícita de voltar ao início ou acessar FAQ; não inventar capítulo VIII.
- Área inteira de cada link de capítulo clicável, com foco visível, nomes acessíveis e destino real. Em mobile empilhar sem perda de conteúdo; anterior e próximo identificados por texto. Não depender exclusivamente de setas.
- Âncoras nativas, URLs com hash compartilháveis, histórico de navegação funcional, recuo correto para o cabeçalho fixo (`scroll-margin-top`). Após navegação, orientar o foco para o título do capítulo quando adequado; não roubar foco durante rolagem natural.
- Alternar PT/EN sem perder capítulo atual, posição lógica, respostas das interações e progresso. Atualizar atributo `lang` do documento e metadados correspondentes. Persistência local de preferência de idioma é opcional; nenhum cadastro.
- Indicador de capítulo e barra de progresso de leitura: distinguir posição/rolagem de aprendizagem. Não marcar um capítulo como compreendido apenas porque foi visto. Checklist é autoavaliação independente. Mostrar retorno ao topo e link direto ao FAQ.
- Menu mobile deve fechar após escolha, permitir Escape e retorno de foco; não aprisionar teclado nem bloquear rolagem do conteúdo por efeito visual.

## 7. Especificação visual por capítulo

### Prólogo — Hero

Composição centralizada e mobile-first. Título em três linhas de Manrope, cena do livro e da moeda, dois parágrafos em Inter, CTAs e indicação de gratuito, iniciante e no seu ritmo. O título permanece `Seu Bitcoin. Suas chaves. Sua liberdade!` / `Your bitcoin. Your keys. Your freedom!`, com a terceira linha em laranja Bitcoin.

- PT: “Aprenda o que é Bitcoin, como guardar e proteger sem depender de uma corretora.” Depois, “Você não precisa entender de tecnologia ou investimentos. Só precisa dar o primeiro passo.”
- EN: “Learn what Bitcoin is and how to store and protect it without relying on an exchange.” Depois, “You don't need a background in technology or investing. Just take the first step.”

CTA principal Concept 03 — Signature em formato de cápsula, com laranja Bitcoin, texto grafite e contorno interno sutil. O secundário permanece grafite e sublinhado. Ambos estão disponíveis desde o início. Depois do hero, apresentar três pilares e índice da jornada.

### Jornada e colofão

- A jornada mantém o título e as descrições dos pilares. Apenas “Bitcoin” no título usa `#F7931A`. Os pilares ficam em sequência vertical no mobile e lado a lado em telas largas, com renderizações transparentes de livro e moeda, lupa e rede, carteira e chave.
- “Explore os capítulos” abre um índice editorial. Menu e índice compartilham uma coluna de numerais romanos em Manrope 500, de 28 a 32 px, no laranja de ação. Título, resumo e seta ficam alinhados ao numeral. O capítulo atual tem fundo quente e marca lateral. No menu, o botão Fechar permanece acessível ao rolar. Escape devolve o foco ao botão Capítulos.
- O colofão usa fundo grafite, marca central, autoria, descrição do projeto e aviso educacional com escudo. Separar links de projeto e informação. Manter idioma, fontes expansíveis e retorno ao topo.
- O progresso do checklist é armazenado em `sessionStorage` na aba atual, inclusive após recarregar a página. A explicação aparece junto ao checklist no Capítulo VII.

### I — Uma nova forma de enxergar o dinheiro

A abertura usa título centralizado em Manrope e destaque pontual em laranja Bitcoin. O texto corrido permanece em Inter. A largura de leitura é limitada por coluna, enquanto comparação, navegação e visuais usam a largura editorial disponível.

O Capítulo I apresenta a introdução ao lado de uma rede de pares 3D, com início em viewport, propagação finita, repetição discreta, parada fora de tela e imagem do próprio modelo quando o movimento reduzido estiver ativo ou o WebGL falhar. A tabela semântica Bitcoin/Pix mantém as comparações em pares, inclusive no mobile. A primeira coluna usa cabeçalho neutro, a segunda usa #F7931A com texto grafite e conteúdo em laranja escuro acessível. O explorador de benefícios usa expansões em mobile e seleção com visual dedicado em telas largas. A ressalva de privacidade pertence ao benefício de autonomia.

A linha do tempo ocupa uma faixa carvão com navegação explícita por nove anos (2008 a 2024), seleção direta por ano e leitura completa em uma expansão. Símbolos de tendência são abstratos e não exibem escalas, valores ou datas. Gráficos educativos indicam explicitamente quando não usam dados históricos. A seleção não avança automaticamente e os painéis compartilham espaço para evitar saltos de layout. Os quatro princípios usam uma composição 2 × 2 no mobile e quatro colunas amplas. Destaques em texto pequeno usam o laranja de ação.

Nas sete páginas, as aberturas destacam nova forma, 21 milhões, chaves, 12 palavras secretas, carteira, Bitcoin e seu e seus equivalentes em inglês. Links entre capítulos têm numeral, rótulo, título, descrição e seta. A área inteira responde a toque, foco e hover compatível. Transições de navegação partem de um deslocamento horizontal de 13px e duram 280ms, com direção conforme a ordem dos capítulos. O cabeçalho não participa da transição. Foco, histórico e movimento reduzido são preservados.

### II — O segredo dos 21 milhões

Momento de contraste gráfico: número 21.000.000 em grande escala, grafite e laranja; adaptar separadores por idioma. Explicar limite de emissão, halving, unidades menores e volatilidade. Usar conversor de satoshis, moeda 3D manipulável e gráfico histórico real, incluindo quedas. Evitar gráfico conceitual apresentado como histórico. Navegação I / III.

### III — O poder das suas próprias chaves

Rede Bitcoin, blockchain, onde os bitcoins são registrados, custódia versus autocustódia, endereço público, chave privada e palavras de recuperação. Usar `blockchain.png`, `safe.png`, `wallet.png`, `key.png`. Composição comparativa e chave que muda de posição ao alternar entre corretora e autocustódia. Explicar responsabilidades de ambos os modelos, sem prometer ausência de riscos. Navegação II / IV.

### IV — As 12 palavras secretas

Seção em creme/laranja suave, cartão de backup em destaque, 12 espaços numerados e mascarados; explicar que algumas carteiras usam 24 palavras e outros mecanismos. Informações sobre backup físico, perda, comprometimento e recuperação. Quiz de escolha do local de armazenamento e cenário de perda de dispositivo. Avisos de segurança no momento certo. Não pedir palavras ou chaves reais. Navegação III / V.

### V — Sua primeira carteira

Comparar hot wallet e hardware wallet, apresentar a Bitkit com imagem oficial quando permitida, link oficial e passos de configuração verificados. Ensinar receber, enviar e taxas usando exemplos fictícios. Distinguir rede principal de Lightning, incluindo limitações de backup específicas da Bitkit; não tratar a seed como garantia de recuperação de todos os saldos. Não criar CTA de vídeo até existir vídeo validado. Navegação IV / VI.

### VI — Protegendo seu Bitcoin

Usar escudo/cofre como apoio visual. Sinais de golpes, exemplos de conversa, aplicativos falsos, pressão, promessas de lucro, privacidade e hábitos de segurança. Feedback explica o motivo e orienta comportamento seguro. Evitar tom culpabilizador. Navegação V / VII.

### VII — O próximo capítulo é seu

Checklist completo dos dez conceitos do Documento Mestre de Conteúdo, FAQ completo, encerramento e rodapé com fontes e autoria. Não declarar certificação ou que a pessoa está livre de riscos. Links reais para portfólio, GitHub quando criado, LinkedIn e fontes. Sem botão vazio. Aviso educacional e de privacidade. Navegação anterior VI / voltar ao início.

## 8. Interações educativas — especificações funcionais

| Componente | Entrada e comportamento | Resultado / limites |
|---|---|---|
| Timeline | Selecionar evento por botão ou teclado; sem carrossel obrigatório | Exibir data e explicação; todos os eventos acessíveis |
| Conversor BTC/sats | Entrada numérica de sats inteiros e não negativos; presets 1.000, 10.000, 100.000 e 1.000.000 | BTC = sats / 100.000.000, oito casas decimais; sem cotação; validar entrada |
| Gráfico histórico | Seleção de período quando houver dados, rótulos e tooltip acessível | Série verificável BTC/USD, fonte e data de corte, altas e quedas; tabela/descrição alternativa |
| Custódia | Alternar corretora / carteira própria | Mover chave visualmente e atualizar explicação de controle e responsabilidade |
| Rede | Acionar demonstração de propagação/verificação | Nós verificam regras, mineradores propõem blocos; não representar um servidor central como dono da rede |
| Backup | Selecionar local de armazenamento fictício | Feedback textual específico; backup físico protegido como orientação inicial |
| Perda do celular | Selecionar com/sem backup | Explicar recuperação com backup adequado e carteira compatível, sem garantir recuperação universal |
| Enviar/receber | Passos demonstrativos, endereços fictícios, QR não escaneável | Orientar conferência de rede, endereço, valor, taxa; nunca gerar transação |
| Taxas | Valor fictício inteiro em sats e taxa de 1–50 sat/vB | Exemplo de 140 vB: taxa = 140 × taxa unitária; total = valor + taxa; não usar como recomendação atual |
| Golpes | Escolher ação em conversa simulada | Feedback e explicação; opção de tentar novamente; nunca solicitar segredos |
| Checklist | Dez itens da referência de conteúdo | Progresso = itens marcados / 10; autoavaliação, não certificação |
| FAQ | Botões com expansão/recolhimento | `aria-expanded`, `aria-controls`, navegação por teclado e respostas completas |

Toda interação deverá funcionar de verdade, ter estado inicial claro, feedback imediato, possibilidade de revisão e rótulos nos dois idiomas. Formatação de números por locale; não converter sats usando cotação fictícia. Nenhum dado pessoal ou segredo será coletado. Estado pode permanecer no dispositivo; se houver armazenamento local, restringir a idioma, checklist e preferências não sensíveis.

## 9. Movimento e 3D — diferencial do projeto

**Requisito:** implementar experiências tridimensionais reais, com propósito didático e acabamento compatível com os assets aprovados. Imagens renderizadas e parallax não equivalem a 3D interativo. O 3D não pode prejudicar leitura, acessibilidade ou performance.

### 9.1 Cenas propostas

| Cena | Implementação desejada | Comportamento e aceitação |
|---|---|---|
| A abertura da história (hero) | Three.js, livro modelado e moeda; materiais e luz semelhantes ao asset | Livro abre e Bitcoin se eleva; sequência de 2–3s, uma vez, sem bloquear CTAs. Não deformar o PNG para simular abertura. |
| Bitcoin em suas mãos (II) | Modelo 3D de moeda com relevo, metal acetinado | Rotação por arraste mouse/toque e controles acessíveis de rotação/reset; sem giro infinito obrigatório. |
| Quem possui a chave? (III) | Objeto 3D ou animação de posição com asset | Ao alternar estado, chave se desloca entre cofre/instituição e carteira pessoal; rótulos e texto atualizados. |
| Rede em funcionamento (III) | Three.js, blocos/nós e conexões | Ativação gradual das conexões em demonstração acionável; alternativa textual; sem sugerir centralização. |
| Protegendo suas palavras (IV) | Asset de cartão e transição de estados | Visualizar proteção do backup com movimento discreto; sem revelar palavras reais. |

Para otimizar o prazo, priorizar hero e moeda manipulável; construir cenas restantes com estratégia leve e reaproveitamento de materiais/geometria. Esta é uma proposta de ordem técnica, não autorização para eliminar o requisito 3D. Caso o hero 3D não atinja qualidade suficiente, usar o hero PNG aprovado e manter 3D real em outra seção; relatar a limitação e solicitar validação, não substituir silenciosamente por modelo feio ou anunciar 3D que não existe. Não baixar modelos ou texturas de licença incerta.

### 9.2 Motion tokens

| Token CSS | Valor |
|---|---|
| `--motion-instant` | 100ms |
| `--motion-fast` | 150ms |
| `--motion-normal` | 200ms |
| `--motion-transition` | 280ms |
| `--motion-reveal` | 400ms |
| `--motion-easing` | `cubic-bezier(0.22, 1, 0.36, 1)` |

#### Hero e cabeçalho

- O título entra uma vez por visita à homepage. Cada linha completa vai de 0 a 1 em opacidade e sobe 9px em 400ms, com 60ms de intervalo entre as linhas. Rolagem e troca de idioma preservam a instância do título e da cena. O livro e a moeda continuam sendo o movimento principal e iniciam de forma independente.
- Concept 03 — Signature sobe 2px no hover de ponteiro preciso, clareia levemente e recebe sombra discreta. O contorno interno passa de 4px para 6px. Ao pressionar, a escala chega a 0,98. As transições duram 200ms e o toque recebe feedback imediato. Manter foco visível.
- O sublinhado do CTA secundário muda para laranja quente e passa de 1px para 2px em 150ms, sem alteração da cor do texto ou da posição do link. Oferecer feedback ao tocar.
- O menu de capítulos abre e fecha em 220ms com opacidade, deslocamento de 6px e escala entre 0,985 e 1, com origem no acionador. A seta gira 180 graus em 200ms. O indicador PT/EN se desloca em 220ms. A abertura e o fechamento continuam acessíveis pelo teclado.
- As etapas entram em 400ms com intervalo de 80ms e respondem ao hover em dispositivos compatíveis. O colofão aplica a mesma entrada ao logo e à autoria. Índice e fontes expandem em 280ms em navegadores com suporte à transição do conteúdo de `details`. Com movimento reduzido, todos os estados ficam disponíveis sem a transição.
- Com movimento reduzido, mostrar o título completo, o estado final do indicador e o quadro estático do livro. As mudanças visuais de interação permanecem disponíveis sem deslocamentos animados.
- Requisito futuro aprovado em conceito — transição narrativa de capítulos inspirada em virar as páginas de um livro. Projetar e validar separadamente na revisão dos capítulos.

#### Referências para as interações dos capítulos

| Ação | Tempo indicativo |
|---|---|
| Hover, foco e feedback | 150ms |
| FAQ e atualização numérica | 200ms |
| Transição de estados de simuladores | 250ms |
| Progresso | 300ms |
| Entrada de títulos | 400ms |
| Deslocamento de chave | 600ms |
| Entrada inicial | 600–900ms |
| Ativação da rede | 800ms |
| Abertura do livro | 2–3s |

Usar easing suave; animar preferencialmente transform/opacity, sem deslocar layout. Nada de scroll hijacking, autoplay com áudio, flashes, partículas excessivas ou movimento contínuo distrativo. Respeitar `prefers-reduced-motion`: apresentar estado final estático e permitir uso completo das interações. Oferecer pausa/desativação quando necessário. Canvas deve ser decorativo ou ter controles HTML e equivalente textual, nunca único acesso ao conteúdo.

### 9.3 Performance e fallback

Na entrada do hero, o título começa na montagem da página. A abertura do livro tem como referência 150ms após a montagem, respeitando a prontidão do WebGL. O quadro inicial permanece no lugar até o primeiro quadro renderizado da abertura. A duração e as curvas da sequência do livro e da revelação da moeda são preservadas.

Carregar módulos 3D sob demanda, limitar pixel ratio e complexidade, pausar renderização fora da viewport e ao ocultar aba, liberar recursos GPU, evitar múltiplos canvases ativos. Detectar indisponibilidade de WebGL e perda de contexto; renderizar imediatamente fallback estático sem impedir leitura. Nenhuma espera por 3D antes de mostrar texto, navegação ou CTA. Verificar em mobile real ou emulação e registrar limitações. Medir desempenho; não declarar métricas sem execução.

## 10. Implementação local

Stack proposta: React + TypeScript + Vite + CSS, Three.js para cenas 3D. Sem Figma ou Stitch; direção de arte e conteúdo vêm deste documento e dos assets. Codex trabalha inicialmente em uma pasta local dedicada no Windows, escolhida pelo usuário; não presumir caminho nem criar repositório remoto antes de autorização.

Estrutura sugerida (ajustável, sem arquitetura desnecessária):

```text
once-upon-a-bitcoin/
  docs/
    Documento-Mestre-Bitcoin-Autocustodia-PT-EN.md
    ONCE-UPON-A-BITCOIN-DESIGN-SYSTEM.md
  public/assets/              # extrair PNGs aprovados do ZIP
  src/
    components/               # Header, ChapterNav, FAQ, controles comuns
    chapters/                 # Prologue, Chapter01 ... Chapter07
    interactions/             # conversor, custódia, backup, taxas, quiz
    scenes/                   # módulos 3D carregados sob demanda
    locales/                  # pt-BR, en, chaves correspondentes
    data/                     # histórico verificado e metadados de fonte
    styles/                   # tokens, base, layout e responsividade
    App.tsx
  README.md
```

- Usar IDs estáveis independentes do idioma e dados de capítulos centralizados para índice e links anterior/próximo.
- Preservar todos os textos do documento oficial, inclusive avisos, FAQ e fontes. Microcopy adicional de interface em ambos os idiomas, sem misturar línguas. Revisar inglês antes de publicar.
- Usar fontes e dados históricos verificados, sem dependência de API com chave secreta no cliente. FRED/Coinbase é a fonte proposta no documento de conteúdo; verificar disponibilidade, período, unidade e data de atualização. Sem dados validados, não fabricar números: mostrar explicação textual de volatilidade e relatar a pendência.
- Implementar SEO básico, título/descrição por idioma, favicon, metadados de compartilhamento, HTML semântico, `lang`, landmarks, skip link, foco visível e alt text pertinente. Sem inventar domínio definitivo ou perfil social.
- Nenhum serviço de analytics ou coleta de informações sem escopo e aprovação. Links externos seguros e funcionais. Não embutir segredos no código.
- Fazer a primeira versão local completa de forma eficiente, com `npm run dev` e URL localhost para revisão. Evitar ciclos de alterações pequenas sem necessidade, refatoração fora de escopo ou nova geração de assets aprovados.

## 11. QA — critérios de aceitação antes da publicação

### UX e UI

- [ ] Hero fiel à imagem, marca e conceito aprovados, com acabamento adulto e editorial.
- [ ] Manrope nos títulos e Inter no corpo e na interface.
- [ ] Hierarquia clara, consistência, alinhamento, proximidade, contraste, respiro e leitura confortável.
- [ ] Sete capítulos completos; nenhum tópico do conteúdo oficial desapareceu.
- [ ] CTA principal leva ao I; secundário leva à autocustódia.
- [ ] Anterior/próximo com setas, títulos e resumos corretos em todos os capítulos.
- [ ] Índice facilmente encontrável durante leitura; qualquer capítulo acessível sem bloqueios.
- [ ] Troca PT/EN mantém capítulo e estado de aprendizagem; sem textos incompletos ou misturados.
- [ ] Progresso de leitura distinto de autoavaliação; FAQ, links e voltar ao topo funcionais.
- [ ] Mobile, tablet e desktop sem cortes, sobreposições ou overflow; testar pelo menos 360, 390, 768, 1024 e 1440px como larguras iniciais.
- [ ] Imagens com proporção correta, sem distorção ou troca indevida.
- [ ] Nenhum botão vazio, placeholder público, dado falso ou interface inventada da Bitkit.

### Interação, 3D e acessibilidade

- [ ] Simuladores, quiz, checklist, FAQ e navegação funcionam com teclado, toque e mouse.
- [ ] Experiência 3D real implementada e demonstrável; não confundir render estático com modelo 3D.
- [ ] Qualidade visual das cenas conferida no navegador, não apenas por build.
- [ ] Reduced motion e fallback sem WebGL preservam conteúdo e ações.
- [ ] Foco, contraste, alt text, landmarks, headings, estados ARIA e feedback validados; objetivos WCAG 2.2 AA, sem alegar conformidade integral sem auditoria.
- [ ] Performance adequada em mobile, sem animações que bloqueiam interação ou provocam layout shift significativo.

### Conteúdo e segurança

- [ ] Português aprovado preservado; inglês revisado.
- [ ] Limite de 21 milhões, satoshis, custódia, taxas, volatilidade, privacidade e riscos tecnicamente corretos.
- [ ] Tutorial Bitkit conferido na versão atual; orientações específicas de backup Lightning verificadas.
- [ ] Imagem oficial da Bitkit com uso permitido e crédito, ou alternativa textual honesta.
- [ ] Série histórica real, com fonte e data de corte, ou ausência justificada sem gráfico fictício.
- [ ] Nenhuma seed real, chave privada, QR pagável, conexão de carteira ou promessa de valorização.
- [ ] Referências e links externos verificados; aviso educacional e autoria visíveis.

### Entrega técnica e aprovação

- [ ] `npm run build` executado com sucesso; testes relevantes executados; erros de console corrigidos.
- [ ] Revisão visual real via localhost, incluindo telas mobile e desktop; fornecer capturas quando possível.
- [ ] Avaliação heurística registrada; não afirmar que houve teste com usuárias reais se não houve.
- [ ] Relatório conciso: arquivos criados/modificados, build, testes, 3D implementado, limitações e URL local.
- [ ] Usuária aprovou resultado visual e funcional localmente antes de qualquer push/deploy.
- [ ] Após autorização: criar/usar repositório GitHub correto, commit/push, configurar Vercel, verificar produção em ambos os idiomas e testar links e assets.

**Build aprovado não equivale a aprovação visual.** Não repetir o processo de publicar correções visualmente mal resolvidas e depois remendá-las. Se houver limitação de navegador, modelo 3D, fonte, dados ou asset, informar imediatamente e manter fallback seguro.

## 12. Pendências e governança

- Disponibilidade do nome/marca Once Upon a Bitcoin ainda não verificada; manter configuração centralizada para eventual alteração autorizada.
- A composição final em alta fidelidade e a qualidade das cenas Three.js ainda não foram avaliadas; wireframes anteriores eram esquemáticos.
- A imagem Bitkit não integra o pacote e requer confirmação de uso. Tutorial atual e recuperação Lightning precisam de validação técnica.
- Dados históricos, links e fontes devem ser revisados antes de publicação; a versão EN ainda requer revisão.
- Discovery inicial é hipótese/pesquisa secundária, não validação com participantes. Testes de usabilidade com usuárias reais ficam para etapa posterior.
- Prazo desejado de três horas para o MVP é uma meta, não garantia. Priorizar experiência completa, segura e bem acabada; não sacrificar qualidade nem declarar tarefas não feitas como concluídas.
- Este documento não autoriza execução automática de etapas posteriores. Próximo passo: preparar pasta local e entregar os dois documentos e os assets ao Codex para implementação, mediante autorização.

**Fim do Documento Mestre de Design.**

### Refinamento 05 · Sistema compartilhado dos capítulos

As aberturas não usam numerais decorativos nem filetes. Os numerais permanecem nos índices e nos links entre capítulos. O sistema usa raios de 8px para elementos pequenos, 12px para seletores e 16px para painéis e tabelas. A CTA Signature mantém seu formato de cápsula.

As ilustrações de capítulos derivam de modelos Three.js compartilhados em ouro acetinado, marfim e cobre. A moeda reutiliza a geometria do hero. As imagens transparentes permitem apresentar o objeto enquanto a cena WebGL inicializa e em navegadores sem WebGL. A rede de pares usa propagação finita e repetição discreta. A rotação inicial da moeda é finita e os controles são de manipulação, com alternativas por botão. Reduzir movimento preserva a leitura e os estados estáticos.

O Capítulo I usa tabela arredondada, seletores laranja sem setas, navegação por anos e os valores corretos dos halvings. O Capítulo II mantém a abertura escura, usa o conversor laranja e apresenta volatilidade conceitual e aprendizado responsável em áreas distintas.

### Recuperação visual 06

Os capítulos usam três composições. Seções editoriais curtas ocupam a largura do capítulo. Divisões em duas colunas exigem conteúdo significativo em ambas. Leitura longa isolada usa uma medida centralizada de até 76ch. Tabelas, seletores, navegação e anos mantêm os separadores funcionais.

A entrada dos títulos aplica 9px de deslocamento vertical e opacidade ao longo de 450ms. A descrição começa 65ms depois. A entrada ocorre em paralelo à transição de rota existente e é desativada com movimento reduzido.

A rede do Capítulo I propaga dados continuamente em viewport. O controle discreto ao lado da legenda permite pausar e retomar. O navegador substitui a cena pela imagem de repouso quando o movimento reduzido é solicitado.

A linha do tempo preserva a transição entre anos e a dimensão do painel. Os objetos históricos permanecem estáticos. Recuperamos da versão anterior o documento, as pizzas, a moeda dos halvings, os dois símbolos de tendência e o globo. A arte aprovada da jornada representa a rede de 2009 e a custódia de 2022 no lugar dos recortes fotográficos. Os valores e o conteúdo do quarto halving em 2024 são preservados.

### Refinamento 07

A rede e a moeda iniciam automaticamente em viewport, com movimento contínuo, sem controles dentro das cenas. A preferência de movimento reduzido mantém as imagens estáticas. A legenda da rede permanece junto à figura. A seção de volatilidade distingue o preço de mercado da operação da rede em um cenário ilustrativo. O texto apresenta o alerta, a afirmação principal, a explicação e o termo HODL. As setas de navegação ficam no lado correspondente à direção.

### Refinamento 08

O título da seção final usa a largura editorial e quebra apenas quando necessário. “Não!” mantém ênfase editorial subordinada ao título. Os títulos de prosa independente usam a largura do capítulo, enquanto os parágrafos preservam sua medida de leitura.

A moeda do Capítulo II mantém uma largura estável na coluna e a imagem aprovada durante a preparação da cena. O modelo Three.js executa uma elevação única de cerca de 8px em 2,8s e retorna ao repouso. A preferência de movimento reduzido mantém uma imagem estática. A cena ignora quadros fora da área visível.

O aviso de volatilidade acompanha a explicação dos satoshis. No desktop, fica ao lado do conversor. No mobile, o aviso antecede o conversor. O texto sobre funcionamento da rede, riscos, HODL e aprendizado responsável permanece na sequência editorial após a remoção do gráfico ilustrativo.


## Refinamento 09 — Rede, custódia e recuperação

- O documento é a área de rolagem da página. O cabeçalho permanece sticky e o índice expandido conserva sua rolagem interna. Progresso, posição de leitura e histórico usam a rolagem do documento.
- Capítulos III e IV usam a largura editorial para títulos e tabelas. Texto corrido mantém medida de leitura. Composições divididas são reservadas a conteúdo com uma visualização ou explicação associada e empilham em telas estreitas.
- O Capítulo III reutiliza a rede Three.js do Capítulo I, com propagação automática quando visível e pôster com movimento reduzido. A comparação usa a tabela Bitcoin/Pix, com a segunda coluna em laranja. Os grupos de compartilhamento têm texto, ícones e contraste semântico.
- No seletor de custódia, uma chave ilustrada muda de posição em 600 ms com a curva existente. A explicação permanece acessível e muda junto com a seleção. A preferência de movimento reduzido remove o deslocamento animado.
- O Capítulo IV reutiliza o cartão de backup ilustrado, com doze posições mascaradas visíveis e um breve movimento de assentamento. A demonstração conceitual de criação também é finita. Ambos são estáticos com movimento reduzido. Papel e metal usam amostras editoriais de materiais. Recomendações e resposta a comprometimento ficam abertas a todo momento.


## Refinamento 10 — Largura editorial, feedback e navegação

- Parágrafos independentes e declarações de capítulo usam a largura editorial disponível e quebram naturalmente. Listas longas, interfaces de atividades e textos em colunas mantêm as medidas que seu conteúdo exige.
- Sucesso: `--success` #237A45, `--success-surface` #F0F5EE, `--success-border` #8FB69A. Erro: `--error` #B42318, `--error-surface` #FFF0ED, `--error-border` #D99B94. Os tons de borda são decorativos. Ícones e texto explícito identificam cada estado, com explicação em carvão.
- Atividades apresentam opções neutras antes da resposta, região de status atômica, feedback visual de 150 ms e retorno ao estado neutro ao tentar novamente. Movimento reduzido elimina a transição. Usar superfícies claras com os respectivos textos semânticos em áreas escuras.
- Navegação anterior: seta, numeral, texto. Navegação seguinte: texto, numeral, seta. Seta e numeral compartilham um grupo centralizado verticalmente. Os grupos de texto começam na mesma altura, e a grade mantém cartões de mesma altura na mesma linha. Em telas estreitas, os cartões empilham com a mesma ordem.
