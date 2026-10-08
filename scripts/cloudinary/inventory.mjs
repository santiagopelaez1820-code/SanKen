#!/usr/bin/env node
/**
 * Inventario de multimedia del monorepo SanKen (npm run cloudinary:inventory).
 *
 * Recorre los archivos del repo (git, incluidos los no rastreados que no
 * estén ignorados), busca dónde se referencia cada imagen/video y decide si
 * es candidato a Cloudinary. Escribe:
 *   scripts/cloudinary/media-inventory.json      todo, con totales
 *   scripts/cloudinary/local-assets-required.json lo que se queda local y por qué
 *
 * El multimedia de RUNTIME (avatares, Tienda, videos de ejercicios y PR) no
 * vive en el repo sino en el disco del servidor + la base de datos: eso lo
 * audita y migra `php artisan media:cloudinary` (ver docs/CLOUDINARY.md).
 * Este script solo cubre archivos que viajan con el código.
 */
// Esta línea sirve para importar «execFileSync» desde «node:child_process».
import { execFileSync } from 'node:child_process';
// Esta línea sirve para importar «readFileSync, statSync, writeFileSync» desde «node:fs».
import { readFileSync, statSync, writeFileSync } from 'node:fs';
// Esta línea sirve para importar «basename, extname, join, dirname» desde «node:path».
import { basename, extname, join, dirname } from 'node:path';
// Esta línea sirve para importar «fileURLToPath» desde «node:url».
import { fileURLToPath } from 'node:url';

// Esta línea sirve para extraer «OO» de «join(dirname(fileURLToPath(import.meta.u».
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
// Esta línea sirve para declarar «OUT_DIR» con el valor «join(ROOT, 'scripts', 'cloudinary')».
const OUT_DIR = join(ROOT, 'scripts', 'cloudinary');

// Esta línea sirve para extraer «MAGE_EX» de «new Set(['.png', '.jpg', '.jpeg', '.webp».
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico', '.avif', '.heic']);
// Esta línea sirve para extraer «IDEO_EX» de «new Set(['.mp4', '.mov', '.webm', '.m4v'».
const VIDEO_EXT = new Set(['.mp4', '.mov', '.webm', '.m4v', '.avi', '.mkv']);
// Esta línea sirve para extraer «EXT_EX» de «new Set(['.ts', '.tsx', '.js', '.jsx', '».
const TEXT_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.php', '.html', '.css', '.scss']);
// Esta línea sirve para extraer «KIP_DIR» de «['node_modules/', 'vendor/', '.git/', 's».
const SKIP_DIRS = ['node_modules/', 'vendor/', '.git/', 'scripts/cloudinary/'];

/** Recursos que deben seguir dentro de la app aunque se usen en runtime, con el motivo real. */
// Esta línea sirve para declarar «KEEP_LOCAL» con el valor «{».
const KEEP_LOCAL = {
  // Esta línea sirve para incluir el texto o las clases «apps/mobile/assets/images/logo-full.png…».
  'apps/mobile/assets/images/logo-full.png': 'Logo de login, registro y recuperar contraseña: se muestra antes de tener sesión y tiene que verse sin conexión.',
  // Esta línea sirve para incluir el texto o las clases «apps/mobile/assets/images/brand-wordmark.png…».
  'apps/mobile/assets/images/brand-wordmark.png': 'Wordmark de la animación de apertura (brand-intro) y de la tarjeta de marca de Inicio: primer cuadro al abrir la app, debe estar disponible al instante y offline.',
  // Esta línea sirve para incluir el texto o las clases «apps/mobile/assets/images/logo.png…».
  'apps/mobile/assets/images/logo.png': 'Isotipo del panel admin y del header web de la app: marca fija de la interfaz, 13 KB; desde un CDN agregaría una descarga y parpadeo sin ahorro real.',
};

