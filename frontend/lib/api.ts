import axios from "axios";

const API_URL = typeof window !== "undefined"
  ? ""
  : (process.env.NEXT_PUBLIC_API_URL)

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for httpOnly cookies
});

export default api;
