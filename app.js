(function () {
  'use strict';

  // Pega aquí la URL de tu Apps Script (la que termina en /exec). Mira el README.
  var ENDPOINT = 'PEGA_AQUI_LA_URL_DE_APPS_SCRIPT';

  var MIN_FILL_MS = 3000;     // un humano no llena el formulario en menos de 3 segundos
  var COOLDOWN_MS = 60000;    // un envío por minuto desde el mismo navegador
  var LS_KEY = 'bgr_last_send';
  var loadedAt = Date.now();

  var form = document.getElementById('cf');
  if (!form) return;
  var out = document.getElementById('out');
  var txt = document.getElementById('outtxt');
  var st = document.getElementById('st');
  var copyWrap = document.getElementById('copywrap');
  var sendBtn = document.getElementById('send');
  var mail = document.getElementById('mail').textContent;

  function val(id) { return document.getElementById(id).value.trim(); }
  function line(v, max) { return v.replace(/[\u0000-\u001F\u007F]/g, ' ').slice(0, max); }
  function block(v, max) { return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').slice(0, max); }
  function configured() { return /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(ENDPOINT); }
  function show(msg) { out.classList.add('show'); st.textContent = msg; }
  function lastSend() { try { return Number(localStorage.getItem(LS_KEY)) || 0; } catch (e) { return 0; } }
  function markSend() { try { localStorage.setItem(LS_KEY, String(Date.now())); } catch (e) {} }
  function validUrl(u) {
    try { var p = new URL(u); return p.protocol === 'https:' || p.protocol === 'http:'; } catch (e) { return false; }
  }

  function compose(d) {
    return [
      'Asunto: ' + d.motivo + ' — ' + d.nombre,
      '',
      'Nombre: ' + d.nombre,
      d.correo ? 'Correo: ' + d.correo : '',
      d.enlace ? 'Enlace: ' + d.enlace : '',
      '',
      d.mensaje
    ].filter(function (l, i, a) { return !(l === '' && a[i - 1] === ''); }).join('\n');
  }

  // Si el envío automático no está disponible, el visitante copia el mensaje y lo manda por correo.
  function fallback(d, msg) {
    txt.textContent = compose(d);
    txt.hidden = false;
    copyWrap.hidden = false;
    show(msg);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    txt.hidden = true;
    copyWrap.hidden = true;

    var d = {
      nombre: line(val('nombre'), 80),
      correo: line(val('correo'), 120),
      motivo: line(document.getElementById('tipo').value, 60),
      enlace: line(val('enlace'), 300),
      mensaje: block(val('msg'), 1500),
      web: val('web')
    };

    // Trampa para bots: un humano nunca ve este campo.
    if (d.web) { show('Mensaje enviado. Gracias, te responderemos pronto.'); form.reset(); return; }

    if (d.nombre.length < 2) { show('Escribe tu nombre.'); return; }
    if (d.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo)) { show('El correo no parece válido. Revísalo.'); return; }
    if (d.enlace && !validUrl(d.enlace)) { show('El enlace debe empezar con https://'); return; }
    if (d.mensaje.length < 10) { show('Escribe un mensaje de al menos 10 caracteres.'); return; }
    if (Date.now() - loadedAt < MIN_FILL_MS) { show('Espera unos segundos e inténtalo de nuevo.'); return; }
    if (Date.now() - lastSend() < COOLDOWN_MS) { show('Ya enviaste un mensaje hace poco. Espera un minuto e inténtalo de nuevo.'); return; }

    if (!configured()) {
      fallback(d, 'Mensaje listo. Cópialo y envíalo a ' + mail + '.');
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'Enviando…';
    fetch(ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(d)
    }).then(function () {
      markSend();
      form.reset();
      show('Mensaje enviado. Gracias, te responderemos pronto.');
    }).catch(function () {
      fallback(d, 'No pudimos enviar el mensaje desde aquí. Cópialo y mándalo a ' + mail + '.');
    }).then(function () {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Enviar mensaje';
    });
  });

  document.getElementById('copy').addEventListener('click', function () {
    function select() {
      var r = document.createRange();
      r.selectNodeContents(txt);
      var s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
      st.textContent = 'Texto seleccionado. Cópialo con Ctrl+C o Cmd+C.';
    }
    try {
      navigator.clipboard.writeText(txt.textContent).then(function () {
        st.textContent = 'Copiado. Envíalo a ' + mail + '.';
      }, select);
    } catch (err) { select(); }
  });
})();
