import React from 'react';
import { useDispatch } from 'react-redux';
import style from './style.module.css';
import { updateItemQuantity, removeItem } from '../../../redux/cartSlice';

export default function ProductPreview({ item }) {
  const dispatch = useDispatch();

  const increaseQuantity = () => {
    dispatch(updateItemQuantity({ productId: item.productId, quantity: item.quantity + 1 }));
  };

  const decreaseQuantity = () => {
    if (item.quantity > 1) {
      dispatch(updateItemQuantity({ productId: item.productId, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeItem({ productId: item.productId }));
    }
  };

  return (
    <div className={style.container} key={item.productId}>
      <img
        className={style.image}
        src={`ProductImages/${item.product?.imageUrl || 'default-image.jpg'}`} 
        alt={item.product?.name || 'Product Image'}
      />
      <div className={style.description}>
        <div>Name: {item.product?.name || 'Product Name Not Found'}</div>
        <div>Quantity: {item.quantity}</div>
        <div>
          Price: {item.product?.price ? `$${item.product.price}` : 'Price Not Available'}
        </div>
        <div className={style.buttons}>
          <button onClick={decreaseQuantity}>-</button>
          <button onClick={increaseQuantity}>+</button>
        </div>
      </div>
    </div>
  );
}
