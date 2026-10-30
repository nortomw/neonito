# NEONITO — NORTOMW Lab

**[Jugar ahora →](https://nortomw.github.io/neonito/)**

Un corazón que late, demonios traviesos y un laberinto inspirado en el Eixample de Barcelona. NEONITO es un prototipo de juego web sobre exploración, amistad y generosidad: busca un libro en la biblioteca, compártelo con Luma, y encuentra la llave para volver a casa.

## El mundo

- 🏛️ **La Sagrada Família** es un refugio — recupera todas tus vidas y los demonios no pueden entrar.
- 🌳 **Los parques** del Eixample también son zona segura: puedes descansar y comer sin que te persigan.
- 🌊 **El mar** recupera energía, pero no vidas.
- 🗝️ El objetivo es encontrar la llave y volver a casa, esquivando a los demonios por el camino.
- Por el recorrido hay comercios y una cafetería donde interactuar, y premios que suman puntos: 🍎 +100 · 🥚 +150 · ☕ +200 · 💧 +250.

## Controles

Flechas, WASD o controles táctiles (joystick o botones direccionales). `E` o el botón "Entrar" para interactuar con comercios, la biblioteca y Luma.

## Stack técnico

HTML, CSS y JavaScript nativo (ES modules), sin frameworks ni dependencias.

- `index.html` — interfaz HTML.
- `css/styles.css` — estilos y responsive móvil.
- `js/main.js` — lógica, controles y ciclo del juego.
- `js/config.js` — constantes.
- `js/geometry.js` — figuras octogonales y colisiones.
- `js/characters.js` — dibujado de personajes y de la Sagrada Família en canvas, a mano, sin assets externos.

## Ejecutar localmente

Los módulos ES requieren servir la web por HTTP (no abrir con `file://`):

```powershell
python -m http.server 8000
```

Visita `http://localhost:8000`.

## Estado

Prototipo activo. Pendiente de verificar el recorrido completo y las interacciones táctiles en dispositivos móviles reales antes de llamarlo versión estable.

---
NEONITO · NORTOMW Lab · Prototipo ❤️
