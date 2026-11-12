# CausalDiagram Studio

Editor web modular para crear, explorar, editar y exportar diagramas causales de dinámica de sistemas. Está construido con HTML5, CSS3 y JavaScript ES Modules; Cytoscape.js se encarga del grafo y no se necesita un servidor de aplicación ni una base de datos remota.

## Funciones implementadas

- Entrada rápida por texto, tabla pegada desde Excel/Sheets y descripción en lenguaje natural con reglas locales conservadoras.
- Vista previa y validación de datos antes de generar el grafo.
- Edición de variables y relaciones desde formularios y desde la selección del lienzo.
- Tipos de variable, color, tamaño, descripción, polaridad y retardo temporal.
- Nodos arrastrables, zoom, desplazamiento, cuadrícula y distribuciones circular, fuerza dirigida, jerárquica, concéntrica y manual.
- Identificación de ciclos simples dirigidos con algoritmo de componentes fuertemente conexas (Tarjan) y enumeración limitada. Un número par de signos negativos genera R; un número impar genera B.
- Resaltado de ciclos y marcadores R/B en el lienzo.
- Plantillas editables de población, empresa, vivienda, recursos, oferta y demanda, contaminación, infraestructura tecnológica, educación, salud y producción.
- Autoguardado local, biblioteca de proyectos, duplicación, importación y exportación JSON.
- Exportación PNG, SVG y PDF A4.
- Diseño adaptable para escritorio, tablet y móvil.

## Estructura

```text
CausalDiagram-Studio/
├── index.html
├── 404.html
├── manifest.json
├── robots.txt
├── sitemap.xml
├── README.md
├── package.json
├── assets/
│   ├── css/                 # estilos separados por responsabilidad
│   ├── images/              # favicon
│   └── js/
│       ├── app.js           # integración de interfaz y eventos
│       ├── state.js         # estado central del proyecto
│       ├── modules/         # grafo, parsers, ciclos, plantillas, exportación...
│       └── utils/           # constantes y utilidades
└── tests/                   # pruebas unitarias Node.js
```

## Ejecutar localmente

Los módulos ES deben servirse desde un origen HTTP; no abras `index.html` directamente con `file://`.

Con Python instalado, desde la carpeta del proyecto:

```bash
python -m http.server 8080
```

Abre `http://localhost:8080` en el navegador.

También se pueden ejecutar las pruebas unitarias con Node.js 18 o superior:

```bash
npm test
npm run check
```

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub, por ejemplo `CausalDiagram-Studio`.
2. Copia el contenido de esta carpeta en la raíz del repositorio (el archivo `index.html` debe quedar en la raíz).
3. Sube los archivos a la rama `main`.
4. En el repositorio entra en **Settings → Pages**.
5. En **Build and deployment**, selecciona **Deploy from a branch**.
6. Selecciona la rama `main` y la carpeta `/ (root)`, y guarda.
7. Espera a que GitHub Pages publique el sitio y abre la URL que GitHub muestra en la sección Pages.

La app usa rutas relativas para CSS, JavaScript, favicon y manifest, por lo que puede publicarse en una ruta de proyecto como `https://usuario.github.io/nombre-repositorio/` sin configurar un `base` de compilación.

### SEO y dominio

- `index.html` incluye title, meta description y Open Graph.
- `robots.txt` permite el rastreo.
- `sitemap.xml` contiene un marcador que debes reemplazar por la URL real de GitHub Pages o tu dominio personalizado.
- No se ha inventado un dominio de producción ni una URL canonical. Cuando tengas una URL definitiva, añade la etiqueta `link rel="canonical"` en `index.html`, actualiza el sitemap y agrega la URL del sitemap a `robots.txt`.
- GitHub Pages sirve HTTPS automáticamente en el dominio `github.io`.

## Uso de datos y privacidad

Los proyectos se guardan en IndexedDB del navegador. Si IndexedDB no está disponible, se utiliza LocalStorage como alternativa. Los datos no se envían a un servidor. Para trasladar un modelo a otro equipo utiliza **Exportar → JSON** e impórtalo en el otro navegador.

Las bibliotecas Cytoscape.js, Lucide y jsPDF se cargan desde CDN; el primer acceso requiere conexión a Internet. Los datos del diagrama siguen siendo locales.

## Alcance y notas técnicas

- El parser de texto reconoce líneas `A -> B (+)` o `A -> B (-)` y secciones `Variables:` y `Relaciones:`.
- El parser de tablas acepta tabulaciones o barras verticales y espera las columnas origen, destino y polaridad.
- El parser en lenguaje natural es una ayuda heurística en español, no un modelo de IA. Sus resultados deben comprobarse antes de utilizarlos académicamente; las frases no reconocidas se informan al usuario.
- Los ciclos se enumeran como ciclos simples dirigidos. En grafos densos el resultado se limita a 250 ciclos para mantener la interfaz responsiva.
- Los signos de polaridad describen el sentido de influencia (ceteris paribus), no el valor instantáneo de la variable.
- La exportación PDF compone el diagrama como imagen PNG dentro de una página A4; para edición vectorial utiliza SVG.
- No hay autenticación ni sincronización entre dispositivos porque la aplicación es estática y no utiliza backend.

## Licencias de dependencias

La aplicación carga Cytoscape.js, Lucide y jsPDF desde sus CDNs públicos. Revisa las licencias y versiones de esas dependencias antes de distribuir una copia modificada o alojarlas localmente.
