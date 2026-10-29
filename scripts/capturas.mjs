#!/usr/bin/env node
// Capturas para revisar un informe o deck HTML, sin dependencias (Node 22+ y Google Chrome).
//
//   node capturas.mjs <archivo.html> <carpeta-salida> [--pdf] [--oscuro]
//
// Deck (plantilla deck.html): una PNG por lámina (todos los pasos visibles), hoja de contactos,
//   vista de celular, y aviso de elementos que se salen de la lámina.
// Informe: página completa en escritorio (1440) y celular (390), en tramos, y aviso de
//   desbordes horizontales en celular.
// --pdf genera el PDF con los estilos de impresión. --oscuro agrega capturas en modo oscuro.

import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('--')));
const [input, outArg] = args.filter(a => !a.startsWith('--'));
if (!input || !outArg) { console.error('Uso: node capturas.mjs <archivo.html> <carpeta-salida> [--pdf] [--oscuro]'); process.exit(1); }
if (typeof WebSocket === 'undefined') { console.error('Necesita Node 22 o superior (WebSocket global).'); process.exit(1); }

// Se acepta archivo.html#estado para capturar un estado concreto de la página
const [inputFile, inputHash = ''] = input.split('#');
const file = resolve(inputFile), out = resolve(outArg);
mkdirSync(out, { recursive: true });
const CHROME = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find(p => p && existsSync(p));
if (!CHROME) { console.error('No encontré Chrome. Define CHROME=/ruta/al/binario.'); process.exit(1); }

const sleep = ms => new Promise(r => setTimeout(r, ms));
const profile = mkdtempSync(join(tmpdir(), 'capturas-'));
const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--force-color-profile=srgb', 'about:blank'], { stdio: 'ignore' });

let port;
for (let k = 0; k < 100 && !port; k++) {
  await sleep(100);
  try { port = readFileSync(join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]; } catch {}
}
if (!port) { console.error('Chrome no arrancó.'); chrome.kill(); process.exit(1); }

const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
let seq = 0; const pending = new Map(); const waiters = [];
ws.onmessage = ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
  else if (m.method) waiters.filter(w => w.method === m.method).forEach(w => { waiters.splice(waiters.indexOf(w), 1); w.res(m.params); });
};
const send = (method, params = {}) => new Promise((res, rej) => { const id = ++seq; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
const once = method => new Promise(res => waiters.push({ method, res }));
const evaluate = async expr => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result.value;

await send('Page.enable'); await send('Runtime.enable');

const viewport = (width, height, mobile = false, dpr = 1) =>
  send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: dpr, mobile });
const scheme = dark => send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: dark ? 'dark' : 'light' }] });
let nav = 0;
const go = async url => {
  // Un parámetro distinto en cada visita obliga a cargar de nuevo (si no, un cambio de #hash no recarga)
  const [base, hash = ''] = url.split('#');
  url = base + (base.includes('?') ? '&' : '?') + '_v=' + (++nav) + (hash ? '#' + hash : '');
  const loaded = once('Page.loadEventFired');
  await send('Page.navigate', { url });
  await Promise.race([loaded, sleep(15000)]);
  await evaluate('document.fonts ? document.fonts.ready.then(() => true) : true');
  await sleep(400);
};
const shot = async (name, clip) => {
  const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: !!clip, ...(clip ? { clip: { ...clip, scale: 1 } } : {}) });
  writeFileSync(join(out, name), Buffer.from(r.data, 'base64'));
  return name;
};
// Página completa en tramos de 3000 px (más fácil de leer y sin límite de textura)
const fullPage = async (prefix, width) => {
  const h = await evaluate('Math.ceil(document.documentElement.scrollHeight)');
  const names = [];
  for (let y = 0, n = 1; y < h; y += 3000, n++) names.push(await shot(`${prefix}-${String(n).padStart(2, '0')}.png`, { x: 0, y, width, height: Math.min(3000, h - y) }));
  return names;
};

const url = pathToFileURL(file).href + (inputHash ? '#' + inputHash : '');
const html = readFileSync(file, 'utf8');
const isDeck = /class="stage"/.test(html) && /__deck/.test(html);
const report = [];

