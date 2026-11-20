from pathlib import Path
s = Path('/home/ubuntu/marketing-agent-dashboard/frontend/index.html').read_text()
needle = "document.querySelectorAll('#nav button').forEach"
pos = s.find(needle)
print('first', pos)
while pos >= 0:
    print('\n---\n', s[max(0,pos-500):pos+900])
    pos = s.find(needle, pos+1)
