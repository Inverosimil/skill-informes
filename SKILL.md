---
name: informes
description: Crea informes y presentaciones que se entienden a la primera, en HTML autocontenido (después PDF/PPTX). Úsala siempre que alguien pida un informe, reporte, presentación, deck, láminas, diapositivas, resumen ejecutivo, explicación visual, one-pager o "algo para mostrar/explicar" a otra persona, aunque no diga "HTML". Adapta el largo (corto o extenso), el nivel (simple, ejecutivo o técnico) y el lenguaje al lector final; sintetiza, simplifica ideas complejas y elige el visual correcto para cada idea (gráfico, diagrama, imagen o figura interactiva) solo cuando ayuda a entender. Estilo: el que pida el usuario; si no lo dice, el del proyecto (si tiene uno propio, como su app o su web); si no, el estilo propio de la skill (columna lateral, tarjetas, blanco y negro con un acento). Si hay una marca de empresa configurada, la aplica.
---

# Informes y presentaciones

Esta skill hace documentos que **comunican**: el lector entiende la idea principal en 30 segundos y puede actuar. El diseño está al servicio de eso. Un documento bonito que no se entiende es un documento fallido.

Sirve para dos formatos HTML (los demás vienen después):

- **Presentación (deck):** láminas 16:9, una idea por lámina, se avanza con flechas. Plantilla `assets/deck.html`, guía `references/html-deck.md`.
- **Informe:** una página con scroll, resumen arriba y secciones. Plantilla `assets/informe.html`, guía `references/html-informe.md`.
- **Presentación narrada:** el mismo deck con una voz que lo presenta sola (avanza, destaca cada cosa al nombrarla, subtítulos). El narrador parte apagado: el usuario lo enciende con `N` o desde el panel de opciones. Guía: "Narración" en `references/html-deck.md`.

Si no está claro cuál, decide así: se va a **exponer** frente a alguien → deck. Se va a **leer** solo → informe. Es una presentación que **el usuario va a mirar solo** (entender en qué están sus agentes, un tema nuevo, un estado de avance) o pide "narrada", "guiada", "con voz" o "tipo video" → deck **narrado** (voz Catalina; Jorge si la pide).

## Proceso

Sigue estos pasos en orden. Los pasos 1 a 3 deciden casi toda la calidad; no los saltes para ir directo al HTML.

### 1. Brief: para quién y para qué

Antes de escribir, define estas cinco cosas. Infiérelas del pedido y del contexto; pregunta solo lo que no puedas inferir y que cambie mucho el resultado (máximo 2 o 3 preguntas, en un solo mensaje).

| Pregunta | Opciones | Si no lo dicen |
|---|---|---|
| ¿Quién lo lee? | perfil, qué sabe, qué le importa | asume una persona inteligente que **no** conoce el tema |
| ¿Qué debe saber, decidir o hacer después? | la "acción" del documento | escríbela tú en una frase |
| ¿Formato? | deck o informe | regla de arriba |
| ¿Largo? | corto, medio, largo | medio |
| ¿Nivel? | simple, ejecutivo, técnico | ejecutivo |
| ¿Estilo? | el que pida, una marca de empresa, el del proyecto, el de la skill | el del proyecto si tiene uno; si no, el de la skill (ver paso 5) |

Anota el brief en 5 líneas antes de seguir. Todo lo demás se decide contra él.

**Anticipa las preguntas.** Escribe las 5 preguntas que el lector hará al leerlo ("¿y si…?", "¿cuánto cuesta?", "¿qué pasa con…?") y asegúrate de que el documento las responde: en el cuerpo o en una sección "Lo que te vas a preguntar". En un informe real del usuario faltaron justo esas respuestas.

### 2. Mensaje: la idea en una frase

Escribe la **idea principal** en una sola frase que un lector cualquiera entienda. Debajo, 3 a 5 ideas de apoyo. Todo lo que no apoye una de ellas se corta o va al anexo.

Lee `references/comunicar.md`: cómo sintetizar, cómo simplificar sin mentir, cómo adaptar el lenguaje al perfil y cómo escribir títulos que son afirmaciones.

### 3. Guion antes de diseñar

Escribe el esqueleto completo en texto: una línea por lámina o sección, con su **título-afirmación** (no "Resultados", sino "Las ventas crecieron 12 % por el canal online") y el visual que llevará.

Prueba del guion: si alguien lee **solo los títulos**, en orden, entiende la historia completa y la conclusión. Si no, rehaz el guion, no el diseño.

Estructura base (adáptala, no la fuerces):

1. **Conclusión primero:** qué pasa, qué recomiendo, qué necesito. Siempre al inicio.
2. **Contexto:** lo mínimo para entender por qué importa.
3. **Ideas de apoyo:** una por lámina o sección, cada una con su evidencia.
4. **Qué sigue:** pasos, decisiones o preguntas abiertas.
5. **Anexo:** detalle técnico, fórmulas, supuestos y fuentes. Plegado en el informe, al final en el deck.

