# Librerías y skills de apoyo

Herramientas probadas con el estilo de la skill. **Ejemplo completo y funcionando:** `assets/librerias.html` (cada sección dice cuándo conviene y si funciona sin internet; copia el bloque que necesites). Antes de sumar una librería, pregúntate si un SVG a mano o los componentes de la plantilla bastan: casi siempre bastan.

## Cuál usar

| Necesito… | Usa | Sin internet | Peso |
|---|---|---|---|
| Un gráfico que cuenta una idea, con la nota escrita sobre los datos | **Observable Plot** (con d3) | sí, con `--remoto` | ~0,5 MB |
| Un gráfico para explorar (pasar el mouse, ver el valor, acercar), o tipos raros (sankey, calor, radar) | **ECharts** | sí, con `--remoto` | ~1 MB |
| Un gráfico simple de barras o líneas | componentes de la plantilla (`.bars`, `.chart`) o SVG a mano | sí | 0 |
| Un diagrama de flujo, de sistema o de pasos, prolijo y liviano | **D2** con `scripts/diagrama.py` | sí | ~10 KB |
| Un diagrama rápido de escribir y cambiar (flujo, secuencia, cronograma) | **Mermaid** | sí, con `--remoto` | ~2,5 MB |
| Un boceto, una idea en borrador, o marcar algo "con plumón" sobre un gráfico | **rough.js**, o D2 con `--a-mano` | sí | ~30 KB |
| Lugares: locales, zonas, rutas | **Leaflet** (fondo gris de Esri) | **no** (el fondo se baja al ver) | ~150 KB |
| Un mapa con miles de puntos o capas | MapLibre GL (`maplibre-gl@4.7.1`) | no | ~0,8 MB |
| Un informe que cuenta una historia en pasos: gráfico fijo que cambia al bajar | **Scrollama** (solo informes; en un deck usa `data-step`) | sí, con `--remoto` | ~5 KB |

Versiones fijas (cópialas tal cual desde `assets/librerias.html`): `echarts@5.5.1`, `d3@7.9.0`, `@observablehq/plot@0.6.16`, `mermaid@11.4.1`, `roughjs@4.6.6`, `leaflet@1.9.4`, `scrollama@3.2.0`, desde `cdn.jsdelivr.net`. `scripts/empaquetar.py --remoto` las deja dentro del HTML.

## Que se vean como la plantilla

Las librerías no entienden `oklch()` ni `color-mix()`. La función `tono('--accent')` del ejemplo resuelve cualquier variable de la plantilla a `rgba()`; `T()` trae todas (`fg`, `soft`, `faint`, `line`, `off`, `accent`, `bg`, `muted`). Cada gráfico se registra en `dibujos` y se redibuja cuando cambia el tema.

Reglas de siempre, también aquí: el acento solo para lo que importa (el resto en `off` o `faint`), rótulo directo sobre los datos en vez de leyenda, sin caja alrededor (rótulo `.fl` sobre una línea), Inter en el texto, fondo transparente.

## D2: diagramas como texto, entregados como SVG

```
python3 scripts/diagrama.py flujo.d2 flujo.svg            # trazo limpio
python3 scripts/diagrama.py flujo.d2 flujo.svg --a-mano   # trazo de boceto
```

- Necesita `d2` (`brew install d2`).
- El SVG usa las variables de la plantilla (sigue al tema y al acento). **Pégalo dentro del HTML**, no como `<img>` (un `<img>` no hereda las variables).
- Lo importante va con `class: clave` (sale en acento). Pocas cajas (máximo 7 a 9), una dirección (`direction: right` o `down`), textos cortos; si el texto queda chico, usa menos cajas o `style.font-size`.

```d2
direction: right
pedido: "Pedido\n2 min"
espera: "Espera repartidor\n18 min" {class: clave}
pedido -> espera
classes: { clave: { style.stroke-width: 3 } }
```

## Mapas

- Fondo: Canvas gris de Esri (claro y oscuro, gratis y sin clave; lleva la atribución "Esri, HERE, Garmin, © OpenStreetMap"). El de CARTO ahora pide clave: no lo uses.
- Marcadores con `L.circleMarker` en el color de acento; la zona, con `L.circle` punteado.
- `scrollWheelZoom: false`, para que bajar por la página no mueva el mapa.
- Avisa en la entrega que el mapa necesita internet para verse.

## Scrollama (relato al bajar, solo en informes)

Dos columnas: a la izquierda (o arriba, en celular) el gráfico **fijo** (`position: sticky`); a la derecha, los pasos de texto. Cada paso que entra en pantalla cambia el gráfico (resalta otra barra, agrega una línea, cambia el año). Máximo 3 a 6 pasos, cada uno una frase. El gráfico debe entenderse también quieto, en el PDF.

## Impeccable (skill instalada: `~/.claude/skills/impeccable`)

Skill de diseño de Paul Bakaus con comandos de revisión. **Úsala como lupa, no como directora de arte:**

- Úsala para revisar antes de entregar: `critique` (jerarquía y claridad), `audit` (accesibilidad, celular, rendimiento), `polish` (pasada final), y si hace falta `typeset`, `layout`, `quieter` o `distill`.
- **El estilo del usuario manda.** Ya está decidido y aprobado (ver `diseno.md`): los rótulos chicos sobre los títulos (`.k`), la letra mono en rótulos y datos, Bebas Neue + Inter, un solo acento y bordes casi rectos se quedan, aunque Impeccable los marque como "por defecto de IA". Su propia regla lo permite: "the brief wins".
- No corras `init`, `live`, `hooks` ni `craft` en las carpetas del usuario, ni crees `PRODUCT.md` o `DESIGN.md`, salvo que él lo pida. Si su comando `context` falla o pide bajar algo, sigue sin él: sus guías (`reference/*.md`) se leen igual.
- Con una marca de empresa, manda esa marca.
