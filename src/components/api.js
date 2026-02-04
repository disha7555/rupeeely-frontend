import axios from "axios";
import { jwtDecode } from "jwt-decode";
import helperConfig from "./helperConfig";
const url = helperConfig();
function isTokenExpired(token) {
  if (!token) return true;

  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}
export async function apiRequest(config) {
  
  try {
    const token = localStorage.getItem("accesstoken");
    
    if (isTokenExpired(token)) {
      console.log("Token expired, refreshing...");
      const refreshRes = await axios.post(
        url + "/api/auth/refresh",
        {},
        { withCredentials: true }
      );

      localStorage.setItem("accesstoken", refreshRes.data.accessToken);
      console.log("Token refreshed");
    }

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
    };

    return axios(config);
  } catch (err) {
    console.log("API Request error:", err.response?.data || err.message);
    throw err;
  }
}
