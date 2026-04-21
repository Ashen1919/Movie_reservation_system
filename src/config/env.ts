import dotenv from 'dotenv';

// configure environment variables
dotenv.config();

export const env = {
  databaseUrl: process.env.DATABASE_URL!,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  adminEmail: process.env.ADMIN_SEED_EMAIL!,
  adminPassword: process.env.ADMIN_SEED_PASSWORD!,
  port: process.env.PORT || '3000',
};