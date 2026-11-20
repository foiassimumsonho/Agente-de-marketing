from pathlib import Path

s = Path('/home/ubuntu/marketing-agent-dashboard/frontend/index.html').read_text()
for key, size in [('function askFluxWithPhoto', 1800), ('async function calculatePrice', 5000)]:
    start = s.find(key)
    print(f'--- {key} @ {start} ---')
    if start >= 0:
        print(s[start:start+size])
