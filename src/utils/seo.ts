import type { CollectionEntry } from 'astro:content';

export const isProjectIndexable = (project: CollectionEntry<'projects'>) =>
  project.data.status === 'published' && project.data.visibility === 'public';

export const isSectionIndexable = (section: CollectionEntry<'workSections'>, project: CollectionEntry<'projects'>) =>
  isProjectIndexable(project) && section.data.status === 'published' && section.data.visibility === 'public';
