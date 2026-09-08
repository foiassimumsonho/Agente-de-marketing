from pathlib import Path

path = Path('/home/ubuntu/marketing-agent-dashboard/frontend/index.html')
h = path.read_text()
old = "const pattern=new RegExp('(?:^|\\n)\\s*(?:'+keys.join('|')+')\\s*[:\\-]?\\s*([\\s\\S]*?)(?=\\n\\s*(?:'+stop+')\\s*[:\\-]|$)','i')"
new = "const pattern=new RegExp('(?:^|\\\\n)\\\\s*(?:'+keys.join('|')+')\\\\s*[:\\\\-]?\\\\s*([\\\\s\\\\S]*?)(?=\\\\n\\\\s*(?:'+stop+')\\\\s*[:\\\\-]|$)','i')"
if old not in h:
    raise SystemExit('renderer regex anchor not found')
h = h.replace(old, new, 1)
path.write_text(h)
print('post-renderer-fixed')
