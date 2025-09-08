const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    // Force metadata to render in head instead of streaming to body
    htmlLimitedBots: /.*/,
    // Other configurations like image optimization for Cloudflare
    images: {
        unoptimized: true,
    },
    // Note: Security headers should be configured at the hosting level (Cloudflare Pages)
    // since they don't work with static export. Recommended headers:
    // X-Frame-Options: DENY
    // X-Content-Type-Options: nosniff
    // Referrer-Policy: strict-origin-when-cross-origin
    // Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';
    // Performance optimizations
    // Note: optimizeCss experimental feature causes build issues with static export
}

module.exports = withBundleAnalyzer(nextConfig);