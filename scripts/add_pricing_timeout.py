from pathlib import Path

path = Path('/home/ubuntu/marketing-agent-dashboard/frontend/index.html')
s = path.read_text()
helper_anchor = 'let latestPricing=null;'
helper = "let latestPricing=null;function withTimeout(promise,fallback,ms=8000){return Promise.race([promise,new Promise(resolve=>setTimeout(()=>resolve(fallback),ms))])}"
if helper_anchor not in s:
    raise SystemExit('latestPricing anchor not found')
if 'function withTimeout(' not in s:
    s = s.replace(helper_anchor, helper, 1)
old_open = 'try{visual=await askFluxWithPhoto('
new_open = 'try{visual=await withTimeout(askFluxWithPhoto('
if old_open not in s:
    raise SystemExit('visual call opening not found')
s = s.replace(old_open, new_open, 1)
old_close = ",pricePhotoData)}catch(e){visual='Análise visual indisponível agora; a memória de cálculo continua válida com os dados informados.'}"
new_close = ",pricePhotoData),'Análise visual indisponível agora; a memória de cálculo continua válida com os dados informados.',8000)}catch(e){visual='Análise visual indisponível agora; a memória de cálculo continua válida com os dados informados.'}"
if old_close not in s:
    raise SystemExit('visual call closing not found')
s = s.replace(old_close, new_close, 1)
path.write_text(s)
print('timeout added')
