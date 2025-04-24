/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  // API 응답 시간 늘리기
  serverRuntimeConfig: {
    apiTimeout: 60000, // 60초
  }
};

module.exports = nextConfig; 