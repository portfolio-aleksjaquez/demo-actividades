# Actividades interactivas · Demo

Tres actividades interactivas para primaria, en español, que funcionan en computadora, tablet y celular:

| Actividad | Tipo | Materia |
| --- | --- | --- |
| El ciclo de vida de la mariposa monarca | Ordenar arrastrando | Ciencias Naturales · 3.º |
| ¿Qué parte está coloreada? | Emparejar fracciones con figuras | Matemáticas · 4.º |
| Viaje por el sistema solar | Opción múltiple con retroalimentación | Ciencias Naturales · 5.º |

**Demo en línea:** https://portfolio-aleksjaquez.github.io/demo-actividades/

> Contenido de ejemplo. Textos e ilustraciones (SVG) son originales.

## Características

- Arrastrar con el dedo, el mouse o el lápiz (Pointer Events), sin que la página se desplace mientras se arrastra.
- Alternativa sin arrastrar: tocar una tarjeta y luego el lugar.
- Uso completo con teclado (`Tab`, `Enter`/`Espacio`, `Esc`), roles ARIA y anuncios para lectores de pantalla.
- Botón **Comprobar**, marcas de acierto y error, pistas, celebración al terminar y botón **Reiniciar**. El orden inicial es aleatorio.
- Respeta la preferencia de movimiento reducido del sistema.
- Sonido opcional generado con WebAudio (desactivado por defecto).

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run build    # genera dist/
```

HTML, CSS y JavaScript sin frameworks, con Vite (multipágina). Fuentes: Grandstander y Atkinson Hyperlegible (vía @fontsource).

## Publicación

Cada push a `main` construye el sitio y lo publica en GitHub Pages con `.github/workflows/deploy.yml`. En el repositorio, **Settings → Pages → Source** debe estar en **GitHub Actions**.
