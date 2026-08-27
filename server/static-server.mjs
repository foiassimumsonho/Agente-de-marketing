import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'frontend');
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };

createServer(async (req, res) => {
  if (req.url === '/health') { res.writeHead(200, {'content-type':'application/json'}); res.end(JSON.stringify({status:'ok', runtime:'node-static-flux'})); return; }
  if (req.url?.startsWith('/api/chat')) {
    if (req.method !== 'POST') { res.writeHead(405, {'content-type':'application/json'}); res.end(JSON.stringify({detail:'Use POST para conversar com o agente.'})); return; }
    let raw = ''; for await (const chunk of req) raw += chunk;
    try {
      const payload = JSON.parse(raw || '{}');
      const base = process.env.BUILT_IN_FORGE_API_URL;
      const key = process.env.BUILT_IN_FORGE_API_KEY;
      if (!base || !key) { res.writeHead(503, {'content-type':'application/json'}); res.end(JSON.stringify({detail:'O provedor de IA ainda não está disponível neste ambiente. Configure a integração do Agente de Marketing Digital.'})); return; }
      const upstream = await fetch(`${base.replace(/\/$/,'')}/v1/chat/completions`, { method:'POST', headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'}, body:JSON.stringify({model:'gpt-5-mini',messages:[{role:'system',content:'Você é o Agente de Marketing Digital. Responda em português brasileiro, com orientação prática e sem publicar nada automaticamente.'},...(payload.messages||[])]}) });
      const data = await upstream.json();
      if (!upstream.ok) { res.writeHead(upstream.status, {'content-type':'application/json'}); res.end(JSON.stringify({detail:'Não foi possível consultar o provedor de IA agora.'})); return; }
      res.writeHead(200, {'content-type':'application/json'}); res.end(JSON.stringify({reply:data.choices?.[0]?.message?.content||'O agente não retornou conteúdo.'})); return;
    } catch { res.writeHead(400, {'content-type':'application/json'}); res.end(JSON.stringify({detail:'Solicitação de chat inválida.'})); return; }
  }
  if (req.url?.startsWith('/api/')) { res.writeHead(503, {'content-type':'application/json'}); res.end(JSON.stringify({detail:'Esta integração exige configuração específica antes de ser usada.'})); return; }
  const pathname = (req.url || '/').split('?')[0];
  const safe = normalize(pathname === '/' ? '/index.html' : pathname).replace(/^\.\.[\\/]/, '');
  try { const body = await readFile(join(root, safe)); res.writeHead(200, {'content-type': types[extname(safe)] || 'text/plain; charset=utf-8'}); res.end(body); }
  catch { const body = await readFile(join(root, 'index.html')); res.writeHead(200, {'content-type':'text/html; charset=utf-8'}); res.end(body); }
}).listen(port, '0.0.0.0', () => console.log(`FLUX server listening on port ${port}`));