### 4. Elige el visual de cada idea

**Tiende siempre a más imágenes y componentes gráficos** (regla de la skill): cada sección o lámina lleva al menos uno, y nunca dos párrafos seguidos sin algo que mirar. **En presentaciones, más aún:** cada cosa que se explique se muestra con un gráfico, una foto, un diagrama, un ícono o una animación; la mayoría de las láminas lleva una **imagen de verdad** (captura, foto, ícono grande del tema; busca primero en la carpeta del proyecto), y el deck va siempre animado (la plantilla lo hace sola; ver "Animación" en `visuales.md`). Lee `references/visuales.md` y decide con su tabla. La regla corta:

- **Un número** → número grande con su comparación. **Varios números** → gráfico. **Un proceso o sistema** → diagrama simple. **Algo físico o de lugar** → foto, captura o mapa. **Un mecanismo difícil de imaginar** → quizá una figura interactiva.
- Una figura llamativa (Anatomy, 3D, animación compleja) solo se usa si el lector **entiende más rápido con ella que sin ella**. Si solo impresiona, se saca.
- Para gráficos interactivos o anotados, diagramas (D2, Mermaid), trazo a mano, mapas o un informe que se cuenta al bajar, lee `references/librerias.md`: dice cuál usar y trae ejemplos probados en `assets/librerias.html`.

### 5. Diseño

Elige el estilo en este orden; gana el primero que aplique:

1. **El que pida el usuario** en el pedido ("con los colores de X", "estilo sobrio", "como el informe anterior").
2. **Una marca de empresa**, si el trabajo es para una organización con marca configurada (ver `references/marcas.md`).
3. **El estilo del proyecto**, si el informe es sobre un proyecto que tiene identidad visual propia (una app, una web, una marca, informes anteriores con un estilo propio). Búscalo antes de diseñar: `DESIGN.md` o guía de marca; tokens de diseño, `tailwind.config.*`, `globals.css` o archivos de tema; logo e íconos en la carpeta del proyecto; la app corriendo (una captura); y los informes anteriores del proyecto. Si lo encuentras, **tiende a parecerte a él**: toma sus colores (fondo, texto, acento), su tipografía, su logo, sus íconos y su radio de borde, y cámbialos en las variables de la plantilla (`--B`, `--F`, `--M`, `--hue` o `--accent`, las letras), sin rehacer la plantilla. Lo que no cambia es lo de esta skill: estructura, conclusión primero, visuales, revisión. Cuenta en la entrega qué tomaste del proyecto. Detalle en `references/diseno.md`, "Estilo del proyecto".
4. **El estilo de la skill**, si nada de lo anterior aplica.

- **Estilo de la skill:** ya hecho en las plantillas: columna lateral fija con título e índice, secciones que se acomodan al contenido, tarjetas, figuras sin contenedor, base blanco sobre negro (o al revés) y un solo acento que solo marca, bordes casi rectos. Lee `references/diseno.md`. Del tema solo cambia el tono del acento (`--hue`).
- **Con marca de empresa:** lee `references/marcas.md`. La marca decide todo lo visual; esta skill sigue decidiendo el contenido.
- Diseña para que se vea bien en **celular, escritorio e impresión**.

### 6. Construye desde la plantilla

Copia la plantilla que corresponda a la carpeta de trabajo y llénala. No partas de cero ni cambies su sistema de tokens sin motivo. Un solo archivo `.html` autocontenido: si usas imágenes locales, al final corre `python3 scripts/empaquetar.py entrada.html salida.html` para incrustarlas (con `--remoto` incrusta también fuentes y CDN, para usarlo sin internet).

Los dos metadatos del `<head>` (`informe:proyecto` e `informe:carpeta`) son opcionales: sirven a herramientas que agrupan informes por proyecto. Si no los usas, bórralos.

### 7. Revisa como lo haría el lector

Corre `node scripts/capturas.mjs <archivo.html> <carpeta-salida> [--pdf] [--oscuro]` (escritorio y celular; en un deck, cada lámina y una hoja de contactos) y **mira cada imagen**. Después pasa la lista de `references/revision.md`. Corrige y vuelve a capturar hasta que pase. Lo mínimo:

- La idea principal está arriba, en palabras simples.
- Cada cifra dice de dónde sale (dato, estimado o supuesto). Lo dudoso se confirma con el usuario **antes** de entregar, nunca se presenta como cierto.
- Leyendo solo los títulos se entiende todo.
- No hay términos sin explicar para este lector.
- Cada visual se entiende en 5 segundos y dice algo que el texto solo no dice.
- Nada se corta ni se superpone, en celular tampoco; ni texto chico, ni contraste bajo, ni láminas con franjas vacías (el script avisa las tres).
- Deck narrado: pruébalo siempre con `?mudo` y deja el narrador apagado al terminar (ver "Una sola voz" en `html-deck.md`); nunca dejes una voz sonando en una pestaña que el usuario no ve.
- Si está instalada la skill **impeccable**, pásale `critique` y `audit` como segunda mirada, con las reglas de `references/librerias.md` (el estilo del usuario manda).

