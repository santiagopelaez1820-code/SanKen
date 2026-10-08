// Esta línea sirve para importar la librería axios para hacer peticiones HTTP.
import axios from 'axios';
// Esta línea sirve para dejar axios disponible en window.
window.axios = axios;

// Esta línea sirve para enviar siempre el encabezado que identifica las peticiones AJAX.
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
