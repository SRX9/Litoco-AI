/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/srx9/litoco",
        permanent: false,
      },
    ];
  },
};
