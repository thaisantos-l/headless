/** @type {import('next').NextConfig} */

const BASE = (process.env.NEXT_PUBLIC_WP_BASE || '').replace(/\/+$/, '')

const WP_HOST = (() => {
  try { return new URL(process.env.NEXT_PUBLIC_WP_BASE).hostname } catch { return undefined }
})()

const remotePatterns = []
if (WP_HOST) {
  remotePatterns.push({ protocol: 'http',  hostname: WP_HOST })
  remotePatterns.push({ protocol: 'https', hostname: WP_HOST })
}

remotePatterns.push({ protocol: 'https', hostname: '**.wp.com' })       
remotePatterns.push({ protocol: 'https', hostname: '**.gravatar.com' }) 

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

 
  async rewrites() {
    if (!BASE) return []
    return [
      { source: '/wp-json/:path*',   destination: `${BASE}/wp-json/:path*` },
      { source: '/wp-content/:path*', destination: `${BASE}/wp-content/:path*` },
    ]
  },

  images: {
    remotePatterns,
  
  },
}

export default nextConfig
