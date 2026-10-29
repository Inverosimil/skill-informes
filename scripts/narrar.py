#!/usr/bin/env python3
"""Narra un deck: lee el guion de cada lámina, genera la voz y la incrusta en el HTML.

Uso:  python3 scripts/narrar.py deck.html salida.html [--voz catalina|jorge] [--ritmo +0%]

Guion: <aside class="voz">…</aside> dentro de cada <section class="slide">. Marcas:
  [paso N]          revela el paso N (data-step) justo en ese momento de la frase
  [foco SEL]        destaca SEL y atenúa sus vecinas; [foco -] quita el resaltado
  [foco A | B]      destaca varias piezas a la vez (también se juntan solas si se nombran seguidas)
  [foco:modo SEL]   fuerza el modo: marco, zoom, luz o subraya (si no, la plantilla elige)
  [clic SEL]        hace clic en SEL (por ejemplo, un botón del simulador)
  {visto|dicho}     muestra «visto» en los subtítulos y dice «dicho»
Pronunciación: <script type="application/json" id="pronunciacion">{"Power BI": "Páuer Bi Ái"}</script>
(cambia solo el audio). Voz de Microsoft Edge (gratis, sin cuenta; necesita internet al generar).
La primera vez crea su entorno en ~/.local/share/informes-narracion (solo edge-tts). Necesita ffprobe.
Guarda cada audio en caché: si el texto de una lámina no cambia, no se vuelve a generar.
"""
import argparse, asyncio, base64, hashlib, html, json, os, pathlib, re, subprocess, sys, tempfile

VOCES = {'catalina': 'es-CL-CatalinaNeural', 'jorge': 'es-MX-JorgeNeural'}
NOMBRE = {'es-CL-CatalinaNeural': 'Catalina', 'es-MX-JorgeNeural': 'Jorge'}
FRASE = re.compile(r'(?<=[.!?…])\s+(?=[¿¡A-ZÁÉÍÓÚÑ0-9])')
PAR = re.compile(r'\{([^|{}]*)\|([^{}]*)\}')
JUNTAR = 1.1   # segundos: dos [foco] más cercanos que esto se destacan juntos
ENV = pathlib.Path.home() / '.local/share/informes-narracion'
CACHE = pathlib.Path.home() / '.cache/informes-narracion'


def asegurar_edge_tts():
    """Usa edge-tts si está; si no, crea un entorno propio con él y se vuelve a ejecutar ahí."""
    try:
        import edge_tts  # noqa: F401
        return
    except ImportError:
        pass
    py = ENV / 'bin/python'
    if os.environ.get('INFORMES_NARRACION_ENV') or not sys.executable:
        sys.exit('Falta edge-tts: pip install edge-tts')
    if not py.exists():
        print('Preparando la voz (una sola vez)…', file=sys.stderr)
        subprocess.check_call([sys.executable, '-m', 'venv', str(ENV)])
        subprocess.check_call([str(py), '-m', 'pip', 'install', '-q', 'edge-tts'])
    os.environ['INFORMES_NARRACION_ENV'] = '1'
    os.execv(str(py), [str(py), *sys.argv])


def marcas(t):
    """Separa el guion en tramos de texto y marcas, respetando corchetes anidados ([clic a[b="1"]])."""
    out, i = [], 0
    while True:
        m = re.search(r'\[(paso|foco|clic)(?::(\w+))?\s', t[i:])
        if not m:
            out.append(('txt', None, t[i:])); return out
        a = i + m.start(); out.append(('txt', None, t[i:a]))
        depth, j = 0, a
        while j < len(t):
            depth += t[j] == '['; depth -= t[j] == ']'
            j += 1
            if depth == 0: break
        out.append((m.group(1), m.group(2) or '', t[a + len(m.group(0)):j - 1].strip())); i = j


def pronunciar(t, dic):
    for k in sorted(dic, key=len, reverse=True):
        t = re.sub(r'(?<!\w)' + re.escape(k) + r'(?!\w)', dic[k], t, flags=re.I)
    return t


def preparar(guion, dic):
    """Texto visto (subtítulos), texto dicho (voz) y marcas con su posición en el texto dicho."""
    visto, dicho, cues = '', '', []
    for tipo, modo, val in marcas(re.sub(r'\s+', ' ', html.unescape(guion)).strip()):
        if tipo == 'txt':
            visto += PAR.sub(r'\1', val)
            dicho += pronunciar(PAR.sub(lambda m: '\0' + m.group(2) + '\0', val), dic).replace('\0', '')
        else:
            cues.append({'tipo': tipo, 'modo': modo, 'arg': val, 'pos': len(dicho)})
    lead = len(dicho) - len(dicho.lstrip())
    for c in cues: c['pos'] = max(0, c['pos'] - lead)
    return re.sub(r'\s+', ' ', visto).strip(), dicho.strip(), cues


async def sintetizar(texto, voz, ritmo, ruta):
    import edge_tts
    c = edge_tts.Communicate(texto, voz, rate=ritmo, boundary='WordBoundary')
    palabras = []
    with open(ruta, 'wb') as f:
        async for ch in c.stream():
            if ch['type'] == 'audio': f.write(ch['data'])
            elif ch['type'] == 'WordBoundary':
                palabras.append({'w': ch['text'], 't': ch['offset'] / 1e7, 'd': ch['duration'] / 1e7})
    return palabras


