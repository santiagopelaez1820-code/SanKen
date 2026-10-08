// Esta línea sirve para importar la función que define la configuración de Vite.
import { defineConfig } from 'vite';
// Esta línea sirve para importar el plugin de Laravel para Vite.
import laravel from 'laravel-vite-plugin';
// Esta línea sirve para importar el plugin de Tailwind CSS para Vite.
import tailwindcss from '@tailwindcss/vite';

// Esta línea sirve para exportar la configuración de Vite.
export default defineConfig({
    // Esta línea sirve para definir los plugins.
    plugins: [
        // Esta línea sirve para activar el plugin de Laravel.
        laravel({
            // Esta línea sirve para indicar los archivos de entrada de CSS y JavaScript.
            input: ['resources/css/app.css', 'resources/js/app.js'],
            // Esta línea sirve para recargar la página al cambiar las vistas Blade.
            refresh: true,
        }),
        // Esta línea sirve para activar el plugin de Tailwind CSS.
        tailwindcss(),
    ],
    // Esta línea sirve para configurar el servidor de desarrollo.
    server: {
        // Esta línea sirve para configurar la vigilancia de archivos.
        watch: {
            // Esta línea sirve para ignorar las vistas compiladas de Laravel.
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
