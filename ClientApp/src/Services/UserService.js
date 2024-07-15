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

  static isExpired() {
    const token = localStorage.getItem(this.key);
    const decodedToken = parseJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);


    if (decodedToken.exp > currentTime) {
      return false;
    }else return true
  }

  static isAdmin() {
    const token = localStorage.getItem(this.key);
    if (!token) return false;
    if(!this.isExpired){
      return false
    }
    
    const decodedToken = parseJwt(token);
    return decodedToken.role === "Admin";
  }

  static async validateAdmin() {
    const token = this.getUser();
    if (!token) throw new Error("No token found");
    let options = {}
    options.headers = {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    const response = await fetch("/admin/validation/",options);
    if (!response.ok) {
      return false
    }return true


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
