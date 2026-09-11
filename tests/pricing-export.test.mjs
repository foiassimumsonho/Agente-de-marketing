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
    expect(html).toContain('Início (0–5s)');
    expect(html).toContain('Meio (5–15s)');
    expect(html).toContain('Virada (15–25s)');
    expect(html).toContain('30 hashtags');
    expect(html).toContain('Responda aos comentários com atenção');
  });

  it('aceita títulos Markdown e marcadores com emoji no parser', () => {
    expect(html).toContain('const cleanHeading=line=>');
    expect(html).toContain('const matchLabel=line=>');
    expect(html).toContain('Material completo para revisão');
    expect(html).toContain('rascunho para revisão humana');
  });
});
