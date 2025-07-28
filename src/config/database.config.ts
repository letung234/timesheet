export default () => ({
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT ?? '5432',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    db: process.env.DATABASE,
    ssl: process.env.DATABASE_SSL,
  },
});
