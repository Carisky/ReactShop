class UserService {
    static key = "user";
  
    static setUser(token) {
      localStorage.setItem(this.key, token);
    }
  
    static getUser() {
      return localStorage.getItem(this.key);
    }
  
    static clearUser() {
      localStorage.removeItem(this.key);
    }
  
    static isAdmin() {
      // Example: Decode the JWT token to check roles
      const token = localStorage.getItem(this.key);
      if (!token) return false;
  
      // Decode token (example only, actual decoding depends on your JWT library)
      const decodedToken = parseJwt(token);
      return decodedToken.role === "admin";
    }
  }
  
  function parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
    
  }
  
  export default UserService;
  