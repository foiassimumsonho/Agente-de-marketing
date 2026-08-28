from pathlib import Path

path = Path('/home/ubuntu/marketing-agent-dashboard/frontend/index.html')
s = path.read_text()

old_markup = '<div class="export-actions" id="price-export-actions" hidden><button class="secondary" onclick="exportPricingPdf()">▣ Exportar PDF</button><button class="primary" onclick="exportPricingImage()">▧ Baixar imagem</button></div>'
new_markup = '<div class="export-actions" id="price-export-actions" hidden><button class="secondary" onclick="exportPricingPdf()">▣ Exportar PDF</button><button class="primary" onclick="exportPricingImage()">▧ Baixar imagem</button></div><div id="price-export-status" class="export-status" role="status" aria-live="polite"></div>'
if old_markup not in s:
    raise SystemExit('export markup anchor not found')
s = s.replace(old_markup, new_markup, 1)

old_css = '.export-actions button{flex:1;min-width:150px}'
new_css = '.export-actions button{flex:1;min-width:150px}.export-status{color:#7fe6d0;font-size:11px;line-height:1.45;margin-top:9px;min-height:16px}.export-status:empty{display:none}'
if old_css not in s:
    raise SystemExit('export css anchor not found')
s = s.replace(old_css, new_css, 1)

old_fn = "function exportPricingPdf(){if(!latestPricing){alert('Calcule uma precificação antes de exportar.');return}const win=window.open('','_blank');if(!win){alert('Permita pop-ups para exportar o PDF.');return}"
new_fn = "function showExportStatus(message){const status=document.getElementById('price-export-status');if(status)status.textContent=message}function exportPricingPdf(){if(!latestPricing){alert('Calcule uma precificação antes de exportar.');return}const win=window.open('','_blank');if(!win){showExportStatus('Permita pop-ups para abrir o layout PDF.');alert('Permita pop-ups para exportar o PDF.');return}"
if old_fn not in s:
    raise SystemExit('pdf function anchor not found')
s = s.replace(old_fn, new_fn, 1)

old_pdf_close = '<\\/script></body></html>`);win.document.close()}'
new_pdf_close = "<\\/script></body></html>`);win.document.close();showExportStatus('Layout PDF aberto em nova aba. Use “Salvar como PDF” na caixa de impressão.') }"
if old_pdf_close not in s:
    raise SystemExit('pdf close anchor not found')
s = s.replace(old_pdf_close, new_pdf_close, 1)

old_png = "const a=document.createElement('a');a.download=`orcamento-${(p.name||'produto').toLowerCase().replace(/[^a-z0-9]+/gi,'-')}.png`;a.href=canvas.toDataURL('image/png');a.click()"
new_png = "const a=document.createElement('a');a.download=`orcamento-${(p.name||'produto').toLowerCase().replace(/[^a-z0-9]+/gi,'-')}.png`;a.href=canvas.toDataURL('image/png');a.style.display='none';document.body.appendChild(a);a.click();showExportStatus('Imagem PNG gerada e enviada para download.');setTimeout(()=>a.remove(),1000)"
if old_png not in s:
    raise SystemExit('png download anchor not found')
s = s.replace(old_png, new_png, 1)

path.write_text(s)
print('export hardened')
