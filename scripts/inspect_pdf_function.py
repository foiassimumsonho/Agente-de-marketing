from pathlib import Path

html = Path('/home/ubuntu/marketing-agent-dashboard/frontend/index.html').read_text()
start = html.index('function exportPricingPdf()')
end = html.index('function exportPricingImage()', start)
print(html[start:end])
