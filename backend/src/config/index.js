require('dotenv').config();

const requireEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

module.exports = {
  mongoUri: requireEnv('MONGODB_URI'),
  jwtSecret: requireEnv('JWT_SECRET'),
  port: process.env.PORT || 3001,
};
