#!/usr/bin/env python3
"""Convierte un diagrama D2 (texto) en un SVG que usa los colores del documento.

Uso:  python3 scripts/diagrama.py flujo.d2 flujo.svg [--a-mano]

- Necesita `d2` (brew install d2). El SVG no lleva JavaScript: pesa poco y funciona sin internet.
- Los colores del tema de D2 se cambian por las variables de la plantilla (--fg, --line, --accent…),
  así el diagrama sigue al tema claro/oscuro y al color de acento. Pégalo dentro del HTML (inline):
  un <img> no hereda las variables.
- Una pieza con `class: clave` va en el color de acento (definir en el .d2:
  classes: { clave: { style.stroke-width: 3 } }).
- --a-mano: trazo dibujado a mano (modo sketch de D2), para bocetos o explicaciones informales.
"""
import argparse, re, subprocess, sys, tempfile, pathlib

COLORES = {
    'N1': 'var(--fg)', 'N2': 'var(--soft)', 'N3': 'var(--soft)', 'N4': 'var(--faint)', 'N5': 'var(--line)', 'N6': 'var(--muted)', 'N7': 'transparent',
    'B1': 'var(--off)', 'B2': 'var(--off)', 'B3': 'var(--faint)', 'B4': 'var(--line)', 'B5': 'var(--muted)', 'B6': 'var(--bg)',
    'AA2': 'var(--accent)', 'AA4': 'var(--accent)', 'AA5': 'var(--muted)', 'AB4': 'var(--accent)', 'AB5': 'var(--muted)',
}
EXTRA = """
.d2 text{font-family:var(--sans,Inter,sans-serif)!important}
.d2 .connection{stroke:var(--faint)}
.d2 .connection.fill-B1,.d2 path.fill-B1{fill:var(--faint)}
.d2 .clave .shape>*{stroke:var(--accent)!important}
.d2 .clave text{fill:var(--accent)!important}
"""


def main():
    ap = argparse.ArgumentParser(description='D2 → SVG con los colores de la plantilla')
    ap.add_argument('entrada'); ap.add_argument('salida')
    ap.add_argument('--a-mano', action='store_true', help='trazo a mano (sketch)')
    a = ap.parse_args()
    with tempfile.TemporaryDirectory() as tmp:
        out = pathlib.Path(tmp) / 'd.svg'
        cmd = ['d2', '--theme', '0', '--pad', '8', a.entrada, str(out)] + (['--sketch'] if a.a_mano else [])
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode:
            sys.exit(r.stderr.strip() or 'd2 falló (¿está instalado? brew install d2)')
        svg = out.read_text()
    for k, v in COLORES.items():
        svg = re.sub(r'\.(fill|stroke|color)-' + k + r'\{(fill|stroke|color):#[0-9A-Fa-f]{3,8};\}', lambda m: f'.{m.group(1)}-{k}{{{m.group(2)}:{v};}}', svg)
    svg = re.sub(r'^<\?xml[^>]*\?>\s*', '', svg)   # para pegarlo dentro del HTML
    # Sin ancho ni alto fijos: el SVG se adapta a su contenedor
    svg = re.sub(r'(<svg[^>]*?) width="[^"]*" height="[^"]*"', r'\1', svg, count=1)
    svg = svg.replace('<svg ', '<svg class="d2-diagrama" ', 1)
    svg = svg.replace('</style>', EXTRA + '</style>', 1)
    # d2 pone class="d2-…" en el svg interno: se marca para las reglas de arriba
    svg = re.sub(r'class="(d2-\d+) d2-svg"', r'class="\1 d2-svg d2"', svg)
    pathlib.Path(a.salida).write_text(svg)
    print(f'{a.salida}: {len(svg) // 1024} KB')


if __name__ == '__main__':
    main()
