/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://sweetnsugary.in', // User's domain (or placeholder)
    generateRobotsTxt: true, // (optional)
    exclude: ['/admin', '/admin/*'], // Exclude admin routes
    // ...other options
}
