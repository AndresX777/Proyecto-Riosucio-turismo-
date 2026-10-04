// ===== Cambio de idioma ES/EN =====

// Leemos el idioma guardado anteriormente (si existe), o usamos español por defecto
let idiomaActual = localStorage.getItem('idioma') || 'es';

// Buscamos el botón de idioma
const botonIdioma = document.getElementById('lang-toggle');

// Función que aplica el idioma a todos los elementos con data-es / data-en
function aplicarIdioma(idioma) {
  const elementos = document.querySelectorAll('[data-es][data-en]');

  elementos.forEach((el) => {
    el.textContent = el.getAttribute(`data-${idioma}`);
  });

  // Actualizamos el texto del botón (muestra el idioma AL QUE VAS A CAMBIAR)
  botonIdioma.textContent = idioma === 'es' ? 'EN' : 'ES';

  // Actualizamos el atributo lang del <html> (buena práctica de accesibilidad)
  document.documentElement.lang = idioma;

  idiomaActual = idioma;

  // Guardamos la preferencia para que se mantenga al cambiar de página
  localStorage.setItem('idioma', idioma);
}

// Evento de clic en el botón
botonIdioma.addEventListener('click', () => {
  const nuevoIdioma = idiomaActual === 'es' ? 'en' : 'es';
  aplicarIdioma(nuevoIdioma);
});

// Al cargar cada página, aplicamos el idioma guardado (si no es español, que es el default del HTML)
if (idiomaActual !== 'es') {
  aplicarIdioma(idiomaActual);
}

// ===== Botón Guardar (favorito) en páginas de detalle =====
const botonGuardar = document.querySelector('.save-btn');

if (botonGuardar) {
  const idExperiencia = botonGuardar.dataset.id;
  const guardados = JSON.parse(localStorage.getItem('favoritos') || '[]');

  if (guardados.includes(idExperiencia)) {
    botonGuardar.classList.add('guardado');
    botonGuardar.textContent = '★ Guardado';
  }

  botonGuardar.addEventListener('click', () => {
    let lista = JSON.parse(localStorage.getItem('favoritos') || '[]');

    if (lista.includes(idExperiencia)) {
      lista = lista.filter(id => id !== idExperiencia);
      botonGuardar.classList.remove('guardado');
      botonGuardar.textContent = '☆ Guardar';
    } else {
      lista.push(idExperiencia);
      botonGuardar.classList.add('guardado');
      botonGuardar.textContent = '★ Guardado';
    }

    localStorage.setItem('favoritos', JSON.stringify(lista));
  });
}

// ===== Galería de imágenes (detalle de experiencia) =====
const galeria = document.querySelector('.gallery');

if (galeria) {
  const imagenes = JSON.parse(galeria.dataset.images);
  const imgPrincipal = galeria.querySelector('.gallery-main-img');
  const contenedorThumbs = galeria.querySelector('.gallery-thumbs');
  const contador = galeria.querySelector('.gallery-counter');
  const btnPrev = galeria.querySelector('.gallery-arrow.prev');
  const btnNext = galeria.querySelector('.gallery-arrow.next');

  let indiceActual = 0;

  function mostrarImagen(indice) {
    indiceActual = indice;
    imgPrincipal.src = imagenes[indice];
    contador.textContent = `${indice + 1}/${imagenes.length}`;

    contenedorThumbs.querySelectorAll('img').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === indice);
    });
  }

  // Generar miniaturas
  imagenes.forEach((ruta, i) => {
    const thumb = document.createElement('img');
    thumb.src = ruta;
    thumb.alt = `Miniatura ${i + 1}`;
    thumb.addEventListener('click', () => mostrarImagen(i));
    contenedorThumbs.appendChild(thumb);
  });

  // Flechas
  btnPrev.addEventListener('click', () => {
    const nuevoIndice = (indiceActual - 1 + imagenes.length) % imagenes.length;
    mostrarImagen(nuevoIndice);
  });

  btnNext.addEventListener('click', () => {
    const nuevoIndice = (indiceActual + 1) % imagenes.length;
    mostrarImagen(nuevoIndice);
  });

  // Si solo hay 1 imagen, ocultamos flechas y miniaturas (no tiene sentido navegar)
  if (imagenes.length <= 1) {
    btnPrev.style.display = 'none';
    btnNext.style.display = 'none';
    contador.style.display = 'none';
    contenedorThumbs.style.display = 'none';
  }

  // Mostrar la primera imagen al cargar
  mostrarImagen(0);
}

// ===== Botón de regreso dinámico (páginas compartidas entre subsecciones) =====
const navRegreso = document.getElementById('nav-regreso');

if (navRegreso) {
  const params = new URLSearchParams(window.location.search);
  const origen = params.get('desde');

  if (origen === 'sitios') {
    navRegreso.innerHTML = `
      <a href="sitios-historicos.html" class="btn-pill btn-pill-sm btn-pill-outline" data-es="← Sitios Históricos" data-en="← Historical Sites">← Sitios Históricos</a>
    `;
  } else {
    // Por defecto (o si viene de "tradiciones")
    navRegreso.innerHTML = `
      <a href="tradiciones.html" class="btn-pill btn-pill-sm btn-pill-outline" data-es="← Tradiciones y Carnaval" data-en="← Traditions and Carnival">← Tradiciones y Carnaval</a>
    `;
  }

  // Re-aplicar el idioma actual a los textos recién insertados
  const elementosNav = navRegreso.querySelectorAll('[data-es][data-en]');
  elementosNav.forEach((el) => {
    el.textContent = el.getAttribute(`data-${idiomaActual}`);
  });
}
