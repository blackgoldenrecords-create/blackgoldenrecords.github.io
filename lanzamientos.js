/* ============================================================
   LANZAMIENTOS DE BLACK GOLDEN RECORDS
   Este es el único archivo que tienes que editar para cambiar los lanzamientos.

   CÓMO AGREGAR UN LANZAMIENTO NUEVO
   1. Copia un bloque completo, desde { hasta }, incluida la coma del final.
   2. Pégalo en la lista, en la posición donde quieres que aparezca.
   3. Cambia los textos entre comillas.
   4. Guarda el archivo y súbelo a GitHub.

   CÓMO QUITAR UNO
   Borra su bloque completo, de { a }, con su coma.

   CAMPOS
   artista       Nombre del artista (solo para tu referencia, no se muestra).
   titulo        Título que aparece bajo la portada.
   tipo          Texto debajo del título. Ejemplo: 'Single', 'EP', 'Single · Colaboración'.
   codigo        Texto pequeño en la esquina de la portada. Ejemplo: 'BGR · 024'.
   portada       'negro', 'oro' o 'carbon' para portadas de color.
                 O la ruta de una imagen que subiste a la carpeta assets, por ejemplo
                 'assets/mi-portada.jpg'. Si usas imagen, no necesitas textoPortada.
   textoPortada  Hasta 2 líneas sobre la portada: ['LINEA 1', 'LINEA 2'].
                 La segunda línea sale en dorado. Déjalo en [] si no quieres texto.
   destacado     true en el lanzamiento que sale grande en el Home.
                 Solo uno debe tener true. Los demás, false.
   descripcion   Texto corto que acompaña al lanzamiento destacado en el Home.
   enlaces       Los botones de plataformas. Pon el enlace completo (empieza con https://).
                 Si lo dejas vacío {} el botón dice "Avisarme" y lleva al formulario.
                 Ejemplo:
                 { 'Spotify': 'https://open.spotify.com/...', 'YouTube': 'https://youtu.be/...' }
   ============================================================ */

var LANZAMIENTOS = [
  {
    artista: 'LeLe × Erickproud',
    titulo: 'LeLe × Erickproud',
    tipo: 'Single · Colaboración',
    codigo: 'BGR · 10 OCT',
    portada: 'oro',
    textoPortada: ['LELE', '× ERICKPROUD'],
    destacado: true,
    descripcion: 'La colaboración más reciente del sello. Audio, visual y narrativa salen juntos el mismo día.',
    enlaces: {}
  },
  {
    artista: 'Celeste',
    titulo: 'Celeste',
    tipo: 'Próximo single',
    codigo: 'BGR · 2026',
    portada: 'assets/textura-estrella.jpg',
    textoPortada: [],
    destacado: false,
    descripcion: '',
    enlaces: {}
  },
  {
    artista: 'Black Golden Records',
    titulo: 'Por anunciar',
    tipo: 'Próximo lanzamiento',
    codigo: 'BGR · 2026',
    portada: 'assets/textura-graffiti.jpg',
    textoPortada: [],
    destacado: false,
    descripcion: '',
    enlaces: {}
  }
];

/* ============================================================
   Desde aquí hacia abajo no hace falta tocar nada.
   ============================================================ */
(function () {
  'use strict';

  var COLORES = { oro: 'gold', carbon: 'carbon' };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function imagenValida(p) { return /^assets\/[\w\-.]+\.(jpe?g|png|webp)$/i.test(p); }
  function urlValida(u) { return typeof u === 'string' && /^https:\/\//i.test(u); }

  function portada(r) {
    var c = el('div', 'cover');
    var p = r.portada || 'negro';
    var esImagen = imagenValida(p);
    if (esImagen) {
      c.classList.add('img');
      c.style.backgroundImage = 'url("' + p + '")';
    } else if (Object.prototype.hasOwnProperty.call(COLORES, p)) {
      c.classList.add(COLORES[p]);
    }
    if (!esImagen) c.appendChild(el('div', 'eb', 'BLACK GOLDEN RECORDS'));
    var t = r.textoPortada;
    if (t && t.length) {
      var tt = el('div', 'tt', t[0]);
      if (t[1]) tt.appendChild(el('i', null, t[1]));
      c.appendChild(tt);
    }
    if (r.codigo) c.appendChild(el('div', 'cd', r.codigo));
    c.setAttribute('role', 'img');
    c.setAttribute('aria-label', 'Portada de ' + r.titulo);
    return c;
  }

  function enlaces(r) {
    var box = el('div', 'plats');
    var mapa = r.enlaces || {};
    var n = 0;
    Object.keys(mapa).forEach(function (nombre) {
      if (!urlValida(mapa[nombre])) return;
      var a = el('a', null, nombre);
      a.href = mapa[nombre];
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      box.appendChild(a);
      n++;
    });
    if (!n) {
      var av = el('a', null, 'Avisarme');
      av.href = '#contact';
      box.appendChild(av);
    }
    return box;
  }

  function primerEnlace(r) {
    var mapa = r.enlaces || {};
    var k = Object.keys(mapa).filter(function (x) { return urlValida(mapa[x]); })[0];
    return k ? { nombre: k, url: mapa[k] } : null;
  }

  // Cuadrícula de lanzamientos
  var grid = document.getElementById('rel-grid');
  if (grid) {
    LANZAMIENTOS.forEach(function (r) {
      var card = el('article', 'rel');
      card.appendChild(portada(r));
      card.appendChild(el('h3', null, r.titulo));
      card.appendChild(el('p', null, r.tipo));
      card.appendChild(enlaces(r));
      grid.appendChild(card);
    });
  }

  // Lanzamiento destacado del Home
  var slot = document.getElementById('feature-slot');
  var dest = LANZAMIENTOS.filter(function (r) { return r.destacado; })[0];
  if (slot && dest) {
    var box = el('div', 'feature');
    box.appendChild(portada(dest));
    var txt = el('div');
    txt.appendChild(el('div', 'label', 'Lanzamiento destacado'));
    txt.appendChild(el('h3', null, dest.titulo));
    if (dest.descripcion) txt.appendChild(el('p', null, dest.descripcion));
    var fila = el('div', 'cta-row');
    fila.style.marginTop = '0';
    var link = primerEnlace(dest);
    var btn = el('a', 'btn fill', link ? 'Escuchar en ' + link.nombre : 'Ver lanzamientos');
    if (link) { btn.href = link.url; btn.target = '_blank'; btn.rel = 'noopener noreferrer'; }
    else { btn.href = '#releases'; }
    fila.appendChild(btn);
    txt.appendChild(fila);
    box.appendChild(txt);
    slot.appendChild(box);
  }
})();