if (isDeck) {
  await viewport(1600, 900);
  await go(url + '?estatico#1');
  const count = await evaluate('window.__deck ? window.__deck.count : 0');
  const names = [];
  for (let n = 1; n <= count; n++) {
    await evaluate(`window.__deck.show(${n - 1}, 'end')`); await sleep(120);
    names.push(await shot(`lamina-${String(n).padStart(2, '0')}.png`));
    // Elementos que se salen de la lámina o texto cortado
    const issues = await evaluate(`(() => {
      const sl = document.querySelectorAll('.stage > .slide')[${n - 1}], R = sl.getBoundingClientRect(), out = [];
      // Contraste: compone el fondo real (capas con transparencia) y mide texto contra fondo (WCAG)
      const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
      const mezcla = (c, base) => { cx.globalCompositeOperation = 'copy'; cx.fillStyle = base; cx.fillRect(0, 0, 1, 1); cx.globalCompositeOperation = 'source-over'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')'; };
      const lum = c => { const d = c.match(/\\d+/g).map(Number).map(v => (v /= 255) <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4)); return .2126 * d[0] + .7152 * d[1] + .0722 * d[2]; };
      const bajo = {};
      const fondo = el => { const capas = []; for (let e = el; e; e = e.parentElement) { const b = getComputedStyle(e).backgroundColor; if (b && b !== 'rgba(0, 0, 0, 0)' && b !== 'transparent') capas.push(b); } return capas.reverse().reduce((acc, c) => mezcla(c, acc), 'rgb(0,0,0)'); };
      sl.querySelectorAll('*').forEach(el => {
        if (el.closest('.notas') || getComputedStyle(el).display === 'none') return;
        const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
        const tag = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '');
        if (r.right > R.right + 2 || r.bottom > R.bottom + 2 || r.left < R.left - 2) out.push('se sale: ' + tag + ' «' + (el.textContent || '').trim().slice(0, 40) + '»');
        else if (['P','LI','H1','H2','H3','TD','DIV','SPAN'].includes(el.tagName) && el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible') out.push('texto cortado: ' + tag);
        // Texto chico: en el lienzo de 1920, menos de 22 px no se lee proyectado (los SVG escalan aparte)
        const own = [...el.childNodes].some(c => c.nodeType === 3 && c.textContent.trim());
        if (own && !el.closest('svg') && !el.closest('.rail-s,.num,.srcl') && parseFloat(getComputedStyle(el).fontSize) < 17) out.push('texto chico (' + Math.round(parseFloat(getComputedStyle(el).fontSize)) + ' px): ' + tag + ' «' + el.textContent.trim().slice(0, 30) + '»');
        if (own && !el.closest('svg,.g-ui,.ph,.media') && parseFloat(getComputedStyle(el).webkitTextStrokeWidth || 0) === 0) {
          const cs = getComputedStyle(el), bg = fondo(el), fg = mezcla(cs.color, bg), fs = parseFloat(cs.fontSize);
          const r = (Math.max(lum(fg), lum(bg)) + .05) / (Math.min(lum(fg), lum(bg)) + .05), min = fs >= 40 || (fs >= 32 && +cs.fontWeight >= 600) ? 3 : 4.5;
          if (r < min) { const key = r.toFixed(1) + ':1, mínimo ' + min; (bajo[key] = bajo[key] || []).push('«' + el.textContent.trim().slice(0, 24) + '»'); }
        }
      });
      // Clases de la plantilla usadas en otra cosa (por ejemplo .ic, el ícono de 64 px con borde, en una lista o barra)
      sl.querySelectorAll('.ic:not(svg)').forEach(e => out.push('clase .ic en un ' + e.tagName.toLowerCase() + ' (es la del ícono de la plantilla; usa otro nombre)'));
      for (const [key, xs] of Object.entries(bajo)) out.push('contraste bajo (' + key + ') en ' + xs.length + ' texto' + (xs.length > 1 ? 's' : '') + ': ' + xs.slice(0, 3).join(', ') + (xs.length > 3 ? '…' : ''));
      // Encuadre: el contenido debe ocupar la lámina, sin franjas vacías grandes arriba o abajo
      if (!sl.matches('.seccion,.partida')) {
        const hojas = [...sl.querySelectorAll('*')].filter(e => !e.closest('.mbar,.srcl,.num,.rail-s,.voz,.notas,svg>*') && !e.children.length || e.matches('img,svg,.bars>div,.waffle,.gauge'));
        const rs = hojas.map(e => e.getBoundingClientRect()).filter(r => r.width && r.height);
        if (rs.length) {
          const top = Math.min(...rs.map(r => r.top)), bot = Math.max(...rs.map(r => r.bottom)), k = R.height / 1080;
          const alto = (bot - top) / (800 * k), arriba = (top - R.top) / k - 150, abajo = 950 - (bot - R.top) / k;
          if (alto < 0.6 && !sl.matches('.portada,.cierre')) out.push('encuadre: el contenido usa ' + Math.round(alto * 100) + ' % del alto útil (sobran ' + Math.round(Math.max(0, arriba)) + ' px arriba y ' + Math.round(Math.max(0, abajo)) + ' px abajo)');
        }
      }
      return [...new Set(out)].slice(0, 8);
    })()`);
    if (issues.length) report.push(`Lámina ${n}: ${issues.join(' | ')}`);
  }
  // Hoja de contactos
  const sheet = join(out, '_hoja.html');
  writeFileSync(sheet, `<!doctype html><body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:12px;font:12px sans-serif;color:#ccc">` +
    names.map((f, k) => `<div><img src="${f}" style="width:100%;display:block;border-radius:4px"><div style="padding:4px 2px">${k + 1}</div></div>`).join('') + '</body>');
  await viewport(1600, 900);
  await go(pathToFileURL(sheet).href);
  await fullPage('hoja', 1600);
  rmSync(sheet);
  // Celular: horizontal y vertical, primera lámina con contenido
  await viewport(844, 390, true, 2); await go(url + '?estatico#2'); await shot('movil-horizontal.png');
  await viewport(390, 844, true, 2); await go(url + '?estatico#2'); await shot('movil-vertical.png');
  if (flags.has('--pdf')) {
    await viewport(1920, 1080); await go(url + '?estatico#1');
    const r = await send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true });
    writeFileSync(join(out, basename(file, '.html') + '.pdf'), Buffer.from(r.data, 'base64'));
  }
  console.log(`Deck: ${count} láminas → ${out}`);
} else {
  await viewport(1440, 900); await scheme(false); await go(url);
  const d = await fullPage('escritorio', 1440);
  await viewport(390, 844, true, 2); await go(url);
  const m = await fullPage('movil', 390);
  const wide = await evaluate(`(() => {
    const W = innerWidth, out = [];
    if (document.documentElement.scrollWidth > W + 1) out.push('la página tiene scroll horizontal (' + document.documentElement.scrollWidth + ' px)');
    document.querySelectorAll('main *, header *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > W + 1 && !el.closest('.table-wrap') && getComputedStyle(el).position !== 'fixed') out.push('se sale en celular: ' + el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''));
    });
    // Texto chico en celular (menos de 11 px)
    document.querySelectorAll('main *, header *, aside *').forEach(el => {
      const own = [...el.childNodes].some(c => c.nodeType === 3 && c.textContent.trim());
      const cs = getComputedStyle(el);
      if (own && !el.closest('svg') && cs.display !== 'none' && el.offsetParent && parseFloat(cs.fontSize) < 11) out.push('texto chico en celular (' + parseFloat(cs.fontSize) + ' px): «' + el.textContent.trim().slice(0, 30) + '»');
    });
    return [...new Set(out)].slice(0, 12);
  })()`);
  report.push(...wide);
  if (flags.has('--oscuro')) {
    await viewport(1440, 900); await scheme(true); await go(url);
    await shot('escritorio-oscuro.png'); await scheme(false);
  }
  if (flags.has('--pdf')) {
    await viewport(1440, 900); await go(url);
    await evaluate(`document.querySelectorAll('details').forEach(d => d.open = true)`);
    const r = await send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true });
    writeFileSync(join(out, basename(file, '.html') + '.pdf'), Buffer.from(r.data, 'base64'));
  }
  console.log(`Informe: ${d.length} tramos de escritorio y ${m.length} de celular → ${out}`);
}

console.log(report.length ? 'Revisar:\n- ' + report.join('\n- ') : 'Sin problemas detectados: desbordes, texto chico, contraste ni encuadre (igual mira cada imagen).');
ws.close(); chrome.kill();
try { rmSync(profile, { recursive: true, force: true }); } catch {}
process.exit(0);
