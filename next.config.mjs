/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['upload.wikimedia.org'], // Specific domains
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // Allows ALL external images
            },
        ],
    },
};

export default nextConfig;