### 8. Entrega

Si el deck es narrado, antes de empaquetar genera la voz: `python3 scripts/narrar.py deck.html deck.narrado.html` (ver "Narración" en `html-deck.md`).

Entrega el HTML final ya empaquetado (y, si sirve, su PDF: `node scripts/capturas.mjs archivo.html carpeta --pdf`) donde el usuario lo pida. En la carpeta del proyecto deja la fuente y lo necesario para rehacerlo; si el informe cambia, vuelve a generarlo y reemplaza la versión entregada.

Después di en 2 o 3 líneas: dónde quedó (el archivo final y la fuente), cómo se abre y qué decisión o acción pide el documento. Si quedaron supuestos, nómbralos.


## Escala según el largo pedido

| Largo | Deck | Informe | Qué entra |
|---|---|---|---|
| Corto ("rápido", "una lámina", "resumen") | 1 a 6 láminas | 1 pantalla a ~400 palabras | conclusión + 2 o 3 apoyos + qué sigue |
| Medio (por defecto) | 8 a 15 láminas | 800 a 1.500 palabras | estructura base completa |
| Largo ("completo", "detallado", "todo") | 15 a 30 láminas | 1.500 a 4.000 palabras | igual, con más evidencia y anexo; la conclusión sigue arriba |

Más largo no es más claro. Ante la duda, corta. Lo que sobra va al anexo, no al cuerpo.

## Nivel según el lector

| Nivel | Para quién | Cómo se escribe |
|---|---|---|
| Simple | cualquier persona | sin jerga, con analogías y ejemplos concretos, frases cortas, un número por idea |
| Ejecutivo | quien decide | conclusión, impacto, costo, riesgo y opciones; el cómo, solo si cambia la decisión |
| Técnico | quien lo construye o audita | términos exactos, método, supuestos y datos; igual con conclusión arriba y cada término definido la primera vez |

"Explícalo simple" o "para alguien que no sabe" → nivel simple siempre, aunque el tema sea técnico. Se puede combinar: cuerpo simple y anexo técnico.

## Errores que esta skill evita

Vienen de documentos reales que fallaron:

- **Empezar por el método.** Fórmulas, mecánicas o datos antes de decir qué se concluye. El lector se pierde antes de llegar a lo que importa.
- **Largo innecesario.** Cubrir todo lo que se sabe en vez de lo que el lector necesita.
- **Jerga sin traducir.** Siglas, nombres internos o términos del dominio sin explicar.
- **Visual que complica.** Una figura vistosa donde un gráfico de barras o una frase bastaban.
- **Diseño plano.** Muros de texto sin jerarquía, sin imágenes y sin respiro.
- **Espacio mal usado.** Texto corto a un lado y algo largo al otro, dejando una columna medio vacía.
- **Datos inventados o dudosos** presentados como ciertos.
- **No responder lo obvio.** Las preguntas que cualquier lector haría, sin respuesta.
- **No cerrar.** El lector termina sin saber cuál era el resultado ni qué hacer.

## Archivos

Las rutas son relativas a la carpeta de esta skill (normalmente `~/.claude/skills/informes/`). Nunca edites las plantillas originales: cópialas a la carpeta de trabajo.

- `references/comunicar.md`: síntesis, simplificación, adaptación al perfil y redacción.
- `references/visuales.md`: qué visual para cada idea, y cuándo usar Anatomy u otras skills.
- `references/diseno.md`: el estilo (tokens, tipografía, estructura, bordes, color) y móvil.
- `references/html-deck.md` y `references/html-informe.md`: cómo usar cada plantilla.
- `references/marcas.md`: cómo aplicar la marca de una empresa.
- `references/librerias.md`: ECharts, Observable Plot, D2, Mermaid, rough.js, Leaflet, Scrollama e Impeccable: cuándo y cómo.
- `references/revision.md`: lista de revisión final.
- `assets/deck.html` y `assets/informe.html`: plantillas. `assets/librerias.html`: ejemplos funcionando de cada librería, con el estilo de la plantilla.
- `scripts/capturas.mjs`: capturas de escritorio y celular; avisa desbordes, texto chico, contraste bajo y encuadre (láminas con franjas vacías); PDF (Node 22+ y Chrome, sin instalar nada). Acepta `archivo.html#estado` para capturar un estado concreto de la página.
- `scripts/narrar.py`: genera la voz del guion (`<aside class="voz">`) y la incrusta en el deck, con los tiempos de cada resaltado y los subtítulos.
- `scripts/empaquetar.py`: deja el HTML en un solo archivo con todo incrustado.
- `scripts/diagrama.py`: convierte un diagrama D2 en SVG con los colores de la plantilla (`--a-mano` para boceto).