// Esta línea sirve para extraer «i» de «(args) => execFileSync('git', ['-C', ROO».
const git = (args) => execFileSync('git', ['-C', ROOT, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
// Esta línea sirve para extraer «ile» de «[...new Set(git(['ls-files', '-co', '--e».
const files = [...new Set(git(['ls-files', '-co', '--exclude-standard']).split('\n').filter(Boolean))]
  // Esta línea sirve para encadenar la operación «filter».
  .filter((f) => !SKIP_DIRS.some((d) => f.includes(d)));

// Esta línea sirve para extraer «ediaFile» de «files.filter((f) => IMAGE_EXT.has(extnam».
const mediaFiles = files.filter((f) => IMAGE_EXT.has(extname(f).toLowerCase()) || VIDEO_EXT.has(extname(f).toLowerCase()));
// Solo código de las apps: una mención en .claude/, .scratch/ o docs no hace
// que un archivo entre en un bundle.
// Esta línea sirve para extraer «extFile» de «files.filter((f) => TEXT_EXT.has(extname».
const textFiles = files.filter((f) => TEXT_EXT.has(extname(f).toLowerCase()) && /^(apps|packages)\//.test(f));
// Esta línea sirve para declarar «textCache» con el valor «new Map()».
const textCache = new Map();
// Esta línea sirve para declarar «readText» con el valor «(f) => {».
const readText = (f) => {
  // Esta línea sirve para revisar si «!textCache.has(f)».
  if (!textCache.has(f)) {
    // Esta línea sirve para guardar el texto del archivo en caché o vacío si no se puede leer.
    try { textCache.set(f, readFileSync(join(ROOT, f), 'utf8')); } catch { textCache.set(f, ''); }
  }
  // Esta línea sirve para devolver «textCache.get(f)».
  return textCache.get(f);
};

// Esta línea sirve para declarar «moduleOf» con el valor «(f) => {».
const moduleOf = (f) => {
  // Esta línea sirve para recorrer las apps que pueden usar el archivo.
  for (const m of ['apps/mobile', 'apps/web', 'apps/api', 'packages/core']) if (f.startsWith(`${m}/`)) return m;
  // Esta línea sirve para devolver «f.split('/')[0]».
  return f.split('/')[0];
};

// Esta línea sirve para declarar la función «findReferences».
function findReferences(file) {
  // RN resuelve home@2x.png/home@3x.png a partir de require('home.png').
  // Esta línea sirve para extraer «eedl» de «basename(file).replace(/@\d+x(?=\.)/, ''».
  const needle = basename(file).replace(/@\d+x(?=\.)/, '');
  // Esta línea sirve para extraer «ef» de «[]».
  const refs = [];
  // Esta línea sirve para recorrer los elementos con «const t of textFiles».
  for (const t of textFiles) {
    // Esta línea sirve para extraer «ex» de «readText(t)».
    const text = readText(t);
    // Esta línea sirve para saltar los archivos que no mencionan el nombre buscado.
    if (!text.includes(needle)) continue;
    // Esta línea sirve para recorrer cada línea del archivo.
    text.split('\n').forEach((line, i) => {
      // Esta línea sirve para llamar a «refs.push» si «line.includes(needle)».
      if (line.includes(needle)) refs.push({ file: t, line: i + 1 });
    });
  }
  // Esta línea sirve para devolver «refs».
  return refs;
}

// Esta línea sirve para declarar la función «classify».
function classify(file, refs) {
  // Esta línea sirve para extraer «x» de «extname(file).toLowerCase()».
  const ext = extname(file).toLowerCase();
  // Esta línea sirve para extraer «in» de «VIDEO_EXT.has(ext) ? 'video' : 'image'».
  const kind = VIDEO_EXT.has(ext) ? 'video' : 'image';
  // Esta línea sirve para extraer «romExpoConfi» de «refs.some((r) => /(^|\/)app\.json$|app\.».
  const fromExpoConfig = refs.some((r) => /(^|\/)app\.json$|app\.config\.(js|ts)$/.test(r.file));
  // Esta línea sirve para extraer «romSourc» de «refs.filter((r) => !/\.md$/.test(r.file)».
  const fromSource = refs.filter((r) => !/\.md$/.test(r.file) && !/(^|\/)app\.json$/.test(r.file));

  // Esta línea sirve para revisar si «file.startsWith('.scratch/')».
  if (file.startsWith('.scratch/')) {
    // Esta línea sirve para marcar como no candidato porque es una captura de desarrollo.
    return { type: kind, candidate: false, reason: 'Captura de desarrollo: no la usa ninguna app ni entra en ningún bundle.', neededAtBuild: false, neededForNative: false };
  }
  // Esta línea sirve para revisar si «fromExpoConfig».
  if (fromExpoConfig) {
    // Esta línea sirve para marcar como no candidato porque lo referencia app.json.
    return { type: 'native', candidate: false, reason: 'Referenciado por app.json (ícono, adaptive icon, splash o favicon): Expo lo necesita durante el build y Android/iOS lo empaquetan como recurso nativo.', neededAtBuild: true, neededForNative: true };
  }
  // Esta línea sirve para revisar si «file.startsWith('apps/web/public/')».
  if (file.startsWith('apps/web/public/')) {
    // Esta línea sirve para marcar como no candidato porque lo sirve el hosting de la web.
    return { type: kind, candidate: false, reason: 'Lo sirve el hosting de la web (no va en el APK): favicon y marca de la interfaz, conviene que no dependan de un tercero.', neededAtBuild: false, neededForNative: false };
  }
  // Esta línea sirve para revisar si «file.startsWith('apps/api/public/')».
  if (file.startsWith('apps/api/public/')) {
    // Esta línea sirve para marcar como no candidato porque es el favicon del backend.
    return { type: kind, candidate: false, reason: 'Favicon del backend Laravel.', neededAtBuild: false, neededForNative: false };
  }
  // Esta línea sirve para revisar si «KEEP_LOCAL[file]».
  if (KEEP_LOCAL[file]) {
    // Esta línea sirve para marcar como no candidato por el motivo de la lista de locales.
    return { type: kind, candidate: false, reason: KEEP_LOCAL[file], neededAtBuild: true, neededForNative: false };
  }
  // Esta línea sirve para revisar si «fromSource.length === 0».
  if (fromSource.length === 0) {
    // Esta línea sirve para marcar como no candidato porque no tiene referencias en el código.
    return { type: kind, candidate: false, reason: 'Sin referencias en el código: Metro/Vite no lo empaquetan, así que no ocupa espacio en el APK. Revisar si se puede borrar.', neededAtBuild: false, neededForNative: false };
  }
  // Esta línea sirve para marcar como candidato a migrar a Cloudinary.
  return { type: kind, candidate: true, reason: null, neededAtBuild: false, neededForNative: false };
}

// Esta línea sirve para declarar la función «proposedDestination».
function proposedDestination(file, type) {
  // Esta línea sirve para extraer «am» de «basename(file, extname(file)).replace(/@».
  const name = basename(file, extname(file)).replace(/@\d+x$/, '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
  // Esta línea sirve para extraer «olde» de «type === 'video' ? 'sanken/content/video».
  const folder = type === 'video' ? 'sanken/content/videos' : file.includes('/assets/images/') || file.includes('/public/') ? 'sanken/branding' : 'sanken/content';
  // Esta línea sirve para devolver «{ folder, publicId: `${folder}/${name}` }».
  return { folder, publicId: `${folder}/${name}` };
}

// Esta línea sirve para declarar «entries» con el valor «mediaFiles.map((file) => {».
const entries = mediaFiles.map((file) => {
  // Esta línea sirve para extraer «ef» de «findReferences(file)».
  const refs = findReferences(file);
  // Esta línea sirve para declarar «c» con el valor «classify(file, refs)».
  const c = classify(file, refs);
  // Esta línea sirve para extraer «es» de «proposedDestination(file, c.type)».
  const dest = proposedDestination(file, c.type);
  // Esta línea sirve para devolver «{».
  return {
    // Esta línea sirve para declarar la propiedad «file» con el valor o tipo «basename(file)».
    file: basename(file),
    // Esta línea sirve para declarar la propiedad «path» con el valor o tipo «file».
    path: file,
    // Esta línea sirve para declarar la propiedad «bytes» con el valor o tipo «statSync(join(ROOT, file)).size».
    bytes: statSync(join(ROOT, file)).size,
    // Esta línea sirve para declarar la propiedad «extension» con el valor o tipo «extname(file).slice(1).toLowerCase()».
    extension: extname(file).slice(1).toLowerCase(),
    // Esta línea sirve para declarar la propiedad «type» con el valor o tipo «c.type».
    type: c.type,
    // Esta línea sirve para declarar la propiedad «module» con el valor o tipo «moduleOf(file)».
    module: moduleOf(file),
    // Esta línea sirve para declarar la propiedad «referenceCount» con el valor o tipo «refs.length».
    referenceCount: refs.length,
    // Esta línea sirve para declarar la propiedad «references» con el valor o tipo «refs.map((r) => `${r.file}:${r.line}`)».
    references: refs.map((r) => `${r.file}:${r.line}`),
    // Esta línea sirve para declarar la propiedad «migrate» con el valor o tipo «c.candidate».
    migrate: c.candidate,
    // Esta línea sirve para declarar la propiedad «reasonNotMigrated» con el valor o tipo «c.reason».
    reasonNotMigrated: c.reason,
    // Esta línea sirve para declarar la propiedad «proposedCloudinaryFolder» con el valor o tipo «dest.folder».
    proposedCloudinaryFolder: dest.folder,
    // Esta línea sirve para declarar la propiedad «proposedPublicId» con el valor o tipo «dest.publicId».
    proposedPublicId: dest.publicId,
    // Esta línea sirve para declarar la propiedad «_neededAtBuild» con el valor o tipo «c.neededAtBuild».
    _neededAtBuild: c.neededAtBuild,
    // Esta línea sirve para declarar la propiedad «_neededForNative» con el valor o tipo «c.neededForNative».
    _neededForNative: c.neededForNative,
  };
// Esta línea sirve para ordenar el inventario por ruta.
}).sort((a, b) => a.path.localeCompare(b.path));

// Esta línea sirve para extraer «u» de «(list) => list.reduce((acc, e) => acc + ».
const sum = (list) => list.reduce((acc, e) => acc + e.bytes, 0);
// Esta línea sirve para declarar «images» con el valor «entries.filter((e) => e.type !== 'video')».
const images = entries.filter((e) => e.type !== 'video');
// Esta línea sirve para declarar «videos» con el valor «entries.filter((e) => e.type === 'video')».
const videos = entries.filter((e) => e.type === 'video');
// Esta línea sirve para extraer «obileBundle» de «entries.filter((e) => e.module === 'apps».
const mobileBundled = entries.filter((e) => e.module === 'apps/mobile' && (e.referenceCount > 0));
// Esta línea sirve para declarar «candidates» con el valor «entries.filter((e) => e.migrate)».
const candidates = entries.filter((e) => e.migrate);

// Esta línea sirve para declarar «inventory» con el valor «{».
const inventory = {
  // Esta línea sirve para declarar la propiedad «generatedAt» con el valor o tipo «new Date().toISOString()».
  generatedAt: new Date().toISOString(),
  // Esta línea sirve para definir la propiedad «note» con «Archivos multimedia del repositorio. El …».
  note: 'Archivos multimedia del repositorio. El multimedia de runtime subido por usuarios/admins vive en el servidor y se audita con `php artisan media:cloudinary status`.',
  // Esta línea sirve para declarar la propiedad «totals» con el valor o tipo «{».
  totals: {
    // Esta línea sirve para declarar la propiedad «images» con el valor o tipo «images.length».
    images: images.length,
    // Esta línea sirve para declarar la propiedad «videos» con el valor o tipo «videos.length».
    videos: videos.length,
    // Esta línea sirve para declarar la propiedad «imageBytes» con el valor o tipo «sum(images)».
    imageBytes: sum(images),
    // Esta línea sirve para declarar la propiedad «videoBytes» con el valor o tipo «sum(videos)».
    videoBytes: sum(videos),
    // Esta línea sirve para declarar la propiedad «mobileBundledBytes» con el valor o tipo «sum(mobileBundled)».
    mobileBundledBytes: sum(mobileBundled),
    // Esta línea sirve para declarar la propiedad «migrationCandidates» con el valor o tipo «candidates.length».
    migrationCandidates: candidates.length,
    // Esta línea sirve para definir «bytesThatCouldLeaveTheApk» con «sum(candidates.filter((e) => e.module ==…».
    bytesThatCouldLeaveTheApk: sum(candidates.filter((e) => e.module === 'apps/mobile')),
    // Esta línea sirve para declarar la propiedad «notMigratable» con el valor o tipo «entries.length - candidates.length».
    notMigratable: entries.length - candidates.length,
  },
  // Esta línea sirve para declarar la propiedad «runtimeMediaOnServer» con el valor o tipo «{».
  runtimeMediaOnServer: {
    // Esta línea sirve para definir la propiedad «description» con «Columnas de la base que guardan multimed…».
    description: 'Columnas de la base que guardan multimedia subido (migradas por media:cloudinary).',
    // Esta línea sirve para declarar la propiedad «columns» con el valor o tipo «[».
    columns: [
      // Esta línea sirve para agregar un elemento cuyo «column» es «'users.avatar_url', cloudinaryFolder: 's…».
      { column: 'users.avatar_url', cloudinaryFolder: 'sanken/users/avatars', publicId: 'user_{id}' },
      // Esta línea sirve para agregar un elemento cuyo «column» es «'products.image', cloudinaryFolder: 'san…».
      { column: 'products.image', cloudinaryFolder: 'sanken/store/products', publicId: 'product_{id}' },
      // Esta línea sirve para agregar un elemento cuyo «column» es «'exercises.video_url', cloudinaryFolder:…».
      { column: 'exercises.video_url', cloudinaryFolder: 'sanken/exercises/videos', publicId: 'exercise_{id}' },
      // Esta línea sirve para agregar un elemento cuyo «column» es «'exercises.image_url', cloudinaryFolder:…».
      { column: 'exercises.image_url', cloudinaryFolder: 'sanken/exercises/images', publicId: 'exercise_{id}' },
      // Esta línea sirve para agregar un elemento cuyo «column» es «'pr_submissions.video_url', cloudinaryFo…».
      { column: 'pr_submissions.video_url', cloudinaryFolder: 'sanken/pr-submissions/videos', publicId: 'submission_{id}' },
      // Esta línea sirve para agregar un elemento cuyo «column» es «'news_promotions.image_url', cloudinaryF…».
      { column: 'news_promotions.image_url', cloudinaryFolder: 'sanken/content/news', publicId: 'news_{id}' },
      // Esta línea sirve para agregar un elemento cuyo «column» es «'body_measurements.progress_photo_url', …».
      { column: 'body_measurements.progress_photo_url', cloudinaryFolder: 'sanken/users/progress-photos', publicId: 'measurement_{id}' },
      // Esta línea sirve para agregar un elemento cuyo «column» es «'user_profiles.avatar_url', cloudinaryFo…».
      { column: 'user_profiles.avatar_url', cloudinaryFolder: 'sanken/users/avatars', publicId: 'profile_{id}' },
    ],
  },
  // Esta línea sirve para definir «files» con «entries.map(({ _neededAtBuild, _neededFo…».
  files: entries.map(({ _neededAtBuild, _neededForNative, ...e }) => e),
};

// Esta línea sirve para declarar «localRequired» con el valor «entries.filter((e) => !e.migrate).map((e) => ({».
const localRequired = entries.filter((e) => !e.migrate).map((e) => ({
  // Esta línea sirve para declarar la propiedad «file» con el valor o tipo «e.path».
  file: e.path,
  // Esta línea sirve para declarar la propiedad «module» con el valor o tipo «e.module».
  module: e.module,
  // Esta línea sirve para declarar la propiedad «reason» con el valor o tipo «e.reasonNotMigrated».
  reason: e.reasonNotMigrated,
  // Esta línea sirve para declarar la propiedad «neededAtBuild» con el valor o tipo «e._neededAtBuild».
  neededAtBuild: e._neededAtBuild,
  // Esta línea sirve para declarar la propiedad «neededForAndroidIos» con el valor o tipo «e._neededForNative».
  neededForAndroidIos: e._neededForNative,
  // Esta línea sirve para declarar la propiedad «keepLocalRecommended» con el valor o tipo «true».
  keepLocalRecommended: true,
}));

// Esta línea sirve para escribir el inventario de medios en un JSON.
writeFileSync(join(OUT_DIR, 'media-inventory.json'), `${JSON.stringify(inventory, null, 2)}\n`);
// Esta línea sirve para escribir la lista de archivos que deben quedar locales.
writeFileSync(join(OUT_DIR, 'local-assets-required.json'), `${JSON.stringify(localRequired, null, 2)}\n`);

// Esta línea sirve para declarar «kb» con el valor «(n) => `${(n / 1024).toFixed(1)} KB`».
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
// Esta línea sirve para mostrar el total de imágenes y videos.
console.log(`Imágenes: ${images.length} (${kb(sum(images))})  ·  Videos: ${videos.length} (${kb(sum(videos))})`);
// Esta línea sirve para mostrar lo empaquetado en el móvil.
console.log(`Empaquetado en el móvil (referenciado): ${kb(sum(mobileBundled))}`);
// Esta línea sirve para mostrar los candidatos a Cloudinary.
console.log(`Candidatos a Cloudinary en el repo: ${candidates.length} (${kb(sum(candidates))})`);
// Esta línea sirve para mostrar los que se quedan locales.
console.log(`Se quedan locales: ${localRequired.length}`);
// Esta línea sirve para recorrer los elementos con «const e of entries».
for (const e of entries) {
  // Esta línea sirve para mostrar cada archivo marcado como migrar o local.
  console.log(`  ${e.migrate ? 'MIGRAR' : 'local '}  ${kb(e.bytes).padStart(9)}  ${e.path}  (${e.referenceCount} refs)`);
}
// Esta línea sirve para mostrar dónde se escribieron los archivos del inventario.
console.log('\nEscrito: scripts/cloudinary/media-inventory.json, scripts/cloudinary/local-assets-required.json');
