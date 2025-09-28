import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig: import('next').NextConfig = {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webpack: (config: any) => {
        // Bundle all CSS into a single file to avoid critical path chain
        config.optimization.splitChunks.cacheGroups = {
            ...config.optimization.splitChunks.cacheGroups,
            styles: {
                test: /\.s?css$/,
                chunks: 'all',
                enforce: true,
                name: 'styles',
            },
        };
        return config;
    },
}

export default withBundleAnalyzer(nextConfig);