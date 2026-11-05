import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { projectPath, workSectionPath } from '../utils/work';
import { withBase } from '../utils/paths';
import { isProjectIndexable, isSectionIndexable } from '../utils/seo';

export const GET: APIRoute = async ({ site }) => {
  const projects = await getCollection('projects');
  const sections = await getCollection('workSections');
  const pages = await getCollection('pages', ({ data }) => data.status === 'published');
  const routes = new Set([
    '/', '/work/',
    ...projects.filter(isProjectIndexable).map(projectPath),
    ...sections.flatMap(section => {
      const project = projects.find(project => project.id === section.data.project.id);
      if (!project) throw new Error(`Missing project for ${section.id}`);
      return isSectionIndexable(section, project) ? [workSectionPath(project, section)] : [];
    }),
    ...pages.map(page => page.id === 'home' ? '/' : `/${page.id === 'about-me' ? 'about' : page.id}/`),
  ]);
  const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
  const urls = [...routes].map(route => `<url><loc>${escape(new URL(withBase(route), site).href)}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
