export default () => ({
  app: {
    name: process.env.APP_NAME || 'MyApp',
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
    url_client: process.env.URL_CLIENT,
  },
});
