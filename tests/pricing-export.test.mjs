import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../frontend/index.html', import.meta.url), 'utf8');

describe('exportação do orçamento de precificação', () => {
  it('exibe ações de PDF e imagem somente no resultado da precificação', () => {
    expect(html).toContain('id="price-export-actions"');
    expect(html).toContain('onclick="exportPricingPdf()"');
    expect(html).toContain('onclick="exportPricingImage()"');
    expect(html).toContain('hidden');
  });

  it('mantém no orçamento os três cenários e a memória de cálculo', () => {
    expect(html).toContain('Preço mínimo');
    expect(html).toContain('Preço recomendado');
    expect(html).toContain('Preço premium');
    expect(html).toContain('MEMÓRIA DE CÁLCULO');
    expect(html).toContain('ANÁLISE VISUAL ASSISTIDA');
  });

  it('usa impressão para PDF e canvas para PNG, sem publicar automaticamente', () => {
    expect(html).toContain('function withTimeout(');
    expect(html).toContain('function exportPricingPdf()');
    expect(html).toContain('window.print()');
    expect(html).toContain('function exportPricingImage()');
    expect(html).toContain('canvas.toDataURL(\'image/png\')');
    expect(html).toContain('Imagem PNG gerada, pré-visualizada e enviada para download');
    expect(html).toContain('Layout PDF aberto em nova aba');
    expect(html).toContain('id="price-export-status"');
    expect(html).toContain('decisão humana');
    expect(html).toContain('nunca deve ser publicado automaticamente');
  });
});

describe('histórico automático de orçamentos', () => {
  it('salva o payload completo do orçamento após o cálculo', () => {
    expect(html).toContain("saveHistory('Precificação'");
    expect(html).toContain('pricing:latestPricing');
    expect(html).toContain('photoReference');
    expect(html).toContain('scenarios:{minimum,suggested,premium}');
  });

  it('renderiza, reabre e exclui orçamentos individualmente', () => {
    expect(html).toContain('function renderPricingHistory(');
    expect(html).toContain('function restorePricingHistory(');
    expect(html).toContain('function deleteHistoryItem(');
    expect(html).toContain('Reabrir orçamento');
    expect(html).toContain('Excluir');
    expect(html).toContain('localStorage.setItem(HISTORY_KEY');
  });
});


describe('Sugestão de Posts: legibilidade e profundidade editorial', () => {
  it('usa tipografia e espaçamento ampliados nos campos e resultados', () => {
    expect(html).toContain('font-size:13px;font-weight:600');
    expect(html).toContain('font-size:14px;line-height:1.72');
    expect(html).toContain('post-result-intro');
    expect(html).toContain('post-briefing-card');
  });

  it('orienta reflexão concreta, concisão e adaptação por formato', () => {
    expect(html).toContain('profundidade editorial real');
    expect(html).toContain('Evite frases genéricas');
    expect(html).toContain('para Stories, use sequência de telas');
    expect(html).toContain('para Reels, cenas e falas');
    expect(html).toContain('para Carrossel, texto por slide');
    expect(html).toContain('A reflexão central é esta');
    expect(html).toContain('Nada é publicado automaticamente');
  });
});


describe('Sugestão de Posts: formato editorial de referência', () => {
  it('instrui a resposta a seguir a estrutura narrativa do exemplo', () => {
    expect(html).toContain('### Post 1 — [título]');
    expect(html).toContain('*🎯 Objetivo:*');
    expect(html).toContain('*📅 Melhor dia/horário para postar:*');
    expect(html).toContain('*#️⃣ Hashtags sugeridas (30 hashtags):*');
    expect(html).toContain('*🖼️ Sugestão visual:*');
    expect(html).toContain('*💡 Dica de engajamento:*');
  });

  it('mantém fallback rico, hashtags numeradas e direção visual por etapas', () => {
    expect(html).toContain('function buildPostFallback(');
    expect(html).toContain('0–5s — Gancho');
    expect(html).toContain('5–18s — Contexto');
    expect(html).toContain('18–32s — Virada');
    expect(html).toContain('30 hashtags');
    expect(html).toContain('retomando o detalhe mencionado');
  });

  it('aceita títulos Markdown e marcadores com emoji no parser', () => {
    expect(html).toContain('const cleanHeading=line=>');
    expect(html).toContain('const matchLabel=line=>');
    expect(html).toContain('Material completo para revisão');
    expect(html).toContain('rascunho para revisão humana');
  });
});


