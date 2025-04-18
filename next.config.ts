/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    // Other configurations like image optimization for Cloudflare
    images: {
        unoptimized: true,
    },
}

module.exports = nextConfig