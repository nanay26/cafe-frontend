/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ["seborrheic-kiara-unchlorinated.ngrok-free.dev"],
  },
  async rewrites() {
    return [
      {
        // 1. Jalur Chat (Kita buang /api-nya karena controller NestJS kakak cuma @Controller('chat'))
        source: '/api/chat/:path*',
        destination: 'http://localhost:3001/chat/:path*',
      },
      {
        // 2. Jalur Menu & Orders (Tetap pakai /api karena sepertinya backend kakak pakai prefix /api)
        // Jalur ini menangkap selain chat
        source: '/api/:path((?!chat).*)*', 
        destination: 'http://localhost:3001/api/:path*',
      },
      {
        // 3. Jalur Gambar
        source: '/public/:path*',
        destination: 'http://localhost:3001/public/:path*',
      },
    ];
  },
};

export default nextConfig;