from pathlib import Path

path = Path('/home/ubuntu/marketing-agent-dashboard/frontend/index.html')
html = path.read_text()
css = '.history-pricing-main{display:flex;gap:12px;align-items:flex-start}.history-price-photo{width:72px;height:72px;object-fit:cover;border-radius:8px;border:1px solid #29364b}.history-price-grid{display:grid;grid-template-columns:repeat(3,minmax(76px,1fr));gap:7px;margin-top:8px}.history-price-grid span{display:flex;flex-direction:column;gap:3px;background:#111a29;border:1px solid #24324a;border-radius:7px;padding:7px}.history-price-grid small{color:#7f8ca3;font-size:9px;text-transform:uppercase}.history-price-grid b{color:#e9e4ff;font-size:11px}.history-price-note{color:#8190a7!important;font-size:10px!important;margin-top:10px!important}.history-actions{display:flex;gap:8px;margin-top:10px}.ghost-button{background:transparent;border:1px solid #3a465b;color:#aeb8c9;border-radius:7px;padding:7px 10px;font-size:10px;cursor:pointer}.ghost-button:hover{border-color:#df5799;color:#f1a9ce}.history-pricing .secondary{font-size:10px;padding:7px 10px}@media(max-width:720px){.history-pricing-main{flex-direction:column}.history-price-grid{width:100%}.history-actions{flex-wrap:wrap}}'
if css not in html:
    html = html.replace('</style>', css + '</style>', 1)
old = 'Consulte tudo que foi criado nesta sessão: arquétipos, sugestões de posts e conversas com o Agente de Marketing Digital.'
new = 'Consulte tudo que foi criado e salvo automaticamente para este usuário neste navegador: arquétipos, posts, conversas e orçamentos.'
if old not in html:
    raise SystemExit('history description anchor not found')
html = html.replace(old, new, 1)
path.write_text(html)
