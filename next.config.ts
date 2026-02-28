import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* allow images from external hosts used in product data */
  images: {
    domains: [
      "www.marcellinaincucina.com",
      "www.hotbreads.co.in",
      // add other hosts as needed
    ],
  },
};

export default nextConfig;
