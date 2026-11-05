import { createHash } from 'node:crypto';
import { mkdir, stat } from 'node:fs/promises';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { load } from 'cheerio';
import sharp from 'sharp';

const root = resolve(process.cwd());
export const previewCache = join(root, '.astro', 'image-previews');
const metadata = new Map();
const variants = new Map();

// Resolve public URLs without moving or modifying the editable originals.
function sourceFile(src, base) {
  if (!src.startsWith('/') || src.startsWith('//')) return;
  let pathname = decodeURIComponent(src.split(/[?#]/)[0]);
  if (base && pathname.startsWith(`${base}/`)) pathname = pathname.slice(base.length);
  const match = pathname.match(/^\/images\/projects\/([a-z0-9-]+)\/(.+)$/);
  const directory = match ? join(root, 'src/content/companies', match[1]) : join(root, 'public');
  const suffix = match ? (match[2].includes('/') ? `projects/${match[2]}` : match[2]) : pathname.slice(1);
  const file = resolve(directory, suffix);
  return file.startsWith(directory + sep) ? file : undefined;
}

async function imageInfo(file) {
  const info = await stat(file);
  const key = `${file}:${info.mtimeMs}:${info.size}`;
  if (!metadata.has(key)) metadata.set(key, sharp(file).metadata().then(meta => ({ ...meta, bytes: info.size, key })));
  return metadata.get(key);
}

async function preview(file, info, width, base) {
  const key = `${info.key}:preview-v1:${width}`;
  if (!variants.has(key)) variants.set(key, (async () => {
    const name = `${createHash('sha256').update(key).digest('hex').slice(0,24)}.webp`;
    const destination = join(previewCache, name);
    try { await stat(destination); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      await mkdir(dirname(destination), { recursive: true });
      // The first frame is a poster for GIFs. Static screens keep their full aspect ratio.
      await sharp(file).resize({ width, withoutEnlargement: true }).webp({ quality: 85 }).toFile(destination);
    }
    return `${base}/images/previews/${name}`;
  })());
  return variants.get(key);
}

export async function prepareContentImages(html, base = '') {
  base = base.replace(/\/$/, '');
  const $ = load(html, {}, false);
  for (const element of $('img[src]').toArray()) {
    const img = $(element);
    const src = img.attr('src');
    const file = sourceFile(src, base);
    if (!file || !/\.(png|jpe?g|webp|avif|gif|svg)$/i.test(file)) continue;
    let info;
    try { info = await imageInfo(file); }
    catch (error) {
      // Astro-generated images and legacy public assets can have a different source path.
      if (error.code === 'ENOENT' || error.code === 'ENOTDIR') continue;
      throw error;
    }
    const { width, height } = info;
    if (!width || !height) continue;
    if (!img.attr('width') && !img.attr('height')) img.attr({ width: String(width), height: String(height) });
    else if (!img.attr('height')) img.attr('height', String(Math.round(Number(img.attr('width')) * height / width)));
    else if (!img.attr('width')) img.attr('width', String(Math.round(Number(img.attr('height')) * width / height)));
    if (extname(file).toLowerCase() === '.gif' && (info.pages ?? 1) > 1) {
      const poster = await preview(file, info, Math.min(width, 1280), base);
      img.attr('src', poster).removeAttr('srcset sizes');
      const wrapper = img.closest('.case-media');
      if (!wrapper.find('[data-animation]').length) {
        const button = $('<button>').attr({ type: 'button', class: 'animation-toggle', 'data-animation': src, 'data-poster': poster, 'aria-pressed': 'false' }).text('Play prototype animation');
        if (wrapper.length) wrapper.prepend(button);
        else if (img.parent('a').length) img.parent().before(button);
        else img.before(button);
      }
    } else if ((info.pages ?? 1) === 1 && info.bytes > 300_000 && !img.attr('srcset')) {
      const widths = [...new Set([640, 1280, 1920].map(size => Math.min(size, width)))];
      const sources = await Promise.all(widths.map(async size => `${await preview(file, info, size, base)} ${size}w`));
      // Keep src intact: existing crop and sizing rules target the original URL.
      img.attr({ srcset: sources.join(', '), sizes: '(max-width: 767px) calc(100vw - 2rem), (max-width: 1100px) calc(100vw - 4rem), 1024px' });
    }
  }
  return $.html();
}
