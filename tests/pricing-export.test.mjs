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
