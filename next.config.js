/** @type {import('next').NextConfig} */
const nextConfig = {
  // Статичний експорт
  output: 'export',

  // Оптимізація зображень
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Для static export
    unoptimized: true,
  },

  // Оптимізація компіляції (swcMinify за замовчуванням в Next.js 15)
  
  // Кешування
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Оптимізація бандлів
  webpack: (config, { dev, isServer }) => {
    // Оптимізація для production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      }
    }

    // Оптимізація іконок
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },

  // Headers для кешування
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Оптимізація CSS
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Оптимізація TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // Оптимізація ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Оптимізація для PWA (якщо потрібно)
  // pwa: {
  //   dest: 'public',
  //   register: true,
  //   skipWaiting: true,
  // },

  // Оптимізація для мобільних пристроїв
  poweredByHeader: false,
  
  // Оптимізація для CDN
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Оптимізація для SEO
  trailingSlash: false,
  
  // Оптимізація для швидкості
  compress: true,
  
  // Оптимізація для розробки
  reactStrictMode: true,
  
  // Оптимізація для production
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig 