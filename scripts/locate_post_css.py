from pathlib import Path
html = Path('/home/ubuntu/marketing-agent-dashboard/frontend/index.html').read_text()
for token in ['.field{', '.result{', '.result-raw strong{', '</style>']:
    print(token, html.find(token))
start = html.find('.field{')
end = html.find('</style>', start)
print(html[start:end][:5000])
