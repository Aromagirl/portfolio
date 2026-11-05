import { createReadStream } from 'node:fs';
import { copyFile, mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { previewCache } from '../utils/image-previews.mjs';

const mime = { '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.avif': 'image/avif' };
const mediaMime = { ...mime, '.pdf': 'application/pdf' };

async function screenshotPreview(file) {
  const image = sharp(file);
  const { width, height } = await image.metadata();
  const mobile = /homepage-mobile(?:-full)?\.[^.]+$/i.test(file);
  const cropHeight = Math.min(height, Math.round(width * (mobile ? 844 / 390 : 3 / 4)));
  return image.extract({ left: 0, top: 0, width, height: cropHeight })
    .resize({ width: mobile ? 390 : 1200, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
}

// Company media lives beside index.md; project media beside projects/<slug>/<slug>.md.
// Public image URLs stay unchanged when the editable content folders move.
export default function projectImages() {
  let companiesRoot;
  let base;
  return {
    name: 'project-images',
    hooks: {
      'astro:config:done': ({ config }) => {
        companiesRoot = fileURLToPath(new URL('src/content/companies/', config.root));
        base = config.base.replace(/\/$/, '');
      },
      'astro:server:setup': ({ server }) => {
        server.middlewares.use(async (request, response, next) => {
          let pathname;
          try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
          catch { return next(); }
          if (base && pathname.startsWith(base + '/')) pathname = pathname.slice(base.length);
          if (/^\/images\/previews\/[a-f0-9]{24}\.webp$/.test(pathname) && ['GET', 'HEAD'].includes(request.method)) {
            try {
              const file = join(previewCache, pathname.split('/').at(-1));
              const info = await stat(file);
              response.setHeader('Content-Type', 'image/webp');
              response.setHeader('Content-Length', info.size);
              response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
              if (request.method === 'HEAD') return response.end();
              return createReadStream(file).on('error', error => response.destroy(error)).pipe(response);
            } catch (error) { if (error.code !== 'ENOENT') return next(error); return next(); }
          }
          const match = pathname.match(/^\/(images|documents)\/projects\/([a-z0-9-]+)\/(.+)$/);
          if (!match || !['GET', 'HEAD'].includes(request.method)) return next();
          const extension = extname(match[3]).toLowerCase();
          if (match[1] === 'documents' ? extension !== '.pdf' : !mime[extension]) return next();
          const companyRoot = resolve(companiesRoot, match[2]);
          const parts = match[3].split('/');
          const preview = parts.at(-2) === '.previews' && /\.webp$/i.test(parts.at(-1)) && ['before', 'after'].includes(parts.at(-3));
          if (preview) { parts.splice(-2, 1); parts[parts.length - 1] = parts.at(-1).slice(0, -5); }
          const mediaRoot = parts.length > 1 ? join(companyRoot, 'projects') : companyRoot;
          const file = resolve(mediaRoot, ...parts);
          if (!file.startsWith(mediaRoot + sep)) return next();
          try {
            const info = await stat(file);
            if (!info.isFile()) return next();
            if (preview) {
              const buffer = await screenshotPreview(file);
              response.setHeader('Content-Type', 'image/webp');
              response.setHeader('Content-Length', buffer.length);
              response.setHeader('Cache-Control', 'no-cache');
              return response.end(request.method === 'HEAD' ? undefined : buffer);
            }
            response.setHeader('Content-Type', mediaMime[extname(file).toLowerCase()] ?? 'application/octet-stream');
            response.setHeader('Content-Length', info.size);
            response.setHeader('Cache-Control', 'no-cache');
            if (request.method === 'HEAD') return response.end();
            createReadStream(file).on('error', error => response.destroy(error)).pipe(response);
          } catch (error) {
            if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return next();
            next(error);
          }
        });
      },
      'astro:build:done': async ({ dir }) => {
        try {
          const destination = join(fileURLToPath(dir), 'images', 'previews');
          await mkdir(destination, { recursive: true });
          for (const name of await readdir(previewCache)) {
            if (/^[a-f0-9]{24}\.webp$/.test(name)) await copyFile(join(previewCache, name), join(destination, name));
          }
        } catch (error) { if (error.code !== 'ENOENT') throw error; }
        async function copyMedia(source, target, documentTarget, recursive = false) {
          for (const entry of await readdir(source, { withFileTypes: true })) {
            if (entry.isDirectory() && recursive) {
              await copyMedia(join(source, entry.name), join(target, entry.name), join(documentTarget, entry.name), true);
            } else if (entry.isFile() && mediaMime[extname(entry.name).toLowerCase()]) {
              const isPdf = extname(entry.name).toLowerCase() === '.pdf';
              const destination = isPdf ? documentTarget : target;
              await mkdir(destination, { recursive: true });
              await copyFile(join(source, entry.name), join(destination, entry.name));
              if (!isPdf && ['before', 'after'].includes(source.split(sep).at(-1))) {
                const previewDir = join(target, '.previews');
                await mkdir(previewDir, { recursive: true });
                await writeFile(join(previewDir, `${entry.name}.webp`), await screenshotPreview(join(source, entry.name)));
              }
            }
          }
        }
        for (const company of await readdir(companiesRoot, { withFileTypes: true })) {
          if (!company.isDirectory()) continue;
          const source = join(companiesRoot, company.name);
          const target = join(fileURLToPath(dir), 'images', 'projects', company.name);
          const documentTarget = join(fileURLToPath(dir), 'documents', 'projects', company.name);
          await copyMedia(source, target, documentTarget);
          const projects = join(source, 'projects');
          try { await stat(projects); }
          catch (error) { if (error.code === 'ENOENT') continue; throw error; }
          await copyMedia(projects, target, documentTarget, true);
        }
      },
    },
  };
}
