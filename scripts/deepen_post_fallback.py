from pathlib import Path

path = Path('/home/ubuntu/marketing-agent-dashboard/frontend/index.html')
h = path.read_text()

anchor = "const base=`Post criado para ${persona}, com linguagem ${voice}, sobre ${theme}. ${wish||'A proposta é transformar o tema em uma conversa útil e humana.'}`;"
replacement = "const base=`Post criado para ${persona}, com linguagem ${voice}, sobre ${theme}. ${wish||'A proposta é transformar o tema em uma conversa útil e humana.'}`;const reflection=`${theme} costuma ser tratado como uma resposta pronta, mas para ${persona} ele aparece em escolhas, dúvidas e pequenos conflitos do cotidiano. A reflexão central é esta: quando entendemos o que está por trás desse comportamento, conseguimos agir com mais intenção — e não apenas repetir uma tendência.`;const structure=format==='Stories'?'Use uma sequência de 4 telas: tensão inicial, pergunta de identificação, insight prático e convite para responder.':format==='Reels'?'Construa 4 momentos: gancho com uma pergunta incômoda, exemplo cotidiano, virada de perspectiva e fechamento com uma ação possível.':format==='Carrossel'?'Distribua em 6 slides: capa com tensão, contexto, exemplo, reflexão central, aplicação prática e CTA de conversa.':'Conduza em três movimentos: nomeie a tensão, desenvolva uma reflexão com exemplo concreto e feche com uma ação possível para o público.';"
if anchor not in h:
    raise SystemExit('fallback base anchor not found')
h = h.replace(anchor, replacement, 1)
old = "Legenda completa:\\nVocê já percebeu como ${theme.toLowerCase()} pode mudar a forma como enxergamos nossas escolhas?\\n\\nA questão não é apenas ${theme.toLowerCase()}; é o modo como esse tema atravessa as escolhas de ${persona}. Quando nomeamos essa tensão com honestidade, deixamos de produzir conteúdo que apenas informa e passamos a criar uma conversa capaz de reorganizar perspectivas e abrir uma próxima ação possível.\\n\\nSe este tema faz sentido para você, salve para consultar depois e conte nos comentários qual parte mais representa o seu momento."
new = "Legenda completa:\\n${reflection}\\n\\n${structure}\\n\\nSe este tema faz sentido para você, salve para consultar depois e conte nos comentários qual parte mais representa o seu momento."
if old not in h:
    raise SystemExit('fallback reflection anchor not found')
h = h.replace(old, new, 1)
path.write_text(h)
print('fallback-deepened')
