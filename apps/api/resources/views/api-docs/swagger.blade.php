{{--
    Renderer "swagger" de Scramble (ver config/scramble.php): muestra con
    Swagger UI el OpenAPI que Scramble genera. Scramble le pasa $spec (el
    documento como array) y $config; las opciones de SwaggerUIBundle salen de
    config('scramble.renderers.swagger'). Swagger UI va fijado a una versión
    con SRI: si se actualiza, recalcular los hashes de ambos archivos.
--}}
{{-- Esta línea sirve para declarar que el documento es HTML5. --}}
<!doctype html>
{{-- Esta línea sirve para declarar el idioma español. --}}
<html lang="es">
{{-- Esta línea sirve para abrir la cabecera de la página. --}}
<head>
    {{-- Esta línea sirve para declarar la codificación UTF-8. --}}
    <meta charset="utf-8">
    {{-- Esta línea sirve para hacer que la página se adapte al ancho del celular. --}}
    <meta name="viewport" content="width=device-width, initial-scale=1">
    {{-- Esta línea sirve para poner como título el configurado en Scramble (o el nombre de la app). --}}
    <title>{{ $config->get('ui.title') ?? config('app.name').' - API Docs' }}</title>
    {{-- Esta línea sirve para cargar los estilos de Swagger UI desde jsDelivr. --}}
    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.33.1/swagger-ui.css"
          integrity="sha384-Ov4/wv3j2bmct8cDc5X4ngJZohVPzEmc6uDPH8WeljUxO5vtoykvMEfbu9Vh6RaW"
          crossorigin="anonymous">
    {{-- Esta línea sirve para abrir los estilos propios. --}}
    <style>
        {{-- Esta línea sirve para quitar el margen del body y poner fondo claro. --}}
        body { margin: 0; background: #fafafa; }
    </style>
{{-- Esta línea sirve para cerrar la cabecera. --}}
</head>
{{-- Esta línea sirve para abrir el cuerpo de la página. --}}
<body>
{{-- Esta línea sirve para crear el contenedor donde Swagger UI dibuja la documentación. --}}
<div id="swagger-ui"></div>

{{-- Esta línea sirve para cargar el script de Swagger UI desde jsDelivr verificando su hash. --}}
<script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.33.1/swagger-ui-bundle.js"
        integrity="sha384-ZPehFMQommnnuaZ4rpxgkgTT2DKFVp4hZC/7pLit+9Lek9T1YGSo23eHFbvNkXkw"
        crossorigin="anonymous"></script>
{{-- Esta línea sirve para abrir el script que arranca Swagger UI. --}}
<script>
    {{-- Esta línea sirve para pasar el documento OpenAPI a JavaScript. --}}
    const spec = @json($spec);

    // Swagger UI renderiza Markdown con `breaks: true` (cada salto de línea
    // simple se vuelve <br>), pero las descripciones vienen de PHPDoc cortado
    // a ~75 columnas. Se unen esas líneas como haría CommonMark, sin tocar
    // párrafos, listas, títulos ni tablas.
    {{-- Esta línea sirve para declarar la función que une las líneas cortadas de una descripción. --}}
    const unwrapLines = (text) => text.includes('```')
        {{-- Esta línea sirve para dejar sin cambios los textos con bloques de código. --}}
        ? text
        {{-- Esta línea sirve para unir las líneas simples sin tocar párrafos, listas, títulos ni tablas. --}}
        : text.replace(/([^\n])\n(?![ \t]*(?:\n|[-*+>]\s|#|\||\d+[.)]\s))[ \t]*/g, '$1 ');

    {{-- Esta línea sirve para declarar la función que recorre el documento aplicando esa unión. --}}
    const unwrapDescriptions = (node) => {
        {{-- Esta línea sirve para revisar si el nodo es una lista. --}}
        if (Array.isArray(node)) {
            {{-- Esta línea sirve para recorrer cada elemento. --}}
            node.forEach(unwrapDescriptions);
        {{-- Esta línea sirve para revisar si el nodo es un objeto. --}}
        } else if (node && typeof node === 'object') {
            {{-- Esta línea sirve para recorrer sus propiedades. --}}
            for (const [key, value] of Object.entries(node)) {
                {{-- Esta línea sirve para revisar si la propiedad es una descripción de texto. --}}
                if (key === 'description' && typeof value === 'string') {
                    {{-- Esta línea sirve para reemplazarla por la versión con las líneas unidas. --}}
                    node[key] = unwrapLines(value);
                {{-- Esta línea sirve para seguir bajando por el resto de propiedades. --}}
                } else {
                    {{-- Esta línea sirve para recorrer el valor. --}}
                    unwrapDescriptions(value);
                }
            }
        }
    };

    {{-- Esta línea sirve para unir las líneas de todas las descripciones del documento. --}}
    unwrapDescriptions(spec);

    // Los servidores se arman con url() del request. Detrás de un túnel HTTPS
    // (ngrok) Laravel los genera como http://, y el navegador bloquea esas
    // llamadas desde una página https (mixed content): si apuntan a este
    // mismo host, se usan con el origen de esta página.
    {{-- Esta línea sirve para corregir las URLs de los servidores. --}}
    spec.servers = (spec.servers ?? []).map((server) => {
        {{-- Esta línea sirve para interpretar la URL del servidor. --}}
        const url = new URL(server.url, window.location.href);

        {{-- Esta línea sirve para usar el origen de esta página si la URL apunta al mismo host. --}}
        return url.hostname === window.location.hostname
            {{-- Esta línea sirve para cambiar solo el origen y conservar la ruta. --}}
            ? { ...server, url: window.location.origin + url.pathname }
            {{-- Esta línea sirve para dejar igual los servidores de otros hosts. --}}
            : server;
    });

    // Desde esta página en local, Sanctum trata las requests como de la SPA
    // (dominio "stateful") y exige CSRF en POST/PATCH/DELETE: se reenvía el
    // XSRF-TOKEN que dejó el grupo `web` al servir la documentación.
    {{-- Esta línea sirve para declarar la función que lee el token XSRF de la cookie. --}}
    const xsrfToken = () => {
        {{-- Esta línea sirve para buscar la cookie XSRF-TOKEN. --}}
        const cookie = document.cookie.split('; ').find((c) => c.startsWith('XSRF-TOKEN='));

        {{-- Esta línea sirve para devolver su valor decodificado, o null si no existe. --}}
        return cookie ? decodeURIComponent(cookie.substring('XSRF-TOKEN='.length)) : null;
    };

    {{-- Esta línea sirve para arrancar Swagger UI y guardarlo en window.ui. --}}
    window.ui = SwaggerUIBundle({
        {{-- Esta línea sirve para pasar las opciones configuradas en Scramble. --}}
        ...@json((object) $config->renderer()->all()),
        {{-- Esta línea sirve para pasar el documento OpenAPI. --}}
        spec,
        {{-- Esta línea sirve para indicar dónde dibujar la documentación. --}}
        dom_id: '#swagger-ui',
        {{-- Esta línea sirve para declarar el interceptor que modifica cada petición de prueba. --}}
        requestInterceptor: (request) => {
            {{-- Esta línea sirve para leer el token XSRF. --}}
            const token = xsrfToken();

            {{-- Esta línea sirve para revisar si hay token. --}}
            if (token) {
                {{-- Esta línea sirve para agregar el encabezado X-XSRF-TOKEN a la petición. --}}
                request.headers['X-XSRF-TOKEN'] = token;
            }

            {{-- Esta línea sirve para devolver la petición modificada. --}}
            return request;
        },
    });
{{-- Esta línea sirve para cerrar el script. --}}
</script>
{{-- Esta línea sirve para cerrar el cuerpo de la página. --}}
</body>
{{-- Esta línea sirve para cerrar el documento HTML. --}}
</html>
