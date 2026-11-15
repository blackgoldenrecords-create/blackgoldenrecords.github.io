# Black Golden Records

Sitio web oficial de Black Golden Records (BGR). Página estática, sin proceso de compilación.

- `index.html`: la página (HTML y CSS).
- `lanzamientos.js`: **la lista de lanzamientos**. Es el archivo que editas para cambiarlos (ver abajo).
- `app.js`: el formulario de contacto (validación y envío a Google Sheets).
- `assets/`: las texturas e imágenes de la página.
- `apps-script/Code.gs`: script que recibe los mensajes y los guarda en tu hoja de Google. **No se publica en la web**, se pega en Google (ver sección 3).
- `.nojekyll`: le dice a GitHub Pages que sirva los archivos tal cual.

## 1. Publicar en GitHub Pages

### Opción A: desde la web de GitHub

1. Crea un repositorio público en https://github.com/new (por ejemplo `bgr-web`).
2. Haz clic en **uploading an existing file** y arrastra todo el contenido de la carpeta: `index.html`, `app.js`, `lanzamientos.js`, `.nojekyll`, `README.md`, la carpeta `assets` y la carpeta `apps-script`.
3. Haz **Commit changes**.
4. Ve a **Settings → Pages**, elige **Deploy from a branch**, rama **main**, carpeta **/ (root)**, y guarda.
5. En uno o dos minutos la página queda en `https://TU-USUARIO.github.io/bgr-web/`.
6. En la misma pantalla, activa **Enforce HTTPS**.

### Opción B: con git

```bash
git init
git add .
git commit -m "Sitio web de Black Golden Records"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/bgr-web.git
git push -u origin main
```

## 2. Cómo cambiar los lanzamientos

Abre `lanzamientos.js`. Arriba del archivo está la lista `LANZAMIENTOS`, con un bloque por lanzamiento:

```js
{
  artista: 'Celeste',
  titulo: 'Nombre del single',
  tipo: 'Single',
  codigo: 'BGR · 025',
  portada: 'oro',
  textoPortada: ['CELESTE', 'NOMBRE DEL SINGLE'],
  destacado: false,
  descripcion: '',
  enlaces: {
    'Spotify': 'https://open.spotify.com/...',
    'YouTube': 'https://youtu.be/...'
  }
},
```

- **Agregar un lanzamiento:** copia un bloque completo (de `{` a `},`), pégalo en la lista y cambia los textos.
- **Quitar uno:** borra su bloque completo.
- **Cambiar el orden:** mueve los bloques. El primero aparece primero.
- **Cambiar el destacado del Home:** pon `destacado: true` solo en el lanzamiento que quieres grande y `false` en los demás.
- **Portada de color:** `portada: 'negro'`, `'oro'` o `'carbon'`, junto con `textoPortada` (hasta dos líneas; la segunda sale en dorado).
- **Portada con imagen:** sube la imagen a la carpeta `assets` y escribe `portada: 'assets/nombre-de-tu-imagen.jpg'`. Usa solo letras, números, guiones y puntos en el nombre del archivo (sin espacios ni tildes). Con imagen no hace falta `textoPortada`.
- **Botones de plataformas:** pon el enlace completo, que empiece con `https://`. Si dejas `enlaces: {}` el botón dice "Avisarme" y lleva al formulario de contacto.

Después de guardar, sube `lanzamientos.js` (y la imagen, si agregaste una) a GitHub. En uno o dos minutos se actualiza la página.

## 3. Guardar los contactos en Google Sheets

Los mensajes del formulario se guardan como filas en una hoja de Google que solo tú ves. Cuando quieras un Excel, usa **Archivo → Descargar → Microsoft Excel (.xlsx)**.

1. Entra a https://sheets.new y ponle un nombre, por ejemplo `BGR Contactos`.
2. Ve a **Extensiones → Apps Script**.
3. Borra el código que aparece y pega todo el contenido de `apps-script/Code.gs`.
4. Si quieres un aviso por correo con cada mensaje nuevo, escribe tu correo en `NOTIFY_EMAIL` al inicio del script.
5. Haz clic en **Implementar → Nueva implementación**.
6. En el engranaje, elige **Aplicación web**. Configura:
   - **Ejecutar como:** Yo.
   - **Quién tiene acceso:** Cualquier persona.
7. Haz clic en **Implementar** y acepta los permisos de Google (te pedirá autorizar con tu cuenta).
8. Copia la **URL de la aplicación web**. Termina en `/exec`.
9. Abre `app.js` y pega la URL en `ENDPOINT`:

   ```js
   var ENDPOINT = 'https://script.google.com/macros/s/XXXXXXXX/exec';
   ```

10. Sube `app.js` actualizado a GitHub. En uno o dos minutos el formulario ya guarda en tu hoja.
11. Haz una prueba desde la página y revisa que aparezca una fila nueva en la pestaña `Contactos`.

Si cambias `Code.gs` más adelante, usa **Implementar → Administrar implementaciones → Editar → Nueva versión**. La URL se mantiene.

## 4. Seguridad

Lo que ya trae el sitio:

- **Política de contenido (CSP)** en `index.html`: la página solo carga scripts propios, y solo se comunica con Google Apps Script y Google Fonts.
- **Validación y límites** en el formulario y de nuevo en el script de Google, que es el que cuenta, porque el código del navegador se puede saltar.
- **Campo trampa (honeypot)** y tiempo mínimo para bots, y un envío por minuto por navegador.
- **Protección contra fórmulas**: si alguien escribe `=...` en el mensaje, el script lo guarda como texto para que Excel no lo ejecute.
- **Sin secretos en el código**: la URL de Apps Script no es una contraseña, pero tampoco hay tokens ni claves en el repositorio.

Lo que te toca a ti:

- Activa la **verificación en dos pasos** en tu cuenta de GitHub y en tu cuenta de Google.
- No compartas la hoja de contactos con nadie que no deba ver esos datos.
- No subas al repositorio exportaciones de la hoja ni archivos con correos de contactos.
- Activa **Enforce HTTPS** en Settings → Pages.

Límites de GitHub Pages: no permite configurar cabeceras de servidor, así que no se puede impedir al 100% que otro sitio meta tu página en un iframe.

## 5. Otras cosas que editar

| Qué | Dónde |
| --- | --- |
| Correo de contacto | `index.html`, busca `contacto@tudominio.com` |
| URL de Apps Script | `app.js`, variable `ENDPOINT` |
| Biografías de artistas | `index.html`, busca `class="artist"` |
| Fotos de artistas | En `.photo`, agrega `background-image: url(assets/foto.jpg)` y sube la foto a `assets` |
| Quitar o agregar un artista | `index.html`, copia o borra un bloque `<article class="artist">` completo |
| Videos de BGR Sessions | `index.html`, busca `class="stage"` y agrega un enlace a tu canal |
| Texturas de fondo | Archivos `textura-*.jpg` en `assets`. Puedes reemplazarlos por otras imágenes con el mismo nombre |

La política de contenido bloquea scripts y estilos de otros sitios. Si más adelante agregas algo externo (por ejemplo un reproductor incrustado), hay que permitirlo en la etiqueta `Content-Security-Policy` de `index.html`.

## 6. Dominio propio (opcional)

1. En **Settings → Pages → Custom domain**, escribe tu dominio.
2. En tu proveedor de dominio, crea un registro `CNAME` de `www` hacia `TU-USUARIO.github.io`.
3. Activa **Enforce HTTPS** cuando GitHub lo permita.
