/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        OWNER: process.env.OWNER,
        SECRET_KEY: process.env.SECRET_KEY,
        PRICE: process.env.PRICE,
    },
};

module.exports = nextConfig;
