import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = (token) => {
  try {
    if (!token) {
      console.error("No token provided");
      return null;
    }
    const decodedToken = jwtDecode(token);
    console.log("Decoded token:", decodedToken);
    if (!decodedToken || !decodedToken.user || !decodedToken.user.id) {
      console.error(
        "Token does not contain expected user ID structure:",
        decodedToken
      );
      return null;
    }
    return decodedToken.user.id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};