/**
 * PM2 ecosystem — BidIntelligenceOS (API + built SPA on :5001).
 *
 * Start:   pm2 start deploy/ecosystem.config.cjs
 * Restart: pm2 restart bid-intelligence-os
 * Deploy:  ./deploy/deploy.sh
 */
module.exports = {
  apps: [
    {
      name: "bid-intelligence-os",
      cwd: "/home/ubuntu/projects/bid-intelligence-os",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        API_PORT: "5001",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 3000,
    },
  ],
};
