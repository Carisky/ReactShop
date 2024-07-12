const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['/products','/recommendedproducts','/auth/login',"/auth/admin-only"],
    createProxyMiddleware({
      target: 'https://localhost:7200', 
      changeOrigin: true,
      secure: false,
    })
  );
};