describe('Variações multiformato e cópia dos cards', () => {
  it('oferece variações para Stories, Reels e Carrossel usando a mesma ideia', () => {
    expect(html).toContain('generatePostVariations()');
    expect(html).toContain("const formats=['Stories','Reels','Carrossel']");
    expect(html).toContain('Variações da mesma ideia');
    expect(html).toContain("saveHistory('Post','Variações multiformato'");
  });

  it('adiciona cópia individual aos cards e ao material completo', () => {
    expect(html).toContain('function copyCardContent(');
    expect(html).toContain('navigator.clipboard?.writeText');
    expect(html).toContain('⧉ Copiar card');
    expect(html).toContain('⧉ Copiar material completo');
    expect(html).toContain('✓ Copiado');
  });
});


describe('Construtores e briefing aprofundado', () => {
  it('transforma módulos genéricos em construtores por formulário', () => {
    expect(html).toContain('id="generic-context"');
    expect(html).toContain('id="generic-audience"');
    expect(html).toContain('id="generic-details"');
    expect(html).toContain('function generateGenericBuild(');
    expect(html).toContain('Não transforme a resposta em conversa');
  });

  it('inclui nicho, quantidade e instruções de profundidade no gerador de posts', () => {
    expect(html).toContain('id="post-niche"');
    expect(html).toContain('id="post-quantity"');
    expect(html).toContain('function postBriefing()');
    expect(html).toContain('legenda deve ter entre 500 e 800 palavras');
    expect(html).toContain('BRIEFING OBRIGATÓRIO');
  });

  it('mantém o Perfil Criativo como construção artística estruturada', () => {
    expect(html).toContain('id="creative-art-style"');
    expect(html).toContain('id="creative-formation"');
    expect(html).toContain('id="creative-process"');
    expect(html).toContain('id="creative-business-ideas"');
    expect(html).toContain('id="creative-audience"');
    expect(html).toContain('function saveCreativeProfile()');
    expect(html).toContain('Perfil Criativo artístico ativo');
  });
});


describe('Integração de IA no preview', () => {
  it('permite respostas lentas do provedor sem abortar após 12 segundos', () => {
    expect(html).toContain('setTimeout(()=>controller.abort(),45000)');
    expect(html).not.toContain('controller.abort(),12000');
  });

  it('diferencia timeout de IA de erro de credencial ausente', () => {
    expect(html).toContain('O provedor de IA retornou um erro.');
    expect(html).toContain('A integração de IA não respondeu em até 45 segundos');
    expect(html).not.toContain('Configure ANTHROPIC_API_KEY');
  });
});

describe('Qualidade e validação editorial dos posts', () => {
  it('rejeita respostas incompletas antes de exibir a sugestão da IA', () => {
    expect(html).toContain('function isPostDraftUsable(');
    expect(html).toContain('const required=[');
    expect(html).toContain('legendWords>=180');
    expect(html).toContain('hashtagCount>=10');
  });

  it('usa hashtags contextualizadas e fallback específico por formato', () => {
    expect(html).toContain('function makePostHashtags(');
    expect(html).toContain('normalize(niche+\' \'+topic)');
    expect(html).toContain('Tela 6');
    expect(html).toContain('Slide 8');
    expect(html).toContain('0–5s — Gancho');
  });
});


describe('Planejamento de Divulgação', () => {
  it('expõe um construtor dedicado com os tópicos estratégicos essenciais', () => {
    expect(html).toContain('id="view-planning"');
    expect(html).toContain('data-view="planning"');
    expect(html).toContain('id="plan-brand"');
    expect(html).toContain('id="plan-audience"');
    expect(html).toContain('id="plan-identity"');
    expect(html).toContain('id="plan-editorial"');
    expect(html).toContain('id="plan-kpis"');
  });

  it('gera plano com calendário, canais, KPIs e revisão humana', () => {
    expect(html).toContain('function generateDisclosurePlan()');
    expect(html).toContain('function buildDisclosurePlanFallback(');
    expect(html).toContain('Calendário editorial de 4 semanas');
    expect(html).toContain('Métricas e indicadores');
    expect(html).toContain("saveHistory('Planejamento'");
    expect(html).toContain('nenhuma ação externa será executada automaticamente');
  });
});
