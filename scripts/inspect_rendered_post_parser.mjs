import { readFileSync } from 'node:fs';

const html = readFileSync('/home/ubuntu/marketing-agent-dashboard/frontend/index.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';
const start = script.indexOf('function buildPostFallback');
const end = script.indexOf('if(location.hash', start);
const chunk = script.slice(start, end);

const recommendPostingTime = () => 'terça';
const escapePostHtml = (value) => String(value);
const scope = { recommendPostingTime, escapePostHtml };
const factory = new Function('scope', `with(scope){${chunk}; return { buildPostFallback, renderPostResult };}`);
const { buildPostFallback, renderPostResult } = factory(scope);

const raw = buildPostFallback('Reels', 'artistas independentes', 'Engajamento', 'A arte que acolhe', 'Reflexão.', {});
const rendered = renderPostResult(raw, 'Reels');

console.log('HAS_PLACEHOLDER=', rendered.includes('Será preenchido pelo Agente de Marketing Digital conforme o briefing.'));

const target = 'Será preenchido pelo Agente de Marketing Digital conforme o briefing.';
let index = rendered.indexOf(target);
while (index !== -1) {
  const startSlice = Math.max(0, index - 240);
  const endSlice = Math.min(rendered.length, index + target.length + 240);
  console.log('\n--- PLACEHOLDER CONTEXT ---\n');
  console.log(rendered.slice(startSlice, endSlice));
  index = rendered.indexOf(target, index + target.length);
}

console.log('\n--- RAW ---\n');
console.log(raw);
