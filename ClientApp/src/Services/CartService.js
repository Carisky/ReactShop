class CartService {
    static key = "cart";
  
    static getCart() {
      const cart = localStorage.getItem(this.key);
      return cart ? JSON.parse(cart) : [];
    }
  
    static saveCart(cart) {
      localStorage.setItem(this.key, JSON.stringify(cart));
    }
  
    static addItem(productId, quantity) {
      const cart = this.getCart();
      const existingItem = cart.find(item => item.productId === productId);
  
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ productId, quantity });
      }
  
      this.saveCart(cart);
    }
  
    static updateItemQuantity(productId, quantity) {
      const cart = this.getCart();
      const item = cart.find(item => item.productId === productId);
  
      if (item) {
        item.quantity = quantity;
        this.saveCart(cart);
      }
    }
  
    static removeItem(productId) {
      let cart = this.getCart();
      cart = cart.filter(item => item.productId !== productId);
      this.saveCart(cart);
    }
  
    static clearCart() {
      localStorage.removeItem(this.key);
    }
  }
  
  export default CartService;
  