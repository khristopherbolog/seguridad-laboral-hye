# Seguridad Laboral — Clínica Dental Hye

Micrositio estático (HTML + CSS + JS, sin frameworks ni base de datos) con los
protocolos de seguridad, prevención de riesgos y procedimientos de emergencia
de la Clínica Dental Hye, pensado para abrirse al instante desde un código QR,
sin registro ni contraseña.

**Sitio publicado:** https://khristopherbolog.github.io/seguridad-laboral-hye/

## Estructura del proyecto

```
seguridad-laboral/
├── index.html
├── css/styles.css
├── js/app.js                  ← contenido de los protocolos y documentos (ver abajo)
├── assets/
│   ├── img/                   ← logo, favicon, plano y mapa de evacuación
│   ├── documents/             ← PDF/Word descargables desde "Documentos de seguridad"
│   └── qr/
│       ├── generador-qr.html  ← herramienta para generar/regenerar el QR
│       ├── qr-seguridad-hye.png        (con marco y texto, alta resolución)
│       ├── qr-seguridad-hye-fondo-blanco.png (simple, para impresión pequeña)
│       └── qr-seguridad-hye.svg        (vectorial, para imprimir en afiche A4)
└── README.md
```

## Cómo actualizar los documentos de seguridad

1. Exporta el documento a PDF (recomendado, se puede previsualizar en el navegador)
   o déjalo en Word si solo necesitas que se pueda descargar.
2. Sube el archivo a `assets/documents/`.
3. Edita `js/app.js`, en el arreglo `DOCUMENTOS`, y ajusta `nombre`, `descripcion`,
   `archivoPdf` y/o `archivoWord` con la ruta del archivo.
4. Guarda y vuelve a publicar (en GitHub: sube el cambio al branch `main`; GitHub
   Pages se actualiza solo en 1-2 minutos).

Si un archivo listado no existe o no carga, el botón correspondiente se oculta
automáticamente — no rompe el sitio.

## Cómo modificar los protocolos

Todo el contenido de cada categoría (Incendio, Evacuación, Primeros auxilios, etc.)
vive en `js/app.js`, dentro del objeto `PROTOCOLOS`. Cada protocolo se construye
con los helpers `bloqueHacer(...)`, `bloqueNoHacer([...])`, `bloqueInfo(...)` y
`bloquePendiente(...)`. Edita los textos ahí — no requiere tocar `index.html`.

Los puntos marcados como **"INFORMACIÓN PENDIENTE DE VALIDACIÓN POR LA
INSTITUCIÓN"** deben completarse con datos oficiales de la clínica (EPP
detallado, teléfono directo de la clínica, nombres de los responsables de cada
rol, etc.) antes de considerarlo definitivo.

## Cómo cambiar el dominio / URL

El sitio es 100 % estático, así que puede moverse a cualquier hosting (GitHub
Pages, Netlify, Vercel, Cloudflare Pages, hosting propio) sin cambios de código,
ya que todas las rutas son relativas.

- **Para usar un dominio propio con GitHub Pages:** Settings → Pages → Custom
  domain, y configura un registro CNAME en tu proveedor de DNS apuntando a
  `khristopherbolog.github.io`.
- **Para mover el sitio a otro proveedor:** copia toda la carpeta y despliégala
  ahí; no hay configuración de servidor que migrar.

## Cómo regenerar el código QR si cambia la URL

1. Abre `assets/qr/generador-qr.html` en un navegador (necesita internet, carga
   una librería estándar desde una CDN).
2. Cambia el campo "URL de destino" por la nueva URL.
3. Pulsa "Generar QR".
4. Descarga el PNG y/o el SVG con los botones correspondientes.
5. Reemplaza los archivos en `assets/qr/`.

La herramienta verifica automáticamente (decodificando el QR generado) que el
código corresponda exactamente a la URL indicada antes de descargarlo.

## Privacidad

El sitio no recopila datos personales de quien lo visita: no hay formularios,
cuentas, cookies de seguimiento ni analítica.

---

**Proyecto académico**
[Nombre de la Universidad]
[Facultad / Carrera]
[Asignatura]
[Integrantes]
2026
