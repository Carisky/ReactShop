import React from "react";
import ProductsGrid from "../ProductsGrid/ProductsGrid";
import RecommendedProductsGrid from "../RecommendedProductsGrid/RecommendedProductsGrid";

export default function Home() {

  return (
    <div>
      <h2>Products</h2>
      <ProductsGrid/>
      <RecommendedProductsGrid/>
      
    </div>
  );
}
