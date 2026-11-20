from pathlib import Path
s = Path('/home/ubuntu/marketing-agent-dashboard/frontend/index.html').read_text()
pos = s.find('win.document.close()')
print(pos)
print(repr(s[pos-140:pos+80]))
