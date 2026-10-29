# Revisión final

Pásala completa antes de entregar. Corre `node scripts/capturas.mjs <archivo.html> <carpeta>` y **mira cada imagen**: el script avisa desbordes, texto chico, **contraste bajo** (texto contra su fondo real, mínimo 4,5:1; 3:1 en letra grande) y **encuadre** (láminas cuyo contenido usa menos de ~60 % del alto, con franjas vacías arriba y abajo), pero no ve si algo se entiende.

## Comunicación (lo más importante)

- [ ] La idea principal está en la primera pantalla o lámina, en una frase simple.
- [ ] Leyendo solo los títulos, en orden, se entiende la historia y la conclusión.
- [ ] Cada título es una afirmación, no un tema.
- [ ] Hay recomendación explícita y "qué necesito / qué sigue".
- [ ] Están respondidas las 5 preguntas que el lector hará.
- [ ] El largo coincide con lo pedido. Si sobra, se cortó o se movió al anexo.
- [ ] El nivel coincide con el lector: ningún término sin explicar para él.
- [ ] Todo número tiene contexto (comparación, traducción o redondeo) y origen (dato, estimado o supuesto).
- [ ] Nada es inventado ni dudoso: lo que no tenía fuente se confirmó con el usuario.

## Visuales

- [ ] Cada sección o lámina tiene al menos un componente gráfico; no hay dos párrafos seguidos sin algo que mirar.
- [ ] Cada visual pasa la prueba de 5 segundos y dice algo que el texto solo no dice.
- [ ] Hay imágenes reales cuando el tema es físico, un lugar o una pantalla, con pie y crédito.
- [ ] En un deck, la mayoría de las láminas lleva una imagen (foto, captura, ícono grande o ilustración), no solo texto y barras.
- [ ] Gráficos y simuladores sin caja; las figuras complejas (Anatomy) cumplen los criterios de `visuales.md`.

## Estilo y técnica

- [ ] El color de acento solo marca; lo destacado va invertido, no pintado.
- [ ] Ninguna sección deja una columna medio vacía (si pasa, cambia `.lado` por `.ancho`).
- [ ] La columna lateral cabe sin scroll (título corto, bajada de 1 o 2 líneas).
- [ ] Sin scroll horizontal en celular; nada se corta ni se superpone; sin texto chico.
- [ ] **Encuadre:** cada lámina ocupa su espacio (sin una franja vacía arriba o abajo); si sobra, agranda la evidencia o súmale una imagen, no el texto.
- [ ] **Contraste:** el script no avisa contraste bajo; ojo con el acento sobre piezas invertidas y con textos tenues.
- [ ] Se ve bien en claro y en oscuro (`--oscuro` en el script).
- [ ] Un solo archivo: imágenes incrustadas (`empaquetar.py`), y `--remoto` si debe funcionar sin internet.
- [ ] Sin errores en la consola del navegador.
- [ ] El PDF (`--pdf`) se ve bien.
- [ ] Deck narrado: el guion se escucha natural (frases cortas, cifras como se dicen), cada resaltado cae cuando se nombra y los términos en inglés están en el glosario de pronunciación. Escucha al menos dos láminas.
- [ ] Con marca: pasa también la revisión de la marca (`marcas.md`).
- [ ] Entregado donde corresponde (HTML final y, si sirve, su PDF).

## Si algo falla

Corrige la causa (el guion, el visual, el texto, la forma de la sección), no el síntoma: achicar la letra para que quepa casi nunca es la solución; dividir la lámina o cortar texto, casi siempre.
