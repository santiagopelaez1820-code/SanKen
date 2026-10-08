# Esta línea sirve para indicar que el script se ejecuta con bash.
#!/bin/bash
# Guarda las credenciales de Cloudinary en el .env del backend (WSL) sin
# mostrarlas en pantalla ni dejarlas en el historial del shell.
#   wsl -e bash /mnt/c/.../SanKen/scripts/cloudinary/set-credentials.sh
# Por defecto escribe en ~/sanken/api/.env; se puede pasar otra ruta.
# Esta línea sirve para abortar ante errores, variables sin definir y fallos en tuberías.
set -euo pipefail

# Esta línea sirve para definir el archivo .env a modificar, por defecto el de la API en WSL.
ENV_FILE="${1:-$HOME/sanken/api/.env}"
# Esta línea sirve para salir con error si el archivo no existe.
[ -f "$ENV_FILE" ] || { echo "No existe $ENV_FILE"; exit 1; }

# Esta línea sirve para pedir el nombre de la nube de Cloudinary.
read -rp "Cloud name: " CLOUD_NAME
# Esta línea sirve para pedir la clave de API.
read -rp "API Key: " API_KEY
# Esta línea sirve para pedir el secreto de API sin mostrarlo en pantalla.
read -rsp "API Secret (no se muestra): " API_SECRET
# Esta línea sirve para imprimir un salto de línea tras la entrada oculta.
echo

# Esta línea sirve para recorrer los tres valores ingresados.
for v in "$CLOUD_NAME" "$API_KEY" "$API_SECRET"; do
  # Esta línea sirve para salir con error si alguno está vacío.
  [ -n "$v" ] || { echo "Ningún valor puede quedar vacío."; exit 1; }
done

# Esta línea sirve para crear una copia de seguridad del .env.
cp "$ENV_FILE" "$ENV_FILE.bak-cloudinary"
# Quita definiciones previas de estas variables y agrega las nuevas al final.
# Esta línea sirve para quitar del .env las definiciones previas de Cloudinary.
grep -vE '^(MEDIA_STORAGE|CLOUDINARY_CLOUD_NAME|CLOUDINARY_API_KEY|CLOUDINARY_API_SECRET|CLOUDINARY_FOLDER)=' "$ENV_FILE.bak-cloudinary" > "$ENV_FILE"
# Esta línea sirve para abrir el grupo que agrega las variables nuevas.
{
  # Esta línea sirve para agregar una línea en blanco.
  echo ""
  # Esta línea sirve para agregar el comentario que explica la configuración.
  echo "# Cloudinary (ver docs/CLOUDINARY.md). MEDIA_STORAGE=local hasta verificar la migración."
  # Esta línea sirve para dejar el almacenamiento en local hasta verificar la migración.
  echo "MEDIA_STORAGE=local"
  # Esta línea sirve para agregar el nombre de la nube.
  echo "CLOUDINARY_CLOUD_NAME=$CLOUD_NAME"
  # Esta línea sirve para agregar la clave de API.
  echo "CLOUDINARY_API_KEY=$API_KEY"
  # Esta línea sirve para agregar el secreto de API.
  echo "CLOUDINARY_API_SECRET=$API_SECRET"
  # Esta línea sirve para agregar la carpeta de Cloudinary.
  echo "CLOUDINARY_FOLDER=sanken"
# Esta línea sirve para cerrar el grupo y anexar todo al final del .env.
} >> "$ENV_FILE"
# Esta línea sirve para restringir los permisos de los archivos a su dueño.
chmod 600 "$ENV_FILE" "$ENV_FILE.bak-cloudinary"

# Esta línea sirve para avisar que las credenciales fueron guardadas.
echo "Listo: credenciales guardadas en $ENV_FILE (copia previa en $ENV_FILE.bak-cloudinary)."
