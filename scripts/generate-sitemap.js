// scripts/generate-sitemap.js
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Your website URL - MAKE SURE THIS IS CORRECT
const SITE_URL = 'https://slateacademy.com'; // NO trailing slash!

// Define your routes
const staticRoutes = [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/courses', priority: 0.9, changefreq: 'daily' },
    { path: '/portfolio', priority: 0.8, changefreq: 'weekly' },
    { path: '/support', priority: 0.7, changefreq: 'weekly' },
    { path: '/ai-chat', priority: 0.7, changefreq: 'weekly' },
];

const generateSitemap = () => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        staticRoutes.forEach(route => {
            const url = `${SITE_URL}${route.path}`;
            sitemap += `
  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
        });

        sitemap += `
</urlset>`;

        // Ensure public directory exists
        const publicDir = resolve(process.cwd(), 'public');
        mkdirSync(publicDir, { recursive: true });

        // Write the file
        const sitemapPath = resolve(publicDir, 'sitemap.xml');
        writeFileSync(sitemapPath, sitemap);

        console.log('✅ Sitemap generated successfully!');
        console.log(`📍 File location: ${sitemapPath}`);
        console.log(`📍 Sitemap URL: ${SITE_URL}/sitemap.xml`);
    } catch (error) {
        console.error('❌ Error generating sitemap:', error.message);
    }
};

generateSitemap();