from pathlib import Path
html = Path('/home/ubuntu/marketing-agent-dashboard/frontend/index.html').read_text()
marker = "saveHistory('Precificação'"
start = html.find(marker)
print('start=', start)
print(html[start-300:start+1200] if start >= 0 else 'NOT FOUND')
