/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://headless-front-end.vercel.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://headless-front-end.vercel.app'}/server-sitemap.xml`,
    ],
  },
}
