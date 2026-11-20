from pathlib import Path
s = Path('/home/ubuntu/marketing-agent-dashboard/frontend/index.html').read_text()
for key in ['function exportPricingPdf', 'function exportPricingImage']:
    pos = s.find(key)
    print(f'--- {key} @ {pos} ---')
    print(s[pos:pos+5000])
