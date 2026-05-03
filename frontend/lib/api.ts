import axios from "axios";

// Use relative URL in browser so Next.js rewrites proxy it, 
// and absolute URL on server (SSR) to bypass Next.js network stack.
const API_URL = typeof window !== "undefined" 
  ? "" 
  : (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for httpOnly cookies
});

export default api;
