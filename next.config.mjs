/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export so the site can be hosted anywhere (GitHub Pages, S3, Netlify…).
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
