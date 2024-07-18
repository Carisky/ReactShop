import React from "react";
import style from "./style.module.css";

export default function ProductPreview({ item, updateCartItemQuantity, handleRemoveItem }) {
  const increaseQuantity = () => {
    updateCartItemQuantity(item.productId, item.quantity + 1);
  };

  const decreaseQuantity = () => {
    if (item.quantity > 1) {
      updateCartItemQuantity(item.productId, item.quantity - 1);
    } else {
      handleRemoveItem(item.productId);
    }
  };

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
          <div className={style.buttons}>
            <button onClick={decreaseQuantity}>-</button>
            <button onClick={increaseQuantity}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}
