import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.clerk.accounts.dev *.stripe.com *.posthog.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: *.clerk.com *.uploadthing.com images.unsplash.com",
      "connect-src 'self' *.openai.com *.clerk.accounts.dev *.stripe.com api.adzuna.com *.posthog.com *.sentry.io *.uploadthing.com *.ingest.uploadthing.com",
      "frame-src *.stripe.com",
      "font-src 'self' data:",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
