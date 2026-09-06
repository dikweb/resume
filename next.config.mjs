/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/resume",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
