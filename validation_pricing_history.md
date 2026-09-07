# Validação do histórico automático de orçamentos

- O cálculo de `Vaso artesanal` foi concluído no preview com horas, valor/hora, materiais, embalagem, custos indiretos, taxa e margem.
- O cartão `Precificação · Foto + cálculo` apareceu automaticamente em `Histórico de Gerações` com valores mínimo, recomendado e premium.
- O histórico permaneceu disponível após nova navegação para `#history`, confirmando persistência no armazenamento do navegador.
- `Reabrir orçamento` restaurou os campos, a memória de cálculo, os cenários e habilitou novamente as exportações.
- A exclusão individual foi validada com confirmação positiva simulada: 1 registro antes e 0 depois, sem limpar registros de outros tipos.
- A viewport móvel de 390x844 exibiu corretamente o cabeçalho, a navegação colapsada, o painel de histórico e o estado vazio após a exclusão do registro de teste.
- A regra de aprovação humana permaneceu explícita; nenhuma publicação ou ação externa é executada.

- O cartão preenchido foi renderizado com `Reabrir orçamento` e `Excluir`, incluindo os três cenários e o aviso de estimativa revisável.
- Um registro sintético foi usado somente para checar o layout; após a captura, foi removido do `localStorage`, deixando o histórico sem dados de teste.
