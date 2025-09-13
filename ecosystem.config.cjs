// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'vybermi',
      script: './build/index.js',
      time: true,
      env: {
        NODE_ENV: 'production',
        ORIGIN: 'https://vybermi.krivda.it',
        PORT: 3004
      }
    }
  ]
};
