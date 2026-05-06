
import { jwtDecode } from "jwt-decode";

export const getTipoFromToken = () => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.tipo || null;
  } catch (error) {
    console.error("Error decoding token", error);
    return null;
  }
};

