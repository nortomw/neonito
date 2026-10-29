# NEONITO — NORTOMW Lab

Prototipo de juego web sobre exploración, amistad y generosidad. Desarrollado con HTML, CSS y JavaScript nativo.

## Estructura

- `index.html`: interfaz HTML.
- `css/styles.css`: estilos y responsive móvil.
- `js/main.js`: lógica, controles y ciclo del juego.
- `js/config.js`: constantes.
- `js/geometry.js`: figuras octogonales y colisiones.
- `js/characters.js`: dibujo de personajes y Sagrada Família.

## Ejecutar localmente

Los módulos ES requieren abrir la web desde un servidor HTTP (no con `file://`). Desde la carpeta del proyecto:

```powershell
python -m http.server 8000
```

Visita `http://localhost:8000`. GitHub Pages los sirve directamente sin configuración adicional.

## Publicar

Sube **toda** esta estructura a la raíz de la rama `main` y activa GitHub Pages con `/ (root)`.

## Estado

Prototipo. Debe verificarse el recorrido completo y las interacciones en móviles reales antes de anunciarlo como versión estable.
