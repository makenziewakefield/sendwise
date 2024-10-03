import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = (token) => {
  try {
    if (!token) {
      console.error("No token provided");
      return null;
    }
    const decodedToken = jwtDecode(token);
    console.log("Decoded token:", decodedToken); // Add this line
    if (!decodedToken || !decodedToken.user || !decodedToken.user.id) {
      console.error("Invalid token structure:", decodedToken);
      return null;
    }
    return decodedToken.user.id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};