# Visuales: qué usar para cada idea

Un visual se gana su lugar si el lector entiende **más rápido o mejor** con él que sin él. Si solo decora o impresiona, se saca.

## Más visuales, siempre

Regla del usuario: tender siempre a más imágenes y componentes gráficos. Cada sección o lámina lleva al menos uno, y nunca dos párrafos seguidos sin algo que mirar. **En presentaciones, imágenes de verdad:** la mayoría de las láminas lleva una foto, una captura, un ícono grande del tema (por ejemplo, los del juego o de la app de la que se habla) o una ilustración; los íconos genéricos de trazo son el último recurso. Busca primero en la carpeta del proyecto (íconos, capturas, logos) y úsalos grandes, no como adorno chico. **Cada ítem de una fila de tarjetas o de una lista lleva su imagen o ilustración** (por ejemplo, cada día de una semana, cada opción, cada hábito). Si no hay imagen, dibuja un ícono de línea grande en SVG (`<symbol>` en el sprite de la plantilla) que muestre la idea: monedas, una casa, un dado, un matraz. Las plantillas ya traen estos componentes (ver `html-informe.md`):

| Componente | Sirve para |
|---|---|
| Tarjetas de cifras (`.kpis`) | las 3 o 4 cifras que resumen todo, arriba |
| Gráfico de líneas o barras (`figure.fg`) | tendencias y comparaciones; con anotación directa en el gráfico |
| Pictograma "N de cada 10" (`.waffle`) | proporciones que se entienden de un vistazo |
| Antes y después (`.ba`) | el efecto de una decisión |
| Lista con íconos (`.ilist`) | 3 a 5 puntos concretos con su cifra |
| Imagen real (`figure.img`) | lo físico, un lugar, una pantalla, una persona |
| Tarjetas de opciones, pasos y preguntas (`.cards`) | decisiones, planes y dudas |
| Simulador (`.sim`) | cuando el lector tiene que elegir un número y ver qué pasa |
| Fórmula explicada (`.fx`) | cuando la cuenta importa; siempre con qué es cada símbolo |

Los gráficos y simuladores van **sin caja**: rótulo sobre una línea, el gráfico suelto, la lectura abajo.

## Tabla de decisión

| La idea es… | Usa | Evita |
|---|---|---|
| un número clave | número grande + comparación ("+12 % vs. 2025") | gráfico de una barra |
| comparar pocas cantidades | barras horizontales ordenadas | torta con más de 3 partes, 3D |
| evolución en el tiempo | línea (o barras si son pocos periodos) | áreas apiladas difíciles de leer |
| partes de un todo | barra apilada al 100 % o un número ("3 de cada 4") | torta con muchas porciones |
| un proceso o pasos | fila de pasos numerados, o diagrama de flujo simple | diagramas con flechas en todas direcciones |
| un sistema (piezas que se conectan) | diagrama de cajas con pocas conexiones, agrupado por capas | mostrar todo a la vez; mejor por partes |
| una jerarquía | árbol o lista con sangría | red de nodos |
| comparar opciones | tabla con la recomendada destacada | párrafos paralelos |
| algo físico, un lugar, una pantalla | foto, captura o mapa real (Leaflet, ver `librerias.md`) | ilustraciones genéricas |
| un mecanismo difícil de imaginar | figura interactiva o animada (ver Anatomy) | texto largo |
| un concepto abstracto | analogía + ícono o ilustración simple | una figura compleja que hay que descifrar |
| una cita o frase clave | frase grande sola en la lámina | adornos |

Reglas para cualquier visual:

- **Título-afirmación arriba:** dice qué mirar ("Las ventas se duplicaron en marzo"), no qué es ("Ventas por mes").
- **Destaca lo que importa:** la barra, línea o caja clave en el color de acento; el resto en gris.
- **Rotula directo** sobre los datos en vez de usar leyendas aparte.
- **Una idea por visual.** Si dice dos cosas, son dos visuales.
- **Fuente y fecha** de los datos debajo, en pequeño.
- **Prueba de 5 segundos:** míralo 5 segundos. Si no sabes qué dice, simplifícalo.

## Gráficos

Usa la skill **`dataviz`** si está disponible: tiene paleta, validación de contraste y reglas de cada tipo de gráfico. Para dibujarlos: componentes de la plantilla o SVG a mano si son simples; **Observable Plot** si el gráfico cuenta una idea anotada; **ECharts** si el lector debe explorarlo. Ver `librerias.md`.

## Diagramas

