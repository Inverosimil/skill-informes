# Comunicar: sintetizar, simplificar y adaptar

Lo que hace bueno un documento es que el lector entienda, no que esté todo. Esta guía cubre cómo decidir qué decir y cómo decirlo.

## 1. Sintetizar

**Pirámide:** la conclusión arriba, después las razones y abajo la evidencia. El lector puede parar en cualquier nivel y ya se lleva lo importante.

```
Idea principal (1 frase)
├── Apoyo 1 → evidencia, ejemplo, número
├── Apoyo 2 → evidencia
└── Apoyo 3 → evidencia
```

Cómo llegar a la idea principal:

1. Escribe todo lo que sabes del tema en bruto (para ti, no va al documento).
2. Pregúntate: "Si el lector recuerda una sola cosa, ¿cuál es?". Esa es la idea principal.
3. Agrupa el resto en 3 a 5 grupos que la sostengan. Ponle a cada grupo una frase-afirmación.
4. Lo que no entra en ningún grupo: anexo o fuera.

**Cortar sin miedo.** Para cada párrafo, lámina o figura: "¿El lector lo echaría de menos?". Si no, se va. Que algo sea cierto, interesante o haya costado trabajo no es razón para dejarlo.

**Corto vs. largo.** Lo largo no agrega ideas principales: agrega evidencia, ejemplos y anexo. Un informe de 4.000 palabras tiene la misma idea principal y los mismos 3 a 5 apoyos que uno de 400.

## 2. Simplificar sin mentir

Simplificar es quitar lo que el lector no necesita, no cambiar lo que es verdad.

Técnicas, en orden de uso:

1. **Concreto antes que abstracto.** Primero el ejemplo, después la regla. "Si vendes 100 cajas, ganas 37; con la promoción, 97" antes que la fórmula.
2. **Analogía con algo cotidiano.** "Un índice de base de datos es como el índice de un libro: no lees todo para encontrar una palabra". Usa una por concepto, no la estires y di dónde deja de valer si importa.
3. **Una idea por frase.** Frases de 15 a 20 palabras. Si lleva "y además", son dos frases.
4. **Números con contexto.** Nunca un número solo: compáralo ("3 veces más que el mes pasado"), tradúcelo ("unas 2 horas al día") o redondéalo (37,4821 → "unos 37").
5. **Nombrar las cosas como el lector.** Si el lector dice "la app", no escribas "el cliente frontend".
6. **Definir al primer uso.** Todo término técnico, sigla o nombre interno se explica la primera vez, en una línea: "PMTiles (un archivo que guarda el mapa ya cortado en piezas)".
7. **Mostrar el resultado antes que el cálculo.** "Conviene esperar al sábado: ganas el doble". El cálculo, después o en el anexo.

Prueba de la abuela: lee el texto como alguien que no sabe del tema. Marca cada palabra que te obligaría a preguntar "¿qué es eso?". Cada marca se explica o se cambia.

## 3. Adaptar al perfil

Antes de escribir, completa: "El lector es ___, sabe ___, no sabe ___, le importa ___, va a usar esto para ___".

| Si el lector… | Entonces… |
|---|---|
| no conoce el tema | analogías, ejemplos, glosario, menos números |
| decide (jefe, cliente, directorio) | conclusión, impacto, costo, riesgo, opciones; nada de "cómo" que no cambie la decisión |
| ejecuta (equipo, técnico) | pasos, responsables, detalles exactos, datos de entrada |
| es experto | términos precisos, método y supuestos; igual con conclusión arriba |
| tiene poco tiempo | formato corto, resumen arriba, todo lo demás plegado |
| es mixto | cuerpo para el menos experto, anexo para el más experto |

Si el pedido dice "para X" (mi jefe, un cliente, mi mamá, el equipo técnico), ese es el perfil. Si no lo dice, asume una persona inteligente que no conoce el tema.

## 4. Redacción

**Títulos-afirmación.** Cada título dice la conclusión de su lámina o sección.

| Mal (tema) | Bien (afirmación) |
|---|---|
| Resultados | El canal online explica el 80 % del crecimiento |
| Arquitectura | Todo pasa por una sola base, y ahí está el cuello de botella |
| Opción B | Esperar al sábado duplica la ganancia |

**Voz activa y directa.** "Recomiendo esperar" en lugar de "se sugiere considerar la posibilidad de esperar".

**Listas cortas.** De 3 a 5 ítems, paralelos (todos empiezan igual: verbo, sustantivo…). Más de 7 → agrupa.

**Negrita para la frase clave**, una por párrafo como máximo.

**Recomendación explícita.** Si hay opciones, di cuál recomiendas y por qué, en una línea, antes de detallarlas.

**Supuestos visibles.** Lo que no es seguro se marca: "Supuesto: el precio no cambia".

## 5. Cifras con origen

- Cada cifra importante dice de dónde sale: **dato** (medido, con fuente), **estimado** (calculado, con cómo) o **supuesto** (no se sabe; se dice que se asume). En las plantillas: `.chip`, `.chip.est`, `.chip.sup`, y la sección "De dónde sale cada número".
- Lo que no viene de una fuente verificada **se pregunta al usuario antes de entregar**. Un informe real mostró una deuda que no existía: eso destruye la confianza en todo el resto.
- Si dos fuentes no coinciden, dilo y explica cuál usaste.

## 6. Anticipar las preguntas

Antes de cerrar el guion, escribe las 5 preguntas que el lector hará ("¿y si…?", "¿cuánto cuesta?", "¿qué pasa con…?", "¿desde cuándo?", "¿y lo otro?"). Cada una se responde en el cuerpo o en la sección "Lo que te vas a preguntar". Si el lector tiene que volver a preguntar lo obvio, el documento quedó corto.

## 7. Antes y después (ejemplo real)

Un informe de ventas empezó así: "Modelo verificado: V = f(P, C, …)", con fórmulas, tablas de parámetros y luego cinco propuestas. El lector no entendió el resultado.

Rehecho con esta guía:

> **El sábado, con la promoción ×2, venderás unas 2,6 veces más que hoy.**
> Hoy no conviene: pierdes la promoción. Necesitas 3 cosas listas antes del sábado (abajo).
> ¿Por qué funciona? → sección 2, con un ejemplo de números simples.
> ¿Cómo se calculó? → anexo.

Misma información, distinto orden y lenguaje.
