const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    [
      "/products",
      "/recommendedproducts",
      "/auth/login",
      "/Review/product/*",
      "/admin/articles",
      "/ProductImages",
      "/admin/validation/",
      "products/ids",
      "/Order/CheckStock",
      "/Order/CreateOrder",
      "/Review",
      "/Review/*",
    ],
    createProxyMiddleware({
      target: "https://localhost:7200",
      changeOrigin: true,
      secure: false,
    })
  );
};
