import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import tailwindcss from '@tailwindcss/vite';
import projectImages from './src/integrations/project-images.mjs';

export default defineConfig({
  site: 'https://aromagirl.github.io',
  base: '/portfolio',
  output: 'static',
  trailingSlash: 'always',
  redirects: {
    '/work/fraudscore/ux-ui-design/': '/portfolio/work/fraudscore/fraudscore-platform/',
    '/work/myhospital/': '/portfolio/work/myhospital-app/',
    '/work/kidswearcycle/': '/portfolio/work/kidswearcycle-website/',
  },
  // Project media integration also serves the generated lightweight image previews.
  integrations: [mdx(), projectImages()],
  markdown: { processor: satteri({ features: { smartPunctuation: false } }) },
  vite: { plugins: [tailwindcss()] },
});
