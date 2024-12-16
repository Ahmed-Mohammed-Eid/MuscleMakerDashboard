const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: 'https://api.musclemakergrillkw.net/api/v1'
    },
    images: {
        domains: ['api.musclemakergrillkw.net', 'musclemakergrillkw.net', 'api.easydietkw.com', 'localhost']
    }
};

module.exports = withNextIntl(nextConfig);