- Usa la skill **`artifact-diagramming`** si está disponible.
- Si no, **D2** convertido con `scripts/diagrama.py` (liviano, sigue el tema), Mermaid (rápido de escribir) o SVG inline. Para un boceto, D2 `--a-mano` o rough.js. Ver `librerias.md`. Pocas cajas (máximo 7 a 9 por vista), flujo en una sola dirección (izquierda→derecha o arriba→abajo) y etiquetas cortas.
- **Sistema grande → por partes.** Funcionó muy bien en decks reales: primero el mapa completo tal cual es, después el mismo mapa simplificado y luego cada parte por separado, volviendo al mapa con esa parte resaltada. Las piezas que se repiten entre láminas mantienen su posición, para que el ojo las siga.

## Imágenes

Los documentos sin imágenes se sienten planos. Busca, en este orden:

1. **Del usuario o del proyecto:** capturas, fotos, logos, íconos que ya existan en la carpeta.
2. **Capturas reales:** de la app, la web o el sistema del que se habla. Si hay navegador disponible, captúralas tú.
3. **Bancos con licencia libre:** Wikimedia Commons, Unsplash, Pexels, o wikis del tema (anota la licencia y el autor en el pie).
4. **Íconos:** un solo set por documento (Material Symbols, Lucide o Tabler), SVG inline, en el color del texto o del acento.
5. **Ilustración SVG simple** hecha por ti: formas planas y pocas, al servicio de la idea.

Incrusta siempre las imágenes en el archivo (`scripts/empaquetar.py`); nunca enlaces imágenes de sitios externos. Comprime: fotos a menos de ~300 KB, ancho máximo ~1600 px.

## Figuras interactivas y Anatomy

La skill **`anatomy`** hace figuras isométricas interactivas de muy alta calidad: un objeto físico cuyo funcionamiento *es* el concepto. Bien usada, aporta mucho. Mal usada, el efecto sorprende al principio pero hace más difícil entender la idea.

**Úsala solo si se cumplen las cuatro:**

1. **Hay un mecanismo:** algo que se mueve, fluye, se llena, se corta o cambia de estado. Una lista o una comparación no son mecanismos.
2. **El objeto se reconoce al instante** y su funcionamiento corresponde uno a uno con el concepto (un mapa que se corta en piezas, una prensa que comprime). Si hay que explicar el objeto antes de explicar la idea, falla.
3. **El lector entiende más rápido con la figura** que con un diagrama de 4 cajas o un gráfico. Compáralos mentalmente; si empatan, gana lo simple.
4. **Cabe en el esfuerzo:** tamaño Figure (una idea, un mecanismo). Un documento lleva como máximo 1 o 2 figuras así.

**No la uses para:** números o comparaciones (usa gráficos), listas de opciones, cálculos, "darle vida" a una lámina, o reemplazar una explicación que faltó.

Si la usas: la figura va **después** de la frase que dice qué muestra, con un pie que explique en una línea qué mirar y qué significa. Los controles (botones de pasos, arrastrar) deben ser evidentes. Debe seguir entendiéndose quieta, en PDF y en celular.

## Animación

**Las presentaciones van siempre con mucha animación** (regla del usuario). La plantilla del deck ya lo hace sola al entrar cada lámina: los elementos suben en cascada, las líneas de los gráficos se dibujan, las barras crecen, los pictogramas aparecen uno a uno, los anillos se llenan, las cifras cuentan desde cero, los flujos avanzan, el cuello de botella pulsa y las imágenes se acercan despacio. Tú suma:

- `data-step` para construir una explicación en pasos (la flecha revela cada parte).
- `data-k` para que una pieza viaje de una lámina a la siguiente (por ejemplo, el título o una cifra).
- Visuales animables en vez de texto: flujo (`.flow`), línea de tiempo (`.tline`), anillo (`.donut`), barras, pictograma, gráfico de líneas.
- Narración, si el deck es para mirarlo sin presentador: la voz dispara los pasos y los resaltados (ver "Narración" en `html-deck.md`).

Reglas: la animación muestra algo (un cambio, un orden, una causa), nunca retrasa la lectura más de ~1,5 s por lámina; siempre se respeta `prefers-reduced-motion`, y con `?estatico` (capturas y PDF) todo queda quieto y completo.

En el informe, la animación es mínima: el contenido se lee, no se presenta.

## Otras skills útiles (si están instaladas)

| Skill | Para qué |
|---|---|
| `dataviz` | gráficos, KPIs, colores de datos |
| `artifact-diagramming` | diagramas legibles en ambos temas |
| `anatomy` | figuras isométricas interactivas (con los criterios de arriba) |
| `artifact-design` | fundamentos de diseño de páginas |
| `frontend-design` | dirección estética que no se vea "de plantilla" |
| `pdf`, `pptx`, `docx` | otros formatos de salida |
