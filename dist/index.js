import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'frontend');
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };

createServer(async (req, res) => {
  if (req.url === '/health') { res.writeHead(200, {'content-type':'application/json'}); res.end(JSON.stringify({status:'ok', runtime:'node-static-flux'})); return; }
  if (req.url?.startsWith('/api/')) { res.writeHead(503, {'content-type':'application/json'}); res.end(JSON.stringify({detail:'Integração disponível após configurar as credenciais do provedor.'})); return; }
  const pathname = (req.url || '/').split('?')[0];
  const safe = normalize(pathname === '/' ? '/index.html' : pathname).replace(/^\.\.[\\/]/, '');
  try { const body = await readFile(join(root, safe)); res.writeHead(200, {'content-type': types[extname(safe)] || 'text/plain; charset=utf-8'}); res.end(body); }
  catch { const body = await readFile(join(root, 'index.html')); res.writeHead(200, {'content-type':'text/html; charset=utf-8'}); res.end(body); }
}).listen(port, '0.0.0.0', () => console.log(`FLUX server listening on port ${port}`));
