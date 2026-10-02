/* =========================================================
   SEGURIDAD LABORAL - Clínica Dental Hye
   Lógica de la aplicación: datos de protocolos, documentos
   y navegación entre vistas. Sin dependencias externas.

   Para modificar un protocolo: edita el texto dentro de PROTOCOLOS.
   Para agregar/quitar un documento: edita el arreglo DOCUMENTOS.
   Ver README.md para instrucciones detalladas.
   ========================================================= */

(function () {
  "use strict";

  var PENDIENTE = "INFORMACIÓN PENDIENTE DE VALIDACIÓN POR LA INSTITUCIÓN";

  // ---------------------------------------------------------
  // Categorías mostradas en la pantalla principal
  // ---------------------------------------------------------
  var CATEGORIAS = [
    { id: "emergencias", icono: "🚨", texto: "Emergencias", urgente: true },
    { id: "incendio", icono: "🧯", texto: "Incendio" },
    { id: "riesgo-electrico", icono: "⚡", texto: "Riesgo eléctrico" },
    { id: "primeros-auxilios", icono: "🩹", texto: "Primeros auxilios" },
    { id: "evacuacion", icono: "🏃", texto: "Evacuación" },
    { id: "prevencion", icono: "⚠️", texto: "Prevención de accidentes" },
    { id: "epp", icono: "🦺", texto: "Equipo de protección personal" },
    { id: "sustancias-peligrosas", icono: "☣️", texto: "Sustancias peligrosas" },
    { id: "punto-encuentro", icono: "📍", texto: "Punto de encuentro" },
    { id: "contactos-emergencia", icono: "📞", texto: "Contactos de emergencia" }
  ];

  // ---------------------------------------------------------
  // Contenido de cada protocolo.
  // Fuente: Plan de Emergencia y Evacuación - Clínica Dental Hye.
  // Los puntos marcados como PENDIENTE no estaban especificados
  // en el documento oficial entregado y deben completarse con la
  // institución antes de publicar la versión definitiva.
  // ---------------------------------------------------------
  var PROTOCOLOS = {

    "emergencias": {
      titulo: "🚨 Emergencias",
      html:
        bloqueInfo("Procedimiento general ante una emergencia", [
          "1. Detectar: identificar la situación de emergencia.",
          "2. Alertar: informar inmediatamente al responsable de emergencia y a las personas presentes.",
          "3. Evaluar: determinar rápidamente el nivel de peligro.",
          "4. Actuar: aplicar el procedimiento específico correspondiente.",
          "5. Evacuar: cuando exista riesgo para las personas, abandonar ordenadamente las instalaciones utilizando las vías de evacuación.",
          "6. Dirigirse a la zona segura: permanecer en el punto de encuentro establecido.",
          "7. Solicitar ayuda externa: contactar a los organismos de emergencia correspondientes cuando sea necesario.",
          "8. Verificar: comprobar, en la medida de lo posible y sin exponerse al peligro, que trabajadores y pacientes hayan evacuado."
        ]) +
        bloqueInfo("Organización y roles", [
          "Responsable de Emergencia (Jefatura Administrativa): lidera la respuesta general y coordina la evacuación y la comunicación con organismos externos.",
          "Encargado de Emergencias: activa el plan de emergencia, coordina las acciones de evacuación y verifica que los procedimientos se ejecuten correctamente.",
          "Encargado de Evacuación: guía a los trabajadores hacia las zonas seguras y verifica que no queden personas en las áreas evacuadas.",
          "Brigada de Primeros Auxilios: brinda atención inicial a lesionados y coordina el traslado a centros asistenciales cuando sea necesario.",
          "Trabajadores: cumplen las instrucciones de evacuación y mantienen conductas seguras durante la emergencia."
        ]) +
        bloquePendiente("Nombres y teléfonos directos de las personas asignadas a cada rol")
    },

    "incendio": {
      titulo: "🧯 Incendio",
      html:
        bloqueHacer("Antes (prevención)", [
          "Mantener las vías de evacuación despejadas.",
          "Mantener los extintores accesibles y señalizados.",
          "Realizar inspecciones periódicas de los equipos contra incendio.",
          "Capacitar a los trabajadores en uso y manejo de extintores.",
          "Conocer las vías de evacuación.",
          "Evitar sobrecargar enchufes y extensiones eléctricas."
        ]) +
        bloqueHacer("Durante (ante detección de humo o fuego)", [
          "Mantener la calma.",
          "Dar aviso inmediatamente e informar al responsable de emergencia.",
          "Evaluar si se trata de un amago de incendio y si puede controlarse de forma segura.",
          "Utilizar el extintor adecuado únicamente si está capacitado para ello.",
          "Evacuar a trabajadores y pacientes si el fuego aumenta o no puede controlarse.",
          "Cerrar puertas, si es posible y seguro, para limitar la propagación del humo y el fuego.",
          "Dirigirse a la zona de seguridad.",
          "Solicitar apoyo de Bomberos (132)."
        ]) +
        bloqueNoHacer([
          "No intentar combatir el fuego si aumenta o no puede controlarse de forma segura.",
          "No ingresar nuevamente a la clínica hasta que sea autorizado."
        ]) +
        bloqueInfo("Después", [
          "Informar cualquier persona lesionada o desaparecida.",
          "Registrar el evento.",
          "Realizar una investigación para determinar causas y medidas correctivas."
        ]) +
        bloqueMapa()
    },

    "riesgo-electrico": {
      titulo: "⚡ Riesgo eléctrico",
      html:
        bloqueInfo("Procedimiento ante corte de energía eléctrica", [
          "Mantener la calma.",
          "Suspender temporalmente los procedimientos que dependan de energía eléctrica.",
          "Desconectar equipos cuando sea seguro hacerlo.",
          "Mantener a pacientes y trabajadores en lugares seguros.",
          "Utilizar iluminación de emergencia o linternas disponibles.",
          "Informar a la administración.",
          "Restablecer las actividades únicamente cuando existan condiciones seguras."
        ]) +
        bloqueNoHacer([
          "No manipular instalaciones eléctricas dañadas."
        ])
    },

    "primeros-auxilios": {
      titulo: "🩹 Primeros auxilios",
      html:
        bloqueInfo("Procedimiento ante emergencia médica", [
          "Este punto es especialmente relevante en una clínica dental, ya que durante la atención puede producirse una descompensación, desmayo, reacción adversa u otra emergencia médica.",
          "Mantener la calma y suspender inmediatamente el procedimiento odontológico.",
          "Evaluar el estado de la persona y solicitar ayuda al personal de la clínica.",
          "Aplicar primeros auxilios de acuerdo con la capacitación recibida.",
          "Solicitar asistencia médica cuando corresponda (SAMU 131).",
          "Mantener despejada el área.",
          "Registrar el evento y realizar seguimiento y evaluación posterior."
        ]) +
        bloqueNoHacer([
          "No administrar medicamentos que no estén indicados dentro de los procedimientos establecidos."
        ]) +
        bloqueInfo("Técnica de rescate: protocolo P.A.S.", [
          "Proteger: proteger primero la propia integridad física (\"el primero yo\"), verificar que el área sea segura y asegurarla para que no ingresen personas que puedan empeorar la situación; luego proteger a la persona accidentada.",
          "Avisar: informar de inmediato a los números de emergencia, indicando el lugar del accidente, la cantidad de personas afectadas, la gravedad visible de las heridas y la evolución del accidentado.",
          "Socorrer: si se cuenta con los conocimientos, intervenir al accidentado mientras se espera al personal de salud y rescate; si no, solo contener a la persona ayudándola a mantener la calma."
        ])
    },

    "evacuacion": {
      titulo: "🏃 Evacuación",
      html:
        bloqueInfo("Durante la evacuación", [
          "Mantener la calma.",
          "Seguir las señalizaciones y las instrucciones del encargado de evacuación.",
          "Ayudar a pacientes y personas con movilidad reducida.",
          "Utilizar las salidas y vías de evacuación establecidas.",
          "Dirigirse directamente a la zona de seguridad.",
          "Permanecer en el punto de encuentro hasta recibir instrucciones."
        ]) +
        bloqueNoHacer([
          "No correr.",
          "No gritar.",
          "No empujar.",
          "No devolverse a buscar objetos personales.",
          "No bloquear las salidas.",
          "No utilizar el ascensor durante una emergencia cuando exista riesgo de incendio, corte eléctrico u otra condición insegura."
        ]) +
        bloqueInfo("Condiciones de las vías de evacuación", [
          "Mantenerse despejadas y libres de materiales, muebles u otros obstáculos.",
          "Contar con señalización visible que indique la dirección de evacuación.",
          "Las salidas de emergencia deben permanecer accesibles y sin bloqueo.",
          "Los trabajadores deben conocer previamente las rutas y salidas disponibles."
        ]) +
        bloqueMapa() +
        bloqueMapaEvacuacion()
    },

    "prevencion": {
      titulo: "⚠️ Prevención de accidentes",
      html:
        bloqueInfo("Medidas generales de prevención", [
          "Mantener las vías de evacuación despejadas, señalizadas y libres de obstáculos en todo momento.",
          "Mantener los extintores accesibles, señalizados e inspeccionados periódicamente.",
          "Capacitar al personal en evacuación, uso de extintores y primeros auxilios.",
          "Evitar sobrecargar enchufes y extensiones eléctricas.",
          "Realizar simulacros y revisiones periódicas del plan de emergencia."
        ]) +
        bloquePendiente("Procedimientos específicos de prevención por área de trabajo (consultorios, pabellón de cirugía menor, esterilización, etc.)")
    },

    "epp": {
      titulo: "🦺 Equipo de protección personal",
      html: bloquePendiente("El plan de emergencia entregado no detalla los elementos de protección personal (EPP) exigidos por puesto de trabajo. Esta sección debe completarse con el protocolo interno de la clínica.")
    },

    "sustancias-peligrosas": {
      titulo: "☣️ Sustancias peligrosas",
      html:
        bloqueInfo("Definición", [
          "Son materiales que, por sus características químicas o físicas, pueden causar daños a la salud de las personas, al medio ambiente o a la propiedad. Pueden ser tóxicas, corrosivas, inflamables, reactivas, infecciosas o radiactivas, y se presentan como líquidos, gases o sólidos."
        ]) +
        bloqueInfo("Procedimiento ante fuga de gas o sustancia peligrosa", [
          "Alejar a las personas del área.",
          "Ventilar solamente si puede realizarse de manera segura.",
          "Informar inmediatamente al responsable.",
          "Evacuar si existe riesgo.",
          "Solicitar asistencia especializada."
        ]) +
        bloqueNoHacer([
          "No encender ni apagar interruptores eléctricos.",
          "No utilizar llamas abiertas.",
          "No regresar hasta que se determine que el lugar es seguro."
        ])
    },

    "punto-encuentro": {
      titulo: "📍 Punto de encuentro",
      html:
        bloqueInfo("Zona segura y punto de encuentro", [
          "Zona segura: parque ubicado en Av. Nataniel Cox, entre Av. Libertador Bernardo O'Higgins y P. Bulnes.",
          "Una vez fuera de la clínica, todas las personas deben dirigirse directamente a este punto de encuentro y permanecer allí hasta recibir instrucciones del encargado de emergencia."
        ]) +
        bloqueMapaEvacuacion()
    },

    "contactos-emergencia": {
      titulo: "📞 Contactos de emergencia",
      html:
        telefono("Ambulancia / SAMU", "Servicio de Atención Médico de Urgencia", "131") +
        telefono("Bomberos", "Incendios y rescate", "132") +
        telefono("Carabineros", "Seguridad y orden público", "133") +
        telefono("PDI", "Policía de Investigaciones", "134") +
        telefono("Cuerpo de Socorro Andino", "Rescate en montaña / condiciones especiales", "136") +
        bloquePendiente("Teléfono directo de recepción/administración de la Clínica Dental Hye y datos de contacto de los responsables internos de emergencia")
    }
  };

  // ---------------------------------------------------------
  // Documentos de seguridad disponibles para descarga/consulta
  // ---------------------------------------------------------
  var DOCUMENTOS = [
    {
      nombre: "Plan de Emergencia y Evacuación — Clínica Dental Hye",
      descripcion: "Documento oficial completo: objetivos, roles, procedimientos por tipo de emergencia, vías de evacuación, comunicaciones y números de emergencia.",
      archivoWord: "assets/documents/plan-de-emergencia-clinica-dental-hye.docx",
      archivoPdf: null
    }
  ];

  // ---------------------------------------------------------
  // Helpers de construcción de HTML para los protocolos
  // ---------------------------------------------------------
  function escapar(texto) {
    var div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
  }

  function listaItems(items) {
    return items.map(function (item) { return "<li>" + escapar(item) + "</li>"; }).join("");
  }

  function bloqueInfo(titulo, items) {
    return (
      '<div class="bloque bloque--info">' +
      '<div class="bloque__titulo">ℹ️ ' + escapar(titulo) + "</div>" +
      '<ul class="lista-pasos">' + listaItems(items) + "</ul>" +
      "</div>"
    );
  }

  function bloqueHacer(titulo, items) {
    return (
      '<div class="bloque bloque--hacer">' +
      '<div class="bloque__titulo">✅ ' + escapar(titulo) + "</div>" +
      '<ul class="lista-pasos">' + listaItems(items) + "</ul>" +
      "</div>"
    );
  }

  function bloqueNoHacer(items) {
    return (
      '<div class="bloque bloque--no-hacer">' +
      '<div class="bloque__titulo">⛔ ¿Qué NO hacer?</div>' +
      '<ul class="lista-advertencias">' + listaItems(items) + "</ul>" +
      "</div>"
    );
  }

  function bloquePendiente(detalle) {
    return (
      '<div class="bloque bloque--pendiente">⚠️ ' + escapar(PENDIENTE) +
      (detalle ? "<br><span style=\"font-weight:400;\">" + escapar(detalle) + "</span>" : "") +
      "</div>"
    );
  }

  function bloqueMapa() {
    return (
      '<div class="bloque bloque--info">' +
      '<div class="bloque__titulo">🗺️ Plano de la clínica — extintores y salida de emergencia</div>' +
      '<img src="assets/img/plano-clinica-extintores.jpg" alt="Plano de la Clínica Dental Hye con la ubicación de extintores (círculos amarillos) y la salida de emergencia (franja roja)." style="border-radius:8px;border:1px solid var(--color-borde);">' +
      "</div>"
    );
  }

  function bloqueMapaEvacuacion() {
    return (
      '<div class="bloque bloque--info">' +
      '<div class="bloque__titulo">🗺️ Mapa de evacuación y zona segura</div>' +
      '<img src="assets/img/mapa-evacuacion-zona-segura.jpg" alt="Mapa con las vías de evacuación desde la Clínica Dental Hye hacia la zona segura (parque) y el punto de encuentro en Av. Nataniel Cox." style="border-radius:8px;border:1px solid var(--color-borde);">' +
      "</div>"
    );
  }

  function telefono(nombre, detalle, numero) {
    return (
      '<div class="fila-telefono">' +
      '<div class="fila-telefono__info">' +
      '<span class="fila-telefono__nombre">' + escapar(nombre) + "</span>" +
      '<span class="fila-telefono__detalle">' + escapar(detalle) + "</span>" +
      "</div>" +
      '<a class="fila-telefono__boton" href="tel:' + encodeURIComponent(numero) + '">Llamar ' + escapar(numero) + "</a>" +
      "</div>"
    );
  }

  // ---------------------------------------------------------
  // Render de la pantalla principal (tarjetas de categorías)
  // ---------------------------------------------------------
  function renderCategorias() {
    var contenedor = document.getElementById("rejilla-categorias");
    if (!contenedor) return;
    contenedor.innerHTML = CATEGORIAS.map(function (cat) {
      var claseExtra = cat.urgente ? " tarjeta-categoria--urgente" : "";
      return (
        '<button class="tarjeta-categoria' + claseExtra + '" type="button" role="listitem" data-abrir="' + cat.id + '">' +
        '<span class="tarjeta-categoria__icono" aria-hidden="true">' + cat.icono + "</span>" +
        '<span class="tarjeta-categoria__texto">' + escapar(cat.texto) + "</span>" +
        "</button>"
      );
    }).join("");
  }

  // ---------------------------------------------------------
  // Render de la sección de documentos
  // ---------------------------------------------------------
  function renderDocumentos() {
    var contenedor = document.getElementById("lista-documentos");
    if (!contenedor) return;

    if (DOCUMENTOS.length === 0) {
      contenedor.innerHTML = '<p class="seccion__ayuda">Aún no se han agregado documentos.</p>';
      return;
    }

    contenedor.innerHTML = DOCUMENTOS.map(function (doc, indice) {
      var botones = "";
      if (doc.archivoPdf) {
        botones += '<button class="boton boton--primario" type="button" data-ver-pdf="' + indice + '">👁️ Ver documento</button>';
        botones += '<a class="boton boton--secundario" href="' + doc.archivoPdf + '" download>⬇️ Descargar PDF</a>';
      }
      if (doc.archivoWord) {
        botones += '<a class="boton boton--secundario" id="enlace-word-' + indice + '" href="' + doc.archivoWord + '" download>⬇️ Descargar Word</a>';
      }
      return (
        '<div class="tarjeta-documento">' +
        '<div class="tarjeta-documento__nombre">' + escapar(doc.nombre) + "</div>" +
        '<div class="tarjeta-documento__descripcion">' + escapar(doc.descripcion) + "</div>" +
        '<div class="tarjeta-documento__acciones">' + botones + "</div>" +
        "</div>"
      );
    }).join("");

    contenedor.querySelectorAll("[data-ver-pdf]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var doc = DOCUMENTOS[Number(boton.getAttribute("data-ver-pdf"))];
        abrirDocumento(doc);
      });
    });

    // Oculta automáticamente los enlaces a archivos que no estén disponibles
    // en el entorno donde se visualice el sitio (por ejemplo, una demo que
    // no pueda servir archivos .docx). No afecta al sitio ya publicado en
    // un hosting real, donde el archivo sí se sirve correctamente.
    DOCUMENTOS.forEach(function (doc, indice) {
      if (!doc.archivoWord) return;
      var enlace = document.getElementById("enlace-word-" + indice);
      if (!enlace) return;
      fetch(doc.archivoWord, { method: "HEAD" }).then(function (respuesta) {
        if (!respuesta.ok) enlace.remove();
      }).catch(function () {
        enlace.remove();
      });
    });
  }

  // ---------------------------------------------------------
  // Navegación: abrir / cerrar vista de protocolo
  // ---------------------------------------------------------
  function abrirProtocolo(id) {
    var protocolo = PROTOCOLOS[id];
    var vista = document.getElementById("vista-protocolo");
    var titulo = document.getElementById("vista-protocolo-titulo");
    var cuerpo = document.getElementById("vista-protocolo-cuerpo");
    if (!protocolo || !vista || !titulo || !cuerpo) return;

    titulo.textContent = protocolo.titulo;
    cuerpo.innerHTML = protocolo.html;
    vista.hidden = false;
    document.body.style.overflow = "hidden";
    vista.scrollTop = 0;
    document.getElementById("boton-volver").focus();
  }

  function cerrarProtocolo() {
    var vista = document.getElementById("vista-protocolo");
    if (!vista) return;
    vista.hidden = true;
    document.body.style.overflow = "";
  }

  function abrirDocumento(doc) {
    var vista = document.getElementById("vista-documento");
    var titulo = document.getElementById("vista-documento-titulo");
    var iframe = document.getElementById("iframe-documento");
    if (!doc || !doc.archivoPdf || !vista || !titulo || !iframe) return;

    titulo.textContent = doc.nombre;
    iframe.src = doc.archivoPdf;
    vista.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function cerrarDocumento() {
    var vista = document.getElementById("vista-documento");
    var iframe = document.getElementById("iframe-documento");
    if (!vista) return;
    vista.hidden = true;
    if (iframe) iframe.src = "";
    document.body.style.overflow = "";
  }

  // ---------------------------------------------------------
  // Inicialización
  // ---------------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
    renderCategorias();
    renderDocumentos();

    document.body.addEventListener("click", function (evento) {
      var disparador = evento.target.closest("[data-abrir]");
      if (disparador) {
        evento.preventDefault();
        abrirProtocolo(disparador.getAttribute("data-abrir"));
      }
    });

    var botonVolver = document.getElementById("boton-volver");
    if (botonVolver) botonVolver.addEventListener("click", cerrarProtocolo);

    var botonVolverDoc = document.getElementById("boton-volver-documento");
    if (botonVolverDoc) botonVolverDoc.addEventListener("click", cerrarDocumento);

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape") {
        cerrarProtocolo();
        cerrarDocumento();
      }
    });
  });
})();
