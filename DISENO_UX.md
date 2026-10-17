# Rediseño del portafolio

El visitante puede identificar quién es Santiago, leer su presentación personal en Inicio, explorar sus proyectos y elegir un canal de contacto. Se conservan los datos académicos, la experiencia, las imágenes y los enlaces originales.

| Criterio | Aplicación |
| --- | --- |
| Krug: claridad | Cuatro destinos con etiquetas visibles y página actual identificada. Un título principal por página. |
| Krug: decisiones sencillas | Inicio prioriza “Ver mis proyectos”; cada proyecto enlaza directamente a su repositorio. |
| Krug: textos breves | Presentación concisa y contenido agrupado por propósito. |
| Hick-Hyman | Navegación limitada a Inicio, Experiencia, Proyectos y Contacto. Filtros y búsqueda solo en Proyectos. |
| Fitts | Botones, navegación, filtros y contactos con altura mínima de 44 px. |
| Jakob | Marca enlazada al inicio, enlaces reconocibles y campos convencionales. |
| Gestalt | Proximidad, espacios consistentes y estilos compartidos para contenidos relacionados. |
| Nielsen | Carga y error de imágenes, resultados y estado vacío, validación por campo, foco en errores y confirmación de borrador preparado. |
| Reconocimiento | Etiquetas persistentes, ejemplos de formato y borrador recuperable en la misma pestaña. |
| Consistencia | Variables compartidas para color, tipografía, superficies, espaciado y controles. |
| Accesibilidad | Idioma español, enlace para saltar al contenido, foco visible, alternativas de imágenes, regiones de estado y mensajes que no dependen solo del color. |
| Movimiento | Transiciones breves, sin contenido oculto por animaciones; respeto de prefers-reduced-motion. |

## Distribución y tema

- En escritorio y tableta de más de 760 px, la ficha y su fila de contactos aparecen juntas a la izquierda y permanecen visibles mediante position: sticky. La tarjeta no tiene scroll interno; si no cabe completa en una ventana muy baja, pasa al flujo normal de la página.
- En móvil, la ficha se integra al principio del contenido para dejar espacio de lectura. Los accesos a correo, LinkedIn, GitHub y WhatsApp se agrupan en una única fila debajo de la tarjeta personal, con etiquetas visibles. WhatsApp utiliza el número ecuatoriano 0989501125 (enlace internacional +593 98 950 1125). Se retiraron las copias de la ficha, el pie y Contacto.
- El selector claro/oscuro sigue inicialmente la preferencia del sistema y conserva la elección manual entre páginas mediante localStorage.
- Las fuentes son del sistema y los iconos son SVG incluidos en el HTML. No se necesitan fuentes ni librerías externas.

Inicio contiene únicamente la presentación y un enlace a Proyectos. La formación se encuentra en Experiencia y los proyectos completos en su propia página.

El botón Descargar CV está junto al selector de tema en las cuatro páginas. Descarga docs/CV-Santiago-De-La-Cruz.pdf, de una página, generado a partir de los datos del portafolio. Su fuente editable está en docs/cv.html.

## Contacto y estados

El formulario prepara un enlace mailto. El visitante abre su aplicación de correo y confirma el envío allí. La página no tiene un servicio de envío ni anuncia que un mensaje haya sido enviado.

Los tres campos tienen validación; el foco va al primer error. El borrador se conserva en sessionStorage dentro de la pestaña. Al editarlo, se invalida el correo preparado para evitar enviar una versión anterior. Si falla el portapapeles, aparece un campo seleccionable para copiar manualmente.

Sin JavaScript siguen disponibles el contenido, la navegación y los enlaces de contacto; se ocultan los controles que requieren scripts.

## Verificación

Comprobación en Microsoft Edge sin interfaz visible: las cuatro páginas en anchos de 320, 390, 768, 1024 y 1440 px; ausencia de desplazamiento horizontal, tamaño de controles, referencias ARIA, contraste de texto secundario y controles principales en ambos temas, posición lateral y comportamiento del formulario y los filtros. Se revisó también una captura de escritorio.

Estas comprobaciones técnicas no sustituyen una evaluación con usuarios ni una auditoría completa de accesibilidad.