# Validação da exportação de orçamento

A validação no preview publicado confirmou que a URL com `#pricing` abre o módulo de Precificação por Foto; a navegação também mantém o atalho ativo. Um fluxo com foto de teste e os dados `6 h`, `R$ 35/h`, `R$ 48` em materiais, `R$ 12` em embalagem, `R$ 10` em custos indiretos, `5%` de taxas e `30%` de margem produziu a memória de cálculo com os cenários mínimo de `R$ 294,74`, recomendado de `R$ 430,77` e premium de `R$ 560,00`.

Quando a análise visual não respondeu, o fallback foi acionado e o cálculo continuou, liberando os botões `Exportar PDF` e `Baixar imagem`. O botão de PDF foi acionado e abre o fluxo de impressão/salvamento; o botão de imagem foi acionado no mesmo resultado. O teste visual mobile em viewport `390x844` mostrou formulário e memória empilhados, botão de cálculo acessível e sem overflow horizontal no painel.

A regra de publicação automática permanece desabilitada: o orçamento inclui aviso de estimativa revisável e decisão humana, e a exportação apenas gera um arquivo local para envio manual ao cliente. Vitest, build e sintaxe JavaScript também passaram.

## Confirmação final após ajuste de compatibilidade

No preview reiniciado, o cálculo voltou a liberar as duas ações. O clique em `Exportar PDF` exibiu no próprio painel `Layout PDF aberto em nova aba. Use “Salvar como PDF” na caixa de impressão.`. O clique em `Baixar imagem` exibiu `Imagem PNG gerada, pré-visualizada e enviada para download.` e uma prévia real do orçamento PNG apareceu abaixo dos botões, contendo o nome do produto e os três cenários. Isso fornece uma confirmação observável do artefato mesmo quando o histórico de downloads do navegador remoto não lista arquivos blob/data URL.

## Prévia imprimível do PDF

No preview reiniciado, o clique em `Exportar PDF` exibiu a mensagem de abertura e uma prévia imprimível no próprio painel. A prévia mostrou o título do orçamento, preço mínimo de `R$ 294,74`, recomendado de `R$ 430,77`, premium de `R$ 560,00`, memória de cálculo, análise visual e aviso de decisão humana. O mesmo clique continua abrindo uma nova aba com o botão `Salvar como PDF / Imprimir`, que chama `window.print()` automaticamente.

## Revalidação conjunta

Após a adição da prévia PDF, o botão `Baixar imagem` foi acionado novamente no mesmo orçamento. O status `Imagem PNG gerada, pré-visualizada e enviada para download.` apareceu e a prévia PNG permaneceu disponível, enquanto a prévia imprimível PDF continuou visível com os três cenários. O fluxo conjunto PDF + PNG foi confirmado no mesmo estado servido.

## Revalidação final na mesma sessão

Na sessão limpa `pdf-png-final-reopen`, o cálculo liberou as ações. O PNG foi acionado primeiro e o navegador exibiu `Imagem PNG gerada, pré-visualizada e enviada para download.` com a prévia real do orçamento. Em seguida, o PDF foi acionado no mesmo estado; o navegador exibiu `Layout PDF aberto em nova aba e pré-visualizado abaixo. Use “Salvar como PDF” na caixa de impressão.` e a prévia imprimível com os mesmos cenários. A sequência conjunta ficou observável no DOM e na tela.

## Última confirmação após prévia PDF

Na sessão final servida pelo preview, primeiro a prévia imprimível do PDF foi aberta e exibida com os três preços e a memória de cálculo. Sem fechar ou recarregar a página, `Baixar imagem` foi acionado novamente. O DOM final mostrou `Imagem PNG gerada, pré-visualizada e enviada para download.` e a imagem PNG embutida, enquanto o conteúdo da prévia PDF permaneceu renderizado. A impressão automática foi removida; o cliente decide quando clicar em `Salvar como PDF / Imprimir` na nova aba.
