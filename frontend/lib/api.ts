import axios from "axios";

const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

const API_URL = typeof window !== "undefined"
  ? ""
  : (apiUrl || "");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;