def voz_con_cache(dicho, voz, ritmo):
    """Devuelve (mp3, palabras, duración); reutiliza lo ya generado para el mismo texto, voz y ritmo."""
    h = hashlib.sha256(f'{voz}|{ritmo}|{dicho}'.encode()).hexdigest()[:24]
    CACHE.mkdir(parents=True, exist_ok=True)
    mp3, meta = CACHE / f'{h}.mp3', CACHE / f'{h}.json'
    if mp3.exists() and meta.exists():
        m = json.loads(meta.read_text()); return mp3.read_bytes(), m['palabras'], m['dur']
    with tempfile.TemporaryDirectory() as tmp:
        ruta = f'{tmp}/a.mp3'
        pal = asyncio.run(sintetizar(dicho, voz, ritmo, ruta))
        dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', ruta]).decode())
        data = open(ruta, 'rb').read()
    mp3.write_bytes(data); meta.write_text(json.dumps({'palabras': pal, 'dur': dur}))
    return data, pal, dur


def lamina(guion, dic, voz, ritmo):
    visto, dicho, cues = preparar(guion, dic)
    data, pal, dur = voz_con_cache(dicho, voz, ritmo)
    cur = 0   # ubica cada palabra en el texto dicho, para saber cuándo cae cada marca
    for p in pal:
        j = dicho.find(p['w'], cur)
        if j >= 0: p['pos'] = j; cur = j + len(p['w'])
    pal = [p for p in pal if 'pos' in p]
    for c in cues:
        nxt = next((p for p in pal if p['pos'] >= c['pos']), None)
        c['t'] = round(max(0, (nxt['t'] if nxt else dur) - 0.12), 2)
    # Lo que se nombra seguido se destaca junto (dos huevos en un segundo = un solo resaltado)
    out = []
    for c in cues:
        prev = out[-1] if out else None
        if prev and c['tipo'] == prev['tipo'] == 'foco' and c['t'] - prev['t'] < JUNTAR and '-' not in (c['arg'], prev['arg']) and c['modo'] == prev['modo']:
            prev['arg'] += ' | ' + c['arg']; continue
        out.append(c)
    # Subtítulos frase por frase; cada palabra vista con su momento (proporcional a las dichas)
    fv, fd = FRASE.split(visto), FRASE.split(dicho)
    if len(fv) != len(fd): fv, fd = [visto], [dicho]
    subs, off = [], 0
    for v, d in zip(fv, fd):
        a = dicho.find(d, off); off = a + len(d)
        dp = [p for p in pal if a <= p['pos'] < a + len(d)]
        vw = v.split()
        if not dp or not vw: continue
        words = [{'w': html.escape(w), 't': round(dp[min(len(dp) - 1, int(i * len(dp) / len(vw)))]['t'], 2)} for i, w in enumerate(vw)]
        subs.append({'t0': round(dp[0]['t'], 2), 't1': round(dp[-1]['t'] + dp[-1]['d'], 2), 'w': words})
    return {'audio': 'data:audio/mpeg;base64,' + base64.b64encode(data).decode(), 'dur': round(dur, 2),
            'cues': [{k: c[k] for k in ('t', 'tipo', 'modo', 'arg')} for c in out], 'subs': subs}


def main():
    ap = argparse.ArgumentParser(description='Narra un deck de la skill informes.')
    ap.add_argument('entrada'); ap.add_argument('salida')
    ap.add_argument('--voz', default='catalina', help='catalina (Chile, predeterminada), jorge (México) o un nombre de voz de Edge')
    ap.add_argument('--ritmo', default='+0%', help='velocidad de la voz, por ejemplo +5%% o -5%%')
    a = ap.parse_args()
    asegurar_edge_tts()
    voz = VOCES.get(a.voz.lower(), a.voz)
    s = open(a.entrada, encoding='utf-8').read()
    m = re.search(r'<script type="application/json" id="pronunciacion">(.*?)</script>', s, re.S)
    dic = json.loads(m.group(1)) if m else {}
    secciones = re.findall(r'<section class="slide.*?</section>', re.sub(r'<!--.*?-->', '', s, flags=re.S), re.S)
    data = {'voz': NOMBRE.get(voz, voz), 'laminas': []}
    for k, sec in enumerate(secciones):
        g = re.search(r'<aside class="voz">(.*?)</aside>', sec, re.S)
        if not g:
            data['laminas'].append(None); continue
        d = lamina(g.group(1), dic, voz, a.ritmo)
        print(f'  lámina {k + 1:02d}: {d["dur"]:5.1f} s · {len(d["cues"])} marcas · {len(d["subs"])} frases', file=sys.stderr)
        data['laminas'].append(d)
    total = sum(x['dur'] for x in data['laminas'] if x)
    print(f'Total: {int(total // 60)} min {int(total % 60)} s · voz {data["voz"]}', file=sys.stderr)
    s = re.sub(r'\s*<script type="application/json" id="narracion">.*?</script>', '', s, flags=re.S)
    blob = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
    s = s.replace('</body>', f'<script type="application/json" id="narracion">{blob}</script>\n</body>', 1)
    open(a.salida, 'w', encoding='utf-8').write(s)


if __name__ == '__main__':
    main()
