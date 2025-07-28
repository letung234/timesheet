export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '3600s',

    secretRefreshToken: process.env.JWT_REFRESH_SECRET,
    expiresInRefreshToken: process.env.JWT_REFRESH_EXPIRES_IN,
  },
});
