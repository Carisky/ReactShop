import React from "react";
import style from "./style.module.css";
export default function ProductPreview({ item }) {
  return (
    <div>
      <div className={style.container} key={item.productId}>
        <img
          className={style.image}
          src={`ProductImages/${item.product.imageUrl}`}
        />
        <div className={style.description}>
          <div>name : {item.product?.name || "Product Name Not Found"}</div>
          <div>quantity : {item.quantity}</div>
          <div>
            price :{" "}
            {item.product?.price
              ? `$${item.product.price}`
              : "Price Not Available"}
          </div>
        </div>
      </div>
    </div>
  );
}
