/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/blog/null",
        destination: "/blog",
        permanent: false,
      },
      {
        source: "/tools/exam-marks-needed",
        destination: "/tools/final-grade-calculator",
        permanent: true,
      },
      {
        source: "/tools/gpa-requirement-checker",
        destination: "/tools/college-university-gpa-requirement-checker",
        permanent: true,
      },
      {
        source: "/tools/gpa-requirement-checker/:slug",
        destination: "/tools/college-university-gpa-requirement-checker/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
