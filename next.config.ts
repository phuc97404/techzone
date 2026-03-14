const nextConfig = {
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "images.unsplash.com",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: "plus.unsplash.com",
  //     },
  //   ],
  // },
  images: {
    remotePatterns: [
      {
        hostname: "*",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default nextConfig as any;
