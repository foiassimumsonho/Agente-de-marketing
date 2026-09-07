from pathlib import Path

html = Path('/home/ubuntu/marketing-agent-dashboard/frontend/index.html').read_text()
markers = [
    'function readHistory', 'function saveHistory', 'function renderHistory',
    'function clearHistory', 'function openView', 'function calculatePrice',
    'id="view-history"'
]
for marker in markers:
    start = html.find(marker)
    print(f'\n--- {marker} at {start} ---')
    print(html[start:start + 1800] if start >= 0 else 'NOT FOUND')
