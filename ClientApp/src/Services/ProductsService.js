import axios from 'axios';

class ProductsService {
  static apiLinks = {
    products: '/products',
    images: '/ProductImages'
  };

  static async fetchProducts() {
    try {
      const response = await axios.get(this.apiLinks.products);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error; 
    }
  }

  static async fetchProductDetails(productId) {
    try {
      const response = await axios.get(`${this.apiLinks.products}/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error; 
    }
  }
}

export default ProductsService;