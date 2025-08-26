const nextConfig = {
  // Enable static export for better compatibility with PWA and Android apps
  output: 'standalone',
  
  // PWA and service worker configuration
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
  
  // Webpack configuration for better PWA support
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  
  // Asset optimization
  images: {
    unoptimized: true, // Better for PWA/Android deployment
  },
  
  // Better caching for static assets
  async rewrites() {
    return [
      {
        source: '/service-worker.js',
        destination: '/sw.js',
      },
    ];
  },
