from pathlib import Path

path = Path('/home/ubuntu/marketing-agent-dashboard/frontend/index.html')
h = path.read_text()
anchor = "function openView(id){"
insert = "function restoreLatestPost(){const latest=readHistory().find(item=>item.type==='Post'&&item.result);const result=document.getElementById('post-result');if(!latest||!result)return;result.innerHTML=renderPostResult(latest.result,latest.format||'Feed');result.dataset.restoredPost=String(latest.id)}\n"
if anchor not in h:
    raise SystemExit('openView anchor not found')
if 'function restoreLatestPost()' not in h:
    h = h.replace(anchor, insert + anchor, 1)
h = h.replace("function openView(id){if(id==='history')renderHistory();", "function openView(id){if(id==='history')renderHistory();if(id==='posts')restoreLatestPost();", 1)
path.write_text(h)
print('latest-post-restore-added')
