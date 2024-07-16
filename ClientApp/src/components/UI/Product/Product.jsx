import React from "react";
import { Link } from "react-router-dom";
import style from "./style.module.css";

const Product = ({ product }) => {
  return (
    <div className={style.product} key={product.id}>
      <Link to={`/products/${product.id}`}>
        <img
          className={style.image}
          src={`ProductImages/${product.imageUrl}`}
          alt={product.name}
        />
      </Link>
      <div>
        {product.name} - ${product.price}
      </div>
    </div>
  );
};

export default Product;
