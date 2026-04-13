/**
 * screenshot.mjs — take viewport screenshots at specific scroll offsets
 * Usage: node screenshot.mjs [url] [scrollY] [label]
 * Example: node screenshot.mjs http://localhost:3001 1000 services
 */
import http from 'http';
import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const shotDir = join(__dir, 'temporary screenshots');
mkdirSync(shotDir, { recursive: true });

const url    = process.argv[2] || 'http://localhost:3001';
const scrollY = parseInt(process.argv[3] || '0');
const label  = process.argv[4] || '';

const nums = readdirSync(shotDir).filter(f => f.endsWith('.png'))
  .map(f => { const m = f.match(/^screenshot-(\d+)/); return m ? +m[1] : 0; });
const n = nums.length ? Math.max(...nums) + 1 : 1;
const fname = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
const outPath = join(shotDir, fname);

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DBG_PORT = 9223;

// Launch headless Edge with remote debugging
const proc = spawn(EDGE, [
  `--remote-debugging-port=${DBG_PORT}`,
  '--headless', '--disable-gpu', '--no-sandbox',
  '--disable-extensions',
  '--window-size=1400,900',
  url,
], { stdio: 'ignore', detached: false });

const delay = ms => new Promise(r => setTimeout(r, ms));
await delay(3000); // wait for page load

// Fetch CDP target list
const targets = await new Promise((res, rej) => {
  http.get(`http://localhost:${DBG_PORT}/json`, r => {
    let d = ''; r.on('data', c => d += c);
    r.on('end', () => { try { res(JSON.parse(d)); } catch(e) { rej(e); } });
  }).on('error', rej);
});

const target = targets.find(t => t.type === 'page');
if (!target) throw new Error('No page target found');

// Connect via WebSocket (Node 22+ built-in)
const ws = new WebSocket(target.webSocketDebuggerUrl);

let msgId = 0;
const pending = new Map();

ws.addEventListener('message', ({ data }) => {
  const msg = JSON.parse(data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(msg.error.message));
    else resolve(msg.result);
  }
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++msgId;
  pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params }));
});

await new Promise(r => ws.addEventListener('open', r));

// Enable Runtime
await send('Runtime.enable');

// Scroll to position
if (scrollY > 0) {
  await send('Runtime.evaluate', {
    expression: `document.documentElement.scrollTop = ${scrollY}; document.body.scrollTop = ${scrollY};`
  });
  await delay(600);
}

// Take screenshot
const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });

writeFileSync(outPath, Buffer.from(data, 'base64'));
console.log(`Saved: ${outPath}`);

ws.close();
proc.kill();
process.exit(0);
